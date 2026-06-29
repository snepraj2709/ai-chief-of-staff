import { useState } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/ui/table"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Textarea } from "@/app/components/ui/textarea"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/app/components/ui/drawer"
import { Download, FileText, Star } from "lucide-react"

type Trend = "up" | "down" | "flat"
type Recommendation = "Promote" | "Maintain" | "Restrict" | "Retrain"

type Metric = {
  label: string
  value: string
  trend: Trend
  good: boolean // whether this trend is good (green) or bad (red); flat is always muted
}

type Scorecard = {
  name: string
  recommendation: Recommendation
  metrics: Metric[]
}

const scorecards: Scorecard[] = [
  {
    name: "Finance Analyst",
    recommendation: "Maintain",
    metrics: [
      { label: "Speed", value: "1.2d", trend: "down", good: true },
      { label: "Quality", value: "87", trend: "up", good: true },
      { label: "Cost", value: "$4.20", trend: "down", good: true },
      { label: "Violations", value: "0", trend: "flat", good: true },
      { label: "Readiness", value: "78%", trend: "up", good: true },
    ],
  },
  {
    name: "Marketing Agent",
    recommendation: "Retrain",
    metrics: [
      { label: "Speed", value: "2.1d", trend: "up", good: false },
      { label: "Quality", value: "72", trend: "down", good: false },
      { label: "Cost", value: "$6.10", trend: "up", good: false },
      { label: "Violations", value: "0", trend: "flat", good: true },
      { label: "Readiness", value: "41%", trend: "down", good: false },
    ],
  },
  {
    name: "CS Agent",
    recommendation: "Restrict",
    metrics: [
      { label: "Speed", value: "1.8d", trend: "up", good: false },
      { label: "Quality", value: "65", trend: "down", good: false },
      { label: "Cost", value: "$5.40", trend: "up", good: false },
      { label: "Violations", value: "1", trend: "up", good: false },
      { label: "Readiness", value: "38%", trend: "down", good: false },
    ],
  },
  {
    name: "Legal Agent",
    recommendation: "Promote",
    metrics: [
      { label: "Speed", value: "0.9d", trend: "down", good: true },
      { label: "Quality", value: "91", trend: "up", good: true },
      { label: "Cost", value: "$3.10", trend: "down", good: true },
      { label: "Violations", value: "0", trend: "flat", good: true },
      { label: "Readiness", value: "88%", trend: "up", good: true },
    ],
  },
  {
    name: "Market Research",
    recommendation: "Promote",
    metrics: [
      { label: "Speed", value: "0.7d", trend: "down", good: true },
      { label: "Quality", value: "94", trend: "up", good: true },
      { label: "Cost", value: "$2.80", trend: "down", good: true },
      { label: "Violations", value: "0", trend: "flat", good: true },
      { label: "Readiness", value: "96%", trend: "up", good: true },
    ],
  },
]

type EvidenceRow = {
  task: string
  agent: string
  workstream: string
  cost: string
  confidence: string
  quality: number // filled stars out of 5
}

const evidenceRows: EvidenceRow[] = [
  { task: "Analyzed Q2 cashflow gaps", agent: "Finance Analyst", workstream: "Close enterprise pilots", cost: "$4.20", confidence: "91%", quality: 5 },
  { task: "Drafted ICP messaging framework", agent: "Marketing Agent", workstream: "Q2 market positioning", cost: "$6.10", confidence: "74%", quality: 3 },
  { task: "Reviewed contract threshold clause", agent: "Legal Agent", workstream: "Close enterprise pilots", cost: "$3.10", confidence: "95%", quality: 5 },
  { task: "APAC competitor pricing analysis", agent: "Market Research", workstream: "Q2 market positioning", cost: "$2.80", confidence: "88%", quality: 4 },
  { task: "Onboarding flow friction audit", agent: "CS Agent", workstream: "Reduce onboarding fric.", cost: "$5.40", confidence: "67%", quality: 3 },
  { task: "Enterprise deal velocity report", agent: "Market Research", workstream: "Close enterprise pilots", cost: "$3.20", confidence: "92%", quality: 5 },
  { task: "ICP alignment memo for Sales handoff", agent: "Marketing Agent", workstream: "Q2 market positioning", cost: "$5.90", confidence: "71%", quality: 3 },
]

function recommendationBadge(rec: Recommendation) {
  switch (rec) {
    case "Promote":
      return (
        <Badge
          className="border-transparent text-[var(--card)]"
          style={{ backgroundColor: "var(--chart-2)" }}
        >
          Promote
        </Badge>
      )
    case "Restrict":
      return <Badge variant="destructive">Restrict</Badge>
    case "Retrain":
      return (
        <Badge
          className="border-transparent text-[var(--card)]"
          style={{ backgroundColor: "var(--chart-3)" }}
        >
          Retrain
        </Badge>
      )
    case "Maintain":
    default:
      return (
        <Badge variant="outline" className="text-[var(--muted-foreground)]">
          Maintain
        </Badge>
      )
  }
}

function TrendArrow({ trend, good }: { trend: Trend; good: boolean }) {
  if (trend === "flat") {
    return <span className="text-[var(--muted-foreground)]">—</span>
  }
  const color = good ? "var(--chart-2)" : "var(--destructive)"
  return (
    <span style={{ color }}>{trend === "up" ? "↑" : "↓"}</span>
  )
}

