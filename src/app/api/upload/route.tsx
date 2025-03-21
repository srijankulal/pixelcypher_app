import { put ,del} from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }
  if (!request.body) {
    return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
  }
  
  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      
      if (!id) {
        return NextResponse.json(
          { error: 'Blob ID is required' },
          { status: 400 }
        );
      }
      
      // Delete the blob
      await del(id);
      
      return NextResponse.json({
        success: true,
        message: 'Blob deleted successfully'
      });
      
    } catch (error: any) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete blob', message: error.message },
        { status: 500 }
      );
    }
  }

