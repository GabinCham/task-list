export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDayLabel(dateKey: string): string {
  const [, month, day] = dateKey.split('-');
  if (!month || !day) return dateKey;
  return `${day}/${month}`;
}

export function todayHeaderLabel(date = new Date()): string {
  return `AUJOURD’HUI · ${formatDayLabel(localDateKey(date))}`;
}

export function msUntilNextMidnight(date = new Date()): number {
  const next = new Date(date);
  next.setHours(24, 0, 0, 0);
  return Math.max(250, next.getTime() - date.getTime());
}
