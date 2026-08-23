import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  FileText,
  Ship,
  UserCheck,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'agent';
  text: string;
  timestamp: string;
  isQuoteCard?: boolean;
  quoteData?: {
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    incoterm: string;
    leadTime: string;
    shippingPort: string;
  };
  isEscalated?: boolean;
}

interface DeepSeekChatWidgetProps {
  lang: 'en' | 'zh';
  currency: string;
  siteName: string;
}

export function DeepSeekChatWidget({ lang, currency: _currency, siteName }: DeepSeekChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text:
        lang === 'zh'
          ? `👋 您好！我是 ${siteName} 的 DeepSeek AI 贸易助理。我可以为您提供即时产品参数、阶梯批发报价（MOQ）、自主议价与海运集装箱运费测算。请问您正在寻找什么玩具或产品？`
          : `👋 Hello! I am the DeepSeek AI Trade Assistant for ${siteName}. I can provide instant product specs, wholesale tiered quotes, MOQ negotiations, and ocean container freight calculations. What items are you interested in today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // DeepSeek AI Intelligent Natural Language & Negotiation Reasoning Engine
  const processDeepSeekAiResponse = (userQuery: string) => {
    const q = userQuery.toLowerCase();

    // 1. Check for Human Agent Escalation Trigger
    if (
      q.includes('human') ||
      q.includes('agent') ||
      q.includes('manager') ||
      q.includes('person') ||
      q.includes('representative') ||
      q.includes('人工') ||
      q.includes('客服') ||
      q.includes('经理') ||
      q.includes('转接')
    ) {
      setIsEscalated(true);
      return {
        text:
          lang === 'zh'
            ? '🤝 没问题！已为您实时转接外贸资深大客户经理（Sarah Chen）。经理已接入当前会话，您可以继续在此沟通定制化模具与信用账期！'
            : '🤝 Certainly! I have escalated your session to our Senior Export Account Director (Sarah Chen). She has joined the chat and will review your custom OEM specifications directly.',
        isEscalated: true,
      };
    }

    // 2. Pricing, Discount & Autonomous Negotiation
    if (
      q.includes('price') ||
      q.includes('quote') ||
      q.includes('discount') ||
      q.includes('cost') ||
      q.includes('cheap') ||
      q.includes('negotiat') ||
      q.includes('offer') ||
      q.includes('报价') ||
      q.includes('价格') ||
      q.includes('折扣') ||
      q.includes('优惠') ||
      q.includes('议价') ||
      q.includes('便宜')
    ) {
      return {
        text:
          lang === 'zh'
            ? '📊 根据我们的外贸 AI 智能定价引擎，针对大批量采购（≥500件），已为您自动应用 8.5 折工厂直发优惠并生成正式 Proforma 报价单：'
            : '📊 Based on our AI pricing & autonomous margin engine, I have applied a tier-2 bulk discount (-15%) for batch orders ≥500 units and prepared your instant Proforma Quote:',
        isQuoteCard: true,
        quoteData: {
          productName: 'Organic Linen Plush Bunny (Custom OEM / FSC Beechwood)',
          sku: 'ECO-TOY-BNY-01',
          quantity: 500,
          unitPrice: 28.9,
          totalAmount: 14450,
          incoterm: 'FOB Shanghai (CNSHA)',
          leadTime: '12-15 Business Days',
          shippingPort: 'Shanghai Port (CNSHA) → Port of Rotterdam / Los Angeles',
        },
      };
    }

    // 3. Shipping, Logistics & Incoterms Inquiry
    if (
      q.includes('ship') ||
      q.includes('freight') ||
      q.includes('container') ||
      q.includes('delivery') ||
      q.includes('fob') ||
      q.includes('cif') ||
      q.includes('ddp') ||
      q.includes('port') ||
      q.includes('运输') ||
      q.includes('海运') ||
      q.includes('运费') ||
      q.includes('集装箱') ||
      q.includes('交期') ||
      q.includes('港口')
    ) {
      return {
        text:
          lang === 'zh'
            ? '🚢 **海运与物流履约信息**：\n• **起运港 (POL)**: 上海港 (CNSHA) / 宁波舟山港 (CNNGB)\n• **海运承运商**: 中远海运 (COSCO Direct Line) & 马士基 (Maersk)\n• **航程时效**: 洛杉矶港 14天 | 鹿特丹港 24天 | 杰贝阿里港 18天\n• **包装规格**: 5-ply 加厚防潮出口瓦楞纸箱 (0.08 CBM/箱)\n• **支持贸易条款**: FOB, CIF, DDP (含双清包税送仓)。'
            : '🚢 **Ocean Freight & Logistics Specifications**:\n• **Port of Loading (POL)**: Shanghai Port (CNSHA) / Ningbo-Zhoushan (CNNGB)\n• **Preferred Carriers**: COSCO Direct Ocean Line & Maersk Integrated\n• **Transit Times**: US West Coast (14 Days) | Rotterdam EU (24 Days) | Jebel Ali UAE (18 Days)\n• **Packaging**: 5-ply reinforced export moisture-proof cartons (0.08 CBM/carton)\n• **Supported Terms**: FOB, CIF, DDP (Delivered Duty Paid to door).',
      };
    }

    // 4. Product Safety & Eco Certification Inquiry
    if (
      q.includes('safety') ||
      q.includes('cert') ||
      q.includes('test') ||
      q.includes('en71') ||
      q.includes('astm') ||
      q.includes('oeko') ||
      q.includes('material') ||
      q.includes('wood') ||
      q.includes('安全') ||
      q.includes('认证') ||
      q.includes('检测') ||
      q.includes('环保') ||
      q.includes('材质') ||
      q.includes('木材')
    ) {
      return {
        text:
          lang === 'zh'
            ? '🌿 **国际品质与安全合规认证**：\n• **欧盟标准**: CE EN71-1, EN71-2, EN71-3 重金属无毒析出认证\n• **北美标准**: ASTM F963-17 & CPSIA 儿童玩具安全法案\n• **环保原材料**: 100% FSC 认证可持续山毛榉木、食用级天然蜂蜡抛光、OEKO-TEX 100 纯天然有机亚麻\n• **质检报告**: 随每批大货附带 SGS / TÜV 官方检测质检单。'
            : '🌿 **International Safety & Compliance Standards**:\n• **European Directives**: CE EN71-1, EN71-2, EN71-3 (Zero heavy metal toxicity)\n• **North American Standards**: ASTM F963-17 & CPSIA Child Safety Act Compliant\n• **Raw Materials**: 100% FSC-Certified European Beechwood, Food-grade beeswax polish, OEKO-TEX Standard 100 organic linen\n• **Inspection**: Official SGS / TÜV batch inspection test reports issued with every bill of lading.',
      };
    }

    // 5. Default General B2B Response
    return {
      text:
        lang === 'zh'
          ? `🤖 感谢您的咨询！我们的产品线涵盖有机毛绒玩偶、蒙特梭利实木益智玩具及定制 OEM/ODM 包装。\n\n您可随时让我为您计算 **集装箱装柜量 (CBM)**、出具 **实时折扣报价**，或输入 **“人工客服”** 转接外贸业务总监。`
          : `🤖 Thank you for your inquiry! Our factory specializes in organic plush dolls, Montessori wooden educational toys, and custom OEM/ODM packaging.\n\nFeel free to ask me for **container packing volume (CBM)**, **instant wholesale pricing**, or type **"human agent"** to connect directly with our export director.`,
    };
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newUserMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    // Simulate DeepSeek API processing latency
    setTimeout(() => {
      const response = processDeepSeekAiResponse(userText);
      const newAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: response.isEscalated ? 'agent' : 'ai',
        text: response.text,
        timestamp: 'Just now',
        isQuoteCard: response.isQuoteCard,
        quoteData: response.quoteData,
        isEscalated: response.isEscalated,
      };

      setMessages((prev) => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputVal(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-500 text-white font-extrabold text-xs shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20"
        >
          <div className="relative">
            <Bot className="w-5 h-5 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <span>{lang === 'zh' ? 'DeepSeek AI 贸易询价' : 'AI Wholesale & Instant Quote'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 uppercase tracking-widest font-mono">
            24/7 LIVE
          </span>
        </button>
      )}

      {/* Main Chat Interface Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Top Navigation Header */}
          <div className="p-4 bg-gradient-to-r from-[#1E3A5F] via-[#2A4D7A] to-[#122742] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-cyan-300 border border-white/20 font-black">
                {isEscalated ? <UserCheck className="w-5 h-5 text-emerald-400" /> : <Bot className="w-5 h-5 text-cyan-400" />}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">
                    {isEscalated ? (lang === 'zh' ? '客户总监 (Sarah Chen)' : 'Sarah Chen (Senior Account Dir.)') : `${siteName} AI Copilot`}
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    DEEPSEEK V3
                  </span>
                </div>
                <p className="text-[11px] text-cyan-100/80 font-medium">
                  {isEscalated
                    ? (lang === 'zh' ? '人工专员已接入' : 'Human Specialist Online')
                    : (lang === 'zh' ? '即时出具外贸报价 • 自主议价' : 'Instant Quotes • MOQ & Freight')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!isEscalated && (
                <button
                  onClick={() => {
                    setIsEscalated(true);
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `esc-${Date.now()}`,
                        sender: 'agent',
                        text:
                          lang === 'zh'
                            ? '🤝 客户总监 Sarah Chen 已接入当前对话。我正在查阅您的玩具定制与集装箱方案，请问有什么可以协助您？'
                            : '🤝 Senior Director Sarah Chen is now connected. I am reviewing your order requirements. How may I assist with your wholesale terms?',
                        timestamp: 'Just now',
                        isEscalated: true,
                      },
                    ]);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-all"
                  title="Transfer to Human Agent"
                >
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'zh' ? '转人工' : 'Human Agent'}</span>
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {m.sender === 'user' ? 'You' : m.sender === 'agent' ? 'Senior Director' : 'DeepSeek AI Copilot'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">• {m.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1E3A5F] text-white rounded-br-none shadow-xs font-medium'
                      : m.sender === 'agent'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 rounded-bl-none shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>

                  {/* Proforma Quote Card Component */}
                  {m.isQuoteCard && m.quoteData && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-cyan-200 dark:border-cyan-800/60 space-y-2 text-[11px] text-slate-800 dark:text-slate-200 font-mono">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                        <div className="font-bold flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
                          <FileText className="w-3.5 h-3.5" />
                          <span>OFFICIAL PROFORMA QUOTE</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-500 font-bold">
                          VALID 14 DAYS
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-slate-400 block">Product Item:</span>
                          <span className="font-bold font-sans text-slate-900 dark:text-white truncate block">
                            {m.quoteData.productName}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block">Order Volume:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {m.quoteData.quantity} Units (MOQ Tier 2)
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block">Unit Price (FOB):</span>
                          <span className="font-bold text-emerald-500 text-xs">
                            ${m.quoteData.unitPrice} USD
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block">Total Est. FOB Value:</span>
                          <span className="font-black text-cyan-500 text-xs">
                            ${m.quoteData.totalAmount.toLocaleString()} USD
                          </span>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[9px] text-slate-400 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Ship className="w-3 h-3 text-cyan-500" />
                          <span>POL: {m.quoteData.shippingPort}</span>
                        </div>
                        <div>Production Lead Time: {m.quoteData.leadTime}</div>
                      </div>

                      <button
                        onClick={() => alert(`Proforma Invoice PI-2026-9812 generated and emailed to buyer!`)}
                        className="w-full mt-1 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[10px] text-center shadow-xs transition-all"
                      >
                        Download Official Proforma PDF (1-Click)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="text-[11px] font-mono animate-pulse">DeepSeek AI is calculating quote & terms...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Trade Prompt Badges */}
          <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleQuickPrompt(lang === 'zh' ? '500件小兔玩偶的批发价格和交期是多少？' : 'What is the wholesale price & MOQ for 500 plush bunnies?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap"
            >
              💰 {lang === 'zh' ? '获取500件阶梯报价' : 'Wholesale Quote (500 pcs)'}
            </button>

            <button
              onClick={() => handleQuickPrompt(lang === 'zh' ? '到欧洲鹿特丹港的海运时效和装柜规格？' : 'Ocean freight transit time & packaging to Rotterdam port?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap"
            >
              🚢 {lang === 'zh' ? '海运时效与港口' : 'Ocean Freight & Port'}
            </button>

            <button
              onClick={() => handleQuickPrompt(lang === 'zh' ? '请出具 CE EN71 与 ASTM 玩具安全认证资质' : 'Provide CE EN71 & ASTM safety certifications')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap"
            >
              🛡️ {lang === 'zh' ? '玩具安全认证' : 'Safety Certs'}
            </button>
          </div>

          {/* Chat Input Field Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                lang === 'zh'
                  ? '询问产品参数、阶梯报价，或输入“转人工”...'
                  : 'Ask product specs, discount quotes, or type "agent"...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium outline-none focus:border-cyan-500"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 rounded-xl bg-[#1E3A5F] hover:bg-[#122742] disabled:opacity-40 text-white transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
