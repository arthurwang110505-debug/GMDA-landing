type BrandProps = {
  compact?: boolean
  light?: boolean
}

export function Brand({ compact = false, light = false }: BrandProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src="/gmda-logo.png"
        alt="GMDA"
        className={compact ? 'h-8 w-auto' : 'h-10 w-auto'}
        width={compact ? 74 : 92}
        height={compact ? 32 : 40}
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
