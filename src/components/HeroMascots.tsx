import { useEffect, useRef } from 'react'

type CreatureKind = 'mori' | 'pip' | 'koda' | 'milo'

const mascots: { name: string; kind: CreatureKind; label: string }[] = [
  { name: 'Mori', kind: 'mori', label: 'Research' },
  { name: 'Pip', kind: 'pip', label: 'Writing' },
  { name: 'Koda', kind: 'koda', label: 'Coding' },
  { name: 'Milo', kind: 'milo', label: 'Monitoring' },
]

const FACE = '#2B2F52'

const bodyPaths: Record<CreatureKind, string> = {
  mori: 'M60 20 C47 20 39 33 35 49 C29 64 23 79 27 90 C31 101 47 107 61 107 C75 107 92 100 95 88 C99 75 91 57 84 45 C78 32 72 20 60 20 Z',
  pip: 'M60 22 L74 44 L96 50 L84 72 L80 94 L58 80 L36 92 L34 70 L22 52 L42 44 Z',
  koda: 'M44 26 H76 C90 26 100 36 100 50 V78 C100 91 91 98 78 98 H42 C29 98 20 90 20 78 V50 C20 36 30 26 44 26 Z',
  milo: 'M60 26 C74 26 87 35 92 50 C97 65 93 84 80 93 C66 103 44 101 33 89 C22 77 22 56 31 42 C37 31 47 26 60 26 Z',
}

const bodyPalettes: Record<CreatureKind, [string, string, string]> = {
  mori: ['#FBF4E6', '#EFE3C9', '#DCC9AB'],
  pip: ['#FBD878', '#F2C24B', '#E0AC36'],
  koda: ['#A7C3E6', '#7FA6D6', '#6A8FC0'],
  milo: ['#D6BEE8', '#C0A0DB', '#AE8ECC'],
}

/* Soft-3D collectible rendering: gradient volume, matte grain, studio key light,
   warm ambient occlusion, and a subtle rim light — no hard outlines. */
