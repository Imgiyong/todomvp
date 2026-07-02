import { useEffect, useRef, useState } from 'react'
import type { TodoCategory } from '../types/todo'

interface MicFabProps {
  onSpeechResult: (text: string, category: TodoCategory) => void
  category: TodoCategory
  onShowToast: (message: string) => void
  onSwitchToTasks: () => void
}

export function MicFab({
  onSpeechResult,
  category,
  onShowToast,
  onSwitchToTasks,
}: MicFabProps) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionCtor) return

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'ko-KR'
    recognition.interimResults = false

    recognition.onstart = () => {
      setListening(true)
      onShowToast('말씀해 주세요…')
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript
      if (!text) return
      onSwitchToTasks()
      onSpeechResult(text, category)
    }

    recognition.onerror = () => {
      onShowToast('음성 인식에 실패했습니다.')
    }

    recognitionRef.current = recognition
  }, [category, onShowToast, onSpeechResult, onSwitchToTasks])

  function handleClick() {
    const recognition = recognitionRef.current
    if (!recognition) {
      onShowToast('이 브라우저는 음성 입력을 지원하지 않습니다.')
      return
    }

    if (listening) {
      recognition.stop()
      return
    }

    recognition.start()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`fixed bottom-20 right-container-margin z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-all duration-150 active:scale-90 ${
        listening ? 'ring-4 ring-primary-container/30' : ''
      }`}
      aria-label="음성으로 할일 추가"
    >
      <span
        className="material-symbols-outlined text-[28px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        mic
      </span>
    </button>
  )
}
