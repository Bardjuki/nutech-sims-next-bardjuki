import type { NextConfig } from "next";
const nextConfig: NextConfig ={
  images: {
   remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minio.nutech-integrasi.com',
        port: '',
        pathname: '/take-home-test/**',
      },
      {
        protocol: 'https',
        hostname: 'nutech-integrasi.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
