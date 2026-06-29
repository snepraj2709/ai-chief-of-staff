import { useState } from "react"
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  GitCompareArrows,
  Minus,
  PlayCircle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { cn } from "@/lib/utils"

type DependencyNode = {
  id: string
  label: string
  detail?: string
  x: number
  y: number
  radius: number
  fill: string
  stroke: string
  labelClassName?: string
}

type DependencyEdge = {
  from: string
  to: string
  tone: "dependency" | "conflict" | "warning" | "success"
  dashed?: boolean
}

type ConflictHistoryRow = {
  label: string
  count: number
  trend: "up" | "down" | "flat"
}

type ConflictClaim = {
  initials: string
  agent: string
  text: string
  avatarClassName: string
  agentClassName: string
  cardClassName: string
}

type FrictionConflict = {
  id: string
  type: string
  severity: "High" | "Medium"
  domains: string
  discovered: string
  headerClassName: string
  typeTagClassName: string
  severityTagClassName: string
  claims: [ConflictClaim, ConflictClaim]
  impact: string
  resolution: string
  confidence: number
  risk: string
  escalateLabel: string
}

const frictionConflicts: FrictionConflict[] = [
  {
    id: "F-07",
    type: "Contradictory Assumption",
    severity: "High",
    domains: "Finance Ops",
    discovered: "Discovered 1h ago",
    headerClassName: "border-[#3A1B2A] bg-[#2A1118]/82",
    typeTagClassName: "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#FF6B74]",
    severityTagClassName: "border-[#F97316]/40 bg-[#F97316]/10 text-[#FB8C00]",
    claims: [
      {
        initials: "FA",
        agent: "Finance Agent",
        text: "Contract clause 4.2 allows autonomous spend up to $50K without approval.",
        avatarClassName: "bg-[#0EA5E9] text-white",
        agentClassName: "text-[#6D6AFE]",
        cardClassName: "border-[#2E2A68]/90",
      },
      {
        initials: "LA",
        agent: "Legal Agent",
        text: "Internal policy requires CFO approval for any spend above $10K per vendor.",
        avatarClassName: "bg-[#0EA5E9] text-white",
        agentClassName: "text-[#F59E0B]",
        cardClassName: "border-[#7C4A0D]/55",
      },
    ],
    impact:
      "Finance Agent is about to auto-approve a $42K vendor invoice. Legal Agent has flagged this as a policy breach that could expose the company to audit risk.",
    resolution:
      "Apply the stricter threshold: enforce $10K approval requirement immediately. Finance Agent pauses invoice. Route to Raj M. for CFO sign-off. Update shared policy context for both agents.",
    confidence: 89,
    risk: "High - potential audit exposure, policy inconsistency on record",
    escalateLabel: "Escalate to CEO",
  },
  {
    id: "F-06",
    type: "Resource Conflict",
    severity: "Medium",
    domains: "People Ops",
    discovered: "Discovered 3h ago",
    headerClassName: "border-[#4A3414] bg-[#2C2113]/82",
    typeTagClassName: "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#FACC15]",
    severityTagClassName: "border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FACC15]",
    claims: [
      {
        initials: "OA",
        agent: "Ops Agent",
        text: "Scheduled Sarah K. for vendor contract review on Jul 2, 10:00-12:00.",
        avatarClassName: "bg-[#A855F7] text-white",
        agentClassName: "text-[#10B981]",
        cardClassName: "border-[#0F5C48]/70",
      },
      {
        initials: "CS",
        agent: "CS Agent",
        text: "Needs Sarah K. on Acme renewal call at Jul 2, 10:30-11:30.",
        avatarClassName: "bg-[#7C3AED] text-white",
        agentClassName: "text-[#A78BFA]",
        cardClassName: "border-[#5B35A3]/70",
      },
    ],
    impact:
      "Sarah K. is double-booked across an external vendor review and high-value customer renewal call. One workstream will miss owner context unless reassigned.",
    resolution:
      "Move Acme renewal call to Jul 2 at 13:00. Notify CS Agent and Ops Agent of updated schedule. Add Sarah K. as required attendee after vendor review.",
    confidence: 97,
    risk: "Medium - customer delay risk if no owner attends live renewal discussion",
    escalateLabel: "Escalate to Ops",
  },
]

