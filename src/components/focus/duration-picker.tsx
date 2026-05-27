"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

import { FOCUS_DURATION_OPTIONS } from "@/constants/focus-durations";

export type DurationPickerHandle = {
  getNativeDuration: () => number | null;
  syncNativeSelection: () => void;
};

type DurationPickerProps = {
  value: number | null;
  customValue: string;
  customActive: boolean;
  onSelect: (value: number) => void;
  onCustomChange: (value: string) => void;
  onSelectCustom: () => void;
};

function optionClasses(active: boolean) {
  return `rounded-full border px-4 py-3 text-sm transition touch-manipulation select-none ${
    active
      ? "border-[var(--accent-strong)] bg-[var(--accent)] text-[#f8f3e9]"
      : "border-[var(--border)] bg-[rgba(255,252,246,0.72)] text-[var(--text-soft)] active:border-[var(--accent)] active:bg-[var(--accent-soft)]"
  }`;
}

export const DurationPicker = forwardRef<DurationPickerHandle, DurationPickerProps>(
  function DurationPicker(
    { value, customValue, customActive, onSelect, onCustomChange, onSelectCustom },
    ref,
  ) {
    const nativeSelectRef = useRef<HTMLSelectElement>(null);
    const selectedLabel = customActive
      ? customValue
        ? `已选择 ${customValue} 分钟`
        : "请输入自定义分钟数"
      : value
        ? `已选择 ${value} 分钟`
        : "请选择一个专注时长";

    function handleNativeSelect(nextValue: string) {
      if (nextValue === "custom") {
        onSelectCustom();
        return;
      }

      const parsed = Number(nextValue);
      if (parsed > 0) {
        onSelect(parsed);
      }
    }

    function syncNativeSelection() {
      const nextValue = nativeSelectRef.current?.value;
      if (nextValue) {
        handleNativeSelect(nextValue);
      }
    }

    function getNativeDuration() {
      const nextValue = nativeSelectRef.current?.value;
      const parsed = Number(nextValue);
      return parsed > 0 ? parsed : null;
    }

    useImperativeHandle(ref, () => ({ getNativeDuration, syncNativeSelection }));

    return (
      <div className="space-y-4">
        <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[var(--text-soft)]">
          专注多久
        </p>

        <div className="hidden grid-cols-2 gap-3 sm:grid sm:grid-cols-5">
          {FOCUS_DURATION_OPTIONS.map((option) => {
            const active = option === value && !customActive;

            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(option)}
                className={optionClasses(active)}
              >
                {option} 分钟
              </button>
            );
          })}

          <button
            type="button"
            aria-pressed={customActive}
            onClick={onSelectCustom}
            className={optionClasses(customActive)}
          >
            自定义
          </button>
        </div>

        <label className="block space-y-2 sm:hidden">
          <span className="text-sm text-[var(--text-soft)]">选择专注时长</span>
          <select
            ref={nativeSelectRef}
            defaultValue=""
            onChange={(event) => handleNativeSelect(event.target.value)}
            onInput={(event) => handleNativeSelect(event.currentTarget.value)}
            onBlur={(event) => handleNativeSelect(event.currentTarget.value)}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[rgba(255,252,246,0.9)] px-5 py-4 text-base text-[var(--text)] outline-none"
          >
            <option value="">选择专注时长</option>
            {FOCUS_DURATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} 分钟
              </option>
            ))}
            <option value="custom">自定义</option>
          </select>
          <button
            type="button"
            onClick={syncNativeSelection}
            className="w-full rounded-full border border-[var(--accent-strong)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-strong)]"
          >
            确认这个时长
          </button>
        </label>

        <p className="text-sm text-[var(--accent-strong)]">{selectedLabel}</p>

        {customActive ? (
          <label className="block space-y-2">
            <span className="text-sm text-[var(--text-soft)]">自定义时长</span>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={customValue}
              onChange={(event) => onCustomChange(event.target.value)}
              placeholder="输入分钟数"
              className="w-full rounded-[var(--radius-md)] border border-[var(--accent-strong)] bg-[rgba(255,252,246,0.86)] px-5 py-4 text-base text-[var(--text)] outline-none transition placeholder:text-[rgba(111,90,66,0.6)] focus:shadow-[0_0_0_4px_rgba(30,123,111,0.08)]"
            />
          </label>
        ) : null}
      </div>
    );
  },
);
