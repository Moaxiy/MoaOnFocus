"use client";

import { FOCUS_PET_APPEARANCES, type FocusPetAppearanceId } from "@/constants/focus-pets";

type PetAppearancePickerProps = {
  value: FocusPetAppearanceId;
  onChange: (value: FocusPetAppearanceId) => void;
};

export function PetAppearancePicker({ value, onChange }: PetAppearancePickerProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[var(--text-soft)]">
          桌宠形象
        </p>
        <p className="text-sm leading-6 text-[var(--text-soft)]">
          选一个陪你守住这段时间的小同伴，悬浮倒计时会同步换成它的样子。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {FOCUS_PET_APPEARANCES.map((appearance) => {
          const active = appearance.id === value;

          return (
            <button
              key={appearance.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(appearance.id)}
              className={`pet-choice pet-choice-${appearance.id} ${
                active ? "pet-choice-active" : ""
              }`}
            >
              <span className="pet-choice-avatar" aria-hidden="true">
                <span className="pet-choice-eye left" />
                <span className="pet-choice-eye right" />
              </span>
              <span className="pet-choice-copy">
                <span className="pet-choice-name">{appearance.name}</span>
                <span className="pet-choice-tone">{appearance.tone}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
