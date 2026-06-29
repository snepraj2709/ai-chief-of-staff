"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Switch } from "@/app/components/ui/switch"
import { Progress } from "@/app/components/ui/progress"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/ui/table"
import { cn } from "@/lib/utils"

const LEVEL_LABELS = ["Suggest", "Draft", "Execute + Approval", "Execute + Audit", "Autonomous"]

const AGENTS = [
  { name: "Finance Analyst", readiness: "Ready for L4: 78% — 2 more successful runs" },
  { name: "Marketing Agent", readiness: "Not ready: 3 escalations this week" },
  { name: "CS Agent", readiness: "Restricted: safety review in progress" },
  { name: "Legal Agent", readiness: "Ready for L3: 91% readiness" },
  { name: "Market Research", readiness: "Eligible for L5 review next week" },
]

const BUDGET_ROWS = [
  { agent: "Finance Analyst", limit: "$50", used: "$23.40", remaining: "$26.60", status: "Safe" },
  { agent: "Marketing Agent", limit: "$30", used: "$28.10", remaining: "$1.90", status: "Near Limit" },
  { agent: "CS Agent", limit: "$40", used: "$12.00", remaining: "$28.00", status: "Safe" },
  { agent: "Legal Agent", limit: "$25", used: "$8.50", remaining: "$16.50", status: "Safe" },
  { agent: "Market Research", limit: "$60", used: "$55.20", remaining: "$4.80", status: "Near Limit" },
]

const POLICIES = [
  {
    name: "Legal Exposure Actions",
    description: "Any action with legal consequence requires your approval",
  },
  {
    name: "Customer-Facing Communications",
    description: "Emails, messages, and external content require human owner approval",
  },
  {
    name: "Money Movement",
    description: "Payments, transfers, and financial commitments — always blocked",
    locked: true,
  },
  {
    name: "Production System Writes",
    description: "Code deploys and database changes require your approval",
  },
  {
    name: "Confidential Data Sharing",
    description: "Any external data transfer triggers audit log",
  },
  {
    name: "Hiring & Firing Recommendations",
    description: "All HR decisions require your approval",
  },
]

