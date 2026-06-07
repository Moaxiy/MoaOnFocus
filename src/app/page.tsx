"use client";

import Link from "next/link";
import { useMemo } from "react";

import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { SecondaryButton } from "@/components/common/secondary-button";
import { DailySummary } from "@/components/today/daily-summary";
import { useActiveSession } from "@/hooks/use-active-session";
import { useTodayRecords } from "@/hooks/use-today-records";
import { useRecordsStoreReady } from "@/hooks/use-records-store-ready";
import { getDailyCopyIndex, homeCopySets } from "@/lib/copy";
import { formatDate } from "@/lib/time/format-date";

export default function HomePage() {
  const { stats } = useTodayRecords();
  const activeSession = useActiveSession();
  const storeReady = useRecordsStoreReady();
  const copy = useMemo(() => homeCopySets[getDailyCopyIndex(homeCopySets.length)], []);
  const isStoreReady = storeReady === "ready";
  const hasActiveSession = isStoreReady && activeSession !== null;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="paper-shell mx-auto max-w-5xl p-5 sm:p-8">
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_340px]">
            <div className="page-enter space-y-6">
              <div>
                <p className="mb-4 text-[0.72rem] uppercase tracking-[0.28em] text-[var(--sun)]">
                  Today Trajectory
                </p>
                <PageHeader
                  eyebrow={formatDate(new Date())}
                  title={copy.heroTitle}
                  subtitle={copy.heroSubtitle}
                />
              </div>

              {isStoreReady ? (
                <DailySummary totalMinutes={stats.totalMinutes} sessionCount={stats.sessionCount} />
              ) : (
                <div className="summary-loading stagger-1" aria-label="正在读取今日记录">
                  <span />
                  <span />
                </div>
              )}

              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[rgba(255,252,245,0.56)] p-5 shadow-[var(--shadow-soft)]">
                <div className="space-y-5">
                  <div className="space-y-2 text-center sm:text-left">
                    <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[var(--text-soft)]">
                      {hasActiveSession ? "Current Focus" : "Primary Actions"}
                    </p>
                    <h2
                      className="text-2xl text-[var(--text)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {hasActiveSession ? "继续这一段专注" : copy.actionTitle}
                    </h2>
                    <p className="text-sm leading-6 text-[var(--text-soft)]">
                      {hasActiveSession
                        ? `正在进行：${activeSession.taskName}。回到倒计时，不必重新开始。`
                        : copy.actionDescription}
                    </p>
                  </div>

                  <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
                    {isStoreReady ? (
                      <Link
                        className="sm:flex-1"
                        href={hasActiveSession ? "/focus/session" : "/focus/start"}
                      >
                        <PrimaryButton className="w-full px-6 py-4 text-base">
                          {hasActiveSession ? "继续当前专注" : "开始记录这段时间"}
                        </PrimaryButton>
                      </Link>
                    ) : (
                      <PrimaryButton className="w-full px-6 py-4 text-base sm:flex-1" disabled>
                        正在读取记录...
                      </PrimaryButton>
                    )}
                    <Link className="sm:flex-1" href="/records">
                      <SecondaryButton className="w-full border-[var(--border)] bg-[rgba(255,255,255,0.46)] px-6 py-4 text-base text-[var(--text)]">
                        查看全部记录
                      </SecondaryButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <aside className="stagger-1 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[rgba(255,252,245,0.56)] p-5 shadow-[var(--shadow-soft)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h2
                    className="text-xl text-[var(--text)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {copy.sideTitle}
                  </h2>
                  <span className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--text-soft)]">
                    Home Logic
                  </span>
                </div>
                <p
                  className="text-lg leading-8 text-[var(--text)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {copy.sideQuote}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
