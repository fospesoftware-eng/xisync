import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { CTASection } from '../../components/marketing/CTASection';
import { ScrollProgress } from '../../components/marketing/premium/ScrollProgress';
import { Reveal } from '../../components/marketing/premium/Reveal';
import { PageHero, CheckItem } from '../../components/marketing/MarketingUI';
import { useI18n } from '../../lib/i18n';
import {
  Cpu, Factory, Shirt, Car, Home, AlertTriangle, TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Industry = {
  id: string;
  icon: LucideIcon;
  name: { en: string; zh: string };
  title: { en: string; zh: string };
  tagline: { en: string; zh: string };
  description: { en: string; zh: string };
  challenges: { en: string; zh: string }[];
  solutions: { en: string; zh: string }[];
  stats: { value: string; label: { en: string; zh: string } }[];
  accent: string;
  chip: string;
};

const industries: Industry[] = [
  {
    id: 'electronics',
    icon: Cpu,
    name: { en: 'Electronics & Hardware', zh: '电子与智能硬件' },
    title: {
      en: 'Electronics & Smart Hardware Exporters',
      zh: '电子与智能硬件出口商',
    },
    tagline: {
      en: 'Certification-heavy products shipped to buyers who demand zero surprises.',
      zh: '认证要求高的品类，面向绝不接受意外的海外买家。',
    },
    description: {
      en: 'From smart home devices to industrial modules, electronics orders live or die on certification paperwork, serial-level traceability and battery shipping rules. XiSync keeps CE/FCC/RoHS documentation attached to every deal and flags risky SKUs before they leave the factory.',
      zh: '从智能家居设备到工业模组，电子产品订单的成败取决于认证文件、序列号级追溯与电池运输规范。XiSync 将 CE/FCC/RoHS 文件与每笔订单绑定，在货物出厂前自动预警高风险 SKU。',
    },
    challenges: [
      { en: 'CE / FCC / RoHS certificates expire unnoticed', zh: 'CE / FCC / RoHS 证书到期无人察觉' },
      { en: 'Lithium battery shipments rejected at booking', zh: '含锂电池货物在订舱时被拒' },
      { en: 'Serial-number warranty claims hard to trace', zh: '序列号保修索赔难以追溯' },
      { en: 'Rapid product updates make quotes error-prone', zh: '产品迭代快，报价极易出错' },
    ],
    solutions: [
      { en: 'Certificate vault with auto-expiry alerts per SKU', zh: '按 SKU 管理的证书库，到期自动预警' },
      { en: 'Dangerous-goods (DG) shipping checklist for lithium', zh: '锂电池危险品运输核查清单' },
      { en: 'Serial/lot tracking synced to buyer portal', zh: '序列号与批次追踪同步至买家门户' },
      { en: 'AI quotes with real-time BOM & exchange rates', zh: '基于实时 BOM 与汇率的 AI 报价' },
    ],
    stats: [
      { value: '0', label: { en: 'certification holds', zh: '认证原因卡关' } },
      { value: '-90%', label: { en: 'doc prep time', zh: '单据准备时间' } },
      { value: '100%', label: { en: 'DG compliance', zh: '危险品合规率' } },
    ],
    accent: 'bg-xisync-blue-50 text-xisync-blue-600',
    chip: 'bg-xisync-blue-100 text-xisync-blue-700',
  },
  {
    id: 'machinery',
    icon: Factory,
    name: { en: 'Industrial Machinery', zh: '工业机械与零部件' },
    title: {
      en: 'Industrial Machinery & Equipment',
      zh: '工业机械与设备出口',
    },
    tagline: {
      en: 'Six-month sales cycles, breakbulk freight and milestone payments — managed end to end.',
      zh: '半年起步的销售周期、散杂货海运与分阶段付款——全程可管可控。',
    },
    description: {
      en: 'Machinery deals involve technical spec sheets, multi-stage payments, installation and long after-sales tails. XiSync’s long-cycle pipeline tracks deposits, production inspection, shipment and commissioning — while the buyer portal keeps overseas dealers updated without constant email chasing.',
      zh: '机械订单涉及技术规格书、分阶段付款、安装调试与长期售后。XiSync 的长周期管道跟踪定金、生产验货、发货与调试各节点；买家门户让海外经销商随时掌握进度，无需反复邮件追问。',
    },
    challenges: [
      { en: 'Milestone payments lost in long email threads', zh: '分阶段付款信息淹没在漫长邮件中' },
      { en: 'Breakbulk / RoRo freight coordination is manual', zh: '散杂货与滚装船协调全靠人工' },
      { en: 'Installation & commissioning reports scattered', zh: '安装调试报告分散各处' },
      { en: 'Spare-parts reorders hard to forecast', zh: '备件返单需求难以预测' },
    ],
    solutions: [
      { en: 'Milestone-based deal pipeline (deposit → delivery)', zh: '按里程碑管理的订单管道（定金到交付）' },
      { en: 'Breakbulk & container shipping in one timeline', zh: '散杂货与集装箱运输统一时间线' },
      { en: 'Installation reports stored against machine serials', zh: '安装报告与设备序列号绑定存档' },
      { en: 'AI spare-parts reorder recommendations', zh: 'AI 备件返单建议' },
    ],
    stats: [
      { value: '6 mo+', label: { en: 'deal cycles supported', zh: '超长订单周期支持' } },
      { value: '+38%', label: { en: 'on-time payments', zh: '按期回款率提升' } },
      { value: '-70%', label: { en: 'status emails', zh: '状态询问邮件减少' } },
    ],
    accent: 'bg-ink-100 text-ink-900',
    chip: 'bg-ink-200 text-ink-700',
  },
  {
    id: 'textiles',
    icon: Shirt,
    name: { en: 'Textiles & Apparel', zh: '纺织品与服装' },
    title: {
      en: 'Textiles, Apparel & Home Textiles',
      zh: '纺织、服装与家纺出口',
    },
    tagline: {
      en: 'High-volume Alibaba RFQs, samples to track and fabric certifications to manage.',
      zh: '海量阿里巴巴询盘、样品跟进与面料认证管理。',
    },
    description: {
      en: 'Apparel exporters juggle hundreds of RFQs, sample shipments, size/color variants and strict destination testing requirements. XiSync auto-captures every marketplace inquiry, follows up while the buyer is still online, and keeps OEKO-TEX, GOTS and test reports one click away for QC and customs.',
      zh: '服装出口商每天要处理大量询盘、样品寄送、尺码颜色变体，以及目的国严格的检测要求。XiSync 自动抓取各平台询盘，在买家在线时第一时间跟进，并将 OEKO-TEX、GOTS 等检测报告集中管理，质检与报关一键调取。',
    },
    challenges: [
      { en: 'Hundreds of RFQs answered too late, if at all', zh: '大量询盘回复不及时甚至遗漏' },
      { en: 'Sample shipments never followed up', zh: '样品寄出后无人跟进' },
      { en: 'Fabric test reports expire across seasons', zh: '面料检测报告跨季节过期' },
      { en: 'Size/color variants cause quote errors', zh: '尺码颜色变体导致报价错误' },
    ],
    solutions: [
      { en: 'Auto-capture Alibaba & Made-in-China RFQs', zh: '自动抓取阿里巴巴与中国制造网询盘' },
      { en: 'Sample tracking with follow-up reminders', zh: '样品寄送追踪与跟进提醒' },
      { en: 'OEKO-TEX / GOTS report vault per fabric', zh: '按面料管理的 OEKO-TEX / GOTS 报告库' },
      { en: 'Variant-aware multi-currency quoting', zh: '支持变体的多币种报价' },
    ],
    stats: [
      { value: '10x', label: { en: 'faster RFQ response', zh: '询盘响应速度' } },
      { value: '+2.3x', label: { en: 'sample-to-order rate', zh: '样品转化率提升' } },
      { value: '100%', label: { en: 'reports audit-ready', zh: '报告随时可审计' } },
    ],
    accent: 'bg-xisync-cyan-50 text-xisync-cyan-600',
    chip: 'bg-xisync-cyan-100 text-xisync-cyan-700',
  },
  {
    id: 'automotive',
    icon: Car,
    name: { en: 'Automotive & Aftermarket', zh: '汽车与售后市场' },
    title: {
      en: 'Automotive Parts & Aftermarket Suppliers',
      zh: '汽车零部件与售后市场供应商',
    },
    tagline: {
      en: 'Exact-fit parts, global distributors and documentation that has to be perfect.',
      zh: '精准适配的零件、全球分销网络，以及容不得差错的单据。',
    },
    description: {
      en: 'Aftermarket exporters live on catalog precision: one wrong fitment kills a dealer relationship. XiSync links every quote and shipment to fitment data, manages distributor reorder cycles, and ensures packaging lists, origin certificates and warranty docs meet each market’s import requirements.',
      zh: '售后市场出口靠的是目录精准度——一次适配错误就会断送经销商关系。XiSync 将每次报价与发货同适配数据关联，管理经销商返单周期，并确保装箱单、原产地证与保修文件符合各市场的进口要求。',
    },
    challenges: [
      { en: 'Fitment errors lead to returns & disputes', zh: '适配错误导致退货与纠纷' },
      { en: 'Distributor reorders tracked in spreadsheets', zh: '经销商返单用表格手工跟踪' },
      { en: 'Mixed-LCL shipments hard to reconcile', zh: '拼箱混装难以核对' },
      { en: 'Warranty claims lack shipment proof', zh: '保修索赔缺少发货凭证' },
    ],
    solutions: [
      { en: 'Fitment validation at quote and pick stages', zh: '报价与拣货环节双重适配校验' },
      { en: 'Distributor reorder cycles with AI forecasts', zh: '经销商返单周期与 AI 预测' },
      { en: 'LCL/FCL shipment reconciliation & alerts', zh: '拼箱/整箱货物核对与预警' },
      { en: 'Warranty docs linked to shipment records', zh: '保修文件与发货记录关联' },
    ],
    stats: [
      { value: '-65%', label: { en: 'fitment disputes', zh: '适配纠纷减少' } },
      { value: '+42%', label: { en: 'repeat reorders', zh: '重复返单增长' } },
      { value: '24/7', label: { en: 'dealer visibility', zh: '经销商全程可见' } },
    ],
    accent: 'bg-xisync-green-50 text-xisync-green-600',
    chip: 'bg-xisync-green-100 text-xisync-green-700',
  },
  {
    id: 'consumer',
    icon: Home,
    name: { en: 'Consumer Goods & Home', zh: '消费品与家居' },
    title: {
      en: 'Consumer Goods & Home Products',
      zh: '消费品与家居用品出口',
    },
    tagline: {
      en: 'Seasonal peaks, barcode compliance and retail buyers with strict portal requirements.',
      zh: '季节性高峰、条码合规，以及对供应商门户要求严格的零售买家。',
    },
    description: {
      en: 'Home goods exporters face brutal seasonal shipping windows and retailer compliance rules — barcode formats, carton labels, advance shipping notices. XiSync plans peak-season capacity early, auto-generates compliant labeling and ASN documents, and gives every retail buyer the branded order visibility they expect.',
      zh: '家居用品出口商面临紧张的季节性船期窗口和零售商合规要求——条码格式、箱唛标签、提前发货通知（ASN）。XiSync 提前规划旺季运力，自动生成合规标签与 ASN 单据，并为每位零售买家提供其期望的品牌化订单可视化体验。',
    },
    challenges: [
      { en: 'Peak-season containers booked too late', zh: '旺季舱位预订太晚错失船期' },
      { en: 'Retailer label/ASN requirements differ per chain', zh: '各零售连锁标签与 ASN 要求各异' },
      { en: 'Buyers demand order portals, not email updates', zh: '买家要求自助门户而非邮件汇报' },
      { en: 'Multi-language product content inconsistent', zh: '多语言产品内容不一致' },
    ],
    solutions: [
      { en: 'Peak-season capacity planning & alerts', zh: '旺季运力规划与提前预警' },
      { en: 'Auto-generated barcode labels & ASN docs', zh: '自动生成条码标签与 ASN 单据' },
      { en: 'White-label portal per retail buyer', zh: '为每位零售买家提供白标门户' },
      { en: 'Translated catalog & QC reports in-portal', zh: '门户内多语言目录与质检报告' },
    ],
    stats: [
      { value: '+31%', label: { en: 'peak on-time delivery', zh: '旺季准时交付率提升' } },
      { value: '-55%', label: { en: 'labeling errors', zh: '标签错误减少' } },
      { value: '70%', label: { en: 'buyer self-service', zh: '买家自助服务率' } },
    ],
    accent: 'bg-xisync-blue-50 text-xisync-blue-600',
    chip: 'bg-xisync-blue-100 text-xisync-blue-700',
  },
];

export function SolutionsPage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);

  return (
    <div className="min-h-screen overflow-x-clip bg-ink-50">
      <ScrollProgress />
      <Header />

      <main>
        <PageHero
          eyebrow={t('Solutions by Industry', '行业解决方案')}
          title={
            isZh ? (
              <>为您的行业<span className="gradient-text">量身而建</span></>
            ) : (
              <>Built for <span className="gradient-text">your industry</span></>
            )
          }
          subtitle={t(
            'Export workflows are not one-size-fits-all. XiSync comes pre-configured with the compliance rules, documents and sales motions your industry runs on — so your team works the way your buyers expect.',
            '出口流程从来不是一套模板走天下。XiSync 预装了您所在行业的合规规则、贸易单据与销售流程，让团队以买家期待的方式开展业务。'
          )}
          primaryCta={t('Start 14-Day Free Trial', '开始 14 天免费试用')}
          primaryHref="/demo"
          secondaryCta={t('Talk to an Expert', '与行业专家沟通')}
          secondaryHref="/demo"
        />

        {/* Quick nav */}
        <section className="relative z-20 -mt-8 pb-4">
          <div className="container-custom">
            <Reveal y={16}>
              <div className="flex flex-wrap justify-center gap-2.5 rounded-2xl border border-ink-100 bg-white/80 p-3 shadow-premium backdrop-blur-xl">
                {industries.map((ind) => (
                  <a
                    key={ind.id}
                    href={`#${ind.id}`}
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-all duration-200 hover:bg-ink-100 hover:text-ink-950"
                  >
                    <ind.icon className="h-4 w-4 text-xisync-cyan-600" />
                    {t(ind.name.en, ind.name.zh)}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Industry sections */}
        {industries.map((ind, index) => (
          <section
            key={ind.id}
            id={ind.id}
            className={`relative scroll-mt-24 py-20 lg:py-28 ${index % 2 === 1 ? 'bg-white' : 'bg-ink-50/60'}`}
          >
            <div className="container-custom">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <Reveal>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${ind.chip}`}>
                      <ind.icon className="h-3.5 w-3.5" />
                      {t(ind.name.en, ind.name.zh)}
                    </span>
                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink-950 md:text-4xl">
                      {t(ind.title.en, ind.title.zh)}
                    </h2>
                    <p className="mt-2 text-base font-semibold gradient-text">
                      {t(ind.tagline.en, ind.tagline.zh)}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-ink-500">
                      {t(ind.description.en, ind.description.zh)}
                    </p>

                    {/* Challenges vs solutions */}
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-red-700">
                          <AlertTriangle className="h-4 w-4" />
                          {t('The challenge', '行业痛点')}
                        </h3>
                        <ul className="mt-3 space-y-2.5">
                          {ind.challenges.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-red-900/70">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                              {t(c.en, c.zh)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-xisync-green-100 bg-xisync-green-50/50 p-5">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-xisync-green-700">
                          <TrendingUp className="h-4 w-4" />
                          {t('With XiSync', 'XiSync 方案')}
                        </h3>
                        <ul className="mt-3 space-y-2.5">
                          {ind.solutions.map((s, i) => (
                            <CheckItem key={i}>{t(s.en, s.zh)}</CheckItem>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-8 border-t border-ink-100 pt-6">
                      {ind.stats.map((s) => (
                        <div key={s.label.en}>
                          <div className="text-2xl font-bold gradient-text">{s.value}</div>
                          <div className="text-xs font-medium text-ink-400">{t(s.label.en, s.label.zh)}</div>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>

                {/* Visual card */}
                <Reveal delay={0.15} y={32} className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative">
                    <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-xisync-blue-100/60 via-white to-xisync-green-100/60 blur-2xl" />
                    <div className="relative overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-premium-lg">
                      <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50/60 px-6 py-4">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${ind.accent}`}>
                          <ind.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-ink-950">{t(ind.name.en, ind.name.zh)}</div>
                          <div className="text-xs text-ink-400">{t('XiSync configured workspace', 'XiSync 预置工作区')}</div>
                        </div>
                        <span className="ml-auto rounded-full bg-gradient-to-r from-xisync-blue-600 to-xisync-green-500 px-2.5 py-1 text-[10px] font-bold text-white">
                          LIVE
                        </span>
                      </div>
                      <div className="space-y-3 p-6">
                        {ind.solutions.slice(0, 3).map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3.5 shadow-premium-sm"
                            style={{ marginLeft: `${i * 12}px` }}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-xisync-blue-100 to-xisync-green-100 text-xs font-black text-xisync-cyan-700">
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium text-ink-700">{t(s.en, s.zh)}</span>
                          </div>
                        ))}
                        <div className="mt-2 grid grid-cols-3 gap-3 rounded-xl bg-ink-950 p-4 text-center">
                          {ind.stats.map((s) => (
                            <div key={s.label.en}>
                              <div className="bg-gradient-to-r from-xisync-blue-400 via-xisync-cyan-400 to-xisync-green-400 bg-clip-text text-base font-bold text-transparent">
                                {s.value}
                              </div>
                              <div className="mt-0.5 text-[10px] leading-tight text-ink-400">{t(s.label.en, s.label.zh)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ))}

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
