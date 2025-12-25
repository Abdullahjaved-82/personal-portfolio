/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob public URLs (images uploaded via the admin panel)
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  webpack: (config) => {
    // Next's resolver can sometimes pick the "require" export condition during the build,
    // but @splinetool/react-spline only provides "import" in its exports map.
    // Alias directly to the shipped dist entrypoints to keep builds stable.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@splinetool/react-spline": path.resolve(
        process.cwd(),
        "node_modules/@splinetool/react-spline/dist/react-spline.js"
      ),
    };
    return config;
  },
};

export default nextConfig;
  