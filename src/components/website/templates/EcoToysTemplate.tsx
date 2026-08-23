import { useState } from 'react';
import { Website, LanguageCode } from '../../../types/websiteBuilder';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Send,
  ShieldCheck,
  Truck,
  Leaf,
  Smile,
  X,
} from 'lucide-react';

interface EcoToysTemplateProps {
  website: Website;
  lang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currency: string;
  onCurrencyChange: (curr: any) => void;
}

interface ToyProduct {
  id: string;
  name: { en: string; zh: string; ru: string };
  price: number;
  image: string;
  category: { en: string; zh: string; ru: string };
  rating: number;
  reviews: number;
  isNew?: boolean;
}

const TOY_PRODUCTS: ToyProduct[] = [
  {
    id: 'toy-1',
    name: {
      en: 'Organic Linen Plush Bunny',
      zh: '天然有机亚麻安抚小兔',
      ru: 'Плюшевый кролик из льна',
    },
    price: 34,
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Plush & Dolls', zh: '毛绒与玩偶', ru: 'Мягкие игрушки' },
    rating: 4.9,
    reviews: 128,
    isNew: true,
  },
  {
    id: 'toy-2',
    name: {
      en: 'Handmade Wooden Rocking Horse',
      zh: '手工实木摇摇木马',
      ru: 'Деревянная лошадка-качалка',
    },
    price: 89,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Wooden Toys', zh: '实木益智', ru: 'Деревянные игрушки' },
    rating: 5.0,
    reviews: 94,
  },
  {
    id: 'toy-3',
    name: {
      en: 'Pastel Stacking Rings Tower',
      zh: '莫兰迪色彩虹叠叠塔',
      ru: 'Пастельная пирамидка из бука',
    },
    price: 28,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Montessori', zh: '蒙特梭利早教', ru: 'Монтессори' },
    rating: 4.8,
    reviews: 215,
    isNew: true,
  },
  {
    id: 'toy-4',
    name: {
      en: 'Natural Beechwood Toy Car',
      zh: '天然山毛榉木质小汽车',
      ru: 'Деревянная машинка из бука',
    },
    price: 22,
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Wooden Toys', zh: '实木益智', ru: 'Деревянные игрушки' },
    rating: 4.9,
    reviews: 76,
  },
  {
    id: 'toy-5',
    name: {
      en: 'Handcrafted Waldorf Rag Dolls (Pair)',
      zh: '手工华德福布艺娃娃组合',
      ru: 'Вальдорфские куклы ручной работы',
    },
    price: 65,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Plush & Dolls', zh: '毛绒与玩偶', ru: 'Мягкие игрушки' },
    rating: 5.0,
    reviews: 142,
  },
  {
    id: 'toy-6',
    name: {
      en: 'Sensory Wooden Activity Busy Board',
      zh: '多功能蒙氏实木感官忙碌板',
      ru: 'Деревянный бизиборд для малышей',
    },
    price: 95,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Montessori', zh: '蒙特梭利早教', ru: 'Монтессори' },
    rating: 4.9,
    reviews: 88,
  },
];

