import {
  ArrowDown,
  ArrowRight,
  Check,
  Cloud,
  Cpu,
  FileCheck2,
  MessageSquareText,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { useWorkflowScroll } from '../hooks/useScrollMotion'

const steps = [
  {
    number: '01',
    icon: Cpu,
    label: 'Choose your foundation',
    title: 'Set up your runtime or provider.',
    description: 'Start with a supported agent runtime or model provider. Use your own hosted model account where required, or a supported local setup.',
    note: 'One workspace. Flexible foundations.',
  },
  {
    number: '02',
    icon: SlidersHorizontal,
    label: 'Shape the team',
    title: 'Create agents with a point of view.',
    description: 'Personalize each agent’s personality, model, workspace, and supported connections around the work you want it to do.',
    note: 'Distinct profiles. Shared purpose.',
  },
  {
    number: '03',
    icon: Workflow,
    label: 'Delegate with oversight',
    title: 'Give tasks. Follow the work.',
    description: 'Chat with your agents, watch task activity and handoffs, then review actions that need your approval before they proceed.',
    note: 'Visible activity. Deliberate approvals.',
  },
]

function RuntimeVisual() {
  return (
    <div className="runtime-stack relative mx-auto h-[330px] w-full max-w-[430px]" aria-label="Illustration of a flexible agent runtime with local and hosted model choices" role="img">
      <div className="runtime-layer-back absolute inset-x-8 bottom-10 top-8 rotate-6 rounded-2xl border border-accent/[0.09] bg-lime-300/[0.015]" />
      <div className="runtime-layer-middle absolute inset-x-4 bottom-8 top-10 -rotate-3 rounded-2xl border border-line/[0.08] bg-surface-layer" />
      <div className="runtime-layer-front absolute inset-x-0 bottom-4 top-14 flex flex-col rounded-2xl border border-accent/20 bg-surface-card p-5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.75)] sm:p-6">
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.17em] text-slate-500">
          <span>Agent runtime</span>
          <span className="flex items-center gap-1.5 text-accent/70"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" />Configured</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-4 py-5">
          <div className="relative">
            <div className="absolute -inset-5 rounded-full border border-dashed border-accent/15 runtime-orbit" />
            <img src="/gmda-pixel-icon.svg" alt="" className="relative h-14 w-14 rounded-2xl " />
          </div>
          <div>
            <div className="font-mono text-xs font-medium tracking-[0.18em] text-primary">GMDA</div>
            <div className="mt-2 text-[10px] text-slate-500">Your workspace</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-line/[0.08] bg-black/10 p-3">
            <Cpu className="h-4 w-4 text-accent/70" aria-hidden="true" />
            <div className="mt-3 text-[10px] font-semibold text-slate-300">Local runtime</div>
            <div className="mt-1 text-[8px] text-slate-500">Where supported</div>
          </div>
          <div className="rounded-xl border border-line/[0.08] bg-black/10 p-3">
            <Cloud className="h-4 w-4 text-accent/70" aria-hidden="true" />
            <div className="mt-3 text-[10px] font-semibold text-slate-300">Hosted provider</div>
            <div className="mt-1 text-[8px] text-slate-500">Your account</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamVisual() {
  const agents = [
    { initials: 'MA', name: 'Mara', role: 'Research lead', trait: 'Curious · methodical', color: 'bg-lime-300 text-ink-900' },
    { initials: 'SO', name: 'Sol', role: 'Product writer', trait: 'Clear · measured', color: 'border border-line/10 bg-[#FFFFFF] text-[#14142B]' },
    { initials: 'KI', name: 'Kit', role: 'Release reviewer', trait: 'Precise · skeptical', color: 'bg-[#FF8F73] text-[#14142B]' },
  ]

  return (
    <div className="team-scene relative mx-auto w-full max-w-[440px]" aria-label="Illustration of three agents with distinct roles and personalities" role="img">
      <div className="mb-4 flex items-center justify-between px-1 font-mono text-[8px] uppercase tracking-[0.17em] text-slate-500">
        <span>Agent profiles</span>
        <span>03 distinct contexts</span>
      </div>
      <div className="space-y-3">
        {agents.map((agent, index) => (
          <div key={agent.name} className={`team-card team-card-${index + 1} rounded-2xl border border-line/[0.09] bg-surface-card p-4 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.8)] sm:p-5`}>
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-[10px] ${agent.color}`}>{agent.initials}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-primary">{agent.name}</div>
                <div className="mt-1 text-[9px] text-slate-500">{agent.role}</div>
              </div>
              <SlidersHorizontal className="ml-auto h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line/[0.07] pt-3 font-mono text-[8px]">
              <span className="text-slate-500">Personality</span>
              <span className="text-accent/75">{agent.trait}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OversightVisual() {
  return (
    <div className="oversight-scene relative mx-auto w-full max-w-[440px]" aria-label="Illustration of visible agent activity followed by an approval checkpoint" role="img">
      <div className="rounded-2xl border border-line/[0.09] bg-surface-card p-4 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.8)] sm:p-5">
        <div className="flex items-center justify-between border-b border-line/[0.07] pb-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-300"><MessageSquareText className="h-4 w-4 text-accent/70" aria-hidden="true" />Launch coordination</div>
          <span className="font-mono text-[8px] text-slate-500">03 TASKS</span>
        </div>
        <div className="space-y-3 py-4">
          {['Research gathered', 'Draft reviewed', 'Release checked'].map((task, index) => (
            <div key={task} className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-accent/20 bg-lime-300/[0.07]"><Check className="h-3 w-3 text-accent" aria-hidden="true" /></span>
              {task}
              <span className="ml-auto font-mono text-[8px] text-slate-600">0{index + 1}</span>
            </div>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-xl border border-blush-100/20 bg-blush-100/[0.045] p-4">
          <ShieldCheck className="absolute -bottom-5 -right-4 h-24 w-24 text-approval-accent/[0.045]" aria-hidden="true" />
          <div className="relative flex items-center gap-2 text-[10px] font-semibold text-approval"><ShieldCheck className="h-4 w-4 text-approval-accent/75" aria-hidden="true" />Your review comes next</div>
          <p className="relative mt-2 max-w-xs text-[9px] leading-5 text-slate-500">A sensitive connected action pauses here before it can proceed.</p>
          <div className="relative mt-4 flex items-center gap-2">
            <span className="rounded-md bg-lime-300 px-3 py-2 text-[8px] font-bold text-ink-900">Approve</span>
            <span className="rounded-md border border-line/10 px-3 py-2 text-[8px] text-slate-400">Inspect</span>
            <ArrowRight className="ml-auto h-4 w-4 text-accent/70" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[8px] uppercase tracking-[0.15em] text-slate-500"><FileCheck2 className="h-3.5 w-3.5 text-accent/70" aria-hidden="true" />Human in the loop</div>
    </div>
  )
}

const visuals = [<RuntimeVisual />, <TeamVisual />, <OversightVisual />]

export function WorkflowScene() {
  const { containerRef, viewportRef, trackRef, activeStep } = useWorkflowScroll(steps.length)

  return (
    <div ref={containerRef} className="workflow-scroll">
      <div className="workflow-sticky">
        <div className="workflow-chrome items-center gap-5 pb-5">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.17em] text-slate-500">
            <ArrowDown className="h-3.5 w-3.5 text-accent/70" aria-hidden="true" />
            Scroll to follow the workflow
          </div>
          <div className="ml-auto flex items-center gap-2" aria-hidden="true">
            {steps.map((step, index) => (
              <span key={step.number} className={`h-1 rounded-full transition-all duration-500 ${index === activeStep ? 'w-10 bg-lime-300' : 'w-4 bg-white/10'}`} />
            ))}
          </div>
          <div className="w-12 text-right font-mono text-[10px] text-accent" aria-hidden="true">0{activeStep + 1} <span className="text-slate-600">/ 03</span></div>
        </div>

        <div ref={viewportRef} className="workflow-viewport">
          <ol ref={trackRef} className="workflow-track">
            {steps.map((step, index) => (
              <li key={step.number} className={`workflow-panel ${index === activeStep ? 'is-active' : ''}`}>
                <div className="workflow-panel-card">
                  <span className="workflow-ghost-number" aria-hidden="true">{step.number}</span>
                  <div className="workflow-copy">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-accent">{step.number} / 03</span>
                      <step.icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    </div>
                    <div className="mt-10 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500 sm:mt-12">{step.label}</div>
                    <h3 className="mt-4 max-w-lg text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-primary sm:text-4xl xl:text-[2.8rem]">{step.title}</h3>
                    <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-[15px]">{step.description}</p>
                    <div className="mt-8 flex items-center gap-2 border-t border-line/[0.08] pt-5 text-[10px] text-slate-500 sm:mt-auto">
                      <Sparkles className="h-3.5 w-3.5 text-accent/70" aria-hidden="true" />
                      {step.note}
                    </div>
                  </div>
                  <div className="workflow-art">{visuals[index]}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="workflow-chrome items-center gap-4 pt-5">
          <span className="font-mono text-[8px] uppercase tracking-[0.17em] text-slate-600">Foundation</span>
          <div className="h-px flex-1 overflow-hidden bg-white/[0.08]">
            <div className="workflow-progress-line h-full origin-left bg-lime-300/70" />
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.17em] text-slate-600">Supervised work</span>
        </div>
      </div>
    </div>
  )
}
