import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    // Inlined into the browser bundle. API_URL and API_PROXY_SECRET are
    // server-only (lib/server/session.ts) and must not be listed here.
    env: {
        APP_NAME: process.env.APP_NAME,
        APP_URL: process.env.APP_URL,
    },

    // Disable to remove <Highlight /> component flickering on change
    reactStrictMode: false
};

export default nextConfig