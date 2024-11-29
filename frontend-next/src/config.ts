interface Config {
  backendUrl: string;
}

const config: Config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 
    (process.env.VERCEL_ENV === 'production' 
      ? 'https://light-share3-backend.vercel.app'
      : 'http://localhost:3001')
};

export default config;
