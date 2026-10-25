import { memo } from 'react'
import type { CSSProperties } from 'react'
import { MASCOT_GRID, mascots } from '../data/mascots'
import type { MascotId } from '../data/mascots'
import { parseFrame } from '../lib/pixel'

const UNIT = 10
const VIEW = MASCOT_GRID * UNIT
const INSET = 1.45 // the visible seam between colour blocks
const TILE = UNIT - INSET * 2

type FrameName = 'idle' | 'blink'

type PixelMascotProps = {
  id: MascotId
  /** Display size in px. Omit to fill the parent (100% × 100%). */
  size?: number
  /** Fixed frame. Ignored when `animated` is true. */
  frame?: FrameName
  /** Two-frame blink animation. Automatically suppressed for reduced motion. */
  animated?: boolean
  /** Stagger the blink (seconds) so a group of mascots does not blink in sync. */
  blinkDelay?: number
  /** Provide for an informative image; omit for a purely decorative one. */
  label?: string
  className?: string
}

function Tiles({ id, frame }: { id: MascotId; frame: FrameName }) {
  const tiles = parseFrame(mascots[id].frames[frame])

  return (
    <g>
      {tiles.map((tile) => (
        <rect
          key={`${tile.x}-${tile.y}`}
          x={tile.x * UNIT + INSET}
          y={tile.y * UNIT + INSET}
          width={TILE}
          height={TILE}
          fill={tile.fill}
          stroke="var(--pixel-edge)"
          strokeWidth={0.7}
        />
      ))}
    </g>
  )
}

/**
 * One SVG per mascot. `shapeRendering="crispEdges"` keeps the blocks square at
 * every size; colours come from CSS variables so dark/light themes share maps.
 */
export const PixelMascot = memo(function PixelMascot({
  id,
  size,
  frame = 'idle',
  animated = false,
  blinkDelay = 0,
  label,
  className,
}: PixelMascotProps) {
  const decorative = !label
  const classNames = ['pixel-mascot', animated ? 'pixel-mascot--animated' : '', className]
    .filter(Boolean)
    .join(' ')
  const style = { '--pixel-blink-delay': `${blinkDelay}s` } as CSSProperties

  return (
    <svg
      className={classNames}
      style={style}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      width={size ?? '100%'}
      height={size ?? '100%'}
      shapeRendering="crispEdges"
      focusable="false"
      data-mascot={id}
      role={decorative ? undefined : 'img'}
      aria-label={label}
      aria-hidden={decorative ? true : undefined}
    >
      {animated ? (
        <>
          <g className="pixel-frame pixel-frame--idle">
            <Tiles id={id} frame="idle" />
          </g>
          <g className="pixel-frame pixel-frame--blink">
            <Tiles id={id} frame="blink" />
          </g>
        </>
      ) : (
        <Tiles id={id} frame={frame} />
      )}
    </svg>
  )
})
