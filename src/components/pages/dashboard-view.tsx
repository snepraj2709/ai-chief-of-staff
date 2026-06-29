import { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Plus,
  X,
  ArrowRight,
  Eye,
  TriangleAlert as AlertTriangle,
} from "lucide-react"
import { TabToggle } from "@/components/ui/tab-toggle"

// ─── Stat Cards ──────────────────────────────────────────────────────────────

function PrioritiesCard() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3">
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
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className={`font-mono text-2xl font-bold leading-none xl:text-3xl ${valueColor}`}>{value}</span>
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Active Workstreams</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Agent-managed initiatives · sorted by priority
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

      <div className="min-h-0 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Priority", "Workstream", "Owner", "Agents", "Status", "Action"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left font-semibold uppercase tracking-widest text-[10px] text-muted-foreground"
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
                <td className="px-4 py-2">
                  <span className="font-mono text-xs font-bold text-primary">{ws.priority}</span>
                </td>
                <td className="px-4 py-2">
                  <span className="text-sm font-medium text-foreground">{ws.name}</span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${ws.ownerColor}`}
                    >
                      {ws.ownerInitials}
                    </span>
                    <span className="text-xs text-foreground">{ws.ownerName}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-foreground">{ws.agentCount} agents</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${ws.agentOnline ? "bg-[#10B981]" : "bg-[#EF4444]"}`}
                    />
                  </div>
                </td>
                <td className="px-4 py-2">
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
                <td className="px-4 py-2">
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

      <div className="shrink-0 border-t border-border px-4 py-2">
        <span className="font-mono text-[10px] text-muted-foreground">
          3 active workstreams · 6 total agents deployed · last synced 2 min ago
        </span>
      </div>
    </div>
  )
}

// ─── Blocker Lane ────────────────────────────────────────────────────────────

type BlockerType =
  | "missing-context"
  | "cross-agent"
  | "decision-needed"
  | "budget"
  | "safety"

type BlockerFilter = "all" | BlockerType

interface Blocker {
  type: BlockerType
  tagLabel: string
  title: string
  body: string
  actionLabel: string
  accentClass: string
  tagClass: string
  buttonClass: string
}

const BLOCKER_FILTERS: { id: BlockerFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "missing-context", label: "Missing Context" },
  { id: "cross-agent", label: "Cross-Agent" },
  { id: "decision-needed", label: "Decision Needed" },
  { id: "budget", label: "Budget" },
  { id: "safety", label: "Safety" },
]

const BLOCKER_FILTER_OPTIONS = BLOCKER_FILTERS.map(({ id, label }) => ({
  value: id,
  label,
}))

const BLOCKERS: Blocker[] = [
  {
    type: "missing-context",
    tagLabel: "Missing Context",
    title: "Q2 Actuals Missing",
    body: "Finance Agent needs Raj M.'s final Q2 actuals before the budget model can close.",
    actionLabel: "Provide Context",
    accentClass: "border-l-[#F59E0B]",
    tagClass: "bg-amber-50 text-[#F59E0B]",
    buttonClass: "hover:border-[#F59E0B]/50 hover:text-[#FCD34D]",
  },
  {
    type: "cross-agent",
    tagLabel: "Cross-Agent",
    title: "CS Agent ↔ Legal Agent",
    body: "Contract threshold dispute — Finance says $50K limit, Legal says $10K.",
    actionLabel: "Resolve Conflict",
    accentClass: "border-l-[#EF4444]",
    tagClass: "bg-red-50 text-[#EF4444]",
    buttonClass: "hover:border-[#EF4444]/50 hover:text-[#FCA5A5]",
  },
  {
    type: "decision-needed",
    tagLabel: "Decision Needed",
    title: "ICP Definition Blocked",
    body: "Marketing Agent cannot proceed. ICP definition required before execution.",
    actionLabel: "Decide",
    accentClass: "border-l-[#F59E0B]",
    tagClass: "bg-amber-50 text-[#F59E0B]",
    buttonClass: "hover:border-[#F59E0B]/50 hover:text-[#FCD34D]",
  },
]

