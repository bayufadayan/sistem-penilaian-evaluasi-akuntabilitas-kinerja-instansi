/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [];
  },
  webpack: (config, { isServer }) => {
    // Ignore canvas module for pdfjs-dist on server-side
    if (isServer) {
      config.resolve.alias.canvas = false;
    }
    // External canvas for client-side to avoid bundling issues
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
