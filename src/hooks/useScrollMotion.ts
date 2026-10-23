import { useEffect, useRef, useState } from 'react'

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function useHeroScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      if (reducedMotion.matches) {
        element.style.removeProperty('--hero-scroll')
        return
      }

      const rect = element.getBoundingClientRect()
      const progress = clamp((76 - rect.top) / (rect.height * 0.85))
      element.style.setProperty('--hero-scroll', progress.toFixed(4))
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    reducedMotion.addEventListener('change', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      reducedMotion.removeEventListener('change', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return ref
}

export function useWorkflowScroll(stepCount: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!container || !viewport || !track) return

    const motionQuery = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let currentStep = 0

    const update = () => {
      frame = 0

      if (!motionQuery.matches) {
        track.style.transform = 'none'
        container.style.removeProperty('--workflow-progress')
        if (currentStep !== 0) {
          currentStep = 0
          setActiveStep(0)
        }
        return
      }

      const rect = container.getBoundingClientRect()
      const distance = Math.max(1, container.offsetHeight - window.innerHeight)
      const progress = clamp((76 - rect.top) / distance)
      const travel = Math.max(0, track.scrollWidth - viewport.clientWidth)

      track.style.transform = `translate3d(${-progress * travel}px, 0, 0)`
      container.style.setProperty('--workflow-progress', progress.toFixed(4))

      const nextStep = Math.min(stepCount - 1, Math.round(progress * (stepCount - 1)))
      if (nextStep !== currentStep) {
        currentStep = nextStep
        setActiveStep(nextStep)
      }
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    motionQuery.addEventListener('change', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      motionQuery.removeEventListener('change', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [stepCount])

  return { containerRef, viewportRef, trackRef, activeStep }
}

export function useScrollReveals() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const showAll = () => elements.forEach((element) => element.setAttribute('data-reveal', 'visible'))

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      showAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.setAttribute('data-reveal', 'visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}
