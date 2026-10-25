import { MASCOT_GRID, pixelPalette } from '../data/mascots'
import type { PixelFrame, PixelKey } from '../data/mascots'

export type PixelTile = {
  x: number
  y: number
  fill: string
}

/**
 * Turn a 12 × 12 ASCII map into one rect per colour block.
 *
 * Deliberately does NOT merge adjacent same-colour cells into long runs:
 * the seam between blocks is the whole point of the tile look.
 */
const cache = new Map<PixelFrame, PixelTile[]>()

export function parseFrame(frame: PixelFrame): PixelTile[] {
  const cached = cache.get(frame)
  if (cached) return cached

  if (frame.length !== MASCOT_GRID) {
    throw new Error(`Pixel frame must have ${MASCOT_GRID} rows, got ${frame.length}`)
  }

  const tiles: PixelTile[] = []

  frame.forEach((row, y) => {
    if (row.length !== MASCOT_GRID) {
      throw new Error(`Pixel frame row ${y} must have ${MASCOT_GRID} cells, got ${row.length}`)
    }

    for (let x = 0; x < row.length; x += 1) {
      const key = row[x]
      if (key === '.') continue
      if (!(key in pixelPalette)) {
        throw new Error(`Unknown pixel colour "${key}" at ${x},${y}`)
      }
      tiles.push({ x, y, fill: pixelPalette[key as PixelKey] })
    }
  })

  cache.set(frame, tiles)
  return tiles
}

export function frameToAscii(frame: PixelFrame): string {
  return frame.join('\n')
}
