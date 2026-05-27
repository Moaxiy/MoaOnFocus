import { DEFAULT_FOCUS_PET_APPEARANCE, type FocusPetAppearanceId } from "@/constants/focus-pets";

import { getStore, subscribeToStore, updateStore } from "./records-store";

export function getFocusPetAppearanceId(): FocusPetAppearanceId {
  return getStore().focusPetAppearance ?? DEFAULT_FOCUS_PET_APPEARANCE;
}

export function setFocusPetAppearanceId(value: FocusPetAppearanceId) {
  updateStore((current) => ({
    ...current,
    focusPetAppearance: value,
  }));
}

export function subscribeToFocusPetAppearance(callback: () => void) {
  return subscribeToStore(callback);
}
