import { useEffect, useMemo, useRef, useState } from 'react'
import Experience from './Experience'

type AppId = 'welcome' | 'arcade' | 'projects' | 'experience'
type WindowState = { id: AppId; minimized: boolean; z: number; x: number; y: number }
type Repo = { name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; fork: boolean }

const appInfo: Record<AppId, { title: string; icon: string; description: string }> = {
  welcome: { title: 'Welcome.exe', icon: '✦', description: 'about this desktop' },
  arcade: { title: 'Arcade', icon: '🕹️', description: 'play pizzeria math' },
  projects: { title: 'Projects', icon: '📁', description: 'github repositories' },
  experience: { title: 'Experience', icon: '💼', description: 'professional timeline' },
}
const appIds = Object.keys(appInfo) as AppId[]

function App() {
  const [windows, setWindows] = useState<WindowState[]>([{ id: 'welcome', minimized: false, z: 2, x: 0, y: 0 }])
  const [menuOpen, setMenuOpen] = useState(false)
  const [topZ, setTopZ] = useState(3)
  const [repos, setRepos] = useState<Repo[]>([])
  const [repoState, setRepoState] = useState<'loading' | 'ready' | 'error'>('loading')
  const desktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('https://api.github.com/users/andersonom/repos?sort=updated&per_page=100')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('GitHub unavailable'))))
      .then((data: Repo[]) => { setRepos(data.filter((repo) => !repo.fork)); setRepoState('ready') })
      .catch(() => setRepoState('error'))
  }, [])

  const openApp = (id: AppId) => {
    setTopZ((z) => z + 1)
    setWindows((current) => {
      const existing = current.find((item) => item.id === id)
      if (existing) return current.map((item) => item.id === id ? { ...item, minimized: false, z: topZ + 1 } : item)
      return [...current, { id, minimized: false, z: topZ + 1, x: 0, y: 0 }]
    })
    setMenuOpen(false)
  }

  const closeApp = (id: AppId) => setWindows((current) => current.filter((item) => item.id !== id))
  const minimizeApp = (id: AppId) => setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: true } : item))
  const focusApp = (id: AppId) => { setTopZ((z) => z + 1); setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: false, z: topZ + 1 } : item)) }

  const dragWindow = (id: AppId, event: React.PointerEvent<HTMLElement>) => {
    const startX = event.clientX
    const startY = event.clientY
    const windowState = windows.find((item) => item.id === id)
    if (!windowState || window.innerWidth < 700) return
    const move = (moveEvent: PointerEvent) => setWindows((current) => current.map((item) => item.id === id ? { ...item, x: Math.max(-30, windowState.x + moveEvent.clientX - startX), y: Math.max(-20, windowState.y + moveEvent.clientY - startY) } : item))
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const clock = useMemo(() => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }), [])
  const currentTime = clock.format(new Date())

  return <main className="desktop" ref={desktopRef} onPointerDown={() => menuOpen && setMenuOpen(false)}>
    <div className="aurora aurora-one" /><div className="aurora aurora-two" />
    <div className="desktop-grid" aria-label="Área de trabalho">
      {appIds.map((id) => (
        <DesktopIcon key={id} icon={appInfo[id].icon} label={appInfo[id].title} onOpen={() => openApp(id)} />
      ))}
    </div>
    <section className="windows" onPointerDown={(event) => event.stopPropagation()}>
      {windows.map((windowState) => <Window key={windowState.id} state={windowState} onDrag={dragWindow} onFocus={focusApp} onClose={closeApp} onMinimize={minimizeApp} repos={repos} repoState={repoState} />)}
    </section>
    {menuOpen && <StartMenu onOpen={openApp} />}
    <footer className="taskbar" onPointerDown={(event) => event.stopPropagation()}>
      <button className="start-button" onClick={() => setMenuOpen((open) => !open)}><span className="start-mark">✦</span> start</button>
      <div className="task-buttons">{windows.map((item) => <button className={`task-button ${!item.minimized ? 'active' : ''}`} key={item.id} onClick={() => item.minimized ? openApp(item.id) : minimizeApp(item.id)}><span>{appInfo[item.id].icon}</span>{appInfo[item.id].title}</button>)}</div>
      <div className="system-tray"><span className="tray-signal">◉</span><span>{currentTime}</span></div>
    </footer>
  </main>
}

