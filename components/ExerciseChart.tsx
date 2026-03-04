"use client";

import { useEffect, useMemo, useState } from "react";
import { WorkoutSession } from "@/lib/types";

const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  day: "numeric",
});
const CHART_WIDTH = 360;
const CHART_HEIGHT = 190;
const CHART_PADDING = 18;
const LOOKBACK_DAYS = 90;

type ChartMetricKey = "weightVolume" | "reps" | "sets";

const METRIC_CONFIGS: {
  key: ChartMetricKey;
  label: string;
  unit: string;
  color: string;
  decimals: number;
}[] = [
  { key: "weightVolume", label: "Weight volume", unit: "kg", color: "#0284c7", decimals: 0 },
  { key: "reps", label: "Reps", unit: "reps", color: "#ea580c", decimals: 0 },
  { key: "sets", label: "Sets", unit: "sets", color: "#16a34a", decimals: 0 },
];

const formatDate = (date: string) => {
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
  weightVolume: number;
  reps: number;
  sets: number;
}

interface ExerciseChartProps {
  sessions: WorkoutSession[];
}

export const ExerciseChart = ({ sessions }: ExerciseChartProps) => {
  const [selectedExercise, setSelectedExercise] = useState("");
  const startDate = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const past = new Date(now);
    past.setDate(past.getDate() - (LOOKBACK_DAYS - 1));
    return past.toISOString().split("T")[0];
  }, []);

  const exerciseOptions = useMemo(() => {
    const options = new Set<string>();
    sessions.forEach((session) => {
      if (session.status !== "done") return;
      session.items.forEach((item) => {
        if (item.name) options.add(item.name);
      });
    });
    return [...options].sort((a, b) => a.localeCompare(b));
  }, [sessions]);

  useEffect(() => {
    if (
      exerciseOptions.length > 0 &&
      !exerciseOptions.includes(selectedExercise)
    ) {
      setSelectedExercise(exerciseOptions[0]);
    }
  }, [exerciseOptions, selectedExercise]);

  const filteredSessions = useMemo(() => {
    if (!selectedExercise) return [];
    return sessions
      .filter(
        (session) =>
          session.status === "done" &&
          session.date >= startDate &&
          session.items.some((item) => item.name === selectedExercise),
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [sessions, selectedExercise, startDate]);

  const chartData = useMemo<ChartPoint[]>(() => {
    return filteredSessions.map((session) => {
      const matchingItems = session.items.filter(
        (item) => item.name === selectedExercise,
      );
      const sets = matchingItems.reduce(
        (sum, item) => sum + (item.sets ?? 0),
        0,
      );
      const reps = matchingItems.reduce(
        (sum, item) => sum + (item.reps ?? 0) * (item.sets ?? 0),
        0,
      );
      const weightVolume = matchingItems.reduce(
        (sum, item) =>
          sum +
          (item.weight ?? 0) *
            (item.reps ?? 0) *
            (item.sets ?? 0),
        0,
      );
      return {
        id: session.id,
        date: session.date,
        label: formatDate(session.date),
        weightVolume,
        reps,
        sets,
      };
    });
  }, [filteredSessions, selectedExercise]);

  const maxStats = useMemo(() => {
    let maxWeight = 0;
    let maxReps = 0;
    let maxSets = 0;
    filteredSessions.forEach((session) => {
      const matchingItems = session.items.filter(
        (item) => item.name === selectedExercise,
      );
      matchingItems.forEach((item) => {
        maxWeight = Math.max(maxWeight, item.weight ?? 0);
        maxReps = Math.max(maxReps, item.reps ?? 0);
        maxSets = Math.max(maxSets, item.sets ?? 0);
      });
    });
    return { maxWeight, maxReps, maxSets };
  }, [filteredSessions, selectedExercise]);

  const metricValues = METRIC_CONFIGS.map((metric) => ({
    key: metric.key,
    values: chartData.map((point) => point[metric.key]),
  }));
  const globalMax = Math.max(
    1,
    ...metricValues.flatMap((metric) => metric.values),
  );

  const hasChartData = chartData.length > 0;
  const hasExercises = exerciseOptions.length > 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Progress per exercise</p>
          <p className="text-xs text-zinc-500">
            Rentang {LOOKBACK_DAYS} hari terakhir
          </p>
        </div>
        <select
          value={selectedExercise}
          onChange={(event) => setSelectedExercise(event.target.value)}
          className="min-w-[200px] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700"
          disabled={!hasExercises}
        >
          {exerciseOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {!hasExercises ? (
        <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
          Selesaikan satu workout untuk mengumpulkan data latihan.
        </div>
      ) : !hasChartData ? (
        <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
          Belum ada sesi selesai untuk {selectedExercise}. Selesaikan lagi agar progress muncul.
        </div>
      ) : (
        <>
          <div className="mt-3 w-full overflow-x-auto">
            <svg
              width="100%"
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              role="img"
              aria-label={`Grafik progress ${selectedExercise}`}
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
                const config = METRIC_CONFIGS.find((m) => m.key === metric.key)!;
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

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 px-3 py-2">
              <div className="text-xs text-zinc-500">Max weight</div>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {formatNumber(maxStats.maxWeight, 0)} kg
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 px-3 py-2">
              <div className="text-xs text-zinc-500">Max reps</div>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {formatNumber(maxStats.maxReps, 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 px-3 py-2">
              <div className="text-xs text-zinc-500">Max sets</div>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {formatNumber(maxStats.maxSets, 0)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