function StarRow({ filled, total = 5 }: { filled: number; total?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${filled} of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          style={{ color: i < filled ? "var(--chart-3)" : "var(--border)" }}
          fill={i < filled ? "var(--chart-3)" : "none"}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

export function EvidenceView() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [starRating, setStarRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")

  const openEvidence = (rowIndex: number) => {
    setSelectedTask(rowIndex)
    setStarRating(0)
    setFeedbackText("")
    setDrawerOpen(true)
  }

  const activeTask = selectedTask !== null ? evidenceRows[selectedTask] : null

  return (
    <div className="flex flex-col gap-8 p-6 text-[var(--foreground)]">
      {/* SECTION 1: Friday Accountability Brief */}
      <section
        className="rounded-lg border border-[var(--border)] border-l-4 border-l-[var(--primary)] bg-[var(--card)] p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">This Week&apos;s Brief</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
              Download Brief
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4" />
              Export Audit Log
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <div className="font-mono text-xl font-bold">23</div>
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">Tasks Completed</div>
          </div>
          <div>
            <div className="font-mono text-xl font-bold" style={{ color: "var(--chart-2)" }}>14</div>
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">Decisions Avoided</div>
          </div>
          <div>
            <div className="font-mono text-xl font-bold">$324.40</div>
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">Total Cost</div>
          </div>
          <div>
            <div className="font-mono text-xs font-bold leading-snug">Marketing → external vendor</div>
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">Highest Risk Event</div>
          </div>
          <div>
            <div className="font-mono text-xl font-bold" style={{ color: "var(--primary)" }}>
              Market Research Agent
            </div>
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">Promotion Recommended</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Agent Performance Scorecards */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Agent Performance</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scorecards.map((card) => (
            <div
              key={card.name}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{card.name}</span>
                {recommendationBadge(card.recommendation)}
              </div>
              <div className="mt-3">
                {card.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between border-b border-[var(--border)]/50 py-1 last:border-0"
                  >
                    <span className="text-xs text-[var(--muted-foreground)]">{m.label}</span>
                    <span className="flex items-center gap-1 font-mono text-xs">
                      {m.value}
                      <TrendArrow trend={m.trend} good={m.good} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Task Evidence Table */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Task Evidence</h3>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Workstream</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidenceRows.map((row, i) => (
                <TableRow key={row.task}>
                  <TableCell className="font-medium">{row.task}</TableCell>
                  <TableCell className="text-[var(--muted-foreground)]">{row.agent}</TableCell>
                  <TableCell className="text-[var(--muted-foreground)]">{row.workstream}</TableCell>
                  <TableCell className="font-mono">{row.cost}</TableCell>
                  <TableCell className="font-mono">{row.confidence}</TableCell>
                  <TableCell>
                    <StarRow filled={row.quality} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => openEvidence(i)}>
                      View Evidence
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* DRAWER */}
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-[480px]">
          <DrawerHeader className="border-b border-[var(--border)]">
            <DrawerTitle className="text-base">
              {activeTask?.task ?? "Task Evidence"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-6 overflow-y-auto p-4 text-sm">
            {/* Task Summary */}
            <div>
              <h4 className="mb-1 text-sm font-medium">Task Summary</h4>
              <p className="text-[var(--muted-foreground)]">
                The agent reviewed the relevant source data, extracted the key signals, and
                produced a structured summary. Findings were cross-checked against existing
                records before delivery to the workspace.
              </p>
            </div>

            {/* Sources Used */}
            <div>
              <h4 className="mb-1 text-sm font-medium">Sources Used</h4>
              <ul className="list-disc pl-5 text-[var(--muted-foreground)]">
                <li>Notion: Finance DB</li>
                <li>Google Sheets: Q2 Revenue Report</li>
                <li>Slack: #finance-ops thread</li>
              </ul>
            </div>

            {/* Tool Calls */}
            <div>
              <h4 className="mb-1 text-sm font-medium">Tool Calls</h4>
              <ul className="flex flex-col gap-1 font-mono text-xs text-[var(--muted-foreground)]">
                <li>10:24 AM — read_notion_page(finance_db)</li>
                <li>10:31 AM — query_sheets(Q2_report)</li>
                <li>10:38 AM — summarize_findings()</li>
              </ul>
            </div>

            {/* Approval Trail */}
            <div>
              <h4 className="mb-1 text-sm font-medium">Approval Trail</h4>
              <p className="text-[var(--muted-foreground)]">
                No approval required — L3 action within budget threshold.
              </p>
            </div>

            {/* Output Delivered */}
            <div>
              <h4 className="mb-1 text-sm font-medium">Output Delivered</h4>
              <p className="text-[var(--muted-foreground)]">
                Identified 3 cashflow gaps totalling $42K. Summary report drafted and linked in
                Notion.
              </p>
            </div>

            {/* Risk Flags */}
            <div>
              <h4 className="mb-1 text-sm font-medium">Risk Flags</h4>
              <p className="text-[var(--muted-foreground)]">None identified.</p>
            </div>

            {/* Human Feedback */}
            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-sm font-medium">Your Feedback</p>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1
                  const filled = value <= starRating
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStarRating(value)}
                      className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                      aria-pressed={filled}
                    >
                      <Star
                        className="h-6 w-6"
                        style={{ color: filled ? "var(--chart-3)" : "var(--border)" }}
                        fill={filled ? "var(--chart-3)" : "none"}
                        aria-hidden="true"
                      />
                    </button>
                  )
                })}
              </div>
              <Textarea
                className="mt-3"
                placeholder="Add a note for agent memory..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
              <Button variant="default" className="mt-3 w-full">
                Submit Feedback
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
