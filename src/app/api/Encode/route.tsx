import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { writeFile, mkdir, readdir as readdirPromise, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import * as crypto from 'crypto';

const API_URL = "http://localhost:8080/api/encode";

// Utility function to send encoding request to external API
async function sendToExternalAPI(imageBuffer: Buffer, text: string): Promise<any> {
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
    const imgPath = join(process.cwd(), 'public', 'images', 'encrypted-image.png');
    await mkdir(join(process.cwd(), 'public', 'images'), { recursive: true });
    await writeFile(imgPath, imgBuffer);
    return imgPath;

}

// Process a multipart form with an image and text to encode
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get('image') as File | null;
        const text = formData.get('text') as string | null;

        if (!image) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        if (!text) {
            return NextResponse.json(
                { error: 'No text to encode provided' },
                { status: 400 }
            );
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