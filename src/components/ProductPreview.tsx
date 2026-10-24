import {
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  FileText,
  HardDrive,
  Info,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { previewAgents } from '../data/preview'
import type { ActivityState } from '../data/preview'

type ApprovalStatus = 'pending' | 'approved' | 'changes'

const initialApprovals: Record<string, ApprovalStatus> = {
  mara: 'pending',
  sol: 'pending',
  kit: 'pending',
}

function ActivityMark({ state }: { state: ActivityState }) {
  if (state === 'complete') {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-lime-300/10">
        <Check className="h-3 w-3 text-accent" aria-hidden="true" />
      </span>
    )
  }

  if (state === 'current') {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/25">
        <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
      </span>
    )
  }

  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blush-100/25 bg-blush-100/[0.05]">
      <ShieldCheck className="h-3 w-3 text-approval-accent" aria-hidden="true" />
    </span>
  )
}

export function ProductPreview() {
  const [activeAgentId, setActiveAgentId] = useState(previewAgents[0].id)
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null)
  const [approvals, setApprovals] = useState<Record<string, ApprovalStatus>>(initialApprovals)

  const activeAgent = previewAgents.find((agent) => agent.id === activeAgentId) ?? previewAgents[0]
  const approvalStatus = approvals[activeAgent.id]

  const selectAgent = (agentId: string) => {
    setActiveAgentId(agentId)
    setExpandedActivityId(null)
  }

  const resetPreview = () => {
    setActiveAgentId(previewAgents[0].id)
    setExpandedActivityId(null)
    setApprovals(initialApprovals)
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line/[0.12] bg-surface-card shadow-window">
        <div className="flex min-h-14 flex-wrap items-center gap-3 border-b border-line/[0.08] bg-surface-card px-4 py-3 sm:px-5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <div className="ml-1 flex min-w-0 items-center gap-2 text-xs">
            <span className="font-mono text-[10px] text-slate-200">GMDA</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
            <span className="truncate text-slate-400">Product launch</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent/70 sm:flex">
              <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
              Local sample workspace
            </span>
            <button
              type="button"
              onClick={resetPreview}
              className="flex min-h-9 items-center gap-2 rounded-lg border border-line/10 px-3 text-[11px] font-medium text-slate-400 transition-colors hover:border-accent/30 hover:text-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset preview
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[190px_minmax(0,1fr)_250px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
          <aside className="border-b border-line/[0.08] bg-surface-card p-3 lg:border-b-0 lg:border-r lg:p-4" aria-label="Sample agents">
            <div className="mb-3 hidden items-center justify-between px-1 lg:flex">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">Your agents</span>
              <span className="font-mono text-[9px] text-slate-600">03</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
              {previewAgents.map((agent) => {
                const isActive = agent.id === activeAgent.id
                return (
                  <button
                    key={agent.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => selectAgent(agent.id)}
                    className={`flex min-w-[150px] flex-1 items-center gap-3 rounded-xl border p-2.5 text-left transition-all lg:min-w-0 lg:w-full lg:p-3 ${
                      isActive
                        ? 'border-accent/25 bg-lime-300/[0.09]'
                        : 'border-transparent hover:border-line/[0.08] hover:bg-white/[0.03]'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-medium ${agent.avatarClass}`}
                      aria-hidden="true"
                    >
                      {agent.initials}
                    </span>
                    <span className="min-w-0">
                      <span className={`block truncate text-xs font-semibold ${isActive ? 'text-primary' : 'text-slate-300'}`}>
                        {agent.name}
                      </span>
                      <span className="mt-1 block truncate text-[10px] text-slate-500">{agent.role}</span>
                    </span>
                    {isActive && <span className="ml-auto hidden h-1.5 w-1.5 shrink-0 rounded-full bg-lime-300 lg:block" />}
                  </button>
                )
              })}
            </div>
            <div className="mt-5 hidden rounded-xl border border-line/[0.07] bg-white/[0.02] p-3 lg:block">
              <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                <Bot className="h-3.5 w-3.5 text-accent/70" aria-hidden="true" />
                One shared task
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-600">Each sample agent keeps a distinct role and working context.</p>
            </div>
          </aside>

          <div className="min-w-0 bg-surface-layer lg:border-r lg:border-line/[0.08]">
            <div className="flex min-h-[72px] items-center gap-3 border-b border-line/[0.08] px-4 py-4 sm:px-6">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-[11px] ${activeAgent.avatarClass}`} aria-hidden="true">
                {activeAgent.initials}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="text-sm font-semibold text-primary">{activeAgent.name}</h3>
                  <span className="rounded-full border border-line/[0.08] px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-slate-500">Sample agent</span>
                </div>
                <p className="mt-1 truncate text-[11px] text-slate-500">{activeAgent.role} · {activeAgent.model}</p>
              </div>
              <MessageSquareText className="ml-auto h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
            </div>

            <div className="space-y-6 p-4 sm:p-6">
              <div className="flex justify-end">
                <div className="max-w-[88%] sm:max-w-[80%]">
                  <div className="mb-2 flex items-center justify-end gap-2 text-[10px] text-slate-500">
                    You
                    <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <p className="rounded-2xl rounded-br-md border border-line/[0.09] bg-white/[0.06] px-4 py-3 text-xs leading-6 text-slate-300 sm:text-[13px]">
                    {activeAgent.userMessage}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md font-mono text-[7px] ${activeAgent.avatarClass}`} aria-hidden="true">
                    {activeAgent.initials}
                  </span>
                  {activeAgent.name}
                </div>
                <p className="max-w-xl text-xs leading-6 text-slate-300 sm:text-[13px]">{activeAgent.agentMessage}</p>
                <div className="mt-4 flex max-w-sm items-center gap-3 rounded-xl border border-line/[0.09] bg-black/10 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-300/[0.08]">
                    <FileText className="h-4 w-4 text-accent" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[10px] text-slate-300">{activeAgent.artifact.name}</div>
                    <div className="mt-1 text-[9px] text-slate-600">{activeAgent.artifact.meta}</div>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
                </div>
              </div>

              <div
                className={`rounded-xl border p-4 transition-colors sm:p-5 ${
                  approvalStatus === 'pending'
                    ? 'border-blush-100/20 bg-blush-100/[0.04]'
                    : 'border-accent/20 bg-lime-300/[0.045]'
                }`}
                aria-live="polite"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {approvalStatus === 'pending' ? (
                    <ShieldCheck className="h-4 w-4 text-approval-accent/80" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                  )}
                  <span className={`text-xs font-semibold ${approvalStatus === 'pending' ? 'text-approval' : 'text-accent'}`}>
                    {approvalStatus === 'pending' && 'Approval required'}
                    {approvalStatus === 'approved' && 'Sample action approved'}
                    {approvalStatus === 'changes' && 'Sample changes requested'}
                  </span>
                  <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.14em] text-slate-600">Human review</span>
                </div>

                {approvalStatus === 'pending' ? (
                  <>
                    <h4 className="mt-4 text-sm font-semibold text-slate-100">{activeAgent.approval.title}</h4>
                    <p className="mt-2 text-[11px] leading-5 text-slate-400">{activeAgent.approval.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setApprovals((current) => ({ ...current, [activeAgent.id]: 'approved' }))}
                        className="flex min-h-10 items-center gap-2 rounded-lg bg-lime-300 px-4 text-[11px] font-bold text-ink-900 transition-colors hover:bg-lime-400"
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        Approve sample
                      </button>
                      <button
                        type="button"
                        onClick={() => setApprovals((current) => ({ ...current, [activeAgent.id]: 'changes' }))}
                        className="min-h-10 rounded-lg border border-line/10 px-4 text-[11px] font-semibold text-slate-300 transition-colors hover:border-line/25 hover:bg-white/[0.04]"
                      >
                        Request changes
                      </button>
                      <span className="ml-auto hidden items-center gap-1.5 font-mono text-[8px] text-slate-600 min-[420px]:flex">
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        {activeAgent.approval.destination}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <p className="flex-1 text-[11px] leading-5 text-slate-400">
                      Only this local preview changed. No action was performed and no data was sent.
                    </p>
                    <button
                      type="button"
                      onClick={() => setApprovals((current) => ({ ...current, [activeAgent.id]: 'pending' }))}
                      className="flex min-h-9 items-center gap-2 rounded-lg border border-line/10 px-3 text-[10px] font-medium text-slate-300 transition-colors hover:border-accent/30 hover:text-accent"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      Reset action
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="min-w-0 border-t border-line/[0.08] bg-surface-card p-4 lg:border-t-0 lg:p-5" aria-label="Sample task activity">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">Task activity</h3>
              <CircleDashed className="h-4 w-4 text-accent/50" aria-hidden="true" />
            </div>
            <p className="mt-3 text-[11px] leading-5 text-slate-600">Select a step to reveal its sample details.</p>
            <div className="mt-5 space-y-1.5">
              {activeAgent.activities.map((activity) => {
                const isExpanded = expandedActivityId === activity.id
                const panelId = `activity-${activity.id}`
                return (
                  <div key={activity.id}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => setExpandedActivityId(isExpanded ? null : activity.id)}
                      className={`flex w-full items-start gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                        isExpanded ? 'border-line/[0.09] bg-white/[0.035]' : 'border-transparent hover:bg-white/[0.025]'
                      }`}
                    >
                      <ActivityMark state={activity.state} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-medium leading-5 text-slate-300">{activity.title}</span>
                        <span className={`mt-1 block font-mono text-[8px] ${activity.state === 'waiting' ? 'text-approval-accent' : 'text-slate-600'}`}>
                          {activity.state === 'waiting' ? 'Waiting for you' : activity.time}
                        </span>
                      </span>
                      <ChevronDown className={`mt-1 h-3.5 w-3.5 shrink-0 text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    {isExpanded && (
                      <div id={panelId} className="faq-enter mx-2 mb-2 border-l border-accent/20 pl-3 pt-1 text-[10px] leading-5 text-slate-500">
                        {activity.detail}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-6 rounded-xl border border-line/[0.07] bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                <Info className="h-3.5 w-3.5 text-accent/70" aria-hidden="true" />
                Visible by design
              </div>
              <p className="mt-2 text-[10px] leading-5 text-slate-600">Follow the handoffs and see where a task pauses for review.</p>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 px-1 text-[11px] leading-5 text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/70" aria-hidden="true" />
        <p>Demonstration only. Agent switching and approval buttons change local page state; nothing is executed or sent.</p>
      </div>
    </div>
  )
}
