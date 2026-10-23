type BrandProps = {
  compact?: boolean
  light?: boolean
}

export function Brand({ compact = false, light = false }: BrandProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src="/app-icon.svg"
        alt=""
        className={compact ? 'h-8 w-8 rounded-[9px]' : 'h-10 w-10 rounded-xl'}
        width={compact ? 32 : 40}
        height={compact ? 32 : 40}
      />
      <span className="flex flex-col">
        <span
          className={`font-mono text-[1.05rem] font-medium tracking-[0.2em] ${
            light ? 'text-ink-900' : 'text-white'
          }`}
        >
          GMDA
        </span>
        {!compact && (
          <span
            className={`mt-0.5 font-mono text-[0.55rem] uppercase tracking-[0.15em] ${
              light ? 'text-ink-700/70' : 'text-slate-400'
            }`}
          >
            Agent workspace
          </span>
        )}
      </span>
    </span>
  )
}
