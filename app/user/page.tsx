import React from "react";

export default function UserPage() {
  return (
    <main className="flex justify-center items-center bg-slate-50 min-h-screen">
      <div className="space-y-3 bg-white shadow-lg p-8 border border-slate-100 rounded-2xl w-full max-w-md text-center">
        <h1 className="font-semibold text-slate-900 text-xl">User Dashboard</h1>
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

