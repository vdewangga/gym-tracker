import { Metadata } from "next";
import Link from "next/link";
import { MobileShell } from "@/components/MobileShell";
import {
  findAlternatives,
  getExerciseBySlug,
  getExerciseSlug,
} from "@/lib/exercises";

interface ExercisePageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: ExercisePageProps): Metadata {
  const entry = getExerciseBySlug(params.slug);
  return {
    title: entry ? `Exercise · ${entry.name}` : "Exercise",
  };
}

export default async function ExerciseDetailPage({ params }: ExercisePageProps) {
  const { slug } = await params;
  const entry = getExerciseBySlug(slug);

  if (!entry) {
    return (
      <MobileShell showBack title="Exercise" subtitle="Tidak ditemukan">
        <p className="text-sm text-zinc-600">Latihan ini tidak tersedia di katalog.</p>
      </MobileShell>
    );
  }

  const alternatives = findAlternatives(entry);

  return (
    <MobileShell showBack title={entry.name} subtitle="Exercise detail">
      <div className="space-y-4">
        <p className="text-sm text-zinc-600">{entry.description}</p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
          {entry.targetMuscles.map((muscle) => (
            <span key={muscle} className="rounded-full border border-zinc-200 px-3 py-1 text-[0.65rem]">
              {muscle}
            </span>
          ))}
        </div>
        <section>
          <p className="text-sm font-semibold">Alternative (alat tidak tersedia)</p>
          {alternatives.length === 0 ? (
            <p className="text-xs text-zinc-500">Tidak ada alternatif yang cocok.</p>
          ) : (
            <div className="space-y-2">
              {alternatives.map((alt) => (
                <Link
                  key={alt.name}
                  href={`/exercises/${getExerciseSlug(alt.name)}`}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm transition hover:border-sky-500"
                >
                  <div>
                    <p className="font-semibold text-zinc-900">{alt.name}</p>
                    <p className="text-xs text-zinc-500">
                      {alt.targetMuscles.join(", ")}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-sky-600">Detail</span>
                </Link>
              ))}
            </div>
          )}
        </section>
        <Link href="/templates" className="text-center text-sm font-semibold text-sky-600">
          Kembali ke templates
        </Link>
      </div>
    </MobileShell>
  );
}
