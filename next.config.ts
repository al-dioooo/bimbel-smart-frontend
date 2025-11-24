import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    env: {
        APP_NAME: process.env.APP_NAME,
        APP_URL: process.env.APP_URL,
        API_URL: process.env.API_URL
    },

    // Disable to remove <Highlight /> component flickering on change
    reactStrictMode: true
};

export default nextConfig