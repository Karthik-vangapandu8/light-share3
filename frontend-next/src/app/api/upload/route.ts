import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Generate a unique ID for the file
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const storagePath = `${fileId}${fileExtension ? `.${fileExtension}` : ''}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      storagePath
    });

    // Upload file to Supabase Storage
    const { error: uploadError, data: uploadData } = await supabase
      .storage
      .from('files')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      );
    }

    // Get the public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from('files')
      .getPublicUrl(storagePath);

    // Calculate expiration date (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Store file metadata in database
    const { error: dbError } = await supabase
      .from('files')
      .insert({
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        storage_path: storagePath,
        expires_at: expiresAt.toISOString()
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to store file metadata', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      fileId,
      fileName: file.name,
      downloadUrl: publicUrl,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload file', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
