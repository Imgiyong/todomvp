interface DeleteDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteDialog({ open, onCancel, onConfirm }: DeleteDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="flex w-[90%] max-w-[320px] flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-xl">
        <div className="flex flex-col gap-2">
          <h2
            id="delete-dialog-title"
            className="text-headline-md font-bold text-on-surface"
          >
            할일 삭제
          </h2>
          <p className="text-body-md text-on-surface-variant">
            이 할일을 삭제할까요?
            <br />
            삭제 후에는 복구할 수 없습니다.
          </p>
        </div>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-outline-variant py-2.5 text-label-md text-on-surface-variant transition-all hover:bg-surface-container-low active:scale-95"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-error py-2.5 text-label-md text-on-error transition-all hover:opacity-90 active:scale-95"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
