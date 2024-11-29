const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Store files in memory
const files = new Map();

// Export for Vercel serverless function
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  // Handle file upload
  upload.single('file')(req, res, async (err) => {
    try {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ 
          success: false,
          error: err.message 
        });
      }

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
      
      console.log('Upload successful:', { fileId });
      
      res.json({
        success: true,
        fileId,
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
};
