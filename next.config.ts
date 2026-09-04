import type { NextConfig } from "next";

// Only images from domains listed here can be used with next/image.
// Your current placeholder images are all local (public/), which always
// works with no config. Add a pattern here only when you actually host
// images somewhere external -- a few common examples are commented out
// below; delete the ones you don't use and uncomment/add the one you do.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob storage -- recommended since you're deploying on Vercel
      // already; no separate image-hosting account needed.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },

      // Cloudinary (alternative, if you'd rather use that instead)
      // { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
