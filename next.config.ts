import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Privacy: never send the app's referrer to hotline / gov sites we link out to.
  async headers() {
    return [{ source: "/(.*)", headers: [{ key: "Referrer-Policy", value: "no-referrer" }] }];
  },
};

export default nextConfig;
