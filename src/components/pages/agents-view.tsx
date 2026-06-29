"use client"

import { useState } from "react"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { Progress } from "@/app/components/ui/progress"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type AutonomyLevel = 1 | 2 | 3 | 4 | 5
type SafetyStatus = "Safe" | "Needs Review"

interface Agent {
  id: string
  name: string
  role: string
  owner: string
  task: string
  autonomy: AutonomyLevel
  budgetUsed: number
  budgetTotal: number
  safety: SafetyStatus
  score: number
  escalations: number
  /** SVG org-chart status */
  online: boolean
}

const AGENTS: Agent[] = [
  {
    id: "finance",
    name: "Finance Analyst Agent",
    role: "Financial Analysis",
    owner: "Raj M",
    task: "Analyzing Q2 cashflow gaps",
    autonomy: 3,
    budgetUsed: 80,
    budgetTotal: 200,
    safety: "Safe",
    score: 87,
    escalations: 1,
    online: true,
  },
  {
    id: "marketing",
    name: "Marketing Agent",
    role: "Growth & Messaging",
    owner: "Priya S",
    task: "Drafting ICP messaging framework",
    autonomy: 2,
    budgetUsed: 30,
    budgetTotal: 100,
    safety: "Safe",
    score: 72,
    escalations: 3,
    online: true,
  },
  {
    id: "cs",
    name: "CS Agent",
    role: "Customer Success",
    owner: "Sarah K",
    task: "Blocked: waiting on Legal sign-off",
    autonomy: 3,
    budgetUsed: 45,
    budgetTotal: 150,
    safety: "Needs Review",
    score: 65,
    escalations: 5,
    online: false,
  },
  {
    id: "legal",
    name: "Legal Agent",
    role: "Legal & Compliance",
    owner: "Sarah K",
    task: "Reviewing contract threshold clause",
    autonomy: 2,
    budgetUsed: 20,
    budgetTotal: 100,
    safety: "Safe",
    score: 91,
    escalations: 0,
    online: true,
  },
  {
    id: "research",
    name: "Market Research Agent",
    role: "Market Intelligence",
    owner: "AI CoS",
    task: "Competitor pricing analysis — APAC",
    autonomy: 4,
    budgetUsed: 110,
    budgetTotal: 200,
    safety: "Safe",
    score: 94,
    escalations: 0,
    online: true,
  },
]

const AUTONOMY_LABELS = ["S", "D", "EA", "EAu", "A"]

// ---------------------------------------------------------------------------
// Org Chart SVG
// ---------------------------------------------------------------------------

