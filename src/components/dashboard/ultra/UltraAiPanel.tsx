import { useState } from 'react';
import {
  Send,
  X,
  ChevronRight,
  Zap,
  Paperclip,
  Mic,
  Activity,
  Layers,
  TrendingUp,
} from 'lucide-react';

interface UltraAiPanelProps {
  language: string;
  onClose?: () => void;
  onExecuteAction: (actionName: string) => void;
}

export function UltraAiPanel({ language, onClose, onExecuteAction }: UltraAiPanelProps) {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'user',
      text: language === 'zh' ? '本周获客与订单预测分析' : "How's our performance this week?",
      time: '03:42 PM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    setTimeout(() => {
      const agentMsg = {
        sender: 'agent' as const,
        text:
          language === 'zh'
            ? '针对您的分析请求：广告 ROI 相比上周提升 +14.2%，WhatsApp 直接询盘增长 31%。已自动标记 37 条未跟进线索提交至团队追溯。'
            : 'Based on real-time data: Ad ROI increased +14.2% DoD. WhatsApp direct inquiries rose 31%. 37 leads auto-flagged for priority sales follow-up.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, agentMsg]);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-md h-full rounded-3xl bg-slate-950/70 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col text-white overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-500 flex items-center justify-center shadow-lg">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              Sync Widget
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-xisync-cyan-400/20 text-xisync-cyan-300 font-mono border border-xisync-cyan-400/30">
                v4.5
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">{language === 'zh' ? '外贸巡检与商机挂件' : 'Global Trade Intelligence Widget'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-slate-300 hover:text-white transition-all bg-white/10 border border-white/15"
            title="Close Sync Widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Insights Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
        <div className="text-center py-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layers className="w-7 h-7 text-xisync-cyan-300" />
            </div>
          </div>
          <h4 className="font-extrabold text-base mt-2 text-white">XiSync Intelligence</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {language === 'zh' ? '请在下方输入您的提问或查看巡检报告' : 'Please enter your request or review inspection reports'}
          </p>
        </div>

        {/* User Chat Query Bubble */}
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl ${
              msg.sender === 'user'
                ? 'bg-xisync-cyan-500/20 border border-xisync-cyan-400/30 text-xisync-cyan-100 ml-6 text-right font-medium'
                : 'bg-white/10 border border-white/15 text-white mr-6 text-left'
            }`}
          >
            <p className="leading-relaxed">{msg.text}</p>
            <span className="text-[9px] text-slate-400 block mt-1 font-mono">{msg.time}</span>
          </div>
        ))}

        {isProcessing && (
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-slate-300 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-xisync-cyan-400 animate-spin" />
            <span>{language === 'zh' ? '实时数据计算中...' : 'Processing real-time telemetry...'}</span>
          </div>
        )}

        {/* Real-Time Report Section */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-xisync-cyan-300 border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-xisync-cyan-400" />
              {language === 'zh' ? 'XiSync 业务巡检简报' : 'Performance Inspection Brief'}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
          </div>

          {/* 1. Lead Generation */}
          <div className="space-y-1">
            <h5 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <span className="text-xisync-cyan-400 font-mono">1.</span>
              {language === 'zh' ? '获客与归因分析 (Lead Generation):' : 'Lead Generation:'}
            </h5>
            <p className="text-slate-300 text-[11px] pl-4 leading-relaxed">
              {language === 'zh'
                ? '过去24h捕获 48 条海外线索，转化率 24%。检测到 37 条未合格线索正停留在东北区跟进团队 — 建议复核。'
                : '48 new in 24h, 24% conversion. 37 unqualified stuck with Northeastern team — review follow-up.'}
            </p>
          </div>

          {/* 2. Pipeline & Forecast */}
          <div className="space-y-1 pt-1">
            <h5 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <span className="text-emerald-400 font-mono">2.</span>
              {language === 'zh' ? '商机与业绩预测 (Pipeline & Forecast):' : 'Pipeline & Forecast:'}
            </h5>
            <p className="text-emerald-300 text-[11px] pl-4 leading-relaxed font-semibold">
              {language === 'zh'
                ? '周环比增长 +12%，新增 26 个商机，胜率 31%。距达成季度目标还需打通 5 笔订单（$130万目标）。'
                : '+12% week-over-week, 26 new opps, win rate 31%. Need 5 deals ($1.3M) to hit forecast.'}
            </p>
          </div>

          {/* 3. Customer Success & Risk */}
          <div className="space-y-1 pt-1">
            <h5 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <span className="text-amber-400 font-mono">3.</span>
              {language === 'zh' ? '供应链与出口合规 (Customer Success & Service):' : 'Customer Success & Service:'}
            </h5>
            <p className="text-slate-300 text-[11px] pl-4 leading-relaxed">
              {language === 'zh'
                ? '无重大海关扣关风险，12 批次出口货物需补充 CE 资质审核（主要集中在机械制造类）。'
                : 'No major issues, 12 cases at risk (mostly manufacturing & EU CE certificates).'}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onExecuteAction('Open forecast')}
              className="px-3 py-1.5 rounded-xl bg-xisync-cyan-500/20 hover:bg-xisync-cyan-500/40 text-xisync-cyan-300 border border-xisync-cyan-400/40 text-xs font-bold transition-all flex items-center gap-1"
            >
              <span>{language === 'zh' ? '打开预测看板' : 'Open forecast'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onExecuteAction('Auto-Optimize Campaigns')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold transition-all flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{language === 'zh' ? '自动调优广告' : 'Auto-Optimize'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Message Input Box (Creatio.ai style footer) */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-slate-900/60 flex items-center gap-2">
        <div className="flex items-center gap-1 text-slate-400 pl-1">
          <button type="button" className="p-1 hover:text-white transition-colors" title="Mic">
            <Mic className="w-3.5 h-3.5" />
          </button>
          <button type="button" className="p-1 hover:text-white transition-colors" title="Attach">
            <Paperclip className="w-3.5 h-3.5" />
          </button>
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={language === 'zh' ? '发送消息给 XiSync.ai...' : 'Message to XiSync.ai'}
          className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none font-medium px-2"
        />

        <button
          type="submit"
          className="p-2 rounded-xl bg-gradient-to-r from-xisync-cyan-500 to-xisync-blue-600 text-white hover:opacity-90 transition-all flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
