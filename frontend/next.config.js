/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
const backend = backendUrl.startsWith('http') ? backendUrl : `https://${backendUrl}`;

const nextConfig = {
  images: { unoptimized: true },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${backend}/api/:path*` }
    ];
  }
};
module.exports = nextConfig;
