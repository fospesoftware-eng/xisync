import { useState, useEffect } from 'react';
import { Mic, Radio, Search } from 'lucide-react';

interface UltraCommandBarProps {
  userName: string;
  language: string;
  onSendPrompt: (prompt: string) => void;
}

export function UltraCommandBar({ userName, language, onSendPrompt }: UltraCommandBarProps) {
  const [promptText, setPromptText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setTimeString(now.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    onSendPrompt(promptText);
    setPromptText('');
  };

  const handleQuickPrompt = (qText: string) => {
    setPromptText(qText);
    onSendPrompt(qText);
  };

  const handleVoiceTrigger = () => {
    setIsRecording(true);
    setTimeout(() => {
      setPromptText(language === 'zh' ? '分析本周外贸获客 ROI 与风险订单' : "How's our performance this week?");
      setIsRecording(false);
    }, 1200);
  };

  const samplePrompts = [
    { textEn: "How's our performance this week?", textZh: '本周外贸获客与询盘转化如何？' },
    { textEn: 'Forecast Q3 pipeline & revenue gap', textZh: '预测 Q3 订单成效与营收缺口' },
    { textEn: 'Generate Meta & Google Ad Copies', textZh: '生成 Meta 与 Google 多语种广告文案' },
    { textEn: 'Check EU CE compliance risk cases', textZh: '排查出口欧盟 CE 资质合规风险订单' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Live System Status Pill */}
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-2xl border border-white/20 shadow-xl text-xs font-semibold text-slate-200">
        <span className="font-mono text-xisync-cyan-300 font-bold uppercase tracking-wider">{timeString || 'Friday, 03:42 PM'}</span>
        <span className="h-3 w-px bg-white/20" />
        <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[11px]">
          <Radio className="w-3 h-3 animate-pulse" />
          {language === 'zh' ? '全球实时遥测已就绪' : 'GLOBAL TELEMETRY ACTIVE'}
        </span>
      </div>

      {/* Hero Executive Title */}
      <div className="space-y-1">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-xl bg-gradient-to-r from-white via-xisync-cyan-100 to-slate-200 bg-clip-text text-transparent">
          {language === 'zh' ? `犀同步 全球外贸数字指挥中心` : `XiSync ULTRA Command Center`}
        </h1>
        <p className="text-sm font-semibold text-slate-300">
          {language === 'zh' ? `您好 ${userName}，今日实时抓取 48 条海外商机，广告 ROI 环比提升 +14.2%` : `Hello ${userName}, 48 overseas leads captured today. Ad ROI +14.2% DoD.`}
        </p>
      </div>

      {/* Animated Voice Visualizer (When Recording) */}
      {isRecording && (
        <div className="flex items-center justify-center gap-1.5 h-6 my-1">
          <div className="w-1 bg-xisync-cyan-400 h-full animate-bounce rounded-full" style={{ animationDelay: '0.1s' }} />
          <div className="w-1 bg-emerald-400 h-3/4 animate-bounce rounded-full" style={{ animationDelay: '0.2s' }} />
          <div className="w-1 bg-xisync-lime-400 h-full animate-bounce rounded-full" style={{ animationDelay: '0.3s' }} />
          <div className="w-1 bg-amber-400 h-1/2 animate-bounce rounded-full" style={{ animationDelay: '0.4s' }} />
          <div className="w-1 bg-xisync-cyan-400 h-full animate-bounce rounded-full" style={{ animationDelay: '0.5s' }} />
          <span className="text-xs font-mono text-xisync-cyan-300 ml-2 animate-pulse">
            {language === 'zh' ? '正在倾听语音指令...' : 'Listening to voice prompt...'}
          </span>
        </div>
      )}

      {/* Command Search Bar */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-2xl bg-slate-950/80 backdrop-blur-2xl border border-white/20 shadow-2xl p-2.5 transition-all duration-300 focus-within:border-xisync-cyan-400 focus-within:ring-2 focus-within:ring-xisync-cyan-400/40">
          <button
            type="button"
            onClick={handleVoiceTrigger}
            className={`p-2.5 rounded-xl transition-colors ${
              isRecording ? 'bg-red-500/80 text-white animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Voice Command"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={
              language === 'zh'
                ? '输入查询指令或搜索外贸数据 (例：分析本周获客转化率)...'
                : 'Search or send command to XiSync...'
            }
            className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 outline-none font-medium"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-500 text-white font-extrabold text-xs hover:opacity-95 transition-all shadow-lg flex-shrink-0 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{language === 'zh' ? '执行' : 'Execute'}</span>
          </button>
        </div>
      </form>

      {/* Quick Strategy Chips */}
      <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
        {samplePrompts.map((p, idx) => {
          const label = language === 'zh' ? p.textZh : p.textEn;
          return (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(label)}
              className="px-3.5 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-xl border border-white/15 hover:border-white/35 text-white/90 text-xs font-semibold hover:bg-slate-900 transition-all shadow-md hover:scale-105"
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
