const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

// Configure CORS
app.use(cors({
  origin: ['https://qr-share-6pwt.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Store files in memory (for demo purposes)
const files = new Map();

// Root endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Light Share API is running' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    console.log('Received upload request');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const fileId = uuidv4();
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Store file in memory
    files.set(fileId, {
      data: req.file.buffer,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      expiryTime: expiryTime
    });

    const shareableLink = `/download/${fileId}`;
    
    console.log('Upload successful:', { fileId, shareableLink });
    
    res.json({
      success: true,
      fileId,
      shareableLink,
      expiryTime,
      originalName: req.file.originalname
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file: ' + error.message });
  }
});

// Download endpoint
app.get('/download/:fileId', (req, res) => {
  try {
    const fileId = req.params.fileId;
    const fileData = files.get(fileId);

    if (!fileData) {
      return res.status(404).json({ error: 'File not found or expired' });
    }

    if (Date.now() > fileData.expiryTime) {
      files.delete(fileId);
      return res.status(404).json({ error: 'File has expired' });
    }

    res.setHeader('Content-Type', fileData.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
    res.send(fileData.data);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file: ' + error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Something went wrong: ' + err.message });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for serverless
module.exports = app;
