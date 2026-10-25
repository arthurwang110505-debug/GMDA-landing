import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PixelMascot } from '../components/PixelMascot'
import { MASCOT_GRID, mascots, mascotOrder } from '../data/mascots'
import '../index.css'
import './lab.css'

type Theme = 'dark' | 'light'

export function Lab() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [size, setSize] = useState(112)
  const [animated, setAnimated] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const copyAscii = async (id: string) => {
    const text = mascots[id as keyof typeof mascots].frames.idle.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <div className="lab">
      <header className="lab-head">
        <div>
          <p className="lab-kicker">GMDA / Design system</p>
          <h1>Pixel Mascot Lab</h1>
          <p className="lab-lede">
            Four characters, one {MASCOT_GRID}×{MASCOT_GRID} colour-block map each. No vectors, no gradients,
            no external images — just square tiles with visible seams.
          </p>
        </div>
        <button type="button" className="lab-theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
        </button>
      </header>

      <section className="lab-controls" aria-label="Preview controls">
        <label className="lab-control">
          <span>Size <strong>{size}px</strong></span>
          <input type="range" min="48" max="176" step="8" value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </label>
        <label className="lab-control lab-control--check">
          <input type="checkbox" checked={animated} onChange={(e) => setAnimated(e.target.checked)} />
          <span>Blink animation</span>
        </label>
        <label className="lab-control lab-control--check">
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          <span>Show 12×12 grid</span>
        </label>
      </section>

      <section className="lab-grid" aria-label="Mascots">
        {mascotOrder.map((id) => {
          const mascot = mascots[id]
          return (
            <article className="lab-card" key={id}>
              <div className="lab-card-top">
                <span className="lab-swatch" style={{ background: mascot.color }} aria-hidden="true" />
                <div>
                  <h2>{mascot.name}</h2>
                  <p className="lab-role">{mascot.role} · {mascot.color}</p>
                </div>
              </div>

              <div className={`lab-stage${showGrid ? ' lab-stage--grid' : ''}`}>
                <div style={{ width: size, height: size }}>
                  <PixelMascot id={id} animated={animated} label={`${mascot.name}, ${mascot.role} mascot`} />
                </div>
              </div>

              <dl className="lab-meta">
                <div><dt>Personality</dt><dd>{mascot.trait}</dd></div>
                <div><dt>Silhouette</dt><dd>{mascot.silhouette}</dd></div>
                <div><dt>Signature</dt><dd>{mascot.detail}</dd></div>
                <div><dt>Density</dt><dd>{Math.round((mascot.frames.idle.join('').split('').filter((c) => c !== '.').length / (MASCOT_GRID * MASCOT_GRID)) * 100)}% filled</dd></div>
              </dl>

              <button type="button" className="lab-copy" onClick={() => void copyAscii(id)}>
                {copied === id ? '✓ Copied ASCII map' : 'Copy ASCII map'}
              </button>
            </article>
          )
        })}
      </section>

      <section className="lab-contrast" aria-label="Contrast check">
        <div className="lab-contrast-head">
          <h2>Contrast check</h2>
          <p>Each character on the three surfaces actually used on the site.</p>
        </div>
        <div className="lab-contrast-row">
          <div className="lab-surface lab-surface--ink">
            <span className="lab-surface-label">Midnight Indigo</span>
            <div className="lab-surface-mascots">
              {mascotOrder.map((id) => <PixelMascot key={id} id={id} size={56} label={`${mascots[id].name} on Midnight Indigo`} />)}
            </div>
          </div>
          <div className="lab-surface lab-surface--peri">
            <span className="lab-surface-label">Deep Periwinkle</span>
            <div className="lab-surface-mascots">
              {mascotOrder.map((id) => <PixelMascot key={id} id={id} size={56} label={`${mascots[id].name} on Deep Periwinkle`} />)}
            </div>
          </div>
          <div className="lab-surface lab-surface--paper">
            <span className="lab-surface-label">Warm Ivory / Paper</span>
            <div className="lab-surface-mascots">
              {mascotOrder.map((id) => <PixelMascot key={id} id={id} size={56} label={`${mascots[id].name} on Paper`} />)}
            </div>
          </div>
        </div>
      </section>

      <footer className="lab-foot">
        <span>Source: <code>src/data/mascots.ts</code></span>
        <span>Renderer: <code>src/components/PixelMascot.tsx</code></span>
        <a href="/">← Back to landing page</a>
      </footer>
    </div>
  )
}

const root = document.getElementById('lab-root')
if (root) createRoot(root).render(<Lab />)
