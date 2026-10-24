import { useEffect, useRef } from 'react'

type CreatureKind = 'mori' | 'pip' | 'koda' | 'milo'

const mascots: { name: string; kind: CreatureKind; label: string }[] = [
  { name: 'Mori', kind: 'mori', label: 'Research' },
  { name: 'Pip', kind: 'pip', label: 'Writing' },
  { name: 'Koda', kind: 'koda', label: 'Coding' },
  { name: 'Milo', kind: 'milo', label: 'Monitoring' },
]

function MaterialDefs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-cream`} cx="28%" cy="18%" r="82%">
        <stop offset="0" stopColor="#fffef9" />
        <stop offset=".32" stopColor="#f8f3e8" />
        <stop offset=".7" stopColor="#e5daca" />
        <stop offset="1" stopColor="#b9aa98" />
      </radialGradient>
      <radialGradient id={`${id}-gold`} cx="26%" cy="15%" r="84%">
        <stop offset="0" stopColor="#fff4bd" />
        <stop offset=".3" stopColor="#ffe17c" />
        <stop offset=".68" stopColor="#efb93e" />
        <stop offset="1" stopColor="#bd7927" />
      </radialGradient>
      <radialGradient id={`${id}-blue`} cx="24%" cy="15%" r="88%">
        <stop offset="0" stopColor="#e2f4ff" />
        <stop offset=".28" stopColor="#a6d8ff" />
        <stop offset=".68" stopColor="#6aabeb" />
        <stop offset="1" stopColor="#3e6da8" />
      </radialGradient>
      <radialGradient id={`${id}-lilac`} cx="25%" cy="14%" r="86%">
        <stop offset="0" stopColor="#f6edff" />
        <stop offset=".3" stopColor="#d7c0ff" />
        <stop offset=".7" stopColor="#a78ae4" />
        <stop offset="1" stopColor="#7354ae" />
      </radialGradient>
      <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".82" />
        <stop offset=".42" stopColor="#fff" stopOpacity=".12" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".35" />
        <stop offset=".55" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#241d39" stopOpacity=".18" />
      </linearGradient>
      <filter id={`${id}-shadow`} x="-45%" y="-40%" width="190%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
        <feOffset dy="5" />
        <feComponentTransfer><feFuncA type="linear" slope=".24" /></feComponentTransfer>
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.1" />
      </filter>
    </defs>
  )
}

function Creature({ kind }: { kind: CreatureKind }) {
  const id = `gmda-${kind}`
  const fills = { mori: `url(#${id}-cream)`, pip: `url(#${id}-gold)`, koda: `url(#${id}-blue)`, milo: `url(#${id}-lilac)` }
  const fill = fills[kind]
  return (
    <svg viewBox="0 0 160 160" fill="none" role="presentation" aria-hidden="true">
      <MaterialDefs id={id} />
      <ellipse cx="80" cy="137" rx="42" ry="9" fill="#080817" opacity=".2" filter={`url(#${id}-soft)`} />
      {kind === 'mori' && <g className="creature-antenna"><path d="M78 42 Q66 27 76 17" stroke="#5c9a4c" strokeWidth="7" strokeLinecap="round"/><circle cx="78" cy="16" r="9" fill="#a6df7e"/><circle cx="75" cy="13" r="3" fill="#efffe2"/></g>}
      {kind === 'milo' && <g className="creature-antenna"><path d="M81 40 L82 25" stroke="#6d579d" strokeWidth="6" strokeLinecap="round"/><circle cx="82" cy="20" r="9" fill="#eee3ff"/><circle cx="79" cy="17" r="3" fill="#fff"/></g>}
      <g filter={`url(#${id}-shadow)`}>
        {kind === 'mori' && <path className="creature-body" d="M35 88 C29 66 43 49 61 49 C71 35 94 39 101 51 C124 50 137 72 126 96 C118 119 52 126 37 105 C33 100 32 94 35 88Z" fill={fill}/>}
        {kind === 'pip' && <path className="creature-body" d="M81 35 C89 48 104 48 109 61 C130 67 132 89 120 107 C106 126 57 127 41 108 C25 90 35 67 51 61 C54 47 66 45 81 35Z" fill={fill}/>}
        {kind === 'koda' && <path className="creature-body" d="M46 52 Q46 40 60 40 H101 Q116 40 116 55 V101 Q116 117 100 117 H62 Q45 117 45 101Z" fill={fill}/>}
        {kind === 'milo' && <path className="creature-body" d="M81 39 C105 39 123 58 123 82 C123 106 104 123 81 123 C57 123 38 105 38 82 C38 58 57 39 81 39Z" fill={fill}/>}
        <path d={kind === 'koda' ? 'M51 54 Q51 45 62 45 H99 Q109 45 109 56 V69 Q80 62 51 72Z' : 'M43 79 C43 59 58 48 73 48 C60 54 53 66 54 80 C55 99 70 113 89 115 C68 119 47 104 43 90Z'} fill={`url(#${id}-shine)`} opacity=".8"/>
        <path d={kind === 'koda' ? 'M47 58 Q47 42 62 42 H100 Q114 42 114 57 V101 Q114 114 100 114 H62 Q48 114 48 101Z' : kind === 'pip' ? 'M81 35 C89 48 104 48 109 61 C130 67 132 89 120 107 C106 126 57 127 41 108 C25 90 35 67 51 61 C54 47 66 45 81 35Z' : kind === 'mori' ? 'M35 88 C29 66 43 49 61 49 C71 35 94 39 101 51 C124 50 137 72 126 96 C118 119 52 126 37 105 C33 100 32 94 35 88Z' : 'M81 39 C105 39 123 58 123 82 C123 106 104 123 81 123 C57 123 38 105 38 82 C38 58 57 39 81 39Z'} fill={`url(#${id}-edge)`} opacity=".9"/>
        {kind === 'mori' && <path d="M45 63 Q50 53 62 54" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".8"/>}
        {kind === 'pip' && <path d="M50 75 Q54 63 66 62" stroke="#fff9d9" strokeWidth="4" strokeLinecap="round" opacity=".8"/>}
        {kind === 'koda' && <path d="M59 50 H80" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".7"/>}
        {kind === 'milo' && <path d="M51 65 Q60 49 76 49" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".8"/>}
        <g className="creature-eyes" fill="#29233e">
          {kind === 'koda' ? <><ellipse cx="65" cy="78" rx="5" ry="7"/><ellipse cx="96" cy="78" rx="5" ry="7"/></> : <><ellipse cx="64" cy={kind === 'milo' ? 78 : 81} rx="5" ry="7"/><ellipse cx="96" cy={kind === 'milo' ? 78 : 81} rx="5" ry="7"/></>}
        </g>
        <circle cx="62" cy="78" r="1.7" fill="#fff" opacity=".95"/><circle cx="94" cy="78" r="1.7" fill="#fff" opacity=".95"/>
        <path className="creature-mouth" d={kind === 'koda' ? 'M71 94 Q80 97 89 94' : 'M72 97 Q80 105 89 97'} stroke="#44324b" strokeWidth="3.2" strokeLinecap="round"/>
        <ellipse cx="51" cy="94" rx="7" ry="4.5" fill="#f29da6" opacity=".58"/><ellipse cx="109" cy="94" rx="7" ry="4.5" fill="#f29da6" opacity=".58"/>
        {kind === 'koda' && <g><rect x="63" y="104" width="34" height="7" rx="3.5" fill="#376da8" opacity=".8"/><circle className="creature-status-light" cx="112" cy="53" r="5" fill="#d8ff78"/></g>}
        {kind === 'milo' && <path d="M80 60 V53 M76 56.5 H84" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".8"/>}
      </g>
      <ellipse cx="63" cy="120" rx="17" ry="3" fill="#fff" opacity=".12" filter={`url(#${id}-soft)`}/>
    </svg>
  )
}

