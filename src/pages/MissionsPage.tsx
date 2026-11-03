import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { MissionCard } from '../components/MissionCard'
import { ArrowIcon } from '../components/Icons'
import { hunt } from '../data/hunt'
import { useCopyFeedback } from '../hooks/useCopyFeedback'
import { loadProgress, saveProgress } from '../lib/progress'
import { getDayStats } from '../lib/stats'
import type { Progress } from '../types'

function MissionsPage() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress(hunt))
  const { copyState, copyText, clearCopyState } = useCopyFeedback()

  useEffect(() => saveProgress(hunt, progress), [progress])

  const activeDay = hunt.days.find((day) => day.id === progress.selectedDayId) ?? hunt.days[0]
  const completedIds = progress.completedByDay[activeDay.id] ?? []
  const completedSet = new Set(completedIds)
  const stats = getDayStats(activeDay, completedIds)

  function selectDay(dayId: string) {
    setProgress((current) => ({ ...current, selectedDayId: dayId }))
    clearCopyState()
  }

  function toggleMission(dayId: string, missionId: string) {
    setProgress((current) => {
      const ids = current.completedByDay[dayId] ?? []
      const nextIds = ids.includes(missionId) ? ids.filter((id) => id !== missionId) : [...ids, missionId]
      return { ...current, completedByDay: { ...current.completedByDay, [dayId]: nextIds } }
    })
  }

  return (
    <section className="missions-section section-shell" id="misiones" aria-labelledby="missions-title">
      <div className="section-heading">
        <div><p className="section-kicker">01 / EL DESAFÍO</p><h1 id="missions-title">Elige tu día.<br /><span>Empieza la caza.</span></h1></div>
        <p>Dos recorridos distintos, una misión compartida: salir a explorar. Marca lo que consigas y consulta tu puntuación en cualquier momento.</p>
      </div>

      <div className="day-switcher" aria-label="Elegir día del desafío">
        {hunt.days.map((day) => {
          const dayStats = getDayStats(day, progress.completedByDay[day.id] ?? [])
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
          <div className="mission-list" aria-label={`Misiones de ${activeDay.shortLabel}`}>
            {activeDay.missions.map((mission, index) => (
              <MissionCard
                key={`${activeDay.id}:${mission.id}`}
                mission={mission}
                index={index}
                dayId={activeDay.id}
                completed={completedSet.has(mission.id)}
                onToggle={() => toggleMission(activeDay.id, mission.id)}
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
            <div className="progress-divider" />
            <p className="progress-reminder">El progreso es personal. Los puntos oficiales se confirman en la comprobación presencial.</p>
          </div>
          <div className="sidebar-tip"><span className="tip-icon">i</span><div><strong>Antes de presentarte</strong><p>Conserva tus capturas y revisa la fecha y la procedencia de cada Pokémon.</p><Link to="/rules">Ver todas las reglas <ArrowIcon /></Link></div></div>
        </aside>
      </div>
    </section>
  )
}

export default MissionsPage