function Creature({ kind }: { kind: CreatureKind }) {
  const path = bodyPaths[kind]
  const [light, base, shade] = bodyPalettes[kind]

  return (
    <svg viewBox="0 0 120 120" fill="none" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id={`${kind}-body-g`} gradientUnits="userSpaceOnUse" x1="28" y1="22" x2="96" y2="106">
          <stop offset="0" stopColor={light} />
          <stop offset="0.52" stopColor={base} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
        <radialGradient id={`${kind}-key-g`} gradientUnits="userSpaceOnUse" cx="42" cy="36" r="62">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${kind}-ao-g`} gradientUnits="userSpaceOnUse" x1="60" y1="72" x2="60" y2="110">
          <stop offset="0" stopColor="#6B543E" stopOpacity="0" />
          <stop offset="1" stopColor="#6B543E" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={`${kind}-spec-g`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        {kind === 'koda' && (
          <radialGradient id="koda-light-g" cx="0.38" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#E2FCE9" />
            <stop offset="0.55" stopColor="#9AF0B2" />
            <stop offset="1" stopColor="#63C98A" />
          </radialGradient>
        )}
        <filter id={`${kind}-grain`} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" result="g" />
          <feComposite in="g" in2="SourceGraphic" operator="in" result="cg" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="cg" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="60" cy="108" rx="31" ry="5.5" fill="#2B2F52" opacity=".13" />

      {kind === 'mori' && (
        <>
          <g className="creature-antenna-tip">
            <path d="M58 26 C55 19 56 12 61 9" stroke="#8FB257" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M55 15 C47 6 36 5 31 10 C34 18 46 21 55 15 Z" fill="#A9C46B" />
            <path d="M35 11 C39 13 47 14 52 13" stroke="#89AC52" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
            <circle cx="64" cy="8" r="5.5" fill="#F0E3BE" />
            <circle cx="62.2" cy="6.2" r="1.6" fill="#FFFFFF" opacity=".75" />
          </g>
          <g filter={`url(#mori-grain)`}>
            <path d={path} fill={`url(#mori-body-g)`} />
            <path d={path} fill={`url(#mori-ao-g)`} />
            <path d={path} fill={`url(#mori-key-g)`} />
          </g>
          <ellipse cx="43" cy="38" rx="8" ry="5" transform="rotate(-30 43 38)" fill={`url(#mori-spec-g)`} />
          <path d="M24 52 C31 52 36 61 37 73 C28 75 21 65 21 54 C21 52 23 51 24 52 Z" fill="#A9C46B" />
          <path d="M25 57 C28 63 32 69 35 72" stroke="#89AC52" strokeWidth="1.6" strokeLinecap="round" opacity=".75" />
          <g className="creature-eyes">
            <ellipse cx="46" cy="58" rx="4.6" ry="5.8" fill={FACE} />
            <ellipse cx="75" cy="58" rx="4.6" ry="5.8" fill={FACE} />
            <circle cx="44.3" cy="55.8" r="1.35" fill="#FFFFFF" opacity=".9" />
            <circle cx="73.3" cy="55.8" r="1.35" fill="#FFFFFF" opacity=".9" />
          </g>
          <path className="creature-mouth" d="M55 71 Q60.5 75.5 65 70" stroke={FACE} strokeWidth="3" strokeLinecap="round" />
        </>
      )}

      {kind === 'pip' && (
        <>
          <g stroke="#E8B02E" strokeWidth="4" strokeLinecap="round">
            <path d="M26 36 L21 28" />
            <path d="M36 30 L33 21" />
            <path d="M43 38 L41 30" />
          </g>
          <g filter={`url(#pip-grain)`}>
            <path d={path} fill={`url(#pip-body-g)`} stroke={`url(#pip-body-g)`} strokeWidth="16" strokeLinejoin="round" />
            <path d={path} fill={`url(#pip-ao-g)`} stroke={`url(#pip-ao-g)`} strokeWidth="16" strokeLinejoin="round" />
            <path d={path} fill={`url(#pip-key-g)`} stroke={`url(#pip-key-g)`} strokeWidth="16" strokeLinejoin="round" />
          </g>
          <ellipse cx="44" cy="34" rx="8" ry="5" transform="rotate(-32 44 34)" fill={`url(#pip-spec-g)`} />
          <g className="creature-eyes">
            <ellipse cx="45" cy="55" rx="6.4" ry="7.8" fill={FACE} />
            <ellipse cx="73" cy="51" rx="6" ry="7.4" transform="rotate(10 73 51)" fill={FACE} />
            <circle cx="42.8" cy="52.2" r="1.9" fill="#FFFFFF" opacity=".92" />
            <circle cx="71" cy="48.4" r="1.8" fill="#FFFFFF" opacity=".92" />
          </g>
          <path d="M66 38 Q73.5 34 79.5 39.5" stroke={FACE} strokeWidth="3.4" strokeLinecap="round" />
          <path
            className="creature-mouth"
            d="M50 69 C50 64 66 64 66 70.5 C66 78 58 81.5 53 76.5 C51 74.5 50 71.5 50 69 Z"
            fill={FACE}
          />
          <path d="M53.5 75 C54.5 79.5 63 79.5 64.5 75 C62 73 55.5 73 53.5 75 Z" fill="#E8837C" />
        </>
      )}

      {kind === 'koda' && (
        <>
          <g fill="#6E97CC">
            <path d="M36 90 C36 86 50 86 50 90 V103 C50 107 36 107 36 103 Z" />
            <path d="M70 90 C70 86 84 86 84 90 V103 C84 107 70 107 70 103 Z" />
          </g>
          <ellipse cx="90" cy="75" rx="11.5" ry="13" fill="#9AF0B2" opacity=".22" />
          <g filter={`url(#koda-grain)`}>
            <path d={path} fill={`url(#koda-body-g)`} />
            <path d={path} fill={`url(#koda-ao-g)`} />
            <path d={path} fill={`url(#koda-key-g)`} />
          </g>
          <ellipse cx="40" cy="38" rx="9" ry="5.5" transform="rotate(-28 40 38)" fill={`url(#koda-spec-g)`} />
          <g className="creature-eyes">
            <ellipse cx="44" cy="59" rx="8" ry="6.8" fill="#FBF7F2" />
            <ellipse cx="76" cy="59" rx="8" ry="6.8" fill="#FBF7F2" />
            <circle cx="44" cy="61.3" r="2.9" fill={FACE} />
            <circle cx="76" cy="61.3" r="2.9" fill={FACE} />
            <path d="M35.5 55.2 C35.5 48 52.5 48 52.5 55.2 L52.5 58.2 C48.5 54.8 39.5 54.8 35.5 58.2 Z" fill={FACE} />
            <path d="M67.5 55.2 C67.5 48 84.5 48 84.5 55.2 L84.5 58.2 C80.5 54.8 71.5 54.8 67.5 58.2 Z" fill={FACE} />
          </g>
          <path className="creature-mouth" d="M55 72.5 H63" stroke={FACE} strokeWidth="3" strokeLinecap="round" />
          <g className="creature-status-light">
            <ellipse cx="90" cy="75" rx="5.5" ry="7.5" fill="url(#koda-light-g)" />
            <circle cx="88" cy="71.6" r="1.3" fill="#FFFFFF" opacity=".85" />
          </g>
        </>
      )}

      {kind === 'milo' && (
        <>
          <g className="creature-antenna-tip">
            <path d="M55 29 C55 24 68 24 68 29" fill="#A98BC8" />
            <path d="M62 27 L65 17" stroke="#A98BC8" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M72 12 L73.5 6" stroke="#A98BC8" strokeWidth="2.2" strokeLinecap="round" />
            <g transform="rotate(-22 68 14)">
              <ellipse cx="68" cy="14" rx="14" ry="6" fill="#C4A5DE" />
              <ellipse cx="69.4" cy="15.4" rx="10" ry="3.8" fill="#9B79BF" />
              <path d="M55 11.8 C60 8.8 76 8.8 81 11.8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity=".4" />
            </g>
            <circle cx="73.8" cy="5.2" r="3.2" fill="#C4A5DE" />
            <circle cx="72.8" cy="4.2" r="1.1" fill="#FFFFFF" opacity=".8" />
          </g>
          <g fill="#B08FCB">
            <ellipse cx="28" cy="64" rx="7" ry="8" />
            <ellipse cx="94" cy="68" rx="7" ry="8" />
          </g>
          <g filter={`url(#milo-grain)`}>
            <path d={path} fill={`url(#milo-body-g)`} />
            <path d={path} fill={`url(#milo-ao-g)`} />
            <path d={path} fill={`url(#milo-key-g)`} />
          </g>
          <ellipse cx="42" cy="38" rx="8" ry="5" transform="rotate(-30 42 38)" fill={`url(#milo-spec-g)`} />
          <ellipse cx="37" cy="67" rx="5" ry="3" fill="#D989B8" opacity=".3" />
          <ellipse cx="86" cy="65" rx="5" ry="3" fill="#D989B8" opacity=".3" />
          <g className="creature-eyes">
            <ellipse cx="47" cy="56" rx="7.5" ry="8.5" fill="#FBF7F2" />
            <ellipse cx="76" cy="54" rx="7.5" ry="8.5" fill="#FBF7F2" />
            <circle cx="45" cy="52.5" r="4" fill={FACE} />
            <circle cx="74" cy="50.5" r="4" fill={FACE} />
            <circle cx="43.5" cy="51" r="1.35" fill="#FFFFFF" opacity=".9" />
            <circle cx="72.5" cy="49" r="1.35" fill="#FFFFFF" opacity=".9" />
          </g>
          <path className="creature-mouth" d="M55 70 Q60.5 74.5 65.5 69" stroke={FACE} strokeWidth="3" strokeLinecap="round" />
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
