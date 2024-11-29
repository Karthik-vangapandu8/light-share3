import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

// Store files in a global object
const FILES = {};

export async function POST(request: NextRequest) {
  try {
    console.log('Received upload request');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Generate a unique ID for the file
    const fileId = uuidv4();
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Store file data
    FILES[fileId] = {
      data: arrayBuffer,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      expiryTime
    };

    console.log('File stored with ID:', fileId);

    return NextResponse.json({
      success: true,
      fileId,
      originalName: file.name,
      size: file.size
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
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
