import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/webhook/', 
        destination: 'http://localhost:8000/webhook/', 
      },
      {
        source: '/api/webhook', // alguns browsers podem chamar sem barra
        destination: 'http://localhost:8000/webhook/', 
      },
      {
        source: '/api/conversations/:path*',
        destination: 'http://localhost:8000/conversations/:path*',
      }
    ];
  },
};


export default nextConfig;
