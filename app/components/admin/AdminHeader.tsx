"use client";

import { useEffect, useRef, useState } from "react";
import { swal } from "@/app/components/Swal";
import { User, ChevronRight, LayoutDashboard, Users, PanelLeft, Clock, Calendar } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getAuthToken } from "@/app/lib/auth";

const breadcrumbMap: Record<string, { label: string; shortLabel?: string; icon: React.ReactNode }> = {
  "/admin/dashboard": { label: "Dashboard", shortLabel: "Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  "/admin/users": { label: "User Management", shortLabel: "Users", icon: <Users className="w-3.5 h-3.5" /> },
};

function Breadcrumbs() {
  const pathname = usePathname();
  const current = breadcrumbMap[pathname];

  return (
    <nav className="flex items-center gap-1.5 text-xs" aria-label="Breadcrumb">
      <Link href="/admin/dashboard" className="text-slate-400 hover:text-slate-600 transition hidden sm:inline">
        Admin
      </Link>
      <span className="text-slate-400 sm:hidden">A</span>
      {current && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            {current.icon}
            <span className="hidden sm:inline">{current.label}</span>
            <span className="sm:hidden">{current.shortLabel || current.label}</span>
          </span>
        </>
      )}
    </nav>
  );
}

type AdminHeaderProps = {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
};

export default function AdminHeader({ onToggleSidebar, sidebarOpen }: AdminHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState(process.env.NEXT_PUBLIC_LOCAL_ADMIN_NAME || "admin123");
  const [isMounted, setIsMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Extract username from auth token
    const token = getAuthToken();
    if (token) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const parts = decoded.split(':');
        if (parts.length >= 2) {
          // Check if it's a local admin token
          if (parts[0] === 'local-admin') {
            setUsername(process.env.NEXT_PUBLIC_LOCAL_ADMIN_NAME || parts[1]);
          } else {
            setUsername(parts[1]); // Get username from token
          }
        }
      } catch (error) {
        console.error('Error decoding auth token:', error);
      }
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleLogout = async () => {
    const result = await swal({
      title: "Logout?",
      text: "You will be returned to the login page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push("/");
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout API fails
      router.push("/");
    }
  };

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setMenuOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className="top-0 z-10 sticky bg-slate-50/70 backdrop-blur-md border-slate-100 border-b">
      <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <PanelLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <div className="text-sm font-medium text-slate-700">
                {isMounted ? formatTime(currentTime) : '--:--:-- --'}
              </div>
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <div className="text-xs text-slate-500">
                {isMounted ? formatDate(currentTime) : 'Loading...'}
              </div>
              <Calendar className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="inline-flex items-center bg-white hover:bg-slate-50 px-2 sm:px-3 py-2 gap-2 border border-slate-200 rounded-xl font-medium text-slate-700 text-xs sm:text-sm transition"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <User className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium text-slate-700 text-xs sm:text-sm">
                {username}
              </span>
              <span className="relative inline-flex items-center justify-center w-2 h-2 flex-shrink-0 ml-auto">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span
                className={`inline-block text-slate-400 transition ml-2 flex-shrink-0 ${menuOpen ? "rotate-180" : "rotate-0"}`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            <div
              className={`right-0 absolute bg-white shadow-lg mt-2 p-1 border border-slate-100 rounded-xl w-44 origin-top-right transition duration-150 ease-out ${
                menuOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
              }`}
              role="menu"
            >
              <a
                href="#"
                className="block hover:bg-slate-50 px-3 py-2 rounded-lg text-slate-700 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                }}
                role="menuitem"
              >
                Profile
              </a>
              <a
                href="#"
                className="block hover:bg-slate-50 px-3 py-2 rounded-lg text-slate-700 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                }}
                role="menuitem"
              >
                Settings
              </a>
              <button
                type="button"
                className="w-full text-left hover:bg-slate-50 px-3 py-2 rounded-lg text-red-600 text-sm"
                onClick={async () => {
                  setMenuOpen(false);
                  await handleLogout();
                }}
                role="menuitem"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

