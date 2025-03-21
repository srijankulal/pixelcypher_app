/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wqvndanjead1tl5k.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
};
 
module.exports = nextConfig;