import { useRef, useState, type ReactNode } from 'react'

export interface SortHandleProps {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onPointerCancel: (e: React.PointerEvent) => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

interface SortableTaskListProps {
  taskIds: string[]
  onReorder: (fromIndex: number, toIndex: number) => void
  children: (index: number, sort?: SortHandleProps) => ReactNode
  className?: string
  layout?: 'inline' | 'toolbar'
}

export function SortableTaskList({
  taskIds,
  onReorder,
  children,
  className = 'space-y-sm',
  layout = 'toolbar',
}: SortableTaskListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const dragFromRef = useRef<number | null>(null)
  const dragOverRef = useRef<number | null>(null)

  function findDropIndex(clientY: number): number {
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (clientY < rect.top + rect.height / 2) return i
    }
    return Math.max(0, itemRefs.current.length - 1)
  }

  function createSortHandle(index: number): SortHandleProps {
    return {
      onPointerDown: (e) => {
        if (e.button !== 0) return
        e.preventDefault()
        dragFromRef.current = index
        dragOverRef.current = index
        setDragIndex(index)
        setOverIndex(index)
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      },
      onPointerMove: (e) => {
        if (dragFromRef.current === null) return
        const nextOver = findDropIndex(e.clientY)
        dragOverRef.current = nextOver
        setOverIndex(nextOver)
      },
      onPointerUp: (e) => {
        if (dragFromRef.current === null) return
        const from = dragFromRef.current
        const to = dragOverRef.current
        ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
        if (from !== null && to !== null && from !== to) onReorder(from, to)
        dragFromRef.current = null
        dragOverRef.current = null
        setDragIndex(null)
        setOverIndex(null)
      },
      onPointerCancel: (e) => {
        ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
        dragFromRef.current = null
        dragOverRef.current = null
        setDragIndex(null)
        setOverIndex(null)
      },
      onMoveUp: () => {
        if (index > 0) onReorder(index, index - 1)
      },
      onMoveDown: () => {
        if (index < taskIds.length - 1) onReorder(index, index + 1)
      },
      canMoveUp: index > 0,
      canMoveDown: index < taskIds.length - 1,
    }
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= taskIds.length) return
    onReorder(index, target)
  }

  if (taskIds.length === 0) return null

  return (
    <ul className={className}>
      {taskIds.map((id, index) => {
        const isDragging = dragIndex === index
        const isDropTarget = overIndex === index && dragIndex !== null && dragIndex !== index
        const sort = createSortHandle(index)

        if (layout === 'inline') {
          return (
            <li
              key={id}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className={`transition-all ${isDragging ? 'z-10 scale-[0.98] opacity-50' : ''} ${
                isDropTarget ? 'sortable-over-inline' : ''
              }`}
            >
              {children(index, sort)}
            </li>
          )
        }

        return (
          <li
            key={id}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className={`flex items-stretch gap-1 transition-all ${
              isDragging ? 'z-10 scale-[0.98] opacity-50' : ''
            } ${isDropTarget ? 'sortable-over' : ''}`}
          >
            <div className="flex shrink-0 flex-col items-center justify-center gap-0.5 py-1">
              <div
                role="button"
                tabIndex={0}
                onPointerDown={sort.onPointerDown}
                onPointerMove={sort.onPointerMove}
                onPointerUp={sort.onPointerUp}
                onPointerCancel={sort.onPointerCancel}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    moveItem(index, -1)
                  }
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    moveItem(index, 1)
                  }
                }}
                className="drag-handle flex h-8 w-7 cursor-grab items-center justify-center rounded-md text-outline transition-colors hover:bg-surface-container hover:text-on-surface-variant active:cursor-grabbing active:bg-surface-container-high select-none"
                aria-label="드래그하여 순서 변경"
              >
                <span className="material-symbols-outlined pointer-events-none text-[20px]">
                  drag_indicator
                </span>
              </div>
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="flex h-6 w-7 items-center justify-center rounded-md text-outline transition-colors hover:bg-surface-container hover:text-on-surface-variant disabled:opacity-25"
                aria-label="위로 이동"
              >
                <span className="material-symbols-outlined text-[16px]">keyboard_arrow_up</span>
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === taskIds.length - 1}
                className="flex h-6 w-7 items-center justify-center rounded-md text-outline transition-colors hover:bg-surface-container hover:text-on-surface-variant disabled:opacity-25"
                aria-label="아래로 이동"
              >
                <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
              </button>
            </div>
            <div className="min-w-0 flex-1">{children(index)}</div>
          </li>
        )
      })}
    </ul>
  )
}
