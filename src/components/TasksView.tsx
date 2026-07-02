import { useState } from 'react'
import type { AppTab, Todo } from '../types/todo'
import { DeleteDialog } from './DeleteDialog'
import { EmptyState } from './EmptyState'
import { StitchTaskItem } from './StitchTaskItem'

interface TasksViewProps {
  tasks: Todo[]
  activeTab: AppTab
  onToggle: (id: string) => void
  onDelete: (id: string) => Promise<boolean> | boolean
}

export function TasksView({ tasks, activeTab, onToggle, onDelete }: TasksViewProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [exitingId, setExitingId] = useState<string | null>(null)

  const isEmpty = tasks.length === 0
  const emptyTitle =
    activeTab === 'completed' ? '완료된 할일이 없습니다' : '아직 할일이 없습니다'
  const emptyDescription =
    activeTab === 'completed'
      ? '할일을 완료하면 여기에 표시됩니다'
      : '첫 번째 할일을 추가해 보세요'

  async function handleConfirmDelete() {
    if (!deleteTargetId) return

    const id = deleteTargetId
    setDeleteTargetId(null)
    setExitingId(id)

    window.setTimeout(async () => {
      await onDelete(id)
      setExitingId(null)
    }, 200)
  }

  if (isEmpty) {
    return (
      <>
        <EmptyState title={emptyTitle} description={emptyDescription} />
        <DeleteDialog
          open={deleteTargetId !== null}
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => void handleConfirmDelete()}
        />
      </>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <StitchTaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDeleteRequest={setDeleteTargetId}
            exiting={exitingId === task.id}
          />
        ))}
      </div>

      <DeleteDialog
        open={deleteTargetId !== null}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  )
}
