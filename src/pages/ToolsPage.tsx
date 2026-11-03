import { CheckIcon, CopyIcon } from '../components/Icons'
import { hunt } from '../data/hunt'
import { useCopyFeedback } from '../hooks/useCopyFeedback'

function ToolsPage() {
  const { copyState, copyText } = useCopyFeedback()

  return (
    <section className="guide-section section-shell" id="guia" aria-labelledby="guide-title">
      <div className="guide-heading"><p className="section-kicker">03 / HERRAMIENTAS</p><h1 id="guide-title">Busca mejor.<br /><span>Comprueba siempre.</span></h1><p>Los filtros te ayudan a localizar candidatos en Pokémon GO. La ficha de cada ejemplar es la que permite confirmar los detalles.</p></div>
      <div className="guide-layout">
        <div className="guide-feature">
          <div className="guide-feature-top"><span>FILTRO BASE</span><span aria-hidden="true">↗</span></div>
          <div className="guide-filter"><code>{hunt.baseFilter}</code><button type="button" className="copy-button" onClick={() => void copyText('base-filter', hunt.baseFilter)} aria-label="Copiar filtro base" title="Copiar filtro base">{copyState?.key === 'base-filter' && copyState.kind === 'success' ? <CheckIcon /> : <CopyIcon />}</button></div>
          {copyState?.key === 'base-filter' && <span className={`copy-feedback ${copyState.kind}`} role="status">{copyState.kind === 'success' ? 'Filtro copiado' : 'No se pudo copiar. Selecciona el texto para copiarlo.'}</span>}
          <p>Úsalo como punto de partida. <strong>«edad0» cubre las últimas 24 horas</strong>, no el día natural.</p>
        </div>
        <div className="guide-notes"><h3>Tenlo en cuenta</h3><ul>{hunt.searchNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>
      </div>
    </section>
  )
}

export default ToolsPage
