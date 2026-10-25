/**
 * Render the transparent GMDA wordmark PNGs from the SVG sources.
 * Usage: npm run logo   (regenerates public/gmda-logo.png + gmda-logo-light.png)
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const jobs = [
  ['public/gmda-logo.svg', 'public/gmda-logo.png'],
  ['public/gmda-logo-light.svg', 'public/gmda-logo-light.png'],
]

for (const [src, out] of jobs) {
  const svg = readFileSync(src, 'utf8')
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 888 },
    background: 'rgba(0,0,0,0)',
  })
  const png = resvg.render().asPng()
  writeFileSync(out, png)
  console.log(`${out} ← ${src} (${png.length} bytes)`)
}
