import { useEffect, useState } from 'react'

export type CopyState = { key: string; kind: 'success' | 'error' } | null

export function useCopyFeedback() {
  const [copyState, setCopyState] = useState<CopyState>(null)

  useEffect(() => {
    if (!copyState) return
    const timeout = window.setTimeout(() => setCopyState(null), 3500)
    return () => window.clearTimeout(timeout)
  }, [copyState])

  async function copyText(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopyState({ key, kind: 'success' })
    } catch {
      setCopyState({ key, kind: 'error' })
    }
  }

  return { copyState, copyText, clearCopyState: () => setCopyState(null) }
}
