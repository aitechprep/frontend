import { useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { SavesContext } from './saves'

const STORAGE_KEY = 'modelprep:savedQuestions:v1'

function getSavedSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function getServerSnapshot() {
  return null
}

function parseSavedIds(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === 'string')) return []
    return [...new Set(parsed)]
  } catch {
    return []
  }
}

function subscribeToSaves(callback: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) callback()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener('aitechprep:saves-changed', callback)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('aitechprep:saves-changed', callback)
  }
}

export function SavesProvider({ children }: { children: ReactNode }) {
  const savedSnapshot = useSyncExternalStore(subscribeToSaves, getSavedSnapshot, getServerSnapshot)
  const savedIds = useMemo(() => parseSavedIds(savedSnapshot), [savedSnapshot])
  const [storageError, setStorageError] = useState('')

  const toggleSaved = useCallback((id: string) => {
    const next = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id]
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      window.dispatchEvent(new Event('aitechprep:saves-changed'))
      setStorageError('')
      return true
    } catch {
      setStorageError('Your browser could not save this bookmark. Check its storage settings and try again.')
      return false
    }
  }, [savedIds])

  const value = useMemo(() => ({ savedIds, storageError, toggleSaved }), [savedIds, storageError, toggleSaved])
  return <SavesContext.Provider value={value}>{children}</SavesContext.Provider>
}
