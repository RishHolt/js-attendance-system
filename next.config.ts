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
      {
        source: "/admin/users/:id/schedule",
        destination: "/pages/admin/users/:id/schedule",
      },
      {
        source: "/admin/users/:id/edit-schedule",
        destination: "/pages/admin/users/:id/edit-schedule",
      },
    ];
  },
};

export default nextConfig;
