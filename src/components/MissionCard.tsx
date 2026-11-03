import { CheckIcon, CopyIcon } from './Icons'
import type { CopyState } from '../hooks/useCopyFeedback'
import type { Mission } from '../types'

interface MissionCardProps {
  mission: Mission
  index: number
  dayId: string
  completed: boolean
  onToggle: () => void
  onCopy: () => void
  copyState: CopyState
}

export function MissionCard({ mission, index, dayId, completed, onToggle, onCopy, copyState }: MissionCardProps) {
  const missionKey = `${dayId}:${mission.id}`
  const currentCopyState = copyState?.key === missionKey ? copyState.kind : null

  return (
    <article className={`mission-card${completed ? ' is-complete' : ''}`}>
      <div className="mission-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
      <div className="mission-content">
        <div className="mission-heading-row">
          <h3>{mission.title}</h3>
          <span className="points-badge">{mission.points} {mission.points === 1 ? 'PUNTO' : 'PUNTOS'}</span>
        </div>
        <p className="mission-objective">{mission.objective}</p>
        {mission.searchFilter ? (
          <div className="filter-group">
            <span className="filter-label">FILTRO DE BÚSQUEDA</span>
            <div className="filter-box">
              <code>{mission.searchFilter}</code>
              <button type="button" className="copy-button" onClick={onCopy} aria-label={`Copiar filtro de ${mission.title}`} title="Copiar filtro">
                {currentCopyState === 'success' ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            {currentCopyState && <span className={`copy-feedback ${currentCopyState}`} role="status">{currentCopyState === 'success' ? 'Filtro copiado' : 'No se pudo copiar. Selecciona el texto para copiarlo.'}</span>}
          </div>
        ) : (
          <div className="verification-note"><span className="verification-dot" />{mission.verification ?? 'Verificación presencial'}</div>
        )}
      </div>
      <label className="mission-toggle">
        <input type="checkbox" checked={completed} onChange={onToggle} aria-label={`Marcar ${mission.title} como completada`} />
        <span className="mission-toggle-text">{completed ? 'Hecha' : 'Marcar'}</span>
      </label>
    </article>
  )
}
