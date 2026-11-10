import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileCheck2,
  FileText,
  History,
  Info,
  PackageSearch,
  Quote,
  ShieldAlert,
  Sparkles,
  Wand2,
  XCircle,
} from 'lucide-react';
import { useI18n } from '../../../lib/i18n';
import { getTradeCopy } from '../../../lib/i18n/tradeCopy';
import { useTradeWorkspace } from '../../../hooks/useTradeWorkspace';
import {
  BUYERS,
  DEFAULT_DOCUMENTS,
  DOCUMENT_KEYS,
  LANES,
  ORDERS,
  PRODUCTS,
  findBuyer,
  findLane,
  findProduct,
} from '../../../lib/services/tradeIntelligence/dataset';
import { buildTradeAlerts, detectOrderAnomalies } from '../../../lib/services/tradeIntelligence/alerts';
import { tradeProvider } from '../../../lib/services/tradeIntelligence/provider';
import type {
  DocumentCheckInput,
  DocumentCheckResult,
  DocumentStatus,
  MarketCode,
  QuoteDraft,
  QuoteInput,
} from '../../../types/tradeIntelligence';
import {
  Field,
  GlassCard,
  Meter,
  Pill,
  PrimaryButton,
  ScoreRing,
  SectionHeading,
  Select,
  StatePanel,
  TextInput,
  TradeShell,
  cx,
} from '../../../components/trade/TradeUI';
import { formatDate, formatDateTime, formatNumber, formatUsd } from '../../../components/trade/format';

type ToolkitTab = 'documents' | 'quote' | 'alerts' | 'anomalies';

const TABS: { key: ToolkitTab; icon: typeof FileCheck2 }[] = [
  { key: 'documents', icon: FileCheck2 },
  { key: 'quote', icon: Quote },
  { key: 'alerts', icon: ShieldAlert },
  { key: 'anomalies', icon: Activity },
];

const STATUS_OPTIONS: DocumentStatus[] = ['complete', 'expiring', 'missing', 'not_applicable'];

