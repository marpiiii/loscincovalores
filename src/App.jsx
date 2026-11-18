import { useEffect, useRef, useState } from 'react'
import './App.css'

const values = [
  { id: 'respeto', title: 'Respeto', gemTitle: 'Gema del Respeto', color: '#39b9f3', bg: '#a5e9ff', image: '/assets/gem-water-fast.png', description: 'Escuchar, cuidar las cosas y respetar el turno de cada quien nos ayuda a convivir mejor.' },
  { id: 'empatia', title: 'Empatía', gemTitle: 'Gema de la Empatía', color: '#f04486', bg: '#ffb0cf', image: '/assets/gem-heart-fast.png', description: 'Ponernos en el lugar de alguien nos enseña a acompañar, escuchar y compartir.' },
  { id: 'equipo', title: 'Trabajo en equipo', gemTitle: 'Gema del Trabajo en equipo', color: '#53b943', bg: '#b9f58a', image: '/assets/gem-leaf-fast.png', description: 'Al colaborar, cada persona aporta algo especial para alcanzar una meta común.' },
  { id: 'responsabilidad', title: 'Responsabilidad', gemTitle: 'Gema de la Responsabilidad', color: '#f4a524', bg: '#ffdb76', image: '/assets/gem-star-fast.png', description: 'Cumplir nuestras tareas y cuidar lo que nos rodea mantiene viva la magia.' },
  { id: 'honestidad', title: 'Honestidad', gemTitle: 'Gema de la Honestidad', color: '#a83ef0', bg: '#dfaaff', image: '/assets/gem-cube-fast.png', description: 'Decir la verdad y actuar con sinceridad construye confianza con nuestros amigos.' },
]
const characters = [
  ['Juju', 'Jugadora / todos los mundos', 'Es la niña aventurera que recorre el Bosque Central, conoce sus comunidades y practica los valores junto a sus habitantes.'],
  ['Axel', 'Guía / plaza y mundos 1–5', 'Acompaña al jugador, explica los objetivos y conecta cada aventura con el valor que se aprende.'],
  ['Pedro', 'Academia del Bosque · respeto', 'Amigo de la Academia. Cuida los materiales del salón y pide ayuda para encontrarlos y guardarlos en su lugar.'],
  ['Lupita', 'Academia del Bosque · respeto', 'Pequeña amiga que disfruta el columpio y aprende a esperar su turno con calma.'],
  ['Tomás', 'Academia del Bosque · respeto', 'Compañero de la Academia. Valora que lo escuchen y enseña respeto al prestar atención a los demás.'],
  ['Maestra Lechuza', 'Academia del Bosque · respeto', 'Guía de la Academia que acompaña las actividades de aprendizaje y convivencia.'],
  ['Abuela Tortuga', 'Rincón de la Empatía', 'Guía del rincón. Invita a escuchar los sentimientos, acompañar a Beto y compartir la merienda.'],
  ['Beto', 'Rincón de la Empatía · aldea del río', 'Amigo que busca a Mora, su osito. Su historia enseña a notar la tristeza y acompañar a quien la siente.'],
  ['Nico', 'Rincón de la Empatía', 'Amigo de Beto que participa en la merienda. Aprende a compartir para que todos reciban una parte justa.'],
  ['Mimi', 'Rincón de la Empatía', 'Amiga que comparte la merienda con los demás. La actividad enseña a repartir por igual.'],
  ['Doña Nutria', 'Huerto Responsable · aldea del río', 'Cuida las tareas de la comunidad e invita a ordenar, cuidar las plantas y cumplir una rutina.'],
  ['Chispa', 'Huerto Responsable · aldea del río', 'Amiga que necesita ordenar sus pertenencias y organizar las actividades de su día.'],
  ['Don Topo', 'Huerto Responsable · aldea del río', 'Vecino trabajador que ayuda con el huerto, aporta materiales y colabora en reparaciones en equipo.'],
  ['Doña Ardilla', 'Mercado Honesto', 'Organiza el mercado. Pide ayuda para devolver una bolsita perdida y resolver los pedidos con honestidad.'],
  ['Timo Tejón', 'Mercado Honesto', 'Cliente del mercado que pierde su bolsita. Su misión enseña a devolver algo que pertenece a otra persona.'],
  ['Lila Coneja', 'Mercado Honesto', 'Ayuda a preparar pedidos y a corregir una entrega cuando ocurre un error.'],
]
const iconPaths = {
  spark: 'M12 2l2.15 6.85L21 11l-6.85 2.15L12 20l-2.15-6.85L3 11l6.85-2.15L12 2z',
}
function Icon({ name, size = 18 }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d={iconPaths[name]} /></svg>
}
function App() {
  const [selectedId, setSelectedId] = useState('honestidad')
  const [character, setCharacter] = useState(0)
  const [carouselEnabled, setCarouselEnabled] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const makeDeck = () => [...values, ...values].map((value, index) => ({ ...value, cardId: `${value.id}-${index}` })).sort(() => Math.random() - 0.5)
  const [memoryDeck, setMemoryDeck] = useState(makeDeck)
  const [memoryOpen, setMemoryOpen] = useState([])
  const [memoryMatched, setMemoryMatched] = useState([])
  const [memoryMoves, setMemoryMoves] = useState(0)
  const memoryTimer = useRef(null)
  const pageRef = useRef(null)
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setCarouselEnabled(!motion.matches)
    updateMotion()
    motion.addEventListener('change', updateMotion)
    return () => motion.removeEventListener('change', updateMotion)
  }, [])
  useEffect(() => {
    const sections = pageRef.current?.querySelectorAll('.scroll-reveal')
    if (!sections?.length) return undefined
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!carouselEnabled) return undefined
    const timer = window.setInterval(() => setCharacter((index) => (index + 1) % characters.length), 5000)
    return () => window.clearInterval(timer)
  }, [carouselEnabled])
  const selected = values.find((value) => value.id === selectedId)
  const otherValues = values.filter((value) => value.id !== selectedId)
  const characterInfo = characters[character]
  const nextCharacter = (character + 1) % characters.length
  const flipMemoryCard = (card) => {
    if (memoryOpen.length === 2 || memoryOpen.includes(card.cardId) || memoryMatched.includes(card.id)) return
    const nextOpen = [...memoryOpen, card.cardId]
    setMemoryOpen(nextOpen)
    if (nextOpen.length === 2) {
      setMemoryMoves((moves) => moves + 1)
      const first = memoryDeck.find((item) => item.cardId === nextOpen[0])
      if (first.id === card.id) {
        setMemoryMatched((matched) => [...matched, card.id])
        setMemoryOpen([])
      } else {
        memoryTimer.current = window.setTimeout(() => setMemoryOpen([]), 850)
      }
    }
  }
  const resetMemory = () => {
    window.clearTimeout(memoryTimer.current)
    setMemoryDeck(makeDeck())
    setMemoryOpen([])
    setMemoryMatched([])
    setMemoryMoves(0)
  }
  return <div className="site-shell" ref={pageRef}>
    <header className="topbar">
      <a className="brand" href="#inicio"><span className="brand-icon"><Icon name="spark" size={17}/></span><span>LosValores</span></a>
      <button className="menu-toggle" type="button" aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileMenuOpen} aria-controls="main-navigation" onClick={() => setMobileMenuOpen((open) => !open)}><span/><span/><span/></button>
      <nav id="main-navigation" className={mobileMenuOpen ? 'mobile-open' : ''} aria-label="Navegación principal">{[['#inicio','Inicio'],['#historia','La historia'],['#gemas','Las gemas'],['#personajes','Personajes'],['#aprendizaje','Aprendizajes']].map(([href,label])=><a href={href} key={href} onClick={()=>setMobileMenuOpen(false)}>{label}</a>)}</nav>
    </header>
    <main>
      <section className="hero-section" id="inicio"><div className="game-stage"><div className="hero-copy"><h1>¡Devuelve la <em>magia</em><br/>a la aldea!</h1><p className="hero-text">Explora, supera desafíos y recupera las cinco gemas para devolverle la magia a la aldea.</p><div className="hero-actions"><a className="primary-button inline-flex items-center gap-3 rounded-full transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4" href="#historia">Comienza la aventura</a></div></div><div className="hero-art"><div className="hero-disc disc-pink"/><div className="hero-disc disc-yellow"/><div className="hero-disc disc-blue"/><img src="/assets/tree-home-fast.png" fetchPriority="high" decoding="async" alt="La casa del bosque donde comienza la aventura"/><span className="hero-star star-one">✦</span><span className="hero-star star-two">✧</span><span className="hero-star star-three">✳</span></div></div><div className="hero-gems" aria-label="Gemas de la aventura">{values.map((value,index)=><a href="#gemas" key={value.id} onClick={()=>setSelectedId(value.id)} className={`hero-gem hero-gem-${index}`} aria-label={`Ver gema: ${value.title}`}><img src={value.image} decoding="async" alt=""/></a>)}</div><span className="hero-deco deco-a">✦</span><span className="hero-deco deco-b">✳</span></section>
      <section className="story-section scroll-reveal" id="historia"><div className="story-card"><div className="story-image"><div className="book-spotlight"/><img src="/assets/storybook-fast.png" loading="lazy" decoding="async" alt="El libro encantado muestra la aldea y las cinco gemas"/><span className="book-sticker">Mundo</span></div><div className="story-copy"><p className="eyebrow">Historia</p><h2>El secreto de<br/><span>las 5 gemas</span></h2><p>En lo profundo del bosque, una aldea vivía en armonía gracias a cinco gemas mágicas que representaban valores esenciales: respeto, honestidad, empatía, trabajo en equipo y responsabilidad.</p><p>Un día, las gemas desaparecieron y la magia del bosque comenzó a desvanecerse. Ahora deberás superar desafíos y recuperarlas para devolver la armonía a la aldea.</p><a href="#gemas">¿Podrás recuperar su magia?</a></div></div></section>
      <section className="gems-section scroll-reveal" id="gemas"><div className="section-heading"><h2>Las Gemas</h2><p>Cada gema guarda el poder de un valor que mantiene viva la magia de la aldea. Descubre qué representa cada una y cómo sus enseñanzas nos ayudan a construir una mejor convivencia.</p></div><div className="gem-catalog"><div className="gem-grid">{otherValues.map((value,index)=><button className={`gem-tile gem-tile-${index}`} key={value.id} style={{'--tile-bg':value.bg,'--gem-color':value.color}} onClick={()=>setSelectedId(value.id)}><span className="tile-index">0{index+1}</span><span className="tile-title">{value.gemTitle}</span><img src={value.image} loading="lazy" decoding="async" alt=""/></button>)}</div><article className="featured-gem-card" key={selected.id} style={{'--tile-bg':selected.bg,'--gem-color':selected.color}}><div className="feature-orbit"/><h3>{selected.gemTitle}</h3><p>{selected.description}</p><img src={selected.image} loading="lazy" decoding="async" alt={`Gema del valor ${selected.title}`}/></article></div><div className="gem-sparkle-trail" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i><i>✧</i><i>✦</i></div></section>
      <section className="characters-section scroll-reveal" id="personajes" aria-roledescription="carrusel" aria-label="Personajes de la aventura"><div className="character-layout"><div className="character-copy" key={character}><h2>{characterInfo[0]}</h2><p className="character-role">{characterInfo[1]}</p><p className="character-description">{characterInfo[2]}</p></div><div className="character-carousel"><div className="character-halo"/><div className="portrait portrait-back portrait-back-left"><img src={`/assets/characters/character-${(character+characters.length-1)%characters.length+1}.png`} alt="" loading="lazy" decoding="async"/></div><div className="portrait portrait-main" key={character}><img src={`/assets/characters/character-${character+1}.png`} alt={characterInfo[0]} loading="lazy" decoding="async"/><span>{characterInfo[0]}</span><span className="portrait-level">PERSONAJE {String(character+1).padStart(2,'0')}</span></div><div className="portrait portrait-back portrait-back-right" key={nextCharacter}><img src={`/assets/characters/character-${nextCharacter+1}.png`} alt="" loading="lazy" decoding="async"/></div><span className="carousel-star star-left">✦</span><span className="carousel-star star-right">✧</span></div></div></section>
      <section className="learning-section scroll-reveal" id="aprendizaje"><div className="learning-copy"><h2>Lo que aprendemos<em>...</em></h2><p className="learning-intro">Los valores hacen la diferencia. Nos ayudan a convivir, comprender a los demás y construir una comunidad mejor.</p><div className="learning-point"><span className="point-icon"><Icon name="spark" size={16}/></span><div><h3>Aprender para la vida</h3><p>El respeto, la honestidad, la empatía, la responsabilidad y el trabajo en equipo comienzan con pequeñas acciones.</p></div></div><div className="learning-point"><span className="point-icon point-icon-pink"><Icon name="spark" size={15}/></span><div><h3>Nuestra enseñanza</h3><p>Cada acción cuenta. ¡Lleva estos valores contigo y haz brillar tu mundo!</p></div></div></div><div className="learning-art"><img src="/assets/bosque-mapa-fast.jpg" loading="lazy" decoding="async" alt="Mapa pixel art de la aldea, sus senderos y la plaza de las cinco gemas"/></div><div className="learning-gems" aria-hidden="true">{values.map((value,index)=><img className={`learn-gem learn-gem-${index}`} key={value.id} src={value.image} loading="lazy" decoding="async" alt=""/>)}</div></section>
      <section className="memory-section scroll-reveal" aria-labelledby="memory-title"><div className="memory-heading"><div><p className="eyebrow">Reto extra</p><h2 id="memory-title">Memorama de gemas</h2><p>Encuentra las cinco parejas y devuelve su brillo al bosque.</p></div><div className="memory-score"><span>Intentos</span><b>{memoryMoves}</b></div></div><div className="memory-grid">{memoryDeck.map((card) => { const revealed = memoryOpen.includes(card.cardId) || memoryMatched.includes(card.id); return <button className={`memory-card${revealed ? ' is-flipped' : ''}${memoryMatched.includes(card.id) ? ' is-matched' : ''}`} key={card.cardId} onClick={() => flipMemoryCard(card)} aria-label={revealed ? card.title : 'Voltear carta'} disabled={memoryMatched.includes(card.id)}><span className="memory-card-inner"><span className="memory-back">✦</span><span className="memory-front"><img src={card.image} loading="lazy" decoding="async" alt=""/><b>{card.title}</b></span></span></button> })}</div><div className="memory-footer"><span>{memoryMatched.length === values.length ? '¡Memoria restaurada! ✨' : 'Toca dos cartas para encontrar una pareja'}</span><button className="memory-reset" onClick={resetMemory}>Jugar de nuevo</button></div></section>
    </main><footer className="site-footer"><div className="footer-main"><a className="footer-mark" href="#inicio" aria-label="LosValores, ir al inicio"><span>✦</span><b>LosValores</b></a><nav aria-label="Enlaces del pie"><a href="#historia">Historia</a><a href="#gemas">Las gemas</a><a href="#personajes">Personajes</a><a href="#aprendizaje">Lo que aprendemos</a></nav></div><div className="footer-bottom"><span>© LosValores</span></div></footer>
  </div>
}
export default App


