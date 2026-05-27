import { formatTime } from "@/lib/time/format-time";

type SessionInfoCardProps = {
  taskName: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
};

export function SessionInfoCard({
  taskName,
  startTime,
  endTime,
  durationMinutes,
}: SessionInfoCardProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[rgba(255,252,245,0.64)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[var(--text-soft)]">
        当前任务
      </p>
      <p className="mt-3 text-2xl text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
        {taskName}
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--text-soft)]">
        <span>开始于 {formatTime(startTime)}</span>
        {endTime ? <span>结束于 {formatTime(endTime)}</span> : null}
        {durationMinutes ? <span>共 {durationMinutes} 分钟</span> : null}
      </div>
    </div>
  );
}
