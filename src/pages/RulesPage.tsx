import { hunt } from '../data/hunt'

function RulesPage() {
  return (
    <section className="rules-section" id="reglas" aria-labelledby="rules-title">
      <div className="section-shell">
        <div className="section-heading rules-heading"><div><p className="section-kicker">04 / ANTES DE SALIR</p><h1 id="rules-title">Las reglas<br /><span>del juego.</span></h1></div><p>Todo lo que necesitas saber para que tus hallazgos cuenten el día de la comprobación.</p></div>
        <div className="rules-grid">
          {hunt.rules.map((rule, index) => (
            <article className="rule-card" key={rule.title}><span className="rule-index">{String(index + 1).padStart(2, '0')}</span><h3>{rule.title}</h3><p>{rule.body}</p></article>
          ))}
        </div>
        <div className="tie-breaker"><span className="tie-icon" aria-hidden="true">✳</span><div><h3>¿Y si hay empate?</h3><ol>{hunt.tieBreakers.map((item) => <li key={item}>{item}</li>)}</ol></div></div>
      </div>
    </section>
  )
}

export default RulesPage
