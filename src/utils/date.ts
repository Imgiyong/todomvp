export function getHeaderDate(): { text: string; datetime: string } {
  const now = new Date()
  return {
    datetime: now.toISOString().slice(0, 10),
    text: now.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }),
  }
}

export function toDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  })
}

export function formatSelectedDate(key: string): string {
  return parseDateKey(key).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

export function getWeekdayLabels(): readonly string[] {
  return WEEKDAYS
}

export type CalendarCell = { day: number; dateKey: string } | null

export function getCalendarCells(year: number, month: number): CalendarCell[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: CalendarCell[] = Array.from({ length: firstDay }, () => null)

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = toDateKey(new Date(year, month, day))
    cells.push({ day, dateKey })
  }

  return cells
}
