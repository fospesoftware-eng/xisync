import { Link } from 'react-router-dom';
import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { CTASection } from '../../components/marketing/CTASection';
import { ScrollProgress } from '../../components/marketing/premium/ScrollProgress';
import { Reveal } from '../../components/marketing/premium/Reveal';
import { PageHero } from '../../components/marketing/MarketingUI';
import { useI18n } from '../../lib/i18n';
import {
  MessageSquare, Store, Ship, FileText, Zap, Code2, Webhook, ArrowRight, Check,
} from 'lucide-react';

type Status = 'live' | 'soon';

type Integration = {
  name: string;
  tagline: { en: string; zh: string };
  points: { en: string; zh: string }[];
  status: Status;
};

type Category = {
  id: string;
  icon: typeof MessageSquare;
  name: { en: string; zh: string };
  desc: { en: string; zh: string };
  accent: string;
  items: Integration[];
};

const categories: Category[] = [
  {
    id: 'marketplaces',
    icon: Store,
    name: { en: 'B2B Marketplaces', zh: 'B2B 平台' },
    desc: {
      en: 'Pull inquiries and orders from the platforms your buyers already use.',
      zh: '从买家常用的平台自动同步询盘与订单。',
    },
    accent: 'bg-xisync-blue-50 text-xisync-blue-600',
    items: [
      {
        name: 'Alibaba.com',
        tagline: { en: 'Verified partner connection', zh: '官方认证合作伙伴对接' },
        points: [
          { en: 'Inquiry & RFQ sync into CRM', zh: '询盘与 RFQ 自动进入 CRM' },
          { en: 'Product listing sync', zh: '产品信息同步' },
          { en: 'Order import & status updates', zh: '订单导入与状态回传' },
        ],
        status: 'live',
      },
      {
        name: 'Made-in-China.com',
        tagline: { en: 'Lead and inquiry ingestion', zh: '线索与询盘接入' },
        points: [
          { en: 'Lead import pipeline', zh: '线索导入管道' },
          { en: 'Inquiry auto-routing', zh: '询盘自动分配' },
          { en: 'Product catalog mapping', zh: '产品目录映射' },
        ],
        status: 'live',
      },
      {
        name: 'Amazon Seller',
        tagline: { en: 'FBA & order management', zh: 'FBA 与订单管理' },
        points: [
          { en: 'Order sync & inventory', zh: '订单与库存同步' },
          { en: 'FBA shipment tracking', zh: 'FBA 货物追踪' },
          { en: 'Review notifications', zh: '评价提醒' },
        ],
        status: 'soon',
      },
      {
        name: 'Shopify',
        tagline: { en: 'DTC storefront connection', zh: '独立站店铺对接' },
        points: [
          { en: 'Order & customer sync', zh: '订单与客户同步' },
          { en: 'Product catalog mirror', zh: '产品目录镜像' },
          { en: 'Fulfillment status', zh: '履约状态回传' },
        ],
        status: 'live',
      },
    ],
  },
  {
    id: 'messaging',
    icon: MessageSquare,
    name: { en: 'Messaging Channels', zh: '沟通渠道' },
    desc: {
      en: 'Every buyer conversation in one shared, translated inbox.',
      zh: '所有买家对话汇聚到一个带翻译的共享收件箱。',
    },
    accent: 'bg-xisync-green-50 text-xisync-green-600',
    items: [
      {
        name: 'WhatsApp Business',
        tagline: { en: 'Official BSP API connection', zh: '官方 BSP API 对接' },
        points: [
          { en: 'Template & session messages', zh: '模板消息与会话消息' },
          { en: 'Media & document sharing', zh: '媒体与文件发送' },
          { en: 'Multi-agent team inbox', zh: '多坐席团队收件箱' },
        ],
        status: 'live',
      },
      {
        name: 'WeChat',
        tagline: { en: 'Official Account & Work', zh: '公众号与企业微信' },
        points: [
          { en: 'Service account messages', zh: '服务号消息' },
          { en: 'WeCom group routing', zh: '企业微信群路由' },
          { en: 'QR & mini-program links', zh: '二维码与小程序链接' },
        ],
        status: 'live',
      },
      {
        name: 'Gmail / Outlook',
        tagline: { en: 'OAuth two-way sync', zh: 'OAuth 双向同步' },
        points: [
          { en: 'Two-way email sync', zh: '邮件双向同步' },
          { en: 'Threads, labels & search', zh: '会话、标签与搜索' },
          { en: 'Any IMAP/SMTP provider', zh: '支持任意 IMAP/SMTP' },
        ],
        status: 'live',
      },
      {
        name: 'Instagram & Facebook',
        tagline: { en: 'DMs and comments unified', zh: '私信与评论统一管理' },
        points: [
          { en: 'Direct messages in inbox', zh: '私信进入统一收件箱' },
          { en: 'Comment-to-lead capture', zh: '评论转线索' },
          { en: 'Story mention alerts', zh: '快拍提及提醒' },
        ],
        status: 'live',
      },
    ],
  },
  {
    id: 'logistics',
    icon: Ship,
    name: { en: 'Carriers & Logistics', zh: '承运商与物流' },
    desc: {
      en: 'Live tracking data straight from carriers and freight forwarders.',
      zh: '直接对接承运商与货代的实时追踪数据。',
    },
    accent: 'bg-xisync-cyan-50 text-xisync-cyan-600',
    items: [
      {
        name: 'Maersk & COSCO',
        tagline: { en: 'Ocean carrier APIs', zh: '海运承运商 API' },
        points: [
          { en: 'Container milestone feeds', zh: '集装箱里程碑数据' },
          { en: 'Roll-over & delay alerts', zh: '滚装与延误预警' },
          { en: 'Vessel ETA tracking', zh: '船期 ETA 追踪' },
        ],
        status: 'live',
      },
      {
        name: 'DHL · FedEx · UPS',
        tagline: { en: 'Express & air freight', zh: '快递与空运' },
        points: [
          { en: 'Real-time express tracking', zh: '快递实时追踪' },
          { en: 'Air waybill milestones', zh: '空运单里程碑' },
          { en: 'Proof of delivery', zh: '签收凭证' },
        ],
        status: 'live',
      },
      {
        name: 'Freight Forwarders',
        tagline: { en: 'Forwarder EDI links', zh: '货代 EDI 对接' },
        points: [
          { en: 'Booking confirmation sync', zh: '订舱确认同步' },
          { en: 'B/L document exchange', zh: '提单单据交换' },
          { en: 'Customs status updates', zh: '清关状态更新' },
        ],
        status: 'soon',
      },
    ],
  },
  {
    id: 'docs',
    icon: FileText,
    name: { en: 'Documents & Storage', zh: '单据与存储' },
    desc: {
      en: 'Trade documents and files connected to every deal.',
      zh: '贸易单据与文件随每笔订单自动关联。',
    },
    accent: 'bg-ink-100 text-ink-900',
    items: [
      {
        name: 'Google Drive',
        tagline: { en: 'Cloud storage sync', zh: '云盘同步' },
        points: [
          { en: 'Folder & file sync', zh: '文件夹与文件同步' },
          { en: 'Sharing permissions', zh: '共享权限管理' },
          { en: 'Full-text search', zh: '全文搜索' },
        ],
        status: 'live',
      },
      {
        name: 'OneDrive / Dropbox',
        tagline: { en: 'Business file storage', zh: '企业文件存储' },
        points: [
          { en: 'Two-way file sync', zh: '文件双向同步' },
          { en: 'Version history', zh: '版本历史' },
          { en: 'Office document preview', zh: 'Office 文档预览' },
        ],
        status: 'live',
      },
    ],
  },
  {
    id: 'platform',
    icon: Zap,
    name: { en: 'Productivity & Automation', zh: '效率与自动化' },
    desc: {
      en: 'Push events to the tools your ops team lives in.',
      zh: '把业务事件推送到运营团队常用的工具中。',
    },
    accent: 'bg-xisync-blue-50 text-xisync-blue-600',
    items: [
      {
        name: 'Slack & Microsoft Teams',
        tagline: { en: 'Team notifications', zh: '团队通知' },
        points: [
          { en: 'Deal & delay alerts', zh: '订单与延误提醒' },
          { en: 'Approval workflows', zh: '审批工作流' },
          { en: 'Daily digest summaries', zh: '每日摘要推送' },
        ],
        status: 'live',
      },
      {
        name: 'Zapier',
        tagline: { en: '5,000+ apps connected', zh: '连接 5,000+ 应用' },
        points: [
          { en: 'No-code automation', zh: '无代码自动化' },
          { en: 'Triggers & multi-step actions', zh: '触发器与多步操作' },
          { en: 'ERP & accounting links', zh: 'ERP 与财务软件对接' },
        ],
        status: 'live',
      },
    ],
  },
];

