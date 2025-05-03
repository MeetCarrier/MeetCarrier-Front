export function FormatTimestamp(dateInput: string | Date): string {
  const now = new Date();
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const isToday = now.toDateString() === date.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const isThisYear = now.getFullYear() === date.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  if (isYesterday) {
    return '어제';
  }

  if (isThisYear) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}
