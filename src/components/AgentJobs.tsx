import { ArrowUpRight, Check, FileText, ShieldCheck } from 'lucide-react'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { previewAgents } from '../data/preview'

export function AgentJobs() {
  const [activeAgentId, setActiveAgentId] = useState(previewAgents[0].id)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeAgent = previewAgents.find((agent) => agent.id === activeAgentId) ?? previewAgents[0]

  const selectTab = (index: number, moveFocus = false) => {
    setActiveAgentId(previewAgents[index].id)
    if (moveFocus) tabRefs.current[index]?.focus()
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % previewAgents.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + previewAgents.length) % previewAgents.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = previewAgents.length - 1
    }

    if (nextIndex === null) return
    event.preventDefault()
    selectTab(nextIndex, true)
  }

  return (
    <div className="grid min-w-0 overflow-hidden rounded-[1.75rem] border border-ink-900/10 bg-white/45 shadow-[0_30px_70px_-45px_rgba(20,20,43,0.35)] lg:grid-cols-[0.72fr_1.28fr]">
      <div className="min-w-0 border-b border-ink-900/10 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-7">
        <div className="mb-4 px-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700">Choose a sample role</div>
        <div role="tablist" aria-label="Sample agent jobs" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {previewAgents.map((agent, index) => {
            const isActive = agent.id === activeAgent.id
            return (
              <button
                key={agent.id}
                ref={(element) => { tabRefs.current[index] = element }}
                type="button"
                role="tab"
                id={`agent-job-tab-${agent.id}`}
                aria-selected={isActive}
                aria-controls="agent-job-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`flex min-w-[220px] items-center gap-3 rounded-xl border p-3 text-left transition-colors lg:min-w-0 lg:w-full lg:p-4 ${
                  isActive
                    ? 'border-ink-900 bg-ink-900 text-white focus-visible:!outline-lime-300'
                    : 'border-ink-900/10 bg-white/40 text-ink-900 hover:border-ink-900/25 hover:bg-white/70'
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-[10px] font-semibold ${agent.avatarClass}`} aria-hidden="true">
                  {agent.initials}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{agent.name}</span>
                  <span className={`mt-1 block text-[11px] ${isActive ? 'text-slate-400' : 'text-ink-700'}`}>{agent.role}</span>
                </span>
                {isActive && <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-lime-300" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
        <p className="mt-5 hidden text-[11px] leading-5 text-ink-700 lg:block">
          Each role has its own task, working context, and review boundary. These are illustrative examples, not running agents.
        </p>
      </div>

      <div className="min-w-0 bg-ink-900 p-4 sm:p-6 lg:p-8">
        <div
          key={activeAgent.id}
          id="agent-job-panel"
          role="tabpanel"
          aria-labelledby={`agent-job-tab-${activeAgent.id}`}
          className="faq-enter"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl font-mono text-[11px] font-semibold ${activeAgent.avatarClass}`} aria-hidden="true">
              {activeAgent.initials}
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">{activeAgent.name} · {activeAgent.role}</h3>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">{activeAgent.model}</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/[0.06] px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-lime-300">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-300" aria-hidden="true" />
              Sample conversation
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-ink-850 p-4 sm:p-6">
            <div className="flex justify-end">
              <p className="max-w-xl rounded-2xl rounded-br-md border border-white/[0.09] bg-white/[0.06] px-4 py-3 text-xs leading-6 text-slate-200 sm:text-[13px]">
                {activeAgent.userMessage}
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-[8px] font-semibold ${activeAgent.avatarClass}`} aria-hidden="true">
                {activeAgent.initials}
              </span>
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-300">{activeAgent.name}</span>
                  <span>Sample response</span>
                </div>
                <p className="max-w-2xl text-xs leading-6 text-slate-300 sm:text-[13px]">{activeAgent.agentMessage}</p>
                <div className="mt-4 flex max-w-md items-center gap-3 rounded-xl border border-white/[0.09] bg-black/10 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-300/[0.08]">
                    <FileText className="h-4 w-4 text-lime-300" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[10px] text-slate-300">{activeAgent.artifact.name}</div>
                    <div className="mt-1 text-[9px] text-slate-600">{activeAgent.artifact.meta}</div>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-blush-100/20 bg-blush-100/[0.04] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blush-100" aria-hidden="true" />
                <span className="text-xs font-semibold text-blush-50">Waits for your review</span>
                <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.14em] text-slate-600">Approval boundary</span>
              </div>
              <h4 className="mt-3 text-sm font-semibold text-slate-100">{activeAgent.approval.title}</h4>
              <p className="mt-2 text-[11px] leading-5 text-slate-400">{activeAgent.approval.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px]">
                <span className="inline-flex items-center gap-2 text-slate-400"><Check className="h-3.5 w-3.5 text-lime-300" aria-hidden="true" />Nothing proceeds in this illustration</span>
                <span className="ml-auto font-mono text-[8px] text-slate-600">{activeAgent.approval.destination}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
