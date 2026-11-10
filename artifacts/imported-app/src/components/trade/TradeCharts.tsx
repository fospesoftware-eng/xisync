import { useId } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '../../lib/theme-context';
import type { Language } from '../../lib/i18n';
import { formatNumber, formatPercent, formatUsd } from './format';

const INDIGO = '#1e3a8a';
const CYAN = '#06b6d4';
const LIME = '#84cc16';
const AMBER = '#f59e0b';
const ROSE = '#f43f5e';
const EMERALD = '#10b981';

const MODE_COLORS = [INDIGO, CYAN, LIME, AMBER];

function useChartTheme() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return {
    dark,
    grid: dark ? 'rgba(148,163,184,0.14)' : 'rgba(100,116,139,0.16)',
    tick: { fill: dark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 600 },
    tooltipBg: dark ? 'rgba(15,23,42,0.96)' : 'rgba(255,255,255,0.98)',
    tooltipBorder: dark ? 'rgba(148,163,184,0.24)' : 'rgba(148,163,184,0.35)',
  };
}

function TooltipCard({
  label,
  rows,
  note,
}: {
  label?: string;
  rows: { name: string; value: string; color?: string }[];
  note?: string;
}) {
  const theme = useChartTheme();
  return (
    <div
      className="min-w-[150px] rounded-xl border px-3 py-2 shadow-xl backdrop-blur"
      style={{ background: theme.tooltipBg, borderColor: theme.tooltipBorder }}
    >
      {label && (
        <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
      )}
      {rows.map((row) => (
        <div key={row.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            {row.color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: row.color }} />}
            {row.name}
          </span>
          <span className="text-[11px] font-bold text-slate-900 dark:text-white">{row.value}</span>
        </div>
      ))}
      {note && <p className="mt-1 border-t border-slate-200/60 pt-1 text-[9px] text-slate-500 dark:border-white/10 dark:text-slate-400">{note}</p>}
    </div>
  );
}

