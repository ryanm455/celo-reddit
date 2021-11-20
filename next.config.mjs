import withBundleAnalyzer from "@next/bundle-analyzer";

const config = withBundleAnalyzer({
  enabled: process.env.NODE_ENV === "production",
})({
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }
  
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      child_process: false,
      readline: false,
    };
    return config;
  },
});

export default config;
