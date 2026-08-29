const FAVORITE_STORAGE_KEY = 'briksy-website-favorite-properties'

const readIds = (): string[] => {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(FAVORITE_STORAGE_KEY)
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch (error) {
    console.error('Unable to parse local favorites.', error)
    window.localStorage.removeItem(FAVORITE_STORAGE_KEY)
    return []
  }
}

const writeIds = (ids: string[]): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(Array.from(new Set(ids))))
}

export const getLocalFavoriteIds = (): string[] => readIds()

export const isLocalFavorite = (id: string | number): boolean => {
  return readIds().includes(String(id))
}

export const setLocalFavorite = (id: string | number, nextValue: boolean): void => {
  const normalizedId = String(id)
  const current = readIds()
  const next = nextValue
    ? [...current, normalizedId]
    : current.filter((item) => item !== normalizedId)

  writeIds(next)
}

export const toggleLocalFavorite = (id: string | number): boolean => {
  const normalizedId = String(id)
  const current = readIds()
  const nextValue = !current.includes(normalizedId)
  setLocalFavorite(normalizedId, nextValue)
  return nextValue
}
