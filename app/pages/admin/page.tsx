import AdminHeader from "@/app/components/admin/AdminHeader";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import StatCard from "@/app/components/StatCard";

export default function AdminPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-screen">
        {/* Sidebar */}
        <AdminSidebar username="admin123" />

        {/* Right side */}
        <section className="min-w-0">
          {/* Header */}
          <AdminHeader />

          {/* Main content */}
          <main className="p-6">
            <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label="Today" />
              <StatCard label="Active users" />
              <StatCard label="Attendance logs" />
            </div>

            <div className="bg-white mt-6 p-5 border border-slate-100 rounded-2xl">
              <div className="flex justify-between items-center gap-3">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Dashboard</div>
                  <div className="text-slate-500 text-xs">
                    Add your real admin widgets here next.
                  </div>
                </div>
              </div>

              <div className="mt-4 text-slate-400 text-xs">
                This layout includes a left sidebar, a header with a real-time tracker,
                and a main content area.
              </div>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}

