import { useEffect, useRef } from 'react'

type CreatureKind = 'mori' | 'pip' | 'koda' | 'milo'

const mascots: { name: string; kind: CreatureKind; label: string }[] = [
  { name: 'Mori', kind: 'mori', label: 'Research' },
  { name: 'Pip', kind: 'pip', label: 'Writing' },
  { name: 'Koda', kind: 'koda', label: 'Coding' },
  { name: 'Milo', kind: 'milo', label: 'Monitoring' },
]

function Creature({ kind }: { kind: CreatureKind }) {
  const common = {
    stroke: '#24243d',
    strokeWidth: 3.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg viewBox="0 0 120 120" fill="none" role="presentation" aria-hidden="true">
      <ellipse className="creature-shadow" cx="60" cy="105" rx="31" ry="6" fill="#11111f" opacity=".12" />
      {kind === 'mori' && (
        <>
          <path className="creature-antenna" d="M59 28 Q53 17 62 10" stroke="#8BCB69" strokeWidth="4" strokeLinecap="round" />
          <circle className="creature-antenna-tip" cx="63" cy="9" r="6" fill="#B8ED83" stroke="#24243d" strokeWidth="2.5" />
          <path className="creature-body" d="M25 68 C20 49 34 34 50 35 C58 25 79 30 84 41 C101 44 104 66 94 82 C86 96 38 98 27 82 C24 78 23 73 25 68Z" fill="#F5F0E6" {...common} />
          <path d="M35 44 Q43 37 48 43" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".9" />
          <g className="creature-eyes"><circle cx="45" cy="62" r="4.2" fill="#24243d" /><circle cx="73" cy="62" r="4.2" fill="#24243d" /></g>
          <path className="creature-mouth" d="M53 72 Q60 78 67 71" stroke="#24243d" strokeWidth="3" strokeLinecap="round" />
          <circle cx="36" cy="71" r="5" fill="#F4A8A1" opacity=".75" /><circle cx="83" cy="71" r="5" fill="#F4A8A1" opacity=".75" />
          <path d="M84 48 L98 38 L100 54" fill="#DCECCB" {...common} />
          <circle cx="98" cy="38" r="3" fill="#24243d" />
        </>
      )}
      {kind === 'pip' && (
        <>
          <path className="creature-body" d="M60 20 C65 31 79 30 82 42 C99 48 96 70 87 82 C77 95 40 96 30 81 C20 67 27 48 41 42 C43 29 53 29 60 20Z" fill="#FFD56B" {...common} />
          <path className="creature-antenna" d="M59 21 C60 15 66 13 70 18" stroke="#24243d" strokeWidth="3" strokeLinecap="round" />
          <g className="creature-eyes"><circle cx="47" cy="62" r="4" fill="#24243d" /><circle cx="72" cy="62" r="4" fill="#24243d" /></g>
          <path className="creature-mouth" d="M53 71 Q60 78 67 71" stroke="#24243d" strokeWidth="3" strokeLinecap="round" />
          <circle cx="39" cy="70" r="4.5" fill="#F28F91" opacity=".8" /><circle cx="80" cy="70" r="4.5" fill="#F28F91" opacity=".8" />
          <path d="M83 40 L93 30 L95 43" fill="#FFF0B9" {...common} />
          <path d="M26 86 Q20 91 17 85" stroke="#24243d" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {kind === 'koda' && (
        <>
          <path className="creature-body" d="M30 43 Q30 31 43 31 H77 Q91 31 91 45 V76 Q91 91 76 91 H45 Q29 91 29 76Z" fill="#8BC5FF" {...common} />
          <path d="M43 31 L48 22 L56 31 M69 31 L77 22 L80 32" fill="#8BC5FF" {...common} />
          <g className="creature-eyes"><path d="M40 57 Q44 51 49 57 M69 57 Q74 51 78 57" stroke="#24243d" strokeWidth="3.5" strokeLinecap="round" /></g>
          <path className="creature-mouth" d="M52 70 H67" stroke="#24243d" strokeWidth="3" strokeLinecap="round" />
          <rect x="45" y="77" width="30" height="8" rx="4" fill="#4C82C2" />
          <path d="M58 80 L62 80" stroke="#DCEBFF" strokeWidth="2" strokeLinecap="round" />
          <circle className="creature-status-light" cx="90" cy="43" r="5" fill="#C9F36A" stroke="#24243d" strokeWidth="2.5" />
        </>
      )}
      {kind === 'milo' && (
        <>
          <path className="creature-body" d="M60 25 C77 25 91 39 91 57 C91 77 76 91 59 91 C42 91 28 77 28 58 C28 39 42 25 60 25Z" fill="#C6A7FF" {...common} />
          <path className="creature-antenna" d="M60 25 L60 14" stroke="#24243d" strokeWidth="3" strokeLinecap="round" />
          <circle className="creature-antenna-tip" cx="60" cy="12" r="6" fill="#E5D8FF" stroke="#24243d" strokeWidth="2.5" />
          <g className="creature-eyes"><path d="M42 56 Q47 49 52 56 M68 56 Q73 49 78 56" stroke="#24243d" strokeWidth="3.5" strokeLinecap="round" /></g>
          <path className="creature-mouth" d="M52 69 Q60 75 68 69" stroke="#24243d" strokeWidth="3" strokeLinecap="round" />
          <path d="M59 43 L59 35 M54 39 L64 39" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".9" />
          <circle cx="37" cy="69" r="4.5" fill="#F4A8C9" /><circle cx="82" cy="69" r="4.5" fill="#F4A8C9" />
          <path d="M83 82 Q91 85 92 78" stroke="#24243d" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
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
      mascot,
      interaction: mascot.querySelector<HTMLElement>('.hero-mascot-interaction'),
    }))

    let pointer: { x: number; y: number } | null = null
    let frame = 0

    const reset = () => {
      items.forEach(({ interaction }) => {
        if (!interaction) return
        interaction.style.setProperty('--mascot-react-x', '0px')
        interaction.style.setProperty('--mascot-react-y', '0px')
        interaction.style.setProperty('--mascot-react-scale', '1')
        interaction.style.setProperty('--mascot-react-tilt', '0deg')
        interaction.style.setProperty('--mascot-near', '0')
      })
    }

    const update = () => {
      frame = 0
      const currentPointer = pointer
      if (!currentPointer) {
        reset()
        return
      }

      items.forEach(({ mascot, interaction }) => {
        if (!interaction) return
        const bounds = mascot.getBoundingClientRect()
        const dx = currentPointer.x - (bounds.left + bounds.width / 2)
        const dy = currentPointer.y - (bounds.top + bounds.height / 2)
        const distance = Math.hypot(dx, dy)
        const proximity = Math.max(0, 1 - distance / reactionRadius)
        const strength = proximity * proximity * (3 - 2 * proximity)
        const directionX = distance > 0 ? dx / distance : 0
        const directionY = distance > 0 ? dy / distance : 0
        const tilt = Math.max(-10, Math.min(10, dx * 0.08)) * strength

        interaction.style.setProperty('--mascot-react-x', `${directionX * strength * 10}px`)
        interaction.style.setProperty('--mascot-react-y', `${directionY * strength * 10}px`)
        interaction.style.setProperty('--mascot-react-scale', `${1 + strength * 0.16}`)
        interaction.style.setProperty('--mascot-react-tilt', `${tilt}deg`)
        interaction.style.setProperty('--mascot-near', strength.toFixed(3))
      })
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer = { x: event.clientX, y: event.clientY }
      scheduleUpdate()
    }
    const handlePointerLeave = () => {
      pointer = null
      scheduleUpdate()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('blur', handlePointerLeave)
    document.documentElement.addEventListener('mouseleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', handlePointerLeave)
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave)
      if (frame) window.cancelAnimationFrame(frame)
      reset()
    }
  }, [])

  return (
    <span ref={clusterRef} className="hero-mascot-cluster" aria-hidden="true">
      <span className="hero-mascot-surge" />
      {mascots.map((mascot) => (
        <span key={mascot.name} className={`hero-mascot hero-mascot-${mascot.kind}`} data-mascot={mascot.kind}>
          <span className="hero-mascot-interaction">
            <span className="hero-mascot-float">
              <Creature kind={mascot.kind} />
            </span>
          </span>
        </span>
      ))}
    </span>
  )
}
