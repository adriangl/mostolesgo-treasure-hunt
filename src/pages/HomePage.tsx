import { Link } from 'react-router'
import { ArrowIcon } from '../components/Icons'
import { hunt } from '../data/hunt'
import { getDayStats } from '../lib/stats'

function HomePage() {
  const dailyTotals = hunt.days.map((day) => getDayStats(day, []).max)
  const commonDailyTotal = dailyTotals.every((total) => total === dailyTotals[0]) ? dailyTotals[0] : null

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-star star-one" aria-hidden="true" />
        <div className="hero-star star-two" aria-hidden="true" />
        <div className="hero-inner">
          <p className="eyebrow"><span className="eyebrow-line" /> {hunt.event} <span className="eyebrow-line" /></p>
          <h1 id="hero-title">Caza de<br /><span>Recompensas.</span></h1>
          <p className="hero-location">{hunt.organizer} <span aria-hidden="true">✦</span> {hunt.location}</p>
          <p className="hero-intro">{hunt.intro}</p>
          <div className="hero-actions">
            <Link className="button-primary" to="/missions">Explorar misiones <ArrowIcon /></Link>
            <span className="hero-date">{hunt.dates}</span>
          </div>
        </div>
        <div className="hero-bottom" aria-hidden="true"><span>01 / LA EXPEDICIÓN</span><span>DESLIZA PARA DESCUBRIR ↓</span></div>
      </section>

      <section className="intro-strip" aria-label="Resumen del desafío">
        <div className="intro-strip-inner">
          <div className="intro-stat"><strong>{String(hunt.days.length).padStart(2, '0')}</strong><span>DÍAS DE DESAFÍO</span></div>
          <div className="intro-stat"><strong>{String(hunt.days.reduce((count, day) => count + day.missions.length, 0)).padStart(2, '0')}</strong><span>MISIONES EN TOTAL</span></div>
          <div className="intro-stat"><strong>{commonDailyTotal ?? Math.max(...dailyTotals)}</strong><span>{commonDailyTotal === null ? 'PUNTOS MÁX. EN UN DÍA' : 'PUNTOS POR DÍA'}</span></div>
          <p>Tu aventura, a tu ritmo.<br /><span>Marca tus logros y sigue cada paso.</span></p>
        </div>
      </section>

      <section className="home-paths section-shell" aria-labelledby="paths-title">
        <div className="section-heading"><div><p className="section-kicker">01 / TU EXPEDICIÓN</p><h2 id="paths-title">Prepara tu<br /><span>recorrido.</span></h2></div><p>Consulta los retos, ten claras las reglas y lleva tus filtros a mano durante la búsqueda.</p></div>
        <div className="path-grid">
          <Link className="path-card" to="/missions"><span className="path-number">01 / DESAFÍOS</span><span className="path-title">Las misiones</span><span className="path-description">Explora cada día, marca tus capturas y sigue tu puntuación.</span><span className="path-arrow"><ArrowIcon /></span></Link>
          <Link className="path-card" to="/rules"><span className="path-number">02 / VERIFICACIÓN</span><span className="path-title">Las reglas</span><span className="path-description">Descubre qué cuenta, qué conservar y cómo se resuelven los empates.</span><span className="path-arrow"><ArrowIcon /></span></Link>
          <Link className="path-card" to="/tools"><span className="path-number">03 / BÚSQUEDA</span><span className="path-title">Herramientas</span><span className="path-description">Copia filtros y revisa los detalles que debes comprobar en el juego.</span><span className="path-arrow"><ArrowIcon /></span></Link>
        </div>
      </section>
    </>
  )
}

export default HomePage
