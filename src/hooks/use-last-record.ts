"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  getLastRecordSnapshot,
  subscribeToRecords,
} from "@/lib/storage/focus-records-storage";
import type { FocusRecord } from "@/types/focus-record";

function getServerLastRecordSnapshot() {
  return "";
}

function parseLastRecordSnapshot(snapshot: string): FocusRecord | null {
  if (!snapshot) {
    return null;
  }

  try {
    return JSON.parse(snapshot) as FocusRecord;
  } catch {
    return null;
  }
}

export function useLastRecord() {
  const snapshot = useSyncExternalStore(
    subscribeToRecords,
    getLastRecordSnapshot,
    getServerLastRecordSnapshot,
  );

  return useMemo(() => parseLastRecordSnapshot(snapshot), [snapshot]);
}
