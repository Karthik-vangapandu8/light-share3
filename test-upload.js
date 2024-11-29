const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testUpload() {
  // Create a test file
  fs.writeFileSync('test.txt', 'Hello, this is a test file!');

  // Create form data
  const form = new FormData();
  form.append('file', fs.createReadStream('test.txt'));

  try {
    // Make request to API
    console.log('Sending request to API...');
    const response = await fetch('https://qr-share-6pwt.vercel.app/api/upload', {
      method: 'POST',
      body: form
    });

    // Log response status
    console.log('Response status:', response.status);

    // Get response text
    const text = await response.text();
    console.log('Response text:', text);

    // Try to parse JSON
    try {
      const data = JSON.parse(text);
      console.log('Parsed response:', data);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }

  // Clean up test file
  fs.unlinkSync('test.txt');
}

testUpload();
