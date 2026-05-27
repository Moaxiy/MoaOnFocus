import type { FocusRecord } from "@/types/focus-record";

import { TimelineRecordItem } from "@/components/today/timeline-record-item";

type RecordTimelineProps = {
  records: FocusRecord[];
  title?: string;
  eyebrow?: string;
};

export function RecordTimeline({
  records,
  title = "今天做了哪些事",
  eyebrow = "Time Trace",
}: RecordTimelineProps) {
  return (
    <section className="space-y-4 stagger-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h2>
        <span className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--text-soft)]">
          {eyebrow}
        </span>
      </div>
      <div className="space-y-3">
        {records.map((record, index) => (
          <TimelineRecordItem key={record.id} index={index} {...record} />
        ))}
      </div>
    </section>
  );
}
