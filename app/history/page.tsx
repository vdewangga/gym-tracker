"use client";

import Link from "next/link";
import { MobileShell } from "@/components/MobileShell";
import { useGymContext } from "@/contexts/GymContext";

export default function HistoryPage() {
  const { sessions, templates } = useGymContext();
  const sortedSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <MobileShell title="History">
      <div className="space-y-3">
        {sortedSessions.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 text-sm text-zinc-600">
            Belum ada sesi workout. Selesaikan workout untuk mengisi history.
          </div>
        )}
        {sortedSessions.map((session) => {
          const template = templates.find((tpl) => tpl.id === session.templateId);
          return (
            <Link key={session.id} href={`/history/${session.id}`}>
              <div className="space-y-1 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm text-zinc-600">{session.date}</p>
                <h3 className="text-lg font-semibold">{template?.name ?? "-"}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Status: {session.status === "done" ? "Selesai" : "Berlangsung"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </MobileShell>
  );
}
