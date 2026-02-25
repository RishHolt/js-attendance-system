export default function UserPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-slate-100 max-w-md w-full text-center space-y-3">
        <h1 className="text-xl font-semibold text-slate-900">User Dashboard</h1>
        <p className="text-slate-500 text-sm">
          You are logged in as a regular user.
        </p>
        <p className="text-slate-400 text-xs">
          This is a placeholder page. Replace it with your real user dashboard.
        </p>
      </div>
    </main>
  );
}

