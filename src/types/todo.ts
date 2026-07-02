export type AppTab = 'tasks' | 'completed' | 'calendar'

export type TodoCategory = 'general' | 'work' | 'personal'

export interface Todo {
  id: string
  text: string
  completed: boolean
  category: TodoCategory
  createdAt: string
}

export const TODO_CATEGORIES = [
  { id: 'general' as const, label: '일반' },
  { id: 'work' as const, label: '업무' },
  { id: 'personal' as const, label: '개인' },
] as const

export function normalizeCategory(value: unknown): TodoCategory {
  if (value === 'work' || value === '업무') return 'work'
  if (value === 'personal' || value === '개인') return 'personal'
  if (value === 'general' || value === '일반') return 'general'
  return 'general'
}

export function getCategoryLabel(category: TodoCategory): string {
  return TODO_CATEGORIES.find((c) => c.id === category)?.label ?? '일반'
}
