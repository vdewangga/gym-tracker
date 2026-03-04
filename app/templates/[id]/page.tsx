"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExerciseItem, Template, TemplateCategory } from "@/lib/types";
import { ExerciseListEditor } from "@/components/ExerciseListEditor";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useGymContext } from "@/contexts/GymContext";

const TemplateForm = ({ template }: { template: Template }) => {
  const router = useRouter();
  const { actions } = useGymContext();
  const [name, setName] = useState(template.name);
  const [category, setCategory] = useState<TemplateCategory>(template.category);
  const [exercises, setExercises] = useState<ExerciseItem[]>(template.exercises);

  const handleSave = () => {
    if (!name.trim() || exercises.length === 0) return;
    actions.updateTemplate({
      ...template,
      name: name.trim(),
      category,
      exercises,
    });
    router.back();
  };

  return (
    <MobileShell
      showBack
      backHref="/templates"
      backLabel="Templates"
      title={template.name}
      subtitle={template.category}
    >
      <div className="space-y-4">
        <label className="text-sm font-semibold">Nama</label>
        <input
          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm"
          value={name}
          onChange={(event) => setName(event.target.value)}
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
        </section>
        <PrimaryButton
          onClick={handleSave}
          disabled={!name.trim() || exercises.length === 0}
        >
          Simpan perubahan
        </PrimaryButton>
      </div>
    </MobileShell>
  );
};

export default function TemplateDetailPage() {
  const params = useParams();
  const { templates } = useGymContext();
  const template = templates.find((tpl) => tpl.id === params?.id);

  if (!template) {
      return (
        <MobileShell
          showBack
          backHref="/templates"
          backLabel="Templates"
          title="Template"
          subtitle="Tidak ditemukan"
        >
        <p className="text-sm text-zinc-600">Template ini belum tersedia.</p>
      </MobileShell>
    );
  }

  return <TemplateForm key={template.id} template={template} />;
}
