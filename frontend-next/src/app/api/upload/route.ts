import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

    const response = await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
