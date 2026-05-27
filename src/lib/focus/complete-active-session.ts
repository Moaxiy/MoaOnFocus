import {
  clearActiveSession,
  getActiveSession,
  saveRecord,
} from "@/lib/storage/focus-records-storage";
import { calculateDuration } from "@/lib/time/calculate-duration";
import type { FocusRecord, FocusSessionDraft } from "@/types/focus-record";

function buildRecord(session: FocusSessionDraft): FocusRecord {
  const endTime = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    taskName: session.taskName,
    startTime: session.startTime,
    endTime,
    durationMinutes: calculateDuration(session.startTime, endTime),
    createdAt: endTime,
  };
}

export function completeActiveSession(): FocusRecord | null {
  const raw = getActiveSession();
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw) as FocusSessionDraft;
    const record = buildRecord(session);
    saveRecord(record);
    clearActiveSession();
    return record;
  } catch {
    clearActiveSession();
    return null;
  }
}
