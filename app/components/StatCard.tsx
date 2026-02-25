type StatCardProps = {
  label: string;
  value?: string;
  helperText?: string;
};

export default function StatCard({
  label,
  value = "—",
  helperText = "Placeholder metric",
}: StatCardProps) {
  return (
    <div className="bg-white p-5 border border-slate-100 rounded-2xl">
      <div className="text-slate-500 text-xs">{label}</div>
      <div className="mt-2 font-semibold text-slate-900 text-2xl">{value}</div>
      <div className="mt-1 text-slate-400 text-xs">{helperText}</div>
    </div>
  );
}

