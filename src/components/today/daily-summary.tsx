import { formatDuration } from "@/lib/time/format-duration";

type DailySummaryProps = {
  totalMinutes: number;
  sessionCount: number;
};

export function DailySummary({ totalMinutes, sessionCount }: DailySummaryProps) {
  return (
    <section className="grid grid-cols-2 gap-3 stagger-1">
      <article className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
        <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[var(--text-soft)]">
          累计专注
        </p>
        <p className="mt-3 text-xl text-[var(--text)] sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          {formatDuration(totalMinutes)}
        </p>
      </article>
      <article className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
        <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[var(--text-soft)]">
          专注次数
        </p>
        <p className="mt-3 text-xl text-[var(--text)] sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          {sessionCount} 次
        </p>
      </article>
    </section>
  );
}
