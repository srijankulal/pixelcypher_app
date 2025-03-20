import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { writeFile, mkdir, readdir as readdirPromise, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import * as crypto from 'crypto';
import { toast } from '@/hooks/use-toast';


const API_URL = "https://pixelcypher-production.up.railway.app/api/encode";

// Utility function to send encoding request to external API
async function sendToExternalAPI(imageBuffer: Buffer, text: string): Promise<any> {
    await deleteImg();
    const formData = new FormData();
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image', imageBlob, 'image.png');
    formData.append('text', text);

    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });

    if (!response.ok) {
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
 
    const img = await response.blob();
    const imgBuffer = Buffer.from(await img.arrayBuffer());
    await mkdir(join(process.cwd(), 'public', 'images'), { recursive: true });
    const imgPath = join(process.cwd(), 'public', 'images', 'encrypted-image.png');
    try {
        // Write file and wait for completion
        await writeFile(imgPath, imgBuffer);
        console.log('Image successfully saved to', imgPath);
    } catch (writeError) {
        console.error('Error saving encrypted image:', writeError);
        throw new Error('Failed to save encrypted image');
    }
    return imgPath;

}

// Process a multipart form with an image and text to encode
export async function POST(request: NextRequest) {
    try {
        
        const formData = await request.formData();
        const image = formData.get('image') as File | null;
        const text = formData.get('text') as string | null;
        const trimText=text?.trim()
        if(!text?.trim() && !image){
            console.log('No image file and text provided');
            return NextResponse.json(
                { error: 'No image file and text provided' },
                { status: 400 }
            );
        }
        if (!image) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 401 }
            );
        }
        if (!trimText || !text) {
            return NextResponse.json(
                { error: 'No text provided' },
                { status: 402 })
        }
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Send to external API for encoding
        const imgPath = await sendToExternalAPI(buffer, text);
        
        return NextResponse.json({"EncrpytImagePath":imgPath});

    } catch (error) {
        console.error('Error processing encoding request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
    finally {
        // Clean up uploaded temporary files
        try {
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            if (existsSync(uploadDir)) {
                const files = await readdirPromise(uploadDir);
                for (const file of files) {
                    await unlink(join(uploadDir, file));
                }
                console.log('Temporary upload files cleaned up');
            }
        } catch (cleanupError) {
            console.error('Error cleaning up temporary files:', cleanupError);
        }
    }
}

async function deleteImg() 
 {
    try {
        const imgDir = join(process.cwd(), 'public', 'images');
                if (existsSync(imgDir)) {
                    const files =await readdirPromise(imgDir);
                    for (const file of files) {
                        await unlink(join(imgDir, file));
                    }
                    
                }
            } catch (cleanupError) {
                console.error('Error cleaning up temporary files:', cleanupError);
            }
}

  