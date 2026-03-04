"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileShell } from "../components/MobileShell";
import { DayCard } from "../components/DayCard";
import { WorkoutChart } from "../components/WorkoutChart";
import { ExerciseChart } from "../components/ExerciseChart";
import { useGymContext } from "../contexts/GymContext";
import { Plan, Template } from "../lib/types";
import { useMemo, useState } from "react";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function HomePage() {
  const router = useRouter();
  const { plans, templates, sessions } = useGymContext();
  const activePlan = plans.find((plan) => plan.isActive);

  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);
  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const todayPlanDay = activePlan?.week?.[todayIndex];
  const todayTemplate = templates.find(
    (tpl) => tpl.id === todayPlanDay?.templateId,
  );
  const activeSession = sessions.find(
    (session) =>
      session.planId === activePlan?.id &&
      session.status === "in_progress" &&
      session.templateId === todayTemplate?.id &&
      session.date === todayDate,
  );

  const handleStart = (dayIndex: number) => {
    if (!activePlan) return;
    router.push(`/workout/start?day=${dayIndex}&planId=${activePlan.id}`);
  };

  const handleContinue = (sessionId: string) => {
    router.push(`/workout/session/${sessionId}`);
  };

  return (
    <MobileShell
      title="Gym Tracker"
      subtitle={
        activePlan
          ? `Active plan: ${activePlan.name}`
          : "Buat plan latihan untuk mulai"
      }
    >
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Today</h2>
        <div className="space-y-2">
          {activePlan ? (
            <DayCard
              dayLabel={WEEK_DAYS[todayIndex]}
              type={todayPlanDay?.type ?? "rest"}
              templateName={todayTemplate?.name}
              ctaLabel={
                todayPlanDay?.type === "workout"
                  ? activeSession
                    ? "Lanjutkan"
                    : todayTemplate
                    ? "Start workout"
                    : "Assign template"
                  : undefined
              }
              onStart={() =>
                activeSession
                  ? handleContinue(activeSession.id)
                  : handleStart(todayIndex)
              }
              statusText={todayPlanDay?.type === "workout" && todayTemplate ? "Ready" : undefined}
            />
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              Belum ada plan aktif. <Link href="/plans" className="font-semibold text-sky-600">Buat plan sekarang</Link>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <WorkoutChart sessions={sessions} templates={templates} />
      </section>

      <section className="space-y-3">
        <ExerciseChart sessions={sessions} />
      </section>

      {activePlan && (
        <section className="space-y-3">
          <WeekAccordion
            activePlan={activePlan}
            templates={templates}
            todayIndex={todayIndex}
            handleStart={handleStart}
          />
        </section>
      )}

      {!activePlan && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-4 text-sm text-zinc-600">
          <p>Untuk mulai, buat minimal 2 template lalu buat plan di halaman Plan.</p>
        </div>
      )}
    </MobileShell>
  );
}

interface WeekAccordionProps {
  activePlan: Plan;
  templates: Template[];
  todayIndex: number;
  handleStart: (dayIndex: number) => void;
}

const WeekAccordion = ({
  activePlan,
  templates,
  todayIndex,
  handleStart,
}: WeekAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const workoutDays = activePlan.week.filter((day) => day.type === "workout");

  return (
    <details
      className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="flex items-center justify-between gap-3 list-none cursor-pointer">
        <div>
          <h2 className="text-base font-semibold">Minggu ini</h2>
          <p className="text-xs text-zinc-400">
            {workoutDays.length} workout{workoutDays.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/plans/${activePlan.id}`}
            className="text-sm font-semibold text-sky-600"
            onClick={(event) => event.stopPropagation()}
          >
            Lihat detail
          </Link>
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            {isOpen ? "▾" : "▸"}
          </span>
        </div>
      </summary>

      <div className="mt-3 space-y-3">
        {activePlan.week.map((day) => {
          const template = templates.find((tpl) => tpl.id === day.templateId);
          const dayLabel =
            day.index === todayIndex
              ? `${WEEK_DAYS[day.index]} • Today`
              : WEEK_DAYS[day.index];
          return (
            <DayCard
              key={day.index}
              dayLabel={dayLabel}
              type={day.type}
              templateName={template?.name}
              ctaLabel={day.type === "workout" && template ? "Start" : undefined}
              onStart={() => handleStart(day.index)}
            />
          );
        })}
      </div>
    </details>
  );
};
