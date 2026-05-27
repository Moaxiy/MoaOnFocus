"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { BackButton } from "@/components/common/back-button";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { DailySummary } from "@/components/today/daily-summary";
import { RecordTimeline } from "@/components/today/record-timeline";
import { useTodayRecords } from "@/hooks/use-today-records";
import { getDailyCopyIndex, recordsCopySets } from "@/lib/copy";
import { deleteRecord } from "@/lib/storage/focus-records-storage";
import { formatDate } from "@/lib/time/format-date";

export default function RecordsPage() {
  const { records, stats } = useTodayRecords();
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const copy = useMemo(
    () => recordsCopySets[getDailyCopyIndex(recordsCopySets.length, 13)],
    [],
  );

  function handleDeleteRecord(recordId: string) {
    const target = records.find((record) => record.id === recordId);
    const taskLabel = target?.taskName ?? "这条记录";
    const confirmed = window.confirm(`确定删除“${taskLabel}”吗？删除后无法恢复。`);

    if (!confirmed) {
      return;
    }

    setDeletingRecordId(recordId);
    deleteRecord(recordId);
    setDeletingRecordId(null);
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

            <PageHeader
              eyebrow={formatDate(new Date())}
              title={copy.title}
              subtitle={copy.subtitle}
            />
          </div>

          <DailySummary totalMinutes={stats.totalMinutes} sessionCount={stats.sessionCount} />

          {records.length > 0 ? (
            <RecordTimeline
              deletingRecordId={deletingRecordId}
              eyebrow="Full Trace"
              onDeleteRecord={handleDeleteRecord}
              records={records}
              title={copy.timelineTitle}
            />
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
    </main>
  );
}
