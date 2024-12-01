import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    
    // Get file metadata from database
    const { data: fileData, error: dbError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (dbError || !fileData) {
      console.log('File not found in database');
      return NextResponse.json(
        { error: 'File not found or has expired' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    // Check if file has expired
    if (new Date() > new Date(fileData.expires_at)) {
      console.log('File has expired');
      
      // Delete expired file from storage
      await supabase
        .storage
        .from('files')
        .remove([fileData.storage_path]);
      
      // Delete metadata from database
      await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      return NextResponse.json(
        { error: 'File has expired' },
        { 
          status: 410,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    // Get file from storage
    const { data: fileBuffer, error: storageError } = await supabase
      .storage
      .from('files')
      .download(fileData.storage_path);

    if (storageError || !fileBuffer) {
      console.error('Storage error:', storageError);
      return NextResponse.json(
        { error: 'Failed to retrieve file from storage' },
        { status: 500 }
      );
    }

    console.log('File found, preparing download response');
    console.log('File details:', {
      name: fileData.name,
      type: fileData.type,
      size: fileData.size,
      created_at: fileData.created_at,
      expires_at: fileData.expires_at
    });
    
    // Set response headers
    const headers = new Headers({
      'Content-Type': fileData.type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileData.name)}"`,
      'Content-Length': fileData.size.toString(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store'
    });

    // Create response with file data
    return new NextResponse(fileBuffer, { headers });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to download file', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
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
