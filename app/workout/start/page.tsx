 "use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useGymContext } from "@/contexts/GymContext";

const DAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];


const todayString = () => new Date().toISOString().split("T")[0];

export default function WorkoutStartPage() {
  return (
    <Suspense
      fallback={
        <MobileShell
          showBack
          title="Start workout"
          subtitle="Loading..."
        >
          <div className="h-60 rounded-2xl bg-zinc-100" />
        </MobileShell>
      }
    >
      <WorkoutStartContent />
    </Suspense>
  );
}

const WorkoutStartContent = () => {
  const router = useRouter();
  const params = useSearchParams();
  const dayParam = params.get("day");
  const planId = params.get("planId");
  const dayIndex = dayParam ? Number(dayParam) : 0;

  const { plans, templates, sessions, actions } = useGymContext();
  const plan = plans.find((item) => item.id === planId);
  const planDay = plan?.week[dayIndex];
  const template = templates.find((tpl) => tpl.id === planDay?.templateId);
  const todayDate = useMemo(() => todayString(), []);
  const activeSession = sessions.find(
    (session) =>
      session.planId === plan?.id &&
      session.status === "in_progress" &&
      session.templateId === template?.id &&
      session.date === todayDate,
  );

  const missingTemplate = planDay?.type === "workout" && !template;

  const handleStart = () => {
    if (!plan || planDay?.type !== "workout" || !template) return;
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      date: todayDate,
      planId: plan.id,
      templateId: template.id,
      items: template.exercises.map((exercise) => ({
        exerciseId: exercise.id,
        name: exercise.name,
        done: false,
      })),
      status: "in_progress" as const,
    };
    actions.addSession(session);
    router.push(`/workout/session/${sessionId}`);
  };

  const handleContinue = (sessionId: string) => {
    router.push(`/workout/session/${sessionId}`);
  };

  if (!plan || !planDay) {
    return (
      <MobileShell
        showBack
        title="Start workout"
        subtitle="Invalid plan"
      >
        <p className="text-sm text-zinc-600">Plan tidak ditemukan atau hari tidak valid.</p>
        <Link href="/plans" className="mt-4 rounded-2xl bg-zinc-900 px-4 py-3 text-center text-sm font-semibold text-white">
          Kembali ke plan
        </Link>
      </MobileShell>
    );
  }

  return (
    <MobileShell
      showBack
      title="Start workout"
      subtitle={`${DAY_LABELS[dayIndex]} • ${plan.name}`}
    >
      <div className="space-y-4">
        <p className="text-sm text-zinc-600">
          {planDay.type === "rest"
            ? "Hari ini rest. Kamu bisa ubah plan jika ingin workout."
            : template
            ? `Template: ${template.name}`
            : "Belum ada template yang dipilih untuk hari ini."}
        </p>
        <ul className="space-y-2 text-sm text-zinc-600">
          {planDay.type === "workout" && !template && (
            <li className="text-rose-500">Isi template dulu sebelum mulai.</li>
          )}
          {template?.exercises.map((exercise) => (
            <li key={exercise.id} className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-3 py-2">
              {exercise.name}
            </li>
          ))}
        </ul>
        <PrimaryButton
          onClick={() =>
            activeSession ? handleContinue(activeSession.id) : handleStart()
          }
          disabled={
            planDay.type !== "workout" ||
            !template ||
            missingTemplate
          }
        >
          {activeSession ? "Lanjutkan" : "Mulai latihan"}
        </PrimaryButton>
        <Link href="/" className="text-center text-sm font-semibold text-sky-600">
          Kembali ke Today
        </Link>
      </div>
    </MobileShell>
  );
};
