import {
  CheckSquare,
  AlertTriangle,
  PauseCircle,
  Activity,
  Zap,
  DollarSign,
  ArrowRight,
} from "lucide-react"
import { MetricCard } from "@/components/ui/metric-card"
import { StatusBadge } from "@/components/ui/status-badge"

const digest = [
  {
    time: "08:41",
    tone: "primary" as const,
    label: "Action",
    text: "Drafted a counter to Wilson Sonsini on the Series B valuation cap. Held for your approval before sending.",
  },
  {
    time: "08:17",
    tone: "danger" as const,
    label: "Alert",
    text: "Three legal-review items have exceeded their SLA by two days. Series B timeline is now at risk.",
  },
  {
    time: "07:55",
    tone: "warning" as const,
    label: "Insight",
    text: "Engineering velocity is down 18% versus last sprint, correlated with two on-call incidents this week.",
  },
  {
    time: "07:30",
    tone: "primary" as const,
    label: "Action",
    text: "Circulated the Q3 board deck agenda to Sara L. and Marcus D. for comment ahead of Thursday.",
  },
]

const workstreams = [
  { priority: "P1", name: "Series B Fundraise", owner: "Marcus D.", status: "At risk", tone: "danger" as const },
  { priority: "P2", name: "Q3 Budget Reconciliation", owner: "Priya K.", status: "Blocked", tone: "warning" as const },
  { priority: "P3", name: "GTM Playbook v2", owner: "Tom R.", status: "On track", tone: "success" as const },
  { priority: "P4", name: "Board Preparation Q3", owner: "Sara L.", status: "On track", tone: "success" as const },
  { priority: "P5", name: "Head of Design Hire", owner: "Sara L.", status: "In review", tone: "primary" as const },
]

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Open Tasks" value="47" delta="+3" trend="up" caption="since yesterday" icon={CheckSquare} />
        <MetricCard label="Decisions Needed" value="3" caption="awaiting your input" valueClassName="text-[#F59E0B]" icon={AlertTriangle} />
        <MetricCard label="Blocked" value="2" caption="agents stalled" valueClassName="text-[#EF4444]" icon={PauseCircle} />
        <MetricCard label="Agents at Risk" value="1" caption="Finance · autonomy breach" valueClassName="text-[#F59E0B]" icon={Activity} />
        <MetricCard label="AI Actions" value="24" caption="today · 156 this week" valueClassName="text-primary" icon={Zap} />
        <MetricCard label="Spend Today" value="$24.80" delta="12%" trend="down" invertTrend caption="of $200 daily budget" icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* AI daily digest */}
        <section className="rounded-2xl border border-border bg-card xl:col-span-7">
          <header className="flex items-center justify-between px-5 pb-3 pt-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">AI Daily Digest</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Agent-generated briefing · updated 08:47</p>
            </div>
            <StatusBadge tone="primary" dot>
              Live
            </StatusBadge>
          </header>
          <ul className="px-5 pb-5">
            {digest.map((item, i) => (
              <li
                key={item.time}
                className={`flex gap-3 py-3 ${i < digest.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-foreground">{item.text}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{item.time}</span>
                    <StatusBadge tone={item.tone}>{item.label}</StatusBadge>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Open digest item"
                  className="flex-shrink-0 text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Active workstreams */}
        <section className="rounded-2xl border border-border bg-card xl:col-span-5">
          <header className="flex items-center justify-between px-5 pb-3 pt-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Active Workstreams</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Agent-managed · sorted by CEO priority</p>
            </div>
          </header>
          <ul className="px-5 pb-5">
            {workstreams.map((ws, i) => (
              <li
                key={ws.priority}
                className={`flex items-center gap-3 py-3 ${i < workstreams.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="font-mono text-xs font-bold text-primary">{ws.priority}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{ws.name}</p>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">{ws.owner}</p>
                </div>
                <StatusBadge tone={ws.tone}>{ws.status}</StatusBadge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