const dependencyNodes: DependencyNode[] = [
  {
    id: "ai",
    label: "AI",
    x: 260,
    y: 58,
    radius: 30,
    fill: "rgba(99, 102, 241, 0.18)",
    stroke: "#6366F1",
    labelClassName: "font-semibold",
  },
  {
    id: "finance",
    label: "Finance",
    x: 96,
    y: 174,
    radius: 25,
    fill: "rgba(99, 102, 241, 0.12)",
    stroke: "#6366F1",
    labelClassName: "font-semibold",
  },
  {
    id: "legal",
    label: "Legal",
    x: 206,
    y: 190,
    radius: 25,
    fill: "rgba(245, 158, 11, 0.12)",
    stroke: "#F59E0B",
  },
  {
    id: "ops",
    label: "Ops",
    x: 332,
    y: 178,
    radius: 25,
    fill: "rgba(16, 185, 129, 0.12)",
    stroke: "#10B981",
  },
  {
    id: "cs",
    label: "CS",
    x: 446,
    y: 166,
    radius: 25,
    fill: "rgba(139, 92, 246, 0.14)",
    stroke: "#8B5CF6",
  },
  {
    id: "invoice",
    label: "$42K",
    detail: "Invoice",
    x: 114,
    y: 286,
    radius: 19,
    fill: "rgba(239, 68, 68, 0.12)",
    stroke: "#EF4444",
    labelClassName: "font-semibold",
  },
  {
    id: "policy",
    label: "Policy",
    detail: "Doc",
    x: 224,
    y: 286,
    radius: 19,
    fill: "rgba(245, 158, 11, 0.12)",
    stroke: "#F59E0B",
  },
  {
    id: "sarah",
    label: "Sarah",
    detail: "K.",
    x: 382,
    y: 286,
    radius: 19,
    fill: "rgba(100, 116, 139, 0.16)",
    stroke: "#64748B",
  },
]

const dependencyEdges: DependencyEdge[] = [
  { from: "ai", to: "finance", tone: "dependency" },
  { from: "ai", to: "legal", tone: "dependency" },
  { from: "ai", to: "ops", tone: "dependency" },
  { from: "ai", to: "cs", tone: "dependency" },
  { from: "finance", to: "legal", tone: "conflict", dashed: true },
  { from: "finance", to: "invoice", tone: "conflict", dashed: true },
  { from: "legal", to: "policy", tone: "warning", dashed: true },
  { from: "ops", to: "sarah", tone: "success", dashed: true },
  { from: "cs", to: "sarah", tone: "conflict", dashed: true },
]

const conflictHistoryRows: ConflictHistoryRow[] = [
  { label: "Resource Conflict", count: 3, trend: "up" },
  { label: "Contradictory Assumption", count: 2, trend: "flat" },
  { label: "Priority Clash", count: 1, trend: "down" },
  { label: "Data Mismatch", count: 1, trend: "flat" },
]

const edgeTone = {
  dependency: {
    stroke: "rgba(100, 116, 139, 0.24)",
    marker: "url(#dependency-arrow)",
  },
  conflict: {
    stroke: "#EF4444",
    marker: "url(#conflict-arrow)",
  },
  warning: {
    stroke: "#F59E0B",
    marker: "url(#warning-arrow)",
  },
  success: {
    stroke: "#10B981",
    marker: "url(#success-arrow)",
  },
} satisfies Record<DependencyEdge["tone"], { stroke: string; marker: string }>

