import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { GlobalShippingMap } from '../../components/logistics/GlobalShippingMap';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n';
import { Button } from '../../components/ui/Button';
import {
  Package,
  Ship,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Navigation,
  DollarSign,
  Sparkles,
  FileText,
  Globe,
  Plane,
  Truck,
  X,
} from 'lucide-react';

type Shipment = {
  id: string;
  number: string;
  order: string;
  customer: string;
  mode: 'sea' | 'air' | 'rail' | 'road';
  status: 'booked' | 'picked_up' | 'export_cleared' | 'in_transit' | 'arrived' | 'import_cleared' | 'delivered' | 'exception';
  origin: string;
  destination: string;
  etd: string;
  eta: string;
  carrier: string;
  tracking: string;
};

const modeIcons = {
  sea: <Ship className="w-4 h-4" />,
  air: <Plane className="w-4 h-4" />,
  rail: <Truck className="w-4 h-4" />,
  road: <Truck className="w-4 h-4" />,
};

const statusConfig: Record<Shipment['status'], { label: { en: string; zh: string }; color: string; icon: any }> = {
  booked: { label: { en: 'Booked', zh: '已订舱' }, color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', icon: Clock },
  picked_up: { label: { en: 'Picked Up', zh: '已提货' }, color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300', icon: Clock },
  export_cleared: { label: { en: 'Export Cleared', zh: '出口已清关' }, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300', icon: CheckCircle2 },
  in_transit: { label: { en: 'In Transit', zh: '运输中' }, color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300', icon: Ship },
  arrived: { label: { en: 'Arrived', zh: '已到港' }, color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', icon: Clock },
  import_cleared: { label: { en: 'Import Cleared', zh: '进口已清关' }, color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300', icon: CheckCircle2 },
  delivered: { label: { en: 'Delivered', zh: '已送达' }, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', icon: CheckCircle2 },
  exception: { label: { en: 'Exception', zh: '异常' }, color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300', icon: AlertTriangle },
};

const modeLabels: Record<Shipment['mode'], { en: string; zh: string }> = {
  sea: { en: 'Sea', zh: '海运' },
  air: { en: 'Air', zh: '空运' },
  rail: { en: 'Rail', zh: '铁路' },
  road: { en: 'Road', zh: '公路' },
};

export function LogisticsPage() {
  const { tenant } = useAuth();
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const location = useLocation();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync active tab with location path
  const getTabFromPath = () => {
    if (location.pathname.includes('/rates')) return 'rates';
    if (location.pathname.includes('/ai-optimizer')) return 'ai_optimizer';
    if (location.pathname.includes('/customs')) return 'customs';
    if (location.pathname.includes('/map')) return 'map';
    return 'tracking';
  };

  const [activeTab, setActiveTab] = useState<'tracking' | 'rates' | 'ai_optimizer' | 'customs' | 'map'>(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    (async () => {
      try {
        if (tenant) {
          const { data, error } = await supabase
            .from('shipments')
            .select('*, account:accounts(name)')
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            setShipments(
              data.map((row: Record<string, unknown>) => ({
                id: row.id as string,
                number: (row.shipment_number as string) || '—',
                order: (row.order_id as string) || '—',
                customer: ((row.account as { name?: string } | null)?.name) || '—',
                mode: (row.mode as Shipment['mode']) || 'sea',
                status: (row.status as Shipment['status']) || 'booked',
                origin: `${row.origin_port || '—'}, ${row.origin_country || ''}`.trim(),
                destination: `${row.destination_port || '—'}, ${row.destination_country || ''}`.trim(),
                etd: (row.etd as string) || '',
                eta: (row.eta as string) || '',
                carrier: (row.carrier as string) || '—',
                tracking: (row.tracking_number as string) || '—',
              })),
            );
            return;
          }
        }
      } catch (err) {
        console.error('LogisticsPage fetch error:', err);
      }

      // Rich default mock shipments
      setShipments([
        {
          id: 'shp-1',
          number: 'SHP-2026-8801',
          order: 'ORD-9912',
          customer: 'Global Tech Distribution LLC',
          mode: 'sea',
          status: 'in_transit',
          origin: 'Shanghai Port (CNSHA), China',
          destination: 'Los Angeles (USLAX), USA',
          etd: '2026-08-10',
          eta: '2026-08-24',
          carrier: 'COSCO Ocean Express',
          tracking: 'COSCO982314981',
        },
        {
          id: 'shp-2',
          number: 'SHP-2026-8802',
          order: 'ORD-9915',
          customer: 'EuroMarket Wholesale GmbH',
          mode: 'sea',
          status: 'booked',
          origin: 'Ningbo-Zhoushan (CNNGB), China',
          destination: 'Rotterdam (NLRTM), Netherlands',
          etd: '2026-08-18',
          eta: '2026-09-02',
          carrier: 'Maersk Ocean Line',
          tracking: 'MAEU771239812',
        },
        {
          id: 'shp-3',
          number: 'SHP-2026-8803',
          order: 'ORD-9918',
          customer: 'IndoPacific Traders Ltd',
          mode: 'air',
          status: 'delivered',
          origin: 'Shenzhen Yantian (CNSZX), China',
          destination: 'Nhava Sheva (INNSA), India',
          etd: '2026-08-01',
          eta: '2026-08-05',
          carrier: 'DHL Aviation Charter',
          tracking: 'DHL990214812',
        },
        {
          id: 'shp-4',
          number: 'SHP-2026-8804',
          order: 'ORD-9921',
          customer: 'Middle East Commercial Co.',
          mode: 'sea',
          status: 'export_cleared',
          origin: 'Guangzhou Nansha (CNCAN), China',
          destination: 'Jebel Ali (AEDXB), UAE',
          etd: '2026-08-14',
          eta: '2026-08-28',
          carrier: 'CMA CGM Line',
          tracking: 'CMAC998124128',
        },
      ]);
    })();
  }, [tenant]);

  const stats = [
    { title: t('Active Shipments', '在途货件'), value: String(shipments.filter(s => !['delivered', 'exception'].includes(s.status)).length || 12), icon: <Package className="w-5 h-5" />, iconColor: 'bg-xisync-cyan-100 text-xisync-cyan-600' },
    { title: t('In Transit', '运输中'), value: String(shipments.filter(s => s.status === 'in_transit').length || 8), icon: <Ship className="w-5 h-5" />, iconColor: 'bg-xisync-blue-100 text-xisync-blue-600' },
    { title: t('Delivered', '已送达'), value: String(shipments.filter(s => s.status === 'delivered').length || 45), icon: <CheckCircle2 className="w-5 h-5" />, iconColor: 'bg-xisync-green-100 text-xisync-green-600' },
    { title: t('Exceptions', '异常件'), value: String(shipments.filter(s => s.status === 'exception').length || 1), icon: <AlertTriangle className="w-5 h-5" />, iconColor: 'bg-red-100 text-red-600' },
  ];

  const carrierRates = [
    {
      carrier: 'COSCO Ocean Freight',
      mode: { en: 'Sea FCL (40ft High Cube)', zh: '海运整柜（40 尺高柜）' },
      price: '$2,450',
      days: '14 Days',
      co2: '1.2 Tons CO2',
      tag: { en: 'Best Rate ⭐', zh: '最优运价 ⭐' },
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300',
    },
    {
      carrier: 'Maersk Ocean Express',
      mode: { en: 'Sea FCL (40ft High Cube)', zh: '海运整柜（40 尺高柜）' },
      price: '$2,890',
      days: '12 Days',
      co2: '1.1 Tons CO2',
      tag: { en: 'Fastest Sea ⚡', zh: '最快海运 ⚡' },
      tagColor: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-300',
    },
    {
      carrier: 'DHL Air Cargo Charter',
      mode: { en: 'Air Freight Express', zh: '空运快递' },
      price: '$6,800',
      days: '3 Days',
      co2: '4.5 Tons CO2',
      tag: { en: 'Express Air ✈️', zh: '空运特快 ✈️' },
      tagColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300',
    },
    {
      carrier: 'China-Europe Rail Express',
      mode: { en: 'Rail Intermodal', zh: '铁路多式联运' },
      price: '$3,200',
      days: '16 Days',
      co2: '0.8 Tons CO2',
      tag: { en: 'Low Carbon 🌱', zh: '低碳排放 🌱' },
      tagColor: 'bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-950/80 dark:text-lime-300',
    },
  ];

  const isUltra = location.pathname.startsWith('/dashboard/ultra');
  const basePath = isUltra ? '/dashboard/ultra/logistics' : '/dashboard/logistics';

  return (
    <div className="space-y-6 text-slate-900 dark:text-white bg-slate-50/60 dark:bg-transparent p-2 md:p-4 rounded-3xl min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('Global Trade Logistics & Freight Hub', '全球贸易物流与货运中心')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">
            {t('Manage exporter cargo shipments, compare spot rates, track vessel transit, and view global maritime AIS heatmap', '管理出口货件、对比现货运价、追踪船舶运输动态，并查看全球海运 AIS 热力图')}
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>{t('Create Shipment', '新建货件')}</Button>
      </div>

      {/* Stats Deck */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Detailed Sub-Navigation Menu Bar (Map Moved to Last Position!) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold shadow-xs overflow-x-auto">
        <Link
          to={`${basePath}/tracking`}
          onClick={() => setActiveTab('tracking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'tracking'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{t('Tracking', '追踪')}</span>
        </Link>

        <Link
          to={`${basePath}/rates`}
          onClick={() => setActiveTab('rates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'rates'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>{t('Rates', '运价')}</span>
        </Link>

        <Link
          to={`${basePath}/ai-optimizer`}
          onClick={() => setActiveTab('ai_optimizer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'ai_optimizer'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{t('AI Risk', 'AI 风险')}</span>
        </Link>

        <Link
          to={`${basePath}/customs`}
          onClick={() => setActiveTab('customs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'customs'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t('Customs', '清关')}</span>
        </Link>

        <Link
          to={`${basePath}/map`}
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'map'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t('Map', '地图')}</span>
        </Link>
      </div>

      {/* Menu 1: Full-Page Animated Global Shipping Map (China Beacons & World Continents) */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <GlobalShippingMap />
        </div>
      )}

      {/* Menu 2: Vessel & Cargo Shipment Tracking Table */}
      {activeTab === 'tracking' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('Search shipments...', '搜索货件…')}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              />
            </div>
            <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
              {t('Filter', '筛选')}
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-3 text-left font-bold text-slate-500 uppercase">{t('Shipment', '货件')}</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-500 uppercase">{t('Customer', '客户')}</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-500 uppercase">{t('Route', '路线')}</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-500 uppercase">{t('Mode', '运输方式')}</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-500 uppercase">{t('Status', '状态')}</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-500 uppercase">{t('ETA', '预计到达')}</th>
                  <th className="px-6 py-3 text-right font-bold text-slate-500 uppercase">{t('Actions', '操作')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                {shipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                    onClick={() => setSelectedShipment(shipment)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900 dark:text-white">{shipment.number}</div>
                      <div className="text-slate-400">{shipment.order}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{shipment.customer}</td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 dark:text-white">{shipment.origin}</div>
                      <div className="text-slate-400 font-normal">{t('to', '至')} {shipment.destination}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {modeIcons[shipment.mode]}
                        </div>
                        <span>{isZh ? modeLabels[shipment.mode].zh : modeLabels[shipment.mode].en}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${statusConfig[shipment.status].color}`}>
                        {isZh ? statusConfig[shipment.status].label.zh : statusConfig[shipment.status].label.en}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{shipment.eta || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button title={t('View details', '查看详情')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Menu 3: Spot Freight Rates Comparison */}
      {activeTab === 'rates' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{t('Live Carrier Spot Freight Rates', '承运商现货运价实时对比')}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {carrierRates.map((rate) => (
                <div key={rate.carrier} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">{rate.carrier}</div>
                      <div className="text-xs text-slate-400 font-medium">{isZh ? rate.mode.zh : rate.mode.en}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${rate.tagColor}`}>{isZh ? rate.tag.zh : rate.tag.en}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                    <div className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">{rate.price}</div>
                    <button
                      onClick={() => triggerToast(t(`Booked ${rate.carrier} spot freight rate!`, `已预订 ${rate.carrier} 现货运价！`))}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs"
                    >
                      {t('Book Rate', '预订运价')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu 4: AI Risk & Route Optimizer */}
      {activeTab === 'ai_optimizer' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{t('AI Route & Port Congestion Optimizer', 'AI 路线与港口拥堵优化器')}</h3>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">{t('Suggested Suez Canal Alternate Passage', '建议苏伊士运河替代航线')}</div>
            <p className="text-slate-500 dark:text-slate-400">
              {t('Rerouting cargo via Cape of Good Hope reduces port congestion waiting time by 4.2 days for Rotterdam bound vessels.', '绕行好望角可使前往鹿特丹的船舶减少 4.2 天港口拥堵等待时间。')}
            </p>
          </div>
        </div>
      )}

      {/* Menu 5: Customs Clearance & Duty Saver */}
      {activeTab === 'customs' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{t('Automated Customs Entry & Duty Saver', '自动报关与关税节省')}</h3>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">{t('US Section 301 Tariff Exemption Check', '美国 301 关税豁免核查')}</div>
            <p className="text-slate-500 dark:text-slate-400">
              {t('Verified HTS Code 8504.40.9580 eligible for 25% duty exemption. Estimated savings: $2,800 / container.', '经核实 HTS 编码 8504.40.9580 符合 25% 关税豁免条件。预计每个集装箱节省 2,800 美元。')}
            </p>
          </div>
        </div>
      )}

      {/* Selected Shipment Detail Drawer Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="font-extrabold text-lg text-slate-900 dark:text-white">{selectedShipment.number}</div>
                <div className="text-xs text-slate-400 font-medium">{selectedShipment.customer}</div>
              </div>
              <button onClick={() => setSelectedShipment(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-slate-400 font-bold">{t('Origin', '起运港')}</div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedShipment.origin}</div>
                  <div className="text-slate-400 mt-1">{t('ETD:', '预计发运：')} {selectedShipment.etd}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-bold">{t('Destination', '目的港')}</div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedShipment.destination}</div>
                  <div className="text-slate-400 mt-1">{t('ETA:', '预计到达：')} {selectedShipment.eta}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-400">{t('Carrier Line:', '承运商：')}</span>
                  <span className="text-slate-900 dark:text-white">{selectedShipment.carrier}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-400">{t('Tracking Number:', '追踪号：')}</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono">{selectedShipment.tracking}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button onClick={() => setSelectedShipment(null)}>{t('Close', '关闭')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
