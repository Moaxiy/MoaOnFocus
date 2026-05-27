import { SecondaryButton } from "@/components/common/secondary-button";
import { formatTime } from "@/lib/time/format-time";

type TimelineRecordItemProps = {
  id: string;
  taskName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  index: number;
  onDelete?: (recordId: string) => void;
  deleting?: boolean;
};

export function TimelineRecordItem({
  id,
  taskName,
  startTime,
  endTime,
  durationMinutes,
  index,
  onDelete,
  deleting = false,
}: TimelineRecordItemProps) {
  return (
    <article
      className="group relative grid grid-cols-[74px_18px_minmax(0,1fr)] gap-3 rounded-[var(--radius-md)] border border-transparent p-1 transition hover:border-[var(--border)]"
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

      <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[rgba(255,252,245,0.72)] p-4 shadow-[var(--shadow-soft)] transition duration-200 group-hover:-translate-y-[1px] group-hover:bg-[rgba(255,252,245,0.9)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-base leading-6 text-[var(--text)]">{taskName}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[var(--text-soft)]">
              持续 {durationMinutes} 分钟
            </p>
          </div>

          {onDelete ? (
            <SecondaryButton
              aria-label={`删除记录 ${taskName}`}
              className="record-delete-button shrink-0 px-3 py-2 text-xs tracking-[0.14em]"
              disabled={deleting}
              onClick={() => onDelete(id)}
              type="button"
            >
              {deleting ? "删除中" : "删除"}
            </SecondaryButton>
          ) : null}
        </div>
      </div>
    </article>
  );
}