export function CreditRadar({ data }: { data: { label: string; score: number }[] }) {
  const theme = useChartTheme();
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke={theme.grid} />
          <PolarAngleAxis dataKey="label" tick={{ fill: theme.tick.fill, fontSize: 9, fontWeight: 700 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="score" stroke={CYAN} fill={CYAN} fillOpacity={0.24} strokeWidth={2} />
          <Tooltip
            content={({ active, payload }) =>
              active && payload && payload.length ? (
                <TooltipCard
                  rows={[
                    { name: 'Factor score', value: `${Math.round(Number(payload[0].value))}/100`, color: CYAN },
                  ]}
                  note={String(payload[0].payload.label)}
                />
              ) : null
            }
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PipelineBar({
  data,
  language,
}: {
  data: { label: string; valueUsd: number; count: number }[];
  language: Language;
}) {
  const theme = useChartTheme();
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="pipelineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CYAN} stopOpacity={0.95} />
              <stop offset="100%" stopColor={INDIGO} stopOpacity={0.85} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
          <XAxis dataKey="label" tick={theme.tick} axisLine={false} tickLine={false} interval={0} />
          <YAxis
            tick={theme.tick}
            axisLine={false}
            tickLine={false}
            width={46}
            tickFormatter={(value: number) => formatNumber(value, language, true)}
          />
          <Tooltip
            cursor={{ fill: theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(30,58,138,0.04)' }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const point = payload[0].payload as { valueUsd: number; count: number };
              return (
                <TooltipCard
                  label={String(payload[0].payload.label)}
                  rows={[
                    { name: 'Value', value: formatUsd(point.valueUsd, language, true), color: CYAN },
                    { name: 'Matches', value: formatNumber(point.count, language) },
                  ]}
                />
              );
            }}
          />
          <Bar dataKey="valueUsd" fill="url(#pipelineFill)" radius={[7, 7, 2, 2]} maxBarSize={46} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExposureBar({
  data,
  language,
}: {
  data: { label: string; exposureUsd: number; riskScore: number }[];
  language: Language;
}) {
  const theme = useChartTheme();
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.grid} />
          <XAxis
            type="number"
            tick={theme.tick}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) => formatNumber(value, language, true)}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ ...theme.tick, fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            width={96}
          />
          <Tooltip
            cursor={{ fill: theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(30,58,138,0.04)' }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const point = payload[0].payload as { exposureUsd: number; riskScore: number };
              return (
                <TooltipCard
                  rows={[
                    { name: 'Exposure', value: formatUsd(point.exposureUsd, language, true), color: INDIGO },
                    { name: 'Country risk', value: `${point.riskScore}/100` },
                  ]}
                />
              );
            }}
          />
          <Bar dataKey="exposureUsd" radius={[0, 6, 6, 0]} maxBarSize={20}>
            {data.map((point) => (
              <Cell
                key={point.label}
                fill={point.riskScore >= 75 ? EMERALD : point.riskScore >= 60 ? CYAN : point.riskScore >= 45 ? AMBER : ROSE}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LaneComposed({
  data,
  language,
}: {
  data: { label: string; onTimePct: number; marginPct: number }[];
  language: Language;
}) {
  const theme = useChartTheme();
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 8, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
          <XAxis dataKey="label" tick={{ ...theme.tick, fontSize: 8 }} axisLine={false} tickLine={false} interval={0} angle={-12} height={42} />
          <YAxis yAxisId="left" tick={theme.tick} axisLine={false} tickLine={false} width={34} unit="%" domain={[0, 'auto']} />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={theme.tick}
            axisLine={false}
            tickLine={false}
            width={34}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip
            cursor={{ fill: theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(30,58,138,0.04)' }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const point = payload[0].payload as { marginPct: number; onTimePct: number };
              return (
                <TooltipCard
                  label={String(payload[0].payload.label)}
                  rows={[
                    { name: 'Margin', value: formatPercent(point.marginPct, 1), color: CYAN },
                    { name: 'On-time', value: formatPercent(point.onTimePct), color: LIME },
                  ]}
                />
              );
            }}
          />
          <Bar yAxisId="left" dataKey="marginPct" fill={CYAN} radius={[5, 5, 0, 0]} maxBarSize={28} opacity={0.9} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="onTimePct"
            stroke={LIME}
            strokeWidth={2.4}
            dot={{ r: 3, fill: LIME, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskDonut({
  data,
  language,
}: {
  data: { label: string; count: number; color: string }[];
  language: Language;
}) {
  const theme = useChartTheme();
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="h-[190px] w-full max-w-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="label" innerRadius="58%" outerRadius="88%" paddingAngle={3} strokeWidth={0}>
              {data.map((item) => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <TooltipCard
                    rows={[{ name: String(payload[0].name), value: `${payload[0].value}` }]}
                  />
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2">
        {data.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
              {item.label}
            </span>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white">
              {formatNumber(item.count, language)}
              <span className="ml-1 font-medium text-slate-500 dark:text-slate-400">
                ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FlowArea({
  data,
  language,
}: {
  data: { month: string; revenueUsd: number; orders: number }[];
  language: Language;
}) {
  const theme = useChartTheme();
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="flowFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CYAN} stopOpacity={0.45} />
              <stop offset="100%" stopColor={CYAN} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
          <XAxis dataKey="month" tick={theme.tick} axisLine={false} tickLine={false} />
          <YAxis
            tick={theme.tick}
            axisLine={false}
            tickLine={false}
            width={46}
            tickFormatter={(value: number) => formatNumber(value, language, true)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const point = payload[0].payload as { revenueUsd: number; orders: number; month: string };
              return (
                <TooltipCard
                  label={point.month}
                  rows={[
                    { name: 'Revenue', value: formatUsd(point.revenueUsd, language, true), color: CYAN },
                    { name: 'Orders', value: formatNumber(point.orders, language) },
                  ]}
                />
              );
            }}
          />
          <Area type="monotone" dataKey="revenueUsd" stroke={CYAN} strokeWidth={2.4} fill="url(#flowFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ShippingBar({
  data,
  language,
}: {
  data: { mode: string; costLowUsd: number; costMidUsd: number; costHighUsd: number; recommended: boolean }[];
  language: Language;
}) {
  const theme = useChartTheme();
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
          <XAxis dataKey="mode" tick={theme.tick} axisLine={false} tickLine={false} />
          <YAxis
            tick={theme.tick}
            axisLine={false}
            tickLine={false}
            width={50}
            tickFormatter={(value: number) => formatNumber(value, language, true)}
          />
          <Tooltip
            cursor={{ fill: theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(30,58,138,0.04)' }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const point = payload[0].payload as {
                costLowUsd: number;
                costHighUsd: number;
                costMidUsd: number;
              };
              return (
                <TooltipCard
                  label={String(payload[0].payload.mode)}
                  rows={[
                    { name: 'Low', value: formatUsd(point.costLowUsd, language, true) },
                    { name: 'Mid', value: formatUsd(point.costMidUsd, language, true), color: CYAN },
                    { name: 'High', value: formatUsd(point.costHighUsd, language, true) },
                  ]}
                />
              );
            }}
          />
          <Bar dataKey="costMidUsd" radius={[6, 6, 0, 0]} maxBarSize={44}>
            {data.map((point, index) => (
              <Cell key={point.mode} fill={point.recommended ? LIME : MODE_COLORS[index % MODE_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const SPARK_COLORS = {
  cyan: '#06b6d4',
  indigo: '#1e3a8a',
  lime: '#84cc16',
  rose: '#f43f5e',
} as const;

export function Sparkline({
  data,
  tone = 'cyan',
  height = 42,
  className,
}: {
  data: number[];
  tone?: keyof typeof SPARK_COLORS;
  height?: number;
  className?: string;
}) {
  const gradientId = useId().replace(/:/g, '');
  if (data.length < 2) return <div style={{ height }} className={className} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 92 - ((value - min) / span) * 76;
    return [x, y] as const;
  });
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const area = `${line} L100,100 L0,100 Z`;
  const color = SPARK_COLORS[tone];
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      style={{ height, width: '100%' }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`spark-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.32} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2.6} fill={color} />
    </svg>
  );
}

