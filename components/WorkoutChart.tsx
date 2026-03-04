"use client";

import { useMemo } from "react";
import { WorkoutSession } from "@/lib/types";

const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  day: "numeric",
});
const CHART_WIDTH = 320;
const CHART_HEIGHT = 160;
const CHART_PADDING = 16;

type MetricKey =
  | "totalWeight"
  | "totalReps"
  | "totalSets"
  | "maxWeight";

const METRICS: {
  key: MetricKey;
  label: string;
  unit: string;
  color: string;
  decimals: number;
}[] = [
  { key: "totalWeight", label: "Total weight", unit: "kg", color: "#0284c7", decimals: 0 },
  { key: "totalReps", label: "Total reps", unit: "reps", color: "#ea580c", decimals: 0 },
  { key: "totalSets", label: "Total sets", unit: "sets", color: "#16a34a", decimals: 0 },
  { key: "maxWeight", label: "Weight terberat", unit: "kg", color: "#7c3aed", decimals: 1 },
];

const formatLabel = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return DATE_FORMATTER.format(parsed);
};

const formatNumber = (value: number, decimals: number) =>
  value.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });

const computePoints = (
  values: number[],
  max: number,
  width: number,
  height: number,
) => {
  if (values.length === 0) return [];
  const innerWidth = width - CHART_PADDING * 2;
  const innerHeight = height - CHART_PADDING * 2;
  const denominator = values.length > 1 ? values.length - 1 : 1;
  return values.map((value, index) => {
    const ratio = max > 0 ? Math.min(value / max, 1) : 0;
    const x = CHART_PADDING + (innerWidth * index) / denominator;
    const y = CHART_PADDING + innerHeight * (1 - ratio);
    return { x, y };
  });
};

const buildPath = (points: { x: number; y: number }[]) =>
  points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

const buildArea = (
  points: { x: number; y: number }[],
  width: number,
  height: number,
) => {
  if (points.length === 0) return "";
  const bottom = height - CHART_PADDING;
  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  const linePath = buildPath(points);
  return `${linePath} L${lastX},${bottom} L${firstX},${bottom} Z`;
};

interface ChartPoint {
  id: string;
  date: string;
  label: string;
  totalWeight: number;
  totalReps: number;
  totalSets: number;
  maxWeight: number;
}

interface WorkoutChartProps {
  sessions: WorkoutSession[];
}

export const WorkoutChart = ({ sessions }: WorkoutChartProps) => {
  const chartData = useMemo<ChartPoint[]>(() => {
    const doneSessions: ChartPoint[] = sessions
      .filter((session) => session.status === "done")
      .map((session) => {
        const totalSets = session.items.reduce(
          (sum, item) => sum + (item.sets ?? 0),
          0,
        );
        const totalReps = session.items.reduce(
          (sum, item) => sum + (item.reps ?? 0) * (item.sets ?? 0),
          0,
        );
        const totalWeight = session.items.reduce(
          (sum, item) =>
            sum +
            (item.weight ?? 0) *
              (item.reps ?? 0) *
              (item.sets ?? 0),
          0,
        );
        const maxWeight = session.items.reduce(
          (max, item) => Math.max(max, item.weight ?? 0),
          0,
        );
        return {
          id: session.id,
          date: session.date,
          label: formatLabel(session.date),
          totalSets,
          totalReps,
          totalWeight,
          maxWeight,
        };
      })
      .filter(
        (point) =>
          point.totalWeight > 0 || point.totalReps > 0 || point.totalSets > 0 || point.maxWeight > 0,
      )
      .sort((a, b) => a.date.localeCompare(b.date));
    return doneSessions.slice(-7);
  }, [sessions]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm">
        <p className="text-sm font-semibold text-zinc-900">Progress</p>
        <p className="mt-2 text-sm text-zinc-500">
          Catatan workout belum cukup untuk menampilkan grafik. Selesaikan satu sesi untuk
          melihat perkembanganmu.
        </p>
      </div>
    );
  }

  const metricValues = METRICS.map((metric) => ({
    key: metric.key,
    values: chartData.map((point) => point[metric.key]),
  }));
  const globalMax = Math.max(
    1,
    ...metricValues.flatMap((metric) => metric.values),
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-900">Progress</p>
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          {chartData.length} sesi
        </span>
      </div>

      <div className="mt-3 w-full overflow-x-auto">
        <svg
          width="100%"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label="Grafik perkembangan total weight, reps, sets, dan weight terberat"
        >
          {metricValues.map((metric) => {
            const points = computePoints(
              metric.values,
              globalMax,
              CHART_WIDTH,
              CHART_HEIGHT,
            );
            const path = buildPath(points);
            const areaPath = buildArea(points, CHART_WIDTH, CHART_HEIGHT);
            const config = METRICS.find((m) => m.key === metric.key)!;
            return (
              <g key={metric.key}>
                <path
                  d={areaPath}
                  fill={config.color}
                  fillOpacity={0.08}
                  stroke="none"
                />
                <path
                  d={path}
                  fill="none"
                  stroke={config.color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
          <line
            x1={CHART_PADDING}
            x2={CHART_WIDTH - CHART_PADDING}
            y1={CHART_HEIGHT - CHART_PADDING}
            y2={CHART_HEIGHT - CHART_PADDING}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        </svg>
        <div
          className="mt-2 grid items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400"
          style={{
            gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))`,
          }}
        >
          {chartData.map((point) => (
            <span key={point.id} className="text-center text-[10px] text-zinc-400">
              {point.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {METRICS.map((metric) => {
          const latestValue = chartData[chartData.length - 1][metric.key];
          return (
            <div key={metric.key} className="rounded-2xl border border-zinc-100 bg-zinc-50/80 px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: metric.color }}
                />
                <span className="font-semibold text-zinc-900">{metric.label}</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {formatNumber(latestValue, metric.decimals)} {metric.unit}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
