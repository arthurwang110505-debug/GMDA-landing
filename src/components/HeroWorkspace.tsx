import {
  ArrowUpRight,
  Check,
  ChevronRight,
  FileText,
  Folder,
  HardDrive,
  MoreHorizontal,
  Paperclip,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const heroAgents = [
  { initials: 'MA', name: 'Mara', role: 'Research', active: true, color: 'bg-mint-300 text-ink-900' },
  { initials: 'SO', name: 'Sol', role: 'Writing', active: false, color: 'bg-[#c8d5ff] text-[#17243d]' },
  { initials: 'KI', name: 'Kit', role: 'Review', active: false, color: 'bg-[#f1d2a8] text-[#382713]' },
]

export function HeroWorkspace() {
  return (
    <div className="relative">
      <div className="absolute -inset-10 -z-10 rounded-full bg-mint-400/[0.06] blur-3xl" />
      <div className="absolute -right-3 -top-7 hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-mint-300/70 sm:flex">
        <span className="h-px w-8 bg-mint-300/40" />
        Workspace / 01
      </div>
      <div
        className="overflow-hidden rounded-2xl border border-white/[0.12] bg-ink-900 shadow-window"
        role="img"
        aria-label="Sample GMDA desktop interface with an agent sidebar, a conversation, task activity, and an approval card"
      >
        <div aria-hidden="true">
          <div className="flex h-11 items-center border-b border-white/[0.08] bg-[#0b211f] px-3 sm:px-4">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
            <div className="ml-4 flex min-w-0 items-center gap-2 font-mono text-[9px] text-slate-400">
              <span className="text-slate-200">GMDA</span>
              <ChevronRight className="h-3 w-3 shrink-0 text-slate-600" />
              <span className="truncate">Product launch</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full border border-mint-300/15 bg-mint-300/[0.06] px-2 py-1 font-mono text-[7px] uppercase tracking-[0.12em] text-mint-300 sm:text-[8px]">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-300" />
              Local workspace
            </div>
          </div>

          <div className="grid h-[410px] grid-cols-[104px_minmax(0,1fr)] sm:h-[448px] sm:grid-cols-[132px_minmax(0,1fr)] xl:grid-cols-[142px_minmax(0,1fr)_172px]">
            <aside className="flex min-w-0 flex-col border-r border-white/[0.07] bg-[#081c1a] p-2.5 sm:p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="font-mono text-[8px] uppercase tracking-[0.17em] text-slate-500">Agents</span>
                <span className="font-mono text-[9px] text-slate-500">03</span>
              </div>
              <div className="space-y-1.5">
                {heroAgents.map((agent) => (
                  <div
                    key={agent.name}
                    className={`flex items-center gap-2 rounded-lg border p-2 ${
                      agent.active
                        ? 'border-mint-300/20 bg-mint-300/[0.09]'
                        : 'border-transparent'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[8px] font-medium ${agent.color}`}
                    >
                      {agent.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[10px] font-semibold text-slate-200">{agent.name}</span>
                      <span className="mt-0.5 hidden truncate text-[8px] text-slate-500 sm:block">{agent.role}</span>
                    </span>
                    {agent.active && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-mint-300" />}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-white/[0.06] pt-3">
                <div className="mb-2 px-1 font-mono text-[8px] uppercase tracking-[0.17em] text-slate-600">Workspace</div>
                <div className="flex items-center gap-2 px-1 py-1.5 text-[9px] text-slate-400">
                  <Folder className="h-3 w-3 shrink-0 text-slate-500" />
                  <span className="truncate">Launch assets</span>
                </div>
                <div className="flex items-center gap-2 px-1 py-1.5 text-[9px] text-slate-400">
                  <FileText className="h-3 w-3 shrink-0 text-slate-500" />
                  <span className="truncate">Review queue</span>
                </div>
              </div>
              <div className="mt-auto rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                <HardDrive className="mb-1.5 h-3.5 w-3.5 text-mint-300/80" />
                <div className="text-[8px] font-medium text-slate-300">On this computer</div>
                <div className="mt-1 hidden text-[7px] leading-relaxed text-slate-600 sm:block">Workspace storage</div>
              </div>
            </aside>

            <div className="flex min-w-0 flex-col bg-[#0a201e]">
              <div className="flex h-14 shrink-0 items-center border-b border-white/[0.07] px-3 sm:px-4">
                <div className="min-w-0">
                  <div className="truncate text-[11px] font-semibold text-slate-100 sm:text-xs">Launch coordination</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[8px] text-slate-500">
                    <span>3 agents</span>
                    <span className="text-slate-700">•</span>
                    <span>6 tasks</span>
                  </div>
                </div>
                <MoreHorizontal className="ml-auto h-4 w-4 text-slate-500" />
              </div>

              <div className="flex-1 space-y-3 overflow-hidden p-3 sm:p-4">
                <div className="ml-auto max-w-[90%] rounded-xl rounded-br-sm border border-white/[0.08] bg-white/[0.06] px-3 py-2.5 text-[9px] leading-[1.65] text-slate-300 sm:text-[10px]">
                  Get the launch notes ready for review.
                </div>
                <div className="flex gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-mint-300 font-mono text-[7px] font-medium text-ink-900">MA</span>
                  <div className="min-w-0">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[9px] font-semibold text-slate-200">Mara</span>
                      <span className="font-mono text-[7px] text-slate-600">09:44</span>
                    </div>
                    <p className="text-[9px] leading-[1.65] text-slate-400 sm:text-[10px]">
                      I’ve gathered the release notes and asked Sol to draft the announcement.
                    </p>
                    <div className="mt-2.5 flex max-w-[220px] items-center gap-2 rounded-lg border border-white/[0.08] bg-black/10 p-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-mint-300/[0.08]">
                        <FileText className="h-3.5 w-3.5 text-mint-300" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-[8px] text-slate-300">launch-brief.md</span>
                        <span className="mt-0.5 block text-[7px] text-slate-600">Ready for review</span>
                      </span>
                      <ArrowUpRight className="ml-auto h-3 w-3 shrink-0 text-slate-600" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200/20 bg-amber-100/[0.045] p-3 shadow-lg shadow-black/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-100/80" />
                    <span className="text-[9px] font-semibold text-amber-50">Approval needed</span>
                    <span className="ml-auto font-mono text-[7px] uppercase tracking-wider text-amber-100/70">Sensitive action</span>
                  </div>
                  <p className="mt-2 text-[9px] leading-relaxed text-slate-400">
                    Share the brief with the connected Projects folder.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-md border border-white/10 px-2.5 py-1.5 text-[8px] font-medium text-slate-400">Review</span>
                    <span className="rounded-md bg-mint-300 px-2.5 py-1.5 text-[8px] font-semibold text-ink-900">Approve</span>
                    <span className="ml-auto font-mono text-[7px] text-slate-600">Sample</span>
                  </div>
                </div>
              </div>

              <div className="m-3 mt-0 flex h-9 shrink-0 items-center rounded-lg border border-white/[0.08] bg-black/10 px-3">
                <span className="truncate text-[8px] text-slate-600">Message your team…</span>
                <Paperclip className="ml-auto h-3 w-3 text-slate-600" />
              </div>
            </div>

            <aside className="hidden min-w-0 border-l border-white/[0.07] bg-[#081c1a] p-3 xl:block">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-slate-500">Task activity</span>
                <Sparkles className="h-3 w-3 text-mint-300/60" />
              </div>
              <div className="mt-5 space-y-0">
                {[
                  ['Read project notes', '09:41'],
                  ['Drafted launch brief', '09:43'],
                  ['Copy review · Sol', '09:44'],
                ].map(([label, time], index) => (
                  <div key={label} className="relative flex gap-2.5 pb-5">
                    {index < 2 && <span className="absolute left-[5px] top-3 h-full w-px bg-white/[0.08]" />}
                    <span className="relative mt-0.5 flex h-[11px] w-[11px] shrink-0 items-center justify-center rounded-full bg-mint-300/15">
                      <Check className="h-2 w-2 text-mint-300" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[9px] leading-snug text-slate-300">{label}</div>
                      <div className="mt-1 font-mono text-[7px] text-slate-600">{time}</div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2.5">
                  <span className="mt-0.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-amber-100/60" />
                  <div>
                    <div className="text-[9px] text-slate-300">Share brief</div>
                    <div className="mt-1 font-mono text-[7px] text-amber-100/50">Waiting for you</div>
                  </div>
                </div>
              </div>
              <div className="mt-7 rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5">
                <div className="font-mono text-[7px] uppercase tracking-wider text-slate-600">Current task</div>
                <div className="mt-2 text-[9px] font-medium leading-snug text-slate-300">Prepare launch materials</div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-3/4 rounded-full bg-mint-300/60" />
                </div>
                <div className="mt-2 font-mono text-[7px] text-slate-600">3 of 4 sample steps</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between px-1 font-mono text-[8px] uppercase tracking-[0.16em] text-slate-500 sm:text-[9px]">
        <span>Interface concept · sample content</span>
        <span className="flex items-center gap-2 text-mint-300/60">
          <span className="h-1 w-1 rounded-full bg-mint-300/70" />
          Your workspace
        </span>
      </div>
    </div>
  )
}
