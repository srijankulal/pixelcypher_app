import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readdir as readdirPromise, unlink } from 'fs/promises';
import { existsSync } from 'fs';



// const API_URL = "https://pixelcypher-production.up.railway.app/api/decode";
const API_URL = "https://pixel-cypher-api.onrender.com/api/decode";

// Utility function to send encoding request to external API
async function sendToExternalAPI(imageBuffer: Buffer): Promise<any> {
    await deleteImg();
    const formData = new FormData();
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image', imageBlob, 'image.png');


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
    const text= await response.text();
    console.log(text);
    return text;

}

// Process a multipart form with an image and text to encode
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get('image') as File | null;
        if (!image) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 401 }
            );
        }
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Send to external API for encoding
        var deText = await sendToExternalAPI(buffer);
        if(deText.status){
            return NextResponse.json(
                { error: 'Failed to process request' },
                { status: 501 }
            );
        }
        deText=deText.replace(/Decoded text:/gm, "");
        console.log("DEEEEE",deText);
        return NextResponse.json({"DecryptedText":deText});

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

  
