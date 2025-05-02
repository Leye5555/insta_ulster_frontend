/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: [
    //   "res.cloudinary.com",
    //   "nextjs.org",
    //   "images.unsplash.com",
    //   "azurewebsites.net",
    //   "ui-avatars.com",
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // Allow images from all domains
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
