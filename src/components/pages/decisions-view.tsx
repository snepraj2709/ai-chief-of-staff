"use client";

import { useState } from "react";
import {
  ArrowUp,
  CheckCircle2,
  Eye,
  LockKeyhole,
  PlayCircle,
  RefreshCw,
  RotateCw,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "MEDIUM" | "HIGH";
type BarTone = "warning" | "danger" | "success";

interface DecisionOption {
  letter: string;
  title: string;
  upside: string;
  risk: string;
  riskPercent: number;
  recommended?: boolean;
  barTone: BarTone;
}

interface PendingDecision {
  id: string;
  risk: RiskLevel;
  reversible: boolean;
  agentInitials: string;
  agentColor: string;
  agent: string;
  timeAgo: string;
  question: string;
  context: string;
  options: DecisionOption[];
  confidence: number;
  confidenceBase: string;
  recommendationLetter: string;
  recommendationTitle: string;
  recommendationBody: string;
}

interface AutoResolvedDecision {
  id: string;
  decision: string;
  resolvedAs: string;
  confidence: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialDecisions: PendingDecision[] = [
  {
    id: "D-14",
    risk: "MEDIUM",
    reversible: true,
    agentInitials: "CS",
    agentColor: "bg-[#A855F7]",
    agent: "CS Agent",
    timeAgo: "2h ago",
    question: "Should we send a follow-up to Acme Corp before the contract is signed?",
    context:
      "CS Agent flagged a 3-day silence post-demo. Acme has high ACV ($180K). Previous touchpoint was overwhelmingly positive but no response to draft contract sent Mon.",
    options: [
      {
        letter: "A",
        title: "Send follow-up now",
        upside: "Keeps deal warm, shows responsiveness",
        risk: "Risk 40% - Premature pressure - may feel pushy",
        riskPercent: 40,
        recommended: true,
        barTone: "warning",
      },
      {
        letter: "B",
        title: "Wait 2 more days",
        upside: "Respects buyer timeline",
        risk: "Risk 35% - Risk losing momentum if they go cold",
        riskPercent: 35,
        barTone: "warning",
      },
      {
        letter: "C",
        title: "Ask Sarah K. to call directly",
        upside: "Human touch at critical juncture",
        risk: "Risk 20% - +1 day delay, depends on Sarah's schedule",
        riskPercent: 20,
        barTone: "success",
      },
    ],
    confidence: 82,
    confidenceBase: "Based on 6 similar past decisions",
    recommendationLetter: "A",
    recommendationTitle: "Send follow-up now",
    recommendationBody:
      "Past 6 similar decisions favored speed in silence >48h. Deals closed faster when followed up on day 3.",
  },
  {
    id: "D-12",
    risk: "HIGH",
    reversible: false,
    agentInitials: "LA",
    agentColor: "bg-[#0EA5E9]",
    agent: "Legal Agent",
    timeAgo: "6h ago",
    question: "Counter Wilson Sonsini on Series B valuation cap at $42M pre-money?",
    context:
      "Legal Agent reviewed redlines. WS pushed cap from $40M to $38M. Finance model supports $42M based on current ARR trajectory.",
    options: [
      {
        letter: "A",
        title: "Counter at $42M pre-money",
        upside: "Protects founder equity significantly",
        risk: "Risk 45% - May delay close by 5-7 days",
        riskPercent: 45,
        recommended: true,
        barTone: "warning",
      },
      {
        letter: "B",
        title: "Accept $38M to close faster",
        upside: "Closes by Jul 15 as planned",
        risk: "Risk 55% - Equity dilution, sets precedent",
        riskPercent: 55,
        barTone: "danger",
      },
      {
        letter: "C",
        title: "Request founder call with lead investor",
        upside: "Direct relationship, may unlock flexibility",
        risk: "Risk 30% - +3 days, uncertain outcome",
        riskPercent: 30,
        barTone: "success",
      },
    ],
    confidence: 71,
    confidenceBase: "Based on 5 similar past decisions",
    recommendationLetter: "A",
    recommendationTitle: "Counter at $42M pre-money",
    recommendationBody:
      "ARR growth trajectory supports higher valuation. Similar founder counters succeeded 4/5 times.",
  },
  {
    id: "D-15",
    risk: "MEDIUM",
    reversible: true,
    agentInitials: "FA",
    agentColor: "bg-[#10B981]",
    agent: "Finance Agent",
    timeAgo: "4h ago",
    question: "Approve Q3 budget variance response before finance sends the revised forecast?",
    context:
      "Finance Agent found a $142K variance after updated hiring assumptions. Raj M. has the actuals, but the forecast update is blocked until a response path is approved.",
    options: [
      {
        letter: "A",
        title: "Approve revised forecast",
        upside: "Unblocks finance and keeps board packet on schedule",
        risk: "Risk 32% - May need cleanup if actuals shift",
        riskPercent: 32,
        recommended: true,
        barTone: "success",
      },
      {
        letter: "B",
        title: "Hold until Raj confirms actuals",
        upside: "Improves precision before distribution",
        risk: "Risk 38% - Board packet slips by 1 day",
        riskPercent: 38,
        barTone: "warning",
      },
      {
        letter: "C",
        title: "Escalate to Sara for narrative review",
        upside: "Aligns financial story before wider sharing",
        risk: "Risk 25% - Adds one approval hop",
        riskPercent: 25,
        barTone: "success",
      },
    ],
    confidence: 78,
    confidenceBase: "Based on 8 similar budget decisions",
    recommendationLetter: "A",
    recommendationTitle: "Approve revised forecast",
    recommendationBody:
      "Prior budget updates moved faster when finance shipped the forecast with a variance note and follow-up owner.",
  },
];

const autoResolvedDecisions: AutoResolvedDecision[] = [
  {
    id: "D-11",
    decision: "Auto-approve Slack Pro renewal ($4.2K/yr)?",
    resolvedAs: "Auto-approved",
    confidence: 98,
  },
  {
    id: "D-10",
    decision: "Schedule weekly sync with RevOps?",
    resolvedAs: "Delegated to Sarah K.",
    confidence: 91,
  },
  {
    id: "D-09",
    decision: "Acknowledge DataStream NDA receipt?",
    resolvedAs: "Auto-sent confirmation",
    confidence: 99,
  },
  {
    id: "D-08",
    decision: "Reschedule GDPR prep call +1 day?",
    resolvedAs: "Auto-rescheduled",
    confidence: 96,
  },
  {
    id: "D-07",
    decision: "Assign board deck formatting to design intern?",
    resolvedAs: "Delegated to Dara M.",
    confidence: 88,
  },
  {
    id: "D-06",
    decision: "Enable 2FA enforcement for new hires?",
    resolvedAs: "Auto-enabled",
    confidence: 97,
  },
  {
    id: "D-05",
    decision: "Send Q2 summary to investor updates list?",
    resolvedAs: "Auto-sent",
    confidence: 93,
  },
];

const delegatePeople = ["Sarah K.", "Marcus D.", "Raj M.", "Tom R."];
const delegatePlaceholderValue = "__select-person__";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const riskStyles: Record<RiskLevel, string> = {
  MEDIUM: "border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FBBF24]",
  HIGH: "border-[#F97316]/40 bg-[#F97316]/10 text-[#FB923C]",
};

const riskLabel: Record<RiskLevel, string> = {
  MEDIUM: "MEDIUM RISK",
  HIGH: "HIGH RISK",
};

const barStyles: Record<BarTone, string> = {
  warning: "bg-[#FACC15]",
  danger: "bg-[#FF3F55]",
  success: "bg-[#10B981]",
};

function removeDecisionById(
  decisions: PendingDecision[],
  decisionId: string,
): PendingDecision[] {
  return decisions.filter((decision) => decision.id !== decisionId);
}

// ─── Decision Card ────────────────────────────────────────────────────────────

function DecisionCard({
  decision,
  delegateOpen,
  selectedDelegate,
  onApprove,
  onToggleDelegate,
  onSelectDelegate,
  onConfirmDelegate,
}: {
  decision: PendingDecision;
  delegateOpen: boolean;
  selectedDelegate: string;
  onApprove: () => void;
  onToggleDelegate: () => void;
  onSelectDelegate: (value: string) => void;
  onConfirmDelegate: () => void;
}) {
  const recommended = decision.options.find((option) => option.recommended) ?? decision.options[0];

  return (
    <article className="flex snap-start flex-col overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-muted-foreground">{decision.id}</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest ${riskStyles[decision.risk]}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {riskLabel[decision.risk]}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest ${
              decision.reversible
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-[#EF4444]/40 bg-[#EF4444]/10 text-[#F87171]"
            }`}
          >
            {decision.reversible ? (
              <RotateCw className="h-3 w-3" aria-hidden="true" />
            ) : (
              <LockKeyhole className="h-3 w-3" aria-hidden="true" />
            )}
            {decision.reversible ? "REVERSIBLE" : "IRREVERSIBLE"}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px] font-bold text-white ${decision.agentColor}`}
          >
            {decision.agentInitials}
          </span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            {decision.agent} · {decision.timeAgo}
          </span>
        </div>
      </header>

      <div className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.9fr)]">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Decision
            </p>
            <h2 className="mt-2 text-lg font-semibold leading-snug text-foreground">
              {decision.question}
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Context
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{decision.context}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Options
            </p>
            <div className="mt-2 flex flex-col gap-2.5">
              {decision.options.map((option) => (
                <DecisionOptionRow key={option.letter} option={option} />
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-3">
          <ConfidenceCard decision={decision} />
          <RecommendationCard decision={decision} />
          <div
            aria-hidden={!delegateOpen}
            className={delegateOpen ? "" : "invisible pointer-events-none"}
          >
            <DelegatePanel
              selectedDelegate={selectedDelegate}
              onSelectDelegate={onSelectDelegate}
              onConfirmDelegate={onConfirmDelegate}
            />
          </div>
        </aside>
      </div>

      <footer className="flex shrink-0 flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex min-h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            Approve {recommended.letter}
          </button>
          <button
            type="button"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-4 text-sm font-semibold text-[#F59E0B] transition-colors hover:bg-[#F59E0B]/15"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Override
          </button>
          <button
            type="button"
            onClick={onToggleDelegate}
            aria-expanded={delegateOpen}
            className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
              delegateOpen
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            Delegate
          </button>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          Tap an option to pre-select before approving
        </p>
      </footer>
    </article>
  );
}

function DecisionOptionRow({ option }: { option: DecisionOption }) {
  return (
    <div
      className={`grid gap-3 rounded-xl border bg-background px-4 py-3 sm:grid-cols-[minmax(0,1fr)_96px] ${
        option.recommended ? "border-primary/45 bg-primary/10" : "border-border"
      }`}
    >
      <div className="flex min-w-0 gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
            option.recommended ? "bg-primary/25 text-primary" : "bg-secondary text-muted-foreground"
          }`}
        >
          {option.letter}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{option.title}</p>
            {option.recommended && (
              <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                AI REC
              </span>
            )}
          </div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            <ArrowUp className="mr-1 inline h-3 w-3 align-[-2px]" aria-hidden="true" />
            {option.upside}
            <span className="mx-2 text-muted-foreground/40">·</span>
            <span className="text-[#F87171]">{option.risk}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:justify-end">
        <span className="font-mono text-xs font-bold text-[#F87171]">{option.riskPercent}%</span>
        <span className="h-1 w-20 overflow-hidden rounded-full bg-secondary">
          <span
            className={`block h-full rounded-full ${barStyles[option.barTone]}`}
            style={{ width: `${option.riskPercent}%` }}
          />
        </span>
      </div>
    </div>
  );
}

function ConfidenceCard({ decision }: { decision: PendingDecision }) {
  const angle = `${Math.round((decision.confidence / 100) * 360)}deg`;

  return (
    <div className="rounded-xl border border-border bg-background px-4 py-5 text-center">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        AI Confidence
      </p>
      <div
        className="mx-auto mt-4 grid h-16 w-16 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#F59E0B ${angle}, #1E1E2E 0deg)`,
        }}
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-background">
          <span className="font-mono text-sm font-bold text-foreground">{decision.confidence}%</span>
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold text-muted-foreground">{decision.confidenceBase}</p>
    </div>
  );
}

function RecommendationCard({ decision }: { decision: PendingDecision }) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Recommendation
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
          {decision.recommendationLetter}
        </span>
        <p className="text-sm font-semibold text-primary">{decision.recommendationTitle}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{decision.recommendationBody}</p>
    </div>
  );
}