function DesktopIcon({ icon, label, onOpen }: { icon: string; label: string; onOpen: () => void }) {
  return <button className="desktop-icon" onClick={onOpen}><span className="icon-art">{icon}</span><span>{label}</span></button>
}

function StartMenu({ onOpen }: { onOpen: (id: AppId) => void }) {
  return (
    <div className="start-menu" onPointerDown={(event) => event.stopPropagation()}>
      <div className="menu-brand"><span>ANDERSON</span><strong>OS</strong><small>V1.0 · ONLINE</small></div>
      <div className="menu-items">
        {appIds.map((id) => (
          <button key={id} onClick={() => onOpen(id)}>
            <span>{appInfo[id].icon}</span>
            <div><strong>{appInfo[id].title}</strong><small>{appInfo[id].description}</small></div>
          </button>
        ))}
      </div>
      <div className="menu-footer">made with curiosity <span>♥</span></div>
    </div>
  )
}

function Window({ state, onDrag, onFocus, onClose, onMinimize, repos, repoState }: { state: WindowState; onDrag: (id: AppId, event: React.PointerEvent<HTMLElement>) => void; onFocus: (id: AppId) => void; onClose: (id: AppId) => void; onMinimize: (id: AppId) => void; repos: Repo[]; repoState: 'loading' | 'ready' | 'error' }) {
  if (state.minimized) return null
  return <article className={`os-window window-${state.id}`} style={{ zIndex: state.z, transform: `translate(calc(-50% + ${state.x}px), ${state.y}px)` }} onPointerDown={() => onFocus(state.id)}><header className="window-titlebar" onPointerDown={(event) => event.target instanceof HTMLElement && event.target.closest('button') ? undefined : onDrag(state.id, event)}><span><span className="window-icon">{appInfo[state.id].icon}</span>{appInfo[state.id].title}</span><div className="window-actions"><button aria-label="Minimizar" onClick={() => onMinimize(state.id)}>−</button><button aria-label="Fechar" onClick={() => onClose(state.id)}>×</button></div></header><div className="window-body">{state.id === 'welcome' && <Welcome />}{state.id === 'arcade' && <Arcade />}{state.id === 'projects' && <Projects repos={repos} state={repoState} />}{state.id === 'experience' && <Experience />}</div></article>
}

function Welcome() { return <div className="welcome"><div className="welcome-orb">✦</div><div><p className="eyebrow">ANDERSONOS / SYSTEM READY</p><h1>Welcome to<br /><em>my corner</em> of the web.</h1><p className="welcome-copy">Um pequeno desktop para explorar jogos, projetos e ideias. Dê um duplo clique nos ícones ou abra o menu <b>start</b> para começar.</p><div className="status-line"><i /> all systems nominal <span>v1.0.0</span></div></div></div> }
function Arcade() { return <div className="arcade"><div className="arcade-intro"><div><p className="eyebrow">ARCADE / PLAYER 01</p><h2>Pizzeria<br /><span>Math Game</span></h2><p>Teste suas habilidades matemáticas e ajude a pizzaria a manter os pedidos saindo quentinhos.</p></div><span className="coin">✦</span></div><a className="launch-button" href="https://andersonom.github.io/pizzeria-math-game/" target="_blank" rel="noreferrer">Abrir jogo em nova aba <span>↗</span></a><div className="arcade-frame"><iframe src="https://andersonom.github.io/pizzeria-math-game/" title="Pizzeria Math Game" /></div></div> }
function Projects({ repos, state }: { repos: Repo[]; state: 'loading' | 'ready' | 'error' }) { return <div className="projects"><div className="projects-head"><div><p className="eyebrow">GITHUB / ANDERSONOM</p><h2>Selected<br /><em>projects</em></h2></div><a href="https://github.com/andersonom" target="_blank" rel="noreferrer">github ↗</a></div>{state === 'loading' && <p className="loading">conectando ao github...</p>}{state === 'error' && <p className="loading">não foi possível carregar agora. <a href="https://github.com/andersonom">ver no github ↗</a></p>}{state === 'ready' && <div className="repo-list">{repos.map((repo) => <a className="repo-card" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name}><div><strong>{repo.name}</strong><p>{repo.description || 'sem descrição — ainda em construção'}</p></div><span>{repo.language || 'code'} ↗</span></a>)}</div>}</div> }

export default App
