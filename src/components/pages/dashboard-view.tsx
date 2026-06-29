import { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Plus,
  Eye,
  TriangleAlert as AlertTriangle,
} from "lucide-react"

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

const BLOCKERS: Blocker[] = [
  {
    type: "missing-context",
    tagLabel: "Missing Context",
    title: "Q2 Actuals Missing",
    body: "Finance Agent needs Raj M.'s final Q2 actuals before the budget model can close.",
    actionLabel: "Provide",
    accentClass: "border-l-[#F59E0B]",
    tagClass: "bg-amber-50 text-[#F59E0B]",
    buttonClass: "hover:border-[#F59E0B]/50 hover:text-[#FCD34D]",
  },
  {
    type: "cross-agent",
    tagLabel: "Cross-Agent",
    title: "CS Agent ↔ Legal Agent",
    body: "Contract threshold dispute — Finance says $50K limit, Legal says $10K.",
    actionLabel: "Resolve",
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
  "flex min-h-[150px] basis-full shrink-0 snap-start flex-col rounded-xl border border-border bg-card px-4 py-4 md:basis-[calc((100%_-_1rem)/2)] xl:basis-[calc((100%_-_2rem)/3)]"

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
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">Blocker Lane</h2>
        <span className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
          {BLOCKERS.length} OPEN
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6">
        {BLOCKER_FILTERS.map((filter) => {
          const selected = activeFilter === filter.id

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`min-h-10 rounded-full border px-3 text-xs font-semibold transition-colors ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary/40"
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      <div className="relative">
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
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">
                    {blocker.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
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

      {/* Active workstreams and blockers */}
      <div className="flex flex-col gap-5">
        <WorkstreamsTable />
        <BlockerLane />
      </div>
    </div>
  )
}
