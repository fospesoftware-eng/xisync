import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Clock,
  Zap,
} from 'lucide-react';
import { TreasuryFxEngine, DetailedFxQuote } from '../../../lib/treasury/treasuryFxEngine';

interface TreasuryLiveFxCardProps {
  onQuoteUpdated?: (quote: DetailedFxQuote) => void;
}

export function TreasuryLiveFxCard({ onQuoteUpdated }: TreasuryLiveFxCardProps) {
  const [fxQuote, setFxQuote] = useState<DetailedFxQuote | null>(null);
  const [countdown, setCountdown] = useState(900);
  const [loading, setLoading] = useState(false);
  const [sampleCny, setSampleCny] = useState(20000);

  const fetchQuote = async () => {
    setLoading(true);
    const quote = await TreasuryFxEngine.getInstitutionalQuote();
    setFxQuote(quote);
    setCountdown(900);
    setLoading(false);
    if (onQuoteUpdated) onQuoteUpdated(quote);
  };

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const rate = fxQuote?.effectiveConversionRate || 7.235;
  const grossUsd = sampleCny / rate;
  const marginUsd = grossUsd * 0.20;
  const netAdUsd = grossUsd - marginUsd;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-900/50 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-400 text-slate-950 font-black shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                Cross-Border Treasury FX Oracle
              </span>
            </div>
            <h3 className="text-lg font-black text-white">
              实时离岸汇率结算与 20% 平台服务费自动分账引擎
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono flex items-center gap-2 border border-white/10">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>报价锁定倒计时: <strong className="text-cyan-300">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</strong></span>
          </div>

          <button
            onClick={fetchQuote}
            disabled={loading}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            title="刷新最新汇率"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Math Formulation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-slate-400 font-sans">现汇中间汇率 (USD/CNY)</div>
          <div className="text-xl font-black text-cyan-400">1 USD = {rate.toFixed(4)} CNY</div>
          <div className="text-[10px] text-slate-500 font-sans">中国人民银行 (PBOC) 实时基准</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-slate-400 font-sans">充值折算毛美元 (Gross USD)</div>
          <div className="text-xl font-black text-white">${grossUsd.toFixed(2)} USD</div>
          <div className="text-[10px] text-slate-500 font-sans">公式: Deposit CNY ÷ FX Rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-slate-400 font-sans">平台服务费 (20% Margin)</div>
          <div className="text-xl font-black text-indigo-300">-${marginUsd.toFixed(2)} USD</div>
          <div className="text-[10px] text-slate-500 font-sans">公式: Gross USD × 0.20</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 space-y-1">
          <div className="text-emerald-300 font-sans font-bold">实际可用广告投放金 (Net Budget)</div>
          <div className="text-xl font-black text-emerald-400">${netAdUsd.toFixed(2)} USD</div>
          <div className="text-[10px] text-emerald-300/80 font-sans">100% 存入广告网络消耗钱包</div>
        </div>
      </div>

      {/* Interactive Simulation Slider */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-950 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold font-sans text-slate-300">交互式充值金额预估与分账测算 (CNY Simulation):</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">¥{sampleCny.toLocaleString()} CNY</span>
        </div>

        <input
          type="range"
          min="1000"
          max="200000"
          step="1000"
          value={sampleCny}
          onChange={(e) => setSampleCny(parseInt(e.target.value))}
          className="w-full accent-cyan-400"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span>¥1,000 (试投)</span>
          <span>¥50,000 (标准月度)</span>
          <span>¥200,000 (大宗大客)</span>
        </div>
      </div>
    </div>
  );
}
