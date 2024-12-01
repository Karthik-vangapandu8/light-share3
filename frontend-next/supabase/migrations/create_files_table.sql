-- Create a table for storing file metadata
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  storage_path TEXT NOT NULL
);

-- Create an index on expires_at for faster cleanup queries
CREATE INDEX idx_files_expires_at ON files(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read files
CREATE POLICY "Files are publicly accessible"
  ON files FOR SELECT
  TO public
  USING (expires_at > now());
