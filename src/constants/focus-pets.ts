export const FOCUS_PET_APPEARANCES = [
  {
    id: "moss",
    name: "苔光球",
    tone: "安静、柔软、像书桌边的一小片绿意",
  },
  {
    id: "ember",
    name: "余烬球",
    tone: "温热、坚定、适合需要一点推动力的时候",
  },
  {
    id: "moon",
    name: "月白球",
    tone: "清冷、克制、像夜里陪你留灯的同伴",
  },
  {
    id: "ink",
    name: "墨点球",
    tone: "沉静、专注、像把杂念慢慢收进纸面",
  },
] as const;

export type FocusPetAppearanceId = (typeof FOCUS_PET_APPEARANCES)[number]["id"];

export const DEFAULT_FOCUS_PET_APPEARANCE: FocusPetAppearanceId = "moss";

export function isFocusPetAppearanceId(value: string): value is FocusPetAppearanceId {
  return FOCUS_PET_APPEARANCES.some((appearance) => appearance.id === value);
}

export function getFocusPetAppearance(id: FocusPetAppearanceId) {
  return FOCUS_PET_APPEARANCES.find((appearance) => appearance.id === id) ?? FOCUS_PET_APPEARANCES[0];
}
