/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: process.env.AWS_ENDPOINT_URL_S3 ? [{
      protocol: "https",
      hostname: new URL(process.env.AWS_ENDPOINT_URL_S3).hostname,
      pathname: "/assets/**",
    }] : [],
  },
  async headers() {
    return [
      {
        source: "/api/sb-contact",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
