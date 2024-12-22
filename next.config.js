/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: 'https://avatars.githubusercontent.com',
                port: '', // Leave blank if no specific port is used
                pathname: '/**', // Allow all paths under this hostname
            },
            {
                protocol: "https",
                hostname: 'avatars.githubusercontent.com',
                port: '', // Leave blank if no specific port is used
                pathname: '/**', // Allow all paths under this hostname
            }
        ]
    }
};

export default config;
