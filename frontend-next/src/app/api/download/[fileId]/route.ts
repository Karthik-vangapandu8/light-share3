import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '../../storage';

// Configure route options using route segment config
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
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

    // Set headers
    response.headers.set('Content-Type', fileData.type);
    response.headers.set('Content-Disposition', `attachment; filename="${fileData.name}"`);
    response.headers.set('Content-Length', fileData.size.toString());

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
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
