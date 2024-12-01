import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '../../storage';

// Configure route options using route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId;
    console.log('Attempting to download file with ID:', fileId);
    const fileData = fileStorage.get(fileId);

    if (!fileData) {
      console.log('File not found in storage');
      return NextResponse.json(
        { error: 'File not found or has expired' },
        { status: 404 }
      );
    }

    // Check if file has expired
    if (fileData.expiresAt && new Date() > new Date(fileData.expiresAt)) {
      console.log('File has expired');
      fileStorage.delete(fileId); // Clean up expired file
      return NextResponse.json(
        { error: 'File has expired' },
        { status: 410 }
      );
    }

    console.log('File found, preparing download response');
    
    // Set CORS headers
    const headers = new Headers({
      'Content-Type': fileData.type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileData.name}"`,
      'Content-Length': fileData.size.toString(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    // Create response with file data
    return new NextResponse(fileData.data, { headers });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
