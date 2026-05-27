"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  getRecordsSnapshot,
  subscribeToRecords,
} from "@/lib/storage/focus-records-storage";
import { getTodayRecords } from "@/lib/time/get-today-records";
import type { DailySummaryStats } from "@/types/daily-summary-stats";
import type { FocusRecord } from "@/types/focus-record";

function getServerRecordsSnapshot() {
  return "";
}

function parseRecordsSnapshot(snapshot: string): FocusRecord[] {
  if (!snapshot) {
    return [];
  }

  try {
    const parsed = JSON.parse(snapshot) as FocusRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useTodayRecords() {
  const recordsSnapshot = useSyncExternalStore(
    subscribeToRecords,
    getRecordsSnapshot,
    getServerRecordsSnapshot,
  );
  const records = useMemo(
    () => getTodayRecords(parseRecordsSnapshot(recordsSnapshot)),
    [recordsSnapshot],
  );

  const stats: DailySummaryStats = useMemo(() => {
    const totalMinutes = records.reduce((sum, record) => sum + record.durationMinutes, 0);
    return {
      totalMinutes,
      sessionCount: records.length,
    };
  }, [records]);

  return {
    records,
    stats,
  };
}
