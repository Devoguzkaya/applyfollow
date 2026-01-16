import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      }
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NODE_ENV === 'production'
      ? 'http://backend:8080' // Docker network name
      : 'http://localhost:8080'; // Local dev

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
