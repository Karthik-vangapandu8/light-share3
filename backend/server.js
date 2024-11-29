const express = require('express');
const cors = require('cors');
const multer = require('multer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Store file metadata in memory (in production, use a database)
const fileMetadata = new Map();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueId = uuidv4();
        cb(null, uniqueId + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileId = path.parse(req.file.filename).name;
        const fileExtension = path.parse(req.file.filename).ext;
        const originalName = req.file.originalname;
        const uploadTime = new Date();
        const expiryTime = new Date(uploadTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

        // Store file metadata
        fileMetadata.set(fileId, {
            filename: req.file.filename,
            originalName,
            uploadTime,
            expiryTime,
            size: req.file.size
        });

        const shareableLink = `${req.protocol}://${req.get('host')}/download/${fileId}${fileExtension}`;
        
        // Generate QR code
        const qrCode = await QRCode.toDataURL(shareableLink);

        res.json({
            success: true,
            fileId,
            shareableLink,
            qrCode,
            expiryTime: expiryTime.toISOString(),
            originalName,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Download endpoint with expiry check
app.get('/download/:fileId', (req, res) => {
    const fileName = req.params.fileId;
    const filePath = path.join(__dirname, 'uploads', fileName);
    const fileId = path.parse(fileName).name;

    // Check if file exists and hasn't expired
    const metadata = fileMetadata.get(fileId);
    if (!metadata) {
        return res.status(404).json({ error: 'File not found or has expired' });
    }

    const now = new Date();
    if (now > metadata.expiryTime) {
        // File has expired
        // Delete the file
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting expired file:', err);
        });
        fileMetadata.delete(fileId);
        return res.status(410).json({ error: 'File has expired' });
    }

    res.download(filePath, metadata.originalName);
});

// Endpoint to check file status
app.get('/status/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    const metadata = fileMetadata.get(fileId);

    if (!metadata) {
        return res.status(404).json({ error: 'File not found or has expired' });
    }

    const now = new Date();
    const timeRemaining = metadata.expiryTime - now;

    res.json({
        exists: true,
        originalName: metadata.originalName,
        expiryTime: metadata.expiryTime,
        timeRemaining,
        size: metadata.size
    });
});

// Clean up expired files every hour
setInterval(() => {
    const now = new Date();
    
    fileMetadata.forEach((metadata, fileId) => {
        if (now > metadata.expiryTime) {
            const filePath = path.join(uploadsDir, metadata.filename);
            fs.unlink(filePath, err => {
                if (err) console.error(`Error deleting ${fileId}:`, err);
                else console.log(`Deleted expired file: ${fileId}`);
            });
            fileMetadata.delete(fileId);
        }
    });
}, 60 * 60 * 1000); // Check every hour

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
