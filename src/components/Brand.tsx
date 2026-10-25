type BrandProps = {
  compact?: boolean
  light?: boolean
}

/**
 * GMDA wordmark. Transparent vector logo (background removed); the theme-appropriate
 * variant is shown automatically (deep-tone letters on light surfaces).
 */
export function Brand({ compact = false, light = false }: BrandProps) {
  const size = compact ? 'h-10' : 'h-12'
  return (
    <span className={`inline-flex items-center gap-3 ${light ? 'brand-on-light' : ''}`}>
      <img
        src="/gmda-logo.svg"
        alt="GMDA"
        className={`brand-mark brand-mark-dark ${size} w-auto`}
        width={111}
        height={48}
        draggable={false}
      />
      <img
        src="/gmda-logo-light.svg"
        alt="GMDA"
        className={`brand-mark brand-mark-light ${size} w-auto`}
        width={111}
        height={48}
        draggable={false}
      />
      {!compact && (
        <span className="flex flex-col">
          <span
            className={`font-mono text-[0.55rem] uppercase tracking-[0.15em] ${
              light ? 'text-ink-700/70' : 'text-slate-400'
            }`}
          >
            Agent workspace
          </span>
        </span>
      )}
    </span>
  )
}
