/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://cgqjpoocvwbedhdzlnmw.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncWpwb29jdndiZWRoZHpsbm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMzEzNjAsImV4cCI6MjA0ODYwNzM2MH0.ixQO03L7QbXvQR6muLd83A0q1zvDpV-3YQNaa78kjow'
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  }
}

module.exports = nextConfig
