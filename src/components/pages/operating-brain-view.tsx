"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { Skeleton } from "@/app/components/ui/skeleton"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Badge } from "@/app/components/ui/badge"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Switch } from "@/app/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible"
import { Brain, Target, TriangleAlert as AlertTriangle, ChevronRight, CircleCheck as CheckCircle2 } from "lucide-react"

type Workstream = {
  name: string
  owner: string
  agents: string[]
}

type OperatingBrief = {
  goal: string
  success_metric: string
  urgency: "HIGH" | "MEDIUM" | "LOW"
  agents_needed: string[]
  open_decisions: string[]
  risks: string[]
  workstreams: Workstream[]
  filtered_noise: string[]
}

const urgencyStyles: Record<OperatingBrief["urgency"], string> = {
  HIGH: "bg-[var(--destructive)] text-[var(--destructive-foreground)] border-transparent",
  MEDIUM: "bg-[var(--chart-3)] text-[var(--background)] border-transparent",
  LOW: "bg-[var(--chart-2)] text-[var(--background)] border-transparent",
}

export function OperatingBrainView() {
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<OperatingBrief | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activatedWorkstreams, setActivatedWorkstreams] = useState<Set<number>>(new Set())
  const [approved, setApproved] = useState(false)

  async function generateBrief() {
    setLoading(true)
    setError(null)
    setOutput(null)
    setApproved(false)
    setActivatedWorkstreams(new Set())

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system:
            "You are an AI Chief of Staff for a B2B SaaS startup CEO. Convert raw CEO input into a structured Operating Brief. Respond ONLY with valid JSON. No markdown. No preamble. No backticks. Schema: { goal: string, success_metric: string, urgency: 'HIGH'|'MEDIUM'|'LOW', agents_needed: string[], open_decisions: string[], risks: string[], workstreams: Array<{ name: string, owner: string, agents: string[] }>, filtered_noise: string[] }",
          messages: [{ role: "user", content: userInput }],
        }),
      })
      const data = await response.json()
      const raw = data.content[0].text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(raw)
      setOutput(parsed)
      setLoading(false)
    } catch {
      setError("Could not generate brief. Please check your input and try again.")
      setLoading(false)
    }
  }

  function toggleWorkstream(index: number) {
    setActivatedWorkstreams((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="grid h-full grid-cols-2 gap-6">
      {/* LEFT PANEL: CEO Input */}
      <Card className="flex h-full flex-col bg-[var(--card)] border-[var(--border)] p-6">
        <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">Drop anything here</p>
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Paste Slack threads, meeting notes, email snippets, voice-to-text summary, or raw thoughts. The AI Chief of Staff will extract structure from the noise."
          className="min-h-[280px] flex-1 resize-none border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
        />
        <Button
          className="mt-4 w-full"
          onClick={generateBrief}
          disabled={loading || userInput.trim() === ""}
        >
          {loading ? "Generating..." : "Generate Operating Brief"}
        </Button>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          Your input is processed securely and not stored.
        </p>
      </Card>

      {/* RIGHT PANEL: Operating Brief */}
      <Card className="h-full overflow-y-auto bg-[var(--card)] border-[var(--border)] p-6">
        {/* STATE 1 — Empty */}
        {output === null && !loading && !error && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Brain className="mb-3 size-8 text-[var(--muted-foreground)]" />
            <p className="text-sm text-[var(--muted-foreground)]">
              Your structured Operating Brief will appear here.
            </p>
          </div>
        )}

        {/* STATE 2 — Loading */}
        {loading && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <p className="animate-pulse text-sm text-[var(--muted-foreground)]">
              AI Chief of Staff is processing your input...
            </p>
          </div>
        )}

        {/* STATE 3 — Error */}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              Could not generate brief. Please check your input and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* STATE 4 — Output */}
        {output && !loading && (
          <div className="flex flex-col gap-5">
            {/* 1. Goal */}
            <div className="rounded-md border-l-4 border-[var(--primary)] bg-[var(--background)] p-3">
              <p className="text-xs text-[var(--muted-foreground)]">Goal</p>
              <p className="text-base font-semibold text-[var(--foreground)]">{output.goal}</p>
            </div>

            {/* 2. Success Metric + Urgency */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-[var(--border)] bg-[var(--background)] p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <Target className="size-3.5 text-[var(--muted-foreground)]" />
                  <p className="text-xs text-[var(--muted-foreground)]">Success Metric</p>
                </div>
                <p className="text-sm font-medium text-[var(--foreground)]">{output.success_metric}</p>
              </Card>
              <Card className="border-[var(--border)] bg-[var(--background)] p-3">
                <p className="mb-1 text-xs text-[var(--muted-foreground)]">Urgency</p>
                <Badge className={urgencyStyles[output.urgency]}>{output.urgency}</Badge>
              </Card>
            </div>

            {/* 3. Agents Needed */}
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">Agents Needed</p>
              <div className="flex flex-wrap gap-2">
                {output.agents_needed.map((agent) => (
                  <Badge key={agent} variant="outline" className="border-[var(--primary)] text-[var(--foreground)]">
                    {agent}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 4. Open Decisions */}
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">Open Decisions</p>
              <ol className="flex flex-col gap-2">
                {output.open_decisions.map((decision, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Checkbox disabled className="mt-0.5" />
                    <span className="text-sm text-[var(--foreground)]">{decision}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* 5. Risks */}
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">Risks</p>
              <ul className="flex flex-col gap-1.5">
                {output.risks.map((risk, i) => (
                  <li key={i} className="text-sm text-[var(--chart-3)]">
                    {"\u26A0 "}
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. Workstreams */}
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">Workstreams</p>
              <div className="flex flex-col gap-3">
                {output.workstreams.map((ws, i) => (
                  <Card key={i} className="border-[var(--border)] bg-[var(--background)] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{ws.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">Owner: {ws.owner}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--muted-foreground)]">Activate</span>
                        <Switch
                          checked={activatedWorkstreams.has(i)}
                          onCheckedChange={() => toggleWorkstream(i)}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ws.agents.map((agent) => (
                        <Badge key={agent} variant="outline" className="border-[var(--border)] text-[var(--muted-foreground)]">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 7. Filtered Noise */}
            <Collapsible>
              <CollapsibleTrigger className="group flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                <ChevronRight className="size-4 transition-transform group-data-[state=open]:rotate-90" />
                {output.filtered_noise.length} items filtered as low priority
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <ul className="flex flex-col gap-1 pl-5">
                  {output.filtered_noise.map((item, i) => (
                    <li key={i} className="text-sm text-[var(--muted-foreground)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>

            {/* Footer */}
            <div className="mt-1 flex flex-col gap-3 border-t border-[var(--border)] pt-4">
              {approved && (
                <Alert className="border-[var(--chart-2)] text-[var(--foreground)]">
                  <CheckCircle2 className="size-4 text-[var(--chart-2)]" />
                  <AlertDescription className="text-[var(--foreground)]">
                    Workstreams activated. AI employees have been briefed.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex gap-3">
                <Button onClick={() => setApproved(true)}>Approve & Activate Workstreams</Button>
                <Button variant="outline" onClick={() => setOutput(null)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setOutput(null)
                    setUserInput("")
                  }}
                >
                  Discard
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
