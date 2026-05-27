export type FocusRecord = {
  id: string;
  taskName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  createdAt: string;
};

export type FocusSessionDraft = {
  taskName: string;
  durationMinutes: number;
  startTime: string;
};