function DelegatePanel({
  selectedDelegate,
  onSelectDelegate,
  onConfirmDelegate,
}: {
  selectedDelegate: string;
  onSelectDelegate: (value: string) => void;
  onConfirmDelegate: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Delegate To
      </p>
      <Select
        value={selectedDelegate || delegatePlaceholderValue}
        onValueChange={(value) =>
          onSelectDelegate(value === delegatePlaceholderValue ? "" : value)
        }
      >
        <SelectTrigger className="mt-3 h-10 rounded-full border-border bg-card font-mono text-sm">
          <SelectValue placeholder="Select person..." />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          sideOffset={8}
          avoidCollisions={false}
          className="max-h-none w-[var(--radix-select-trigger-width)] overflow-visible rounded-[18px] border border-white/20 bg-[#171720]/70 p-1.5 shadow-[0_22px_70px_rgba(0,0,0,0.65),0_0_44px_rgba(99,102,241,0.35)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[#171720]/55"
        >
          <SelectItem
            value={delegatePlaceholderValue}
            className="min-h-8 rounded-xl py-1.5 pl-8 pr-3 text-sm font-semibold text-foreground focus:bg-[#2563EB] focus:text-white data-[state=checked]:bg-[#2563EB] data-[state=checked]:text-white [&>span:first-child]:left-3 [&>span:first-child]:right-auto"
          >
            Select person...
          </SelectItem>
          {delegatePeople.map((person) => (
            <SelectItem
              key={person}
              value={person}
              className="min-h-8 rounded-xl py-1.5 pl-8 pr-3 text-sm font-semibold text-foreground/90 focus:bg-[#2563EB] focus:text-white data-[state=checked]:bg-[#2563EB] data-[state=checked]:text-white [&>span:first-child]:left-3 [&>span:first-child]:right-auto"
            >
              {person}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button
        type="button"
        disabled={!selectedDelegate}
        onClick={onConfirmDelegate}
        className="mt-3 inline-flex min-h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45"
      >
        Confirm Delegation
      </button>
    </div>
  );
}

// ─── Auto Resolved Table ──────────────────────────────────────────────────────

function AutoResolvedTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-foreground">Auto-resolved by AI CoS</h2>
        <p className="mt-1 text-sm text-muted-foreground">No input required - logged for audit</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px]">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Decision", "Resolved As", "Confidence", ""].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {autoResolvedDecisions.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-muted-foreground">
                  {item.id}
                </td>
                <td className="px-5 py-3 text-sm font-medium text-muted-foreground">
                  {item.decision}
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/25 bg-[#10B981]/10 px-2.5 py-1 font-mono text-[11px] font-bold text-[#10B981]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                    {item.resolvedAs}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full bg-[#10B981]"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </span>
                    <span className="font-mono text-xs font-bold text-[#10B981]">{item.confidence}%</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    aria-label={`View ${item.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function DecisionsView() {
  const [pendingDecisions, setPendingDecisions] = useState(initialDecisions);
  const [delegateOpenId, setDelegateOpenId] = useState<string | null>(null);
  const [selectedDelegates, setSelectedDelegates] = useState<Record<string, string>>({});
  const pendingCount = pendingDecisions.length;

  const approveDecision = (decisionId: string) => {
    setPendingDecisions((current) => removeDecisionById(current, decisionId));
    setDelegateOpenId((current) => (current === decisionId ? null : current));
  };

  const confirmDelegation = (decisionId: string) => {
    if (!selectedDelegates[decisionId]) {
      return;
    }

    setPendingDecisions((current) => removeDecisionById(current, decisionId));
    setDelegateOpenId(null);
  };

  return (
    <div className="min-h-full p-4 xl:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground xl:text-2xl">Decision Desk</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            AI-escalated decisions requiring your judgment · Jun 29
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-1.5 text-sm font-semibold text-[#F87171]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]" />
            Needs Your Attention: {pendingCount}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1.5 text-sm font-semibold text-[#10B981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            Auto-resolved: {autoResolvedDecisions.length}
          </span>
        </div>
      </div>

      <Tabs defaultValue="needs-decision" className="mt-4">
        <TabsList>
          <TabsTrigger value="needs-decision">
            Needs Decision ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="auto-resolved">
            Auto-resolved ({autoResolvedDecisions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="needs-decision" className="mt-4">
          {pendingCount > 0 ? (
            <div className="flex snap-y snap-mandatory flex-col gap-4">
              {pendingDecisions.map((decision) => (
                <DecisionCard
                  key={decision.id}
                  decision={decision}
                  delegateOpen={delegateOpenId === decision.id}
                  selectedDelegate={selectedDelegates[decision.id] ?? ""}
                  onApprove={() => approveDecision(decision.id)}
                  onToggleDelegate={() =>
                    setDelegateOpenId((current) => (current === decision.id ? null : decision.id))
                  }
                  onSelectDelegate={(value) =>
                    setSelectedDelegates((current) => ({ ...current, [decision.id]: value }))
                  }
                  onConfirmDelegate={() => confirmDelegation(decision.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-card text-center">
              <div>
                <CheckCircle2 className="mx-auto h-8 w-8 text-[#10B981]" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-foreground">No decisions need approval</p>
                <p className="mt-1 text-xs text-muted-foreground">The AI CoS queue is clear.</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="auto-resolved" className="mt-4">
          <AutoResolvedTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
