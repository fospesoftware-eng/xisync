import { DollarSign, Target, MessageSquare, TrendingUp, ArrowUpRight } from 'lucide-react';

interface UltraQuickWidgetsProps {
  language: string;
}

export function UltraQuickWidgets({ language }: UltraQuickWidgetsProps) {
  const metrics = [
    {
      titleEn: 'Monthly Ad Spend',
      titleZh: '本月广告总消耗',
      value: '$43,200',
      change: '+14.2%',
      subtitleEn: 'Budget Pacing 82%',
      subtitleZh: '预算进度 82%',
      icon: DollarSign,
      color: 'text-xisync-cyan-400',
      bgGlow: 'from-xisync-cyan-500/20 to-xisync-blue-600/20',
      barPct: 82,
    },
    {
      titleEn: 'B2B Leads Captured',
      titleZh: '捕获 B2B 海外线索',
      value: '1,428',
      change: '+18.6%',
      subtitleEn: 'Avg CPL $30.2',
      subtitleZh: '单线索成本 $30.2',
      icon: Target,
      color: 'text-emerald-400',
      bgGlow: 'from-emerald-500/20 to-teal-600/20',
      barPct: 94,
    },
    {
      titleEn: 'Direct Inquiries',
      titleZh: 'WhatsApp 即时询盘',
      value: '722',
      change: '+31.0%',
      subtitleEn: '50.5% Conv Ratio',
      subtitleZh: '转化占比 50.5%',
      icon: MessageSquare,
      color: 'text-amber-400',
      bgGlow: 'from-amber-500/20 to-orange-600/20',
      barPct: 68,
    },
    {
      titleEn: 'Pipeline Deal Target',
      titleZh: '估算意向货值池',
      value: '$2.54M',
      change: '+26.4%',
      subtitleEn: '184 Qualified Deals',
      subtitleZh: '184 笔成效商机',
      icon: TrendingUp,
      color: 'text-xisync-lime-400',
      bgGlow: 'from-xisync-lime-500/20 to-emerald-600/20',
      barPct: 76,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className="relative group p-4 rounded-3xl bg-slate-950/70 backdrop-blur-2xl border border-white/15 shadow-2xl hover:border-white/35 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden text-white"
        >
          {/* Subtle Ambient Background Radial Glow */}
          <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-gradient-to-br ${m.bgGlow} filter blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-slate-300 truncate">
              {language === 'zh' ? m.titleZh : m.titleEn}
            </span>
            <div className="p-2 rounded-xl bg-white/10 border border-white/15">
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
          </div>

          <div className="mt-3 relative z-10">
            <div className="text-2xl font-extrabold tracking-tight text-white">{m.value}</div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-emerald-400 font-extrabold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> {m.change}
              </span>
              <span className="text-slate-400 font-mono">{language === 'zh' ? m.subtitleZh : m.subtitleEn}</span>
            </div>
          </div>

          {/* Mini Sparkline Bar */}
          <div className="mt-3 w-full bg-white/10 h-1.5 rounded-full overflow-hidden relative z-10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${m.bgGlow.replace('/20', '')} transition-all duration-500`}
              style={{ width: `${m.barPct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
