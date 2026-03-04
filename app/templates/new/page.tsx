"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ExerciseItem } from "@/lib/types";
import { MobileShell } from "@/components/MobileShell";
import { ExerciseListEditor } from "@/components/ExerciseListEditor";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useGymContext } from "@/contexts/GymContext";
import type { TemplateCategory } from "@/lib/types";
import workoutData from "@/const/workout.json";

export default function TemplateNewPage() {
  const router = useRouter();
  const { actions } = useGymContext();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TemplateCategory>("upper");
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [selectedExercise, setSelectedExercise] = useState("");

  const suggestions = useMemo(() => {
    const filtered = workoutData.filter(
      (item) => !exercises.some((exercise) => exercise.name === item.name),
    );
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [exercises]);

  const handleSave = () => {
    if (!name.trim() || exercises.length === 0) return;
    const template = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      exercises,
    };
    actions.addTemplate(template);
    router.push(`/templates/${template.id}`);
  };

  const handleAddSuggestion = (exerciseName: string) => {
    if (!exerciseName) return;
    setExercises((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: exerciseName,
      },
    ]);
    setSelectedExercise("");
  };

  return (
    <MobileShell title="Buat template">
      <div className="space-y-4">
        <label className="text-sm font-semibold">Nama template</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm"
          placeholder="Upper Strength"
        />
        <label className="text-sm font-semibold">Kategori</label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as TemplateCategory)}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm"
        >
          <option value="upper">Upper</option>
          <option value="lower">Lower</option>
          <option value="custom">Custom</option>
        </select>
        <section>
          <p className="text-sm font-semibold">Latihan</p>
          <ExerciseListEditor exercises={exercises} onChange={setExercises} />
          <div className="mt-3 space-y-3 rounded-2xl border border-dashed border-zinc-300 bg-white/80 p-3">
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Tambah dari katalog
            </label>
            <select
              value={selectedExercise}
              onChange={(event) => {
                const value = event.target.value;
                if (!value) return;
                handleAddSuggestion(value);
              }}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
            >
              <option value="">Pilih latihan</option>
              {suggestions.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            {!suggestions.length && (
              <p className="text-xs text-zinc-500">Semua latihan sudah dipilih.</p>
            )}
          </div>
        </section>
        <PrimaryButton onClick={handleSave} disabled={!name.trim() || exercises.length === 0}>
          Simpan template
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
