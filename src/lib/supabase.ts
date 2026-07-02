import { createClient } from '@supabase/supabase-js'
import { normalizeCategory, type TodoCategory } from '../types/todo'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface TodoRow {
  id: string
  text: string
  is_done: boolean
  created_at: string
}

export function rowToTodo(row: TodoRow, category: TodoCategory = 'general') {
  return {
    id: row.id,
    text: row.text,
    completed: row.is_done,
    category,
    createdAt: row.created_at,
  }
}

export { normalizeCategory }
