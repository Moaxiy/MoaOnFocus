import type { FocusRecord } from "@/types/focus-record";

export function getTodayRecords(records: FocusRecord[]) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  return records
    .filter((record) => {
      const recordDate = new Date(record.startTime);
      return (
        recordDate.getFullYear() === year &&
        recordDate.getMonth() === month &&
        recordDate.getDate() === date
      );
    })
    .sort(
      (first, second) =>
        new Date(first.startTime).getTime() - new Date(second.startTime).getTime(),
    );
}

