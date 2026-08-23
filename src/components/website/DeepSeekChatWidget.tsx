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
  Package,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'agent';
  text: string;
  timestamp: string;
  isProductCard?: boolean;
  productData?: {
    name: string;
    sku: string;
    category: string;
    retailPrice: number;
    wholesaleTier1: number;
    wholesaleTier2: number;
    moq: number;
    materials: string;
    leadTime: string;
    image: string;
    certifications: string;
  };
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

// Product Knowledgebase for DeepSeek AI
const TOY_CATALOG = [
  {
    id: 'toy-1',
    sku: 'ECO-TOY-BNY-01',
    name: { en: 'Organic Linen Plush Bunny', zh: '天然有机亚麻安抚小兔' },
    keywords: ['bunny', 'rabbit', 'plush', 'doll', 'linen', 'organic', '兔', '玩偶', '毛绒', '亚麻', '安抚兔'],
    description: {
      en: 'Handmade organic linen rabbit doll with hypoallergenic plant-based cotton filling. CE & ASTM certified.',
      zh: '纯手工天然有机亚麻安抚兔，植物棉填充，符合欧盟 CE 及北美 ASTM 婴童标准。',
    },
    retailPrice: 34,
    wholesaleTier1: 28.9, // 100 - 499 units
    wholesaleTier2: 24.5, // 500+ units
    moq: 50,
    materials: '100% Organic Flax Linen & Plant Cotton',
    leadTime: '3-5 Days (In Stock) / 12 Days (Custom OEM Logo)',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    category: 'Plush & Dolls',
    certifications: 'CE EN71-1/2/3, ASTM F963-17, OEKO-TEX 100',
  },
  {
    id: 'toy-2',
    sku: 'ECO-TOY-HRS-02',
    name: { en: 'Handmade Wooden Rocking Horse', zh: '手工实木摇摇木马' },
    keywords: ['horse', 'rocking', 'wooden', 'beechwood', 'wood', '马', '木马', '实木', '摇马'],
    description: {
      en: 'Solid European beechwood rocking horse with food-grade beeswax polish. Ergonomic anti-collision edges.',
      zh: '欧洲进口山毛榉实木纯手工打磨木马，食品级天然蜂蜡抛光，防撞圆角。',
    },
    retailPrice: 89,
    wholesaleTier1: 72.0,
    wholesaleTier2: 63.5,
    moq: 20,
    materials: 'FSC Solid Beechwood & Natural Beeswax',
    leadTime: '5-7 Days (In Stock) / 15 Days (Bulk Ocean)',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    category: 'Wooden Toys',
    certifications: 'FSC Certified, CE EN71, ASTM F963-17',
  },
  {
    id: 'toy-3',
    sku: 'ECO-TOY-RNG-03',
    name: { en: 'Pastel Stacking Rings Tower', zh: '莫兰迪色彩虹叠叠塔' },
    keywords: ['stacking', 'rings', 'tower', 'montessori', 'rainbow', 'pastel', '叠叠塔', '套圈', '彩虹', '蒙特梭利'],
    description: {
      en: 'Montessori early-learning wooden ring stacker dyed with water-based non-toxic natural pigments.',
      zh: '蒙特梭利早教启蒙叠叠塔，环保植物水性漆着色，锻炼婴幼儿手眼协调。',
    },
    retailPrice: 28,
    wholesaleTier1: 22.5,
    wholesaleTier2: 18.9,
    moq: 50,
    materials: 'Solid Hardwood & Non-toxic Water Paint',
    leadTime: '3-5 Days',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    category: 'Montessori Early Learning',
    certifications: 'CE EN71, Non-Toxic Paint Test Report',
  },
  {
    id: 'toy-4',
    sku: 'ECO-TOY-CAR-04',
    name: { en: 'Natural Beechwood Toy Car', zh: '天然山毛榉木质小汽车' },
    keywords: ['car', 'vehicle', 'truck', 'beechwood', 'auto', '车', '小汽车', '木车'],
    description: {
      en: 'FSC-certified hardwood rolling vehicle with silent rubber-lined smooth wheels.',
      zh: 'FSC 认证高密度原木小车，配备静音橡胶轮圈。',
    },
    retailPrice: 22,
    wholesaleTier1: 17.5,
    wholesaleTier2: 14.8,
    moq: 100,
    materials: 'Natural Beechwood & Silent Rubber Tires',
    leadTime: '2-4 Days',
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80',
    category: 'Wooden Toys',
    certifications: 'CE EN71, ASTM F963-17',
  },
  {
    id: 'toy-5',
    sku: 'ECO-TOY-WLD-05',
    name: { en: 'Handcrafted Waldorf Rag Dolls (Pair)', zh: '手工华德福布艺娃娃组合' },
    keywords: ['doll', 'waldorf', 'rag doll', 'plush', 'pair', '布偶', '娃娃', '华德福', '布艺'],
    description: {
      en: 'Natural OEKO-TEX wool and cotton Waldorf dolls with removable organic cotton clothing.',
      zh: '天然 OEKO-TEX 认证羊毛棉布华德福布偶，服装可脱换。',
    },
    retailPrice: 65,
    wholesaleTier1: 52.0,
    wholesaleTier2: 44.0,
    moq: 30,
    materials: 'Organic Wool, Cotton & Linen',
    leadTime: '4-6 Days',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    category: 'Plush & Dolls',
    certifications: 'OEKO-TEX Standard 100, CE EN71',
  },
  {
    id: 'toy-6',
    sku: 'ECO-TOY-BSY-06',
    name: { en: 'Sensory Wooden Activity Busy Board', zh: '多功能蒙氏实木感官忙碌板' },
    keywords: ['busy board', 'sensory', 'activity', 'montessori', 'board', '忙碌板', '感官板', '早教板'],
    description: {
      en: 'Interactive multi-sensory educational board for motor skill development in toddlers.',
      zh: '多功能实木精细动作感官训练板，启发幼儿空间思维。',
    },
    retailPrice: 95,
    wholesaleTier1: 76.0,
    wholesaleTier2: 66.5,
    moq: 20,
    materials: 'Solid Basswood & Stainless Metal Parts',
    leadTime: '5-8 Days',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80',
    category: 'Montessori Early Learning',
    certifications: 'CE EN71, ASTM F963-17, CPSIA',
  },
];

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
          ? `👋 您好！我是 ${siteName} 的 AI 贸易助手。随时向我咨询有机玩偶、实木玩具、批发报价、MOQ、海运物流及安全认证。`
          : `👋 Hello! Welcome to ${siteName}. How can I assist you with organic plush toys, wooden games, wholesale pricing, MOQ quotes, or shipping lead times today?`,
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

  // DeepSeek AI Semantic Knowledge Retrieval & Reasoning Engine
  const processDeepSeekAiResponse = (userQuery: string): Partial<ChatMessage> => {
    const q = userQuery.toLowerCase().trim();

    // 1. Human Agent Escalation
    if (
      q.includes('human') ||
      q.includes('agent') ||
      q.includes('manager') ||
      q.includes('person') ||
      q.includes('representative') ||
      q.includes('talk to someone') ||
      q.includes('人工') ||
      q.includes('客服') ||
      q.includes('经理') ||
      q.includes('转接')
    ) {
      setIsEscalated(true);
      return {
        text:
          lang === 'zh'
            ? '🤝 已为您接通资深外贸大客户总监（Sarah Chen）。经理已进入会话，您可以直接在此沟通定制打样或信用账期！'
            : '🤝 Senior Export Account Director (Sarah Chen) is now connected to this chat. She will review your custom OEM and trade terms directly.',
        isEscalated: true,
      };
    }

    // 2. Product Catalog Search & Matching
    const matchedProduct = TOY_CATALOG.find((item) =>
      item.keywords.some((kw) => q.includes(kw)) ||
      item.name.en.toLowerCase().includes(q) ||
      item.name.zh.includes(q) ||
      q.includes(item.sku.toLowerCase())
    );

    if (matchedProduct) {
      const isZh = lang === 'zh';
      const productName = isZh ? matchedProduct.name.zh : matchedProduct.name.en;
      const desc = isZh ? matchedProduct.description.zh : matchedProduct.description.en;

      // If user is also asking for price/quote/wholesale
      const wantsQuote =
        q.includes('price') ||
        q.includes('quote') ||
        q.includes('cost') ||
        q.includes('discount') ||
        q.includes('wholesale') ||
        q.includes('moq') ||
        q.includes('报价') ||
        q.includes('价格') ||
        q.includes('批发') ||
        q.includes('多少钱');

      if (wantsQuote) {
        return {
          text: isZh
            ? `✨ **${productName}** (货号: \`${matchedProduct.sku}\`)\n\n• **起订量 (MOQ)**: ${matchedProduct.moq} 件\n• **小批量批发价**: $${matchedProduct.wholesaleTier1} USD/件 (100–499件)\n• **大批量工厂直供价**: $${matchedProduct.wholesaleTier2} USD/件 (≥500件)\n• **材质**: ${matchedProduct.materials}\n• **安全认证**: ${matchedProduct.certifications}\n• **生产交期**: ${matchedProduct.leadTime}\n\n已为您生成批量 Proforma 报价单如下：`
            : `✨ **${productName}** (SKU: \`${matchedProduct.sku}\`)\n\n• **MOQ**: ${matchedProduct.moq} units\n• **Tier 1 (100-499 units)**: $${matchedProduct.wholesaleTier1} USD/unit\n• **Tier 2 (≥500 units Bulk)**: $${matchedProduct.wholesaleTier2} USD/unit\n• **Materials**: ${matchedProduct.materials}\n• **Certifications**: ${matchedProduct.certifications}\n• **Lead Time**: ${matchedProduct.leadTime}\n\nHere is your official Proforma Quote breakdown:`,
          isQuoteCard: true,
          quoteData: {
            productName: `${productName} (${matchedProduct.sku})`,
            sku: matchedProduct.sku,
            quantity: 500,
            unitPrice: matchedProduct.wholesaleTier2,
            totalAmount: Math.round(500 * matchedProduct.wholesaleTier2),
            incoterm: 'FOB Shanghai (CNSHA)',
            leadTime: matchedProduct.leadTime,
            shippingPort: 'Shanghai Port (CNSHA) → Rotterdam / Los Angeles',
          },
        };
      }

      // Return Rich Product Card
      return {
        text: isZh
          ? `🧸 找到了！我们工坊生产 **${productName}**。\n\n${desc}\n\n• **材质**: ${matchedProduct.materials}\n• **零售指导价**: $${matchedProduct.retailPrice} USD\n• **批发起始 MOQ**: ${matchedProduct.moq} 件 ($${matchedProduct.wholesaleTier1}/件)\n• **国际认证**: ${matchedProduct.certifications}\n• **交期**: ${matchedProduct.leadTime}\n\n需要我为您出具大批量采购的 Proforma 报价单或核算海运箱规吗？`
          : `🧸 Yes, we manufacture the **${productName}**!\n\n${desc}\n\n• **Materials**: ${matchedProduct.materials}\n• **Sample/Retail Price**: $${matchedProduct.retailPrice} USD\n• **Wholesale MOQ**: ${matchedProduct.moq} units (from $${matchedProduct.wholesaleTier1}/unit)\n• **Certifications**: ${matchedProduct.certifications}\n• **Lead Time**: ${matchedProduct.leadTime}\n\nWould you like me to prepare an official Proforma Invoice or calculate container ocean freight?`,
        isProductCard: true,
        productData: {
          name: productName,
          sku: matchedProduct.sku,
          category: matchedProduct.category,
          retailPrice: matchedProduct.retailPrice,
          wholesaleTier1: matchedProduct.wholesaleTier1,
          wholesaleTier2: matchedProduct.wholesaleTier2,
          moq: matchedProduct.moq,
          materials: matchedProduct.materials,
          leadTime: matchedProduct.leadTime,
          image: matchedProduct.image,
          certifications: matchedProduct.certifications,
        },
      };
    }

    // 3. General Wholesale & Pricing Inquiries
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
            ? '📊 根据我们的外贸阶梯定价规则，所有玩具产品均支持阶梯批量折扣（≥500件享 8.5 折，≥2000件享 7.5 折），支持 OEM 定制 Logo 与彩盒包装。以下为您生成畅销安抚小兔的即时报价单：'
            : '📊 Based on our tiered factory export pricing (15% off for ≥500 units, 25% off for 20ft container loads), here is an instant Proforma Quote for our bestselling Organic Linen Bunny:',
        isQuoteCard: true,
        quoteData: {
          productName: 'Organic Linen Plush Bunny (Custom OEM / FSC Beechwood)',
          sku: 'ECO-TOY-BNY-01',
          quantity: 500,
          unitPrice: 24.5,
          totalAmount: 12250,
          incoterm: 'FOB Shanghai (CNSHA)',
          leadTime: '12-15 Business Days',
          shippingPort: 'Shanghai Port (CNSHA) → Rotterdam / Los Angeles',
        },
      };
    }

    // 4. Shipping & Ocean Freight
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
            ? '🚢 **海运物流履约详情**：\n• **起运港 (POL)**: 上海港 (CNSHA) / 宁波舟山港 (CNNGB)\n• **合作船司**: 中远海运 (COSCO Direct) & 马士基 (Maersk)\n• **航程时效**: 美西(洛杉矶) 14天 | 欧洲(鹿特丹/汉堡) 24天 | 中东(杰贝阿里) 18天\n• **外箱规格**: 5层高强度加厚防潮瓦楞纸箱 (0.08 CBM/箱)\n• **条款支持**: FOB, CIF, DDP (含目的国清关及送仓)。'
            : '🚢 **Ocean Freight & Logistics Specifications**:\n• **Port of Loading (POL)**: Shanghai Port (CNSHA) / Ningbo-Zhoushan (CNNGB)\n• **Preferred Carriers**: COSCO Direct Ocean Line & Maersk\n• **Transit Times**: US West Coast (14 Days) | Europe Rotterdam (24 Days) | Middle East (18 Days)\n• **Packaging**: 5-ply reinforced export moisture-proof cartons (0.08 CBM/ctn)\n• **Incoterms**: FOB, CIF, DDP (Delivered Duty Paid to door).',
      };
    }

    // 5. Product Safety & Eco Certification
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
            ? '🌿 **国际品质与安全合规认证**：\n• **欧盟标准**: CE EN71-1, EN71-2, EN71-3 重金属无毒析出认证\n• **北美标准**: ASTM F963-17 & CPSIA 儿童玩具安全法案\n• **环保原材料**: 100% FSC 认证欧洲山毛榉木、食品级天然蜂蜡抛光、OEKO-TEX 100 纯天然有机亚麻\n• **质检报告**: 随每批出厂大货附带官方 SGS / TÜV 质检报告。'
            : '🌿 **International Safety & Compliance Standards**:\n• **European Directives**: CE EN71-1, EN71-2, EN71-3 (Zero heavy metal toxicity)\n• **North American Standards**: ASTM F963-17 & CPSIA Child Safety Act Compliant\n• **Raw Materials**: 100% FSC-Certified European Beechwood, Food-grade beeswax polish, OEKO-TEX Standard 100 organic linen\n• **Inspection**: Official SGS / TÜV batch inspection test reports issued with every bill of lading.',
      };
    }

    // 6. Default Fallback with Helpful Guidance
    return {
      text:
        lang === 'zh'
          ? `🧸 您可以向我询问任何玩具信息，例如：\n• **“天然有机亚麻安抚小兔的批发价格和材质？”**\n• **“实木摇摇木马起订量多少？”**\n• **“到欧洲鹿特丹港的海运时效？”**\n• 或输入 **“转人工”** 联系客户经理。`
          : `🧸 You can ask me about any of our handcrafted toy products, such as:\n• **"Tell me about the organic plush bunny and wholesale pricing"**\n• **"What is the MOQ for the wooden rocking horse?"**\n• **"Shipping time and container freight to Rotterdam?"**\n• Or type **"human agent"** to speak with our sales manager.`,
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
        text: response.text || '',
        timestamp: 'Just now',
        isProductCard: response.isProductCard,
        productData: response.productData,
        isQuoteCard: response.isQuoteCard,
        quoteData: response.quoteData,
        isEscalated: response.isEscalated,
      };

      setMessages((prev) => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 600);
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
        <div className="w-[360px] sm:w-[410px] h-[560px] rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="px-5 py-4 bg-[#1E3A5F] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                {isEscalated ? <UserCheck className="w-4 h-4 text-emerald-300" /> : <MessageCircle className="w-4 h-4" />}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#1E3A5F]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  {isEscalated ? (lang === 'zh' ? 'Sarah Chen (外贸大客户经理)' : 'Sarah Chen (Account Manager)') : siteName}
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
                  className={`max-w-[88%] px-4 py-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1E3A5F] text-white rounded-br-xs font-medium'
                      : m.sender === 'agent'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-bl-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>

                  {/* Rich Product Details Card */}
                  {m.isProductCard && m.productData && (
                    <div className="mt-3 p-3 rounded-2xl bg-[#F0F7FA] border border-[#D0E5F0] space-y-2 text-[11px] text-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.productData.image}
                          alt={m.productData.name}
                          className="w-14 h-14 rounded-xl object-cover border border-white shadow-2xs"
                        />
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 text-xs">{m.productData.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">SKU: {m.productData.sku}</div>
                          <div className="text-[10px] font-bold text-emerald-600">
                            MOQ: {m.productData.moq} pcs • ${m.productData.wholesaleTier1}/unit
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1.5 border-t border-[#D0E5F0] text-slate-600">
                        <div>
                          <span className="text-slate-400">Lead Time:</span> {m.productData.leadTime}
                        </div>
                        <div>
                          <span className="text-slate-400">Category:</span> {m.productData.category}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const requestText = `Please generate formal wholesale quote for 500 units of ${m.productData?.name}`;
                          setInputVal(requestText);
                        }}
                        className="w-full mt-1 py-1.5 rounded-xl bg-[#1E3A5F] hover:bg-[#152a45] text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-all shadow-xs"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Request 500 pcs Bulk Quote</span>
                      </button>
                    </div>
                  )}

                  {/* Clean Proforma Quote Card */}
                  {m.isQuoteCard && m.quoteData && (
                    <div className="mt-3 p-3 rounded-2xl bg-[#F0F7FA] border border-[#D0E5F0] space-y-2 text-[11px] text-slate-800">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#D0E5F0] font-bold text-[#1E3A5F]">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Official Proforma Quote</span>
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
                          <span>Unit Price (FOB):</span>
                          <span className="font-bold text-emerald-600">${m.quoteData.unitPrice} USD</span>
                        </div>
                        <div className="flex justify-between text-slate-600 font-bold border-t border-[#D0E5F0] pt-1">
                          <span>Total Est. FOB Value:</span>
                          <span className="text-[#1E3A5F] font-bold">${m.quoteData.totalAmount.toLocaleString()} USD</span>
                        </div>
                      </div>

                      <div className="pt-1 text-[10px] text-slate-500 flex items-center gap-1">
                        <Ship className="w-3 h-3 text-[#1E3A5F]" />
                        <span>{m.quoteData.incoterm} • Lead Time {m.quoteData.leadTime}</span>
                      </div>

                      <button
                        onClick={() => alert('Official Proforma Quote PDF generated and sent to your email!')}
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
                <span>DeepSeek AI is searching catalog & pricing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => {
                setInputVal(lang === 'zh' ? '有机亚麻安抚小兔的产品详情和批发价格？' : 'Tell me about the organic plush bunny and price');
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-all flex items-center gap-1"
            >
              <Package className="w-3 h-3 text-[#1E3A5F]" />
              <span>{lang === 'zh' ? '🐰 有机小兔详情' : '🐰 Plush Bunny'}</span>
            </button>
            <button
              onClick={() => {
                setInputVal(lang === 'zh' ? '手工实木摇摇木马的材质和起订量？' : 'What is the MOQ and materials for the wooden rocking horse?');
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-all"
            >
              {lang === 'zh' ? '🐴 实木木马' : '🐴 Rocking Horse'}
            </button>
            <button
              onClick={() => {
                setInputVal(lang === 'zh' ? '到欧洲鹿特丹港的海运时效和装柜规格？' : 'Ocean freight and transit times to Rotterdam?');
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-all"
            >
              {lang === 'zh' ? '🚢 海运时效' : '🚢 Shipping Info'}
            </button>
            <button
              onClick={() => {
                setInputVal(lang === 'zh' ? 'CE 与 ASTM 玩具安全认证资质？' : 'CE & ASTM Safety Certifications?');
              }}
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
              placeholder={lang === 'zh' ? '询问产品、价格、交期，或输入“转人工”...' : 'Ask about products, pricing, or type "agent"...'}
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
