const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

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
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    console.log('Received file:', {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const fileId = uuidv4();
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

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
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload file: ' + error.message 
    });
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

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export for serverless
module.exports = app;
