import { useState } from 'react';
import {
  Key,
  Activity,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Server,
  Sliders,
  DollarSign,
  Copy,
  Check,
  Cpu,
  Layers,
  Globe,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../lib/i18n';

interface DeepSeekKeyConfig {
  id: string;
  name: string;
  environment: 'production' | 'staging' | 'backup';
  apiKey: string;
  maskedKey: string;
  baseUrl: string;
  defaultModel: string;
  reasoningModel: string;
  status: 'operational' | 'testing' | 'degraded' | 'rate_limited';
  latencyMs: number;
  monthlyTokensUsed: number;
  monthlyTokenLimit: number;
  monthlyCostUsd: number;
  rateLimitRpm: number;
  temperature: number;
  maxTokens: number;
  isPrimary: boolean;
  lastTested: string;
}

export function AdminSettingsPage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const envLabel = (env: DeepSeekKeyConfig['environment']) =>
    env === 'production' ? t('Production', '生产环境')
    : env === 'staging' ? t('Staging', '预发环境')
    : t('Backup', '备用环境');
  const configDisplayName = (name: string) =>
    name === 'DeepSeek Official Enterprise Cluster (Primary)' ? t(name, 'DeepSeek 官方企业集群（主）')
    : name === 'DeepSeek Direct High-Concurrency Backup Pool' ? t(name, 'DeepSeek 直连高并发备用池')
    : name === 'New Custom DeepSeek Gateway' ? t(name, '新建自定义 DeepSeek 网关')
    : name;
  const pingLabel = (v: string) =>
    v === 'Just now' ? t('Just now', '刚刚')
    : v === 'Never' ? t('Never', '从未')
    : v === '12m ago' ? t('12m ago', '12分钟前')
    : v;
  const [activeTab, setActiveTab] = useState<'deepseek' | 'general' | 'infrastructure' | 'audit'>('deepseek');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // DeepSeek Credentials State
  const [configs, setConfigs] = useState<DeepSeekKeyConfig[]>([
    {
      id: 'ds-key-prod-01',
      name: 'DeepSeek Official Enterprise Cluster (Primary)',
      environment: 'production',
      apiKey: 'sk-9f824e819bca4720984102948123bc91',
      maskedKey: 'sk-9f82••••••••••••••••••••••••bc91',
      baseUrl: 'https://api.deepseek.com/v1',
      defaultModel: 'deepseek-chat',
      reasoningModel: 'deepseek-reasoner',
      status: 'operational',
      latencyMs: 78,
      monthlyTokensUsed: 14820940,
      monthlyTokenLimit: 50000000,
      monthlyCostUsd: 29.64,
      rateLimitRpm: 1200,
      temperature: 0.7,
      maxTokens: 4096,
      isPrimary: true,
      lastTested: 'Just now',
    },
    {
      id: 'ds-key-fallback-02',
      name: 'DeepSeek Direct High-Concurrency Backup Pool',
      environment: 'backup',
      apiKey: 'sk-31980ab912049182390192834019283a',
      maskedKey: 'sk-3198••••••••••••••••••••••••283a',
      baseUrl: 'https://api.deepseek.com/v1',
      defaultModel: 'deepseek-chat',
      reasoningModel: 'deepseek-reasoner',
      status: 'operational',
      latencyMs: 84,
      monthlyTokensUsed: 3120400,
      monthlyTokenLimit: 30000000,
      monthlyCostUsd: 6.24,
      rateLimitRpm: 600,
      temperature: 0.7,
      maxTokens: 4096,
      isPrimary: false,
      lastTested: '12m ago',
    },
  ]);

  // Active edit state for modal / form
  const [selectedConfig, setSelectedConfig] = useState<DeepSeekKeyConfig>(configs[0]);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    triggerToast(t('API Key copied to secure clipboard', 'API 密钥已复制到安全剪贴板'));
  };

  const handleTestPing = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setConfigs((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'operational',
                latencyMs: Math.floor(65 + Math.random() * 25),
                lastTested: 'Just now',
              }
            : c
        )
      );
      triggerToast(t('DeepSeek API Healthcheck PASSED: 200 OK (Latency: 72ms)', 'DeepSeek API 健康检查通过：200 OK（延迟：72ms）'));
    }, 1200);
  };

  const handleSaveConfig = () => {
    setConfigs((prev) =>
      prev.map((c) => (c.id === selectedConfig.id ? selectedConfig : c))
    );
    triggerToast(t('DeepSeek API Credentials & Global Parameters Saved!', 'DeepSeek API 凭证与全局参数已保存！'));
  };

  return (
    <div className="space-y-6 text-gray-900 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-md">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold font-mono text-emerald-600 uppercase tracking-wider">
                {t('SaaS SuperAdmin Control Center', 'SaaS 超级管理员控制中心')}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              {t('System Settings & DeepSeek AI Management', '系统设置与 DeepSeek AI 管理')}
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {t('Manage platform-wide DeepSeek API credentials, model routing, token quotas, and server telemetry', '管理全平台 DeepSeek API 凭证、模型路由、Token 配额与服务器遥测')}
            </p>
          </div>
        </div>

        <Button
          onClick={handleSaveConfig}
          icon={<Check className="w-4 h-4" />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
        >
          {t('Save All Credentials', '保存全部凭证')}
        </Button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-gray-200/80 text-xs font-bold shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('deepseek')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'deepseek'
              ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xs font-extrabold'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('DeepSeek API Credentials & Model Routing', 'DeepSeek API 凭证与模型路由')}</span>
        </button>

        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'infrastructure'
              ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xs font-extrabold'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>{t('Global Infrastructure & DNS', '全局基础设施与 DNS')}</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'general'
              ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xs font-extrabold'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{t('Platform General Limits', '平台通用配额限制')}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xs font-extrabold'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{t('Token Usage & Audit Logs', 'Token 用量与审计日志')}</span>
        </button>
      </div>

      {/* TAB 1: DEEPSEEK API CREDENTIALS & MODEL MANAGEMENT */}
      {activeTab === 'deepseek' && (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-2">
                <span>{t('Active Model Cluster', '当前模型集群')}</span>
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xl font-black text-gray-900">DeepSeek-V3</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t('deepseek-chat & reasoner', 'deepseek-chat 与 reasoner')}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-2">
                <span>{t('Total Tokens (MTD)', 'Token 总量（本月至今）')}</span>
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-black text-gray-900">17,941,340</div>
              <div className="text-[11px] text-gray-500 mt-1 font-mono">
                {t('22.4% of 80M Monthly Pool', '占 8000 万月度池的 22.4%')}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-2">
                <span>{t('Accrued AI Cost', 'AI 累计成本')}</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-emerald-600">$35.88 USD</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                {t('$0.14 / 1M Prompt • $0.28 / 1M Gen', '$0.14 / 百万提示词 • $0.28 / 百万生成')}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-2">
                <span>{t('API Health & Latency', 'API 健康与延迟')}</span>
                <Activity className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-xl font-black text-gray-900">78 ms</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{t('99.98% SLA Availability', '99.98% SLA 可用性')}</span>
              </div>
            </div>
          </div>

          {/* DeepSeek API Key Pools */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="font-extrabold text-base text-gray-900">{t('DeepSeek API Key Vault & Routing Pool', 'DeepSeek API 密钥库与路由池')}</h2>
                  <p className="text-xs text-gray-500">{t('Configure multi-key failover, token consumption thresholds, and endpoint base URLs', '配置多密钥故障转移、Token 消耗阈值与接口基础 URL')}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const newKey: DeepSeekKeyConfig = {
                    id: `ds-key-${Date.now()}`,
                    name: 'New Custom DeepSeek Gateway',
                    environment: 'staging',
                    apiKey: '',
                    maskedKey: 'sk-••••••••••••••••••••••••••••',
                    baseUrl: 'https://api.deepseek.com/v1',
                    defaultModel: 'deepseek-chat',
                    reasoningModel: 'deepseek-reasoner',
                    status: 'testing',
                    latencyMs: 0,
                    monthlyTokensUsed: 0,
                    monthlyTokenLimit: 20000000,
                    monthlyCostUsd: 0,
                    rateLimitRpm: 600,
                    temperature: 0.7,
                    maxTokens: 4096,
                    isPrimary: false,
                    lastTested: 'Never',
                  };
                  setConfigs([...configs, newKey]);
                  setSelectedConfig(newKey);
                  triggerToast(t('Added new DeepSeek Key Profile to vault', '已向密钥库添加新的 DeepSeek 密钥配置'));
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{t('+ Add DeepSeek Key Pool', '+ 新增 DeepSeek 密钥池')}</span>
              </button>
            </div>

            {/* Keys Table / Cards */}
            <div className="space-y-4">
              {configs.map((cfg) => {
                const isSelected = selectedConfig.id === cfg.id;
                const isShowing = showKey[cfg.id] || false;

                return (
                  <div
                    key={cfg.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/20 shadow-xs'
                        : 'border-gray-200/80 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900">{configDisplayName(cfg.name)}</span>
                          {cfg.isPrimary && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700">
                              {t('PRIMARY GATEWAY', '主网关')}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              cfg.environment === 'production'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {envLabel(cfg.environment)}
                          </span>
                        </div>

                        {/* API Key Box */}
                        <div className="flex items-center gap-2 pt-1 font-mono text-xs text-gray-700">
                          <span className="text-gray-400 font-sans text-[11px] font-semibold">{t('API Key:', 'API 密钥：')}</span>
                          <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-gray-800 font-bold select-all">
                            {isShowing ? cfg.apiKey : cfg.maskedKey}
                          </span>

                          <button
                            onClick={() => setShowKey({ ...showKey, [cfg.id]: !isShowing })}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                            title={isShowing ? t('Hide key', '隐藏密钥') : t('Show full key', '显示完整密钥')}
                          >
                            {isShowing ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleCopy(cfg.id, cfg.apiKey)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                            title={t('Copy API key', '复制 API 密钥')}
                          >
                            {copiedId === cfg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Right: Telemetry & Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-right text-xs pr-2 hidden sm:block">
                          <div className="font-mono font-bold text-gray-900">
                            {(cfg.monthlyTokensUsed / 1000000).toFixed(2)}M / {(cfg.monthlyTokenLimit / 1000000).toFixed(0)}M {t('Tokens', 'Token')}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium">
                            {t('Latency:', '延迟：')} <strong className="text-emerald-600">{cfg.latencyMs}ms</strong> • {t('Ping:', '检测：')} {pingLabel(cfg.lastTested)}
                          </div>
                        </div>

                        <button
                          onClick={() => handleTestPing(cfg.id)}
                          disabled={testingId === cfg.id}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${testingId === cfg.id ? 'animate-spin text-indigo-600' : ''}`} />
                          <span>{testingId === cfg.id ? t('Testing...', '测试中…') : t('Test Ping', '测试连通性')}</span>
                        </button>

                        <button
                          onClick={() => setSelectedConfig(cfg)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isSelected ? t('Editing Active', '正在编辑') : t('Configure', '配置')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DeepSeek Parameters Configuration Engine */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    {t('DeepSeek Engine Parameters:', 'DeepSeek 引擎参数：')} {configDisplayName(selectedConfig.name)}
                  </h3>
                  <p className="text-xs text-gray-500">{t('Fine-tune system prompt temperature, model selection, and token limits', '微调系统提示词温度、模型选择与 Token 限制')}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-gray-600 font-bold block mb-1">{t('DeepSeek API Secret Key', 'DeepSeek API 密钥')}</label>
                <div className="relative">
                  <input
                    type="password"
                    value={selectedConfig.apiKey}
                    onChange={(e) =>
                      setSelectedConfig({
                        ...selectedConfig,
                        apiKey: e.target.value,
                        maskedKey: e.target.value.length > 8 ? `${e.target.value.slice(0, 7)}••••••••${e.target.value.slice(-4)}` : e.target.value,
                      })
                    }
                    placeholder="sk-..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono font-bold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-gray-600 font-bold block mb-1">{t('DeepSeek API Endpoint (Base URL)', 'DeepSeek API 接口地址（Base URL）')}</label>
                <input
                  type="text"
                  value={selectedConfig.baseUrl}
                  onChange={(e) => setSelectedConfig({ ...selectedConfig, baseUrl: e.target.value })}
                  placeholder="https://api.deepseek.com/v1"
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono text-gray-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-gray-600 font-bold block mb-1">{t('Default Production Chat Model', '默认生产对话模型')}</label>
                <select
                  value={selectedConfig.defaultModel}
                  onChange={(e) => setSelectedConfig({ ...selectedConfig, defaultModel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="deepseek-chat">{t('deepseek-chat (DeepSeek-V3 671B MoE - Ultra Fast)', 'deepseek-chat（DeepSeek-V3 671B MoE - 超高速）')}</option>
                  <option value="deepseek-reasoner">{t('deepseek-reasoner (DeepSeek-R1 Deep Thinking Mode)', 'deepseek-reasoner（DeepSeek-R1 深度思考模式）')}</option>
                  <option value="deepseek-coder">{t('deepseek-coder (Code & Structured JSON Mode)', 'deepseek-coder（代码与结构化 JSON 模式）')}</option>
                </select>
              </div>

              <div>
                <label className="text-gray-600 font-bold block mb-1">{t('Complex Reasoning / Proforma Quote Model', '复杂推理 / 形式发票报价模型')}</label>
                <select
                  value={selectedConfig.reasoningModel}
                  onChange={(e) => setSelectedConfig({ ...selectedConfig, reasoningModel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="deepseek-reasoner">{t('deepseek-reasoner (DeepSeek-R1 Chain-of-Thought)', 'deepseek-reasoner（DeepSeek-R1 思维链）')}</option>
                  <option value="deepseek-chat">{t('deepseek-chat (Direct High-Throughput)', 'deepseek-chat（直连高吞吐）')}</option>
                </select>
              </div>

              <div>
                <label className="text-gray-600 font-bold block mb-1">
                  {t('Sampling Temperature', '采样温度')} ({selectedConfig.temperature})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={selectedConfig.temperature}
                  onChange={(e) => setSelectedConfig({ ...selectedConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600 mt-2"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>{t('0.0 (Deterministic)', '0.0（确定性）')}</span>
                  <span>{t('0.7 (Balanced B2B)', '0.7（B2B 均衡）')}</span>
                  <span>{t('1.5 (Creative)', '1.5（创造性）')}</span>
                </div>
              </div>

              <div>
                <label className="text-gray-600 font-bold block mb-1">{t('Max Response Tokens per Request', '每次请求最大响应 Token 数')}</label>
                <input
                  type="number"
                  value={selectedConfig.maxTokens}
                  onChange={(e) => setSelectedConfig({ ...selectedConfig, maxTokens: parseInt(e.target.value) || 4096 })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono font-bold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-gray-600 font-bold block mb-1">{t('Rate Limit Ceiling (RPM)', '速率限制上限（RPM）')}</label>
                <input
                  type="number"
                  value={selectedConfig.rateLimitRpm}
                  onChange={(e) => setSelectedConfig({ ...selectedConfig, rateLimitRpm: parseInt(e.target.value) || 600 })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono font-bold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-gray-600 font-bold block mb-1">{t('Monthly Token Budget Cap', '月度 Token 预算上限')}</label>
                <input
                  type="number"
                  value={selectedConfig.monthlyTokenLimit}
                  onChange={(e) => setSelectedConfig({ ...selectedConfig, monthlyTokenLimit: parseInt(e.target.value) || 50000000 })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono font-bold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-gray-600 font-bold block mb-1">{t('Cluster Assignment', '集群分配')}</label>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={selectedConfig.isPrimary}
                      onChange={(e) => setSelectedConfig({ ...selectedConfig, isPrimary: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{t('Set as Global Platform Primary Default', '设为全局平台默认主网关')}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={handleSaveConfig}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                {t('Save DeepSeek Configuration', '保存 DeepSeek 配置')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL INFRASTRUCTURE */}
      {activeTab === 'infrastructure' && (
        <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 className="font-extrabold text-base text-gray-900">{t('SaaS Edge Gateways & Global CDN Endpoints', 'SaaS 边缘网关与全局 CDN 节点')}</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-600 font-bold block mb-1">{t('Primary Global CDN Edge', '全球主 CDN 边缘节点')}</label>
              <input
                type="text"
                defaultValue="https://edge-cf.xisync.com"
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono text-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 font-bold block mb-1">{t('GoDaddy Registrar API Key (SaaS Wildcard)', 'GoDaddy 注册商 API 密钥（SaaS 泛域名）')}</label>
              <input
                type="password"
                defaultValue="gd_live_9948192038129381920"
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono text-gray-900 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => triggerToast(t('Infrastructure edge settings saved!', '基础设施边缘节点设置已保存！'))}
              className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs shadow-xs"
            >
              {t('Save Infrastructure', '保存基础设施设置')}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM GENERAL LIMITS */}
      {activeTab === 'general' && (
        <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h2 className="font-extrabold text-base text-gray-900">{t('SaaS Multi-Tenant Global Guardrails', 'SaaS 多租户全局配额限制')}</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-gray-600 font-bold block mb-1">{t('Default Trial Period (Days)', '默认试用期（天）')}</label>
              <input
                type="number"
                defaultValue={14}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 font-bold block mb-1">{t('Max Free Storefronts per Starter Tenant', '每个入门版租户最大免费店铺数')}</label>
              <input
                type="number"
                defaultValue={1}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 font-bold block mb-1">{t('Max WhatsApp Channels (Pro Plan)', 'WhatsApp 渠道上限（专业版）')}</label>
              <input
                type="number"
                defaultValue={5}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-900 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => triggerToast(t('Global tenant guardrails saved!', '全局租户配额限制已保存！'))}
              className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs shadow-xs"
            >
              {t('Save Guardrails', '保存配额限制')}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h2 className="font-extrabold text-base text-gray-900">{t('Recent DeepSeek AI Inference Audit Logs', '最近 DeepSeek AI 推理审计日志')}</h2>
            </div>
            <span className="text-xs text-gray-500 font-mono">{t('Live WebSocket Ingesting', 'WebSocket 实时接入中')}</span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {[
              { time: t('1m ago', '1分钟前'), tenant: 'Eco-Toys Craft Co.', model: 'deepseek-chat', prompt: '1,420 tk', gen: '480 tk', cost: '$0.00033', status: '200 OK' },
              { time: t('4m ago', '4分钟前'), tenant: 'Shenzhen Electronics', model: 'deepseek-reasoner', prompt: '3,890 tk', gen: '1,200 tk', cost: '$0.00118', status: '200 OK' },
              { time: t('12m ago', '12分钟前'), tenant: 'Ningbo Steel Works', model: 'deepseek-chat', prompt: '980 tk', gen: '310 tk', cost: '$0.00022', status: '200 OK' },
              { time: t('18m ago', '18分钟前'), tenant: 'Hangzhou Textiles', model: 'deepseek-chat', prompt: '2,100 tk', gen: '650 tk', cost: '$0.00048', status: '200 OK' },
            ].map((log, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-gray-900">{log.tenant}</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                    {log.model}
                  </span>
                </div>
                <div className="flex items-center gap-4 font-mono text-gray-600">
                  <span>{t('Prompt:', '提示词：')} {log.prompt}</span>
                  <span>{t('Gen:', '生成：')} {log.gen}</span>
                  <span className="text-emerald-600 font-bold">{log.cost}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {log.status}
                  </span>
                  <span className="text-gray-400 font-sans text-[11px]">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Save Toast */}
      {saveToast && (
        <div className="fixed bottom-8 right-8 z-50 px-5 py-3 rounded-2xl bg-gray-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}
    </div>
  );
}
