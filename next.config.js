/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API: process.env.API || "http://localhost:1337/api",
  },
  // headers: async () => {
  //   return [
  //     {
  //       source: "/",
  //       headers: [],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
