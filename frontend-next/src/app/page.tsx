'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import toast from '../components/Toast';
import config from '../config';
import CustomCursor from '../components/CustomCursor';

// Define requestIdleCallback for TypeScript
const requestIdleCallbackPolyfill = 
  typeof window !== 'undefined' 
    ? window.requestIdleCallback || 
      ((cb) => setTimeout(cb, 1))
    : (cb: any) => setTimeout(cb, 1);

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Memoize the drop handler
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
        // Get the base URL from the window location
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const fullShareLink = `${baseUrl}${data.shareableLink}`;
        
        setShareLink(fullShareLink);
        setQrCodeData(fullShareLink);
        setShowSuccess(true);
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

  // Memoize dropzone config
  const dropzoneConfig = useCallback(() => ({
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig());

  // Memoize dynamic classes
  const dropzoneClasses = useCallback(() => 
    `mt-8 p-12 bg-white/[0.02] backdrop-blur-lg rounded-2xl max-w-2xl mx-auto 
    cursor-pointer border border-white/10 transition-all duration-300
    ${isDragActive ? 'bg-white/[0.08] border-white/30' : 'hover:bg-white/[0.04] hover:border-white/20'}`
  , [isDragActive]);

  const copyToClipboard = useCallback(async () => {
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }, [shareLink]);

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
            className="text-xl md:text-2xl text-white/80 text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Share files instantly with anyone, anywhere.
          </motion.p>

          <AnimatePresence mode="wait">
            {!shareLink ? (
              <motion.div
                key="dropzone"
                {...getRootProps()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                onKeyDown={getRootProps().onKeyDown}
                onFocus={getRootProps().onFocus}
                onBlur={getRootProps().onBlur}
                className={dropzoneClasses()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
              </motion.div>
            ) : null}
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
        </motion.div>
      </div>

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
