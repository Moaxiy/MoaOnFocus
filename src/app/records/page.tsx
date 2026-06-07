"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { BackButton } from "@/components/common/back-button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { DailySummary } from "@/components/today/daily-summary";
import { RecordTimeline } from "@/components/today/record-timeline";
import { useFocusRecords, type RecordsScope } from "@/hooks/use-focus-records";
import { deleteRecord } from "@/lib/storage/focus-records-storage";
import type { FocusRecord } from "@/types/focus-record";

type RecordGroup = {
  key: string;
  title: string;
  eyebrow: string;
  records: FocusRecord[];
};

function getDateKey(value: string) {
  const date = new Date(value);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function getGroupTitle(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date(value));
}

function getGroupEyebrow(value: string, count: number) {
  const targetDate = new Date(value);
  const today = new Date();

  if (isSameDate(targetDate, today)) {
    return `Today · ${count} 条`;
  }

  return `Archive · ${count} 条`;
}

function groupRecordsByDay(records: FocusRecord[]) {
  const groups = new Map<string, FocusRecord[]>();

  for (const record of records) {
    const key = getDateKey(record.startTime);
    const current = groups.get(key) ?? [];
    current.push(record);
    groups.set(key, current);
  }

  return [...groups.entries()]
    .sort(([first], [second]) => second.localeCompare(first))
    .map(([key, groupedRecords]) => ({
      key,
      title: getGroupTitle(groupedRecords[0].startTime),
      eyebrow: getGroupEyebrow(groupedRecords[0].startTime, groupedRecords.length),
      records: groupedRecords,
    })) satisfies RecordGroup[];
}

function getPageCopy(scope: RecordsScope) {
  if (scope === "today") {
    return {
      eyebrow: "Today Only",
      title: "今天的时间轨迹",
      subtitle: "只看今天，适合快速回看这一天已经认真做过的事。",
      summaryLabel: "今天共留下",
      emptyTitle: "今天还没有记录",
      emptyDescription: "先开始一段新的专注，完成后这里就会出现今天的时间轨迹。",
      timelineTitle: "今天",
      cta: "开始新的记录",
    };
  }

  return {
    eyebrow: "Full Archive",
    title: "把全部记录翻出来看",
    subtitle: "现在不只看今天了。你可以沿着日期回看过去留下的每一段专注轨迹。",
    summaryLabel: "全部历史共留下",
    emptyTitle: "还没有任何记录",
    emptyDescription: "先开始第一段专注，之后这里会按日期慢慢长出完整记录。",
    timelineTitle: "全部记录",
    cta: "开始新的记录",
  };
}

export default function RecordsPage() {
  const [scope, setScope] = useState<RecordsScope>("all");
  const { ready, records, stats } = useFocusRecords(scope);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [pendingDeleteRecord, setPendingDeleteRecord] = useState<FocusRecord | null>(null);

  const copy = useMemo(() => getPageCopy(scope), [scope]);
  const groups = useMemo(() => groupRecordsByDay(records), [records]);

  function handleDeleteRecord(recordId: string) {
    const target = records.find((record) => record.id === recordId);
    setPendingDeleteRecord(target ?? null);
  }

  function confirmDeleteRecord() {
    if (!pendingDeleteRecord) {
      return;
    }

    setDeletingRecordId(pendingDeleteRecord.id);
    deleteRecord(pendingDeleteRecord.id);
    setDeletingRecordId(null);
    setPendingDeleteRecord(null);
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="paper-shell mx-auto max-w-5xl p-5 sm:p-8">
        <div className="space-y-8">
          <div className="page-enter space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <BackButton />
              <Link href="/focus/start">
                <PrimaryButton>{copy.cta}</PrimaryButton>
              </Link>
            </div>

            <PageHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
          </div>

          <div className="stagger-1 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[rgba(255,252,245,0.56)] p-3 sm:p-4">
            <div className="inline-flex rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.54)] p-1">
              <button
                className={`rounded-full px-4 py-2 text-sm transition ${
                  scope === "all"
                    ? "bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(30,123,111,0.22)]"
                    : "text-[var(--text-soft)]"
                }`}
                onClick={() => setScope("all")}
                type="button"
              >
                全部记录
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm transition ${
                  scope === "today"
                    ? "bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(30,123,111,0.22)]"
                    : "text-[var(--text-soft)]"
                }`}
                onClick={() => setScope("today")}
                type="button"
              >
                今天
              </button>
            </div>

            <p className="text-sm leading-6 text-[var(--text-soft)]">
              {copy.summaryLabel} <span className="text-[var(--text)]">{records.length}</span>{" "}
              条记录。
            </p>
          </div>

          {ready ? (
            <DailySummary totalMinutes={stats.totalMinutes} sessionCount={stats.sessionCount} />
          ) : (
            <div className="summary-loading stagger-1" aria-label="正在读取记录">
              <span />
              <span />
            </div>
          )}

          {!ready ? null : records.length > 0 ? (
            <div className="space-y-8">
              {groups.map((group, index) => (
                <RecordTimeline
                  key={group.key}
                  deletingRecordId={deletingRecordId}
                  eyebrow={group.eyebrow}
                  onDeleteRecord={handleDeleteRecord}
                  records={group.records}
                  title={scope === "today" && index === 0 ? copy.timelineTitle : group.title}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={copy.emptyTitle}
              description={copy.emptyDescription}
              actionLabel="开始第一条记录"
              href="/focus/start"
            />
          )}
        </div>
      </section>

      {pendingDeleteRecord ? (
        <ConfirmDialog
          danger
          eyebrow="Delete Record"
          title="删除这条记录吗？"
          description={`“${pendingDeleteRecord.taskName}”会从时间轨迹中移除，删除后无法恢复。`}
          confirmLabel="删除记录"
          disabled={deletingRecordId !== null}
          onCancel={() => setPendingDeleteRecord(null)}
          onConfirm={confirmDeleteRecord}
        />
      ) : null}
    </main>
  );
}
