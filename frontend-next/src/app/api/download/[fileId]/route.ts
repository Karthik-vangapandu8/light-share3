import { NextRequest, NextResponse } from 'next/server';
import { FILES } from '../../storage';

// Configure route options using route segment config
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId;
    console.log('Attempting to download file:', fileId);
    console.log('Available files:', Array.from(FILES.keys()));
    
    const fileData = FILES.get(fileId);
    console.log('File data found:', fileData ? 'yes' : 'no');

    if (!fileData) {
      return NextResponse.json(
        { error: 'File not found or expired' },
        { status: 404 }
      );
    }

    // Create response with file data
    const response = new NextResponse(fileData.data);

    // Set headers
    response.headers.set('Content-Type', fileData.type || 'application/octet-stream');
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${fileData.name}"`
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
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
