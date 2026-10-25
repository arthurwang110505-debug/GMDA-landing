/**
 * HeroMascots — pixel sprite cast (no 3D).
 * 64x64 hand-placed sprites (scripts/pixel_mascots.py) at 2x integer scale,
 * blink frames on a 2-frame sheet, idle bob per character. Decorative only.
 */
const SPRITES = [
  { key: 'mori', name: 'Mori' },
  { key: 'pip', name: 'Pip' },
  { key: 'koda', name: 'Koda' },
  { key: 'milo', name: 'Milo' },
] as const

export function HeroMascots() {
  return (
    <span className="hero-mascot-cluster" aria-hidden="true">
      <span className="hero-mascot-surge" />
      {SPRITES.map(({ key, name }) => (
        <span key={key} className={`pixel-sprite ps-${key}`} title={name} />
      ))}
    </span>
  )
}
