import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://qr-share-two.vercel.app';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Log the request details
    console.log('Sending request to:', `${BACKEND_URL}/upload`);
    console.log('FormData entries:', Array.from(formData.entries()).map(([key]) => key));

    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);
    
    const responseText = await response.text();
    console.log('Backend response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return NextResponse.json(
        { error: 'Invalid response from server' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('Backend error:', data);
      return NextResponse.json(
        { error: data.error || 'Upload failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Upload error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
