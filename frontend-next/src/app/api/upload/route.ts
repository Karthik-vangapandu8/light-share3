import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory storage
const FILES = new Map();

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Log the request
    console.log('Upload request received');

    // Get the form data
    const data = await request.formData();
    const file = data.get('file');

    // Validate file
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Log file details
    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Read file as array buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

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

    // Log success
    console.log('File stored with ID:', fileId);

    // Return success response
    return NextResponse.json({
      success: true,
      fileId,
      name: file.name
    });

  } catch (error) {
    // Log error
    console.error('Upload error:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Upload failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
