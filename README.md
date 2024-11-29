# Light Share - Quick File Sharing with QR Codes

Light Share is a modern web application that allows users to quickly share files using QR codes. Files are automatically deleted after 24 hours for privacy.

## Features

- Drag & drop file uploads
- Instant QR code generation
- 24-hour file expiry
- No signup required
- Modern UI with dark theme
- Mobile-friendly design

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- React Dropzone
- Axios

### Backend
- Node.js
- Express
- Multer

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend-next
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Create `.env.local` in frontend-next:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Start the development servers:
   ```bash
   # Frontend
   cd frontend-next
   npm run dev

   # Backend
   cd ../backend
   node server.js
   ```

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

### Backend (Your Choice)

1. Deploy to your preferred hosting (e.g., Heroku, DigitalOcean)
2. Set up proper file storage solution
3. Configure CORS for your frontend domain
4. Set up environment variables as needed

## License

MIT
