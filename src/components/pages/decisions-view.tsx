"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

interface Option {
  letter: string;
  description: string;
  risk: string;
  recommended?: boolean;
}

interface Decision {
  id: string;
  risk: RiskLevel;
  reversible: boolean;
  agent: string;
  question: string;
  context: string;
  options: Option[];
  recommendation: string;
  confidence: string;
  destructiveActions?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const decisions: Decision[] = [
  {
    id: "#D-12",
    risk: "MEDIUM",
    reversible: true,
    agent: "CS Agent",
    question: "Should CS Agent send follow-up to Acme Corp before the contract is signed?",
    context:
      "CS Agent flagged 3-day silence after product demo. Acme is evaluating 2 other vendors. Outreach window may be closing.",
    options: [
      { letter: "A", description: "Send follow-up now", risk: "40% — may appear eager", recommended: true },
      { letter: "B", description: "Wait 2 more days", risk: "35% — lose deal momentum" },
      { letter: "C", description: "Ask Sarah to call", risk: "Low — adds 1-day delay" },
    ],
    recommendation:
      "Option A. 6 past decisions in similar deal stages showed CEO preferred speed over caution.",
    confidence: "82%",
  },
  {
    id: "#D-13",
    risk: "LOW",
    reversible: true,
    agent: "Market Research Agent",
    question: "Should Market Research Agent expand competitor analysis scope to include European players?",
    context:
      "US analysis complete. European market is now entering the Q3 pitch narrative for enterprise deals.",
    options: [
      { letter: "A", description: "Expand scope", risk: "Low — adds $12 cost", recommended: true },
      { letter: "B", description: "Keep current scope", risk: "Low — faster delivery" },
      { letter: "C", description: "Delegate to Marketing Agent", risk: "Medium — duplication risk" },
    ],
    recommendation:
      "Option A. Broader coverage strengthens Q3 pitch narrative with minimal cost.",
    confidence: "76%",
  },
  {
    id: "#D-14",
    risk: "HIGH",
    reversible: false,
    agent: "Legal Agent",
    question: "Should Legal Agent send the revised contract to Acme with updated SLA terms?",
    context:
      "SLA change flagged by Finance Agent — may reduce gross margin by 8%. External send cannot be recalled.",
    options: [
      { letter: "A", description: "Send as-is", risk: "High — 8% margin impact" },
      { letter: "B", description: "Revise SLA first", risk: "Medium — 3-day delay" },
      { letter: "C", description: "Hold for CEO review", risk: "Low — safest path", recommended: true },
    ],
    recommendation:
      "CEO must approve. This crosses the irreversible + financial impact threshold. Do not execute without explicit sign-off.",
    confidence: "",
    destructiveActions: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const riskStyles: Record<RiskLevel, string> = {
  LOW: "border-green-500 text-green-600 dark:text-green-400",
  MEDIUM: "border-amber-500 text-amber-600 dark:text-amber-400",
  HIGH: "border-red-500 text-red-600 dark:text-red-400",
};

// ─── Decision Card ────────────────────────────────────────────────────────────

function DecisionCard({
  decision,
  approved,
  onApprove,
}: {
  decision: Decision;
  approved: boolean;
  onApprove: () => void;
}) {
  if (approved) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <CheckCircle className="size-5 text-green-500 shrink-0" />
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          Decision approved — agents proceeding.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
      {/* Row 1: Meta */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-[var(--muted-foreground)]">{decision.id}</span>
        <span
          className={`rounded border px-2 py-0.5 text-xs font-semibold ${riskStyles[decision.risk]}`}
        >
          {decision.risk}
        </span>
        <span className="rounded border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
          {decision.reversible ? "Reversible" : "Irreversible"}
        </span>
        <span className="rounded border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
          {decision.agent}
        </span>
      </div>

      {/* Row 2: Question */}
      <p className="mt-2 text-base font-semibold text-[var(--foreground)]">{decision.question}</p>

      {/* Row 3: Context */}
      <p className="mt-2 border-l-2 border-[var(--border)] pl-3 text-sm text-[var(--muted-foreground)]">
        {decision.context}
      </p>

      {/* Row 4: Options */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {decision.options.map((opt) => (
          <div
            key={opt.letter}
            className={`rounded border bg-[var(--background)] p-3 ${
              opt.recommended
                ? "border-[var(--primary)] border-2"
                : "border-[var(--border)]"
            }`}
          >
            <p className="text-sm font-bold text-[var(--foreground)]">
              {opt.letter}. {opt.description}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Risk: {opt.risk}</p>
          </div>
        ))}
      </div>

      {/* Row 5: Recommendation */}
      <div className="mt-3 rounded border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-3">
        <div className="flex flex-wrap items-start gap-2">
          <div className="flex-1">
            <span className="text-xs font-semibold text-[var(--primary)]">AI CoS Recommendation: </span>
            <span className="text-sm text-[var(--foreground)]">{decision.recommendation}</span>
          </div>
          {decision.confidence && (
            <Badge variant="secondary" className="shrink-0 font-mono text-xs">
              {decision.confidence}
            </Badge>
          )}
        </div>
      </div>

      {/* Row 6: Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {decision.destructiveActions ? (
          <>
            <Button variant="outline" size="sm">Review Full Context</Button>
            <Button variant="destructive" size="sm">Approve to Send</Button>
            <Button variant="ghost" size="sm">Block Execution</Button>
          </>
        ) : (
          <>
            <Button variant="default" size="sm" onClick={onApprove}>
              Approve Recommended
            </Button>
            <Button variant="outline" size="sm">Choose Different</Button>
            <Button variant="ghost" size="sm">Delegate</Button>
            <Button variant="ghost" size="sm">Defer</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function DecisionsView() {
  const [approved, setApproved] = useState([false, false, false]);

  const approve = (i: number) =>
    setApproved((prev) => prev.map((v, idx) => (idx === i ? true : v)));

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Top strip: CEO Judgment Database */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <p className="text-xs text-[var(--muted-foreground)]">
          Past decisions analyzed: 47&nbsp;&nbsp;·&nbsp;&nbsp;Prediction accuracy: 84%&nbsp;&nbsp;·&nbsp;&nbsp;Patterns learned: 5&nbsp;&nbsp;·&nbsp;&nbsp;CEO interruptions avoided this week: 9
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="needs-ceo">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="needs-ceo">Needs CEO (3)</TabsTrigger>
          <TabsTrigger value="needs-lead">Needs Team Lead (2)</TabsTrigger>
          <TabsTrigger value="auto-resolved">Auto-Resolved (7)</TabsTrigger>
          <TabsTrigger value="high-risk">High-Risk (1)</TabsTrigger>
          <TabsTrigger value="waiting">Waiting on Context (1)</TabsTrigger>
        </TabsList>

        {/* Needs CEO */}
        <TabsContent value="needs-ceo" className="mt-4">
          <div className="flex flex-col gap-4">
            {decisions.map((d, i) => (
              <DecisionCard
                key={d.id}
                decision={d}
                approved={approved[i]}
                onApprove={() => approve(i)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Placeholder tabs */}
        {["needs-lead", "auto-resolved", "high-risk", "waiting"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">No items</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
