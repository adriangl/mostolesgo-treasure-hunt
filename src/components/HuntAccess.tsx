import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useHuntPlayer } from '../hooks/useHuntPlayer'

interface HuntAccessProps {
  player: ReturnType<typeof useHuntPlayer>
  title: string
  sectionLabel: string
}

export function HuntAccess({ player, title, sectionLabel }: HuntAccessProps) {
  const [nickname, setNickname] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void player.join(nickname)
  }

  return (
    <section className="access-section section-shell" aria-labelledby="access-title">
      <div className="access-card">
        <p className="section-kicker">{sectionLabel}</p>
        <h1 id="access-title">{title}</h1>
        {player.status === 'loading' && <p role="status">Cargando tu sesión…</p>}
        {player.status === 'error' && (
          <div className="access-message" role="alert">
            <p>{player.message}</p>
            <button type="button" className="button-primary" onClick={() => void player.refresh()}>Reintentar</button>
          </div>
        )}
        {(player.status === 'guest' || player.status === 'joining') && (
          <>
            <p>Elige un apodo para guardar tus misiones y aparecer en la clasificación de cada día.</p>
            <form className="nickname-form" onSubmit={submit}>
              <label htmlFor="nickname">Tu apodo</label>
              <div className="nickname-row">
                <input id="nickname" name="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} minLength={2} maxLength={24} autoComplete="nickname" required disabled={player.status === 'joining'} />
                <button type="submit" className="button-primary" disabled={player.status === 'joining'}>{player.status === 'joining' ? 'Entrando…' : 'Empezar'}</button>
              </div>
            </form>
            {player.message && <p className="form-error" role="alert">{player.message}</p>}
            <p className="access-note">Tu sesión anónima se conserva en este navegador. Si borras sus datos o cambias de dispositivo, no podrás recuperar este apodo ni tu progreso.</p>
          </>
        )}
        <Link to="/rules">Leer las reglas</Link>
      </div>
    </section>
  )
}