function OrgChart() {
  // Child node x positions as percentages (evenly spaced, padded from edges)
  const childXs = [12, 28, 50, 72, 88]
  const parentCy = 60
  const childCy = 170
  const parentCx = 50 // percent

  return (
    <Card className="w-full overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
      <svg
        viewBox="0 0 800 220"
        width="100%"
        height="220"
        aria-label="AI employee org chart"
        style={{ display: "block" }}
      >
        {/* Connector lines */}
        {childXs.map((cx, i) => (
          <line
            key={i}
            x1="50%"
            y1={parentCy + 28}
            x2={`${cx}%`}
            y2={childCy - 22}
            stroke="var(--border)"
            strokeWidth={1.5}
          />
        ))}

        {/* Parent node */}
        <circle cx="50%" cy={parentCy} r={28} fill="var(--primary)" />
        <text
          x="50%"
          y={parentCy - 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight="bold"
          fill="white"
        >
          AI Chief
        </text>
        <text
          x="50%"
          y={parentCy + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight="bold"
          fill="white"
        >
          of Staff
        </text>

        {/* Child nodes */}
        {AGENTS.map((agent, i) => {
          const cx = `${childXs[i]}%`
          const shortNames = ["Finance", "Marketing", "CS Agent", "Legal", "Research"]
          return (
            <g key={agent.id}>
              {/* Node circle */}
              <circle
                cx={cx}
                cy={childCy}
                r={22}
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth={1.5}
              />
              {/* Status dot */}
              <circle
                cx={`calc(${childXs[i]}% + 16px)`}
                cy={childCy - 16}
                r={5}
                fill={agent.online ? "var(--chart-2)" : "var(--destructive)"}
              />
              {/* Agent short name */}
              <text
                x={cx}
                y={childCy + 34}
                textAnchor="middle"
                fontSize={11}
                fill="var(--foreground)"
              >
                {shortNames[i]}
              </text>
              {/* Autonomy badge */}
              <text
                x={cx}
                y={childCy + 46}
                textAnchor="middle"
                fontSize={10}
                fill="var(--muted-foreground)"
              >
                {`L${agent.autonomy}`}
              </text>
            </g>
          )
        })}
      </svg>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Agent Card
// ---------------------------------------------------------------------------

function AgentCard({ agent }: { agent: Agent }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const budgetPct = Math.round((agent.budgetUsed / agent.budgetTotal) * 100)

  const isSafe = agent.safety === "Safe"

  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-2"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Row 1: name + safety badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-sm leading-snug" style={{ color: "var(--foreground)" }}>
          {agent.name}
        </span>
        <Badge
          variant="outline"
          className="shrink-0 text-[10px] px-1.5 py-0"
          style={
            isSafe
              ? { borderColor: "var(--chart-2)", color: "var(--chart-2)" }
              : { borderColor: "#f59e0b", color: "#f59e0b" }
          }
        >
          {agent.safety}
        </Badge>
      </div>

      {/* Row 2: role tag */}
      <p className="text-xs" style={{ color: "var(--muted-foreground)", marginTop: -2 }}>
        {agent.role}
      </p>

      {/* Row 3: owner */}
      <p className="text-sm" style={{ color: "var(--foreground)" }}>
        Owner:{" "}
        <span style={{ color: "var(--muted-foreground)" }}>{agent.owner}</span>
      </p>

      {/* Row 4: current task */}
      <p
        className="text-sm italic truncate"
        style={{ color: "var(--muted-foreground)" }}
        title={agent.task}
      >
        {agent.task}
      </p>

      {/* Row 5: autonomy level */}
      <div className="flex flex-col gap-1">
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Autonomy Level
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, idx) => (
            <div
              key={idx}
              className="h-2 rounded-sm"
              style={{
                width: 32,
                background: idx < agent.autonomy ? "var(--primary)" : "var(--border)",
              }}
            />
          ))}
        </div>
        <div className="flex gap-1">
          {AUTONOMY_LABELS.map((label) => (
            <span
              key={label}
              className="text-center"
              style={{ width: 32, fontSize: 9, color: "var(--muted-foreground)" }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Row 6: budget */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Budget
          </span>
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            ${agent.budgetUsed} / ${agent.budgetTotal}
          </span>
        </div>
        <Progress value={budgetPct} className="h-1.5" />
      </div>

      {/* Row 7: inline stats */}
      <div className="flex gap-4">
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Score: {agent.score}
        </span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Escalations: {agent.escalations}
        </span>
      </div>

      {/* Row 8: action buttons */}
      <div className="flex gap-1.5 pt-1 flex-wrap">
        {(["View Tasks", "Adjust Autonomy", "Suspend"] as const).map((label) => (
          <Button
            key={label}
            variant={hovered === label ? "outline" : "ghost"}
            size="sm"
            className="text-xs h-7 px-2"
            onMouseEnter={() => setHovered(label)}
            onMouseLeave={() => setHovered(null)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function AgentsView() {
  return (
    <div className="flex flex-col gap-6">
      {/* Section 1: Org chart */}
      <OrgChart />

      {/* Section 2: Agent directory */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            AI Employees ({AGENTS.length})
          </h2>
          <Button variant="outline" size="sm">
            + Add Agent
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  )
}
