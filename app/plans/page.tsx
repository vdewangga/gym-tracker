"use client";

import Link from "next/link";
import { MobileShell } from "@/components/MobileShell";
import { useGymContext } from "@/contexts/GymContext";

export default function PlansPage() {
  const { plans, actions } = useGymContext();

  return (
    <MobileShell title="Plans">
      <div className="space-y-3">
        {plans.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 text-sm text-zinc-600">
            Buat plan latihan untuk mengisi jadwal mingguan.
          </div>
        )}
        {plans.map((plan) => (
          <div key={plan.id} className="space-y-2 rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  {plan.daysPerWeek} hari/minggu
                </p>
              </div>
              <Link href={`/plans/${plan.id}`} className="text-sm font-semibold text-slate-600">
                Detail
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">
                {plan.isActive ? "Aktif" : "Non aktif"}
              </span>
              {plan.isActive ? null : (
                <button
                  onClick={() => actions.setActivePlan(plan.id)}
                  className="rounded-full border border-sky-600 px-3 py-1 text-xs font-semibold text-sky-600"
                  type="button"
                >
                  Set active
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link href="/plans/new" className="mt-4 rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white">
        Buat plan baru
      </Link>
    </MobileShell>
  );
}
