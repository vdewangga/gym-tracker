"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { useGymContext } from "@/contexts/GymContext";
import Link from "next/link";

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlanDetailPage() {
  const params = useParams();
  const { plans, templates, actions } = useGymContext();
  const plan = plans.find((item) => item.id === params?.id);

  const templateMap = useMemo(
    () => Object.fromEntries(templates.map((tpl) => [tpl.id, tpl])),
    [templates],
  );

  if (!plan) {
    return (
      <MobileShell
        showBack
        backHref="/plans"
        backLabel="Plans"
        title="Plan"
        subtitle="Tidak ditemukan"
      >
        <p className="text-sm text-zinc-600">Plan ini belum tersedia.</p>
      </MobileShell>
    );
  }

  const handleAssign = (index: number, templateId: string) => {
    const updatedWeek = plan.week.map((day) =>
      day.index === index ? { ...day, templateId } : day,
    );
    actions.updatePlan(plan.id, { week: updatedWeek });
  };

  return (
    <MobileShell
      showBack
      backHref="/plans"
      backLabel="Plans"
      title={plan.name}
      subtitle={`${plan.daysPerWeek} hari / minggu`}
    >
      <div className="space-y-3">
        {plan.week.map((day) => (
          <div key={day.index} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{WEEK_LABELS[day.index]}</p>
                <p className="text-sm font-semibold">{day.type === "workout" ? "Workout" : "Rest"}</p>
              </div>
              {day.type === "workout" && (
                <select
                  value={day.templateId ?? ""}
                  onChange={(event) => handleAssign(day.index, event.target.value)}
                  className="rounded-2xl border border-zinc-200 bg-white px-3 py-1 text-sm"
                >
                  <option value="">Pilih template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {day.templateId && (
              <p className="mt-2 text-sm text-zinc-500">
                {templateMap[day.templateId]?.name}
              </p>
            )}
          </div>
        ))}
      </div>
      <Link href="/plans" className="mt-4 rounded-2xl bg-zinc-900 px-4 py-3 text-center text-sm font-semibold text-white">
        Kembali ke list plan
      </Link>
    </MobileShell>
  );
}
