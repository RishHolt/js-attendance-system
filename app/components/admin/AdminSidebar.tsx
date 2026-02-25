type AdminSidebarProps = {
  username?: string;
};

export default function AdminSidebar({ username = "admin123" }: AdminSidebarProps) {
  return (
    <aside className="bg-white/90 backdrop-blur-md border-slate-100 border-r">
      <div className="p-5 border-slate-100 border-b">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-sky-50 border border-slate-100 rounded-xl w-10 h-10 text-sky-600">
            <span className="font-semibold">AS</span>
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-slate-900 text-sm">Attendance</div>
            <div className="text-slate-500 text-xs">Admin</div>
          </div>
        </div>
      </div>

      <nav className="p-3">
        <a
          href="/pages/admin"
          className="flex items-center gap-3 bg-slate-100/70 hover:bg-slate-100 px-3 py-2.5 rounded-xl font-medium text-slate-900 text-sm transition"
        >
          <span className="bg-sky-500 rounded-full w-2 h-2" aria-hidden="true" />
          Dashboard
        </a>
      </nav>

      <div className="mt-auto p-4">
        <div className="bg-white p-3 border border-slate-100 rounded-2xl text-slate-500 text-xs">
          Logged in as <span className="font-medium text-slate-700">{username}</span>
        </div>
      </div>
    </aside>
  );
}

