"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

import { useFocusPetAppearance } from "@/hooks/use-focus-pet-appearance";
import { hideFocusPet } from "@/lib/desktop/focus-pet-window";
import { completeActiveSession } from "@/lib/focus/complete-active-session";
import { getActiveSession } from "@/lib/storage/focus-records-storage";
import type { FocusSessionDraft } from "@/types/focus-record";

type PetState = {
  remainingSeconds: number;
  taskName: string;
};

const LONG_PRESS_MS = 1000;
const DRAG_THRESHOLD_PX = 8;

function readPetState(): PetState | null {
  const raw = getActiveSession();
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw) as FocusSessionDraft;
    const startedAt = new Date(session.startTime).getTime();
    const endsAt = startedAt + session.durationMinutes * 60 * 1000;
    const remainingSeconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

    return {
      remainingSeconds,
      taskName: session.taskName,
    };
  } catch {
    return null;
  }
}

function formatRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function FocusPetPage() {
  const [petState, setPetState] = useState<PetState | null>(() => readPetState());
  const [holdingToFinish, setHoldingToFinish] = useState(false);
  const petAppearance = useFocusPetAppearance();
  const finishingRef = useRef(false);
  const longPressTimerRef = useRef<number | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  function clearLongPress() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    setHoldingToFinish(false);
  }

  async function handleStartDragging() {
    clearLongPress();

    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().startDragging();
    } catch (error) {
      console.warn("Unable to drag focus pet window.", error);
    }
  }

  async function finishFromPet() {
    if (finishingRef.current) {
      return;
    }

    finishingRef.current = true;
    clearLongPress();
    const record = completeActiveSession();

    if (record) {
      await hideFocusPet();
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (!petState) {
      return;
    }

    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    setHoldingToFinish(true);
    longPressTimerRef.current = window.setTimeout(() => {
      finishFromPet();
    }, LONG_PRESS_MS);
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const start = pointerStartRef.current;
    if (!start) {
      return;
    }

    const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (moved >= DRAG_THRESHOLD_PX) {
      pointerStartRef.current = null;
      handleStartDragging();
    }
  }

  function handlePointerEnd() {
    pointerStartRef.current = null;
    clearLongPress();
  }

  useEffect(() => {
    document.documentElement.classList.add("pet-window");
    document.body.classList.add("pet-window");

    const timer = window.setInterval(() => {
      setPetState(readPetState());
    }, 1000);

    return () => {
      clearLongPress();
      window.clearInterval(timer);
      document.documentElement.classList.remove("pet-window");
      document.body.classList.remove("pet-window");
    };
  }, []);

  const remainingSeconds = petState?.remainingSeconds ?? 0;
  const progressTone = remainingSeconds <= 60 ? "ending" : "steady";

  return (
    <main className="pet-stage">
      <section
        className={`focus-pet focus-pet-${petAppearance} ${progressTone} ${
          holdingToFinish ? "holding-to-finish" : ""
        }`}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerEnd}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
      >
        <div className="pet-orbit" />
        <span className="pet-ear left" />
        <span className="pet-ear right" />
        <span className="pet-mark" />
        <div className="pet-face">
          <span className="pet-eye left" />
          <span className="pet-eye right" />
          <span className="pet-mouth" />
        </div>
        <div className="pet-content">
          <p className="pet-label">
            {holdingToFinish ? "松手取消" : petState ? "长按完成" : "等待开始"}
          </p>
          <p className="pet-time">{formatRemaining(remainingSeconds)}</p>
          <p className="pet-task">{petState?.taskName ?? "今日轨迹"}</p>
        </div>
      </section>
    </main>
  );
}