const BLOCKER_CARD_CLASS =
  "flex h-full min-h-0 basis-full shrink-0 snap-start flex-col rounded-xl border border-border bg-card px-4 py-3 md:basis-[calc((100%_-_1rem)/2)] xl:basis-[calc((100%_-_2rem)/3)]"

function BlockerLane() {
  const [activeFilter, setActiveFilter] = useState<BlockerFilter>("all")
  const trackRef = useRef<HTMLDivElement>(null)
  const [carouselState, setCarouselState] = useState({
    hasOverflow: false,
    canScrollPrevious: false,
    canScrollNext: false,
  })
  const visibleBlockers =
    activeFilter === "all"
      ? BLOCKERS
      : BLOCKERS.filter((blocker) => blocker.type === activeFilter)
  const activeLabel =
    BLOCKER_FILTERS.find((filter) => filter.id === activeFilter)?.label ?? "All"

  useEffect(() => {
    const track = trackRef.current

    if (!track) {
      return
    }

    const updateCarouselState = () => {
      const maxScroll = track.scrollWidth - track.clientWidth

      setCarouselState({
        hasOverflow: maxScroll > 2,
        canScrollPrevious: track.scrollLeft > 2,
        canScrollNext: track.scrollLeft < maxScroll - 2,
      })
    }

    track.scrollTo({ left: 0 })
    const frame = window.requestAnimationFrame(updateCarouselState)
    const resizeObserver = new ResizeObserver(updateCarouselState)

    resizeObserver.observe(track)
    track.addEventListener("scroll", updateCarouselState, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      track.removeEventListener("scroll", updateCarouselState)
    }
  }, [activeFilter, visibleBlockers.length])

  const moveCarousel = (direction: -1 | 1) => {
    const track = trackRef.current

    if (!track) {
      return
    }

    const firstCard = track.querySelector<HTMLElement>("[data-blocker-card]")
    const trackStyles = window.getComputedStyle(track)
    const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "0")
    const cardWidth = firstCard?.getBoundingClientRect().width ?? track.clientWidth

    track.scrollBy({
      left: direction * (cardWidth + (Number.isNaN(gap) ? 0 : gap)),
      behavior: "smooth",
    })
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">Your Input needed</h2>
        <span className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
          {BLOCKERS.length} OPEN
        </span>
      </div>

      <TabToggle
        aria-label="Filter blockers"
        value={activeFilter}
        options={BLOCKER_FILTER_OPTIONS}
        onValueChange={setActiveFilter}
      />

      <div className="relative min-h-0 flex-1">
        {carouselState.hasOverflow && (
          <>
            <button
              type="button"
              aria-label="Previous blockers"
              disabled={!carouselState.canScrollPrevious}
              onClick={() => moveCarousel(-1)}
              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg shadow-background/30 transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next blockers"
              disabled={!carouselState.canScrollNext}
              onClick={() => moveCarousel(1)}
              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg shadow-background/30 transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div
          ref={trackRef}
          className="flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visibleBlockers.length > 0 ? (
            <>
              {visibleBlockers.map((blocker) => (
                <div
                  key={blocker.type}
                  data-blocker-card
                  className={`${BLOCKER_CARD_CLASS} items-start border-l-1 ${blocker.accentClass}`}
                >
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${blocker.tagClass}`}
                  >
                    {blocker.tagLabel}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">
                    {blocker.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {blocker.body}
                  </p>
                  <button
                    type="button"
                    className={`mt-auto inline-flex min-h-8 items-center rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors ${blocker.buttonClass}`}
                  >
                    {blocker.actionLabel}
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div
              data-blocker-card
              className={`${BLOCKER_CARD_CLASS} items-center justify-center border-dashed text-center`}
            >
              <p className="text-sm font-medium text-foreground">
                No {activeLabel.toLowerCase()} blockers
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                This category is clear right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Collapsible Dashboard Panels ────────────────────────────────────────────

function MorningBriefCard({ onClose }: { onClose: () => void }) {
  return (
    <section className="relative rounded-xl border border-primary/20 bg-card px-4 py-4 shadow-sm shadow-primary/5 sm:px-5">
      <button
        type="button"
        aria-label="Close morning brief"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex flex-wrap items-center gap-2 pr-8">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Zap className="h-4 w-4" aria-hidden="true" />
        </span>
        <h2 className="text-base font-semibold text-foreground">Morning Brief</h2>
        <span className="rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
          AI GENERATED · 07:00
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
        <p>
          <span className="mr-1 inline-flex h-3.5 w-3.5 rounded-full bg-[#EF4444] align-[-2px] shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
          <span className="font-semibold text-foreground">Series B:</span> Legal redlines unresolved for 48h.
          Wilson Sonsini needs a response by EOD. Decision required on valuation cap.
        </p>
        <p>
          <span className="mr-1 inline-flex h-3.5 w-3.5 rounded-full bg-[#FACC15] align-[-2px] shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
          <span className="font-semibold text-foreground">Q3 Budget:</span> $142K variance flagged. Raj M.
          has the actuals — no action taken yet. Finance agent is blocked.
        </p>
        <p>
          <span className="mr-1 inline-flex h-3.5 w-3.5 rounded-full bg-[#22C55E] align-[-2px] shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="font-semibold text-foreground">GTM Playbook v2:</span> AI CoS completed territory
          split draft. Ready for your review. Tom R. aligned.
        </p>
        <p className="flex gap-1.5">
          <Zap className="mt-1 h-3.5 w-3.5 shrink-0 text-[#FACC15]" aria-hidden="true" />
          <span>
            <span className="font-semibold text-foreground">Your focus today:</span> 1) Approve Series B
            counter, 2) Unblock budget with Raj, 3) Review board deck narrative (Sara).
          </span>
        </p>
      </div>
    </section>
  )
}

function InputCard({
  value,
  onChange,
  onClose,
  onCancel,
}: {
  value: string
  onChange: (value: string) => void
  onClose: () => void
  onCancel: () => void
}) {
  return (
    <section className="relative rounded-xl border border-border bg-card px-4 py-4 sm:px-5">
      <button
        type="button"
        aria-label="Close input card"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <h2 className="pr-8 text-base font-semibold text-foreground">Give the AI a directive</h2>
      <textarea
        aria-label="AI directive"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g. Draft a counter to Wilson Sonsini on the valuation cap. Keep it firm but collaborative."
        className="mt-4 min-h-24 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:font-mono placeholder:text-xs placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[11px] text-muted-foreground">{value.length} chars</span>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-9 items-center rounded-full bg-secondary px-4 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            Send to AI
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function DashboardView() {
  const [showMorningBrief, setShowMorningBrief] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [inputText, setInputText] = useState("")
  const today = new Date()
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" })
  const monthDay = today.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const hasOpenPanel = showMorningBrief || showInput

  const handleCancelInput = () => {
    setInputText("")
    setShowInput(false)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4 lg:overflow-hidden xl:p-5">
      {/* Page header */}
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground xl:text-2xl">Good morning, Sneha</h1>
        </div>
        <div className="mt-1 flex flex-shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            aria-expanded={showMorningBrief}
            onClick={() => setShowMorningBrief((open) => !open)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              showMorningBrief
                ? "border-primary/60 bg-primary/25 text-primary shadow-sm shadow-primary/20"
                : "border-primary/30 bg-primary/15 text-primary hover:bg-primary/25"
            }`}
          >
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Morning Brief
          </button>
          <button
            type="button"
            aria-expanded={showInput}
            onClick={() => setShowInput((open) => !open)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              showInput
                ? "border-primary/60 bg-primary/20 text-primary shadow-sm shadow-primary/20"
                : "border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Input
          </button>
        </div>
      </div>

      {hasOpenPanel && (
        <div className="mt-4 flex shrink-0 flex-col gap-3">
          {showMorningBrief && (
            <MorningBriefCard onClose={() => setShowMorningBrief(false)} />
          )}
          {showInput && (
            <InputCard
              value={inputText}
              onChange={setInputText}
              onClose={() => setShowInput(false)}
              onCancel={handleCancelInput}
            />
          )}
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-4 grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
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

      {/* Active workstreams and blockers */}
      <div className="mt-4 grid min-h-0 flex-1 grid-rows-[minmax(0,1.08fr)_minmax(0,0.92fr)] gap-3">
        <WorkstreamsTable />
        <BlockerLane />
      </div>
    </div>
  )
}
