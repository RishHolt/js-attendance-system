"use client";

import AdminHeader from "@/app/components/admin/AdminHeader";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="bg-slate-50 h-screen overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex h-full">
        {/* Sidebar - fixed on mobile, inline on desktop */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              key="sidebar"
              initial={{ x: isMobile ? -260 : 0, width: 0, opacity: 0 }}
              animate={{ x: 0, width: 260, opacity: 1 }}
              exit={{ x: isMobile ? -260 : 0, width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`overflow-hidden shrink-0 h-full ${
                isMobile ? "fixed left-0 top-0 z-50" : "relative"
              }`}
            >
              <AdminSidebar username="admin123" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main area */}
        <section className="flex flex-col flex-1 min-w-0 h-full">
          <AdminHeader
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            sidebarOpen={sidebarOpen}
          />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </main>
        </section>
      </div>
    </div>
  );
}
