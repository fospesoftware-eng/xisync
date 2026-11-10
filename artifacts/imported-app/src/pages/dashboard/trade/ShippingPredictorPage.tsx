import { useMemo, useState } from 'react';
import {
  Anchor,
  ArrowRightLeft,
  CheckCircle2,
  Fuel,
  Gauge,
  Leaf,
  MapPin,
  Plane,
  Ship,
  Sparkles,
  Train,
  TrendingDown,
  TrendingUp,
  Waves,
} from 'lucide-react';
import { useI18n } from '../../../lib/i18n';
import { getTradeCopy } from '../../../lib/i18n/tradeCopy';
import { LANES } from '../../../lib/services/tradeIntelligence/dataset';
import { predictShipping } from '../../../lib/services/tradeIntelligence/shipping';
import { tradeProvider } from '../../../lib/services/tradeIntelligence/provider';
import type { ShippingInput, ShippingPrediction } from '../../../types/tradeIntelligence';
import {
  Field,
  GlassCard,
  Meter,
  Pill,
  PrimaryButton,
  SectionHeading,
  Select,
  StatePanel,
  TextInput,
  Toggle,
  TradeShell,
  cx,
} from '../../../components/trade/TradeUI';
import { ShippingBar } from '../../../components/trade/TradeCharts';
import { formatNumber, formatUsd } from '../../../components/trade/format';

const LANE = LANES[0];

const INITIAL_INPUT: ShippingInput = {
  originCode: LANE.originCode,
  destinationCode: LANE.destinationCode,
  mode: 'fcl',
  containerType: '40ft',
  weightKg: 18000,
  volumeCbm: 60,
  incoterm: 'CIF',
  month: 10,
  fuelSurchargePct: 18,
  peakSeason: true,
  portCongestion: 'medium',
  cargoValueUsd: 300000,
  priority: 'balanced',
};

const MODE_ICON = { fcl: Ship, lcl: Waves, air: Plane, rail: Train };

