interface Config {
  backendUrl: string;
}

const config: Config = {
  // Use relative URL for API routes
  backendUrl: ''  // Empty string means use same origin
};

// Remove any query parameters from the backend URL
config.backendUrl = config.backendUrl.split('?')[0];

export default config;
