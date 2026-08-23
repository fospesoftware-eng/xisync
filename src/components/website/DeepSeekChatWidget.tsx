import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  X,
  Sparkles,
  FileText,
  Ship,
  UserCheck,
  Download,
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
          ? `👋 您好！我是 ${siteName} 的 AI 贸易助手。随时向我咨询批发报价、阶梯折扣、海运物流及安全认证。`
          : `👋 Hello! Welcome to ${siteName}. How can I assist you with wholesale pricing, MOQ quotes, shipping lead times, or product certifications today?`,
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

  // DeepSeek AI Reasoning Engine
  const processDeepSeekAiResponse = (userQuery: string) => {
    const q = userQuery.toLowerCase();

    // 1. Human Agent Escalation
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
            ? '🤝 已为您接通资深大客户经理（Sarah Chen）。经理已进入会话，您可以直接在此沟通。'
            : '🤝 Senior Account Manager (Sarah Chen) is now connected to this chat and will assist you directly.',
        isEscalated: true,
      };
    }

    // 2. Pricing & Wholesale Negotiation
    if (
      q.includes('price') ||
      q.includes('quote') ||
      q.includes('discount') ||
      q.includes('cost') ||
      q.includes('cheap') ||
      q.includes('negotiat') ||
      q.includes('offer') ||
      q.includes('moq') ||
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
            ? '📊 已根据批量采购策略（≥500件）自动应用工厂 8.5 折批发价，以下为您的即时报价单：'
            : '📊 Here is your instant Proforma Quote with bulk wholesale pricing applied for 500 units:',
        isQuoteCard: true,
        quoteData: {
          productName: 'Organic Linen Plush Bunny (FSC Beechwood Custom OEM)',
          sku: 'ECO-TOY-BNY-01',
          quantity: 500,
          unitPrice: 28.9,
          totalAmount: 14450,
          incoterm: 'FOB Shanghai',
          leadTime: '12-15 Business Days',
          shippingPort: 'Shanghai Port (CNSHA) → Rotterdam / Los Angeles',
        },
      };
    }

    // 3. Shipping & Logistics
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
            ? '🚢 **海运物流详情**：\n• **起运港**: 上海港 / 宁波舟山港\n• **承运商**: 中远海运 (COSCO) & 马士基 (Maersk)\n• **海运时效**: 美西 14天 | 欧洲 24天 | 中东 18天\n• **条款支持**: FOB, CIF, DDP 送仓到门。'
            : '🚢 **Shipping & Freight Information**:\n• **Port of Loading**: Shanghai / Ningbo Port\n• **Carriers**: COSCO Direct Line & Maersk\n• **Transit Times**: US West Coast 14d | EU Rotterdam 24d | Middle East 18d\n• **Incoterms**: FOB, CIF, DDP (Delivered Duty Paid).',
      };
    }

    // 4. Product Safety & Eco Certification
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
            ? '🌿 **国际安全与环保资质**：\n• **CE EN71-1/2/3** (欧盟玩具安全标准)\n• **ASTM F963-17 & CPSIA** (北美儿童安全指令)\n• **FSC 认证** 纯天然欧洲山毛榉实木 & OEKO-TEX 100 有机亚麻。\n• 附带官方 SGS / TÜV 批量出厂质检报告。'
            : '🌿 **Safety & Compliance Standards**:\n• **CE EN71-1/2/3** (European Toy Directive)\n• **ASTM F963-17 & CPSIA** (North American Child Safety Standards)\n• **FSC-Certified** European Beechwood & OEKO-TEX 100 organic linen.\n• Official SGS / TÜV batch test inspection reports included.',
      };
    }

    // 5. Default Response
    return {
      text:
        lang === 'zh'
          ? `您可以随时让我为您出具产品报价、计算集装箱容积，或输入“转人工”联系客户经理。`
          : `You can ask me for product pricing, container freight estimates, or type "agent" to speak with our sales manager.`,
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
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Clean, Minimalist & Premium Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Chat"
          className="w-14 h-14 rounded-full bg-[#1E3A5F] hover:bg-[#152a45] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/80 relative"
        >
          <MessageCircle className="w-6 h-6 stroke-[2.2]" />
          <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1E3A5F]" />
        </button>
      )}

      {/* Premium Minimalist Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[390px] h-[540px] rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="px-5 py-4 bg-[#1E3A5F] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                {isEscalated ? <UserCheck className="w-4 h-4 text-emerald-300" /> : <MessageCircle className="w-4 h-4" />}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#1E3A5F]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  {isEscalated ? (lang === 'zh' ? 'Sarah Chen (客户经理)' : 'Sarah Chen (Account Manager)') : siteName}
                </h3>
                <p className="text-[11px] text-slate-300">
                  {isEscalated ? (lang === 'zh' ? '人工专员在线' : 'Live Specialist') : (lang === 'zh' ? '通常即时回复' : 'Typically replies instantly')}
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
                            ? '🤝 客户经理 Sarah Chen 已接入当前对话。请问有什么可以协助您？'
                            : '🤝 Sarah Chen is now connected. How may I assist you with your order?',
                        timestamp: 'Just now',
                        isEscalated: true,
                      },
                    ]);
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white transition-all mr-1"
                >
                  {lang === 'zh' ? '转人工' : 'Human'}
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

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1E3A5F] text-white rounded-br-xs font-medium'
                      : m.sender === 'agent'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-bl-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>

                  {/* Clean Proforma Quote Card */}
                  {m.isQuoteCard && m.quoteData && (
                    <div className="mt-3 p-3 rounded-xl bg-[#F0F7FA] border border-[#D0E5F0] space-y-2 text-[11px] text-slate-800">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#D0E5F0] font-bold text-[#1E3A5F]">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Proforma Quote</span>
                        </span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          Valid 14 Days
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="font-semibold text-slate-900">{m.quoteData.productName}</div>
                        <div className="flex justify-between text-slate-600">
                          <span>Quantity:</span>
                          <span className="font-bold text-slate-900">{m.quoteData.quantity} pcs</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Unit Price:</span>
                          <span className="font-bold text-emerald-600">${m.quoteData.unitPrice} USD</span>
                        </div>
                        <div className="flex justify-between text-slate-600 font-bold border-t border-[#D0E5F0] pt-1">
                          <span>Total FOB:</span>
                          <span className="text-[#1E3A5F] font-bold">${m.quoteData.totalAmount.toLocaleString()} USD</span>
                        </div>
                      </div>

                      <div className="pt-1 text-[10px] text-slate-500 flex items-center gap-1">
                        <Ship className="w-3 h-3 text-[#1E3A5F]" />
                        <span>{m.quoteData.incoterm} • Lead Time {m.quoteData.leadTime}</span>
                      </div>

                      <button
                        onClick={() => alert('Official Proforma Quote PDF sent to your email!')}
                        className="w-full mt-1.5 py-2 rounded-xl bg-[#1E3A5F] hover:bg-[#152a45] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Quote PDF</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 w-fit text-slate-400 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#1E3A5F] animate-spin" />
                <span>Typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => setInputVal(lang === 'zh' ? '500件小兔玩偶的批发报价？' : 'Wholesale quote for 500 plush bunnies?')}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-all"
            >
              {lang === 'zh' ? '💰 500件报价' : '💰 500 pcs Quote'}
            </button>
            <button
              onClick={() => setInputVal(lang === 'zh' ? '海运时效与港口说明' : 'Ocean freight and transit times')}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-all"
            >
              {lang === 'zh' ? '🚢 海运时效' : '🚢 Shipping Info'}
            </button>
            <button
              onClick={() => setInputVal(lang === 'zh' ? 'CE 与 ASTM 玩具安全认证' : 'CE & ASTM Safety Certifications')}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-all"
            >
              {lang === 'zh' ? '🛡️ 安全认证' : '🛡️ Safety Certs'}
            </button>
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={lang === 'zh' ? '输入消息，或输入“转人工”...' : 'Write a message...'}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 border-none text-xs text-slate-900 font-medium outline-none focus:ring-1 focus:ring-[#1E3A5F]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-8 h-8 rounded-xl bg-[#1E3A5F] hover:bg-[#152a45] disabled:opacity-30 text-white flex items-center justify-center transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
