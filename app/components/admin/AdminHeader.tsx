import RealtimeTracker from "@/app/pages/admin/RealtimeTracker";

type AdminHeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function AdminHeader({
  title = "Admin Dashboard",
  subtitle = "Overview & quick actions",
}: AdminHeaderProps) {
  return (
    <header className="top-0 z-10 sticky bg-slate-50/70 backdrop-blur-md border-slate-100 border-b">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="min-w-0">
          <h1 className="font-semibold text-slate-900 text-base sm:text-lg truncate">
            {title}
          </h1>
          <p className="text-slate-500 text-xs">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <RealtimeTracker />

          <button
            type="button"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-700 text-xs sm:text-sm transition"
          >
            <span className="inline-block bg-slate-300 rounded-full w-2 h-2" aria-hidden="true" />
            Settings
          </button>
        </div>
      </div>
    </header>
  );
}

