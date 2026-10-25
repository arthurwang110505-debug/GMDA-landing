/**
 * GMDA pixel mascots — the single source of truth for all four characters.
 *
 * Each mascot is a 12 × 12 map. One character = one square colour block.
 * `.` is transparent. Everything else resolves through `pixelPalette` to a
 * CSS variable, so the exact same map works in the dark and light themes.
 *
 * The raw maps live in `mascot-maps.json` so the browser renderer, the lab and
 * the build-time SVG/PNG exporter all read exactly the same source.
 *
 * Design rule: keep the grid sparse (~25–30% filled) and leave a visible seam
 * between blocks. The characters must read as "built out of colour tiles",
 * not as a solid vector silhouette.
 */
import mascotMaps from './mascot-maps.json'

export const MASCOT_GRID = 12

export type MascotId = 'mori' | 'pip' | 'koda' | 'milo'
export type PixelFrame = readonly string[]

export const pixelPalette = {
  // GMDA brand palette
  L: 'var(--pixel-lime)', // Electric Lime #C8F23C — antennae, indicators, sparks
  W: 'var(--pixel-ivory)', // Warm Ivory #F5F3EC — eye highlight
  S: 'var(--pixel-slate)', // Soft Slate #A8A5BC — stems, cheeks, reserved arms
  P: 'var(--pixel-eye)', // Deep Periwinkle / Ink — pupils and mouth
  // Character bodies
  a: 'var(--mascot-mori)',
  b: 'var(--mascot-pip)',
  c: 'var(--mascot-koda)',
  d: 'var(--mascot-milo)',
} as const

export type PixelKey = keyof typeof pixelPalette

/** A blink is the same map with the eye rows closed into a single dark line. */
function blinkOf(idle: PixelFrame): PixelFrame {
  return idle.map((row) => (row.includes('W') ? row.replace(/[WP]/g, '.') : row))
}

export type MascotSpec = {
  id: MascotId
  name: string
  role: string
  trait: string
  color: string
  silhouette: string
  detail: string
  frames: { idle: PixelFrame; blink: PixelFrame }
}

type MascotMeta = Omit<MascotSpec, 'id' | 'frames'>

const meta: Record<MascotId, MascotMeta> = {
  mori: {
    name: 'Mori',
    role: 'Research',
    trait: 'Curious · observant · gentle',
    color: '#F5F0E6',
    silhouette: 'Round organic',
    detail: 'Botanical lime antenna + discovery spark',
  },
  pip: {
    name: 'Pip',
    role: 'Writing',
    trait: 'Playful · imaginative · expressive',
    color: '#FFD56B',
    silhouette: 'Irregular / tilted',
    detail: 'Raised arm with a lime pencil + imagination spark',
  },
  koda: {
    name: 'Koda',
    role: 'Coding',
    trait: 'Calm · focused · precise',
    color: '#8BC5FF',
    silhouette: 'Compact soft-square',
    detail: 'Lime status indicator + blocky < > prompt',
  },
  milo: {
    name: 'Milo',
    role: 'Monitoring',
    trait: 'Quiet · attentive · steady',
    color: '#C6A7FF',
    silhouette: 'Rounded',
    detail: 'Lime radar arc + tucked slate arms',
  },
}

export const mascotOrder: MascotId[] = ['mori', 'pip', 'koda', 'milo']

export const mascots = Object.fromEntries(
  mascotOrder.map((id) => {
    const idle = mascotMaps[id] as PixelFrame
    return [id, { id, ...meta[id], frames: { idle, blink: blinkOf(idle) } }]
  }),
) as Record<MascotId, MascotSpec>
