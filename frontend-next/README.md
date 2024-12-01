# Light Share 🚀

A modern, minimalist file sharing application built with Next.js 14 and Supabase. Share files instantly with anyone using secure links and QR codes.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Storage-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **Instant File Sharing**: Upload and share files with just one click
- **QR Code Generation**: Each file gets a unique QR code for easy mobile access
- **Auto Expiry**: Files automatically expire after 24 hours for security
- **No Login Required**: Share files without creating an account
- **Drag & Drop**: Modern drag-and-drop interface for file uploads
- **Secure**: Each file gets a unique, unguessable URL
- **Mobile Friendly**: Responsive design works on all devices
- **Type Safe**: Built with TypeScript for reliability

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Storage**: Supabase Storage
- **Database**: Supabase PostgreSQL
- **File Handling**: react-dropzone
- **QR Codes**: qrcode.react

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Karthik-vangapandu8/light-share3.git
cd light-share3/frontend-next
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a .env.local file:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Environment Variables

Required environment variables:

- \`NEXT_PUBLIC_SUPABASE_URL\`: Your Supabase project URL
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`: Your Supabase anonymous key

## 🗄️ Database Schema

\`\`\`sql
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  storage_path TEXT NOT NULL
);
\`\`\`

## 🔒 Security Features

- Automatic file expiration after 24 hours
- Unique file IDs using UUID
- Row Level Security (RLS) in Supabase
- CORS protection
- Environment variable protection

## 🌟 Usage

1. Drag and drop a file or click to select
2. Wait for upload to complete
3. Share the generated link or QR code
4. File automatically expires after 24 hours

## 📱 Supported File Types

- Images (PNG, JPG, GIF)
- Documents (PDF, TXT)
- Archives (ZIP)
- And more...

## 🔧 Development

### Running Tests
\`\`\`bash
npm test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
\`\`\`

### Starting Production Server
\`\`\`bash
npm start
\`\`\`

## 🚀 Deployment

The application is deployed on Vercel. To deploy your own:

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 🛣️ Roadmap

- [ ] File encryption
- [ ] User authentication
- [ ] Custom expiration times
- [ ] Download tracking
- [ ] Password protection
- [ ] File previews

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- All open-source contributors

## 📞 Support

For support, email [your-email] or open an issue on GitHub.

---

Made with ❤️ by Karthik Vangapandu
