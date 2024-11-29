import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://qr-share-two.vercel.app';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create a new FormData instance
    const newFormData = new FormData();
    newFormData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: 'POST',
      body: newFormData,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Upload error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
