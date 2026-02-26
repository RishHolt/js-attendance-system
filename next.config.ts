import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/login",
        destination: "/",
      },
      {
        source: "/admin/dashboard",
        destination: "/pages/admin",
      },
      {
        source: "/admin/users",
        destination: "/pages/admin/users",
      },
      {
        source: "/admin/users/:id",
        destination: "/pages/admin/users/:id",
      },
    ];
  },
};

export default nextConfig;
