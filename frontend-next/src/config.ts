interface Config {
  backendUrl: string;
}

const config: Config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 
    (process.env.VERCEL_ENV === 'production' 
      ? 'https://light-share3-4h2p5g2sr-karthik-vangapandu8s-projects.vercel.app'
      : 'http://localhost:3001')
};

// Remove any query parameters from the backend URL
config.backendUrl = config.backendUrl.split('?')[0];

export default config;