export function EcoToysTemplate({
  website,
  lang,
  onLanguageChange,
  currency,
  onCurrencyChange,
}: EcoToysTemplateProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState<ToyProduct | null>(null);
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);

  const activeLangKey = (lang === 'zh' ? 'zh' : 'en') as 'en' | 'zh';

  const navLinks = [
    { name: { en: 'Catalog', zh: '商品目录', ru: 'Каталог' }, href: '#catalog' },
    { name: { en: 'About Us', zh: '品牌故事', ru: 'О нас' }, href: '#about' },
    { name: { en: 'For Buyers', zh: '批发与采购', ru: 'Покупателям' }, href: '#buyers' },
    { name: { en: 'Eco Materials', zh: '环保天然材质', ru: 'Эко-материалы' }, href: '#eco' },
    { name: { en: 'Reviews', zh: '买家评价', ru: 'Отзывы' }, href: '#reviews' },
    { name: { en: 'Contacts', zh: '联系我们', ru: 'Контакты' }, href: '#contacts' },
  ];

  const categories = [
    { id: 'all', label: { en: 'All Toys', zh: '全部玩具', ru: 'Все товары' } },
    { id: 'plush', label: { en: 'Organic Plush & Dolls', zh: '天然有机玩偶', ru: 'Мягкие игрушки' } },
    { id: 'wooden', label: { en: 'Wooden Toys', zh: '原木玩具', ru: 'Деревянные игрушки' } },
    { id: 'montessori', label: { en: 'Montessori Early Learning', zh: '蒙氏早教益智', ru: 'Монтессори' } },
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? TOY_PRODUCTS
      : TOY_PRODUCTS.filter((p) => {
          if (activeCategory === 'plush') return p.category.en.includes('Plush');
          if (activeCategory === 'wooden') return p.category.en.includes('Wooden');
          if (activeCategory === 'montessori') return p.category.en.includes('Montessori');
          return true;
        });

  return (
    <div className="min-h-screen bg-[#DDECF0] text-[#1E3A5F] font-sans antialiased selection:bg-[#BCE0FD] selection:text-[#0A2540]">
      {/* Top Floating Header Container */}
      <div className="pt-6 px-4 md:px-10 max-w-7xl mx-auto">
        <header className="bg-white/90 backdrop-blur-md rounded-full px-6 md:px-8 py-3.5 shadow-sm border border-white/60 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-[#BCE0FD] flex items-center justify-center text-[#1E3A5F] font-black text-sm group-hover:scale-105 transition-transform">
              🧸
            </div>
            <span className="font-extrabold text-base md:text-lg tracking-tight text-[#1E3A5F] uppercase">
              {website.name.includes('Export') ? 'ECO-TOYS' : website.name.toUpperCase()}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#4A6B82]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#1E3A5F] transition-colors whitespace-nowrap"
              >
                {link.name[activeLangKey]}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3">
            {/* Language Pill */}
            <div className="flex items-center bg-[#EDF5F8] p-1 rounded-full text-xs font-bold">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  lang === 'en' ? 'bg-white text-[#1E3A5F] shadow-xs' : 'text-[#7B9CAB]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('zh')}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  lang === 'zh' ? 'bg-white text-[#1E3A5F] shadow-xs' : 'text-[#7B9CAB]'
                }`}
              >
                中文
              </button>
            </div>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-[#EDF5F8] border-none text-[#1E3A5F] text-xs font-bold rounded-full px-2.5 py-1.5 outline-none cursor-pointer hidden sm:block"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="RUB">RUB (₽)</option>
            </select>

            <div className="flex items-center gap-1.5 text-[#4A6B82]">
              <button
                className="w-8 h-8 rounded-full bg-[#EDF5F8] hover:bg-[#D4E8EE] flex items-center justify-center transition-colors"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              <button
                className="w-8 h-8 rounded-full bg-[#EDF5F8] hover:bg-[#D4E8EE] flex items-center justify-center transition-colors"
                title="User Profile"
              >
                <User className="w-3.5 h-3.5" />
              </button>

              <button
                className="w-8 h-8 rounded-full bg-[#EDF5F8] hover:bg-[#D4E8EE] flex items-center justify-center transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-3.5 h-3.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#A3CBE0] text-[#1E3A5F] rounded-full text-[9px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setRfqModalOpen(true)}
                className="w-8 h-8 rounded-full bg-[#BCE0FD] hover:bg-[#A9D5FA] text-[#1E3A5F] flex items-center justify-center transition-colors relative"
                title="Cart / Wholesale RFQ"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1E3A5F] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section — EXACT Behance Reference Split-Frame Composition */}
      <section className="pt-8 pb-12 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="relative">
          <div className="grid lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Hero Card (Clean Typography & Miniature Product) */}
            <div className="lg:col-span-6 bg-white rounded-[36px] p-8 md:p-12 shadow-sm border border-white/80 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#EDF5F8] text-[#4A6B82] text-xs font-bold tracking-wide uppercase">
                  {lang === 'zh' ? '100% 纯天然环保材质' : '100% Organic & Non-Toxic'}
                </span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1E3A5F] tracking-tight font-serif uppercase leading-tight">
                  {lang === 'zh' ? '生态有机玩具' : 'ЭКО-ИГРУШКИ'}
                </h1>

                <p className="text-sm md:text-base text-[#688599] font-medium max-w-md leading-relaxed">
                  {lang === 'zh'
                    ? '专为宝宝健康成长研发：采用天然有机亚麻、山毛榉实木与植物安全水性漆制作。'
                    : 'Экологически чистые и безопасные детские товары, изготовленные из натуральных материалов.'}
                </p>
              </div>

              {/* Miniature Thumbnail Badge */}
              <div className="pt-8 flex items-center justify-between">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-[#F4FAFC] border-2 border-white shadow-xs p-1">
                  <img
                    src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=300&q=80"
                    alt="Eco Bunny"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#7B9CAB]">
                    {lang === 'zh' ? '德国 TÜV 莱茵认证' : 'TÜV Rheinland Certified'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#E5F2F7] flex items-center justify-center text-[#1E3A5F]">
                    🌿
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Card (Warm Lifestyle Girl with Dolls Photography) */}
            <div className="lg:col-span-6 bg-white rounded-[36px] overflow-hidden shadow-sm border border-white/80 relative min-h-[380px] md:min-h-[460px]">
              <img
                src="https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1200&q=80"
                alt="Child playing with eco dolls"
                className="w-full h-full object-cover"
              />

              {/* Circular Overlapping CTA Badge (Catalog / RFQ) */}
              <a
                href="#catalog"
                className="absolute left-[-28px] top-1/2 -translate-y-1/2 hidden lg:flex w-24 h-24 rounded-full bg-[#A9D0E4] hover:bg-[#97C5DC] text-[#1E3A5F] font-bold text-xs shadow-md border-4 border-[#DDECF0] items-center justify-center text-center transition-all hover:scale-105 z-20"
              >
                <span>{lang === 'zh' ? '进入\n画册' : 'Каталог'}</span>
              </a>

              {/* Cloud Shape Visual Element on Bottom Right */}
              <div className="absolute -bottom-4 -right-4 w-52 h-28 bg-[#DDECF0] rounded-tl-[80px] rounded-tr-[50px] pointer-events-none opacity-90 flex items-center justify-center">
                <div className="w-32 h-16 bg-[#DDECF0] rounded-full absolute -top-6 left-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Carousel / Grid Header */}
      <section id="catalog" className="pt-8 pb-16 px-4 md:px-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-[#7B9CAB] uppercase tracking-widest">
              {lang === 'zh' ? '热销精选' : 'ПОПУЛЯРНЫЕ ТОВАРЫ'}
            </span>
            <h2 className="text-3xl font-serif font-black text-[#1E3A5F] tracking-tight uppercase">
              {lang === 'zh' ? '最受全球买家欢迎的产品' : 'ПОПУЛЯРНЫЕ ТОВАРЫ'}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-white text-[#1E3A5F] shadow-sm font-extrabold'
                    : 'bg-white/40 text-[#5F8094] hover:bg-white/70'
                }`}
              >
                {cat.label[activeLangKey]}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards — Soft Rounded Pill Frames matching Behance UI */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-[28px] p-3 shadow-xs border border-white/80 hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Product Image Frame */}
                <div className="h-36 md:h-44 rounded-[22px] overflow-hidden bg-[#F3F8FA] relative mb-3">
                  <img
                    src={product.image}
                    alt={product.name[activeLangKey]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#A9D0E4] text-[#1E3A5F]">
                      NEW
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWishlistCount((prev) => prev + 1);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-[#4A6B82] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xs"
                  >
                    <Heart className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1 px-1">
                  <div className="text-[10px] font-bold text-[#8EAAB8] uppercase truncate">
                    {product.category[activeLangKey]}
                  </div>
                  <h3 className="font-extrabold text-xs text-[#1E3A5F] line-clamp-2 leading-snug group-hover:text-[#0D6292] transition-colors">
                    {product.name[activeLangKey]}
                  </h3>
                </div>
              </div>

              <div className="pt-3 px-1 flex items-center justify-between border-t border-[#EDF4F7] mt-3">
                <div>
                  <span className="text-sm font-black text-[#1E3A5F] font-serif">
                    ${product.price}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                    setCartCount((c) => c + 1);
                    setRfqModalOpen(true);
                  }}
                  className="w-7 h-7 rounded-full bg-[#EDF5F8] group-hover:bg-[#BCE0FD] text-[#1E3A5F] flex items-center justify-center transition-colors"
                >
                  <ShoppingBag className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Values & Craftsmanship Section */}
      <section id="eco" className="py-12 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-[36px] p-8 md:p-12 border border-white/80 shadow-sm grid md:grid-cols-4 gap-6">
          {[
            {
              icon: <Leaf className="w-6 h-6 text-[#5EA880]" />,
              title: lang === 'zh' ? '100% 天然环保木质' : '100% Natural Beechwood',
              desc: lang === 'zh' ? '选用德国可持续林场原木，无甲醛无异味。' : 'Sustainably sourced FSC wood with smooth splinter-free finish.',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-[#4A8EB8]" />,
              title: lang === 'zh' ? '欧盟 CE 与 EN71 安全认证' : 'CE & ASTM F963 Safe',
              desc: lang === 'zh' ? '全线通过国际儿童玩具安全检测标准。' : 'Certified compliant with US & EU strict child safety directives.',
            },
            {
              icon: <Smile className="w-6 h-6 text-[#D49845]" />,
              title: lang === 'zh' ? '食品级植物水性漆' : 'Organic Food-Grade Dyes',
              desc: lang === 'zh' ? '宝宝可安心啃咬，色彩柔和不伤眼睛。' : 'Safe for chewing and gentle on developing sensory vision.',
            },
            {
              icon: <Truck className="w-6 h-6 text-[#7F74B0]" />,
              title: lang === 'zh' ? '全球大宗海运直发' : 'Direct Export Dispatch',
              desc: lang === 'zh' ? '支持整柜海运、小批量试单与 OEM 定制。' : 'FCL container freight & OEM private label custom branding.',
            },
          ].map((feature, i) => (
            <div key={i} className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F7FA] flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-bold text-sm text-[#1E3A5F]">{feature.title}</h3>
              <p className="text-xs text-[#7B9CAB] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Production & Factory Story Section */}
      <section id="about" className="py-12 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="px-3.5 py-1 rounded-full bg-white text-[#4A6B82] text-xs font-bold tracking-wide uppercase">
              {lang === 'zh' ? '匠心手作 工厂溯源' : 'ABOUT OUR WORKSHOP'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-[#1E3A5F] leading-tight">
              {lang === 'zh' ? '传递给下一代的天然纯粹与陪伴' : 'Pure natural companionship crafted for the next generation'}
            </h2>
            <p className="text-sm text-[#688599] leading-relaxed">
              {lang === 'zh'
                ? '我们坚信，给孩子最好的玩具，来自大自然本身。每一件毛绒娃娃均由有机棉麻手工缝制，每一只积木均经由 3 道手工精细打磨，保留木质原本的温润触感。'
                : 'We believe that the best toys come from nature itself. Every plush doll is hand-stitched with organic linen, and every wooden block is hand-sanded to perfection.'}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setRfqModalOpen(true)}
                className="px-6 py-3 rounded-full bg-[#1E3A5F] text-white font-bold text-xs shadow-md hover:bg-[#132842] transition-all"
              >
                {lang === 'zh' ? '申请批发合作' : 'Wholesale Partnership'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-[32px] overflow-hidden shadow-sm h-64">
              <img
                src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"
                alt="Woodcraft Workshop"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-[32px] overflow-hidden shadow-sm h-64 mt-6">
              <img
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80"
                alt="Organic Doll Stitching"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacts" className="mt-16 bg-white border-t border-white/60 pt-12 pb-8 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 pb-10 border-b border-[#EDF4F7]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#BCE0FD] flex items-center justify-center text-sm">
                🧸
              </div>
              <span className="font-extrabold text-base text-[#1E3A5F]">
                {website.name.includes('Export') ? 'ECO-TOYS' : website.name}
              </span>
            </div>
            <p className="text-xs text-[#7B9CAB] leading-relaxed">
              Handcrafted organic toys and Montessori educational wooden sets for international retailers & families worldwide.
            </p>
          </div>

          <div className="space-y-2 text-xs text-[#5E8094]">
            <div className="font-bold text-[#1E3A5F] text-sm mb-2">Toy Collections</div>
            <div>Organic Plush Bunnies & Dolls</div>
            <div>Handmade Rocking Horses</div>
            <div>Montessori Beechwood Blocks</div>
            <div>Sensory Busy Boards</div>
          </div>

          <div className="space-y-2 text-xs text-[#5E8094]">
            <div className="font-bold text-[#1E3A5F] text-sm mb-2">Safety Standards</div>
            <div>CE Safety Mark (EN71-1/2/3)</div>
            <div>ASTM F963 US Standards</div>
            <div>FSC 100% Sustainable Wood</div>
            <div>OEKO-TEX Certified Organic Linen</div>
          </div>

          <div className="space-y-2 text-xs text-[#5E8094]">
            <div className="font-bold text-[#1E3A5F] text-sm mb-2">Contact & Inquiries</div>
            <div>Email: wholesale@eco-toys.com</div>
            <div>Phone: +1 (800) 492-7962</div>
            <div>Factory: Creative Craft Park, Ningbo, China</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8EAAB8]">
          <div>© {new Date().getFullYear()} {website.name.includes('Export') ? 'ECO-TOYS' : website.name}. All Rights Reserved.</div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="font-bold text-[#1E3A5F]">XiSync Site Engine</span>
          </div>
        </div>
      </footer>

      {/* Instant Wholesale RFQ / Sample Modal */}
      {rfqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E3A5F]/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[36px] max-w-md w-full p-6 md:p-8 shadow-2xl space-y-4 relative border border-white">
            <button
              onClick={() => {
                setRfqModalOpen(false);
                setRfqSuccess(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#EDF5F8] text-[#4A6B82] hover:bg-[#DCEBF0] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {!rfqSuccess ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRfqSuccess(true);
                }}
                className="space-y-4"
              >
                <div>
                  <span className="text-[11px] font-bold text-[#7B9CAB] uppercase tracking-wider">
                    {lang === 'zh' ? '大宗批发与样品申请' : 'Wholesale RFQ & Samples'}
                  </span>
                  <h3 className="text-xl font-bold text-[#1E3A5F] font-serif">
                    {lang === 'zh' ? '获取专属外贸报价单' : 'Request Wholesale Quote'}
                  </h3>
                </div>

                {selectedProduct && (
                  <div className="p-3 rounded-2xl bg-[#F0F7FA] flex items-center gap-3">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name[activeLangKey]}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#1E3A5F]">
                        {selectedProduct.name[activeLangKey]}
                      </div>
                      <div className="text-[11px] text-[#7B9CAB]">
                        MOQ: 50 units • ${selectedProduct.price}/unit
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <input
                    required
                    type="text"
                    placeholder={lang === 'zh' ? '您的称呼' : 'Your Full Name'}
                    className="w-full p-3 rounded-2xl bg-[#F0F7FA] border border-[#E0EDF2] text-[#1E3A5F] font-medium outline-none focus:border-[#A9D0E4]"
                  />
                  <input
                    required
                    type="email"
                    placeholder={lang === 'zh' ? '企业邮箱' : 'Business Email'}
                    className="w-full p-3 rounded-2xl bg-[#F0F7FA] border border-[#E0EDF2] text-[#1E3A5F] font-medium outline-none focus:border-[#A9D0E4]"
                  />
                  <textarea
                    rows={3}
                    placeholder={lang === 'zh' ? '采购数量与目的港口 (如: 500件, 鹿特丹港)...' : 'Order quantity & target port (e.g. 500 units, Rotterdam)...'}
                    className="w-full p-3 rounded-2xl bg-[#F0F7FA] border border-[#E0EDF2] text-[#1E3A5F] font-medium outline-none focus:border-[#A9D0E4]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#1E3A5F] text-white font-bold text-xs shadow-md hover:bg-[#122742] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'zh' ? '立即提交询价' : 'Submit Wholesale Inquiry'}</span>
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#D8F0E4] text-[#2D7A54] flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="font-bold text-base text-[#1E3A5F]">
                  {lang === 'zh' ? '询价需求已成功送达！' : 'Inquiry Dispatched!'}
                </h4>
                <p className="text-xs text-[#7B9CAB] max-w-xs mx-auto">
                  {lang === 'zh' ? '专属客户经理将在 2 小时内出具正式 Proforma 报价与样品排期。' : 'Our toy workshop sales team will follow up with official pricing and sample schedules.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
