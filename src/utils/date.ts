export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export interface CalendarDay {
  date: Date
  dateKey: string
  isCurrentMonth: boolean
  isToday: boolean
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const today = todayKey()
  const days: CalendarDay[] = []

  for (let i = startPad - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    const dateKey = toDateKey(date)
    days.push({ date, dateKey, isCurrentMonth: false, isToday: dateKey === today })
  }

  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(year, month, d)
    const dateKey = toDateKey(date)
    days.push({ date, dateKey, isCurrentMonth: true, isToday: dateKey === today })
  }

  while (days.length < 42) {
    const prev = days[days.length - 1].date
    const date = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1)
    const dateKey = toDateKey(date)
    days.push({ date, dateKey, isCurrentMonth: false, isToday: dateKey === today })
  }

  return days
}

export function formatMonthYear(year: number, month: number): string {
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(
    new Date(year, month),
  )
}

export function formatShortDate(dateKey: string): string {
  return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(
    parseDateKey(dateKey),
  )
}

export function formatDateLabel(dateKey: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(parseDateKey(dateKey))
}

export function isOverdue(dateKey: string): boolean {
  return dateKey < todayKey()
}

export function isDueToday(dateKey: string): boolean {
  return dateKey === todayKey()
}

export function getDueDateStatus(dateKey: string): 'overdue' | 'today' | 'upcoming' {
  if (isOverdue(dateKey)) return 'overdue'
  if (isDueToday(dateKey)) return 'today'
  return 'upcoming'
}

export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const
