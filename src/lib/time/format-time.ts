export function formatTime(input: string | Date) {
  const date = input instanceof Date ? input : new Date(input);

  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