export function ShippingPredictorPage() {
  const { language } = useI18n();
  const copy = getTradeCopy(language);
  const [input, setInput] = useState<ShippingInput>(INITIAL_INPUT);
  const [laneId, setLaneId] = useState(LANE.id);
  const [prediction, setPrediction] = useState<ShippingPrediction | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const update = <K extends keyof ShippingInput>(key: K, value: ShippingInput[K]) => {
    setInput((previous) => ({ ...previous, [key]: value }));
    setPrediction(null);
    setStatus('idle');
  };

  const chooseLane = (nextLaneId: string) => {
    const lane = LANES.find((item) => item.id === nextLaneId);
    if (!lane) return;
    setLaneId(lane.id);
    setInput((previous) => ({
      ...previous,
      originCode: lane.originCode,
      destinationCode: lane.destinationCode,
      portCongestion: lane.congestion,
    }));
    setPrediction(null);
    setStatus('idle');
  };

  const run = async () => {
    setStatus('loading');
    try {
      const result = await tradeProvider.predictShipping(input);
      setPrediction(result);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  const pickMode = (mode: ShippingInput['mode']) => {
    const next = { ...input, mode };
    setInput(next);
    setPrediction(predictShipping(next));
  };

  const selected = prediction?.selected;
  const maxDriver = useMemo(
    () => Math.max(1, ...(selected?.breakdown.map((driver) => driver.amountUsd) ?? [1])),
    [selected],
  );

  const comparison = useMemo(
    () =>
      prediction
        ? prediction.estimates.map((estimate) => ({
            ...estimate,
            recommended: estimate.mode === prediction.recommendedMode,
          }))
        : [],
    [prediction],
  );

  return (
    <TradeShell
      active="shipping"
      eyebrow={copy.shipping.eyebrow}
      title={copy.shipping.title}
      subtitle={copy.shipping.subtitle}
    >
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <GlassCard className="p-5">
            <SectionHeading title={copy.shipping.formHeading} hint={copy.shipping.subtitle} icon={Anchor} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label={copy.shipping.lane} className="col-span-2">
                <Select value={laneId} onChange={(event) => chooseLane(event.target.value)}>
                  {LANES.map((lane) => (
                    <option key={lane.id} value={lane.id}>
                      {lane.origin[language]} → {lane.destination[language]} · {lane.carrier}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={copy.shipping.modeField}>
                <Select
                  value={input.mode}
                  onChange={(event) => update('mode', event.target.value as ShippingInput['mode'])}
                >
                  {(['fcl', 'lcl', 'air', 'rail'] as const).map((mode) => (
                    <option key={mode} value={mode}>
                      {copy.shipping.mode[mode]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={copy.shipping.container}>
                <Select
                  value={input.containerType}
                  onChange={(event) => update('containerType', event.target.value as ShippingInput['containerType'])}
                >
                  {(['20ft', '40ft', '40ft_hc'] as const).map((container) => (
                    <option key={container} value={container}>
                      {copy.shipping.containers[container]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={copy.shipping.weight}>
                <TextInput
                  type="number"
                  min={1}
                  value={input.weightKg}
                  onChange={(event) => update('weightKg', Number(event.target.value))}
                />
              </Field>

              <Field label={copy.shipping.volume}>
                <TextInput
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={input.volumeCbm}
                  onChange={(event) => update('volumeCbm', Number(event.target.value))}
                />
              </Field>

              <Field label={copy.shipping.incoterm}>
                <Select
                  value={input.incoterm}
                  onChange={(event) => update('incoterm', event.target.value as ShippingInput['incoterm'])}
                >
                  {(['EXW', 'FOB', 'CFR', 'CIF', 'DDP'] as const).map((incoterm) => (
                    <option key={incoterm} value={incoterm}>
                      {incoterm}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={copy.shipping.month}>
                <Select value={input.month} onChange={(event) => update('month', Number(event.target.value))}>
                  {copy.shipping.months.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={copy.shipping.fuel}>
                <TextInput
                  type="number"
                  min={0}
                  max={100}
                  value={input.fuelSurchargePct}
                  onChange={(event) => update('fuelSurchargePct', Number(event.target.value))}
                />
              </Field>

              <Field label={copy.shipping.congestion}>
                <Select
                  value={input.portCongestion}
                  onChange={(event) => update('portCongestion', event.target.value as ShippingInput['portCongestion'])}
                >
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <option key={level} value={level}>
                      {copy.shipping.congestionLevels[level]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={copy.shipping.cargoValue} className="col-span-2">
                <TextInput
                  type="number"
                  min={0}
                  step={1000}
                  value={input.cargoValueUsd}
                  onChange={(event) => update('cargoValueUsd', Number(event.target.value))}
                />
              </Field>

              <div className="col-span-2">
                <Toggle
                  checked={input.peakSeason}
                  onChange={(value) => update('peakSeason', value)}
                  label={copy.shipping.peak}
                />
              </div>

              <Field label={copy.shipping.priority} className="col-span-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {(['cost', 'balanced', 'speed'] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => update('priority', priority)}
                      className={cx(
                        'rounded-xl border px-2 py-2 text-[10px] font-bold transition',
                        input.priority === priority
                          ? 'border-transparent bg-gradient-to-r from-xisync-blue-900 to-xisync-cyan-600 text-white shadow'
                          : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
                      )}
                    >
                      {priority === 'cost'
                        ? copy.shipping.priorityCost
                        : priority === 'balanced'
                          ? copy.shipping.priorityBalanced
                          : copy.shipping.prioritySpeed}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="mt-4">
              <PrimaryButton onClick={run} loading={status === 'loading'} className="w-full">
                <Ship className="h-3.5 w-3.5" />
                {status === 'loading' ? copy.common.analyzing : copy.shipping.estimate}
              </PrimaryButton>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
              {copy.shipping.disclaimer}
            </p>
          </GlassCard>
        </div>

        <div className="space-y-4 xl:col-span-8">
          <GlassCard className="p-5">
            <SectionHeading
              title={copy.shipping.resultHeading}
              hint={prediction ? `${prediction.laneLabel[language]} · ${formatNumber(prediction.distanceKm, language)} km` : copy.shipping.resultEmpty}
              icon={Gauge}
              action={
                prediction && (
                  <Pill tone={prediction.modelMode === 'remote' ? 'cyan' : 'slate'}>
                    {prediction.modelMode === 'remote' ? copy.common.modelRemote : copy.common.modelHeuristic}
                  </Pill>
                )
              }
            />

            {status === 'error' ? (
              <StatePanel kind="error" title={copy.common.errorTitle} onRetry={run} retryLabel={copy.common.retry} />
            ) : status === 'loading' ? (
              <StatePanel kind="loading" title={copy.common.analyzing} />
            ) : !prediction || !selected ? (
              <StatePanel kind="empty" icon={Ship} title={copy.shipping.resultEmpty} message={copy.shipping.disclaimer}>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                  <Ship className="h-4 w-4" />
                  <Waves className="h-4 w-4" />
                  <Plane className="h-4 w-4" />
                  <Train className="h-4 w-4" />
                </div>
              </StatePanel>
            ) : (
              <>
                {prediction.notice && (
                  <div className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[10px] font-semibold text-amber-700 dark:text-amber-200">
                    {copy.shipping.laneFallback}
                  </div>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.shipping.costRange}</p>
                    <p className="mt-1.5 text-sm font-extrabold text-slate-900 dark:text-white">
                      {formatUsd(selected.costLowUsd, language, true)} – {formatUsd(selected.costHighUsd, language, true)}
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-400">
                      {copy.shipping.costMid}: {formatUsd(selected.costMidUsd, language)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.shipping.transitRange}</p>
                    <p className="mt-1.5 text-sm font-extrabold text-slate-900 dark:text-white">
                      {selected.transitLowDays}–{selected.transitHighDays} {copy.common.days}
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-400">{copy.shipping.mode[selected.mode]}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.shipping.confidence}</p>
                    <p className="mt-1.5 text-sm font-extrabold text-slate-900 dark:text-white">
                      {Math.round(selected.confidence * 100)}%
                    </p>
                    <div className="mt-1.5">
                      <Meter value={selected.confidence * 100} tone="cyan" height="h-1" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{copy.shipping.recommended}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Pill tone="emerald">
                        <Sparkles className="h-3 w-3" />
                        {copy.shipping.mode[prediction.recommendedMode]}
                      </Pill>
                    </div>
                    <p className="mt-1 text-[9px] text-slate-400">{copy.shipping.priorityBalanced}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {copy.shipping.costChart}
                    </p>
                    <ShippingBar data={comparison} language={language} />
                  </div>
                  <div className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {copy.shipping.drivers}
                    </p>
                    <div className="mt-3 space-y-2.5">
                      {selected.breakdown.map((driver) => (
                        <div key={driver.key}>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
                              {driver.key === 'fuelSurcharge' ? (
                                <Fuel className="h-3 w-3 text-amber-500" />
                              ) : driver.direction === 'up' ? (
                                <TrendingUp className="h-3 w-3 text-rose-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-emerald-500" />
                              )}
                              {copy.shipping.driver[driver.key as keyof typeof copy.shipping.driver] ?? driver.key}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {formatUsd(driver.amountUsd, language, true)}
                            </span>
                          </div>
                          <div className="mt-1">
                            <Meter value={(driver.amountUsd / maxDriver) * 100} tone="cyan" height="h-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </GlassCard>

          {prediction && (
            <GlassCard className="p-5">
              <SectionHeading
                title={copy.shipping.comparison}
                hint={copy.shipping.comparisonHint}
                icon={ArrowRightLeft}
              />
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[620px] border-separate border-spacing-y-1.5 text-left">
                  <thead>
                    <tr className="text-[9px] uppercase tracking-[0.1em] text-slate-400">
                      <th className="px-3 py-1 font-bold">{copy.shipping.modeLabel}</th>
                      <th className="px-3 py-1 font-bold">{copy.shipping.costRange}</th>
                      <th className="px-3 py-1 font-bold">{copy.shipping.transit}</th>
                      <th className="px-3 py-1 font-bold">{copy.shipping.co2}</th>
                      <th className="px-3 py-1 font-bold">{copy.shipping.confidence}</th>
                      <th className="px-3 py-1 font-bold" />
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((estimate) => {
                      const Icon = MODE_ICON[estimate.mode];
                      const isSelected = estimate.mode === input.mode;
                      return (
                        <tr
                          key={estimate.mode}
                          className={cx(
                            'rounded-xl text-[10px] transition',
                            isSelected
                              ? 'bg-xisync-cyan-500/[0.08] ring-1 ring-inset ring-xisync-cyan-500/30'
                              : 'bg-white/50 dark:bg-white/[0.03]',
                          )}
                        >
                          <td className="rounded-l-xl px-3 py-2.5">
                            <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                              <Icon className="h-3.5 w-3.5 text-slate-400" />
                              {copy.shipping.mode[estimate.mode]}
                              {estimate.recommended && (
                                <Pill tone="emerald">
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  {copy.shipping.recommended}
                                </Pill>
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-white">
                            {formatUsd(estimate.costLowUsd, language, true)} – {formatUsd(estimate.costHighUsd, language, true)}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                            {estimate.transitLowDays}–{estimate.transitHighDays} {copy.common.days}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                            <span className="inline-flex items-center gap-1">
                              <Leaf className="h-3 w-3 text-emerald-500" />
                              {estimate.co2Tons} {copy.shipping.co2Unit}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                            {Math.round(estimate.confidence * 100)}%
                          </td>
                          <td className="rounded-r-xl px-3 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => pickMode(estimate.mode)}
                              className={cx(
                                'rounded-lg px-2.5 py-1 text-[9px] font-bold transition',
                                isSelected
                                  ? 'bg-slate-200/70 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                  : 'bg-xisync-blue-900/10 text-xisync-blue-800 hover:bg-xisync-blue-900/20 dark:bg-cyan-400/10 dark:text-cyan-200',
                              )}
                            >
                              {isSelected ? copy.shipping.selected : copy.shipping.choose}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {prediction.laneLabel[language]}
                </span>
                <span>·</span>
                <span>{formatNumber(prediction.distanceKm, language)} km</span>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </TradeShell>
  );
}
