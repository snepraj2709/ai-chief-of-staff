import { Zap, Plus, Eye, TriangleAlert as AlertTriangle } from "lucide-react"

// ─── Stat Cards ──────────────────────────────────────────────────────────────

function PrioritiesCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-4">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Top 3 Priorities
      </span>
      <div className="flex flex-col gap-1.5">
        {[
          { p: "P1", label: "Series B Close" },
          { p: "P2", label: "Q3 Budget" },
          { p: "P3", label: "GTM v2" },
        ].map(({ p, label }) => (
          <div key={p} className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-muted-foreground w-5">{p}</span>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BigStatCard({
  label,
  value,
  caption,
  valueColor,
}: {
  label: string
  value: string
  caption: string
  valueColor: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-4">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className={`font-mono text-3xl font-bold leading-none ${valueColor}`}>{value}</span>
      <span className="font-mono text-[10px] text-muted-foreground">{caption}</span>
    </div>
  )
}

// ─── Workstreams Table ───────────────────────────────────────────────────────

interface Workstream {
  priority: string
  name: string
  ownerInitials: string
  ownerName: string
  ownerColor: string
  agentCount: number
  agentOnline: boolean
  status: "on" | "blocked"
  action: "view" | "decide"
}

const WORKSTREAMS: Workstream[] = [
  {
    priority: "P1",
    name: "Series B Close",
    ownerInitials: "SK",
    ownerName: "Sarah K.",
    ownerColor: "bg-[#6366F1]",
    agentCount: 3,
    agentOnline: true,
    status: "on",
    action: "view",
  },
  {
    priority: "P2",
    name: "Q3 Budget Sign-off",
    ownerInitials: "RM",
    ownerName: "Raj M.",
    ownerColor: "bg-[#10B981]",
    agentCount: 1,
    agentOnline: false,
    status: "blocked",
    action: "decide",
  },
  {
    priority: "P3",
    name: "GTM Playbook v2",
    ownerInitials: "AI",
    ownerName: "AI CoS",
    ownerColor: "bg-[#F59E0B]",
    agentCount: 2,
    agentOnline: true,
    status: "on",
    action: "view",
  },
]

function WorkstreamsTable() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Active Workstreams</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Agent-managed initiatives · sorted by CEO priority
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add workstream
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Priority", "Workstream", "Owner", "Agents", "Status", "Action"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2.5 text-left font-semibold uppercase tracking-widest text-[10px] text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WORKSTREAMS.map((ws) => (
              <tr
                key={ws.name}
                className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
              >
                <td className="px-5 py-3">
                  <span className="font-mono text-xs font-bold text-primary">{ws.priority}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm font-medium text-foreground">{ws.name}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${ws.ownerColor}`}
                    >
                      {ws.ownerInitials}
                    </span>
                    <span className="text-xs text-foreground">{ws.ownerName}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-foreground">{ws.agentCount} agents</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${ws.agentOnline ? "bg-[#10B981]" : "bg-[#EF4444]"}`}
                    />
                  </div>
                </td>
                <td className="px-5 py-3">
                  {ws.status === "on" ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#10B981]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                      ON
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#EF4444]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                      BLOCKED
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {ws.action === "view" ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-2 py-1 font-mono text-[10px] font-bold text-[#F59E0B] hover:bg-[#F59E0B]/20 transition-colors"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      DECIDE
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-border">
        <span className="font-mono text-[10px] text-muted-foreground">
          3 active workstreams · 6 total agents deployed · last synced 2 min ago
        </span>
      </div>
    </div>
  )
}

// ─── Blocker Lane ────────────────────────────────────────────────────────────

const BLOCKERS = [
  {
    type: "missing-context",
    tagLabel: "Missing Context",
    tagClass: "bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B]",
    body: "Finance agent needs Q2 actuals from Raj M.",
    actionLabel: "Provide context",
    actionClass: "text-[#F59E0B]",
  },
  {
    type: "cross-agent",
    tagLabel: "Cross-Agent Conflict",
    tagClass: "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]",
    body: "Legal and Ops agents have conflicting timelines on vendor NDA.",
    actionLabel: "Provide context",
    actionClass: "text-[#EF4444]",
  },
  {
    type: "decision-needed",
    tagLabel: "Decision Needed",
    tagClass: "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]",
    body: "Series B valuation cap: approve redlines or counter?",
    actionLabel: "Resolve now",
    actionClass: "text-[#EF4444]",
  },
]

function BlockerLane() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-start justify-between gap-2 px-4 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Blocker Lane</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Requires CEO resolution</p>
        </div>
        <span className="rounded-md bg-[#EF4444]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#EF4444]">
          3 OPEN
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {BLOCKERS.map((blocker) => (
          <div
            key={blocker.type}
            className="rounded-lg border border-border bg-background p-3 flex flex-col gap-2"
          >
            <span
              className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${blocker.tagClass}`}
            >
              {blocker.tagLabel}
            </span>
            <p className="text-xs text-foreground leading-relaxed">{blocker.body}</p>
            <button
              type="button"
              className={`text-[11px] font-semibold text-left transition-opacity hover:opacity-70 ${blocker.actionClass}`}
            >
              {blocker.actionLabel} →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function DashboardView() {
  const today = new Date()
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" })
  const monthDay = today.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Chief of Staff</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {dayName} {monthDay} · Good morning. Here is what matters today.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-1">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
          >
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Morning Brief
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Input
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-3">
        <PrioritiesCard />
        <BigStatCard
          label="Decisions Needed"
          value="3"
          caption="awaiting your input"
          valueColor="text-[#F59E0B]"
        />
        <BigStatCard
          label="Blocked"
          value="2"
          caption="agents stalled"
          valueColor="text-[#EF4444]"
        />
        <BigStatCard
          label="Agents at Risk"
          value="1"
          caption="Finance · autonomy breach"
          valueColor="text-[#F59E0B]"
        />
        <BigStatCard
          label="Cost Today"
          value="$24.80"
          caption="of $200 daily budget"
          valueColor="text-[#10B981]"
        />
      </div>

      {/* Bottom two-column layout */}
      <div className="grid grid-cols-[1fr_300px] gap-4">
        <WorkstreamsTable />
        <BlockerLane />
      </div>
    </div>
  )
}