export function AiToolkitPage() {
  const { language } = useI18n();
  const copy = getTradeCopy(language);
  const navigate = useNavigate();
  const workspace = useTradeWorkspace();
  const [tab, setTab] = useState<ToolkitTab>('documents');

  const base = window.location.pathname.startsWith('/dashboard/ultra')
    ? '/dashboard/ultra/trade-intelligence'
    : '/dashboard/trade-intelligence';

  // Document checker state
  const [docProductId, setDocProductId] = useState(PRODUCTS[0].id);
  const [docMarket, setDocMarket] = useState<MarketCode>('eu');
  const [docInvoiceValue, setDocInvoiceValue] = useState(25000);
  const [documents, setDocuments] = useState<Record<string, DocumentStatus>>({ ...DEFAULT_DOCUMENTS });
  const [docResult, setDocResult] = useState<DocumentCheckResult | null>(null);
  const [docStatus, setDocStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [docSaved, setDocSaved] = useState(false);

  // Quote state
  const [quoteBuyerId, setQuoteBuyerId] = useState(BUYERS[1].id);
  const [quoteProductId, setQuoteProductId] = useState(PRODUCTS[0].id);
  const [quoteQty, setQuoteQty] = useState(1200);
  const [quotePrice, setQuotePrice] = useState(PRODUCTS[0].targetPriceUsd);
  const [quoteIncoterm, setQuoteIncoterm] = useState<QuoteInput['incoterm']>('CIF');
  const [quoteLead, setQuoteLead] = useState(30);
  const [quotePayment, setQuotePayment] = useState('30% advance / 70% against documents');
  const [quoteValidity, setQuoteValidity] = useState(14);
  const [quoteResult, setQuoteResult] = useState<QuoteDraft | null>(null);
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [quoteSaved, setQuoteSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Alerts
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const docProduct = findProduct(docProductId) ?? PRODUCTS[0];
  const quoteProduct = findProduct(quoteProductId) ?? PRODUCTS[0];
  const quoteBuyer = findBuyer(quoteBuyerId) ?? BUYERS[1];

  const alerts = useMemo(() => buildTradeAlerts(), []);
  const anomalies = useMemo(() => detectOrderAnomalies(), []);
  const filteredAlerts = useMemo(
    () => (alertFilter === 'all' ? alerts : alerts.filter((alert) => alert.severity === alertFilter)),
    [alerts, alertFilter],
  );

  const runDocumentCheck = async () => {
    setDocStatus('loading');
    setDocSaved(false);
    try {
      const input: DocumentCheckInput = {
        productName: docProduct.name.en,
        hsCode: docProduct.hsCode,
        market: docMarket,
        invoiceValueUsd: docInvoiceValue,
        documents,
      };
      const result = await tradeProvider.checkDocuments(input);
      setDocResult(result);
      setDocStatus('idle');
    } catch {
      setDocStatus('error');
    }
  };

  const saveDocumentCheck = () => {
    if (!docResult) return;
    workspace.recordDocumentCheck(docResult, docProduct.name[language], docMarket);
    setDocSaved(true);
  };

  const runQuote = async () => {
    setQuoteStatus('loading');
    setQuoteSaved(false);
    try {
      const input: QuoteInput = {
        buyerName: quoteBuyer.name[language],
        productName: quoteProduct.name[language],
        quantity: quoteQty,
        unitPriceUsd: quotePrice,
        incoterm: quoteIncoterm,
        leadTimeDays: quoteLead,
        paymentTerms: quotePayment,
        validityDays: quoteValidity,
      };
      const result = await tradeProvider.draftQuote(input);
      setQuoteResult(result);
      setQuoteStatus('idle');
    } catch {
      setQuoteStatus('error');
    }
  };

  const saveQuote = () => {
    if (!quoteResult) return;
    workspace.recordQuote(quoteResult, {
      buyerName: quoteBuyer.name[language],
      productName: quoteProduct.name[language],
      quantity: quoteQty,
      unitPriceUsd: quotePrice,
      incoterm: quoteIncoterm,
      leadTimeDays: quoteLead,
      paymentTerms: quotePayment,
      validityDays: quoteValidity,
    });
    setQuoteSaved(true);
  };

  const copySummary = async () => {
    if (!quoteResult) return;
    try {
      await navigator.clipboard.writeText(quoteResult.summary[language]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const quoteLabels: Record<string, string> = {
    quantity: copy.toolkit.qty,
    unitPrice: copy.toolkit.unitPrice,
    incoterm: copy.toolkit.incoterm,
    leadTime: copy.toolkit.leadTime,
    paymentTerms: copy.toolkit.paymentTerms,
    validity: copy.toolkit.validity,
  };

  const anomaliesValue = anomalies.reduce((sum, anomaly) => {
    const order = ORDERS.find((item) => item.id === anomaly.orderId);
    return sum + (order?.valueUsd ?? 0);
  }, 0);

  const severityTone = { critical: 'rose' as const, warning: 'amber' as const, info: 'cyan' as const };
  const alertCategoryHref: Record<string, string> = {
    tariff: `${base}/toolkit`,
    risk: `${base}/credit`,
    credit: `${base}/credit`,
    logistics: `${base}/shipping`,
  };

  return (
    <TradeShell
      active="toolkit"
      eyebrow={copy.toolkit.eyebrow}
      title={copy.toolkit.title}
      subtitle={copy.toolkit.subtitle}
    >
      <GlassCard className="p-2">
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            const count =
              item.key === 'alerts'
                ? alerts.filter((alert) => alert.severity === 'critical').length
                : item.key === 'anomalies'
                  ? anomalies.length
                  : 0;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cx(
                  'relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-[11px] font-bold transition',
                  active
                    ? 'bg-gradient-to-r from-xisync-blue-900 via-xisync-blue-800 to-xisync-cyan-700 text-white shadow-[0_12px_24px_-16px_rgba(30,58,138,0.9)]'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {copy.toolkit[item.key]}
                {count > 0 && (
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {tab === 'documents' && (
        <div className="grid gap-4 xl:grid-cols-12">
          <GlassCard className="p-5 xl:col-span-5">
            <SectionHeading title={copy.toolkit.documentsHeading} hint={copy.toolkit.documentsHint} icon={ClipboardCheck} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label={copy.toolkit.productName} className="col-span-2">
                <Select
                  value={docProductId}
                  onChange={(event) => {
                    const product = findProduct(event.target.value);
                    setDocProductId(event.target.value);
                    setDocResult(null);
                    setDocSaved(false);
                    if (product) setDocInvoiceValue(Math.round(product.targetPriceUsd * 1000));
                  }}
                >
                  {PRODUCTS.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name[language]} · HS {product.hsCode}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={copy.toolkit.hsCode}>
                <TextInput value={docProduct.hsCode} readOnly />
              </Field>
              <Field label={copy.toolkit.market}>
                <Select
                  value={docMarket}
                  onChange={(event) => {
                    setDocMarket(event.target.value as MarketCode);
                    setDocResult(null);
                    setDocSaved(false);
                  }}
                >
                  {(['eu', 'us', 'asean', 'mena'] as const).map((market) => (
                    <option key={market} value={market}>
                      {copy.toolkit.marketNames[market]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={copy.toolkit.invoiceValue} className="col-span-2">
                <TextInput
                  type="number"
                  min={0}
                  value={docInvoiceValue}
                  onChange={(event) => setDocInvoiceValue(Number(event.target.value))}
                />
              </Field>
            </div>

            <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {copy.toolkit.docsStatus}
            </p>
            <div className="mt-2 space-y-1.5">
              {DOCUMENT_KEYS.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200/70 bg-white/60 px-2.5 py-1.5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                    {copy.toolkit.documentNames[key]}
                  </span>
                  <select
                    value={documents[key] ?? 'missing'}
                    onChange={(event) => {
                      setDocuments((previous) => ({ ...previous, [key]: event.target.value as DocumentStatus }));
                      setDocResult(null);
                      setDocSaved(false);
                    }}
                    className={cx(
                      'rounded-md border px-1.5 py-0.5 text-[9px] font-bold outline-none',
                      documents[key] === 'complete'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : documents[key] === 'expiring'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                          : documents[key] === 'missing'
                            ? 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                            : 'border-slate-300/60 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400',
                    )}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {copy.toolkit.docStatus[status]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <PrimaryButton onClick={runDocumentCheck} loading={docStatus === 'loading'} className="mt-4 w-full">
              <FileCheck2 className="h-3.5 w-3.5" />
              {docStatus === 'loading' ? copy.common.analyzing : copy.toolkit.check}
            </PrimaryButton>
          </GlassCard>

          <div className="space-y-4 xl:col-span-7">
            <GlassCard className="p-5">
              <SectionHeading title={copy.toolkit.readiness} hint={copy.toolkit.summary} icon={PackageSearch} />
              {docStatus === 'error' ? (
                <StatePanel kind="error" title={copy.common.errorTitle} onRetry={runDocumentCheck} retryLabel={copy.common.retry} />
              ) : docStatus === 'loading' ? (
                <StatePanel kind="loading" title={copy.common.analyzing} />
              ) : !docResult ? (
                <StatePanel kind="empty" icon={ClipboardCheck} title={copy.toolkit.documentsHint} />
              ) : (
                <div className="mt-3">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <ScoreRing
                      score={docResult.readinessPct}
                      size={132}
                      verdict={
                        docResult.verdict === 'ready' ? 'good' : docResult.verdict === 'conditional' ? 'watch' : 'risk'
                      }
                      caption={copy.toolkit.readiness}
                    />
                    <div className="min-w-0 flex-1">
                      <Pill
                        tone={
                          docResult.verdict === 'ready' ? 'emerald' : docResult.verdict === 'conditional' ? 'amber' : 'rose'
                        }
                      >
                        {docResult.verdict === 'ready' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {copy.toolkit.docVerdict[docResult.verdict]}
                      </Pill>
                      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        {docResult.summary[language]}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Pill tone="slate">{copy.toolkit.marketNames[docMarket]}</Pill>
                        <Pill tone="slate">HS {docProduct.hsCode}</Pill>
                        <Pill tone="slate">{formatUsd(docInvoiceValue, language, true)}</Pill>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {copy.toolkit.issues}
                  </p>
                  {docResult.issues.length === 0 ? (
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {copy.toolkit.noIssues}
                    </div>
                  ) : (
                    <ul className="mt-2 space-y-1.5">
                      {docResult.issues.map((issue) => (
                        <li
                          key={`${issue.key}-${issue.severity}`}
                          className="flex items-center justify-between gap-2 rounded-lg border border-slate-200/70 bg-white/60 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                            {issue.severity === 'critical' ? (
                              <XCircle className="h-3 w-3 text-rose-500" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                            )}
                            {copy.toolkit.documentNames[issue.key as keyof typeof copy.toolkit.documentNames] ?? issue.key}
                          </span>
                          <Pill tone={issue.severity === 'critical' ? 'rose' : 'amber'}>
                            {copy.toolkit.severity[issue.severity]}
                          </Pill>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200/70 pt-3 dark:border-white/5">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                      {formatDateTime(docResult.generatedAt, language)}
                    </span>
                    <PrimaryButton onClick={saveDocumentCheck} disabled={docSaved}>
                      <Sparkles className="h-3.5 w-3.5" />
                      {docSaved ? copy.toolkit.savedCheck : copy.toolkit.saveCheck}
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </GlassCard>

            <GlassCard className="p-5">
              <SectionHeading title={copy.toolkit.history} hint={copy.toolkit.historyEmpty} icon={History} />
              {workspace.state && workspace.state.documentChecks.length > 0 ? (
                <ul className="mt-2 divide-y divide-slate-200/70 dark:divide-white/5">
                  {workspace.state.documentChecks.slice(0, 5).map((check) => (
                    <li key={check.id} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold text-slate-900 dark:text-white">{check.productName}</p>
                        <p className="text-[9px] text-slate-400">
                          {copy.toolkit.marketNames[check.market]} · {formatDate(check.createdAt, language)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{check.readinessPct}%</span>
                        <Pill tone={check.verdict === 'ready' ? 'emerald' : check.verdict === 'conditional' ? 'amber' : 'rose'}>
                          {copy.toolkit.docVerdict[check.verdict]}
                        </Pill>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <StatePanel kind="empty" icon={History} title={copy.toolkit.historyEmpty} />
              )}
            </GlassCard>
          </div>
        </div>
      )}

      {tab === 'quote' && (
        <div className="grid gap-4 xl:grid-cols-12">
          <GlassCard className="p-5 xl:col-span-5">
            <SectionHeading title={copy.toolkit.quoteHeading} hint={copy.toolkit.quoteHint} icon={Wand2} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label={copy.toolkit.buyerName} className="col-span-2">
                <Select value={quoteBuyerId} onChange={(event) => setQuoteBuyerId(event.target.value)}>
                  {BUYERS.map((buyer) => (
                    <option key={buyer.id} value={buyer.id}>
                      {buyer.name[language]} · {buyer.country[language]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={copy.toolkit.productName} className="col-span-2">
                <Select
                  value={quoteProductId}
                  onChange={(event) => {
                    const product = findProduct(event.target.value);
                    setQuoteProductId(event.target.value);
                    if (product) setQuotePrice(product.targetPriceUsd);
                    setQuoteResult(null);
                    setQuoteSaved(false);
                  }}
                >
                  {PRODUCTS.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name[language]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={copy.toolkit.qty}>
                <TextInput type="number" min={1} value={quoteQty} onChange={(event) => setQuoteQty(Number(event.target.value))} />
              </Field>
              <Field label={copy.toolkit.unitPrice}>
                <TextInput
                  type="number"
                  min={0}
                  step={0.01}
                  value={quotePrice}
                  onChange={(event) => setQuotePrice(Number(event.target.value))}
                />
              </Field>
              <Field label={copy.toolkit.incoterm}>
                <Select
                  value={quoteIncoterm}
                  onChange={(event) => setQuoteIncoterm(event.target.value as QuoteInput['incoterm'])}
                >
                  {(['EXW', 'FOB', 'CFR', 'CIF', 'DDP'] as const).map((incoterm) => (
                    <option key={incoterm} value={incoterm}>
                      {incoterm}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={copy.toolkit.leadTime}>
                <TextInput type="number" min={1} value={quoteLead} onChange={(event) => setQuoteLead(Number(event.target.value))} />
              </Field>
              <Field label={copy.toolkit.paymentTerms} className="col-span-2">
                <TextInput value={quotePayment} onChange={(event) => setQuotePayment(event.target.value)} />
              </Field>
              <Field label={copy.toolkit.validity}>
                <TextInput
                  type="number"
                  min={1}
                  value={quoteValidity}
                  onChange={(event) => setQuoteValidity(Number(event.target.value))}
                />
              </Field>
              <div className="flex items-end">
                <PrimaryButton onClick={runQuote} loading={quoteStatus === 'loading'} className="w-full">
                  <FileText className="h-3.5 w-3.5" />
                  {copy.toolkit.draft}
                </PrimaryButton>
              </div>
            </div>
          </GlassCard>

          <div className="space-y-4 xl:col-span-7">
            <GlassCard className="p-5">
              <SectionHeading
                title={copy.toolkit.reference}
                hint={quoteResult?.reference ?? copy.toolkit.quoteHint}
                icon={FileText}
                action={
                  quoteResult && (
                    <Pill tone={quoteSaved ? 'emerald' : 'slate'}>
                      {quoteSaved ? copy.toolkit.savedQuote : copy.common.persisted}
                    </Pill>
                  )
                }
              />
              {quoteStatus === 'error' ? (
                <StatePanel kind="error" title={copy.common.errorTitle} onRetry={runQuote} retryLabel={copy.common.retry} />
              ) : quoteStatus === 'loading' ? (
                <StatePanel kind="loading" title={copy.common.analyzing} />
              ) : !quoteResult ? (
                <StatePanel kind="empty" icon={Quote} title={copy.toolkit.quoteHint} />
              ) : (
                <div className="mt-3">
                  <div className="rounded-xl border border-slate-200/70 bg-gradient-to-br from-white/80 to-xisync-cyan-50/40 p-4 dark:border-white/10 dark:from-white/[0.03] dark:to-cyan-400/[0.04]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          {copy.toolkit.buyerName}
                        </p>
                        <p className="mt-0.5 text-sm font-extrabold text-slate-900 dark:text-white">
                          {quoteBuyer.name[language]}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{quoteProduct.name[language]}</p>
                      </div>
                      <span className="rounded-lg bg-white/70 px-2 py-1 font-mono text-[10px] font-bold text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">
                        {quoteResult.reference}
                      </span>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                      {quoteResult.lines.map((line) => (
                        <div key={line.key}>
                          <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                            {quoteLabels[line.key] ?? line.key}
                          </dt>
                          <dd className="mt-0.5 text-[10px] font-semibold text-slate-800 dark:text-slate-200">{line.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-4 space-y-1.5 border-t border-slate-200/70 pt-3 dark:border-white/5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 dark:text-slate-400">{copy.toolkit.subtotal}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{formatUsd(quoteResult.subtotalUsd, language)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 dark:text-slate-400">{copy.toolkit.freight}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{formatUsd(quoteResult.freightUsd, language)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 dark:text-slate-400">{copy.toolkit.insurance}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{formatUsd(quoteResult.insuranceUsd, language)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200/70 pt-2 dark:border-white/5">
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                          {copy.toolkit.total}
                        </span>
                        <span className="text-base font-extrabold text-slate-950 dark:text-white">
                          {formatUsd(quoteResult.totalUsd, language)}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 rounded-lg bg-slate-50/80 px-3 py-2 text-[10px] leading-relaxed text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
                      {quoteResult.summary[language]}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={copySummary}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/70 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                    >
                      {copied ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      {copied ? copy.common.copied : copy.common.copy}
                    </button>
                    <PrimaryButton onClick={saveQuote} disabled={quoteSaved}>
                      <Sparkles className="h-3.5 w-3.5" />
                      {quoteSaved ? copy.toolkit.savedQuote : copy.toolkit.saveQuote}
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </GlassCard>

            <GlassCard className="p-5">
              <SectionHeading title={copy.toolkit.quoteHistory} hint={copy.toolkit.quoteHistoryEmpty} icon={History} />
              {workspace.state && workspace.state.quotes.length > 0 ? (
                <ul className="mt-2 divide-y divide-slate-200/70 dark:divide-white/5">
                  {workspace.state.quotes.slice(0, 5).map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold text-slate-900 dark:text-white">
                          {item.reference} · {item.buyerName}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          {item.productName} · {formatDate(item.createdAt, language)}
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">
                        {formatUsd(item.totalUsd, language)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <StatePanel kind="empty" icon={History} title={copy.toolkit.quoteHistoryEmpty} />
              )}
            </GlassCard>
          </div>
        </div>
      )}

      {tab === 'alerts' && (
        <div className="space-y-4">
          <GlassCard className="p-5">
            <SectionHeading
              title={copy.toolkit.alertsHeading}
              hint={copy.toolkit.alertsHint}
              icon={ShieldAlert}
              action={
                <div className="flex flex-wrap gap-1">
                  {(['all', 'critical', 'warning', 'info'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setAlertFilter(filter)}
                      className={cx(
                        'rounded-lg px-2 py-1 text-[9px] font-bold transition',
                        alertFilter === filter
                          ? 'bg-gradient-to-r from-xisync-blue-900 to-xisync-cyan-600 text-white'
                          : 'bg-slate-100 text-slate-500 hover:text-slate-800 dark:bg-white/5 dark:text-slate-400',
                      )}
                    >
                      {filter === 'all' ? copy.matching.allStages : copy.toolkit.severity[filter]}
                    </button>
                  ))}
                </div>
              }
            />
            {filteredAlerts.length === 0 ? (
              <StatePanel kind="empty" icon={ShieldAlert} title={copy.toolkit.alertsEmpty} />
            ) : (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-xl border border-slate-200/70 bg-white/60 p-3.5 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-1.5">
                      <Pill tone={severityTone[alert.severity]}>
                        {alert.severity === 'critical' ? (
                          <XCircle className="h-2.5 w-2.5" />
                        ) : alert.severity === 'warning' ? (
                          <AlertTriangle className="h-2.5 w-2.5" />
                        ) : (
                          <Info className="h-2.5 w-2.5" />
                        )}
                        {copy.toolkit.severity[alert.severity]}
                      </Pill>
                      <Pill tone="slate">{copy.toolkit.category[alert.category]}</Pill>
                    </div>
                    <p className="mt-2 text-[11px] font-extrabold text-slate-900 dark:text-white">
                      {alert.title[language]}
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {alert.detail[language]}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(alertCategoryHref[alert.category] ?? `${base}/toolkit`)}
                      className="mt-2.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.1em] text-xisync-blue-800 dark:text-cyan-300"
                    >
                      {alert.action[language]}
                      <ArrowRight className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {tab === 'anomalies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <GlassCard className="p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.toolkit.anomalies}</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">{formatNumber(anomalies.length, language)}</p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.toolkit.reason}</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">
                {anomalies[0] ? Math.round(anomalies[0].score) : 0}
              </p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.shipping.cargoValue}</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">
                {formatUsd(anomaliesValue, language, true)}
              </p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.analytics.orders}</p>
              <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">{formatNumber(ORDERS.length, language)}</p>
            </GlassCard>
          </div>

          <GlassCard className="p-5">
            <SectionHeading title={copy.toolkit.anomaliesHeading} hint={copy.toolkit.anomaliesHint} icon={Activity} />
            {anomalies.length === 0 ? (
              <StatePanel kind="empty" icon={CheckCircle2} title={copy.toolkit.anomaliesEmpty} />
            ) : (
              <div className="mt-4 space-y-2.5">
                {anomalies.map((anomaly) => {
                  const order = ORDERS.find((item) => item.id === anomaly.orderId);
                  const buyer = order ? findBuyer(order.buyerId) : undefined;
                  const lane = order ? findLane(order.laneId) : undefined;
                  return (
                    <div
                      key={anomaly.orderId}
                      className="rounded-xl border border-slate-200/70 bg-white/60 p-3.5 dark:border-white/10 dark:bg-white/[0.03]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="flex items-center gap-3">
                          <div
                            className={cx(
                              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[11px] font-extrabold',
                              anomaly.score >= 75
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
                            )}
                          >
                            {Math.round(anomaly.score)}
                          </div>
                          <div>
                            <p className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {anomaly.orderId}
                            </p>
                            <p className="text-[10px] font-extrabold text-slate-900 dark:text-white">
                              {buyer?.name[language]}
                            </p>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Pill tone={anomaly.score >= 75 ? 'rose' : 'amber'}>
                              {copy.toolkit.reasonKeys[anomaly.reasonKey as keyof typeof copy.toolkit.reasonKeys] ??
                                anomaly.reasonKey}
                            </Pill>
                            {order && (
                              <>
                                <Pill tone="slate">{formatUsd(order.valueUsd, language, true)}</Pill>
                                <Pill tone="slate">{order.mode.toUpperCase()}</Pill>
                                {lane && <Pill tone="slate">{lane.destination[language]}</Pill>}
                              </>
                            )}
                          </div>
                          <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                            {anomaly.detail[language]}
                          </p>
                          <div className="mt-2 max-w-xs">
                            <Meter value={anomaly.score} tone={anomaly.score >= 75 ? 'rose' : 'amber'} height="h-1" />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`${base}/analytics`)}
                          className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg border border-slate-200 px-2 py-1 text-[9px] font-bold text-slate-600 transition hover:border-slate-300 dark:border-white/10 dark:text-slate-300"
                        >
                          {copy.common.viewAll}
                          <ArrowRight className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      <p className="px-1 text-center text-[10px] text-slate-500 dark:text-slate-400">
        {LANES.length} lanes · {ORDERS.length} orders · {copy.common.persisted}
      </p>
    </TradeShell>
  );
}
