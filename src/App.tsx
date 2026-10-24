import {
  AppWindow,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Bot,
  Check,
  ChevronRight,
  Cloud,
  Cpu,
  FileCheck2,
  FileText,
  Folder,
  FolderGit2,
  Github,
  HardDrive,
  Laptop,
  Menu,
  MessageSquareText,
  MonitorSmartphone,
  Moon,
  Network,
  Plug,
  Radio,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  UsersRound,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Brand } from './components/Brand'
import { Faq } from './components/Faq'
import { HeroMascots } from './components/HeroMascots'
import { ProductPreview } from './components/ProductPreview'
import { ScrollProgress } from './components/ScrollProgress'
import { ScrollTextReveal } from './components/ScrollTextReveal'
import { WorkflowScene } from './components/WorkflowScene'
import { useHeroScroll, useScrollReveals } from './hooks/useScrollMotion'
import { useTheme } from './hooks/useTheme'

const GITHUB_URL = 'https://github.com/arthurwang110505-debug/GMDA-bot'
const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`

const navigation = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
]

const revealDelay = (delay: number) => ({ '--reveal-delay': `${delay}ms` }) as CSSProperties

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-line/[0.07] bg-surface-page/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-site items-center px-5 sm:px-8">
        <a href="#top" aria-label="GMDA home" onClick={() => setMenuOpen(false)} className="shrink-0 rounded-lg">
          <Brand />
        </a>

        <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="rounded text-[13px] font-medium text-slate-400 transition-colors hover:text-accent">
              {item.label}
            </a>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded text-[13px] font-medium text-slate-400 transition-colors hover:text-accent"
          >
            GitHub
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </nav>

        <a
          href="#product-preview"
          className="ml-7 hidden min-h-10 items-center gap-2 rounded-lg bg-lime-300 px-4 text-xs font-bold text-ink-900 transition-all hover:bg-lime-400 lg:flex"
        >
          Explore GMDA
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line/10 text-slate-300 transition-colors hover:border-accent/30 hover:text-accent lg:ml-2"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
        </button>

        <button
          type="button"
          className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line/10 text-slate-300 transition-colors hover:border-accent/30 hover:text-accent lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="faq-enter absolute left-0 right-0 top-full border-b border-line/10 bg-surface-page px-5 pb-6 pt-3 shadow-2xl lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto max-w-site">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center justify-between border-b border-line/[0.07] text-sm font-medium text-slate-300"
              >
                {item.label}
                <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </a>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-between border-b border-line/[0.07] text-sm font-medium text-slate-300"
            >
              GitHub
              <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
            </a>
            <a
              href="#product-preview"
              onClick={() => setMenuOpen(false)}
              className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-lime-300 px-4 text-sm font-bold text-ink-900"
            >
              Explore GMDA
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

function SectionIntro({
  index,
  eyebrow,
  title,
  description,
  light = false,
  titleId,
  scrollTitle = false,
}: {
  index: string
  eyebrow: string
  title: string
  description: string
  light?: boolean
  titleId: string
  scrollTitle?: boolean
}) {
  const titleClassName = `max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.5rem] ${light ? 'text-ink-900' : 'text-primary'}`

  return (
    <div data-reveal={scrollTitle ? undefined : ''} className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-[1fr_0.65fr] lg:items-end">
      <div>
        <div className={`mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] ${light ? 'text-ink-700' : 'text-accent/75'}`}>
          <span>{index}</span>
          <span className={`h-px w-8 ${light ? 'bg-ink-900/30' : 'bg-lime-300/30'}`} />
          <span>{eyebrow}</span>
        </div>
        {scrollTitle ? (
          <ScrollTextReveal id={titleId} text={title} className={titleClassName} />
        ) : (
          <h2 id={titleId} className={titleClassName}>{title}</h2>
        )}
      </div>
      <p data-reveal={scrollTitle ? '' : undefined} style={scrollTitle ? revealDelay(140) : undefined} className={`max-w-xl text-[15px] leading-7 lg:justify-self-end ${light ? 'text-[#2A2A55]' : 'text-slate-400'}`}>{description}</p>
    </div>
  )
}

function Hero() {
  const heroRef = useHeroScroll<HTMLElement>()

  return (
    <section ref={heroRef} id="top" className="hero-grid relative overflow-hidden" aria-labelledby="hero-title">
      <div className="hero-scroll-orb pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full border border-accent/10" />
      <div className="hero-parallax-grid pointer-events-none absolute inset-0 fine-grid opacity-40" />
      <div className="relative mx-auto max-w-site px-5 py-16 sm:px-8 sm:py-20 lg:py-24 xl:py-28">
        <div className="hero-scroll-copy relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-20 flex items-center justify-center gap-3 font-mono sm:mb-24 text-[9px] uppercase tracking-[0.2em] text-accent sm:text-[10px]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-30" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-300" />
            </span>
            An independent agent workspace
          </div>
          <h1 id="hero-title" aria-label="Your AI team. Your control." className="relative text-balance text-[clamp(3.2rem,8vw,6.75rem)] font-semibold leading-[0.99] tracking-[-0.06em] text-primary">
            <span className="relative mx-auto block w-fit">
              <span className="motion-mask-frame block">
                <span className="motion-mask-top-text block">Your AI team.</span>
              </span>
              <HeroMascots />
            </span>
            <span className="motion-mask-divider" aria-hidden="true" />
            <span className="motion-mask-frame mt-2 block text-accent">
              <span className="motion-mask-bottom-text mx-auto block w-fit">Your control.</span>
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-[17px] sm:leading-8">
            GMDA gives your AI agents one local-first home—each with its own personality, model, workspace, and tools. Delegate the work, follow every handoff, and review sensitive steps.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 min-[420px]:flex-row">
            <a href="#product-preview" className="group flex min-h-12 items-center justify-center gap-3 rounded-xl bg-lime-300 px-5 text-sm font-bold text-ink-900 transition-all hover:bg-lime-400">
              Explore the preview
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="group flex min-h-12 items-center justify-center gap-3 rounded-xl border border-line/[0.14] bg-white/[0.025] px-5 text-sm font-semibold text-slate-200 transition-all hover:border-accent/35 hover:bg-lime-300/[0.05] hover:text-accent">
              <Github className="h-4 w-4" aria-hidden="true" />
              View on GitHub
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-accent" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent/70" aria-hidden="true" />Local-first by design</span>
            <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent/70" aria-hidden="true" />Open-source core</span>
            <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent/70" aria-hidden="true" />Independent project</span>
          </div>
        </div>


        <div className="mt-16 grid gap-5 border-t border-line/[0.09] pt-7 sm:grid-cols-3 sm:mt-20">
          {[
            ['01', 'Multiple agents', 'One organized workspace'],
            ['02', 'Flexible foundations', 'Supported runtimes and providers'],
            ['03', 'Deliberate oversight', 'Approvals at sensitive steps'],
          ].map(([number, title, detail]) => (
            <div key={number} className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-accent/70">{number}</span>
              <div>
                <div className="text-xs font-semibold text-slate-300">{title}</div>
                <div className="mt-1 text-[10px] text-slate-500">{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-line/[0.06] bg-surface-page py-24 sm:py-28 lg:py-32" aria-labelledby="features-title">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionIntro
          titleId="features-title"
          index="02"
          eyebrow="A workspace, not just a chat"
          title="One home for the whole team."
          description="Shape each agent around the work it does, then bring their conversations, tasks, and tools into one coherent place."
        />

        <div className="grid gap-4 lg:grid-cols-12">
          <article data-reveal="" style={revealDelay(0)} className="feature-card group overflow-hidden rounded-2xl border border-line/[0.09] bg-surface-card p-6 sm:p-8 lg:col-span-7">
            <div className="flex items-start justify-between">
              <span className="feature-icon"><UsersRound className="h-5 w-5" aria-hidden="true" /></span>
              <span className="font-mono text-[9px] text-slate-600">01 / TEAM</span>
            </div>
            <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-primary">Your own team of agents</h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">Organize multiple agents in one workspace. Give each a distinct personality, role, working context, and set of connected apps.</p>
            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              {[
                ['MA', 'Mara', 'Research', 'bg-lime-300 text-ink-900'],
                ['SO', 'Sol', 'Writing', 'border border-line/10 bg-[#FFFFFF] text-[#14142B]'],
                ['KI', 'Kit', 'Review', 'bg-[#FF8F73] text-[#14142B]'],
              ].map(([initials, name, role, color]) => (
                <div key={name} className="rounded-xl border border-line/[0.07] bg-black/10 p-3 transition-colors group-hover:border-line/[0.11]">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[9px] ${color}`}>{initials}</span>
                    <div><div className="text-[11px] font-semibold text-slate-200">{name}</div><div className="mt-1 text-[9px] text-slate-500">{role}</div></div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-wider text-slate-600"><SlidersHorizontal className="h-3 w-3" aria-hidden="true" />Own profile</div>
                </div>
              ))}
            </div>
          </article>

          <article data-reveal="" style={revealDelay(80)} className="feature-card group overflow-hidden rounded-2xl border border-line/[0.09] bg-surface-card p-6 sm:p-8 lg:col-span-5">
            <div className="flex items-start justify-between">
              <span className="feature-icon"><Cpu className="h-5 w-5" aria-hidden="true" /></span>
              <span className="font-mono text-[9px] text-slate-600">02 / MODELS</span>
            </div>
            <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-primary">Flexible model choices</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">Work with supported agent runtimes and model providers. Choose the setup that fits each agent instead of forcing one default on the whole team.</p>
            <div className="mt-7 space-y-2">
              {[
                [Cpu, 'Local runtime', 'Where supported'],
                [Cloud, 'Hosted provider', 'Your account'],
                [SlidersHorizontal, 'Per-agent profile', 'Your choice'],
              ].map(([Icon, label, meta]) => {
                const ModelIcon = Icon as typeof Cpu
                return (
                  <div key={label as string} className="flex items-center gap-3 rounded-lg border border-line/[0.07] bg-white/[0.02] px-3 py-2.5">
                    <ModelIcon className="h-4 w-4 text-accent/70" aria-hidden="true" />
                    <span className="text-[11px] font-medium text-slate-300">{label as string}</span>
                    <span className="ml-auto font-mono text-[8px] text-slate-600">{meta as string}</span>
                  </div>
                )
              })}
            </div>
          </article>

          <article data-reveal="" style={revealDelay(0)} className="feature-card group overflow-hidden rounded-2xl border border-line/[0.09] bg-surface-card p-6 sm:p-8 lg:col-span-5">
            <div className="flex items-start justify-between">
              <span className="feature-icon"><HardDrive className="h-5 w-5" aria-hidden="true" /></span>
              <span className="font-mono text-[9px] text-slate-600">03 / LOCAL</span>
            </div>
            <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-primary">Local-first workspace</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">Keep conversations and agent configuration on your own computer, with a workspace designed around local storage rather than a hosted account.</p>
            <div className="mt-7 rounded-xl border border-line/[0.08] bg-surface-page p-4 font-mono text-[10px]">
              <div className="flex items-center gap-2 border-b border-line/[0.07] pb-3 text-slate-300"><FolderGit2 className="h-4 w-4 text-accent" aria-hidden="true" />my-gmda-workspace</div>
              <div className="space-y-2.5 pl-3 pt-3 text-slate-500">
                <div className="flex items-center gap-2"><Folder className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />agents<span className="ml-auto text-[8px] text-slate-600">profiles</span></div>
                <div className="flex items-center gap-2"><MessageSquareText className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />conversations<span className="ml-auto text-[8px] text-slate-600">history</span></div>
                <div className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />workspace.config<span className="ml-auto text-[8px] text-slate-600">local</span></div>
              </div>
            </div>
          </article>

          <article data-reveal="" style={revealDelay(80)} className="feature-card group overflow-hidden rounded-2xl border border-line/[0.09] bg-surface-card p-6 sm:p-8 lg:col-span-7">
            <div className="grid gap-7 sm:grid-cols-[1fr_0.9fr] sm:items-center">
              <div>
                <div className="flex items-start justify-between sm:block">
                  <span className="feature-icon"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="font-mono text-[9px] text-slate-600 sm:hidden">04 / CONTROL</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-primary">Approvals that keep you in control</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">Review sensitive actions before they proceed, with the action and its destination surfaced in the flow of work.</p>
              </div>
              <div className="rounded-xl border border-blush-100/20 bg-blush-100/[0.04] p-4 shadow-xl shadow-black/10">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-approval"><ShieldCheck className="h-4 w-4 text-approval-accent" aria-hidden="true" />Review requested</div>
                <div className="mt-4 text-xs font-semibold text-slate-200">Update connected document</div>
                <p className="mt-2 text-[10px] leading-5 text-slate-500">An external app would receive this sample content.</p>
                <div className="mt-4 flex gap-2"><span className="rounded-md bg-lime-300 px-3 py-2 text-[9px] font-bold text-ink-900">Approve</span><span className="rounded-md border border-line/10 px-3 py-2 text-[9px] text-slate-400">Review</span></div>
              </div>
            </div>
          </article>

          <article data-reveal="" style={revealDelay(0)} className="feature-card group overflow-hidden rounded-2xl border border-line/[0.09] bg-surface-card p-6 sm:p-8 lg:col-span-5">
            <div className="flex items-start justify-between">
              <span className="feature-icon"><Plug className="h-5 w-5" aria-hidden="true" /></span>
              <span className="font-mono text-[9px] text-slate-600">05 / TOOLS</span>
            </div>
            <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-primary">Connected tools</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">Connect the tools and integrations supported by your configured runtime. Using an external service can send relevant data to it, so connect only the tools you intend to use.</p>
            <div className="relative mt-8 flex items-center justify-between px-2">
              <div className="absolute left-10 right-10 top-5 h-px border-t border-dashed border-accent/20" />
              {[
                [Folder, 'Files'],
                [Blocks, 'Agent'],
                [AppWindow, 'Apps'],
              ].map(([Icon, label], index) => {
                const ToolIcon = Icon as typeof Folder
                return (
                  <div key={label as string} className="relative z-10 flex flex-col items-center gap-2">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${index === 1 ? 'border-accent/30 bg-lime-300/10 text-accent' : 'border-line/10 bg-surface-layer text-slate-400'}`}><ToolIcon className="h-4 w-4" aria-hidden="true" /></span>
                    <span className="font-mono text-[8px] text-slate-500">{label as string}</span>
                  </div>
                )
              })}
            </div>
          </article>

          <article data-reveal="" style={revealDelay(80)} className="feature-card group overflow-hidden rounded-2xl border border-line/[0.09] bg-surface-card p-6 sm:p-8 lg:col-span-7">
            <div className="grid gap-7 sm:grid-cols-[0.9fr_1fr] sm:items-center">
              <div>
                <div className="flex items-start justify-between sm:block">
                  <span className="feature-icon"><MonitorSmartphone className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="font-mono text-[9px] text-slate-600 sm:hidden">06 / REMOTE</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-primary">Optional remote workspaces</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">Connect supported remote computers when a task needs another environment. Local-first doesn’t mean you can’t reach beyond one machine.</p>
              </div>
              <div className="flex items-center justify-center gap-3 rounded-xl border border-line/[0.07] bg-black/10 p-5">
                <div className="text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-lime-300/[0.07] text-accent"><Laptop className="h-5 w-5" aria-hidden="true" /></span><span className="mt-2 block font-mono text-[8px] text-slate-500">This computer</span></div>
                <div className="relative mb-5 h-px w-10 border-t border-dashed border-accent/30 sm:w-14"><ArrowRight className="absolute -right-1 -top-2 h-3.5 w-3.5 text-accent/70" aria-hidden="true" /></div>
                <div className="text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-line/10 bg-white/[0.025] text-slate-400"><Server className="h-5 w-5" aria-hidden="true" /></span><span className="mt-2 block font-mono text-[8px] text-slate-500">Remote · optional</span></div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line/[0.06] bg-surface-layer py-24 sm:py-28 lg:py-32" aria-labelledby="how-title">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionIntro titleId="how-title" index="03" eyebrow="From setup to supervised work" title="A clear path from hello to handoff." description="GMDA keeps the workflow legible: configure the foundation, shape your team, and decide what happens at sensitive moments." />
        <WorkflowScene />
        <div data-reveal="" className="mt-16 flex flex-col gap-5 rounded-2xl border border-accent/[0.13] bg-lime-300/[0.035] p-5 sm:flex-row sm:items-center sm:p-6 lg:mt-20">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-300/10 text-accent"><Sparkles className="h-5 w-5" aria-hidden="true" /></span>
          <div className="flex-1"><div className="text-sm font-semibold text-slate-200">The work stays visible.</div><p className="mt-1 text-xs leading-6 text-slate-500">Agent → task → activity → approval. See the flow, not just the final response.</p></div>
          <a href="#product-preview" className="group flex min-h-10 items-center gap-2 self-start text-xs font-semibold text-accent sm:self-auto">Try the sample flow<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}

function ControlAndPrivacy() {
  return (
    <section id="control" className="light-section scroll-mt-20 bg-paper py-24 text-ink-900 sm:py-28 lg:py-32" aria-labelledby="control-title">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionIntro titleId="control-title" index="04" eyebrow="Control and privacy" title="Clarity about where your work goes." description="Local-first is about where your workspace lives—not a promise that every request stays on-device. GMDA makes those boundaries part of the product story." light scrollTitle />

        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div data-reveal="">
            <h3 className="text-2xl font-semibold tracking-[-0.035em]">Your computer is the home base.</h3>
            <p className="mt-5 text-[15px] leading-7 text-[#2A2A55]">GMDA is designed to keep conversations and configuration on your computer. When you use an external model provider, integration, or remote computer, relevant data may leave your device and be handled by that service or environment.</p>
            <p className="mt-4 text-[15px] leading-7 text-[#2A2A55]">Approvals add a deliberate review point for sensitive actions, depending on your runtime and tool support. They don’t replace sensible provider, permission, and device-security choices.</p>
          </div>

          <div data-reveal="" style={revealDelay(120)} className="rounded-2xl border border-ink-900/[0.14] bg-white/40 p-5 shadow-[0_25px_60px_-35px_rgba(20,20,43,0.24)] sm:p-7">
            <div className="mb-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.17em] text-ink-700"><span>Data boundary / example</span><Network className="h-4 w-4" aria-hidden="true" /></div>
            <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-xl border border-ink-900/[0.14] bg-paper p-4">
                <div className="flex items-center gap-2 text-xs font-bold"><Laptop className="h-4 w-4" aria-hidden="true" />Your computer</div>
                <div className="mt-4 space-y-2.5 text-[10px] text-[#2A2A55]">
                  <div className="flex items-center gap-2"><MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />Conversations</div>
                  <div className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />Agent configuration</div>
                  <div className="flex items-center gap-2"><Folder className="h-3.5 w-3.5" aria-hidden="true" />Workspace files</div>
                </div>
                <div className="mt-4 border-t border-ink-900/10 pt-3 font-mono text-[8px] uppercase tracking-wider text-ink-700">Local-first storage</div>
              </div>
              <div className="flex flex-row items-center justify-center gap-2 sm:flex-col">
                <span className="h-px w-8 border-t border-dashed border-ink-900/30 sm:h-8 sm:w-px sm:border-l sm:border-t-0" />
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/15 bg-paper"><ArrowRight className="h-4 w-4 rotate-90 sm:rotate-0" aria-hidden="true" /></span>
                <span className="h-px w-8 border-t border-dashed border-ink-900/30 sm:h-8 sm:w-px sm:border-l sm:border-t-0" />
              </div>
              <div className="rounded-xl border border-dashed border-ink-900/25 p-4">
                <div className="flex items-center gap-2 text-xs font-bold"><Cloud className="h-4 w-4" aria-hidden="true" />External services</div>
                <div className="mt-4 space-y-2.5 text-[10px] text-[#2A2A55]">
                  <div className="flex items-center gap-2"><Cpu className="h-3.5 w-3.5" aria-hidden="true" />Model providers</div>
                  <div className="flex items-center gap-2"><Plug className="h-3.5 w-3.5" aria-hidden="true" />Connected tools</div>
                  <div className="flex items-center gap-2"><Server className="h-3.5 w-3.5" aria-hidden="true" />Remote computers</div>
                </div>
                <div className="mt-4 border-t border-ink-900/10 pt-3 font-mono text-[8px] uppercase tracking-wider text-ink-700">Only when configured</div>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-[#2A2A55]"><Radio className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />Relevant prompts, files, or action data may cross this boundary when those options are used.</div>
          </div>
        </div>

        <div className="mt-16 grid border-y border-ink-900/[0.15] md:grid-cols-3 md:divide-x md:divide-ink-900/[0.15]">
          {[
            [HardDrive, 'Local by design', 'Conversations and configuration are designed to live on your own computer.'],
            [Cloud, 'External by choice', 'Hosted models and integrations have their own data boundaries, terms, and settings.'],
            [FileCheck2, 'Review before action', 'Sensitive steps can pause for your approval where the configured runtime and tools support it.'],
          ].map(([Icon, title, copy]) => {
            const PrincipleIcon = Icon as typeof HardDrive
            return (
              <article key={title as string} className="border-b border-ink-900/[0.15] py-7 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0">
                <PrincipleIcon className="h-5 w-5 text-ink-700" aria-hidden="true" />
                <h3 className="mt-5 text-base font-semibold">{title as string}</h3>
                <p className="mt-3 text-sm leading-6 text-[#2A2A55]">{copy as string}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="bg-surface-page px-5 pb-20 pt-4 sm:px-8 sm:pb-24" aria-labelledby="cta-title">
      <div data-reveal="" className="relative mx-auto max-w-site overflow-hidden rounded-[1.75rem] border border-accent/20 bg-surface-layer px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="absolute inset-0 fine-grid opacity-40" />
        <img src="/app-icon.svg" alt="" className="absolute -right-16 -top-24 h-[380px] w-[380px] rotate-12 opacity-[0.055] sm:h-[480px] sm:w-[480px]" />
        <div className="relative max-w-2xl">
          <div className="mb-6 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-accent"><Bot className="h-4 w-4" aria-hidden="true" />Your workspace is yours to shape</div>
          <h2 id="cta-title" className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-primary sm:text-5xl lg:text-6xl">Give your AI team a place to call home.</h2>
          <p className="mt-6 max-w-xl text-[15px] leading-7 text-slate-400">Explore the sample workspace, then take a look at the open-source project behind GMDA.</p>
          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
            <a href="#product-preview" className="group flex min-h-12 items-center justify-center gap-3 rounded-xl bg-lime-300 px-5 text-sm font-bold text-ink-900 transition-all hover:bg-lime-400">Explore the preview<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-3 rounded-xl border border-line/[0.15] px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-accent/35 hover:text-accent"><Github className="h-4 w-4" aria-hidden="true" />View source on GitHub</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line/[0.07] bg-surface-page">
      <div className="mx-auto max-w-site px-5 py-12 sm:px-8 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] lg:gap-20">
          <div>
            <a href="#top" aria-label="Back to GMDA home" className="inline-flex rounded-lg"><Brand /></a>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">An independent, local-first home for your team of AI agents.</p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500">Grok, Muse & Dots Alternative</p>
          </div>
          <div className="grid grid-cols-2 gap-x-14 gap-y-8 sm:grid-cols-3 sm:gap-x-16">
            <div>
              <h2 className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">Explore</h2>
              <div className="mt-4 flex flex-col gap-3 text-xs text-slate-400"><a href="#features" className="hover:text-accent">Features</a><a href="#product-preview" className="hover:text-accent">Preview</a><a href="#how-it-works" className="hover:text-accent">How it works</a></div>
            </div>
            <div>
              <h2 className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">Project</h2>
              <div className="mt-4 flex flex-col gap-3 text-xs text-slate-400"><a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-accent">GitHub<ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a><a href={LICENSE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-accent">Apache-2.0 license<ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a><a href="#faq" className="hover:text-accent">FAQ</a></div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">Principle</h2>
              <p className="mt-4 max-w-[180px] text-xs leading-6 text-slate-400">Your AI team.<br />Your control.</p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-line/[0.08] pt-7 text-[11px] leading-6 text-slate-500">
          <p>Built on the open-source core of OpenMausBot.</p>
          <p className="mt-1 max-w-4xl">GMDA is independent and is not affiliated with xAI, Meta, OpenAI, or the OpenMausBot maintainer.</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useScrollReveals()

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollProgress />
      <Header />
      <main id="main-content">
        <Hero />

        <section id="product-preview" className="scroll-mt-20 border-t border-line/[0.06] bg-surface-page py-24 sm:py-28 lg:py-32" aria-labelledby="preview-title">
          <div className="mx-auto max-w-site px-5 sm:px-8">
            <div data-reveal="" className="mb-10 flex flex-col gap-7 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75"><span>01</span><span className="h-px w-8 bg-lime-300/30" /><span>Interactive product preview</span></div>
                <h2 id="preview-title" className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-primary sm:text-5xl lg:text-[3.5rem]">See the handoffs,<br className="hidden sm:block" /> not just the chat.</h2>
              </div>
              <div className="lg:max-w-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-lime-300/[0.06] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-accent"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" />Illustrative preview — sample data.</span>
                <p className="mt-4 text-sm leading-6 text-slate-400">Switch agents, inspect sample task steps, and try an approval. This preview never connects to a backend.</p>
              </div>
            </div>
            <div data-reveal="">
              <ProductPreview />
            </div>
          </div>
        </section>

        <Features />
        <HowItWorks />
        <ControlAndPrivacy />

        <section id="faq" className="scroll-mt-20 bg-surface-page py-24 sm:py-28 lg:py-32" aria-labelledby="faq-title">
          <div className="mx-auto max-w-site px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.55fr_1fr] lg:gap-20">
              <div data-reveal="">
                <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75"><span>05</span><span className="h-px w-8 bg-lime-300/30" /><span>Good questions</span></div>
                <h2 id="faq-title" className="text-4xl font-semibold tracking-[-0.045em] text-primary sm:text-5xl">A few things worth making clear.</h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">What GMDA is, what its name means, and where the local-first boundary sits.</p>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="group mt-7 inline-flex items-center gap-2 text-xs font-semibold text-accent">Explore the project on GitHub<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></a>
              </div>
              <div data-reveal="" style={revealDelay(120)}>
                <Faq />
              </div>
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
