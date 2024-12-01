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
    const fileData = fileStorage.get(fileId);

    if (!fileData) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Create response with file data
    const response = new NextResponse(fileData.data);

    // Set appropriate headers
    response.headers.set('Content-Type', fileData.type || 'application/octet-stream');
    response.headers.set('Content-Disposition', `attachment; filename="${fileData.name}"`);
    response.headers.set('Content-Length', fileData.size.toString());

    return response;
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
