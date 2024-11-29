'use client';

import { useState, useCallback, useMemo, requestIdleCallback, requestAnimationFrame } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import CustomCursor from '../components/CustomCursor';
import config from '../config';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Memoize the drop handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    // Reset states
    setIsUploading(true);
    setUploadError('');
    setUploadProgress(0);

    try {
      const file = acceptedFiles[0];
      
      if (!file) {
        setUploadError('No file selected');
        return;
      }

      setIsUploading(true);
      setUploadError('');

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Make the request
      const response = await fetch(`${config.backendUrl}/upload`, {
        method: 'POST',
        body: formData
      });

      // Log the response status
      console.log('Response status:', response.status);

      // Get the response data
      const text = await response.text();
      console.log('Response text:', text);

      // Parse the response
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid server response');
      }

      // Check for errors
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Handle success
      if (data.success) {
        const downloadUrl = `${config.backendUrl}${data.shareableLink}`;
        setShareLink(downloadUrl);
        setQrCodeData(downloadUrl);
        setShowSuccess(true);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  // Memoize dropzone config
  const dropzoneConfig = useMemo(() => ({
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  }), [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig);

  // Memoize dynamic classes
  const dropzoneClasses = useMemo(() => 
    `mt-8 p-12 bg-white/[0.02] backdrop-blur-lg rounded-2xl max-w-2xl mx-auto 
    cursor-pointer border border-white/10 transition-all duration-300
    ${isDragActive ? 'bg-white/[0.08] border-white/30' : 'hover:bg-white/[0.04] hover:border-white/20'}`
  , [isDragActive]);

  const copyToClipboard = async () => {
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const features = [
    {
      icon: "🚀",
      title: "Lightning Fast",
      description: "Upload and share files instantly with anyone, anywhere."
    },
    {
      icon: "🔒",
      title: "Secure Sharing",
      description: "Files are automatically deleted after 24 hours for your privacy."
    },
    {
      icon: "📱",
      title: "QR Code Access",
      description: "Scan and download files directly on any device."
    },
    {
      icon: "🎯",
      title: "No Sign-up",
      description: "Start sharing immediately, no account required."
    }
  ];

  const testimonials = [
    {
      text: "Light Share has revolutionized how I share files with my team. So simple, yet so powerful!",
      author: "Sarah K.",
      role: "Product Manager"
    },
    {
      text: "The QR code feature is genius! Makes sharing files in meetings a breeze.",
      author: "Mike R.",
      role: "Tech Lead"
    },
    {
      text: "Finally, a file sharing service that puts privacy first. Love the 24-hour auto-delete!",
      author: "Alex M.",
      role: "Security Analyst"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] relative cursor-none">
      <CustomCursor />
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl"></div>
        <div className="grid grid-cols-8 gap-4 opacity-30 absolute inset-0">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-transparent to-white/[0.02] rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="inline-block mb-6 bg-white/5 backdrop-blur-lg rounded-full px-6 py-2 border border-white/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text font-medium">
              Quick. Secure. Simple.
            </span>
          </motion.div>

          <motion.h1
            className="text-7xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 text-transparent bg-clip-text mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Light Share
          </motion.h1>
          
          <motion.p
            className="text-3xl text-white/80 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Share karenge kya? 🚀
          </motion.p>

          <motion.p
            className="text-xl text-white/60 mb-12 max-w-2xl mx-auto"
          >
            The fastest way to share files. No signup required. Just drag, drop, and share with a QR code.
          </motion.p>

          <AnimatePresence mode="wait">
            {!shareLink ? (
              <motion.div
                key="dropzone"
                onClick={getRootProps().onClick}
                onKeyDown={getRootProps().onKeyDown}
                onFocus={getRootProps().onFocus}
                onBlur={getRootProps().onBlur}
                className={dropzoneClasses}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input {...getInputProps()} />
                <div className="text-white text-xl">
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Uploading... {uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-2 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : isDragActive ? (
                    <div className="text-purple-400">Drop your file here! ✨</div>
                  ) : (
                    <div>
                      <p className="text-2xl mb-2 text-white/90">Drag & drop a file here, or click to select</p>
                      <p className="text-sm text-white/40 mt-2">Your file will be available for 24 hours</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="qr-code"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-8 p-8 bg-white/[0.02] backdrop-blur-lg rounded-2xl max-w-md mx-auto border border-white/10"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Your file is ready!</h2>
                <div className="bg-white p-4 rounded-xl mb-4">
                  <QRCodeSVG
                    value={shareLink || ''}
                    size={200}
                    className="mx-auto"
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-white/60 text-sm">
                    Scan this QR code or use the link below to download your file
                  </p>
                  <div 
                    onClick={copyToClipboard}
                    className="bg-white/[0.02] p-2 rounded-lg truncate cursor-pointer hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <p className="text-white/60 text-sm">
                      {shareLink}
                    </p>
                  </div>
                  <p className="text-white/40 text-xs">
                    Click to copy link
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShareLink(null);
                    setQrCodeData(null);
                    setUploadedFile(null);
                    setUploadProgress(0);
                  }}
                  className="mt-6 text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm"
                >
                  Share another file
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {uploadedFile && !shareLink && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-white/60"
            >
              Selected file: {uploadedFile.name}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Why Choose Light Share?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/[0.02] backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/[0.02] backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/[0.04] transition-all duration-300"
              >
                <p className="text-white/80 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-white/40 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 relative">
        <div className="container mx-auto px-4 text-center text-white/40">
          <p> 2024 Light Share. Made with ❤️ for easy file sharing.</p>
        </div>
      </footer>
    </div>
  );
}
