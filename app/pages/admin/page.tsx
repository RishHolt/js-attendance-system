import StatCard from "@/app/components/StatCard";
import PageHeader from "@/app/components/admin/PageHeader";

export default function AdminPage() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview & quick actions" />
      <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Today" />
        <StatCard label="Active users" />
        <StatCard label="Attendance logs" />
      </div>

      <div className="bg-white mt-6 p-5 border border-slate-200 rounded-2xl">
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
    </>
  );
}

