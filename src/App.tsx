import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { CompassMark } from './components/Icons'
import { hunt } from './data/hunt'
import packageInfo from '../package.json'

const pageMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Caza de Recompensas · Móstoles GO',
    description: 'Descubre la Caza de Recompensas de Móstoles GO durante el Área Silvestre Global 2026.',
  },
  '/missions': {
    title: 'Misiones · Caza de Recompensas · Móstoles GO',
    description: 'Consulta las misiones del sábado y domingo y sigue tu progreso.',
  },
  '/leaderboard': {
    title: 'Clasificación · Caza de Recompensas · Móstoles GO',
    description: 'Consulta la clasificación de cada día.',
  },
  '/rules': {
    title: 'Reglas · Caza de Recompensas · Móstoles GO',
    description: 'Lee las reglas, la verificación presencial y los desempates.',
  },
  '/tools': {
    title: 'Herramientas · Caza de Recompensas · Móstoles GO',
    description: 'Copia el filtro base y aprende a comprobar tus búsquedas de Pokémon GO.',
  },
}

function App() {
  const location = useLocation()
  const currentPath = location.pathname.replace(/\/$/, '') || '/'

  useEffect(() => {
    const metadata = pageMetadata[currentPath] ?? pageMetadata['/']
    document.title = metadata.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description)
    window.scrollTo(0, 0)
  }, [currentPath])

  return (
    <>
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label={`${hunt.name} de ${hunt.organizer}, inicio`}>
          <span className="brand-mark"><CompassMark /></span>
          <span className="brand-text"><strong>{hunt.organizer}</strong><small>CAZA DE RECOMPENSAS</small></span>
        </NavLink>
        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/missions">Misiones</NavLink>
          <NavLink to="/leaderboard">Clasificación</NavLink>
          <NavLink to="/rules">Reglas</NavLink>
          <NavLink to="/tools">Herramientas</NavLink>
        </nav>
      </header>

      <main id="inicio">
        {currentPath !== '/' && <div className="page-masthead"><span>{hunt.event}</span><span>{hunt.dates}</span></div>}
        <Outlet />
      </main>

      <footer className="site-footer"><div className="footer-inner"><div className="footer-brand"><span className="brand-mark"><CompassMark /></span><div><strong>{hunt.name}</strong><span>{hunt.organizer} · {hunt.event} · v{packageInfo.version}</span></div></div><p>La verificación oficial se realiza en persona.</p><a href="#inicio">Volver arriba ↑</a></div></footer>
    </>
  )
}

export default App
