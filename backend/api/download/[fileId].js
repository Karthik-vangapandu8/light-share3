// Reference to our in-memory file storage
const files = new Map();

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const fileId = req.query.fileId;
    const fileData = files.get(fileId);

    if (!fileData) {
      return res.status(404).json({ 
        success: false,
        error: 'File not found or expired' 
      });
    }

    if (Date.now() > fileData.expiryTime) {
      files.delete(fileId);
      return res.status(404).json({ 
        success: false,
        error: 'File has expired' 
      });
    }

    res.setHeader('Content-Type', fileData.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
    res.send(fileData.data);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to download file: ' + error.message 
    });
  }
};
