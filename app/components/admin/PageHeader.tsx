type PageHeaderProps = {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="font-semibold text-slate-900 text-xl">{title}</h1>
        <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
