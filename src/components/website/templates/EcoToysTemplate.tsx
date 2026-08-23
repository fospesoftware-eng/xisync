import { useState } from 'react';
import { Website, LanguageCode } from '../../../types/websiteBuilder';
import { SeoHead } from '../seo/SeoHead';
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
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Package,
  Award,
} from 'lucide-react';

interface EcoToysTemplateProps {
  website: Website;
  lang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currency: string;
  onCurrencyChange: (curr: any) => void;
}

type InnerPageSlug = 'home' | 'catalog' | 'about' | 'wholesale' | 'eco' | 'safety' | 'contact';

interface ToyProduct {
  id: string;
  sku: string;
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  price: number;
  image: string;
  category: { en: string; zh: string };
  rating: number;
  reviews: number;
  isNew?: boolean;
  leadTime: string;
  materials: string;
}

const TOY_PRODUCTS: ToyProduct[] = [
  {
    id: 'toy-1',
    sku: 'ECO-TOY-BNY-01',
    name: {
      en: 'Organic Linen Plush Bunny',
      zh: '天然有机亚麻安抚小兔',
    },
    description: {
      en: 'Handmade organic linen rabbit doll with hypoallergenic plant-based cotton filling. Certified CE & ASTM.',
      zh: '手工缝制纯天然亚麻小兔，采用防过敏植物纤维填充。',
    },
    price: 34,
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Plush & Dolls', zh: '毛绒与玩偶' },
    rating: 4.9,
    reviews: 128,
    isNew: true,
    leadTime: '3-5 Days',
    materials: '100% Organic Flax Linen & Plant Cotton',
  },
  {
    id: 'toy-2',
    sku: 'ECO-TOY-HRS-02',
    name: {
      en: 'Handmade Wooden Rocking Horse',
      zh: '手工实木摇摇木马',
    },
    description: {
      en: 'Solid European beechwood rocking horse with food-grade beeswax polish. Smooth ergonomic anti-collision edges.',
      zh: '精选欧洲山毛榉实木制作，天然蜂蜡抛光打磨，圆润防撞。',
    },
    price: 89,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Wooden Toys', zh: '实木益智' },
    rating: 5.0,
    reviews: 94,
    leadTime: '5-7 Days',
    materials: 'FSC Solid Beechwood & Natural Beeswax',
  },
  {
    id: 'toy-3',
    sku: 'ECO-TOY-RNG-03',
    name: {
      en: 'Pastel Stacking Rings Tower',
      zh: '莫兰迪色彩虹叠叠塔',
    },
    description: {
      en: 'Montessori early-learning wooden ring stacker dyed with water-based non-toxic natural pigments.',
      zh: '蒙特梭利早教启蒙叠叠塔，环保植物水性漆着色。',
    },
    price: 28,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Montessori', zh: '蒙特梭利早教' },
    rating: 4.8,
    reviews: 215,
    isNew: true,
    leadTime: '3-5 Days',
    materials: 'Solid Hardwood & Non-toxic Water Paint',
  },
  {
    id: 'toy-4',
    sku: 'ECO-TOY-CAR-04',
    name: {
      en: 'Natural Beechwood Toy Car',
      zh: '天然山毛榉木质小汽车',
    },
    description: {
      en: 'FSC-certified hardwood rolling vehicle with silent rubber-lined smooth wheels.',
      zh: 'FSC 认证高密度原木小车，配备静音橡胶轮圈。',
    },
    price: 22,
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Wooden Toys', zh: '实木益智' },
    rating: 4.9,
    reviews: 76,
    leadTime: '2-4 Days',
    materials: 'Natural Beechwood & Rubber Tires',
  },
  {
    id: 'toy-5',
    sku: 'ECO-TOY-WLD-05',
    name: {
      en: 'Handcrafted Waldorf Rag Dolls (Pair)',
      zh: '手工华德福布艺娃娃组合',
    },
    description: {
      en: 'Natural OEKO-TEX wool and cotton Waldorf dolls with removable organic cotton clothing.',
      zh: '天然 OEKO-TEX 认证羊毛棉布华德福布偶，服装可脱换。',
    },
    price: 65,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Plush & Dolls', zh: '毛绒与玩偶' },
    rating: 5.0,
    reviews: 142,
    leadTime: '4-6 Days',
    materials: 'Organic Wool, Cotton & Linen',
  },
  {
    id: 'toy-6',
    sku: 'ECO-TOY-BSY-06',
    name: {
      en: 'Sensory Wooden Activity Busy Board',
      zh: '多功能蒙氏实木感官忙碌板',
    },
    description: {
      en: 'Interactive multi-sensory educational board for motor skill development in toddlers.',
      zh: '多功能实木精细动作感官训练板，启发幼儿空间思维。',
    },
    price: 95,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80',
    category: { en: 'Montessori', zh: '蒙特梭利早教' },
    rating: 4.9,
    reviews: 88,
    leadTime: '5-8 Days',
    materials: 'Birch Plywood & Metal Latches',
  },
];

