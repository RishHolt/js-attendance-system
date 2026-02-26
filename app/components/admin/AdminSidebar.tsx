"use client";

import { LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminSidebarProps = {
  username?: string;
};

export default function AdminSidebar({ username = "admin123" }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
      isActive(href)
        ? "bg-slate-100/70 text-slate-900"
        : "hover:bg-slate-100 text-slate-700"
    }`;

  const iconClass = (href: string) =>
    `w-4 h-4 ${isActive(href) ? "text-sky-600" : "text-slate-500"}`;

  return (
    <aside className="bg-white/90 backdrop-blur-md border-slate-100 border-r w-[260px] min-h-screen">
      <div className="px-5 py-3 sm:py-4 border-slate-100 border-b">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-sky-50 border border-slate-100 rounded-xl w-10 h-10 text-sky-600">
            <span className="font-semibold">AS</span>
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-slate-900 text-sm">Attendance System</div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 p-3">
        <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
          <LayoutDashboard className={iconClass("/admin/dashboard")} aria-hidden="true" />
          Dashboard
        </Link>

        <Link href="/admin/users" className={linkClass("/admin/users")}>
          <Users className={iconClass("/admin/users")} aria-hidden="true" />
          User Management
        </Link>
      </nav>
    </aside>
  );
}
