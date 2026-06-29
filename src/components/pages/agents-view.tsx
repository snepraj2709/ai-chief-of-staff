"use client"

import { useMemo, useState } from "react"
import { Brain, Eye, Layers, PauseCircle, Plus } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Progress } from "@/app/components/ui/progress"
import { cn } from "@/lib/utils"

type AutonomyLevel = 1 | 2 | 3 | 4 | 5
type AgentStatus = "safe" | "at-risk" | "suspended"

interface ChartPosition {
  left: string
  top: string
}

interface Agent {
  id: string
  name: string
  shortName: string
  status: AgentStatus
  owner: string
  ownerInitials: string
  currentRunning: string
  autonomy: AutonomyLevel
  budgetUsed: number
  budgetTotal: number
  tools: string[]
  openTasks: number
  chartPosition: ChartPosition
}

const AGENTS: Agent[] = [
  {
    id: "finance",
    name: "Finance Analyst Agent",
    shortName: "Finance",
    status: "safe",
    owner: "Raj M.",
    ownerInitials: "RM",
    currentRunning: "Analyzing Q2 cashflow variance vs. forecast",
    autonomy: 3,
    budgetUsed: 50,
    budgetTotal: 200,
    tools: ["Notion", "Sheets", "Slack"],
    openTasks: 7,
    chartPosition: { left: "12%", top: "52%" },
  },
  {
    id: "marketing",
    name: "Marketing Agent",
    shortName: "Marketing",
    status: "safe",
    owner: "Priya S.",
    ownerInitials: "PS",
    currentRunning: "Drafting ICP messaging framework",
    autonomy: 2,
    budgetUsed: 30,
    budgetTotal: 100,
    tools: ["Notion", "HubSpot", "Slack"],
    openTasks: 4,
    chartPosition: { left: "28%", top: "60%" },
  },
  {
    id: "ops",
    name: "Operations Agent",
    shortName: "Ops",
    status: "at-risk",
    owner: "Maya C.",
    ownerInitials: "MC",
    currentRunning: "Waiting on vendor onboarding decision",
    autonomy: 2,
    budgetUsed: 72,
    budgetTotal: 150,
    tools: ["Notion", "Asana", "Slack"],
    openTasks: 9,
    chartPosition: { left: "48%", top: "63%" },
  },
  {
    id: "cs",
    name: "Customer Success Agent",
    shortName: "CS",
    status: "safe",
    owner: "Sarah K.",
    ownerInitials: "SK",
    currentRunning: "Reconciling customer renewal blockers",
    autonomy: 3,
    budgetUsed: 45,
    budgetTotal: 150,
    tools: ["Notion", "Zendesk", "Slack"],
    openTasks: 3,
    chartPosition: { left: "72%", top: "60%" },
  },
  {
    id: "legal",
    name: "Legal Agent",
    shortName: "Legal",
    status: "safe",
    owner: "Nina V.",
    ownerInitials: "NV",
    currentRunning: "Reviewing contract threshold clause",
    autonomy: 2,
    budgetUsed: 20,
    budgetTotal: 100,
    tools: ["Notion", "Drive", "Slack"],
    openTasks: 5,
    chartPosition: { left: "88%", top: "52%" },
  },
]

const LEADER_POSITION: ChartPosition = { left: "50%", top: "28%" }

const STATUS_STYLES: Record<AgentStatus, { label: string; dot: string; border: string; text: string; bg: string }> = {
  safe: {
    label: "SAFE",
    dot: "bg-[#00E0A4]",
    border: "border-[#00E0A4]/35",
    text: "text-[#00E0A4]",
    bg: "bg-[#00E0A4]/10",
  },
  "at-risk": {
    label: "AT RISK",
    dot: "bg-[#F5B81F]",
    border: "border-[#F5B81F]/55",
    text: "text-[#F5B81F]",
    bg: "bg-[#F5B81F]/10",
  },
  suspended: {
    label: "SUSPENDED",
    dot: "bg-[#FF5C66]",
    border: "border-[#FF5C66]/45",
    text: "text-[#FF5C66]",
    bg: "bg-[#FF5C66]/10",
  },
}

function percentValue(value: string) {
  return Number.parseFloat(value)
}

function StatusPill({ status }: { status: AgentStatus }) {
  const style = STATUS_STYLES[status]

  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-sm font-bold", style.border, style.bg, style.text)}>
      <span className={cn("h-2 w-2 rounded-full", style.dot)} />
      {style.label}
    </span>
  )
}

