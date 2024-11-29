import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory storage using a Map
const FILES = new Map();

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');

    const data = await request.formData();
    const file = data.get('file');

    if (!file || !(file instanceof File)) {
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
      name: file.name,
      type: file.type,
      size: file.size,
      data: buffer,
      createdAt: Date.now()
    });

    console.log('File stored with ID:', fileId);

    return NextResponse.json({
      success: true,
      fileId,
      name: file.name
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