export function SafetyView() {
  const [autonomyLevels, setAutonomyLevels] = useState<number[]>([3, 2, 3, 2, 4])
  const [killSwitches, setKillSwitches] = useState<boolean[]>([true, true, true, true, true])
  const [masterKill, setMasterKill] = useState(false)
  const [riskToggles, setRiskToggles] = useState<boolean[]>([true, true, true, true, true, true])

  function promote(i: number) {
    setAutonomyLevels((prev) => prev.map((lvl, idx) => (idx === i ? Math.min(5, lvl + 1) : lvl)))
  }

  function restrict(i: number) {
    setAutonomyLevels((prev) => prev.map((lvl, idx) => (idx === i ? Math.max(1, lvl - 1) : lvl)))
  }

  function toggleKill(i: number) {
    setKillSwitches((prev) => prev.map((on, idx) => (idx === i ? !on : on)))
  }

  function toggleRisk(i: number) {
    setRiskToggles((prev) => prev.map((on, idx) => (idx === i ? !on : on)))
  }

  function pauseAll() {
    setKillSwitches([false, false, false, false, false])
    setMasterKill(true)
  }

  return (
    <div className="space-y-6 p-6 text-[var(--foreground)]">
      {/* SECTION 1: Header Stat Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-medium text-[var(--muted-foreground)]">Total Daily Budget</p>
          <p className="mt-1 font-mono text-2xl font-semibold">$127.20 / $200.00</p>
          <Progress value={63} className="mt-3" />
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">63% used today</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-medium text-[var(--muted-foreground)]">Agents Near Limit</p>
          <p className="mt-1 font-mono text-2xl font-semibold" style={{ color: "var(--chart-3)" }}>
            2
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">Marketing, Market Research</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-medium text-[var(--muted-foreground)]">Unsafe Attempts Blocked</p>
          <p className="mt-1 font-mono text-2xl font-semibold" style={{ color: "var(--chart-2)" }}>
            0
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">All clear today</p>
        </div>
      </div>

      {/* SECTION 2: Autonomy Ladder */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Autonomy Levels</h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            Promote agents only after meeting readiness criteria
          </p>
        </div>
        <div className="mt-4">
          {AGENTS.map((agent, i) => {
            const level = autonomyLevels[i]
            return (
              <div
                key={agent.name}
                className={cn(
                  "flex items-center gap-4 py-3",
                  i < AGENTS.length - 1 && "border-b border-[var(--border)]",
                )}
              >
                <div className="w-44">
                  <p className="text-sm font-medium">{agent.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{LEVEL_LABELS[level - 1]}</p>
                </div>
                <div className="flex flex-1 gap-1">
                  {Array.from({ length: 5 }).map((_, step) => (
                    <div
                      key={step}
                      className="h-2 w-full rounded-sm"
                      style={{
                        backgroundColor: step < level ? "var(--primary)" : "var(--border)",
                      }}
                    />
                  ))}
                </div>
                <p className="w-64 text-xs text-[var(--muted-foreground)]">{agent.readiness}</p>
                <div className="flex w-32 justify-end gap-1">
                  <Button size="sm" variant="outline" onClick={() => promote(i)}>
                    Promote
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[var(--destructive)]"
                    onClick={() => restrict(i)}
                  >
                    Restrict
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 3: Budget Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <h3 className="text-sm font-semibold">Daily Budget Guardrails</h3>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Daily Limit</TableHead>
                <TableHead>Used Today</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BUDGET_ROWS.map((row) => {
                const near = row.status === "Near Limit"
                return (
                  <TableRow key={row.agent}>
                    <TableCell className="font-medium">{row.agent}</TableCell>
                    <TableCell className="font-mono">{row.limit}</TableCell>
                    <TableCell className="font-mono">{row.used}</TableCell>
                    <TableCell className="font-mono">{row.remaining}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{
                          color: near ? "var(--chart-3)" : "var(--chart-2)",
                          borderColor: near ? "var(--chart-3)" : "var(--chart-2)",
                        }}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* SECTION 4: Kill Switches */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Agent Kill Switches</h3>
          <Button variant="destructive" size="sm" disabled={masterKill} onClick={pauseAll}>
            {masterKill ? "All Agents Paused" : "⛔ Pause All Autonomous Actions"}
          </Button>
        </div>
        <div className="mt-4">
          {AGENTS.map((agent, i) => {
            const active = killSwitches[i]
            return (
              <div
                key={agent.name}
                className="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">{agent.name}</span>
                  <Badge
                    variant="outline"
                    style={
                      active
                        ? { color: "var(--chart-2)", borderColor: "var(--chart-2)" }
                        : {
                            color: "var(--muted-foreground)",
                            borderColor: "var(--border)",
                          }
                    }
                  >
                    {active ? "Active" : "Paused"}
                  </Badge>
                </div>
                <Switch checked={active} onCheckedChange={() => toggleKill(i)} />
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 5: Risk Policy Engine */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <h3 className="text-sm font-semibold">Risk Policy Rules</h3>
        <div className="mt-4">
          {POLICIES.map((policy, i) => (
            <div
              key={policy.name}
              className="flex items-center justify-between border-b border-[var(--border)] py-3 last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium">{policy.name}</p>
                <span className="block text-xs text-[var(--muted-foreground)]">
                  {policy.locked ? "Always blocked — cannot be disabled." : policy.description}
                </span>
              </div>
              {policy.locked ? (
                <Lock className="h-4 w-4 text-[var(--muted-foreground)]" aria-label="Always blocked" />
              ) : (
                <Switch checked={riskToggles[i]} onCheckedChange={() => toggleRisk(i)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
