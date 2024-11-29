import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Reference to our file storage
const FILES = {};

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId;
    const fileData = FILES[fileId];

    if (!fileData) {
      return NextResponse.json(
        { error: 'File not found or expired' },
        { status: 404 }
      );
    }

    if (Date.now() > fileData.expiryTime) {
      delete FILES[fileId];
      return NextResponse.json(
        { error: 'File has expired' },
        { status: 404 }
      );
    }

    // Create response with file data
    const response = new NextResponse(fileData.data);

    // Set headers
    response.headers.set('Content-Type', fileData.mimetype);
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${fileData.originalName}"`
    );

    return response;
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed: ' + error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
