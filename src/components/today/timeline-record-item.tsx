import { formatTime } from "@/lib/time/format-time";

type TimelineRecordItemProps = {
  taskName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  index: number;
};

export function TimelineRecordItem({
  taskName,
  startTime,
  endTime,
  durationMinutes,
  index,
}: TimelineRecordItemProps) {
  return (
    <article
      className="relative grid grid-cols-[74px_18px_minmax(0,1fr)] gap-3 rounded-[var(--radius-md)] border border-transparent p-1 transition hover:border-[var(--border)]"
      style={{ animationDelay: `${0.08 * (index + 1)}s` }}
    >
      <div className="pt-1 text-right text-xs leading-5 text-[var(--text-soft)] sm:text-sm">
        <p>{formatTime(startTime)}</p>
        <p>{formatTime(endTime)}</p>
      </div>
      <div className="relative flex justify-center">
        <span className="absolute top-0 bottom-0 w-px bg-[linear-gradient(180deg,rgba(30,123,111,0.45),rgba(207,123,62,0.16))]" />
        <span className="relative mt-2 h-3 w-3 rounded-full border border-[var(--accent-strong)] bg-[var(--background)] shadow-[0_0_0_5px_rgba(30,123,111,0.08)]" />
      </div>
      <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[rgba(255,252,245,0.6)] p-4 shadow-[var(--shadow-soft)]">
        <p className="text-base leading-6 text-[var(--text)]">{taskName}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[var(--text-soft)]">
          持续 {durationMinutes} 分钟
        </p>
      </div>
    </article>
  );
}
