"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MobileShell } from "@/components/MobileShell";
import { useGymContext } from "@/contexts/GymContext";

export default function HistoryDetailPage() {
  const params = useParams();
  const { sessions, templates, plans } = useGymContext();
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

  return (
    <MobileShell tabs title={template?.name ?? "Workout"} subtitle={session.date}>
      <div className="space-y-3">
        {plan && (
          <p className="text-sm text-zinc-500">Plan: {plan.name}</p>
        )}
        {session.items.map((item) => (
          <div key={item.exerciseId} className="space-y-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{item.name}</p>
              <span className="text-xs font-semibold text-emerald-600">
                {item.done ? "Selesai" : "Skip"}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-zinc-400">
              {item.weight !== undefined && <span>{item.weight} kg</span>}
              {item.sets !== undefined && <span>{item.sets} set</span>}
              {item.reps !== undefined && <span>{item.reps} reps</span>}
            </div>
            {item.note && <p className="text-sm text-zinc-600">Notes: {item.note}</p>}
          </div>
        ))}
        <Link href="/history" className="text-center text-sm font-semibold text-sky-600">
          Kembali ke history
        </Link>
      </div>
    </MobileShell>
  );
}
