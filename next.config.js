/** @type {import('next').NextConfig} */

const nextConfig = {
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
  // output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xdsoft.net",
        pathname: "/**",
      },
    ],
    domains: [
      "dev-news-image.s3.amazonaws.com",
      "dev-news-image.s3.ap-southeast-2.amazonaws.com",
      "res.cloudinary.com",
      "newsmalayalam.s3.ap-south-1.amazonaws.com",
      "newsmalayalam.s3.amazonaws.com",
      "newstamil-tv.s3.amazonaws.com",
      "newstamil-tv.s3.ap-south-1.amazonaws.com",
      "instagram.com"
    ],
  },

  async headers() {
    return [
      {
        // matching all API routes
        // source: "/api/v1/web/menus/list",
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

};

module.exports = nextConfig;
