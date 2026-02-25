"use client";

import { useEffect, useMemo, useState } from "react";

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function RealtimeTracker() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const label = useMemo(() => formatTime(now), [now]);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-[0.7rem] sm:text-xs font-medium">Real-time</span>
      <span className="text-[0.7rem] sm:text-xs text-slate-500 tabular-nums">{label}</span>
    </div>
  );
}

