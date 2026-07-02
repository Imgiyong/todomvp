import { useCallback, useEffect, useMemo, useState } from 'react'
import { rowToTodo, supabase, type TodoRow } from '../lib/supabase'
import {
  TODO_CATEGORIES,
  type AppTab,
  type Todo,
  type TodoCategory,
} from '../types/todo'

const TAB_STORAGE_KEY = 'simple_todo_tab'
const FILTER_CATEGORY_STORAGE_KEY = 'simple_todo_filter_category'
const LAST_CATEGORY_STORAGE_KEY = 'simple_todo_last_category'
const DARK_MODE_STORAGE_KEY = 'simple_todo_dark_mode'

function loadTab(): AppTab {
  if (typeof window === 'undefined') return 'tasks'
  const saved = localStorage.getItem(TAB_STORAGE_KEY)
  if (saved === 'tasks' || saved === 'completed' || saved === 'calendar') return saved
  return 'tasks'
}

function loadFilterCategory(): TodoCategory | null {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem(FILTER_CATEGORY_STORAGE_KEY)
  if (saved === 'general' || saved === 'work' || saved === 'personal') return saved
  return null
}

function loadLastCategory(): TodoCategory {
  if (typeof window === 'undefined') return 'general'
  const saved = localStorage.getItem(LAST_CATEGORY_STORAGE_KEY)
  if (saved === 'general' || saved === 'work' || saved === 'personal') return saved
  return 'general'
}

function loadDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true'
}

export function useTodos() {
  const [tasks, setTasks] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<AppTab>(() => loadTab())
  const [filterCategory, setFilterCategory] = useState<TodoCategory | null>(() => loadFilterCategory())
  const [lastCategory, setLastCategory] = useState<TodoCategory>(() => loadLastCategory())
  const [darkMode, setDarkMode] = useState<boolean>(() => loadDarkMode())

  useEffect(() => {
    let cancelled = false

    async function fetchTodos() {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true })

      if (cancelled) return

      if (fetchError) {
        setError(fetchError.message)
        setTasks([])
      } else {
        setTasks((data as TodoRow[]).map((row) => rowToTodo(row)))
      }

      setLoading(false)
    }

    fetchTodos()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem(TAB_STORAGE_KEY, activeTab)
  }, [activeTab])

  useEffect(() => {
    if (filterCategory) {
      localStorage.setItem(FILTER_CATEGORY_STORAGE_KEY, filterCategory)
    } else {
      localStorage.removeItem(FILTER_CATEGORY_STORAGE_KEY)
    }
  }, [filterCategory])

  useEffect(() => {
    localStorage.setItem(LAST_CATEGORY_STORAGE_KEY, lastCategory)
  }, [lastCategory])

  useEffect(() => {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkMode))
  }, [darkMode])

  const visibleTasks = useMemo(() => {
    const byTab =
      activeTab === 'completed'
        ? tasks.filter((t) => t.completed)
        : tasks.filter((t) => !t.completed)

    if (!filterCategory) return byTab
    return byTab.filter((t) => t.category === filterCategory)
  }, [tasks, filterCategory, activeTab])

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0
    const done = tasks.filter((t) => t.completed).length
    return Math.round((done / tasks.length) * 100)
  }, [tasks])

  const categoryCounts = useMemo(
    () =>
      TODO_CATEGORIES.map(({ id, label }) => ({
        id,
        label,
        total: tasks.filter((t) => t.category === id).length,
        done: tasks.filter((t) => t.category === id && t.completed).length,
      })),
    [tasks],
  )

  const setTab = useCallback((tab: AppTab) => {
    setActiveTab(tab)
    if (tab !== 'tasks') {
      setFilterCategory(null)
    }
  }, [])

  const selectCategoryFilter = useCallback((category: TodoCategory) => {
    setFilterCategory(category)
    setActiveTab('tasks')
  }, [])

  const clearCategoryFilter = useCallback(() => {
    setFilterCategory(null)
  }, [])

  const addTask = useCallback(
    async (text: string, category: TodoCategory = lastCategory) => {
      const trimmed = text.trim()
      if (!trimmed) return false

      setLastCategory(category)

      const { data, error: insertError } = await supabase
        .from('todos')
        .insert({ text: trimmed, is_done: false })
        .select()
        .single()

      if (insertError || !data) {
        setError(insertError?.message ?? '할 일 추가에 실패했습니다.')
        return false
      }

      const todo = rowToTodo(data as TodoRow, category)
      setTasks((prev) => [...prev, todo])
      return true
    },
    [lastCategory],
  )

  const toggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return

      const nextDone = !task.completed

      const { error: updateError } = await supabase
        .from('todos')
        .update({ is_done: nextDone })
        .eq('id', id)

      if (updateError) {
        setError(updateError.message)
        return
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: nextDone } : t)),
      )
    },
    [tasks],
  )

  const deleteTask = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from('todos').delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return false
    }

    setTasks((prev) => prev.filter((t) => t.id !== id))
    return true
  }, [])

  const clearCompleted = useCallback(async () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id)
    if (completedIds.length === 0) return 0

    const { error: deleteError } = await supabase.from('todos').delete().in('id', completedIds)

    if (deleteError) {
      setError(deleteError.message)
      return 0
    }

    setTasks((prev) => prev.filter((t) => !t.completed))
    return completedIds.length
  }, [tasks])

  const clearAll = useCallback(async () => {
    if (tasks.length === 0) return 0

    const allIds = tasks.map((t) => t.id)
    const { error: deleteError } = await supabase.from('todos').delete().in('id', allIds)

    if (deleteError) {
      setError(deleteError.message)
      return 0
    }

    setTasks([])
    return allIds.length
  }, [tasks])

  return {
    tasks,
    visibleTasks,
    activeTab,
    filterCategory,
    lastCategory,
    darkMode,
    progress,
    categoryCounts,
    loading,
    error,
    setTab,
    setDarkMode,
    selectCategoryFilter,
    clearCategoryFilter,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    clearAll,
  }
}