export function FrictionView() {
  const [resolved, setResolved] = useState([false, false])

  const resolve = (i: number) =>
    setResolved((prev) => prev.map((v, idx) => (idx === i ? true : v)))

  return (
    <div className="px-6 py-7 text-[var(--foreground)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header>
          <h1 className="text-[26px] font-semibold leading-tight text-[var(--foreground)]">
            Cross-Agent Friction Resolver
          </h1>
          <p className="mt-1 font-mono text-[14px] font-medium leading-none text-[var(--muted-foreground)]">
            AI-detected inter-agent conflicts · requires mediation
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-9 items-center gap-2 rounded-full border border-[#F97316]/35 bg-[#F97316]/10 px-4 text-[14px] font-semibold text-[#FB8C00] shadow-[0_0_18px_rgba(249,115,22,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#FB8C00] shadow-[0_0_8px_#FB8C00]" />
            Active Friction: 2 conflicts
          </span>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[#27283E] bg-[#1D1D2B] px-4 text-[14px] font-semibold text-[#94A3B8] transition-colors hover:border-[#34354F] hover:text-[var(--foreground)]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Scan for conflicts
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px] 2xl:grid-cols-[minmax(0,1fr)_540px]">
        <section className="min-w-0 space-y-5">
          <div className="space-y-5">
            {frictionConflicts.map((conflict, index) => (
              <FrictionConflictCard
                key={conflict.id}
                conflict={conflict}
                resolved={resolved[index]}
                onResolve={() => resolve(index)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {[
              { value: "2", label: "Agents blocked by dependency" },
              { value: "1", label: "Stale handoffs (48h+)" },
              { value: "1", label: "Workstreams without clear owner" },
              { value: "3", label: "Conflicts resolved without human intervention this week" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded border border-[var(--border)] bg-[var(--card)] p-3 text-center"
              >
                <p className="font-mono text-2xl font-semibold text-[var(--foreground)]">{value}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="min-w-0 space-y-4 xl:sticky xl:top-6 xl:self-start">
          <AgentDependencyMap />
          <ConflictHistoryPanel />
        </aside>
      </div>
    </div>
  )
}

function FrictionConflictCard({
  conflict,
  resolved,
  onResolve,
}: {
  conflict: FrictionConflict
  resolved: boolean
  onResolve: () => void
}) {
  if (resolved) {
    return (
      <div className="flex items-center gap-2 rounded-[18px] border border-[#10B981]/25 bg-[#10B981]/10 p-4 text-sm font-semibold text-[#10B981]">
        <span>&#10003; {conflict.id} resolved - workstream updated.</span>
      </div>
    )
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-[18px] border-[#24233A] bg-[#111118] shadow-none">
      <div
        className={cn(
          "flex min-h-[58px] flex-col gap-3 border-b px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between",
          conflict.headerClassName,
        )}
      >
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="font-mono text-[15px] font-semibold text-[#64748B]">{conflict.id}</span>
          <FrictionTag className={conflict.typeTagClassName}>
            <GitCompareArrows className="h-3.5 w-3.5" aria-hidden="true" />
            {conflict.type}
          </FrictionTag>
          <FrictionTag className={conflict.severityTagClassName} dot>
            {conflict.severity}
          </FrictionTag>
          <span className="font-mono text-[13px] font-medium text-[#64748B]">{conflict.domains}</span>
        </div>
        <span className="font-mono text-[13px] font-medium text-[#64748B]">{conflict.discovered}</span>
      </div>

      <div className="grid gap-7 px-6 py-6 lg:grid-cols-[minmax(0,1.28fr)_minmax(290px,0.9fr)] 2xl:grid-cols-[minmax(0,1.42fr)_minmax(360px,1fr)]">
        <div className="min-w-0">
          <SectionLabel>Conflicting Claims</SectionLabel>
          <div className="mt-5 space-y-5">
            <ClaimCard claim={conflict.claims[0]} />
            <VsDivider />
            <ClaimCard claim={conflict.claims[1]} />
            <ImpactPanel>{conflict.impact}</ImpactPanel>
          </div>
        </div>

        <div className="min-w-0">
          <SectionLabel>AI CoS Resolution</SectionLabel>
          <div className="mt-5 rounded-[18px] border border-[#37307A] bg-[#18152B] p-6">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#4F46E5]/45 text-[#8B8DFF]">
                <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-[#B8BBFF]">Proposed by AI CoS</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="h-1.5 w-16 rounded-full bg-[#2D2B4B]">
                    <span
                      className="block h-full rounded-full bg-[#6D63FF]"
                      style={{ width: `${conflict.confidence}%` }}
                    />
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-[#8B8DFF]">
                    {conflict.confidence}% conf.
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-[15px] font-normal leading-[1.6] text-[#A8B1C7]">
              {conflict.resolution}
            </p>

            <div className="mt-5 rounded-[16px] border border-[#EF4444]/25 bg-[#EF4444]/8 px-4 py-3">
              <p className="text-[13px] font-normal leading-relaxed text-[#A8B1C7]">
                <span className="font-mono font-semibold uppercase tracking-[0.08em] text-[#FF6B74]">
                  Risk:
                </span>{" "}
                {conflict.risk}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Button
              type="button"
              onClick={onResolve}
              className="h-12 w-full rounded-full bg-[#5538F7] text-[15px] font-medium text-white hover:bg-[#6147FF]"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Accept Resolution
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full rounded-full border border-[#EF4444]/45 bg-[#EF4444]/10 text-[15px] font-medium text-[#FF6B74] hover:bg-[#EF4444]/15 hover:text-[#FF6B74]"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              {conflict.escalateLabel}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function ClaimCard({ claim }: { claim: ConflictClaim }) {
  return (
    <div
      className={cn(
        "grid min-h-[88px] gap-4 rounded-[18px] border bg-[#0F0F16] px-4 py-4 md:grid-cols-[190px_minmax(0,1fr)] md:items-center",
        claim.cardClassName,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold",
            claim.avatarClassName,
          )}
        >
          {claim.initials}
        </span>
        <span className={cn("truncate font-mono text-[13px] font-semibold", claim.agentClassName)}>
          {claim.agent}
        </span>
      </div>
      <p className="text-[15px] font-normal leading-[1.55] text-[var(--foreground)]">
        {claim.text}
      </p>
    </div>
  )
}

function VsDivider() {
  return (
    <div className="flex items-center gap-5">
      <span className="h-px flex-1 bg-[#252336]" />
      <span className="flex h-9 w-11 items-center justify-center rounded-full bg-[#222335] font-mono text-[13px] font-semibold text-[#7B86A2]">
        VS
      </span>
      <span className="h-px flex-1 bg-[#252336]" />
    </div>
  )
}

function ImpactPanel({ children }: { children: string }) {
  return (
    <div className="rounded-[18px] border border-[#EF4444]/35 bg-[#EF4444]/10 px-5 py-5">
      <div className="mb-2 flex items-center gap-2 font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-[#FF6B74]">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        Impact If Unresolved
      </div>
      <p className="pl-7 text-[15px] font-normal leading-[1.6] text-[#A8B1C7]">{children}</p>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
      {children}
    </p>
  )
}

function FrictionTag({
  children,
  className,
  dot = false,
}: {
  children: React.ReactNode
  className: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border px-3 font-mono text-[13px] font-semibold uppercase tracking-[0.14em]",
        className,
      )}
    >
      {dot && <span className="h-2 w-2 rounded-full bg-current" />}
      {children}
    </span>
  )
}

function AgentDependencyMap() {
  const nodesById = Object.fromEntries(dependencyNodes.map((node) => [node.id, node]))

  return (
    <Card className="gap-0 rounded-[18px] border-[#24233A] bg-[var(--card)] p-6">
      <div>
        <h3 className="text-[17px] font-semibold leading-tight text-[var(--foreground)]">Agent Dependency Map</h3>
        <p className="mt-1 text-[15px] font-medium leading-tight text-[var(--muted-foreground)]">Conflict edges highlighted in red</p>
      </div>

      <div className="mt-5 h-[342px] min-w-0">
        <svg
          role="img"
          aria-label="Agent dependency map with conflict edges highlighted"
          viewBox="0 0 520 330"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <marker id="dependency-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="rgba(100, 116, 139, 0.28)" />
            </marker>
            <marker id="conflict-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#EF4444" />
            </marker>
            <marker id="warning-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#F59E0B" />
            </marker>
            <marker id="success-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#10B981" />
            </marker>
          </defs>

          {dependencyEdges.map((edge) => {
            const from = nodesById[edge.from]
            const to = nodesById[edge.to]
            const tone = edgeTone[edge.tone]

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={tone.stroke}
                strokeWidth={edge.tone === "conflict" ? 2 : 1.25}
                strokeDasharray={edge.dashed ? "4 5" : undefined}
                markerEnd={tone.marker}
              />
            )
          })}

          {dependencyNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius}
                fill={node.fill}
                stroke={node.stroke}
                strokeWidth={1.6}
              />
              <text
                x={node.x}
                y={node.detail ? node.y - 2 : node.y + 4}
                textAnchor="middle"
                className={cn("fill-[var(--foreground)] text-[10px]", node.labelClassName)}
              >
                {node.label}
              </text>
              {node.detail && (
                <text
                  x={node.x}
                  y={node.y + 11}
                  textAnchor="middle"
                  className="fill-[var(--muted-foreground)] text-[8px]"
                >
                  {node.detail}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px] text-[var(--muted-foreground)]">
        <span className="inline-flex items-center gap-2">
          <span className="h-px w-7 bg-[#EF4444]" />
          Conflict edge
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-px w-7 border-t border-dashed border-[var(--muted-foreground)]/50" />
          Dependency
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border border-[#EF4444] bg-[#EF4444]/10" />
          Conflict node
        </span>
      </div>
    </Card>
  )
}

function ConflictHistoryPanel() {
  return (
    <Card className="gap-0 rounded-[18px] border-[#24233A] bg-[var(--card)] p-6">
      <h3 className="text-[16px] font-semibold leading-tight text-[var(--foreground)]">Conflict History (7d)</h3>

      <div className="mt-5">
        {conflictHistoryRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-[#222335] py-3.5 first:pt-0"
          >
            <span className="text-[14px] font-medium text-[var(--muted-foreground)]">{row.label}</span>
            <span className="inline-flex items-center gap-2">
              <span className="font-mono text-[14px] font-semibold text-[var(--foreground)]">{row.count}</span>
              <TrendIcon trend={row.trend} />
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6">
        <span className="text-[14px] font-medium text-[var(--muted-foreground)]">Avg resolution time</span>
        <span className="font-mono text-[14px] font-semibold text-[#10B981]">4.2 min</span>
      </div>
    </Card>
  )
}

function TrendIcon({ trend }: { trend: ConflictHistoryRow["trend"] }) {
  if (trend === "up") {
    return <ArrowUpRight className="h-3.5 w-3.5 text-[#EF4444]" aria-hidden="true" />
  }

  if (trend === "down") {
    return <ArrowDownRight className="h-3.5 w-3.5 text-[#10B981]" aria-hidden="true" />
  }

  return <Minus className="h-3.5 w-3.5 text-[var(--muted-foreground)]" aria-hidden="true" />
}
