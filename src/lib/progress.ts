import type { Hunt, Progress } from '../types'

export function storageKey(eventId: string): string {
  return `hunt-progress:v1:${eventId}`
}

export function emptyProgress(hunt: Hunt): Progress {
  return {
    selectedDayId: hunt.days[0]?.id ?? '',
    completedByDay: {},
  }
}

export function loadProgress(hunt: Hunt): Progress {
  const empty = emptyProgress(hunt)

  try {
    const raw = localStorage.getItem(storageKey(hunt.id))
    if (!raw) return empty

    const saved: unknown = JSON.parse(raw)
    if (!saved || typeof saved !== 'object') return empty

    const data = saved as Partial<Progress>
    const selectedDayId = hunt.days.some((day) => day.id === data.selectedDayId)
      ? data.selectedDayId!
      : empty.selectedDayId
    const completedByDay: Record<string, string[]> = {}

    for (const day of hunt.days) {
      const savedIds = data.completedByDay?.[day.id]
      const validIds = new Set(day.missions.map((mission) => mission.id))
      completedByDay[day.id] = Array.isArray(savedIds)
        ? [...new Set(savedIds.filter((id): id is string => typeof id === 'string' && validIds.has(id)))]
        : []
    }

    return { selectedDayId, completedByDay }
  } catch {
    return empty
  }
}

export function saveProgress(hunt: Hunt, progress: Progress): void {
  try {
    localStorage.setItem(storageKey(hunt.id), JSON.stringify(progress))
  } catch {
    // The checklist remains usable for this session when storage is unavailable.
  }
}
