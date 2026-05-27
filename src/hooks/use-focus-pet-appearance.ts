"use client";

import { useSyncExternalStore } from "react";

import { DEFAULT_FOCUS_PET_APPEARANCE } from "@/constants/focus-pets";
import {
  getFocusPetAppearanceId,
  subscribeToFocusPetAppearance,
} from "@/lib/storage/focus-pet-storage";

export function useFocusPetAppearance() {
  return useSyncExternalStore(
    subscribeToFocusPetAppearance,
    getFocusPetAppearanceId,
    () => DEFAULT_FOCUS_PET_APPEARANCE,
  );
}
