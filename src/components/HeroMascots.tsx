import { useEffect, useRef } from 'react'
import { PixelMascot } from './PixelMascot'
import type { MascotId } from '../data/mascots'

/**
 * Four identity slots around the headline. Position, rotation and float delay
 * are declared in CSS via `hero-mascot-${id}`; the character artwork itself
 * comes from the shared pixel maps in `src/data/mascots.ts`.
 */
const heroSlots: { id: MascotId; blinkDelay: number }[] = [
  { id: 'mori', blinkDelay: 0 },
  { id: 'pip', blinkDelay: -1.3 },
  { id: 'koda', blinkDelay: -2.7 },
  { id: 'milo', blinkDelay: -4.1 },
]

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
      {heroSlots.map(({ id, blinkDelay }) => (
        <span key={id} className={`hero-mascot hero-mascot-${id}`}>
          <span className="hero-mascot-interaction">
            <span className="hero-mascot-float">
              <PixelMascot id={id} animated blinkDelay={blinkDelay} />
            </span>
          </span>
        </span>
      ))}
    </span>
  )
}
