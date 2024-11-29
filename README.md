# Light Share 🚀

Share files instantly with QR codes! "Share karenge kya?"

## Features ✨

- Instant file sharing
- QR code generation
- No authentication required
- Simple and intuitive UI
- File size limit: 100MB
- 24-hour file expiry

## Tech Stack 🛠

### Frontend
- Next.js 14
- TypeScript
- React
- Tailwind CSS

### Backend
- Express.js
- Node.js
- In-memory file storage

## Deployment 🌐

### Frontend (Vercel)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Set environment variables:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
   ```
5. Deploy!

### Backend (Render)

1. Visit [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables: None required
5. Deploy!

## Local Development 💻

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

3. Start the servers:
   ```bash
   # Backend (http://localhost:3001)
   cd backend
   node server.js

   # Frontend (http://localhost:3000)
   cd frontend-next
   npm run dev
   ```

## Important Notes 📝

- Files are stored in memory and will be lost on server restart
- Files expire after 24 hours
- Maximum file size is 100MB
- CORS is configured for specific origins only

## Future Enhancements 🚀

- [ ] Persistent storage
- [ ] Password protection
- [ ] Custom expiry times
- [ ] File preview
- [ ] Download count tracking
- [ ] Dark mode
