"use client";

interface DayCardProps {
  dayLabel: string;
  type: "workout" | "rest";
  templateName?: string;
  ctaLabel?: string;
  onStart?: () => void;
  statusText?: string;
}

export const DayCard = ({
  dayLabel,
  type,
  templateName,
  ctaLabel,
  onStart,
  statusText,
}: DayCardProps) => (
  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          {dayLabel}
        </p>
        <p className="text-lg font-semibold">
          {type === "workout" ? "Workout" : "Rest day"}
        </p>
      </div>
      {statusText && (
        <span className="text-xs font-semibold text-emerald-600">
          {statusText}
        </span>
      )}
    </div>
    {templateName && (
      <p className="mt-2 text-sm text-zinc-600">Template: {templateName}</p>
    )}
    {type === "workout" && ctaLabel && onStart && (
      <button
        onClick={onStart}
        className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
      >
        {ctaLabel}
      </button>
    )}
  </div>
);
