import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for files (will be cleared on server restart)
const fileStorage = new Map();

// Configure route options using route segment config
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
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
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Store file in memory
    fileStorage.set(fileId, {
      name: file.name,
      type: file.type,
      size: file.size,
      data: buffer,
      createdAt: new Date()
    });

    // Create shareable link
    const shareableLink = `/api/download/${fileId}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      shareableLink
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
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
