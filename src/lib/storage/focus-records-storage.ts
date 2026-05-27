import type { FocusRecord, FocusSessionDraft } from "@/types/focus-record";

import { getStore, subscribeToStore, updateStore } from "./records-store";

export function getAllRecords(): FocusRecord[] {
  return getStore().records;
}

export function getRecordsSnapshot() {
  return JSON.stringify(getStore().records);
}

export function saveRecord(record: FocusRecord) {
  updateStore((current) => ({
    ...current,
    records: [...current.records, record],
    lastRecord: record,
  }));
}

export function deleteRecord(recordId: string) {
  updateStore((current) => {
    const records = current.records.filter((record) => record.id !== recordId);

    return {
      ...current,
      records,
      lastRecord: records.at(-1) ?? null,
    };
  });
}

export function subscribeToRecords(callback: () => void) {
  return subscribeToStore(callback);
}

export function setActiveSession(value: string | null) {
  const activeSession = value ? parseSession(value) : null;

  updateStore((current) => ({
    ...current,
    activeSession,
  }));
}

export function getActiveSession() {
  const { activeSession } = getStore();
  return activeSession ? JSON.stringify(activeSession) : null;
}

export function getActiveSessionSnapshot() {
  return getActiveSession() ?? "";
}

export function subscribeToActiveSession(callback: () => void) {
  return subscribeToStore(callback);
}

export function clearActiveSession() {
  setActiveSession(null);
}

export function getLastRecord(): FocusRecord | null {
  return getStore().lastRecord;
}

export function getLastRecordSnapshot() {
  const lastRecord = getStore().lastRecord;
  return lastRecord ? JSON.stringify(lastRecord) : "";
}

function parseSession(value: string): FocusSessionDraft | null {
  try {
    const parsed = JSON.parse(value) as FocusSessionDraft;

    if (
      typeof parsed.taskName === "string" &&
      typeof parsed.durationMinutes === "number" &&
      typeof parsed.startTime === "string"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}