function TopSummary() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-3">
      <div>
        <h1 className="text-xl font-bold leading-tight text-foreground xl:text-2xl">AI Employees</h1>
        <p className="mt-1.5 font-mono text-sm leading-tight text-[#8190A8] xl:text-base">
          5 agents deployed · 1 at risk · reporting to Chief of Staff
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 xl:gap-3">
        <span className="rounded-md border border-[#00E0A4]/35 bg-[#00E0A4]/10 px-3 py-1.5 font-mono text-sm font-bold text-[#00E0A4] xl:text-base">
          4 SAFE
        </span>
        <span className="rounded-md border border-[#F5B81F]/40 bg-[#F5B81F]/10 px-3 py-1.5 font-mono text-sm font-bold text-[#F5B81F] xl:text-base">
          1 AT RISK
        </span>
        <Button className="h-9 rounded-full bg-[#5B40F0] px-4 text-sm font-bold text-white hover:bg-[#6A55F4] xl:h-10 xl:px-5 xl:text-base">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Agent
        </Button>
      </div>
    </div>
  )
}

function OrgChart({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (agentId: string) => void
}) {
  return (
    <section aria-label="AI employee org chart" className="relative min-h-[56svh] overflow-hidden rounded-[22px] border border-[#232336] bg-[#14141B] lg:h-full lg:min-h-0">
      <div className="absolute inset-x-5 inset-y-0 sm:inset-x-0">
        <div className="absolute inset-0">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {AGENTS.map((agent) => {
              const isSelected = agent.id === selectedId
              return (
                <line
                  key={agent.id}
                  x1={percentValue(LEADER_POSITION.left)}
                  y1={percentValue(LEADER_POSITION.top) + 4}
                  x2={percentValue(agent.chartPosition.left) + 5}
                  y2={percentValue(agent.chartPosition.top) + 3}
                  stroke={isSelected ? "#675CFF" : "#232538"}
                  strokeWidth={isSelected ? 0.22 : 0.14}
                  strokeDasharray={isSelected ? undefined : "1.3 1.7"}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </svg>
        </div>

        <LeaderNode />

        {AGENTS.map((agent) => (
          <AgentNode
            key={agent.id}
            agent={agent}
            isSelected={agent.id === selectedId}
            onSelect={() => onSelect(agent.id)}
          />
        ))}
      </div>

      <OrgChartLegend />
    </section>
  )
}

function LeaderNode() {
  return (
    <div
      className="absolute flex w-[196px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border-2 border-[#675CFF] bg-[#2B255F] px-4 py-3 text-center shadow-[0_0_24px_rgba(99,102,241,0.16)]"
      style={{ left: LEADER_POSITION.left, top: LEADER_POSITION.top }}
    >
      <span className="text-sm font-bold leading-tight text-white">Chief of Staff</span>
      <span className="mt-2 flex items-center gap-2 font-mono text-xs font-semibold text-[#A7ACFF]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8290FF]" />
        Active · 24 actions today
      </span>
    </div>
  )
}

function AgentNode({
  agent,
  isSelected,
  onSelect,
}: {
  agent: Agent
  isSelected: boolean
  onSelect: () => void
}) {
  const statusStyle = STATUS_STYLES[agent.status]
  const isAtRisk = agent.status === "at-risk"

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "absolute w-[108px] -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#675CFF]",
        isSelected
          ? "border-2 border-[#675CFF] bg-[#252149] shadow-[0_0_22px_rgba(99,102,241,0.18)]"
          : isAtRisk
            ? "border-[#F5B81F] bg-[#17151A]"
            : "border-[#28283A] bg-[#12131A] hover:border-[#424259]",
      )}
      style={{ left: agent.chartPosition.left, top: agent.chartPosition.top }}
      aria-pressed={isSelected}
    >
      <span className="flex items-center gap-2">
        <span className={cn("h-2.5 w-2.5 rounded-full", statusStyle.dot)} />
        <span className="truncate text-sm font-bold leading-none text-foreground">{agent.shortName}</span>
      </span>
      <span className="mt-2 block pl-6 font-mono text-xs text-[#8190A8]">
        {agent.status === "at-risk" ? "△ at risk" : "● safe"}
      </span>

      <span className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 rounded-full bg-[#222236] px-3 py-1 font-mono text-xs font-semibold text-[#8190A8]">
        {agent.openTasks}t
      </span>
    </button>
  )
}

function OrgChartLegend() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 border-t border-[#232336] px-5 py-4 font-mono text-xs text-[#8190A8] sm:flex-row sm:items-center sm:justify-between xl:px-7 xl:text-sm">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 xl:gap-x-9">
        <LegendItem color="bg-[#00E0A4]" label="Safe" />
        <LegendItem color="bg-[#F5B81F]" label="At Risk" />
        <LegendItem color="bg-[#FF5C66]" label="Suspended" />
        <span className="flex items-center gap-2">
          <span className="h-px w-4 bg-[#675CFF]" />
          Active link
        </span>
        <span>Nt = open tasks</span>
      </div>
      <span className="whitespace-nowrap">Click any agent to inspect</span>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-3 w-3 rounded-full", color)} />
      {label}
    </span>
  )
}

function InspectorPanel({ agent }: { agent: Agent }) {
  const budgetPct = Math.round((agent.budgetUsed / agent.budgetTotal) * 100)

  return (
    <aside className="flex min-h-fit flex-col rounded-[22px] border border-[#232336] bg-[#14141B] p-5 lg:h-full lg:min-h-0 xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={agent.status} />
            <span className="rounded-md border border-[#675CFF]/35 bg-[#675CFF]/15 px-3 py-1 font-mono text-sm font-bold text-[#8990FF]">
              AUTONOMY L{agent.autonomy}
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold leading-tight text-foreground xl:text-xl">{agent.name}</h2>
        </div>
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#675CFF]/35 bg-[#5B40F0]/25 text-[#8990FF] xl:h-12 xl:w-12">
          <Brain className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoBlock label="Owner">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0EA5E9] font-mono text-xs font-bold text-white">
              {agent.ownerInitials}
            </span>
            <span className="text-base font-bold text-foreground">{agent.owner}</span>
          </div>
        </InfoBlock>

        <InfoBlock label="Autonomy">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                className={cn(
                  "flex h-7 min-w-7 items-center justify-center rounded-md px-2 font-mono text-xs font-bold",
                  level === agent.autonomy
                    ? "bg-[#675CFF] text-white"
                    : "bg-[#242436] text-[#8190A8]",
                )}
              >
                L{level}
              </span>
            ))}
          </div>
        </InfoBlock>
      </div>

      <div className="mt-4 rounded-[22px] border border-[#232336] bg-[#0F1018] px-4 py-4 xl:px-5">
        <div className="flex items-center justify-between font-mono text-sm uppercase tracking-[0.16em] text-[#8190A8]">
          <span>Budget</span>
          <span className="tracking-normal text-foreground">
            ${agent.budgetUsed}
            <span className="text-[#8190A8]">/${agent.budgetTotal}</span>
          </span>
        </div>
        <Progress value={budgetPct} className="mt-4 h-2 bg-[#27273B] [&>div]:bg-[#675CFF]" />
      </div>

      <div className="mt-4 rounded-[22px] border border-[#232336] bg-[#0F1018] px-4 py-4 xl:px-5">
        <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#8190A8]">Currently Running</p>
        <p className="mt-3 flex items-start gap-3 text-sm font-medium leading-snug text-foreground xl:text-base">
          <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#00E0A4] shadow-[0_0_12px_rgba(0,224,164,0.8)]" />
          {agent.currentRunning}
        </p>
      </div>

      <div className="mt-4">
        <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#8190A8]">Tools Access</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {agent.tools.map((tool) => (
            <span key={tool} className="rounded-full border border-[#2B2B40] bg-[#25253A] px-3 py-1.5 font-mono text-sm font-semibold text-[#A7AEC2] xl:py-2 xl:text-base">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto grid gap-2 pt-4 sm:grid-cols-2 xl:gap-3 xl:pt-6">
        <Button className="h-11 rounded-full border border-[#675CFF]/50 bg-[#2B255F] text-sm font-bold text-[#C3C6FF] hover:bg-[#352B76] xl:h-12 xl:text-base">
          <Eye className="h-5 w-5" aria-hidden="true" />
          View Tasks
        </Button>
        <Button className="h-11 rounded-full bg-[#27273A] text-sm font-bold text-[#A7AEC2] hover:bg-[#303047] xl:h-12 xl:text-base">
          <Layers className="h-5 w-5" aria-hidden="true" />
          Adjust Autonomy
        </Button>
        <Button className="h-11 rounded-full border border-[#8F2932]/75 bg-[#31131A] text-sm font-bold text-[#FF5C66] hover:bg-[#3B151D] sm:col-span-2 xl:h-12 xl:text-base">
          <PauseCircle className="h-5 w-5" aria-hidden="true" />
          Suspend Agent
        </Button>
      </div>
    </aside>
  )
}

function InfoBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[22px] border border-[#232336] bg-[#0F1018] px-4 py-3 xl:py-4">
      <p className="mb-2 font-mono text-sm uppercase tracking-[0.16em] text-[#8190A8] xl:mb-3">{label}</p>
      {children}
    </div>
  )
}

export function AgentsView() {
  const [selectedId, setSelectedId] = useState("finance")
  const selectedAgent = useMemo(
    () => AGENTS.find((agent) => agent.id === selectedId) ?? AGENTS[0],
    [selectedId],
  )

  return (
    <div className="box-border flex min-h-full flex-col bg-background px-6 py-6 text-foreground sm:px-8 lg:h-full lg:min-h-0 lg:overflow-hidden xl:px-10">
      <TopSummary />

      <div className="mt-5 grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_520px]">
        <OrgChart selectedId={selectedId} onSelect={setSelectedId} />
        <InspectorPanel agent={selectedAgent} />
      </div>
    </div>
  )
}
