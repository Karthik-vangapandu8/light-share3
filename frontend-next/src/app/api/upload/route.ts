import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { fileStorage } from '../storage';

// Configure route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Configure allowed methods
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

    // Generate unique ID for the file
    const fileId = uuidv4();
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Store file in memory with expiration
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      data: buffer,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };
    
    fileStorage.set(fileId, fileData);

    // Create shareable link
    const shareableLink = `/api/download/${fileId}`;

    // Set CORS headers
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      shareableLink,
      fileId,
      fileName: file.name,
      expiresAt: fileData.expiresAt
    }, { headers });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'Upload endpoint is working'
  });
}
