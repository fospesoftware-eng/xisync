import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Fingerprint,
  Gauge,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useI18n } from '../../../lib/i18n';
import { getTradeCopy } from '../../../lib/i18n/tradeCopy';
import { useTradeWorkspace } from '../../../hooks/useTradeWorkspace';
import { BUYERS, defaultCreditInput } from '../../../lib/services/tradeIntelligence/dataset';
import { COUNTRY_RISK } from '../../../lib/services/tradeIntelligence/credit';
import { tradeProvider } from '../../../lib/services/tradeIntelligence/provider';
import type { CreditAssessment, CreditInput } from '../../../types/tradeIntelligence';
import {
  Field,
  GhostButton,
  GlassCard,
  Meter,
  Pill,
  PrimaryButton,
  ScoreRing,
  SectionHeading,
  Select,
  StatePanel,
  TextInput,
  Toggle,
  TradeShell,
} from '../../../components/trade/TradeUI';
import { CreditRadar } from '../../../components/trade/TradeCharts';
import { formatDate, formatNumber, formatPercent, formatUsd } from '../../../components/trade/format';

const DEFAULT_BUYER = BUYERS[0];

function initialInput(): CreditInput {
  return defaultCreditInput(DEFAULT_BUYER);
}

export function CreditAssessmentPage() {
  const { language } = useI18n();
  const copy = getTradeCopy(language);
  const workspace = useTradeWorkspace();
  const [input, setInput] = useState<CreditInput>(initialInput);
  const [assessment, setAssessment] = useState<CreditAssessment | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const selectedBuyerId = BUYERS.find((buyer) => buyer.id === input.buyerId)?.id ?? '';

  const update = <K extends keyof CreditInput>(key: K, value: CreditInput[K]) => {
    setInput((previous) => ({ ...previous, [key]: value }));
    setAssessment(null);
    setSavedAt(null);
    setStatus('idle');
  };

  const chooseBuyer = (buyerId: string) => {
    const buyer = BUYERS.find((item) => item.id === buyerId);
    if (!buyer) return;
    setInput(defaultCreditInput(buyer));
    setAssessment(null);
    setSavedAt(null);
    setStatus('idle');
  };

  const runAssessment = async () => {
    setStatus('loading');
    setErrorMessage('');
    setSavedAt(null);
    try {
      const result = await tradeProvider.assessCredit(input);
      setAssessment(result);
      setStatus('idle');
    } catch {
      setStatus('error');
      setErrorMessage(copy.common.errorTitle);
    }
  };

  const save = () => {
    if (!assessment) return;
    workspace.recordAssessment(assessment, input);
    setSavedAt(assessment.generatedAt);
  };

  const radarData = useMemo(
    () =>
      assessment?.factors.map((factor) => ({
        label: copy.credit.factor[factor.key as keyof typeof copy.credit.factor]?.label ?? factor.key,
        score: factor.score,
      })) ?? [],
    [assessment, copy],
  );

  const verdictTone =
    assessment?.verdict === 'eligible'
      ? 'emerald'
      : assessment?.verdict === 'conditional'
        ? 'cyan'
        : assessment?.verdict === 'referred'
          ? 'amber'
          : 'rose';

  const scoreTone = assessment
    ? assessment.score >= 75
      ? 'good'
      : assessment.score >= 55
        ? 'watch'
        : 'risk'
    : 'good';

  return (
    <TradeShell
      active="credit"
      eyebrow={copy.credit.eyebrow}
      title={copy.credit.title}
      subtitle={copy.credit.subtitle}
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <GlassCard className="p-5">
            <SectionHeading title={copy.credit.formHeading} hint={copy.credit.formSubheading} icon={Fingerprint} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label={copy.credit.buyerPreset} className="col-span-2">
                <Select value={selectedBuyerId} onChange={(event) => chooseBuyer(event.target.value)}>
                  {BUYERS.map((buyer) => (
                    <option key={buyer.id} value={buyer.id}>
                      {buyer.name[language]} · {buyer.country[language]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={copy.credit.buyerName} className="col-span-2">
                <TextInput
                  value={input.buyerName}
                  onChange={(event) => update('buyerName', event.target.value)}
                  placeholder="Acme Trading"
                />
              </Field>

              <Field label={copy.credit.country}>
                <Select value={input.countryCode} onChange={(event) => update('countryCode', event.target.value)}>
                  {Object.keys(COUNTRY_RISK).map((code) => (
                    <option key={code} value={code}>
                      {code} · {COUNTRY_RISK[code]}/100
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={copy.credit.yearsTrading}>
                <TextInput
                  type="number"
                  min={0}
                  max={50}
                  value={input.yearsTrading}
                  onChange={(event) => update('yearsTrading', Number(event.target.value))}
                />
              </Field>

              <Field label={copy.credit.onTimeRate} hint={`${Math.round(input.onTimePaymentRate * 100)}%`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(input.onTimePaymentRate * 100)}
                  onChange={(event) => update('onTimePaymentRate', Number(event.target.value) / 100)}
                  className="mt-2 w-full accent-xisync-cyan-600"
                />
                <TextInput
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(input.onTimePaymentRate * 100)}
                  onChange={(event) => update('onTimePaymentRate', Number(event.target.value) / 100)}
                  className="mt-2"
                />
              </Field>

              <Field label={copy.credit.tenor}>
                <TextInput
                  type="number"
                  min={0}
                  max={365}
                  value={input.tenorDays}
                  onChange={(event) => update('tenorDays', Number(event.target.value))}
                />
              </Field>

              <Field label={copy.credit.orderValue} hint={formatUsd(input.orderValueUsd, language)}>
                <TextInput
                  type="number"
                  min={0}
                  step={1000}
                  value={input.orderValueUsd}
                  onChange={(event) => update('orderValueUsd', Number(event.target.value))}
                />
              </Field>

              <Field label={copy.credit.insuredLimit} hint={formatUsd(input.insuredLimitUsd, language)}>
                <TextInput
                  type="number"
                  min={0}
                  step={1000}
                  value={input.insuredLimitUsd}
                  onChange={(event) => update('insuredLimitUsd', Number(event.target.value))}
                />
              </Field>

              <Field label={copy.credit.sectorVolatility} hint={formatPercent(input.sectorVolatility * 100)}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(input.sectorVolatility * 100)}
                  onChange={(event) => update('sectorVolatility', Number(event.target.value) / 100)}
                  className="mt-2 w-full accent-xisync-cyan-600"
                />
              </Field>

              <Field label={copy.credit.concentration} hint={formatPercent(input.concentrationPct)}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={input.concentrationPct}
                  onChange={(event) => update('concentrationPct', Number(event.target.value))}
                  className="mt-2 w-full accent-xisync-cyan-600"
                />
              </Field>

              <Field label={copy.credit.docsComplete} hint={formatPercent(input.documentsCompletePct)} className="col-span-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={input.documentsCompletePct}
                  onChange={(event) => update('documentsCompletePct', Number(event.target.value))}
                  className="mt-2 w-full accent-xisync-cyan-600"
                />
              </Field>

              <div className="col-span-2">
                <Toggle
                  checked={input.sanctionsFlag}
                  onChange={(value) => update('sanctionsFlag', value)}
                  label={copy.credit.sanctions}
                  hint={copy.credit.sanctionsHint}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <PrimaryButton onClick={runAssessment} loading={status === 'loading'} className="flex-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {status === 'loading' ? copy.common.analyzing : copy.credit.assess}
              </PrimaryButton>
              <GhostButton
                onClick={() => {
                  setInput(initialInput());
                  setAssessment(null);
                  setSavedAt(null);
                  setStatus('idle');
                }}
              >
                <RefreshCw className="h-3 w-3" />
                {copy.common.reset}
              </GhostButton>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">{copy.credit.disclaimer}</p>
          </GlassCard>
        </div>

        <div className="space-y-4 xl:col-span-7">
          <GlassCard className="overflow-hidden p-0">
            <div className="border-b border-slate-200/70 bg-gradient-to-r from-xisync-blue-900/[0.04] via-xisync-cyan-500/[0.04] to-transparent px-5 py-4 dark:border-white/5 dark:from-cyan-400/[0.06]">
              <SectionHeading
                title={copy.credit.resultHeading}
                icon={Gauge}
                action={
                  assessment && (
                    <div className="flex items-center gap-2">
                      <Pill tone={assessment.modelMode === 'remote' ? 'cyan' : 'slate'}>
                        {assessment.modelMode === 'remote' ? copy.common.modelRemote : copy.common.modelHeuristic}
                      </Pill>
                      <Pill tone={assessment.confidence === 'high' ? 'emerald' : assessment.confidence === 'medium' ? 'amber' : 'rose'}>
                        {copy.common.confidence}: {copy.common[assessment.confidence]}
                      </Pill>
                    </div>
                  )
                }
              />
            </div>

            {status === 'error' ? (
              <StatePanel
                kind="error"
                title={copy.common.errorTitle}
                message={errorMessage}
                onRetry={runAssessment}
                retryLabel={copy.common.retry}
              />
            ) : status === 'loading' ? (
              <StatePanel kind="loading" title={copy.common.analyzing} />
            ) : !assessment ? (
              <StatePanel
                kind="empty"
                icon={ShieldCheck}
                title={copy.credit.resultEmpty}
                message={copy.credit.factorHint}
              >
                <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-slate-300/80 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.03]">
                  <ShieldCheck className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                </div>
              </StatePanel>
            ) : (
              <div className="p-5">
                {assessment.notice && (
                  <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[10px] font-semibold text-amber-700 dark:text-amber-200">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {copy.common.degraded}
                  </div>
                )}

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <ScoreRing score={assessment.score} verdict={scoreTone} caption={copy.credit.scoreLabel} />
                    <div>
                      <Pill tone={verdictTone}>
                        {assessment.verdict === 'eligible' ? (
                          <BadgeCheck className="h-3 w-3" />
                        ) : (
                          <ShieldAlert className="h-3 w-3" />
                        )}
                        {copy.credit.verdict[assessment.verdict].label}
                      </Pill>
                      <p className="mt-2 max-w-[200px] text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        {copy.credit.verdict[assessment.verdict].hint}
                      </p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        {copy.credit.grade}: <span className="text-slate-900 dark:text-white">{assessment.grade}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid flex-1 grid-cols-2 gap-2">
                    <div className="rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.credit.coverage}</p>
                      <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">
                        {assessment.coverageRatio.toFixed(2)}x
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.credit.confidence}</p>
                      <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">
                        {copy.common[assessment.confidence]}
                      </p>
                    </div>
                  </div>
                </div>

                {assessment.verdict === 'declined' && input.sanctionsFlag && (
                  <div className="mt-4 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-rose-600 dark:text-rose-300">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {copy.credit.hardStop}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-rose-700/80 dark:text-rose-200/80">
                      {copy.credit.hardStopBody}
                    </p>
                  </div>
                )}

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {copy.credit.factors}
                    </p>
                    <div className="mt-3 space-y-3">
                      {assessment.factors.map((factor) => {
                        const meta = copy.credit.factor[factor.key as keyof typeof copy.credit.factor];
                        return (
                          <div key={factor.key}>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                {meta?.label ?? factor.key}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                {factor.score.toFixed(0)} / 100
                              </span>
                            </div>
                            <div className="mt-1">
                              <Meter
                                value={factor.score}
                                tone={factor.level === 'good' ? 'emerald' : factor.level === 'watch' ? 'amber' : 'rose'}
                                height="h-1"
                              />
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400">
                              <span>{meta?.detail}</span>
                              <span className="shrink-0 font-bold">w {factor.weight}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {copy.credit.improvements}
                    </p>
                    {assessment.improvements.length === 0 ? (
                      <p className="mt-2 text-[10px] text-slate-400">{copy.credit.improvementsEmpty}</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {assessment.improvements.map((item) => {
                          const meta = copy.credit.factor[item.key as keyof typeof copy.credit.factor];
                          return (
                            <li
                              key={item.key}
                              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]"
                            >
                              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                {meta?.label ?? item.key}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-300">
                                <TrendingUp className="h-3 w-3" />+{item.gain}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        {copy.credit.factors}
                      </p>
                      <CreditRadar data={radarData} />
                    </div>
                    <div className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        {copy.credit.terms}
                      </p>
                      <dl className="mt-2 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <dt className="text-[10px] text-slate-500 dark:text-slate-400">{copy.credit.payment}</dt>
                          <dd className="text-right text-[10px] font-bold text-slate-900 dark:text-white">
                            {copy.credit.paymentTerms[assessment.suggestedTerms.payment as keyof typeof copy.credit.paymentTerms]}
                          </dd>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <dt className="text-[10px] text-slate-500 dark:text-slate-400">{copy.credit.insurance}</dt>
                          <dd className="text-right text-[10px] font-bold text-slate-900 dark:text-white">
                            {copy.credit.insuranceTerms[assessment.suggestedTerms.insurance as keyof typeof copy.credit.insuranceTerms]}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 pt-4 dark:border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                    <Clock3 className="h-3 w-3" />
                    {formatDate(assessment.generatedAt, language)}
                  </div>
                  <div className="flex items-center gap-2">
                    {savedAt && (
                      <Pill tone="emerald">
                        <CheckCircle2 className="h-3 w-3" />
                        {copy.credit.saved}
                      </Pill>
                    )}
                    <PrimaryButton onClick={save} disabled={Boolean(savedAt)}>
                      <Sparkles className="h-3.5 w-3.5" />
                      {copy.credit.save}
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-5">
            <SectionHeading title={copy.credit.history} hint={copy.credit.historyEmpty} icon={Clock3} />
            {workspace.loading ? (
              <StatePanel kind="loading" title={copy.common.loading} />
            ) : workspace.state && workspace.state.assessments.length > 0 ? (
              <ul className="mt-3 divide-y divide-slate-200/70 dark:divide-white/5">
                {workspace.state.assessments.slice(0, 6).map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-2.5">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-extrabold ${
                        item.score >= 75
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                          : item.score >= 55
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
                      }`}
                    >
                      {item.score}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-slate-900 dark:text-white">{item.buyerName}</p>
                      <p className="text-[9px] text-slate-500 dark:text-slate-400">
                        {copy.credit.verdict[item.verdict].label} · {formatDate(item.createdAt, language)}
                      </p>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400">
                      {formatNumber(Math.round(item.score), language)} / 100
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <StatePanel kind="empty" icon={ShieldCheck} title={copy.credit.historyEmpty} />
            )}
          </GlassCard>
        </div>
      </div>
    </TradeShell>
  );
}
