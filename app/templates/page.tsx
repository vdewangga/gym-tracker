"use client";

import Link from "next/link";
import { MobileShell } from "@/components/MobileShell";
import { TemplateCard } from "@/components/TemplateCard";
import { useGymContext } from "@/contexts/GymContext";

export default function TemplatesPage() {
  const { templates } = useGymContext();

  return (
    <MobileShell title="Templates">
      <section className="space-y-3">
        {templates.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 text-sm text-zinc-600">
            Tambahkan template Upper dan Lower terlebih dahulu.
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <Link key={template.id} href={`/templates/${template.id}`}>
                <TemplateCard template={template} />
              </Link>
            ))}
          </div>
        )}
      </section>
      <Link href="/templates/new" className="mt-4 rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white">
        Buat template baru
      </Link>
    </MobileShell>
  );
}