const reactionRadius = 170

export function HeroMascots() {
  const clusterRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reducedMotion.matches || !precisePointer.matches) return
    const items = Array.from(cluster.querySelectorAll<HTMLElement>('.hero-mascot')).map((mascot) => ({
      mascot, interaction: mascot.querySelector<HTMLElement>('.hero-mascot-interaction'),
    }))
    let pointer: { x: number; y: number } | null = null
    let frame = 0
    const reset = () => items.forEach(({ interaction }) => {
      if (!interaction) return
      interaction.style.setProperty('--mascot-react-x', '0px')
      interaction.style.setProperty('--mascot-react-y', '0px')
      interaction.style.setProperty('--mascot-react-scale', '1')
      interaction.style.setProperty('--mascot-react-tilt', '0deg')
      interaction.style.setProperty('--mascot-near', '0')
    })
    const update = () => {
      frame = 0
      if (!pointer) { reset(); return }
      items.forEach(({ mascot, interaction }) => {
        if (!interaction) return
        const bounds = mascot.getBoundingClientRect()
        const dx = pointer!.x - (bounds.left + bounds.width / 2)
        const dy = pointer!.y - (bounds.top + bounds.height / 2)
        const distance = Math.hypot(dx, dy)
        const proximity = Math.max(0, 1 - distance / reactionRadius)
        const strength = proximity * proximity * (3 - 2 * proximity)
        interaction.style.setProperty('--mascot-react-x', `${(distance ? dx / distance : 0) * strength * 8}px`)
        interaction.style.setProperty('--mascot-react-y', `${(distance ? dy / distance : 0) * strength * 8}px`)
        interaction.style.setProperty('--mascot-react-scale', `${1 + strength * .12}`)
        interaction.style.setProperty('--mascot-react-tilt', `${Math.max(-8, Math.min(8, dx * .06)) * strength}deg`)
        interaction.style.setProperty('--mascot-near', strength.toFixed(3))
      })
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    const move = (event: PointerEvent) => { if (event.pointerType !== 'touch') { pointer = { x: event.clientX, y: event.clientY }; schedule() } }
    const leave = () => { pointer = null; schedule() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', leave)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('blur', leave)
      document.documentElement.removeEventListener('mouseleave', leave)
      if (frame) window.cancelAnimationFrame(frame)
      reset()
    }
  }, [])

  return (
    <span ref={clusterRef} className="hero-mascot-cluster" aria-hidden="true">
      <span className="hero-mascot-surge" />
      {mascots.map(({ name, kind }) => (
        <span key={name} className={`hero-mascot hero-mascot-${kind}`} data-mascot={kind}>
          <span className="hero-mascot-interaction">
            <span className="hero-mascot-float"><Creature kind={kind} /></span>
          </span>
        </span>
      ))}
    </span>
  )
}
