"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { BackButton } from "@/components/common/back-button";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { DurationPicker, type DurationPickerHandle } from "@/components/focus/duration-picker";
import { PetAppearancePicker } from "@/components/focus/pet-appearance-picker";
import { TaskInput } from "@/components/focus/task-input";
import { useFocusPetAppearance } from "@/hooks/use-focus-pet-appearance";
import { getDailyCopyIndex, startCopySets } from "@/lib/copy";
import { showFocusPet } from "@/lib/desktop/focus-pet-window";
import { setFocusPetAppearanceId } from "@/lib/storage/focus-pet-storage";
import { setActiveSession } from "@/lib/storage/focus-records-storage";

export default function StartFocusPage() {
  const router = useRouter();
  const durationPickerRef = useRef<DurationPickerHandle>(null);
  const [taskName, setTaskName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState("");
  const [customActive, setCustomActive] = useState(false);
  const [starting, setStarting] = useState(false);
  const selectedPetAppearance = useFocusPetAppearance();
  const copy = useMemo(
    () => startCopySets[getDailyCopyIndex(startCopySets.length, 7)],
    [],
  );

  const hasTaskName = taskName.trim().length > 0;
  const canSubmit =
    hasTaskName &&
    durationMinutes !== null &&
    (!customActive || customMinutes.trim().length > 0);

  function handleCustomChange(value: string) {
    const onlyDigits = value.replace(/[^\d]/g, "");
    setCustomMinutes(onlyDigits);

    if (!customActive) {
      setCustomActive(true);
    }

    if (onlyDigits) {
      const parsed = Number(onlyDigits);
      setDurationMinutes(parsed > 0 ? parsed : null);
      return;
    }

    setDurationMinutes(null);
  }

  function handleSelectCustom() {
    setCustomActive(true);
    setCustomMinutes("");
    setDurationMinutes(null);
  }

  function handleSelectDuration(value: number) {
    setCustomActive(false);
    setCustomMinutes("");
    setDurationMinutes(value);
  }

  async function handleStart() {
    const fallbackDuration = durationPickerRef.current?.getNativeDuration() ?? null;
    const finalDuration = durationMinutes ?? fallbackDuration;

    if (
      starting ||
      !hasTaskName ||
      finalDuration === null ||
      (customActive && !customMinutes.trim())
    ) {
      return;
    }

    const payload = {
      taskName: taskName.trim(),
      durationMinutes: finalDuration,
      startTime: new Date().toISOString(),
    };

    setStarting(true);
    setActiveSession(JSON.stringify(payload));
    await showFocusPet();
    router.push("/focus/session");
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="paper-shell mx-auto max-w-3xl p-5 sm:p-8">
        <div className="space-y-8">
          <div className="page-enter space-y-5">
            <BackButton />
            <PageHeader eyebrow="Begin Quietly" title={copy.title} subtitle={copy.subtitle} />
          </div>

          <div className="stagger-1 space-y-6">
            <TaskInput value={taskName} onChange={setTaskName} />
            <DurationPicker
              ref={durationPickerRef}
              value={durationMinutes}
              customValue={customMinutes}
              customActive={customActive}
              onSelect={handleSelectDuration}
              onCustomChange={handleCustomChange}
              onSelectCustom={handleSelectCustom}
            />
            <PetAppearancePicker
              value={selectedPetAppearance}
              onChange={setFocusPetAppearanceId}
            />
          </div>

          <div className="stagger-2 space-y-3">
            <PrimaryButton
              className="w-full sm:w-auto"
              disabled={starting || !hasTaskName || (customActive && !customMinutes.trim())}
              onClick={handleStart}
            >
              {starting ? "正在唤起桌宠..." : "开始记录这段时间"}
            </PrimaryButton>
            {!canSubmit && hasTaskName ? (
              <p className="text-sm leading-6 text-[var(--text-soft)]">
                如果手机下拉框已经选好时长，可以直接点“开始记录这段时间”，我会自动读取当前选择。
              </p>
            ) : (
              <p className="text-sm leading-6 text-[var(--text-soft)]">{copy.helper}</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
