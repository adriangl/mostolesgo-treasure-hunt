import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error('Falta la configuración pública de Supabase.')
}

export const supabase = createClient(url, key)

export interface HuntPlayer {
  userId: string
  nickname: string
}

export interface CompletedMission {
  dayId: string
  missionId: string
}

export interface LeaderboardEntry {
  name: string
  points: number
}

export async function getHuntPlayer(huntId: string): Promise<HuntPlayer | null> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!sessionData.session) return null

  const userId = sessionData.session.user.id
  const { data, error } = await supabase
    .from('hunt_players')
    .select('nickname')
    .eq('hunt_id', huntId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data ? { userId, nickname: data.nickname } : null
}

export async function joinHunt(huntId: string, nickname: string): Promise<HuntPlayer> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError

  let userId = sessionData.session?.user.id
  if (!userId) {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error
    userId = data.user?.id
  }
  if (!userId) throw new Error('No se pudo iniciar la sesión anónima.')

  const { error } = await supabase.from('hunt_players').insert({
    hunt_id: huntId,
    user_id: userId,
    nickname,
  })
  if (error) throw error
  return { userId, nickname }
}

export async function getCompletedMissions(huntId: string, userId: string): Promise<CompletedMission[]> {
  const { data, error } = await supabase
    .from('completed_missions')
    .select('day_id,mission_id')
    .eq('hunt_id', huntId)
    .eq('user_id', userId)

  if (error) throw error
  return (data ?? []).map((row) => ({ dayId: row.day_id, missionId: row.mission_id }))
}

export async function setMissionCompleted(
  huntId: string,
  userId: string,
  dayId: string,
  missionId: string,
  completed: boolean,
): Promise<void> {
  if (completed) {
    const { error } = await supabase.from('completed_missions').insert({
      hunt_id: huntId,
      user_id: userId,
      day_id: dayId,
      mission_id: missionId,
    })
    if (error) throw error
    return
  }

  const { error } = await supabase
    .from('completed_missions')
    .delete()
    .eq('hunt_id', huntId)
    .eq('user_id', userId)
    .eq('day_id', dayId)
    .eq('mission_id', missionId)
  if (error) throw error
}

export async function getDayLeaderboard(huntId: string, dayId: string): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc('get_day_leaderboard', {
    p_hunt_id: huntId,
    p_day_id: dayId,
  })
  if (error) throw error
  return (data ?? []) as LeaderboardEntry[]
}
