import { useEffect, useState } from 'react'
import { HuntAccess } from '../components/HuntAccess'
import { hunt } from '../data/hunt'
import { useHuntPlayer } from '../hooks/useHuntPlayer'
import { getDayLeaderboard, type LeaderboardEntry } from '../lib/huntApi'

function LeaderboardPage() {
  const player = useHuntPlayer(hunt.id)
  if (player.status !== 'ready') return <HuntAccess player={player} title="Entra en la clasificación." sectionLabel="03 / LA CLASIFICACIÓN" />
  return <DailyLeaderboard nickname={player.player.nickname} />
}

function DailyLeaderboard({ nickname }: { nickname: string }) {
  const [dayId, setDayId] = useState(hunt.days[0]?.id ?? '')
  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const activeDay = hunt.days.find((day) => day.id === dayId) ?? hunt.days[0]

  useEffect(() => {
    let active = true
    getDayLeaderboard(hunt.id, dayId).then((entries) => {
      if (active) setRows(entries)
    }).catch(() => {
      if (active) setError(true)
    })
    return () => { active = false }
  }, [dayId, retryCount])

  function selectDay(nextDayId: string) {
    if (nextDayId === dayId) return
    setRows(null)
    setError(false)
    setDayId(nextDayId)
  }

  function retry() {
    setRows(null)
    setError(false)
    setRetryCount((count) => count + 1)
  }

  return (
    <section className="leaderboard-section section-shell" aria-labelledby="leaderboard-title">
      <div className="section-heading">
        <div><p className="section-kicker">03 / LA CLASIFICACIÓN</p><h1 id="leaderboard-title">Cada día,<br /><span>una clasificación.</span></h1></div>
        <p>Consulta los puntos de cada participante por día.</p>
      </div>

      <div className="day-switcher" aria-label="Elegir día de la clasificación">
        {hunt.days.map((day) => (
          <button key={day.id} type="button" className={`day-tab${day.id === dayId ? ' is-active' : ''}`} onClick={() => selectDay(day.id)} aria-pressed={day.id === dayId}>
            <span className="day-tab-main"><span className="day-tab-date">{day.shortLabel}</span><span className="day-tab-theme">{day.title}</span></span>
          </button>
        ))}
      </div>

      <div className="leaderboard-card">
        <div className="leaderboard-card-heading"><div><p className="section-kicker">{activeDay.dateLabel}</p><h2>{activeDay.title}</h2></div><span>Jugando como {nickname}</span></div>
        {error ? (
          <div className="state-card" role="alert"><p>No se pudo cargar la clasificación. Comprueba tu conexión y vuelve a intentarlo.</p><button type="button" className="button-primary" onClick={retry}>Reintentar</button></div>
        ) : rows === null ? (
          <p className="leaderboard-status" role="status">Cargando clasificación…</p>
        ) : (
          <table className="leaderboard-table">
            <caption className="sr-only">Clasificación de {activeDay.shortLabel}</caption>
            <thead><tr><th scope="col">Puesto</th><th scope="col">Apodo</th><th scope="col">Puntos</th></tr></thead>
            <tbody>
              {rows.map((entry) => {
                const rank = rows.findIndex((row) => row.points === entry.points) + 1
                return (
                  <tr key={entry.name} className={entry.name === nickname ? 'is-current-player' : undefined}>
                    <td>{rank}</td><th scope="row">{entry.name}{entry.name === nickname && <span className="you-badge">TÚ</span>}</th><td>{entry.points}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default LeaderboardPage
