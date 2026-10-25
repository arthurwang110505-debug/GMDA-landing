/**
 * Build-time exporter for the GMDA pixel mascots.
 *
 * Reads the exact same 12×12 maps as the React renderer (`mascot-maps.json`)
 * and writes standalone assets. No image libraries, no network, no native
 * dependencies — the PNG is encoded with node:zlib.
 *
 *   node scripts/build-mascots.mjs
 *
 * Outputs:
 *   public/mascots/{mori,pip,koda,milo}.svg    transparent, scalable
 *   public/mascots/{mori,pip,koda,milo}.png    256×256 transparent
 *   public/mascot-team.png                     1200×630 brand sheet / OG image
 */
import { deflateSync } from 'node:zlib'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const maps = JSON.parse(readFileSync(join(root, 'src/data/mascot-maps.json'), 'utf8'))
const ids = ['mori', 'pip', 'koda', 'milo']
const grid = 12
const unit = 10
const inset = 1.45
const tile = unit - inset * 2

// Resolved dark-theme values. The in-app renderer uses CSS variables instead.
const colors = {
  L: '#C8F23C',
  W: '#F5F3EC',
  S: '#A8A5BC',
  P: '#2A2A55',
  a: '#F5F0E6',
  b: '#FFD56B',
  c: '#8BC5FF',
  d: '#C6A7FF',
}
const edge = '#2A2A55'

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

function tilesOf(frame) {
  const tiles = []
  frame.forEach((row, y) => {
    if (row.length !== grid) throw new Error(`row ${y} has ${row.length} cells`)
    for (let x = 0; x < grid; x += 1) {
      const key = row[x]
      if (key === '.') continue
      if (!colors[key]) throw new Error(`unknown colour "${key}" at ${x},${y}`)
      tiles.push({ x: x * unit + inset, y: y * unit + inset, fill: colors[key] })
    }
  })
  if (frame.length !== grid) throw new Error(`frame has ${frame.length} rows`)
  return tiles
}

