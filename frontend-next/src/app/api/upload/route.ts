import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { FILES } from '../storage';

// Configure route options using route segment config
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file');

    console.log('Form data keys:', Array.from(formData.keys()));
    console.log('File object:', file);

    if (!file || !(file instanceof Blob)) {
      console.error('No valid file in request');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Read file as array buffer
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Generate unique ID
    const fileId = uuidv4();

    // Store file data
    FILES.set(fileId, {
      name: file instanceof File ? file.name : 'unnamed-file',
      type: file.type || 'application/octet-stream',
      size: file.size,
      data: buffer,
      createdAt: Date.now()
    });

    console.log('File stored with ID:', fileId);
    console.log('Current files in storage:', Array.from(FILES.keys()));

    return NextResponse.json({
      success: true,
      fileId,
      name: file instanceof File ? file.name : 'unnamed-file'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Upload endpoint is working'
  });
}

// OPTIONS endpoint for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
