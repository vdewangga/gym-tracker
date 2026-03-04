"use client";

import { ChangeEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useGymContext } from "@/contexts/GymContext";
import { getExerciseSlug } from "@/lib/exercises";

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { sessions, actions, templates } = useGymContext();
  const sessionId = params?.sessionId;
  const session = sessions.find((item) => item.id === sessionId);
  const template = templates.find((tpl) => tpl.id === session?.templateId);

  if (!session) {
    return (
      <MobileShell showBack title="Workout" subtitle="Sesi tidak ditemukan">
        <p className="text-sm text-zinc-600">Sesi workout tidak tersedia.</p>
      </MobileShell>
    );
  }

  const handleToggle = (exerciseId: string) => {
    const updatedItems = session.items.map((item) =>
      item.exerciseId === exerciseId ? { ...item, done: !item.done } : item,
    );
    actions.updateSession(session.id, { items: updatedItems });
  };

  const handleNote = (exerciseId: string, value: string) => {
    const updatedItems = session.items.map((item) =>
      item.exerciseId === exerciseId ? { ...item, note: value } : item,
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

  const handleFinish = () => {
    actions.updateSession(session.id, { status: "done" });
    router.push("/history");
  };

  return (
    <MobileShell showBack title="Workout" subtitle={template?.name ?? "-"}>
      <div className="space-y-4">
        {session.items.map((item) => (
          <div key={item.exerciseId} className="space-y-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Link
                  href={`/exercises/${getExerciseSlug(item.name)}`}
                  className="font-semibold text-sky-600 transition hover:text-sky-500"
                >
                  {item.name}
                </Link>
                <label className="flex items-center gap-2 text-sm text-zinc-600">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleToggle(item.exerciseId)}
                  />
                  Selesai
                </label>
              </div>
              <div className="grid gap-2 text-sm text-zinc-600 sm:grid-cols-3">
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
              <textarea
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
                placeholder="Catatan (opsional)"
                value={item.note ?? ""}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  handleNote(item.exerciseId, event.target.value)
                }
              />
            </div>
          </div>
        ))}
        <PrimaryButton onClick={handleFinish}>Selesai</PrimaryButton>
      </div>
    </MobileShell>
  );
}