function svgOf(id) {
  const rects = tilesOf(maps[id])
    .map((t) => `  <rect x="${t.x}" y="${t.y}" width="${tile}" height="${tile}" fill="${t.fill}" stroke="${edge}" stroke-width="0.7"/>`)
    .join('\n')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" shape-rendering="crispEdges" role="img" aria-label="GMDA ${id} mascot">
${rects}
</svg>
`
}

// ---- minimal RGBA PNG encoder ------------------------------------------------
let crcTable
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Uint32Array(256)
    for (let n = 0; n < 256; n += 1) {
      let c = n
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      crcTable[n] = c >>> 0
    }
  }
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}

function png(width, height, rgba) {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function blank(width, height, hex, alpha = 255) {
  const [r, g, b] = rgb(hex)
  const buf = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i += 1) {
    buf[i * 4] = r
    buf[i * 4 + 1] = g
    buf[i * 4 + 2] = b
    buf[i * 4 + 3] = alpha
  }
  return buf
}

function drawSprite(buf, bufW, bufH, frame, ox, oy, scale) {
  const [er, eg, eb] = rgb(edge)
  for (const t of tilesOf(frame)) {
    const [r, g, b] = rgb(t.fill)
    const x0 = Math.round(ox + t.x * scale)
    const y0 = Math.round(oy + t.y * scale)
    const x1 = Math.round(ox + (t.x + tile) * scale)
    const y1 = Math.round(oy + (t.y + tile) * scale)
    for (let y = Math.max(0, y0); y < Math.min(bufH, y1); y += 1) {
      for (let x = Math.max(0, x0); x < Math.min(bufW, x1); x += 1) {
        const i = (y * bufW + x) * 4
        const isEdge = x - x0 < 1 || y - y0 < 1 || x1 - x < 2 || y1 - y < 2
        buf[i] = isEdge ? er : r
        buf[i + 1] = isEdge ? eg : g
        buf[i + 2] = isEdge ? eb : b
        buf[i + 3] = 255
      }
    }
  }
}

function drawBlock(buf, bufW, bufH, x0, y0, w, h, hex, alpha = 255) {
  const [r, g, b] = rgb(hex)
  for (let y = Math.max(0, y0); y < Math.min(bufH, y0 + h); y += 1) {
    for (let x = Math.max(0, x0); x < Math.min(bufW, x0 + w); x += 1) {
      const i = (y * bufW + x) * 4
      buf[i] = r
      buf[i + 1] = g
      buf[i + 2] = b
      buf[i + 3] = alpha
    }
  }
}

// ---- write assets -----------------------------------------------------------
const outDir = join(root, 'public/mascots')
mkdirSync(outDir, { recursive: true })

for (const id of ids) {
  writeFileSync(join(outDir, `${id}.svg`), svgOf(id))
  const size = 256
  const buf = blank(size, size, '#000000', 0)
  drawSprite(buf, size, size, maps[id], 8, 8, (size - 16) / 120)
  writeFileSync(join(outDir, `${id}.png`), png(size, size, buf))
  console.log(`  wrote mascots/${id}.svg + mascots/${id}.png`)
}

const FONT = {
  A: ['010', '101', '111', '101', '101'],
  C: ['011', '100', '100', '100', '011'],
  D: ['110', '101', '101', '101', '110'],
  E: ['111', '100', '110', '100', '111'],
  G: ['011', '100', '101', '101', '011'],
  H: ['101', '101', '111', '101', '101'],
  I: ['111', '010', '010', '010', '111'],
  K: ['101', '101', '110', '101', '101'],
  L: ['100', '100', '100', '100', '111'],
  M: ['101', '111', '111', '101', '101'],
  N: ['110', '101', '101', '101', '101'],
  O: ['010', '101', '101', '101', '010'],
  P: ['110', '101', '110', '100', '100'],
  R: ['110', '101', '110', '101', '101'],
  S: ['011', '100', '010', '001', '110'],
  T: ['111', '010', '010', '010', '010'],
  U: ['101', '101', '101', '101', '111'],
  W: ['101', '101', '111', '111', '101'],
  Y: ['101', '101', '010', '010', '010'],
  ' ': ['000', '000', '000', '000', '000'],
}

function drawText(buf, bufW, bufH, text, ox, oy, scale, hex) {
  const glyphs = text.toUpperCase().split('').map((c) => FONT[c] ?? FONT[' '])
  glyphs.forEach((glyph, index) => {
    const gx = ox + index * 4 * scale
    glyph.forEach((row, y) => {
      for (let x = 0; x < 3; x += 1) {
        if (row[x] === '1') drawBlock(buf, bufW, bufH, gx + x * scale, oy + y * scale, scale, scale, hex)
      }
    })
  })
}

const sheetW = 1200
const sheetH = 630
const sheet = blank(sheetW, sheetH, '#14142B')
// 48px fine grid, pre-blended into the dark background (no alpha tricks).
for (let x = 0; x < sheetW; x += 48) drawBlock(sheet, sheetW, sheetH, x, 0, 1, sheetH, '#1E212C')
for (let y = 0; y < sheetH; y += 48) drawBlock(sheet, sheetW, sheetH, 0, y, sheetW, 1, '#1E212C')
// four colour swatches along the top
const swatches = { mori: '#F5F0E6', pip: '#FFD56B', koda: '#8BC5FF', milo: '#C6A7FF' }
ids.forEach((id, i) => {
  drawBlock(sheet, sheetW, sheetH, 90 + i * 270, 60, 232, 10, swatches[id])
})
drawText(sheet, sheetW, sheetH, 'GMDA', 90, 92, 4, '#C8F23C')
drawText(sheet, sheetW, sheetH, 'YOUR AI TEAM', 90, 120, 3, '#A8A5BC')

const spritePx = 300
ids.forEach((id, i) => {
  const ox = 90 + i * 270
  drawSprite(sheet, sheetW, sheetH, maps[id], ox, 170, spritePx / 120)
  drawText(sheet, sheetW, sheetH, id, ox, 500, 5, swatches[id])
  drawText(sheet, sheetW, sheetH, { mori: 'RESEARCH', pip: 'WRITING', koda: 'CODING', milo: 'MONITOR' }[id], ox, 540, 3, '#A8A5BC')
})
drawBlock(sheet, sheetW, sheetH, 90, 590, 1020, 4, '#C8F23C')
writeFileSync(join(root, 'public/mascot-team.png'), png(sheetW, sheetH, sheet))
console.log('  wrote mascot-team.png (1200×630)')
