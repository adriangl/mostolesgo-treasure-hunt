import type { HuntDay } from '../types'

export function getDayStats(day: HuntDay, completedIds: string[]) {
  const completed = new Set(completedIds)
  return {
    count: day.missions.filter((mission) => completed.has(mission.id)).length,
    score: day.missions.reduce((total, mission) => total + (completed.has(mission.id) ? mission.points : 0), 0),
    max: day.missions.reduce((total, mission) => total + mission.points, 0),
  }
}
