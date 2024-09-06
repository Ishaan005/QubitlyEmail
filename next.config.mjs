/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['@prisma/client', 'mongodb'],
    },
  };
  
  export default nextConfig;