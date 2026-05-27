export function formatDate(input: string | Date) {
  const date = input instanceof Date ? input : new Date(input);
  const weekday = new Intl.DateTimeFormat("zh-CN", {
    weekday: "long",
  }).format(date);

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekday}`;
}
