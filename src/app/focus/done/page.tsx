"use client";

import Link from "next/link";
import { useMemo } from "react";

import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { SecondaryButton } from "@/components/common/secondary-button";
import { SessionInfoCard } from "@/components/focus/session-info-card";
import { useLastRecord } from "@/hooks/use-last-record";
import { doneCopySets, getDailyCopyIndex } from "@/lib/copy";

export default function FocusDonePage() {
  const record = useLastRecord();
  const copy = useMemo(() => doneCopySets[getDailyCopyIndex(doneCopySets.length, 23)], []);

  if (!record) {
    return null;
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="paper-shell mx-auto max-w-3xl p-5 sm:p-8">
        <div className="space-y-8">
          <div className="page-enter">
            <PageHeader eyebrow="Saved Into Today" title={copy.title} subtitle={copy.subtitle} />
          </div>

          <div className="stagger-1">
            <SessionInfoCard
              taskName={record.taskName}
              startTime={record.startTime}
              endTime={record.endTime}
              durationMinutes={record.durationMinutes}
            />
          </div>

          <div className="stagger-2 flex flex-col gap-3 sm:flex-row">
            <Link className="flex-1" href="/records">
              <PrimaryButton className="w-full">{copy.viewLabel}</PrimaryButton>
            </Link>
            <Link className="flex-1" href="/focus/start">
              <SecondaryButton className="w-full">{copy.restartLabel}</SecondaryButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
