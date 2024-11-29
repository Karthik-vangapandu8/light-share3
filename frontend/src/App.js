import React, { useState, useEffect } from 'react';
import { 
  ChakraProvider, 
  Box, 
  VStack, 
  Heading, 
  Image, 
  Text, 
  Link, 
  useToast, 
  useColorMode,
  IconButton,
  Container,
  Button,
  HStack,
  Progress,
  ScaleFade,
  SlideFade
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function App() {
  const [qrCode, setQrCode] = useState(null);
  const [shareableLink, setShareableLink] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expiryTime, setExpiryTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
    let timer;
    if (expiryTime) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(expiryTime).getTime();
        const remaining = expiry - now;
        
        if (remaining <= 0) {
          setTimeRemaining(null);
          setQrCode(null);
          setShareableLink(null);
          setExpiryTime(null);
          setFileInfo(null);
          toast({
            title: '⌛ Link Expired',
            description: 'The file is no longer available',
            status: 'info',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [expiryTime, toast]);

  const formatTimeRemaining = (ms) => {
    if (!ms) return '';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      });

      setQrCode(response.data.qrCode);
      setShareableLink(response.data.shareableLink);
      setExpiryTime(response.data.expiryTime);
      setFileInfo({
        name: response.data.originalName,
        size: response.data.size
      });
      
      toast({
        title: '🚀 File uploaded successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: '❌ Upload failed',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: '🔗 Link copied!',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <ChakraProvider>
      <Box 
        minH="100vh" 
        bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'} 
        transition="all 0.2s"
      >
        <Container maxW="container.md" py={10}>
          <VStack spacing={8}>
            <HStack w="full" justify="space-between">
              <Heading 
                bgGradient="linear(to-r, cyan.400, blue.500, purple.600)"
                bgClip="text"
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight="extrabold"
              >
                QR Share
              </Heading>
              <IconButton
                icon={colorMode === 'dark' ? '☀️' : '🌙'}
                onClick={toggleColorMode}
                variant="ghost"
                fontSize="20px"
              />
            </HStack>

            <MotionBox
              {...getRootProps()}
              w="full"
              h="250px"
              border="3px dashed"
              borderColor={isDragActive ? "blue.400" : colorMode === 'dark' ? "gray.600" : "gray.200"}
              borderRadius="2xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={colorMode === 'dark' ? 'gray.800' : 'white'}
              transition="all 0.2s"
              _hover={{ 
                transform: 'scale(1.02)',
                borderColor: "blue.400",
                boxShadow: "xl"
              }}
              cursor="pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input {...getInputProps()} />
              <VStack spacing={3}>
                <Text 
                  fontSize="xl"
                  color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                >
                  {uploading
                    ? "📤 Uploading..."
                    : isDragActive
                    ? "🎯 Drop it like it's hot!"
                    : "📁 Drag and drop or click to upload"}
                </Text>
                {uploading && (
                  <Box w="80%" mt={4}>
                    <Progress 
                      value={uploadProgress} 
                      size="sm" 
                      colorScheme="blue" 
                      borderRadius="full"
                      hasStripe
                      isAnimated
                    />
                  </Box>
                )}
              </VStack>
            </MotionBox>

            {qrCode && (
              <ScaleFade in={true} initialScale={0.9}>
                <Box 
                  bg={colorMode === 'dark' ? 'gray.800' : 'white'}
                  p={8}
                  borderRadius="2xl"
                  shadow="2xl"
                  w="full"
                  border="1px solid"
                  borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
                >
                  <VStack spacing={6}>
                    <VStack spacing={2}>
                      <Text fontSize="md" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                        📂 {fileInfo?.name} ({formatFileSize(fileInfo?.size)})
                      </Text>
                      <Text 
                        fontSize="sm" 
                        color={timeRemaining && timeRemaining < 3600000 ? 'red.400' : 'gray.500'}
                        fontWeight="medium"
                      >
                        ⏳ Expires in: {formatTimeRemaining(timeRemaining)}
                      </Text>
                    </VStack>

                    <MotionBox
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <Image 
                        src={qrCode} 
                        alt="QR Code" 
                        boxSize="250px"
                        borderRadius="lg"
                        bg="white"
                        p={4}
                      />
                    </MotionBox>
                    
                    <VStack spacing={3}>
                      <Text fontSize="lg" fontWeight="medium">
                        🔍 Scan QR code or use link:
                      </Text>
                      <HStack>
                        <Link 
                          href={shareableLink} 
                          color="blue.400"
                          maxW="300px"
                          isTruncated
                          isExternal
                        >
                          {shareableLink}
                        </Link>
                        <Button
                          onClick={copyToClipboard}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                        >
                          📋 Copy
                        </Button>
                      </HStack>
                    </VStack>
                  </VStack>
                </Box>
              </ScaleFade>
            )}
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
