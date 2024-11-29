import { NextRequest, NextResponse } from 'next/server';
import { config } from './config';

export { config };

export async function POST(request: NextRequest) {
  try {
    // Log request details
    console.log('Received upload request');
    console.log('Content-Type:', request.headers.get('content-type'));

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Log file details
    console.log('File received:', {
      type: file.type,
      size: file.size,
      name: (file as File).name
    });

    // Create new FormData for backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Make request to backend
    const backendResponse = await fetch('https://qr-share-two.vercel.app/upload', {
      method: 'POST',
      body: backendFormData,
    });

    // Log backend response status
    console.log('Backend response status:', backendResponse.status);

    // Get response text first
    const responseText = await backendResponse.text();
    console.log('Backend response text:', responseText);

    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse backend response:', e);
      return NextResponse.json(
        { error: 'Invalid response from backend' },
        { status: 500 }
      );
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: responseData.error || 'Backend upload failed' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error: any) {
    // Log the full error
    console.error('Upload error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
