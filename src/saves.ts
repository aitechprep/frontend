import { createContext, useContext } from 'react'

export interface SavesContextValue {
  savedIds: string[]
  storageError: string
  toggleSaved: (id: string) => boolean
}

export const SavesContext = createContext<SavesContextValue | null>(null)

export function useSaves() {
  const value = useContext(SavesContext)
  if (!value) throw new Error('useSaves must be used within SavesProvider')
  return value
}