export function IntegrationsPage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);

  const stats = [
    { value: '30+', label: { en: 'native integrations', zh: '个原生集成' } },
    { value: '5,000+', label: { en: 'apps via Zapier', zh: '个应用经 Zapier 连接' } },
    { value: 'REST', label: { en: 'open API & webhooks', zh: '开放 API 与 Webhooks' } },
    { value: '<15 min', label: { en: 'average setup time', zh: '平均接入时间' } },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-ink-50">
      <ScrollProgress />
      <Header />

      <main>
        <PageHero
          eyebrow={t('Integrations Ecosystem', '集成生态')}
          title={
            isZh ? (
              <>连接您正在使用的<span className="gradient-text">全部工具</span></>
            ) : (
              <>Connects to <span className="gradient-text">your entire stack</span></>
            )
          }
          subtitle={t(
            'Marketplaces, messaging, carriers, documents and automation — XiSync plugs into the tools exporters already run on, with an open API for everything else.',
            '平台、沟通、承运商、单据与自动化——XiSync 直接接入出口商正在使用的工具，其余系统可通过开放 API 连接。'
          )}
          primaryCta={t('Start Free Trial', '开始免费试用')}
          primaryHref="/demo"
          secondaryCta={t('View API Docs', '查看 API 文档')}
          secondaryHref="/demo"
        />

        {/* Stats */}
        <section className="relative z-10 -mt-6 pb-8">
          <div className="container-custom">
            <Reveal y={16}>
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-ink-100 bg-white/80 p-6 shadow-premium backdrop-blur-xl lg:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label.en} className="text-center">
                    <div className="text-2xl font-bold gradient-text md:text-3xl">{s.value}</div>
                    <div className="mt-1 text-xs font-medium text-ink-500 md:text-sm">{t(s.label.en, s.label.zh)}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Categories */}
        {categories.map((cat, ci) => (
          <section
            key={cat.id}
            className={`py-16 lg:py-24 ${ci % 2 === 1 ? 'bg-white' : 'bg-ink-50/60'}`}
          >
            <div className="container-custom">
              <Reveal>
                <div className="mb-10 flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cat.accent}`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-ink-950 md:text-3xl">
                      {t(cat.name.en, cat.name.zh)}
                    </h2>
                    <p className="mt-1 text-sm text-ink-500 md:text-base">{t(cat.desc.en, cat.desc.zh)}</p>
                  </div>
                </div>
              </Reveal>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((item, i) => (
                  <Reveal key={item.name} delay={(i % 3) * 0.08} className="h-full">
                    <div className="card-lift group h-full rounded-2xl border border-ink-200 bg-white p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ink-100 to-ink-200 text-base font-black text-ink-500">
                          {item.name.charAt(0)}
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            item.status === 'live'
                              ? 'bg-xisync-green-100 text-xisync-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {item.status === 'live' ? t('Live', '已上线') : t('Coming soon', '即将上线')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-ink-950">{item.name}</h3>
                      <p className="mt-0.5 text-xs font-medium gradient-text">{t(item.tagline.en, item.tagline.zh)}</p>
                      <ul className="mt-4 space-y-2">
                        {item.points.map((p) => (
                          <li key={p.en} className="flex items-start gap-2 text-sm text-ink-600">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-xisync-green-500" />
                            <span>{t(p.en, p.zh)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Developer / API section */}
        <section className="relative overflow-hidden bg-ink-950 py-20 lg:py-28">
          <div className="absolute inset-0 bg-grid-subtle opacity-30" />
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-xisync-blue-600/15 blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-xisync-green-500/15 blur-[100px]" />

          <div className="container-custom relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/80">
                  <Code2 className="h-3.5 w-3.5" />
                  {t('Developer Platform', '开发者平台')}
                </span>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  {isZh ? <>没有现成集成？<span className="bg-gradient-to-r from-xisync-blue-400 via-xisync-cyan-400 to-xisync-green-400 bg-clip-text text-transparent">用 API 自己搭</span></> : <>Need something custom? <span className="bg-gradient-to-r from-xisync-blue-400 via-xisync-cyan-400 to-xisync-green-400 bg-clip-text text-transparent">Build on our API</span></>}
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-400">
                  {t(
                    'A full REST API, signed webhooks and OAuth let engineering teams connect ERP, accounting and data warehouses — or automate anything the UI doesn’t.',
                    '完整的 REST API、签名 Webhooks 与 OAuth，帮助工程团队对接 ERP、财务系统与数据仓库，或实现界面之外的任何自动化。'
                  )}
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    { icon: Code2, text: t('REST API with OpenAPI 3.1 specification', '基于 OpenAPI 3.1 规范的 REST API') },
                    { icon: Webhook, text: t('Signed webhooks with retry & replay logs', '带签名、重试与回放日志的 Webhooks') },
                    { icon: Zap, text: t('Sandbox environment & 10k req/hour rate limit', '沙箱环境与每小时 1 万次调用额度') },
                  ].map((f) => (
                    <li key={f.text} className="flex items-center gap-3 text-sm text-ink-300">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <f.icon className="h-4 w-4 text-xisync-cyan-400" />
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/demo" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-ink-100">
                    {t('Request API Access', '申请 API 权限')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/demo" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                    {t('Talk to Integrations Team', '联系集成团队')}
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.15} y={32}>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/80 shadow-premium-xl">
                  <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-xisync-blue-400 to-xisync-green-400" />
                    <span className="ml-2 font-mono text-[10px] text-ink-500">POST /api/v1/shipments</span>
                  </div>
                  <pre className="overflow-x-auto p-5 font-mono text-[11px] leading-relaxed text-ink-300">
{`curl https://api.xisync.com/v1/shipments \\
  -H "Authorization: Bearer sk_live_***" \\
  -d '{
    "container": "MSKU-4821",
    "carrier": "cosco",
    "pol": "CNNGB",
    "pod": "DEHAM",
    "incoterm": "CIF",
    "buyer_lang": "de"
  }'

{
  "id": "shp_8f21",
  "status": "at_sea",
  "eta": "2026-09-24",
  "milestones": 6,
  "buyer_notified": true
}`}
                  </pre>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
