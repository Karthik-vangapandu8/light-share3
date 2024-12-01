'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import toast from '../components/Toast';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      if (data.success) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const downloadUrl = `${baseUrl}/download/${data.shareableLink.split('/').pop()}`;
        
        setShareLink(downloadUrl);
        setQrCodeData(downloadUrl);
        setShowSuccess(true);
        toast.success('File uploaded successfully!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const dropzoneConfig = {
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/*': ['.txt', '.md'],
      'application/zip': ['.zip']
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig);

  const dropzoneClasses = `mt-8 p-12 bg-white/[0.02] backdrop-blur-lg rounded-2xl max-w-2xl mx-auto 
    cursor-pointer border border-white/10 transition-all duration-300
    ${isDragActive ? 'bg-white/[0.08] border-white/30' : 'hover:bg-white/[0.04] hover:border-white/20'}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="container mx-auto py-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Light Share
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-white/80 text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Share files instantly with anyone, anywhere.
          </motion.p>

          <AnimatePresence mode="wait">
            {!shareLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  {...getRootProps()}
                  className={dropzoneClasses}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <p className="text-white/60 text-lg mb-2">
                      {isDragActive
                        ? "Drop the file here..."
                        : "Drag & drop a file here, or click to select"}
                    </p>
                    <p className="text-white/40 text-sm">
                      Maximum file size: 100MB
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-white/60"
            >
              Uploading...
            </motion.div>
          )}

          {uploadError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-red-500"
            >
              {uploadError}
            </motion.div>
          )}

          {showSuccess && shareLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-white rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                File Uploaded Successfully! 🎉
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Share this link:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 p-2 border rounded-md bg-gray-50"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      toast.success('Link copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {qrCodeData && (
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">Or scan this QR code:</p>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <QRCodeSVG value={qrCodeData} size={200} />
                  </div>
                </div>
              )}

              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Download File
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
