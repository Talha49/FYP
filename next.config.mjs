// const nextConfig = {
//   experimental: {
//     appDir: true, // Example: Enable the app directory feature
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//         port: "",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "firebasestorage.googleapis.com", // Add Firebase Storage domain here
//         port: "",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "platform-lookaside.fbsbx.com", // Add Facebook platform domain here
//         port: "",
//         pathname: "/**",
//       },
//     ],
//   },
//   async headers() {
//     return [
//       {
//         source: "/api/:path*",
//         headers: [
//           { key: "Access-Control-Allow-Credentials", value: "true" },
//           {
//             key: "Access-Control-Allow-Origin",
//             value: "http://localhost:3001",
//           },
//           {
//             key: "Access-Control-Allow-Origin",
//             value: "http://localhost:3002",
//           },
//           // Add other necessary CORS headers
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;


const nextConfig = {
  reactStrictMode: true, // Enable React strict mode
  swcMinify: true, // Enable SWC for faster builds
  experimental: {
    appDir: true, // Example: Enable the app directory feature
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Use "*" for universal access, or handle origins dynamically in middleware
          },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
