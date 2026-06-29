import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group"
import { MetricCard } from "@/components/ui/metric-card"

// ─── Data ────────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    label: "Top Priorities",
    value: "3",
    caption: "Active workstreams",
    valueClassName: "text-foreground",
  },
  {
    label: "Decisions Needed",
    value: "3",
    caption: "Awaiting your input",
    valueClassName: "text-[var(--chart-3)]",
  },
  {
    label: "Blocked",
    value: "2",
    caption: "Workstreams stalled",
    valueClassName: "text-[var(--destructive)]",
  },
  {
    label: "Agents at Risk",
    value: "1",
    caption: "Needs review",
    valueClassName: "text-[var(--destructive)]",
  },
  {
    label: "Cost Today",
    value: "$24.80",
    caption: "Within daily budget",
    valueClassName: "text-[var(--chart-2)]",
  },
]

const WORKSTREAMS = [
  {
    priority: "P1",
    name: "Close 3 enterprise pilots",
    owner: "Sarah K",
    agents: "3 agents",
    status: "On Track",
    statusOk: true,
    blocker: "",
    action: null,
  },
  {
    priority: "P2",
    name: "Reduce onboarding friction",
    owner: "Raj M",
    agents: "2 agents",
    status: "Blocked",
    statusOk: false,
    blocker: "CS Agent waiting on Legal sign-off",
    action: "resolve",
  },
  {
    priority: "P3",
    name: "Q2 market positioning",
    owner: "AI CoS",
    agents: "1 agent",
    status: "On Track",
    statusOk: true,
    blocker: "",
    action: null,
  },
]

const FILTER_CHIPS = [
  { value: "all", label: "All" },
  { value: "missing-context", label: "Missing Context" },
  { value: "cross-agent", label: "Cross-Agent" },
  { value: "decision-needed", label: "Decision Needed" },
  { value: "budget", label: "Budget" },
  { value: "safety", label: "Safety" },
]

const BLOCKERS = [
  {
    borderColor: "var(--destructive)",
    badge: "Cross-Agent",
    badgeBg: "var(--destructive)",
    title: "CS Agent \u2194 Legal Agent",
    body: "Contract threshold dispute \u2014 Finance says $50K limit, Legal says $10K.",
    buttonLabel: "Resolve",
  },
  {
    borderColor: "var(--chart-3)",
    badge: "Decision Needed",
    badgeBg: "var(--chart-3)",
    title: "ICP Definition Blocked",
    body: "Marketing Agent cannot proceed. ICP definition required before execution.",
    buttonLabel: "Decide",
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardView() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="flex flex-col gap-6 p-6 w-full">

      {/* Section 1 – Priority Drift Alert */}
      <div
        className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3"
        style={{ borderLeftWidth: "4px", borderLeftColor: "var(--chart-3)" }}
        role="alert"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--chart-3)" }}
            aria-hidden="true"
          />
          <p className="text-sm text-foreground">
            <span className="font-semibold">Priority Drift Detected</span>
            {" \u2014 Finance Analyst Agent is running tasks not mapped to your top 3 priorities."}
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          Review
        </Button>
      </div>

      {/* Section 2 – Stat Cards */}
      <div className="grid grid-cols-5 gap-4">
        {STAT_CARDS.map((card) => (
          <MetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            caption={card.caption}
            valueClassName={card.valueClassName}
          />
        ))}
      </div>

      {/* Section 3 – Workstreams Table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Workstreams</h2>
          <Button variant="ghost" size="sm">+ New</Button>
        </div>

        <Card className="overflow-hidden gap-0 p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-xs px-4">Priority</TableHead>
                <TableHead className="text-xs">Workstream</TableHead>
                <TableHead className="text-xs">Human Owner</TableHead>
                <TableHead className="text-xs">AI Agents</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Blocker</TableHead>
                <TableHead className="text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WORKSTREAMS.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="px-4">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      {row.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">{row.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{row.owner}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">{row.agents}</span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 text-sm">
                      <span
                        className="inline-block h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: row.statusOk
                            ? "var(--chart-2)"
                            : "var(--destructive)",
                        }}
                        aria-hidden="true"
                      />
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {row.blocker || "\u2014"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.action === "resolve" && (
                      <Button
                        variant="outline"
                        size="sm"
                        style={{
                          color: "var(--chart-3)",
                          borderColor: "var(--chart-3)",
                        }}
                      >
                        Resolve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Section 4 – Blocker Lane */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground">Blocker Lane</h2>

        <ToggleGroup
          type="single"
          value={activeFilter}
          onValueChange={(v) => { if (v) setActiveFilter(v) }}
          variant="outline"
          className="flex flex-wrap gap-1.5 justify-start w-full"
        >
          {FILTER_CHIPS.map((chip) => (
            <ToggleGroupItem
              key={chip.value}
              value={chip.value}
              className="rounded-full px-3 text-xs font-medium h-7 data-[state=on]:bg-[var(--primary)] data-[state=on]:text-white data-[state=on]:border-[var(--primary)]"
            >
              {chip.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="grid grid-cols-2 gap-4">
          {BLOCKERS.map((blocker) => (
            <div
              key={blocker.title}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
              style={{ borderLeftWidth: "4px", borderLeftColor: blocker.borderColor }}
            >
              <span
                className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                style={{ backgroundColor: blocker.badgeBg }}
              >
                {blocker.badge}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">{blocker.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{blocker.body}</p>
              </div>
              <Button variant="outline" size="sm" className="w-fit">
                {blocker.buttonLabel}
              </Button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
