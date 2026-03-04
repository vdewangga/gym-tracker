"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { generateWeekPattern } from "@/contexts/GymContext";
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

export default function PlanNewPage() {
  const router = useRouter();
  const { plans, templates, actions } = useGymContext();
  const [name, setName] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [templateAssignments, setTemplateAssignments] = useState<Record<number, string>>({});

  const pattern = useMemo(() => generateWeekPattern(daysPerWeek), [daysPerWeek]);

  const handleAssign = (index: number, templateId: string) => {
    setTemplateAssignments((prev) => ({ ...prev, [index]: templateId }));
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    const week = pattern.map((type, index) => ({
      index,
      type,
      templateId: type === "workout" ? templateAssignments[index] : undefined,
    }));

    const plan = {
      id: crypto.randomUUID(),
      name: name.trim(),
      daysPerWeek,
      week,
      isActive: plans.length === 0,
      createdAt: new Date().toISOString(),
    };

    actions.addPlan(plan);
    if (!plans.some((plan) => plan.isActive)) {
      actions.setActivePlan(plan.id);
    }
    router.push(`/plans/${plan.id}`);
  };

  const hasTemplates = templates.length > 0;

  return (
    <MobileShell title="Buat plan">
      <div className="space-y-4">
        <label className="text-sm font-semibold">Nama plan</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm"
          placeholder="4-day split"
        />
        <label className="text-sm font-semibold">Hari latihan per minggu</label>
        <input
          type="number"
          min={1}
          max={7}
          value={daysPerWeek}
          onChange={(event) => setDaysPerWeek(Number(event.target.value))}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm"
        />
        <section className="space-y-3">
          <p className="text-sm font-semibold">Jadwal 7 hari</p>
          <div className="space-y-3">
            {pattern.map((type, index) => (
              <div key={index} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{DAY_LABELS[index]}</p>
                    <p className="text-sm font-semibold">{type === "workout" ? "Workout" : "Rest"}</p>
                  </div>
                  {type === "workout" && (
                    <select
                      value={templateAssignments[index] ?? ""}
                      onChange={(event) => handleAssign(index, event.target.value)}
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
              </div>
            ))}
          </div>
        </section>
        <PrimaryButton onClick={handleCreate} disabled={!name.trim() || !hasTemplates}>
          Buat plan
        </PrimaryButton>
        {!hasTemplates && (
          <p className="text-xs text-red-500">Buat minimal 1 template terlebih dahulu.</p>
        )}
      </div>
    </MobileShell>
  );
}
