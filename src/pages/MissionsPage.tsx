import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { HuntAccess } from '../components/HuntAccess'
import { MissionCard } from '../components/MissionCard'
import { ArrowIcon } from '../components/Icons'
import { hunt } from '../data/hunt'
import { useCopyFeedback } from '../hooks/useCopyFeedback'
import { useHuntPlayer } from '../hooks/useHuntPlayer'
import { getCompletedMissions, setMissionCompleted, type CompletedMission } from '../lib/huntApi'
import { getDayStats } from '../lib/stats'

function MissionsPage() {
  const player = useHuntPlayer(hunt.id)
  if (player.status !== 'ready') return <HuntAccess player={player} title="Entra en la caza." sectionLabel="02 / EL DESAFÍO" />
  return <MissionsChecklist userId={player.player.userId} nickname={player.player.nickname} />
}

function MissionsChecklist({ userId, nickname }: { userId: string; nickname: string }) {
  const [selectedDayId, setSelectedDayId] = useState(hunt.days[0]?.id ?? '')
  const [completed, setCompleted] = useState<CompletedMission[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const { copyState, copyText, clearCopyState } = useCopyFeedback()

  const load = useCallback(async () => {
    setCompleted(null)
    setLoadError(false)
    try {
      setCompleted(await getCompletedMissions(hunt.id, userId))
    } catch {
      setLoadError(true)
    }
  }, [userId])

  useEffect(() => { void load() }, [load])

  const activeDay = hunt.days.find((day) => day.id === selectedDayId) ?? hunt.days[0]
  const completedIds = completed?.filter((item) => item.dayId === activeDay.id).map((item) => item.missionId) ?? []
  const completedSet = new Set(completedIds)
  const stats = getDayStats(activeDay, completedIds)

  function selectDay(dayId: string) {
    setSelectedDayId(dayId)
    clearCopyState()
    setSaveError(false)
  }

  async function toggleMission(dayId: string, missionId: string) {
    if (completed === null || pendingKey !== null) return
    const key = `${dayId}:${missionId}`
    const wasCompleted = completed.some((item) => item.dayId === dayId && item.missionId === missionId)
    setPendingKey(key)
    setSaveError(false)
    try {
      await setMissionCompleted(hunt.id, userId, dayId, missionId, !wasCompleted)
      setCompleted((current) => current === null ? current : wasCompleted
        ? current.filter((item) => item.dayId !== dayId || item.missionId !== missionId)
        : [...current, { dayId, missionId }])
    } catch {
      setSaveError(true)
    } finally {
      setPendingKey(null)
    }
  }

  return (
    <section className="missions-section section-shell" id="misiones" aria-labelledby="missions-title">
      <div className="section-heading">
        <div><p className="section-kicker">02 / EL DESAFÍO</p><h1 id="missions-title">Elige tu día.<br /><span>Empieza la caza.</span></h1></div>
        <p>Jugando como <strong>{nickname}</strong>. Marca lo que consigas y consulta tu puntuación en cualquier momento.</p>
      </div>

      {completed === null ? (
        <div className="state-card" role={loadError ? 'alert' : 'status'}>
          <p>{loadError ? 'No se pudo cargar tu progreso. Comprueba tu conexión y vuelve a intentarlo.' : 'Cargando tus misiones…'}</p>
          {loadError && <button type="button" className="button-primary" onClick={() => void load()}>Reintentar</button>}
        </div>
      ) : (
        <>
          <div className="day-switcher" aria-label="Elegir día del desafío">
            {hunt.days.map((day) => {
              const dayIds = completed.filter((item) => item.dayId === day.id).map((item) => item.missionId)
              const dayStats = getDayStats(day, dayIds)
              const selected = day.id === activeDay.id
              return (
                <button key={day.id} type="button" className={`day-tab${selected ? ' is-active' : ''}`} onClick={() => selectDay(day.id)} aria-pressed={selected}>
                  <span className="day-tab-main"><span className="day-tab-date">{day.shortLabel}</span><span className="day-tab-theme">{day.title}</span></span>
                  <span className="day-tab-score">{dayStats.score}<small>/{dayStats.max} PT</small></span>
                </button>
              )
            })}
          </div>

          <div className="challenge-layout">
            <div className="challenge-main">
              <div className="day-intro">
                <div><p className="day-eyebrow">{activeDay.dateLabel} <span>·</span> {activeDay.theme}</p><h2>{activeDay.title}</h2></div>
                <div className="deadline"><span>CIERRE DE PRESENTACIÓN</span><strong>{activeDay.deadline}</strong></div>
              </div>
              {saveError && <p className="save-error" role="alert">No se pudo guardar el cambio. Vuelve a marcar la misión para reintentarlo.</p>}
              <div className="mission-list" aria-label={`Misiones de ${activeDay.shortLabel}`}>
                {activeDay.missions.map((mission, index) => (
                  <MissionCard
                    key={`${activeDay.id}:${mission.id}`}
                    mission={mission}
                    index={index}
                    dayId={activeDay.id}
                    completed={completedSet.has(mission.id)}
                    disabled={pendingKey !== null}
                    onToggle={() => void toggleMission(activeDay.id, mission.id)}
                    onCopy={() => {
                      if (mission.searchFilter) void copyText(`${activeDay.id}:${mission.id}`, mission.searchFilter)
                    }}
                    copyState={copyState}
                  />
                ))}
              </div>
            </div>

            <aside className="progress-sidebar" aria-label="Tu progreso">
              <div className="progress-card">
                <div className="progress-card-top"><span>TU PROGRESO</span><span className="progress-spark" aria-hidden="true">✦</span></div>
                <p className="progress-day">{activeDay.shortLabel}</p>
                <div className="score-line"><strong>{stats.score}</strong><span>/ {stats.max} <small>PT</small></span></div>
                <div className="progress-track" role="progressbar" aria-label="Puntos conseguidos" aria-valuenow={stats.score} aria-valuemin={0} aria-valuemax={stats.max}><div style={{ width: `${stats.max ? (stats.score / stats.max) * 100 : 0}%` }} /></div>
                <p className="progress-count">{stats.count} de {activeDay.missions.length} misiones marcadas</p>
                <Link className="progress-leaderboard-link" to="/leaderboard">Ver clasificación <ArrowIcon /></Link>
              </div>
              <div className="sidebar-tip"><span className="tip-icon">i</span><div><strong>Antes de presentarte</strong><p>Conserva tus capturas y revisa la fecha y la procedencia de cada Pokémon.</p><Link to="/rules">Ver todas las reglas <ArrowIcon /></Link></div></div>
            </aside>
          </div>
        </>
      )}
    </section>
  )
}

export default MissionsPage
