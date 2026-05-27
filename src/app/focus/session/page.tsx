"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";

import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { SecondaryButton } from "@/components/common/secondary-button";
import { FocusTimer } from "@/components/focus/focus-timer";
import { SessionInfoCard } from "@/components/focus/session-info-card";
import { useFocusSession } from "@/hooks/use-focus-session";
import { getDailyCopyIndex, sessionCopySets } from "@/lib/copy";
import { hideFocusPet, showFocusPet } from "@/lib/desktop/focus-pet-window";
import { completeActiveSession } from "@/lib/focus/complete-active-session";
import {
  clearActiveSession,
  getActiveSessionSnapshot,
  subscribeToActiveSession,
} from "@/lib/storage/focus-records-storage";
import { getRecordsStoreReadySnapshot } from "@/lib/storage/records-store";
import type { FocusSessionDraft } from "@/types/focus-record";

function getServerActiveSessionSnapshot() {
  return "";
}

function getServerStoreReadySnapshot() {
  return "loading";
}

function parseSessionSnapshot(snapshot: string) {
  if (!snapshot) {
    return null;
  }

  try {
    return JSON.parse(snapshot) as FocusSessionDraft;
  } catch {
    clearActiveSession();
    return null;
  }
}

export default function FocusSessionPage() {
  const router = useRouter();
  const leavingRef = useRef<"done" | "home" | null>(null);
  const hadSessionRef = useRef(false);
  const copy = useMemo(
    () => sessionCopySets[getDailyCopyIndex(sessionCopySets.length, 19)],
    [],
  );
  const storeReadySnapshot = useSyncExternalStore(
    subscribeToActiveSession,
    getRecordsStoreReadySnapshot,
    getServerStoreReadySnapshot,
  );
  const activeSessionSnapshot = useSyncExternalStore(
    subscribeToActiveSession,
    getActiveSessionSnapshot,
    getServerActiveSessionSnapshot,
  );
  const session = useMemo(
    () => parseSessionSnapshot(activeSessionSnapshot),
    [activeSessionSnapshot],
  );
  const { remainingSeconds } = useFocusSession(session);

  useEffect(() => {
    if (storeReadySnapshot !== "ready") {
      return;
    }

    if (!session) {
      if (leavingRef.current) {
        return;
      }

      hideFocusPet();
      router.replace(hadSessionRef.current ? "/focus/done" : "/focus/start");
      return;
    }

    hadSessionRef.current = true;
    showFocusPet();
  }, [router, session, storeReadySnapshot]);

  useEffect(() => {
    if (storeReadySnapshot !== "ready" || !session || remainingSeconds !== 0) {
      return;
    }

    leavingRef.current = "done";
    completeActiveSession();
    hideFocusPet();
    router.replace("/focus/done");
  }, [remainingSeconds, router, session, storeReadySnapshot]);

  function handleCancel() {
    leavingRef.current = "home";
    clearActiveSession();
    hideFocusPet();
    router.push("/");
  }

  function handleFinish() {
    if (!session) {
      return;
    }

    leavingRef.current = "done";
    completeActiveSession();
    hideFocusPet();
    router.push("/focus/done");
  }

  if (storeReadySnapshot !== "ready" || !session) {
    return null;
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="paper-shell mx-auto max-w-3xl p-5 sm:p-8">
        <div className="space-y-8">
          <div className="page-enter">
            <PageHeader eyebrow="Stay With It" title={copy.title} subtitle={copy.subtitle} />
          </div>

          <div className="stagger-1">
            <SessionInfoCard taskName={session.taskName} startTime={session.startTime} />
          </div>

          <div className="stagger-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[rgba(255,252,245,0.52)] px-5 py-10">
            <FocusTimer remainingSeconds={remainingSeconds} />
          </div>

          <div className="stagger-3 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton className="flex-1" onClick={handleFinish}>
              {copy.finishLabel}
            </PrimaryButton>
            <SecondaryButton className="flex-1" onClick={handleCancel}>
              {copy.cancelLabel}
            </SecondaryButton>
          </div>
        </div>
      </section>
    </main>
  );
}
