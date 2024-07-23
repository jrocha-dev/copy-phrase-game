/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: {
    loader: "akamai",
    path: "",
  },
  basePath: "",
  assetPrefix: isProd
    ? "https://copy-phrase.computadordoescritorio.com.br"
    : "",
  trailingSlash: true,
};

export default nextConfig;
