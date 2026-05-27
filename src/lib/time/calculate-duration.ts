export function calculateDuration(startTime: string, endTime: string) {
  const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
  return Math.max(1, Math.round(diff / 60000));
}

