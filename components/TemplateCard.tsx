"use client";

import { Template } from "../lib/types";

interface TemplateCardProps {
  template: Template;
  onEdit?: () => void;
}

export const TemplateCard = ({ template, onEdit }: TemplateCardProps) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          {template.category}
        </p>
        <h3 className="text-lg font-semibold">{template.name}</h3>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-sm font-semibold text-sky-600"
          type="button"
        >
          Edit
        </button>
      )}
    </div>
    <p className="text-sm text-zinc-500">{template.exercises.length} exercises</p>
  </div>
);
