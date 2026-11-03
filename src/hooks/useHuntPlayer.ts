import { useCallback, useEffect, useState } from 'react'
import { getHuntPlayer, joinHunt, type HuntPlayer } from '../lib/huntApi'

type PlayerState =
  | { status: 'loading' | 'joining' | 'guest' | 'error'; player: null; message: string | null }
  | { status: 'ready'; player: HuntPlayer; message: null }

const loadingState: PlayerState = { status: 'loading', player: null, message: null }

export function useHuntPlayer(huntId: string) {
  const [state, setState] = useState<PlayerState>(loadingState)

  const refresh = useCallback(async () => {
    setState(loadingState)
    try {
      const player = await getHuntPlayer(huntId)
      setState(player
        ? { status: 'ready', player, message: null }
        : { status: 'guest', player: null, message: null })
    } catch {
      setState({ status: 'error', player: null, message: 'No se pudo cargar tu sesión. Inténtalo de nuevo.' })
    }
  }, [huntId])

  useEffect(() => { void refresh() }, [refresh])

  const join = useCallback(async (rawNickname: string) => {
    const nickname = rawNickname.trim().replace(/\s+/g, ' ')
    if (nickname.length < 2 || nickname.length > 24) {
      setState({ status: 'guest', player: null, message: 'Usa un apodo de entre 2 y 24 caracteres.' })
      return
    }

    setState({ status: 'joining', player: null, message: null })
    try {
      const player = await joinHunt(huntId, nickname)
      setState({ status: 'ready', player, message: null })
    } catch (error) {
      const duplicate = error !== null && typeof error === 'object' && 'code' in error && error.code === '23505'
      setState({
        status: 'guest',
        player: null,
        message: duplicate ? 'Ese apodo ya está en uso en esta caza. Elige otro.' : 'No se pudo guardar el apodo. Inténtalo de nuevo.',
      })
    }
  }, [huntId])

  return { ...state, join, refresh }
}
