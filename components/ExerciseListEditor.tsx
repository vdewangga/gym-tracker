"use client";

import { ExerciseItem } from "../lib/types";

interface ExerciseListEditorProps {
  exercises: ExerciseItem[];
  onChange: (exercises: ExerciseItem[]) => void;
}

export const ExerciseListEditor = ({
  exercises,
  onChange,
}: ExerciseListEditorProps) => (
  <div className="space-y-2">
    {exercises.map((exercise) => (
      <div
        key={exercise.id}
        className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm"
      >
        <span>{exercise.name}</span>
        <button
          type="button"
          onClick={() => {
            onChange(exercises.filter((item) => item.id !== exercise.id));
          }}
          className="text-xs font-semibold text-rose-500"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
);
