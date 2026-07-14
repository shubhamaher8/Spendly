export default function SummaryCard({ title, amount, color, icon }) {
  const configs = {
    green: {
      gradient: 'from-emerald-500/20 to-emerald-600/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'glow-emerald',
      iconBg: 'bg-emerald-500/20'
    },
    red: {
      gradient: 'from-rose-500/20 to-rose-600/5',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'glow-rose',
      iconBg: 'bg-rose-500/20'
    },
    blue: {
      gradient: 'from-indigo-500/20 to-indigo-600/5',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      glow: 'glow-indigo',
      iconBg: 'bg-indigo-500/20'
    }
  };

  const config = configs[color];

  return (
    <div className={`glass-card p-6 ${config.glow} animate-fade-in hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold font-mono ${config.text}`}>
            Rs. {Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
