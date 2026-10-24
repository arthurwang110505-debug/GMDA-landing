import { useEffect, useRef } from 'react'

const mascots = [
  { name: 'ink', src: '/gmda-mascot-ink.svg' },
  { name: 'coral', src: '/gmda-mascot-coral.svg' },
  { name: 'spark', src: '/gmda-mascot-spark.svg' },
  { name: 'blush', src: '/gmda-mascot-blush.svg' },
  { name: 'lime', src: '/gmda-mascot-lime.svg' },
] as const

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
        <span key={mascot.name} className={`hero-mascot hero-mascot-${mascot.name}`}>
          <span className="hero-mascot-interaction">
            <span className="hero-mascot-float">
              <img src={mascot.src} alt="" width="256" height="256" draggable={false} />
            </span>
          </span>
        </span>
      ))}
    </span>
  )
}
