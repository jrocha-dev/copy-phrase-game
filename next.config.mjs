/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: "akamai",
    path: "",
  },
  basePath: "",
  assetPrefix: "/",
};

export default nextConfig;
