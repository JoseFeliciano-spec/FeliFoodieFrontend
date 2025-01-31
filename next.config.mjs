/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    domains: [
      "maps.googleapis.com",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
