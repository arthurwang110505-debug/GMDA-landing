import { useEffect, useRef } from 'react'

// Motion Prompt #145-168 · MIT License (c) 2026 Shohei Ohtaki · https://showheyohtaki.github.io/motion-prompt/#145
// Motion Prompt #146 · MIT License (c) 2026 Shohei Ohtaki · https://showheyohtaki.github.io/motion-prompt/#146
// The lp2 clamp, character staggering, color interpolation, and cubic ease-in-out
// are ported from the catalog element and kit. Real scroll replaces the demo clock.
const START_COLOR = [0x6b, 0x67, 0x80] as const
const END_COLOR = [0x14, 0x14, 0x2b] as const
const clamp = (value: number) => Math.min(1, Math.max(0, value))
const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2

export function ScrollTextReveal({ id, text, className }: { id: string; text: string; className: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const words = text.split(' ')
  let characterIndex = 0

  useEffect(() => {
    const heading = ref.current
    if (!heading) return

    const characters = Array.from(heading.querySelectorAll<HTMLElement>('[data-scroll-char]'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      const rect = heading.getBoundingClientRect()
      const rawProgress = reducedMotion.matches
        ? 1
        : clamp((window.innerHeight * 0.88 - rect.top) / (window.innerHeight * 0.5))
      const progress = easeInOutCubic(rawProgress)
      const total = characters.length

      characters.forEach((character, index) => {
        // Catalog formula: clamp(p × (total + 2) − n).
        const amount = reducedMotion.matches ? 1 : clamp(progress * (total + 2) - index)
        const channels = START_COLOR.map((start, channel) =>
          Math.round(start + (END_COLOR[channel] - start) * amount),
        )
        character.style.color = `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`
      })
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
  }, [text])

  return (
    <h2 ref={ref} id={id} className={className} aria-label={text} data-scroll-text>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {Array.from(word).map((character) => {
              const index = characterIndex++
              return (
                <span key={`${character}-${index}`} data-scroll-char className="text-[#6B6780]">
                  {character}
                </span>
              )
            })}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </h2>
  )
}
