"use client";

import { ChangeEvent, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MobileShell } from "@/components/MobileShell";
import { useGymContext } from "@/contexts/GymContext";

export default function HistoryDetailPage() {
  const params = useParams();
  const { sessions, templates, plans, actions } = useGymContext();
  const session = sessions.find((item) => item.id === params?.sessionId);
  const template = templates.find((tpl) => tpl.id === session?.templateId);
  const plan = plans.find((pl) => pl.id === session?.planId);

  if (!session) {
    return (
      <MobileShell tabs title="History" subtitle="Tidak tersedia">
        <p className="text-sm text-zinc-600">History sesi tidak ditemukan.</p>
      </MobileShell>
    );
  }

  const handleToggle = (exerciseId: string) => {
    const updatedItems = session.items.map((item) =>
      item.exerciseId === exerciseId ? { ...item, done: !item.done } : item,
    );
    actions.updateSession(session.id, { items: updatedItems });
  };

  const handleFieldChange = (
    exerciseId: string,
    field: "weight" | "reps" | "sets",
    value: number | undefined,
  ) => {
    const updatedItems = session.items.map((item) =>
      item.exerciseId === exerciseId ? { ...item, [field]: value } : item,
    );
    actions.updateSession(session.id, { items: updatedItems });
  };

  const handleNote = (exerciseId: string, value: string) => {
    const updatedItems = session.items.map((item) =>
      item.exerciseId === exerciseId ? { ...item, note: value } : item,
    );
    actions.updateSession(session.id, { items: updatedItems });
  };

  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  return (
    <MobileShell title={template?.name ?? "Workout"} subtitle={session.date}>
      <div className="space-y-3">
        {plan && <p className="text-sm text-zinc-500">Plan: {plan.name}</p>}
        {session.items.map((item) => (
          <div
            key={item.exerciseId}
            className="space-y-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    {item.weight !== undefined && <span>{item.weight} kg</span>}
                    {item.sets !== undefined && <span>{item.sets} set</span>}
                    {item.reps !== undefined && <span>{item.reps} reps</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingExerciseId(
                        editingExerciseId === item.exerciseId ? null : item.exerciseId,
                      )
                    }
                    className="text-xs font-semibold text-sky-600"
                  >
                    {editingExerciseId === item.exerciseId
                      ? "Selesai edit"
                      : "Edit data"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggle(item.exerciseId)}
                    className="text-[10px] font-semibold text-emerald-600"
                  >
                    {item.done ? "Selesai" : "Skip"}
                  </button>
                </div>
              </div>
              {editingExerciseId === item.exerciseId && (
                <div className="grid gap-2 text-xs text-zinc-600 sm:grid-cols-3">
                  <label className="flex flex-col text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Weight (kg)
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={item.weight ?? ""}
                      onChange={(event) =>
                        handleFieldChange(
                          item.exerciseId,
                          "weight",
                          event.target.value ? Number(event.target.value) : undefined,
                        )
                      }
                      className="mt-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm"
                    />
                  </label>
                  <label className="flex flex-col text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Sets
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={item.sets ?? ""}
                      onChange={(event) =>
                        handleFieldChange(
                          item.exerciseId,
                          "sets",
                          event.target.value ? Number(event.target.value) : undefined,
                        )
                      }
                      className="mt-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm"
                    />
                  </label>
                  <label className="flex flex-col text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Reps
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={item.reps ?? ""}
                      onChange={(event) =>
                        handleFieldChange(
                          item.exerciseId,
                          "reps",
                          event.target.value ? Number(event.target.value) : undefined,
                        )
                      }
                      className="mt-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm"
                    />
                  </label>
                </div>
              )}
              {editingExerciseId === item.exerciseId && (
                <textarea
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
                  placeholder="Catatan (opsional)"
                  value={item.note ?? ""}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    handleNote(item.exerciseId, event.target.value)
                  }
                />
              )}
              {item.note && editingExerciseId !== item.exerciseId && (
                <p className="text-sm text-zinc-600">Notes: {item.note}</p>
              )}
            </div>
          </div>
        ))}
        <p className="text-xs text-zinc-500">
          Perubahan tersimpan otomatis.
        </p>
        <Link href="/history" className="text-center text-sm font-semibold text-sky-600">
          Kembali ke history
        </Link>
      </div>
    </MobileShell>
  );
}
