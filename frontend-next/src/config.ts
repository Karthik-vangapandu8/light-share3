interface Config {
  backendUrl: string;
}

const config: Config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
};

export default config;
