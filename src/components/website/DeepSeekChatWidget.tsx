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

// Product Knowledgebase
const TOY_CATALOG = [
  {
    id: 'toy-1',
    sku: 'ECO-TOY-BNY-01',
    name: { en: 'Organic Linen Plush Bunny', zh: '天然有机亚麻安抚小兔' },
    keywords: ['bunny', 'rabbit', 'plush', 'doll', 'linen', 'organic', '兔', '玩偶', '毛绒', '亚麻', '安抚兔'],
    description: {
      en: 'Handmade from 100% natural organic flax linen with hypoallergenic plant cotton filling. Certified CE EN71 & ASTM F963 for newborn safety.',
      zh: '选用100%纯天然有机亚麻与防过敏植物纤维手工缝制，通过欧盟 CE EN71 与北美 ASTM 婴童安全认证。',
    },
    retailPrice: 34,
    wholesaleTier1: 28.9, // MOQ 50-499
    wholesaleTier2: 24.5, // MOQ 500+
    moq: 50,
    materials: '100% Organic Flax Linen & Plant Cotton',
    leadTime: '3-5 Days (In Stock) • 12 Days (Custom OEM Logo)',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    category: 'Plush & Dolls',
    certifications: 'CE EN71-1/2/3, ASTM F963-17, OEKO-TEX Standard 100',
  },
  {
    id: 'toy-2',
    sku: 'ECO-TOY-HRS-02',
    name: { en: 'Handmade Wooden Rocking Horse', zh: '手工实木摇摇木马' },
    keywords: ['horse', 'rocking', 'wooden', 'beechwood', 'wood', '马', '木马', '实木', '摇马'],
    description: {
      en: 'Crafted from sustainable European beechwood with food-grade beeswax polish. Smooth ergonomic anti-collision curves.',
      zh: '精选欧洲可持续山毛榉实木纯手工打磨，采用食用级天然蜂蜡抛光，温润防撞。',
    },
    retailPrice: 89,
    wholesaleTier1: 72.0,
    wholesaleTier2: 63.5,
    moq: 20,
    materials: 'FSC Solid Beechwood & Natural Beeswax',
    leadTime: '5-7 Days (In Stock) • 15 Days (Bulk Ocean)',
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
      en: 'Montessori early-learning wooden ring stacker dyed with food-safe non-toxic water pigments.',
      zh: '蒙特梭利早教启蒙叠叠塔，环保植物水性漆着色，锻炼婴幼儿精细手眼动作。',
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
      en: 'Solid beechwood rolling vehicle with silent rubber-lined smooth wheels.',
      zh: '高密度山毛榉原木小车，配备静音橡胶轮圈与光滑防刮边角。',
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
      en: 'Natural OEKO-TEX wool and cotton Waldorf dolls with removable organic cotton outfits.',
      zh: '天然 OEKO-TEX 羊毛棉布华德福布偶，服装均可自由脱换。',
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
      en: 'Interactive multi-sensory educational board for toddler fine motor skill development.',
      zh: '多功能实木精细动作感官训练板，启发幼儿空间与逻辑思维。',
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

export function DeepSeekChatWidget({ lang, currency: _currency, siteName: _siteName }: DeepSeekChatWidgetProps) {
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
          ? `👋 您好！我是工坊客户顾问。请问您想了解哪些实木玩具、有机毛绒玩偶，或是需要我为您核算批发价格与交期？`
          : `👋 Hello! Welcome to our workshop. Looking for specific wooden toys, organic plush items, or need a wholesale quote for your store?`,
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

  // Natural Human-like Conversational Reasoning
  const processDeepSeekAiResponse = (userQuery: string): Partial<ChatMessage> => {
    const q = userQuery.toLowerCase().trim();

    // 1. Human Escalation
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
            ? '好的，已为您接通我们的大客户经理 Sarah Chen。她已加入当前对话，您可以直接在此沟通打样与批量订货事宜。'
            : 'Certainly! Sarah Chen from our wholesale team is here with you now. How can we help with your custom order or shipping plans?',
        isEscalated: true,
      };
    }

    // 2. Product Specific Inquiries
    const matchedProduct = TOY_CATALOG.find((item) =>
      item.keywords.some((kw) => q.includes(kw)) ||
      item.name.en.toLowerCase().includes(q) ||
      item.name.zh.includes(q) ||
      q.includes(item.sku.toLowerCase())
    );

    if (matchedProduct) {
      const isZh = lang === 'zh';
      const productName = isZh ? matchedProduct.name.zh : matchedProduct.name.en;

      // Price / Quote Request
      const wantsPrice =
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

      if (wantsPrice) {
        return {
          text: isZh
            ? `关于 **${productName}**，我们的常规批发起订量是 ${matchedProduct.moq} 件，单价 $${matchedProduct.wholesaleTier1} 美元；如果订购 500 件以上，工厂直供单价为 **$${matchedProduct.wholesaleTier2} 美元**（包含 OEM 包装定制）。\n\n我已为您整理好初步的 Proforma 报价如下：`
            : `For the **${productName}**, our wholesale MOQ starts at ${matchedProduct.moq} units ($${matchedProduct.wholesaleTier1}/unit). For orders of 500 units or more, our direct factory price is **$${matchedProduct.wholesaleTier2} USD/unit** with custom packaging included.\n\nHere is your quote summary:`,
          isQuoteCard: true,
          quoteData: {
            productName: `${productName} (${matchedProduct.sku})`,
            sku: matchedProduct.sku,
            quantity: 500,
            unitPrice: matchedProduct.wholesaleTier2,
            totalAmount: Math.round(500 * matchedProduct.wholesaleTier2),
            incoterm: 'FOB Shanghai',
            leadTime: matchedProduct.leadTime,
            shippingPort: 'Shanghai Port (CNSHA) → Rotterdam / Los Angeles',
          },
        };
      }

      // Natural Product Introduction
      return {
        text: isZh
          ? `有的！这款 **${productName}** 是我们工坊的热门款。采用纯天然有机亚麻与植物棉手工缝制，不仅触感温润亲肤，还通过了欧盟 CE EN71 和北美 ASTM 认证。\n\n目前样品和小批量订单 3-5 天即可出库，批发起订量为 ${matchedProduct.moq} 件。需要我为您出具一份详细的批发报价单吗？`
          : `Yes, absolutely! Our **${productName}** is handcrafted using 100% natural organic flax linen and hypoallergenic plant cotton. It meets full CE EN71 and ASTM F963 safety standards for baby and toddler use.\n\nWe have stock ready to ship in 3-5 days, with wholesale MOQ starting at just ${matchedProduct.moq} units. Would you like me to prepare a quick quote for your expected volume?`,
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

    // 3. General Wholesale & Pricing
    if (
      q.includes('price') ||
      q.includes('quote') ||
      q.includes('discount') ||
      q.includes('cost') ||
      q.includes('moq') ||
      q.includes('报价') ||
      q.includes('价格') ||
      q.includes('折扣') ||
      q.includes('批发')
    ) {
      return {
        text:
          lang === 'zh'
            ? '我们工坊所有玩具均支持阶梯批发折扣（500件以上享优惠工厂价，2000件以上支持整柜特惠），且免费提供品牌定制打样。\n\n以我们的畅销有机小兔为例，500件起订单价为 $24.50 美元，您可以参考以下报价：'
            : 'We offer flexible wholesale volume tiers across our entire catalog (15% off for 500+ units, and 25% off for 20ft container orders), with custom branding included.\n\nHere is an example quote for 500 units of our bestselling Organic Plush Bunny:',
        isQuoteCard: true,
        quoteData: {
          productName: 'Organic Linen Plush Bunny (Custom OEM / FSC Beechwood)',
          sku: 'ECO-TOY-BNY-01',
          quantity: 500,
          unitPrice: 24.5,
          totalAmount: 12250,
          incoterm: 'FOB Shanghai',
          leadTime: '12-15 Business Days',
          shippingPort: 'Shanghai Port (CNSHA) → Rotterdam / Los Angeles',
        },
      };
    }

    // 4. Shipping & Logistics
    if (
      q.includes('ship') ||
      q.includes('freight') ||
      q.includes('container') ||
      q.includes('delivery') ||
      q.includes('fob') ||
      q.includes('cif') ||
      q.includes('port') ||
      q.includes('海运') ||
      q.includes('运输') ||
      q.includes('港口')
    ) {
      return {
        text:
          lang === 'zh'
            ? '我们主要从上海港或宁波舟山港装船出运，与中远海运 (COSCO) 和马士基 (Maersk) 长期合作。到美西洛杉矶约 14 天，到欧洲鹿特丹约 24 天，支持 FOB、CIF 及双清包税送仓 (DDP)。'
            : 'We ship regularly from Shanghai and Ningbo ports via COSCO and Maersk. Typical transit times are ~14 days to US West Coast and ~24 days to Rotterdam (EU). We support FOB, CIF, and DDP (door-to-door delivery).',
      };
    }

    // 5. Safety & Certifications
    if (
      q.includes('safety') ||
      q.includes('cert') ||
      q.includes('test') ||
      q.includes('en71') ||
      q.includes('astm') ||
      q.includes('oeko') ||
      q.includes('安全') ||
      q.includes('认证') ||
      q.includes('检测')
    ) {
      return {
        text:
          lang === 'zh'
            ? '我们的产品均符合国际高标准安全法规：通过了欧盟 CE EN71-1/2/3、北美 ASTM F963-17 及 OEKO-TEX 100 环保认证，所有木制品均使用可持续 FSC 山毛榉与食品级蜂蜡，每批大货均附带 SGS / TÜV 检测报告。'
            : 'All our products comply strictly with international toy directives: CE EN71-1/2/3 in Europe, ASTM F963-17 in North America, and OEKO-TEX Standard 100 for textiles. We use only FSC-certified beechwood and non-toxic water-based paints, with SGS/TÜV test reports provided.',
      };
    }

    // 6. Default Friendly Fallback
    return {
      text:
        lang === 'zh'
          ? '请问您是对我们哪款玩具（如有机亚麻小兔、实木木马、蒙氏叠叠塔）感兴趣，还是想了解具体订货量与海运方案？随时告诉我，我来为您解答。'
          : 'Are you interested in a specific toy (like our organic plush bunny, wooden rocking horse, or Montessori stacker), or would you like to discuss shipping and bulk order quantities?',
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
                  {isEscalated ? (lang === 'zh' ? 'Sarah Chen (大客户经理)' : 'Sarah Chen (Account Manager)') : 'Eco-Toys Workshop'}
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
                            ? '您好！我是大客户经理 Sarah Chen。请问您有什么订单或打样需求？'
                            : 'Hi! Sarah Chen from our sales team here. How can I assist with your order?',
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

                  {/* Clean Visual Product Card */}
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
                        <span>Get 500 pcs Wholesale Quote</span>
                      </button>
                    </div>
                  )}

                  {/* Clean Proforma Quote Card */}
                  {m.isQuoteCard && m.quoteData && (
                    <div className="mt-3 p-3 rounded-2xl bg-[#F0F7FA] border border-[#D0E5F0] space-y-2 text-[11px] text-slate-800">
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
                          <span>Unit Price (FOB):</span>
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
                <span>Typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => {
                setInputVal(lang === 'zh' ? '有机亚麻安抚小兔的批发价格和材质？' : 'Tell me about the organic plush bunny and price');
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
