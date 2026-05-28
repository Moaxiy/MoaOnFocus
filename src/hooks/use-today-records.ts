import { useFocusRecords } from "@/hooks/use-focus-records";

export function useTodayRecords() {
  return useFocusRecords("today");
}
