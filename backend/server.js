const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

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

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Store file in memory
    files.set(fileId, {
      data: req.file.buffer,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      expiryTime: expiryTime
    });

    // Generate shareable link
    const shareableLink = `/download/${fileId}`;
    
    res.json({
      success: true,
      fileId,
      shareableLink,
      expiryTime
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.get('/download/:fileId', (req, res) => {
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
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
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
