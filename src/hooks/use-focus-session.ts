"use client";

import { useEffect, useState } from "react";

import type { FocusSessionDraft } from "@/types/focus-record";

function getRemainingSeconds(session: FocusSessionDraft | null) {
  if (!session) {
    return 0;
  }

  const startedAt = new Date(session.startTime).getTime();
  const endsAt = startedAt + session.durationMinutes * 60 * 1000;
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
}

export function useFocusSession(session: FocusSessionDraft | null) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!session) {
      return;
    }

    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [session]);

  return {
    remainingSeconds: getRemainingSeconds(session),
  };
}
