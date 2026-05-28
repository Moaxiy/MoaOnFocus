"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  getRecordsSnapshot,
  subscribeToRecords,
} from "@/lib/storage/focus-records-storage";
import { getTodayRecords } from "@/lib/time/get-today-records";
import type { DailySummaryStats } from "@/types/daily-summary-stats";
import type { FocusRecord } from "@/types/focus-record";

export type RecordsScope = "all" | "today";

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

function sortRecordsByStartTime(records: FocusRecord[]) {
  return [...records].sort(
    (first, second) =>
      new Date(first.startTime).getTime() - new Date(second.startTime).getTime(),
  );
}

export function useFocusRecords(scope: RecordsScope = "all") {
  const recordsSnapshot = useSyncExternalStore(
    subscribeToRecords,
    getRecordsSnapshot,
    getServerRecordsSnapshot,
  );

  const parsedRecords = useMemo(
    () => sortRecordsByStartTime(parseRecordsSnapshot(recordsSnapshot)),
    [recordsSnapshot],
  );

  const records = useMemo(() => {
    if (scope === "today") {
      return getTodayRecords(parsedRecords);
    }

    return parsedRecords;
  }, [parsedRecords, scope]);

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
