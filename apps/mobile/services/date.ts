const MONTH_LABELS = [
  'Th1',
  'Th2',
  'Th3',
  'Th4',
  'Th5',
  'Th6',
  'Th7',
  'Th8',
  'Th9',
  'Th10',
  'Th11',
  'Th12',
];

/** Today as YYYY-MM-DD, using local time (not UTC — "today" should match the device). */
export function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** "2026-08-15" -> "Th8". Used as the x-axis label for monthly charts. */
export function monthLabel(isoDate: string): string {
  const month = Number(isoDate.slice(5, 7));
  return MONTH_LABELS[(month - 1 + 12) % 12] ?? '';
}
