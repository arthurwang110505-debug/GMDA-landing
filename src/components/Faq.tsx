import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'What is GMDA?',
    answer:
      'GMDA is an independent, local-first workspace for a team of AI agents. You can organize agents with different personalities, models, workspaces, and connected apps; chat with them; follow their activity; and review actions that need approval.',
  },
  {
    question: 'What does the name mean?',
    answer:
      'GMDA stands for “Grok, Muse & Dots Alternative.” That explains the acronym—not an affiliation, endorsement, or connection to those products or their owners.',
  },
  {
    question: 'Does everything run locally?',
    answer:
      'No. GMDA is designed to keep conversations and configuration on your computer, but external model providers and integrations may receive data when you use them. Optional remote workspaces also involve another computer. The boundary depends on the runtime, providers, and tools you configure.',
  },
  {
    question: 'Do I need my own model account or API key?',
    answer:
      'It depends on your setup. Hosted model providers generally require your own account and may require an API key or other credentials. A supported local runtime may not. This landing page never asks for an account, API key, pairing code, or other personal information.',
  },
  {
    question: 'Is this page the working app?',
    answer:
      'No. This is a standalone landing page. Its interactive preview uses local sample data and only changes what you see on this page; it does not connect to GMDA’s backend, run agents, or execute tasks.',
  },
  {
    question: 'Is GMDA affiliated with Grok, Muse, or Dots?',
    answer:
      'No. GMDA is independent and is not affiliated with Grok, Muse, Dots, their owners, or the OpenMausBot maintainer. It is also not affiliated with xAI, Meta, or OpenAI.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-white/[0.09] border-y border-white/[0.09]">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        const buttonId = `faq-button-${index}`
        const panelId = `faq-panel-${index}`

        return (
          <div key={faq.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                className="group flex w-full items-center gap-5 py-6 text-left sm:py-7"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="font-mono text-[10px] text-lime-300/60">0{index + 1}</span>
                <span className="flex-1 text-base font-semibold tracking-[-0.02em] text-slate-100 transition-colors group-hover:text-lime-300 sm:text-lg">
                  {faq.question}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? 'rotate-180 border-lime-300/30 bg-lime-300/10 text-lime-300'
                      : 'border-white/10 text-slate-400 group-hover:border-lime-300/30 group-hover:text-lime-300'
                  }`}
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="faq-enter pb-7 pl-9 pr-4 sm:pb-8 sm:pl-[3.25rem] sm:pr-16"
              >
                <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-[15px]">{faq.answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
