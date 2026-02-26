"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

interface TimeProps {
  className?: string;
  showIcon?: boolean;
  format?: "12h" | "24h";
}

export default function Time({ className = "", showIcon = true, format = "24h" }: TimeProps) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const timeLabel = useMemo(() => {
    if (format === "12h") {
      return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    }
    return formatTime(now);
  }, [now, format]);

  if (!mounted) {
    return (
      <div className={`inline-flex items-center gap-1 text-[0.7rem] sm:text-xs text-slate-500 tabular-nums ${className}`}>
        <span className="text-right">--:--:--</span>
        {showIcon && <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 text-[0.7rem] sm:text-xs text-slate-500 tabular-nums ${className}`}>
      <span className="text-right">{timeLabel}</span>
      {showIcon && <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />}
    </div>
  );
}