export function EcoToysTemplate({
  website,
  lang = 'en',
  onLanguageChange,
  currency,
  onCurrencyChange,
}: EcoToysTemplateProps) {
  const [currentPage, setCurrentPage] = useState<InnerPageSlug>('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState<ToyProduct | null>(null);
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeLangKey = (lang === 'zh' ? 'zh' : 'en') as 'en' | 'zh';
  const siteUrl = `https://${website.custom_domain || website.subdomain || 'ecotoys.xisync.site'}`;

  const navLinks: { slug: InnerPageSlug; name: { en: string; zh: string } }[] = [
    { slug: 'home', name: { en: 'Home', zh: '首页' } },
    { slug: 'catalog', name: { en: 'Catalog', zh: '商品画册' } },
    { slug: 'about', name: { en: 'About Workshop', zh: '品牌手作' } },
    { slug: 'wholesale', name: { en: 'Wholesale & B2B', zh: '大宗采购' } },
    { slug: 'eco', name: { en: 'Eco Materials', zh: '天然原材' } },
    { slug: 'safety', name: { en: 'Safety Standards', zh: '安全认证' } },
    { slug: 'contact', name: { en: 'Contact Us', zh: '联系我们' } },
  ];

  const categories = [
    { id: 'all', label: { en: 'All Products', zh: '全部玩具' } },
    { id: 'plush', label: { en: 'Organic Plush & Dolls', zh: '天然有机玩偶' } },
    { id: 'wooden', label: { en: 'Wooden Toys', zh: '原木玩具' } },
    { id: 'montessori', label: { en: 'Montessori Early Learning', zh: '蒙氏早教益智' } },
  ];

  const filteredProducts = TOY_PRODUCTS.filter((p) => {
    const matchCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'plush'
        ? p.category.en.includes('Plush')
        : activeCategory === 'wooden'
        ? p.category.en.includes('Wooden')
        : activeCategory === 'montessori'
        ? p.category.en.includes('Montessori')
        : true;

    const matchSearch =
      !searchQuery.trim() ||
      p.name[activeLangKey].toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const getPageTitle = () => {
    switch (currentPage) {
      case 'catalog':
        return `${website.name} — Full B2B Toy Catalog & Stock`;
      case 'about':
        return `${website.name} — Our Handcrafted Story & Artisans`;
      case 'wholesale':
        return `${website.name} — Wholesale Partnerships & Ocean Shipping`;
      case 'eco':
        return `${website.name} — Organic Linen & FSC Wood Standards`;
      case 'safety':
        return `${website.name} — CE EN71 & ASTM F963 Lab Certifications`;
      case 'contact':
        return `${website.name} — Contact Exporter Sales Desk`;
      case 'home':
      default:
        return `${website.name} — Organic & Montessori Wooden Toys Manufacturer`;
    }
  };

  return (
    <div className="min-h-screen bg-[#DDECF0] text-[#1E3A5F] font-sans antialiased selection:bg-[#BCE0FD] selection:text-[#0A2540] flex flex-col justify-between">
      {/* 1. GOOGLE SEO METADATA & STRUCTURED DATA */}
      <SeoHead
        title={getPageTitle()}
        description="Official B2B storefront for Eco-Toys Craft Workshop. Certified manufacturer of 100% organic linen dolls, sustainable FSC beechwood toys, and Montessori educational sets. CE & ASTM F963 compliant."
        keywords={[
          'Organic Toys',
          'Wooden Toys Manufacturer',
          'Montessori Beechwood Stacker',
          'Eco-Friendly Plush Dolls',
          'FSC Wood Children Toys',
          'CE EN71 Safety Certified',
          'ASTM F963 Toy Exporter',
          'B2B Wholesale Toys',
        ]}
        canonicalUrl={`${siteUrl}/${currentPage === 'home' ? '' : currentPage}`}
        ogImage="https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1200&q=80"
        siteName={website.name}
        locale={lang === 'zh' ? 'zh_CN' : 'en_US'}
        products={TOY_PRODUCTS.map((t) => ({
          name: t.name.en,
          description: t.description.en,
          image: t.image,
          sku: t.sku,
          price: t.price,
          currency: currency || 'USD',
          rating: t.rating,
          reviewCount: t.reviews,
        }))}
        organization={{
          name: website.name,
          url: siteUrl,
          logo: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=200&q=80',
          contactPhone: '+1 (800) 492-7962',
          address: 'Creative Craft Park, Ningbo Port Industrial Hub, China',
        }}
      />

      {/* 2. TOP FLOATING PILL NAVBAR */}
      <div>
        <div className="pt-6 px-4 md:px-10 max-w-7xl mx-auto">
          <header className="bg-white/90 backdrop-blur-md rounded-full px-6 md:px-8 py-3.5 shadow-sm border border-white/60 flex items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2.5 group text-left"
              aria-label={`${website.name} Home`}
            >
              {website.logo_url ? (
                <img
                  src={website.logo_url}
                  alt={website.name}
                  className="h-9 w-auto max-w-[120px] object-contain rounded-lg"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform shadow-xs"
                  style={{
                    backgroundColor: website.theme_config?.color_palette?.accent || '#BCE0FD',
                    color: website.theme_config?.color_palette?.primary || '#1E3A5F',
                  }}
                >
                  🧸
                </div>
              )}
              <span
                className="font-extrabold text-base md:text-lg tracking-tight uppercase"
                style={{ color: website.theme_config?.color_palette?.primary || '#1E3A5F' }}
              >
                {website.logo_text || website.name.toUpperCase()}
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#4A6B82]" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <button
                  key={link.slug}
                  onClick={() => setCurrentPage(link.slug)}
                  className={`transition-all whitespace-nowrap pb-0.5 ${
                    currentPage === link.slug
                      ? 'text-[#1E3A5F] font-extrabold border-b-2 border-[#1E3A5F]'
                      : 'hover:text-[#1E3A5F]'
                  }`}
                >
                  {link.name[activeLangKey]}
                </button>
              ))}
            </nav>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex items-center bg-[#EDF5F8] p-1 rounded-full text-xs font-bold" role="group">
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
                <option value="GBP">GBP (£)</option>
              </select>

              <div className="flex items-center gap-1.5 text-[#4A6B82]">
                <button
                  onClick={() => setCurrentPage('catalog')}
                  className="w-8 h-8 rounded-full bg-[#EDF5F8] hover:bg-[#D4E8EE] flex items-center justify-center transition-colors"
                  title="Search Catalog"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCurrentPage('contact')}
                  className="w-8 h-8 rounded-full bg-[#EDF5F8] hover:bg-[#D4E8EE] flex items-center justify-center transition-colors"
                  title="User Account / Support"
                >
                  <User className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setWishlistCount((c) => c + 1);
                    setCurrentPage('catalog');
                  }}
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
                  title="Wholesale Cart & RFQ"
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

        {/* 3. DYNAMIC INNER PAGE ROUTING VIEW */}
        <main className="py-6">
          {/* ================= PAGE: HOME ================= */}
          {currentPage === 'home' && (
            <div className="space-y-12">
              {/* Split Hero Section */}
              <section className="pt-4 pb-8 px-4 md:px-10 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-5 items-stretch">
                  {/* Left Hero Card */}
                  <article className="lg:col-span-6 bg-white rounded-[36px] p-8 md:p-12 shadow-sm border border-white/80 flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4">
                      <span className="inline-block px-3.5 py-1 rounded-full bg-[#EDF5F8] text-[#4A6B82] text-xs font-bold tracking-wide uppercase">
                        {lang === 'zh' ? '100% 纯天然环保安全材质' : '100% Organic & Non-Toxic'}
                      </span>

                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1E3A5F] tracking-tight font-serif uppercase leading-tight">
                        {lang === 'zh' ? '生态有机玩具' : 'ECO-TOYS'}
                      </h1>

                      <p className="text-sm md:text-base text-[#688599] font-medium max-w-md leading-relaxed">
                        {lang === 'zh'
                          ? '专为宝宝健康成长研发：采用天然有机亚麻、山毛榉实木与植物安全水性漆制作。'
                          : 'Ecologically pure, hypoallergenic, and safe children toys crafted from 100% natural organic materials.'}
                      </p>
                    </div>

                    <div className="pt-8 flex items-center justify-between">
                      <figure className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-[#F4FAFC] border-2 border-white shadow-xs p-1">
                        <img
                          src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=300&q=80"
                          alt="Organic Linen Plush Bunny"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </figure>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#7B9CAB]">
                          {lang === 'zh' ? '德国 TÜV 莱茵认证' : 'TÜV Rheinland & CE Certified'}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#E5F2F7] flex items-center justify-center text-[#1E3A5F]">
                          🌿
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Right Hero Card */}
                  <article className="lg:col-span-6 bg-white rounded-[36px] overflow-hidden shadow-sm border border-white/80 relative min-h-[380px] md:min-h-[460px]">
                    <img
                      src="https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1200&q=80"
                      alt="Toddler girl with dolls"
                      className="w-full h-full object-cover"
                    />

                    {/* Circular Overlapping CTA Button */}
                    <button
                      onClick={() => setCurrentPage('catalog')}
                      className="absolute left-[-28px] top-1/2 -translate-y-1/2 hidden lg:flex w-24 h-24 rounded-full bg-[#A9D0E4] hover:bg-[#97C5DC] text-[#1E3A5F] font-bold text-xs shadow-md border-4 border-[#DDECF0] items-center justify-center text-center transition-all hover:scale-105 z-20"
                    >
                      <span className="font-extrabold uppercase tracking-wide">
                        {lang === 'zh' ? '进入\n画册' : 'Catalog'}
                      </span>
                    </button>

                    <div className="absolute -bottom-4 -right-4 w-52 h-28 bg-[#DDECF0] rounded-tl-[80px] rounded-tr-[50px] pointer-events-none opacity-90 flex items-center justify-center">
                      <div className="w-32 h-16 bg-[#DDECF0] rounded-full absolute -top-6 left-6" />
                    </div>
                  </article>
                </div>
              </section>

              {/* Popular Products Carousel / Grid */}
              <section className="px-4 md:px-10 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-[#7B9CAB] uppercase tracking-widest">
                      {lang === 'zh' ? '热销精选' : 'POPULAR PRODUCTS'}
                    </span>
                    <h2 className="text-3xl font-serif font-black text-[#1E3A5F] tracking-tight uppercase">
                      {lang === 'zh' ? '最受全球买家欢迎的产品' : 'FEATURED BESTSELLERS'}
                    </h2>
                  </div>

                  <button
                    onClick={() => setCurrentPage('catalog')}
                    className="text-xs font-bold text-[#1E3A5F] hover:text-[#0D6292] flex items-center gap-1 self-start md:self-auto"
                  >
                    <span>{lang === 'zh' ? '查看全部 120+ 玩具画册' : 'View Full 120+ Catalog'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {TOY_PRODUCTS.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setRfqModalOpen(true);
                      }}
                      className="bg-white rounded-[28px] p-3 shadow-xs border border-white/80 hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
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
                        </div>

                        <div className="space-y-1 px-1">
                          <div className="text-[10px] font-bold text-[#8EAAB8] uppercase truncate">
                            {product.category[activeLangKey]}
                          </div>
                          <h3 className="font-extrabold text-xs text-[#1E3A5F] line-clamp-2 leading-snug">
                            {product.name[activeLangKey]}
                          </h3>
                        </div>
                      </div>

                      <div className="pt-3 px-1 flex items-center justify-between border-t border-[#EDF4F7] mt-3">
                        <span className="text-sm font-black text-[#1E3A5F] font-serif">
                          ${product.price}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#EDF5F8] group-hover:bg-[#BCE0FD] text-[#1E3A5F] flex items-center justify-center transition-colors">
                          <ShoppingBag className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ================= PAGE: CATALOG (FULL PRODUCT BROWSER) ================= */}
          {currentPage === 'catalog' && (
            <section className="px-4 md:px-10 max-w-7xl mx-auto space-y-8 animate-in fade-in">
              <div className="bg-white rounded-[36px] p-8 md:p-10 shadow-sm border border-white/80 space-y-4 text-left">
                <span className="text-xs font-mono font-bold text-[#7B9CAB] uppercase tracking-wider">
                  {lang === 'zh' ? '完整商品目录' : 'FULL B2B TOY CATALOG'}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-black text-[#1E3A5F]">
                  {lang === 'zh' ? '全系列木质与有机儿童玩具' : 'Complete Handcrafted Eco Toy Catalog'}
                </h1>
                <p className="text-xs md:text-sm text-[#688599] max-w-2xl">
                  {lang === 'zh'
                    ? '所有产品支持整柜海运、小批量现货批发与 OEM 品牌定制。'
                    : 'Explore all certified wooden toys and organic plush dolls available for wholesale supply and OEM custom packaging.'}
                </p>

                {/* Filter & Search Bar */}
                <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#EDF4F7]">
                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          activeCategory === cat.id
                            ? 'bg-[#1E3A5F] text-white shadow-xs font-extrabold'
                            : 'bg-[#EDF5F8] text-[#5F8094] hover:bg-[#E0EDF2]'
                        }`}
                      >
                        {cat.label[activeLangKey]}
                      </button>
                    ))}
                  </div>

                  <div className="w-full md:w-72 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={lang === 'zh' ? '搜索玩具名称或 SKU...' : 'Search toys or SKU...'}
                      className="w-full pl-9 pr-4 py-2 rounded-full bg-[#EDF5F8] text-xs font-semibold text-[#1E3A5F] outline-none"
                    />
                    <Search className="w-4 h-4 text-[#7B9CAB] absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setRfqModalOpen(true);
                    }}
                    className="bg-white rounded-[32px] p-4 shadow-sm border border-white/80 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <figure className="h-48 rounded-[24px] overflow-hidden bg-[#F3F8FA] relative mb-3">
                        <img
                          src={product.image}
                          alt={product.name[activeLangKey]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#1E3A5F] text-white">
                          {product.sku}
                        </span>
                      </figure>

                      <div className="space-y-1.5 text-left px-1">
                        <div className="text-[10px] font-bold text-[#8EAAB8] uppercase">
                          {product.category[activeLangKey]}
                        </div>
                        <h3 className="font-extrabold text-sm text-[#1E3A5F] leading-snug">
                          {product.name[activeLangKey]}
                        </h3>
                        <p className="text-[11px] text-[#7B9CAB] line-clamp-2">
                          {product.description[activeLangKey]}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 px-1 border-t border-[#EDF4F7] mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-[#1E3A5F] font-serif">
                          ${product.price}
                        </span>
                        <span className="text-[10px] text-[#7B9CAB] block font-mono">Lead: {product.leadTime}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                          setCartCount((c) => c + 1);
                          setRfqModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-[#BCE0FD] hover:bg-[#A9D5FA] text-[#1E3A5F] font-bold text-xs flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>{lang === 'zh' ? '索样/询价' : 'Quote'}</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ================= PAGE: ABOUT US ================= */}
          {currentPage === 'about' && (
            <section className="px-4 md:px-10 max-w-7xl mx-auto space-y-8 animate-in fade-in text-left">
              <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-sm border border-white/80 grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <span className="px-3.5 py-1 rounded-full bg-[#EDF5F8] text-[#4A6B82] text-xs font-bold uppercase tracking-wide">
                    {lang === 'zh' ? '品牌手作 工厂溯源' : 'OUR ARTISANAL HERITAGE'}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-serif font-black text-[#1E3A5F] leading-tight">
                    {lang === 'zh' ? '守护童年：手工打磨每一件大自然的礼物' : 'Crafting Nature Purest Companionship for Children'}
                  </h1>
                  <p className="text-sm text-[#688599] leading-relaxed">
                    {lang === 'zh'
                      ? 'Eco-Toys 手工作坊成立于 2016 年。我们坚信儿童玩具应当远离化学塑料与刺鼻异味。每一件实木玩具选用欧洲可持续林场山毛榉木，经由 3 道纯手工砂纸打磨，保留木质的自然温润触感。'
                      : 'Founded in 2016, Eco-Toys Craft Workshop was created with a single vision: to replace toxic plastics with organic linen and sustainably harvested European beechwood.'}
                  </p>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EDF4F7]">
                    <div>
                      <div className="text-2xl font-black text-[#1E3A5F] font-serif">100%</div>
                      <div className="text-xs text-[#7B9CAB]">{lang === 'zh' ? '纯天然材质' : 'Natural Organic'}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#1E3A5F] font-serif">50+</div>
                      <div className="text-xs text-[#7B9CAB]">{lang === 'zh' ? '出口国家' : 'Export Markets'}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#1E3A5F] font-serif">0%</div>
                      <div className="text-xs text-[#7B9CAB]">{lang === 'zh' ? '化学添加剂' : 'Chemical Additives'}</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"
                    alt="Woodcarving Workshop"
                    className="rounded-[28px] h-52 w-full object-cover shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80"
                    alt="Doll Stitching"
                    className="rounded-[28px] h-52 w-full object-cover shadow-xs mt-6"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ================= PAGE: WHOLESALE & B2B ================= */}
          {currentPage === 'wholesale' && (
            <section className="px-4 md:px-10 max-w-7xl mx-auto space-y-8 animate-in fade-in text-left">
              <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-sm border border-white/80 space-y-6">
                <span className="px-3.5 py-1 rounded-full bg-[#EDF5F8] text-[#4A6B82] text-xs font-bold uppercase">
                  {lang === 'zh' ? '外贸批发与 OEM 定制' : 'B2B WHOLESALE & PRIVATE LABEL'}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-black text-[#1E3A5F]">
                  {lang === 'zh' ? '全球采购商合作政策与集装箱海运' : 'Wholesale Supply, Container Freight & OEM Branding'}
                </h1>
                <p className="text-xs md:text-sm text-[#688599] max-w-3xl leading-relaxed">
                  {lang === 'zh'
                    ? '我们为全球 400+ 婴童品牌、连锁百货及早教机构提供整柜 (FCL) 及拼箱 (LCL) 海运直供服务。支持激光雕刻 Logo、定制彩盒及多语种说明书。'
                    : 'We supply over 400 global retailers and Montessori academies. Supporting FOB/CIF ocean shipping with custom laser-engraved branding and retail packaging.'}
                </p>

                <div className="grid md:grid-cols-3 gap-6 pt-4">
                  <div className="p-6 rounded-[28px] bg-[#F0F7FA] space-y-3">
                    <Package className="w-6 h-6 text-[#1E3A5F]" />
                    <h3 className="font-bold text-sm text-[#1E3A5F]">{lang === 'zh' ? '小批量试单 (Low MOQ)' : 'Low MOQ Flexibility'}</h3>
                    <p className="text-xs text-[#7B9CAB]">MOQ starting from 50 units for boutique retailers.</p>
                  </div>
                  <div className="p-6 rounded-[28px] bg-[#F0F7FA] space-y-3">
                    <Truck className="w-6 h-6 text-[#1E3A5F]" />
                    <h3 className="font-bold text-sm text-[#1E3A5F]">{lang === 'zh' ? '全球港口直达班轮' : 'Direct Port Dispatch'}</h3>
                    <p className="text-xs text-[#7B9CAB]">FOB Ningbo (CNNGB) & Shanghai (CNSHA) with 14d sea transit to LAX/Rotterdam.</p>
                  </div>
                  <div className="p-6 rounded-[28px] bg-[#F0F7FA] space-y-3">
                    <Award className="w-6 h-6 text-[#1E3A5F]" />
                    <h3 className="font-bold text-sm text-[#1E3A5F]">{lang === 'zh' ? 'OEM 贴牌与彩盒定制' : 'OEM Custom Branding'}</h3>
                    <p className="text-xs text-[#7B9CAB]">Laser logo engraving, custom hangtags, and barcode labels.</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-start">
                  <button
                    onClick={() => setRfqModalOpen(true)}
                    className="px-8 py-3.5 rounded-full bg-[#1E3A5F] text-white font-bold text-xs shadow-md hover:bg-[#132842] transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'zh' ? '立即索取 2026 外贸报价单' : 'Request 2026 Wholesale Price List'}</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ================= PAGE: ECO MATERIALS ================= */}
          {currentPage === 'eco' && (
            <section className="px-4 md:px-10 max-w-7xl mx-auto space-y-8 animate-in fade-in text-left">
              <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-sm border border-white/80 space-y-6">
                <span className="px-3.5 py-1 rounded-full bg-[#EDF5F8] text-[#4A6B82] text-xs font-bold uppercase">
                  {lang === 'zh' ? '纯天然选材标准' : 'ORGANIC MATERIAL SOURCING'}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-black text-[#1E3A5F]">
                  {lang === 'zh' ? '只选用大自然馈赠的天然纯净原材' : 'Zero Synthetic Plastics: Natural Beechwood & Organic Flax'}
                </h1>
                <p className="text-xs md:text-sm text-[#688599] max-w-3xl leading-relaxed">
                  Every piece of timber is tracked through the Forest Stewardship Council (FSC) chain of custody, ensuring sustainable forestry without chemical fumigation.
                </p>

                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="p-6 rounded-[28px] bg-[#F4FAFC] border border-[#E0EDF2] flex items-start gap-4">
                    <Leaf className="w-8 h-8 text-[#5EA880] flex-shrink-0" />
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-[#1E3A5F]">FSC-Certified Solid European Beechwood</h3>
                      <p className="text-xs text-[#7B9CAB]">Dense grain, splinter-free durability, smooth natural texture.</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-[#F4FAFC] border border-[#E0EDF2] flex items-start gap-4">
                    <Smile className="w-8 h-8 text-[#D49845] flex-shrink-0" />
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-[#1E3A5F]">Food-Grade Organic Plant Dyes</h3>
                      <p className="text-xs text-[#7B9CAB]">100% water-based non-toxic natural pigments safe for infant chewing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= PAGE: SAFETY STANDARDS ================= */}
          {currentPage === 'safety' && (
            <section className="px-4 md:px-10 max-w-7xl mx-auto space-y-8 animate-in fade-in text-left">
              <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-sm border border-white/80 space-y-6">
                <span className="px-3.5 py-1 rounded-full bg-[#EDF5F8] text-[#4A6B82] text-xs font-bold uppercase">
                  {lang === 'zh' ? '国际玩具安全认证' : 'GLOBAL SAFETY CERTIFICATIONS'}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-black text-[#1E3A5F]">
                  {lang === 'zh' ? '通过欧盟 CE 与美国 ASTM F963 严苛全检' : 'Rigorous Third-Party Lab Tested Child Safety Standards'}
                </h1>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  {[
                    { code: 'CE EN 71-1/2/3', label: 'European Toy Safety Standard' },
                    { code: 'ASTM F963-17', label: 'United States Consumer Safety' },
                    { code: 'FSC-STD-40-004', label: '100% Sustainable Wood Custody' },
                    { code: 'OEKO-TEX 100', label: 'Harmful Substance Free Fabric' },
                  ].map((cert) => (
                    <div key={cert.code} className="p-6 rounded-[28px] bg-[#F0F7FA] space-y-2 text-center">
                      <ShieldCheck className="w-8 h-8 text-[#1E3A5F] mx-auto" />
                      <div className="font-black text-sm text-[#1E3A5F] font-mono">{cert.code}</div>
                      <div className="text-[11px] text-[#7B9CAB]">{cert.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ================= PAGE: CONTACT US ================= */}
          {currentPage === 'contact' && (
            <section className="px-4 md:px-10 max-w-7xl mx-auto space-y-8 animate-in fade-in text-left">
              <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-sm border border-white/80 grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-6">
                  <span className="px-3.5 py-1 rounded-full bg-[#EDF5F8] text-[#4A6B82] text-xs font-bold uppercase">
                    {lang === 'zh' ? '联系外销团队' : 'CONTACT EXPORTER DESK'}
                  </span>
                  <h1 className="text-3xl font-serif font-black text-[#1E3A5F]">
                    {lang === 'zh' ? '开启大宗合作洽谈' : 'Get in Touch with Our Craft Workshop'}
                  </h1>

                  <div className="space-y-4 text-xs text-[#5E8094]">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#1E3A5F]" />
                      <span>wholesale@eco-toys.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#1E3A5F]" />
                      <span>+1 (800) 492-7962 / +86 (574) 8722-1980</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#1E3A5F]" />
                      <span>Creative Craft Park, Ningbo Port Industrial Hub, China</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#1E3A5F]" />
                      <span>Mon - Fri: 8:00 AM - 6:00 PM (GMT+8)</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setRfqSuccess(true);
                      setRfqModalOpen(true);
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        required
                        type="text"
                        placeholder="Your Full Name"
                        className="w-full p-3.5 rounded-2xl bg-[#F0F7FA] border border-[#E0EDF2] text-[#1E3A5F] font-medium outline-none"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Business Email"
                        className="w-full p-3.5 rounded-2xl bg-[#F0F7FA] border border-[#E0EDF2] text-[#1E3A5F] font-medium outline-none"
                      />
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Write your wholesale inquiry, target order quantity or custom OEM requirements..."
                      className="w-full p-3.5 rounded-2xl bg-[#F0F7FA] border border-[#E0EDF2] text-[#1E3A5F] font-medium outline-none"
                    />
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-full bg-[#1E3A5F] text-white font-bold text-xs shadow-md hover:bg-[#122742] transition-all flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Direct Message</span>
                    </button>
                  </form>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* 4. FOOTER */}
      <footer className="mt-16 bg-white border-t border-white/60 pt-12 pb-8 px-4 md:px-10 text-left" aria-label="Site Footer">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 pb-10 border-b border-[#EDF4F7]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#BCE0FD] flex items-center justify-center text-sm">
                🧸
              </div>
              <span className="font-extrabold text-base text-[#1E3A5F]">
                {website.name}
              </span>
            </div>
            <p className="text-xs text-[#7B9CAB] leading-relaxed">
              Handcrafted organic toys and Montessori educational wooden sets for international retailers & families worldwide.
            </p>
          </div>

          <div className="space-y-2 text-xs text-[#5E8094]">
            <div className="font-bold text-[#1E3A5F] text-sm mb-2">Quick Navigation</div>
            <button onClick={() => setCurrentPage('catalog')} className="block hover:text-[#1E3A5F]">Full Catalog</button>
            <button onClick={() => setCurrentPage('about')} className="block hover:text-[#1E3A5F]">Our Workshop</button>
            <button onClick={() => setCurrentPage('wholesale')} className="block hover:text-[#1E3A5F]">Wholesale Partnerships</button>
            <button onClick={() => setCurrentPage('safety')} className="block hover:text-[#1E3A5F]">Safety Certifications</button>
          </div>

          <div className="space-y-2 text-xs text-[#5E8094]">
            <div className="font-bold text-[#1E3A5F] text-sm mb-2">Safety Directives</div>
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
          <div>© {new Date().getFullYear()} {website.name}. All Rights Reserved.</div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="font-bold text-[#1E3A5F]">XiSync Site Engine</span>
          </div>
        </div>
      </footer>

      {/* 5. INSTANT WHOLESALE RFQ / SAMPLE MODAL */}
      {rfqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E3A5F]/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[36px] max-w-md w-full p-6 md:p-8 shadow-2xl space-y-4 relative border border-white text-left">
            <button
              onClick={() => {
                setRfqModalOpen(false);
                setRfqSuccess(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#EDF5F8] text-[#4A6B82] hover:bg-[#DCEBF0] flex items-center justify-center"
              aria-label="Close dialog"
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
