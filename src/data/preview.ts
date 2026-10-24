export type ActivityState = 'complete' | 'waiting' | 'current'

export type PreviewActivity = {
  id: string
  title: string
  time: string
  state: ActivityState
  detail: string
}

export type PreviewAgent = {
  id: string
  name: string
  initials: string
  role: string
  model: string
  avatarClass: string
  userMessage: string
  agentMessage: string
  artifact: {
    name: string
    meta: string
  }
  approval: {
    title: string
    description: string
    destination: string
  }
  activities: PreviewActivity[]
}

export const previewAgents: PreviewAgent[] = [
  {
    id: 'mara',
    name: 'Mara',
    initials: 'MA',
    role: 'Research lead',
    model: 'Workspace default',
    avatarClass: 'bg-lime-300 text-ink-900',
    userMessage: 'Pull together the launch brief and flag anything that needs my review.',
    agentMessage:
      'I found the approved positioning in the project notes and mapped the open questions. Sol has the draft; I’m holding the publishing step for you.',
    artifact: {
      name: 'launch-brief.md',
      meta: '4 sections · Sample file',
    },
    approval: {
      title: 'Upload brief to Projects',
      description:
        'Mara is asking to send launch-brief.md to the connected Projects folder.',
      destination: 'Connected drive',
    },
    activities: [
      {
        id: 'mara-notes',
        title: 'Read local project notes',
        time: '09:41',
        state: 'complete',
        detail: 'Sample step: reviewed the notes selected for this workspace.',
      },
      {
        id: 'mara-brief',
        title: 'Drafted launch brief',
        time: '09:43',
        state: 'complete',
        detail: 'Sample output: positioning, audience, launch checklist, and open questions.',
      },
      {
        id: 'mara-handoff',
        title: 'Asked Sol for copy review',
        time: '09:44',
        state: 'complete',
        detail: 'Sample handoff: shared the draft with the writing agent in this workspace.',
      },
      {
        id: 'mara-upload',
        title: 'Upload to connected drive',
        time: 'Review',
        state: 'waiting',
        detail: 'Sample boundary: this action would send the brief to an external integration.',
      },
    ],
  },
  {
    id: 'sol',
    name: 'Sol',
    initials: 'SO',
    role: 'Product writer',
    model: 'Writing profile',
    avatarClass: 'bg-[#FFFFFF] text-[#14142B]',
    userMessage: 'Draft a concise launch announcement from the approved brief.',
    agentMessage:
      'The draft is ready. I kept the rollout language measured and marked two product claims for your review before anything is shared.',
    artifact: {
      name: 'announcement-draft.md',
      meta: '312 words · Sample file',
    },
    approval: {
      title: 'Save draft to team editor',
      description:
        'Sol is asking to send the announcement draft to a connected document workspace.',
      destination: 'Connected document app',
    },
    activities: [
      {
        id: 'sol-context',
        title: 'Received approved brief',
        time: '09:45',
        state: 'complete',
        detail: 'Sample handoff: received Mara’s approved sections as writing context.',
      },
      {
        id: 'sol-draft',
        title: 'Drafted announcement',
        time: '09:47',
        state: 'complete',
        detail: 'Sample output: a concise announcement with two items marked for review.',
      },
      {
        id: 'sol-check',
        title: 'Checked claim wording',
        time: '09:48',
        state: 'current',
        detail: 'Sample check: compared the announcement language with the supplied brief.',
      },
      {
        id: 'sol-share',
        title: 'Save to team editor',
        time: 'Review',
        state: 'waiting',
        detail: 'Sample boundary: this action would send the draft to an external integration.',
      },
    ],
  },
  {
    id: 'kit',
    name: 'Kit',
    initials: 'KI',
    role: 'Release reviewer',
    model: 'Review profile',
    avatarClass: 'bg-[#FF8F73] text-[#14142B]',
    userMessage: 'Check the release notes and turn open questions into a review list.',
    agentMessage:
      'I found three unresolved items and separated them from the approved notes. The review list is ready; creating a tracker ticket needs your approval.',
    artifact: {
      name: 'release-review.md',
      meta: '3 open items · Sample file',
    },
    approval: {
      title: 'Create a tracker ticket',
      description:
        'Kit is asking to send the ticket title and review checklist to a connected issue tracker.',
      destination: 'Connected issue tracker',
    },
    activities: [
      {
        id: 'kit-notes',
        title: 'Compared release notes',
        time: '09:50',
        state: 'complete',
        detail: 'Sample step: compared the supplied notes with the launch checklist.',
      },
      {
        id: 'kit-items',
        title: 'Grouped open questions',
        time: '09:52',
        state: 'complete',
        detail: 'Sample output: grouped three unresolved items by owner and topic.',
      },
      {
        id: 'kit-review',
        title: 'Prepared review list',
        time: '09:53',
        state: 'complete',
        detail: 'Sample output: created a concise checklist for human review.',
      },
      {
        id: 'kit-ticket',
        title: 'Create tracker ticket',
        time: 'Review',
        state: 'waiting',
        detail: 'Sample boundary: this action would send ticket content to an external integration.',
      },
    ],
  },
]
