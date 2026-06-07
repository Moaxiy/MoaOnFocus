"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  getActiveSessionSnapshot,
  subscribeToActiveSession,
} from "@/lib/storage/focus-records-storage";
import type { FocusSessionDraft } from "@/types/focus-record";

function getServerActiveSessionSnapshot() {
  return "";
}

function parseActiveSession(snapshot: string): FocusSessionDraft | null {
  if (!snapshot) {
    return null;
  }

  try {
    return JSON.parse(snapshot) as FocusSessionDraft;
  } catch {
    return null;
  }
}

export function useActiveSession() {
  const activeSessionSnapshot = useSyncExternalStore(
    subscribeToActiveSession,
    getActiveSessionSnapshot,
    getServerActiveSessionSnapshot,
  );

  return useMemo(() => parseActiveSession(activeSessionSnapshot), [activeSessionSnapshot]);
}
