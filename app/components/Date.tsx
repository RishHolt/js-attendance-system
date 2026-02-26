"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";

function formatDate(d: Date) {
  return d.toLocaleDateString([], { weekday: "short", year: "numeric", month: "short", day: "2-digit" });
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString([], { year: "numeric", month: "short", day: "2-digit" });
}

function formatDateLong(d: Date) {
  return d.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

interface DateDisplayProps {
  className?: string;
  showIcon?: boolean;
  format?: "short" | "medium" | "long";
}

export default function DateDisplay({ className = "", showIcon = true, format = "medium" }: DateDisplayProps) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = window.setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => window.clearInterval(id);
  }, []);

  const dateLabel = useMemo(() => {
    switch (format) {
      case "short":
        return formatDateShort(now);
      case "long":
        return formatDateLong(now);
      default:
        return formatDate(now);
    }
  }, [now, format]);

  if (!mounted) {
    return (
      <div className={`inline-flex items-center gap-1 text-[0.65rem] sm:text-[0.7rem] text-slate-400 ${className}`}>
        <span className="text-right">----------</span>
        {showIcon && <Calendar className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 text-[0.65rem] sm:text-[0.7rem] text-slate-400 ${className}`}>
      <span className="text-right">{dateLabel}</span>
      {showIcon && <Calendar className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />}
    </div>
  );
}
