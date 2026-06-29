import { useState } from "react";
import {
  LayoutDashboard, CheckSquare, Users, FolderKanban, Calendar,
  MessageSquare, Brain, Settings, Bell, Search, ChevronDown,
  TrendingUp, TrendingDown, AlertTriangle, Zap, ArrowRight,
  MoreHorizontal, Clock, Tag, Filter, Plus, X, ChevronRight,
  Cpu, Activity, Target, Shield, BarChart3, Layers, LogOut,
  Star, GitBranch, Inbox, RefreshCw, Eye, Lock, Unlock,
  PauseCircle, PlayCircle, Hash, Command, Dot
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────

type View = "ceo-dashboard" | "org-chart" | "decision-desk" | "friction-resolver" | "operating-brain" | "safety-control" | "accountability" | "mobile-preview" | "design-system" | "dashboard" | "tasks" | "projects" | "people" | "calendar" | "comms" | "intelligence" | "settings";

type Priority = "critical" | "high" | "medium" | "low";
type TaskStatus = "open" | "in-progress" | "blocked" | "done";
type RiskLevel = "critical" | "high" | "medium" | "low";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const velocityData = [
  { day: "Mon", completed: 8, added: 12 },
  { day: "Tue", completed: 14, added: 9 },
  { day: "Wed", completed: 11, added: 15 },
  { day: "Thu", completed: 18, added: 7 },
  { day: "Fri", completed: 13, added: 11 },
  { day: "Sat", completed: 6, added: 3 },
  { day: "Sun", completed: 9, added: 5 },
];

const capacityData = [
  { name: "Eng", used: 82, total: 100 },
  { name: "Design", used: 67, total: 100 },
  { name: "Product", used: 91, total: 100 },
  { name: "Data", used: 55, total: 100 },
  { name: "Ops", used: 74, total: 100 },
];

const aiActivityData = [
  { hour: "00", actions: 3 },
  { hour: "04", actions: 1 },
  { hour: "08", actions: 14 },
  { hour: "10", actions: 22 },
  { hour: "12", actions: 18 },
  { hour: "14", actions: 31 },
  { hour: "16", actions: 27 },
  { hour: "18", actions: 19 },
  { hour: "20", actions: 11 },
  { hour: "22", actions: 7 },
];

const tasks = [
  { id: "T-0091", title: "Finalize Q3 budget reconciliation", priority: "critical" as Priority, status: "blocked" as TaskStatus, assignee: "Priya K.", due: "Today", project: "Finance Ops", tags: ["budget", "Q3"] },
  { id: "T-0088", title: "Review Series B term sheet redlines", priority: "critical" as Priority, status: "in-progress" as TaskStatus, assignee: "Marcus D.", due: "Today", project: "Legal", tags: ["fundraise"] },
  { id: "T-0085", title: "Board deck v3 — narrative pass", priority: "high" as Priority, status: "in-progress" as TaskStatus, assignee: "Sara L.", due: "Jun 30", project: "Board Prep", tags: ["board", "deck"] },
  { id: "T-0082", title: "Align on GTM motion with VP Sales", priority: "high" as Priority, status: "open" as TaskStatus, assignee: "Tom R.", due: "Jul 2", project: "GTM", tags: ["sales"] },
  { id: "T-0079", title: "Vendor NDA — DataStream Inc.", priority: "medium" as Priority, status: "open" as TaskStatus, assignee: "Priya K.", due: "Jul 3", project: "Legal", tags: ["vendor"] },
  { id: "T-0077", title: "OKR mid-cycle review — Eng dept", priority: "medium" as Priority, status: "open" as TaskStatus, assignee: "Jin L.", due: "Jul 5", project: "OKRs", tags: ["okr", "eng"] },
  { id: "T-0074", title: "Hire loop debrief — Head of Design", priority: "medium" as Priority, status: "in-progress" as TaskStatus, assignee: "Sara L.", due: "Jul 6", project: "Hiring", tags: ["design", "hiring"] },
  { id: "T-0071", title: "Integrate Salesforce webhook to CRM", priority: "low" as Priority, status: "open" as TaskStatus, assignee: "Jin L.", due: "Jul 9", project: "RevOps", tags: ["crm", "eng"] },
];

const risks = [
  { id: "R-12", title: "Series B timeline slipping", level: "critical" as RiskLevel, owner: "Marcus D.", updated: "2h ago", trend: "up" },
  { id: "R-09", title: "Eng capacity at 91% — no buffer for incidents", level: "high" as RiskLevel, owner: "Jin L.", updated: "4h ago", trend: "up" },
  { id: "R-07", title: "GDPR audit response due in 8 days", level: "high" as RiskLevel, owner: "Priya K.", updated: "1d ago", trend: "stable" },
  { id: "R-05", title: "Key vendor contract expires Jul 15", level: "medium" as RiskLevel, owner: "Tom R.", updated: "2d ago", trend: "down" },
  { id: "R-03", title: "Board deck conflicts with Q2 numbers", level: "medium" as RiskLevel, owner: "Sara L.", updated: "3h ago", trend: "stable" },
];

const aiDigest = [
  { time: "08:41", type: "action", text: "Drafted follow-up email to DataStream Inc. re: NDA delay. Pending your review.", icon: "✉" },
  { time: "08:17", type: "alert", text: "Series B timeline flag: 3 open items in legal review exceed SLA by 2 days.", icon: "⚠" },
  { time: "07:55", type: "insight", text: "Eng velocity down 18% vs last sprint. Correlated with 2 on-call incidents this week.", icon: "📊" },
  { time: "07:30", type: "action", text: "Board deck agenda circulated to Sara L. and Marcus D. for comments.", icon: "📋" },
  { time: "Yesterday", type: "insight", text: "Q3 budget gap: $142K variance identified. Flagged for CFO review.", icon: "💡" },
];

const people = [
  { name: "Sara L.", role: "Chief of Staff", capacity: 91, tasks: 12, status: "overloaded", avatar: "SL" },
  { name: "Marcus D.", role: "General Counsel", capacity: 78, tasks: 8, status: "healthy", avatar: "MD" },
  { name: "Priya K.", role: "Head of Finance", capacity: 85, tasks: 9, status: "high", avatar: "PK" },
  { name: "Tom R.", role: "VP Sales", capacity: 62, tasks: 6, status: "healthy", avatar: "TR" },
  { name: "Jin L.", role: "VP Engineering", capacity: 93, tasks: 14, status: "overloaded", avatar: "JL" },
  { name: "Dara M.", role: "Head of Design", capacity: 55, tasks: 5, status: "available", avatar: "DM" },
];

const projects = [
  { id: "PRJ-01", name: "Series B Fundraise", status: "at-risk", progress: 62, tasks: 24, open: 9, lead: "Marcus D.", due: "Jul 15" },
  { id: "PRJ-02", name: "Board Preparation Q3", status: "on-track", progress: 78, tasks: 16, open: 4, lead: "Sara L.", due: "Jul 1" },
  { id: "PRJ-03", name: "GTM v2 Launch", status: "on-track", progress: 44, tasks: 31, open: 18, lead: "Tom R.", due: "Aug 1" },
  { id: "PRJ-04", name: "GDPR Compliance Audit", status: "at-risk", progress: 38, tasks: 19, open: 12, lead: "Priya K.", due: "Jul 7" },
  { id: "PRJ-05", name: "Product Roadmap H2", status: "on-track", progress: 55, tasks: 28, open: 13, lead: "Jin L.", due: "Jul 20" },
  { id: "PRJ-06", name: "Head of Design Hire", status: "in-review", progress: 88, tasks: 8, open: 1, lead: "Sara L.", due: "Jul 5" },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function priorityStyle(p: Priority) {
  switch (p) {
    case "critical": return { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500", label: "Critical" };
    case "high":     return { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400", label: "High" };
    case "medium":   return { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Medium" };
    case "low":      return { bg: "bg-slate-700/60", text: "text-slate-400", dot: "bg-slate-500", label: "Low" };
  }
}

function statusStyle(s: TaskStatus) {
  switch (s) {
    case "open":        return { text: "text-slate-400", label: "Open" };
    case "in-progress": return { text: "text-indigo-400", label: "In Progress" };
    case "blocked":     return { text: "text-red-400", label: "Blocked" };
    case "done":        return { text: "text-emerald-400", label: "Done" };
  }
}

function riskStyle(r: RiskLevel) {
  switch (r) {
    case "critical": return "bg-red-500/15 text-red-400 border border-red-500/30";
    case "high":     return "bg-orange-500/10 text-orange-400 border border-orange-500/25";
    case "medium":   return "bg-amber-500/10 text-amber-400 border border-amber-500/25";
    case "low":      return "bg-slate-700/40 text-slate-400 border border-slate-600/30";
  }
}

function capacityColor(pct: number) {
  if (pct >= 90) return "text-red-400";
  if (pct >= 80) return "text-amber-400";
  return "text-emerald-400";
}

function capacityBarColor(pct: number) {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 80) return "bg-amber-400";
  return "bg-emerald-500";
}

function projectStatusStyle(s: string) {
  switch (s) {
    case "on-track":  return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
    case "at-risk":   return "bg-red-500/10 text-red-400 border border-red-500/25";
    case "in-review": return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/25";
    default:          return "bg-slate-700/40 text-slate-400";
  }
}

// ─── Atoms ───────────────────────────────────────────────────────────────────

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide uppercase", className)}>
      {children}
    </span>
  );
}

function RiskChip({ level }: { level: RiskLevel }) {
  return (
    <span className={cx("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-widest", riskStyle(level))}>
      <span className={cx("w-1.5 h-1.5 rounded-full", level === "critical" ? "bg-red-400" : level === "high" ? "bg-orange-400" : level === "medium" ? "bg-amber-400" : "bg-slate-400")} />
      {level}
    </span>
  );
}

function PriorityDot({ priority }: { priority: Priority }) {
  const s = priorityStyle(priority);
  return (
    <span className={cx("inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wide", s.bg, s.text)}>
      <span className={cx("w-1.5 h-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

function MonoMetric({ value, label, trend, trendDir }: { value: string; label: string; trend?: string; trendDir?: "up" | "down" | "neutral" }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-2xl font-semibold tracking-tight text-[#F1F5F9]">{value}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-[#64748B] font-medium">{label}</span>
        {trend && (
          <span className={cx("flex items-center gap-0.5 text-[10px] font-mono font-medium", trendDir === "up" ? "text-emerald-400" : trendDir === "down" ? "text-red-400" : "text-slate-400")}>
            {trendDir === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : trendDir === "down" ? <TrendingDown className="w-2.5 h-2.5" /> : null}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, icon }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors">
      {icon}{children}
    </button>
  );
}

function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E2E] hover:bg-[#252536] border border-[#2A2A3E] text-[#94a3b8] hover:text-[#F1F5F9] text-xs font-semibold transition-colors">
      {children}
    </button>
  );
}

function DangerBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-colors">
      {children}
    </button>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("bg-[#111118] border border-[#1E1E2E] rounded-2xl", className)}>
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <div>
        <h3 className="text-sm font-semibold text-[#F1F5F9] leading-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-[#64748B] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx("relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none", checked ? "bg-indigo-600" : "bg-[#2A2A3E]")}
    >
      <span className={cx("inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform", checked ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}

function Slider({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1 rounded-full appearance-none cursor-pointer accent-indigo-500"
      style={{ background: `linear-gradient(to right, #6366F1 ${value}%, #1E1E2E ${value}%)` }}
    />
  );
}

function Avatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-[11px]";
  const colors = ["bg-indigo-600", "bg-purple-600", "bg-emerald-700", "bg-amber-600", "bg-sky-600", "bg-rose-600"];
  const idx = initials.charCodeAt(0) % colors.length;
  return (
    <span className={cx("rounded-full inline-flex items-center justify-center font-mono font-bold text-white flex-shrink-0", sz, colors[idx])}>
      {initials}
    </span>
  );
}

function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#1E1E2E] flex items-center justify-center text-[#64748B]">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-[#F1F5F9]">{title}</p>
        <p className="text-xs text-[#64748B] mt-1">{body}</p>
      </div>
    </div>
  );
}

// ─── Tooltip (recharts override) ─────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16161F] border border-[#1E1E2E] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[10px] text-[#64748B] font-mono mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs font-mono" style={{ color: p.color }}>{p.name}: <span className="font-semibold">{p.value}</span></p>
      ))}
    </div>
  );
}

// ─── Stat Tile ────────────────────────────────────────────────────────────────

function StatTile({ label, value, sub, accent, icon }: { label: string; value: string; sub?: string; accent?: string; icon?: React.ReactNode }) {
  return (
    <Card className="px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#64748B] font-medium uppercase tracking-widest">{label}</span>
        {icon && <span className="text-[#64748B]">{icon}</span>}
      </div>
      <div>
        <span className={cx("font-mono text-2xl font-semibold tracking-tight", accent || "text-[#F1F5F9]")}>{value}</span>
        {sub && <p className="text-[11px] text-[#64748B] mt-0.5 font-mono">{sub}</p>}
      </div>
    </Card>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems = [
  { id: "ceo-dashboard" as View, label: "CEO Dashboard", icon: Target },
  { id: "org-chart" as View, label: "AI Employees", icon: Cpu },
  { id: "decision-desk" as View, label: "Decision Desk", icon: GitBranch },
  { id: "friction-resolver" as View, label: "Friction Resolver", icon: Shield },
  { id: "operating-brain" as View, label: "Operating Brain", icon: Layers },
  { id: "safety-control" as View, label: "Safety & Cost", icon: Lock },
  { id: "accountability" as View, label: "Accountability", icon: Star },
  { id: "dashboard" as View, label: "Command Center", icon: LayoutDashboard },
  { id: "tasks" as View, label: "Task Queue", icon: CheckSquare },
  { id: "projects" as View, label: "Projects", icon: FolderKanban },
  { id: "people" as View, label: "People & Capacity", icon: Users },
  { id: "calendar" as View, label: "Calendar", icon: Calendar },
  { id: "comms" as View, label: "Communications", icon: MessageSquare },
  { id: "intelligence" as View, label: "AI Intelligence", icon: Brain },
];

function Sidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <aside className="flex flex-col w-[220px] flex-shrink-0 bg-[#0D0D14] border-r border-[#1E1E2E] h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[#1E1E2E]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#F1F5F9] leading-tight">AI Chief of Staff</p>
            <p className="text-[10px] text-[#64748B] font-mono">v2.4.1 · prod</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="px-2 py-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-widest mb-1">Workspace</p>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={cx(
              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium w-full text-left transition-colors group",
              view === id
                ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20"
                : "text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#1E1E2E]"
            )}
          >
            <Icon className={cx("w-3.5 h-3.5 flex-shrink-0", view === id ? "text-indigo-400" : "text-[#64748B] group-hover:text-[#94a3b8]")} />
            {label}
            {id === "tasks" && <span className="ml-auto font-mono text-[10px] bg-[#1E1E2E] text-[#64748B] px-1.5 py-0.5 rounded">47</span>}
            {id === "org-chart" && <span className="ml-auto font-mono text-[10px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded">1 risk</span>}
            {id === "decision-desk" && <span className="ml-auto font-mono text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded">3</span>}
            {id === "friction-resolver" && <span className="ml-auto font-mono text-[10px] bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded">2</span>}
            {id === "safety-control" && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_#F59E0B]" />}
            {id === "comms" && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
          </button>
        ))}

        <div className="mt-4 mb-1">
          <p className="px-2 py-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-widest">Design System</p>
        </div>
        {([
          { id: "design-system" as View, label: "Components", icon: Layers },
          { id: "mobile-preview" as View, label: "Mobile Preview", icon: Activity },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setView(id)} className={cx("flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium w-full text-left transition-colors group", view === id ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20" : "text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#1E1E2E]")}>
            <Icon className={cx("w-3.5 h-3.5 flex-shrink-0", view === id ? "text-indigo-400" : "text-[#64748B]")} />
            {label}
          </button>
        ))}
        <div className="mt-4 mb-1">
          <p className="px-2 py-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-widest">System</p>
        </div>
        <button
          onClick={() => setView("settings")}
          className={cx(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium w-full text-left transition-colors group",
            view === "settings"
              ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20"
              : "text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#1E1E2E]"
          )}
        >
          <Settings className="w-3.5 h-3.5 flex-shrink-0" />
          Settings
        </button>
      </nav>

      {/* AI Status */}
      <div className="px-4 py-3 border-t border-[#1E1E2E]">
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={cx("w-1.5 h-1.5 rounded-full", aiEnabled ? "bg-emerald-400 shadow-[0_0_6px_#10B981]" : "bg-slate-500")} />
              <span className="text-[10px] font-mono font-medium text-[#F1F5F9]">AI Agent</span>
            </div>
            <Toggle checked={aiEnabled} onChange={setAiEnabled} />
          </div>
          <p className="text-[10px] text-[#64748B]">{aiEnabled ? "24 actions taken today" : "Agent paused"}</p>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-[#1E1E2E] flex items-center gap-2.5">
        <Avatar initials="YO" size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#F1F5F9] truncate">You (Owner)</p>
          <p className="text-[10px] text-[#64748B] truncate font-mono">CEO · Ops workspace</p>
        </div>
        <button className="text-[#64748B] hover:text-[#F1F5F9] transition-colors">
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ view }: { view: View }) {
  const [notifications] = useState(4);
  const viewLabels: Record<View, string> = {
    "ceo-dashboard": "CEO Clarity Dashboard",
    "org-chart": "AI Employee Org Chart",
    "decision-desk": "Decision Desk",
    "friction-resolver": "Cross-Agent Friction Resolver",
    "operating-brain": "CEO Operating Brain",
    "safety-control": "Safety & Cost Control",
    "accountability": "Accountability & Evidence",
    "mobile-preview": "Mobile Preview",
    "design-system": "Design System",
    dashboard: "Command Center",
    tasks: "Task Queue",
    projects: "Projects",
    people: "People & Capacity",
    calendar: "Calendar",
    comms: "Communications",
    intelligence: "AI Intelligence",
    settings: "Settings",
  };

  return (
    <header className="h-12 flex items-center justify-between px-6 border-b border-[#1E1E2E] bg-[#0A0A0F] flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-[#64748B]">Jun 29, 2026</span>
        <span className="text-[#1E1E2E]">·</span>
        <span className="text-xs font-semibold text-[#F1F5F9]">{viewLabels[view]}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#64748B]" />
          <input
            placeholder="Search tasks, people, docs…"
            className="w-56 pl-7 pr-3 py-1.5 bg-[#111118] border border-[#1E1E2E] rounded-lg text-xs text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-indigo-500/60 transition-colors font-mono"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#64748B] hidden sm:flex items-center gap-0.5"><Command className="w-2.5 h-2.5" />K</span>
        </div>

        {/* Refresh */}
        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1E1E2E] text-[#64748B] hover:text-[#F1F5F9] transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Notifications */}
        <button className="relative w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1E1E2E] text-[#64748B] hover:text-[#F1F5F9] transition-colors">
          <Bell className="w-3.5 h-3.5" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_#EF4444]" />
          )}
        </button>

        {/* Status pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
          <span className="text-[10px] font-mono font-semibold text-emerald-400">All systems nominal</span>
        </div>
      </div>
    </header>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

function DashboardView() {
  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full">
      {/* KPI Strip */}
      <div className="grid grid-cols-6 gap-4">
        <StatTile label="Open Tasks" value="47" sub="+3 since yesterday" icon={<CheckSquare className="w-3.5 h-3.5" />} />
        <StatTile label="High Priority" value="12" sub="4 critical · 8 high" accent="text-amber-400" icon={<AlertTriangle className="w-3.5 h-3.5" />} />
        <StatTile label="Blocked" value="3" sub="Needs your attention" accent="text-red-400" icon={<PauseCircle className="w-3.5 h-3.5" />} />
        <StatTile label="Due Today" value="8" sub="2 overdue" accent="text-amber-400" icon={<Clock className="w-3.5 h-3.5" />} />
        <StatTile label="Team Capacity" value="73%" sub="High eng load ↑" icon={<Activity className="w-3.5 h-3.5" />} />
        <StatTile label="AI Actions" value="24" sub="Today · 156 this week" accent="text-indigo-400" icon={<Zap className="w-3.5 h-3.5" />} />
      </div>

      {/* Main grid: 8 + 4 */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left col */}
        <div className="col-span-8 space-y-4">
          {/* AI Daily Digest */}
          <Card>
            <CardHeader
              title="AI Daily Digest"
              subtitle="Agent-generated briefing · updated 08:47"
              action={
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Live</Badge>
                  <SecondaryBtn><Eye className="w-3 h-3" />View all</SecondaryBtn>
                </div>
              }
            />
            <div className="px-5 pb-5 space-y-0">
              {aiDigest.map((item, i) => (
                <div key={i} className={cx("flex gap-3 py-3", i < aiDigest.length - 1 && "border-b border-[#1E1E2E]")}>
                  <span className="text-base leading-none mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#F1F5F9] leading-relaxed">{item.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] text-[#64748B]">{item.time}</span>
                      <Badge className={item.type === "action" ? "bg-indigo-500/10 text-indigo-400" : item.type === "alert" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}>
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <button className="text-[#64748B] hover:text-indigo-400 transition-colors flex-shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Task Queue table */}
          <Card>
            <CardHeader
              title="Priority Task Queue"
              subtitle="Sorted by urgency × impact score"
              action={
                <div className="flex items-center gap-2">
                  <SecondaryBtn><Filter className="w-3 h-3" />Filter</SecondaryBtn>
                  <PrimaryBtn icon={<Plus className="w-3 h-3" />}>New task</PrimaryBtn>
                </div>
              }
            />
            <div className="px-5 pb-1">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1E1E2E]">
                    {["ID", "Task", "Priority", "Status", "Assignee", "Due"].map(h => (
                      <th key={h} className="pb-2 text-left text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 6).map((t, i) => {
                    const ss = statusStyle(t.status);
                    return (
                      <tr key={t.id} className={cx("group transition-colors hover:bg-[#1A1A26]", i < tasks.length - 1 && "border-b border-[#1E1E2E]/50")}>
                        <td className="py-2.5 pr-4 font-mono text-[10px] text-[#64748B] whitespace-nowrap">{t.id}</td>
                        <td className="py-2.5 pr-4 max-w-[220px]">
                          <p className="text-[#F1F5F9] font-medium truncate">{t.title}</p>
                          <p className="text-[10px] text-[#64748B] font-mono">{t.project}</p>
                        </td>
                        <td className="py-2.5 pr-4 whitespace-nowrap"><PriorityDot priority={t.priority} /></td>
                        <td className={cx("py-2.5 pr-4 font-mono text-[10px] font-medium whitespace-nowrap", ss.text)}>{ss.label}</td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-1.5">
                            <Avatar initials={t.assignee.split(" ").map(n => n[0]).join("")} />
                            <span className="text-[11px] text-[#94a3b8] whitespace-nowrap">{t.assignee}</span>
                          </div>
                        </td>
                        <td className={cx("py-2.5 font-mono text-[10px] whitespace-nowrap", t.due === "Today" ? "text-amber-400 font-semibold" : "text-[#64748B]")}>{t.due}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-[#1E1E2E] flex items-center justify-between">
              <span className="text-[11px] text-[#64748B] font-mono">Showing 6 of 47 open tasks</span>
              <SecondaryBtn>View all tasks <ChevronRight className="w-3 h-3" /></SecondaryBtn>
            </div>
          </Card>

          {/* Velocity Chart */}
          <Card>
            <CardHeader title="Task Velocity" subtitle="Completed vs. added — last 7 days" />
            <div className="px-5 pb-5">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={velocityData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                  <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area key="vel-completed" type="monotone" dataKey="completed" stroke="#6366F1" fill="#6366F1" fillOpacity={0.12} strokeWidth={2} name="completed" />
                  <Area key="vel-added" type="monotone" dataKey="added" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.08} strokeWidth={2} name="added" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /><span className="text-[10px] font-mono text-[#64748B]">Completed</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[10px] font-mono text-[#64748B]">Added</span></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right col */}
        <div className="col-span-4 space-y-4">
          {/* Risk Board */}
          <Card>
            <CardHeader
              title="Risk Board"
              subtitle="5 active risks"
              action={<Badge className="bg-red-500/10 text-red-400 border border-red-500/20">2 Critical</Badge>}
            />
            <div className="px-5 pb-5 space-y-2">
              {risks.map(risk => (
                <div key={risk.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#0D0D14] border border-[#1E1E2E] hover:border-[#2A2A3E] transition-colors cursor-pointer group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-[9px] text-[#64748B]">{risk.id}</span>
                      <RiskChip level={risk.level} />
                    </div>
                    <p className="text-[11px] text-[#F1F5F9] font-medium leading-snug">{risk.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Avatar initials={risk.owner.split(" ").map(n => n[0]).join("")} />
                      <span className="text-[10px] text-[#64748B]">{risk.owner} · {risk.updated}</span>
                    </div>
                  </div>
                  {risk.trend === "up" ? <TrendingUp className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" /> : risk.trend === "down" ? <TrendingDown className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" /> : <Dot className="w-3 h-3 text-[#64748B] flex-shrink-0 mt-0.5" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Team Capacity */}
          <Card>
            <CardHeader title="Team Capacity" subtitle="Current sprint allocation" />
            <div className="px-5 pb-5 space-y-3">
              {capacityData.map(d => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-[#94a3b8]">{d.name}</span>
                    <span className={cx("font-mono text-[10px] font-semibold", capacityColor(d.used))}>{d.used}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
                    <div className={cx("h-full rounded-full transition-all", capacityBarColor(d.used))} style={{ width: `${d.used}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Activity */}
          <Card>
            <CardHeader title="AI Activity" subtitle="Actions triggered today" action={<Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">24 today</Badge>} />
            <div className="px-5 pb-5">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={aiActivityData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                  <XAxis dataKey="hour" tick={{ fill: "#64748B", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar key="ai-actions" dataKey="actions" fill="#6366F1" fillOpacity={0.7} radius={[2, 2, 0, 0]} name="actions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Tasks View ───────────────────────────────────────────────────────────────

function TasksView() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filtered = tasks.filter(t =>
    (filterStatus === "all" || t.status === filterStatus) &&
    (filterPriority === "all" || t.priority === filterPriority)
  );

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-[#F1F5F9]">Task Queue</h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">{tasks.length} total · {tasks.filter(t => t.status === "blocked").length} blocked · {tasks.filter(t => t.due === "Today").length} due today</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="bg-[#111118] border border-[#1E1E2E] rounded-lg px-2.5 py-1.5 text-xs text-[#94a3b8] font-mono focus:outline-none focus:border-indigo-500/60">
            <option value="all">All priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-[#111118] border border-[#1E1E2E] rounded-lg px-2.5 py-1.5 text-xs text-[#94a3b8] font-mono focus:outline-none focus:border-indigo-500/60">
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
          <PrimaryBtn icon={<Plus className="w-3 h-3" />}>New task</PrimaryBtn>
        </div>
      </div>

      <Card>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1E1E2E]">
              {["ID", "Title", "Project", "Priority", "Status", "Assignee", "Due", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const ss = statusStyle(t.status);
              return (
                <tr key={t.id} className={cx("hover:bg-[#1A1A26] transition-colors cursor-pointer", i < filtered.length - 1 && "border-b border-[#1E1E2E]/50")}>
                  <td className="px-5 py-3 font-mono text-[10px] text-[#64748B]">{t.id}</td>
                  <td className="px-5 py-3 max-w-[260px]">
                    <p className="text-[#F1F5F9] font-medium truncate">{t.title}</p>
                    <div className="flex gap-1 mt-1">
                      {t.tags.map(tag => (
                        <Badge key={tag} className="bg-[#1E1E2E] text-[#64748B]">{tag}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[11px] text-[#64748B] font-mono whitespace-nowrap">{t.project}</td>
                  <td className="px-5 py-3 whitespace-nowrap"><PriorityDot priority={t.priority} /></td>
                  <td className={cx("px-5 py-3 font-mono text-[10px] font-medium whitespace-nowrap", ss.text)}>{ss.label}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar initials={t.assignee.split(" ").map(n => n[0]).join("")} />
                      <span className="text-[11px] text-[#94a3b8] whitespace-nowrap">{t.assignee}</span>
                    </div>
                  </td>
                  <td className={cx("px-5 py-3 font-mono text-[10px] whitespace-nowrap", t.due === "Today" ? "text-amber-400 font-semibold" : "text-[#64748B]")}>{t.due}</td>
                  <td className="px-5 py-3">
                    <button className="text-[#64748B] hover:text-[#F1F5F9] transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <EmptyState icon={<CheckSquare className="w-5 h-5" />} title="No tasks match" body="Adjust your filters to see tasks." />
        )}
      </Card>
    </div>
  );
}

// ─── Projects View ────────────────────────────────────────────────────────────

function ProjectsView() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-[#F1F5F9]">Projects</h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">{projects.length} active · 2 at risk</p>
        </div>
        <PrimaryBtn icon={<Plus className="w-3 h-3" />}>New project</PrimaryBtn>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {projects.map(p => (
          <Card key={p.id} className="p-5 hover:border-[#2A2A3E] transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-[#64748B]">{p.id}</span>
                  <span className={cx("text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide", projectStatusStyle(p.status))}>
                    {p.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#F1F5F9]">{p.name}</h3>
              </div>
              <button className="text-[#64748B] hover:text-[#F1F5F9] transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#64748B] font-mono">Progress</span>
                <span className="font-mono text-[10px] font-semibold text-[#F1F5F9]">{p.progress}%</span>
              </div>
              <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
                <div
                  className={cx("h-full rounded-full", p.status === "at-risk" ? "bg-red-500" : p.status === "in-review" ? "bg-indigo-500" : "bg-emerald-500")}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center border-t border-[#1E1E2E] pt-3">
              <div>
                <p className="font-mono text-xs font-semibold text-[#F1F5F9]">{p.tasks}</p>
                <p className="text-[10px] text-[#64748B]">Tasks</p>
              </div>
              <div>
                <p className={cx("font-mono text-xs font-semibold", p.open > 10 ? "text-amber-400" : "text-[#F1F5F9]")}>{p.open}</p>
                <p className="text-[10px] text-[#64748B]">Open</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#64748B]">{p.due}</p>
                <p className="text-[10px] text-[#64748B]">Due</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#1E1E2E]">
              <Avatar initials={p.lead.split(" ").map(n => n[0]).join("")} />
              <span className="text-[11px] text-[#94a3b8]">{p.lead}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── People View ──────────────────────────────────────────────────────────────

function PeopleView() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-[#F1F5F9]">People & Capacity</h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">6 team members · 2 overloaded</p>
        </div>
        <SecondaryBtn><Filter className="w-3 h-3" />Filter by dept</SecondaryBtn>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {people.map(p => {
          const statusMap: Record<string, { color: string; label: string }> = {
            overloaded: { color: "text-red-400 bg-red-500/10 border-red-500/20", label: "Overloaded" },
            high: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", label: "High load" },
            healthy: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "Healthy" },
            available: { color: "text-sky-400 bg-sky-500/10 border-sky-500/20", label: "Available" },
          };
          const st = statusMap[p.status];
          return (
            <Card key={p.name} className="p-5 hover:border-[#2A2A3E] transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={p.avatar} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-[#F1F5F9]">{p.name}</p>
                    <p className="text-[11px] text-[#64748B] font-mono">{p.role}</p>
                  </div>
                </div>
                <span className={cx("text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border", st.color)}>{st.label}</span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#64748B]">Capacity</span>
                  <span className={cx("font-mono text-[10px] font-semibold", capacityColor(p.capacity))}>{p.capacity}%</span>
                </div>
                <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
                  <div className={cx("h-full rounded-full", capacityBarColor(p.capacity))} style={{ width: `${p.capacity}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1E1E2E]">
                <span className="text-[11px] text-[#64748B]"><span className="font-mono font-semibold text-[#F1F5F9]">{p.tasks}</span> open tasks</span>
                <SecondaryBtn>View tasks</SecondaryBtn>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Capacity chart */}
      <Card>
        <CardHeader title="Department Capacity Overview" subtitle="% allocated this sprint" />
        <div className="px-5 pb-5">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={capacityData} layout="vertical" margin={{ top: 4, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<ChartTooltip />} />
              <Bar key="cap-used" dataKey="used" name="capacity %" radius={[0, 3, 3, 0]} fill="#6366F1" fillOpacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────

const calendarEvents = [
  { time: "09:00", title: "Board Prep Sync", with: "Sara L., Marcus D.", type: "meeting", duration: "45m" },
  { time: "10:00", title: "Series B — Legal Review", with: "Marcus D., External Counsel", type: "review", duration: "60m" },
  { time: "11:30", title: "Q3 Budget Review", with: "Priya K.", type: "finance", duration: "30m" },
  { time: "13:00", title: "GTM Strategy Alignment", with: "Tom R., Jin L.", type: "strategy", duration: "60m" },
  { time: "14:30", title: "1:1 — Head of Design Candidate", with: "Sara L., Dara M.", type: "hiring", duration: "45m" },
  { time: "16:00", title: "Weekly AI Brief Digest Review", with: "You only", type: "solo", duration: "20m" },
];

function CalendarView() {
  const typeColors: Record<string, string> = {
    meeting: "border-l-indigo-500 bg-indigo-500/5",
    review: "border-l-amber-500 bg-amber-500/5",
    finance: "border-l-emerald-500 bg-emerald-500/5",
    strategy: "border-l-purple-500 bg-purple-500/5",
    hiring: "border-l-sky-500 bg-sky-500/5",
    solo: "border-l-slate-500 bg-slate-500/5",
  };
  const typeTextColors: Record<string, string> = {
    meeting: "text-indigo-400", review: "text-amber-400", finance: "text-emerald-400",
    strategy: "text-purple-400", hiring: "text-sky-400", solo: "text-slate-400",
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-[#F1F5F9]">Calendar</h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">Monday, June 29 2026 · {calendarEvents.length} events today</p>
        </div>
        <div className="flex items-center gap-2">
          <SecondaryBtn>← Week</SecondaryBtn>
          <SecondaryBtn>Today</SecondaryBtn>
          <SecondaryBtn>Week →</SecondaryBtn>
          <PrimaryBtn icon={<Plus className="w-3 h-3" />}>New event</PrimaryBtn>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-2">
          {calendarEvents.map((e, i) => (
            <div key={i} className={cx("border-l-2 pl-4 pr-5 py-3 rounded-r-xl flex items-start justify-between hover:brightness-110 transition-all cursor-pointer", typeColors[e.type])}>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-semibold text-[#94a3b8]">{e.time}</span>
                  <Badge className={cx("bg-transparent border border-current/30", typeTextColors[e.type])}>{e.type}</Badge>
                </div>
                <p className="text-sm font-semibold text-[#F1F5F9]">{e.title}</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">with {e.with}</p>
              </div>
              <span className="font-mono text-[10px] text-[#64748B] flex-shrink-0 mt-1">{e.duration}</span>
            </div>
          ))}
        </div>
        <div className="col-span-4 space-y-4">
          <Card className="p-5">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-3">This Week</p>
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
              <div key={d} className={cx("flex items-center justify-between py-2", i < 4 && "border-b border-[#1E1E2E]")}>
                <span className={cx("text-xs font-medium", i === 0 ? "text-indigo-400" : "text-[#64748B]")}>{d} Jun {29 + i}</span>
                <span className="font-mono text-[10px] text-[#64748B]">{[6, 4, 5, 3, 2][i]} events</span>
              </div>
            ))}
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-3">AI Scheduling Notes</p>
            <div className="space-y-2">
              <div className="flex gap-2 p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#94a3b8]">Back-to-back meetings 09:00–11:00 with no buffer. Consider 10m break.</p>
              </div>
              <div className="flex gap-2 p-2.5 bg-indigo-500/5 border border-indigo-500/15 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#94a3b8]">Series B review may need 30m extension based on outstanding items.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Intelligence View ────────────────────────────────────────────────────────

const insights = [
  { id: "INS-14", category: "Risk", title: "Series B closure risk increasing", body: "Three legal review items are 2 days past SLA. At current velocity, term sheet execution will miss the July 15 target by 4–6 days.", confidence: 88, severity: "critical", generated: "08:41 today" },
  { id: "INS-13", category: "Ops", title: "Engineering bottleneck pattern detected", body: "Jin L. has been assigned to 14 of 47 open tasks. This creates a single point of failure for 6 critical path items in Q3.", confidence: 92, severity: "high", generated: "08:17 today" },
  { id: "INS-12", category: "Finance", title: "Q3 budget variance summary", body: "Current projections show $142K overspend across Eng (+$87K) and Legal (+$55K). Recommend a CFO briefing before Board meeting.", confidence: 97, severity: "medium", generated: "Yesterday 18:30" },
  { id: "INS-11", category: "People", title: "Hiring velocity behind target", body: "Head of Design hire is 3 weeks behind plan. Pipeline has 2 final candidates. Recommend scheduling decisions within 48h to close by Jul 12.", confidence: 85, severity: "medium", generated: "Yesterday 14:00" },
];

function IntelligenceView() {
  const [sliderVal, setSliderVal] = useState(75);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-[#F1F5F9]">AI Intelligence</h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">Autonomous analysis · last run 08:47 · model gpt-4o-mini</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">14 signals processed</Badge>
          <PrimaryBtn icon={<RefreshCw className="w-3 h-3" />}>Re-analyze</PrimaryBtn>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-3">
          {insights.map(ins => (
            <Card key={ins.id} className="p-5 hover:border-[#2A2A3E] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] text-[#64748B]">{ins.id}</span>
                    <Badge className="bg-[#1E1E2E] text-[#94a3b8]">{ins.category}</Badge>
                    <RiskChip level={ins.severity as RiskLevel} />
                  </div>
                  <h3 className="text-sm font-semibold text-[#F1F5F9] mb-2">{ins.title}</h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{ins.body}</p>
                  <p className="text-[10px] text-[#64748B] font-mono mt-2">{ins.generated}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-mono text-lg font-semibold text-[#F1F5F9]">{ins.confidence}%</p>
                    <p className="text-[10px] text-[#64748B]">confidence</p>
                  </div>
                  <div className="flex gap-1.5">
                    <SecondaryBtn>Dismiss</SecondaryBtn>
                    <PrimaryBtn>Act on this</PrimaryBtn>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="col-span-4 space-y-4">
          <Card className="p-5">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-4">Agent Configuration</p>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#94a3b8]">Confidence threshold</span>
                  <span className="font-mono text-[11px] text-indigo-400 font-semibold">{sliderVal}%</span>
                </div>
                <Slider value={sliderVal} onChange={setSliderVal} />
              </div>
              {[
                { label: "Auto-draft emails", on: true },
                { label: "Risk escalation alerts", on: true },
                { label: "Calendar suggestions", on: false },
                { label: "Budget variance alerts", on: true },
              ].map(({ label, on }) => {
                const [enabled, setEnabled] = useState(on);
                return (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[11px] text-[#94a3b8]">{label}</span>
                    <Toggle checked={enabled} onChange={setEnabled} />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-3">Model Stats</p>
            <div className="space-y-2">
              {[
                { label: "Actions taken today", value: "24" },
                { label: "Emails drafted", value: "7" },
                { label: "Risks flagged (30d)", value: "43" },
                { label: "Avg confidence", value: "89%" },
                { label: "Tokens used today", value: "148K" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#1E1E2E]/60 last:border-0">
                  <span className="text-[11px] text-[#64748B]">{label}</span>
                  <span className="font-mono text-[11px] font-semibold text-[#F1F5F9]">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Comms View ───────────────────────────────────────────────────────────────

const threads = [
  { from: "Marcus D.", subject: "Series B — redlines back from Wilson Sonsini", time: "08:31", unread: true, preview: "They pushed back on section 4.2 and the valuation cap. I think we can meet them at…" },
  { from: "AI Agent", subject: "Draft: Follow-up to DataStream Inc.", time: "08:41", unread: true, preview: "Hi [DataStream contact], following up on the NDA sent last Thursday. Could you confirm…", isDraft: true },
  { from: "Priya K.", subject: "Q3 budget reconciliation — $142K gap", time: "Yesterday", unread: false, preview: "I've traced the variance to a combination of contractor overrun and an unaccrued legal invoice…" },
  { from: "Tom R.", subject: "GTM Motion v2 — need your sign-off", time: "Yesterday", unread: false, preview: "Attached is the updated playbook. Main changes: territory split, comp structure, and the…" },
  { from: "Board Secretary", subject: "Board meeting agenda — July 1", time: "Jun 27", unread: false, preview: "Please find the draft agenda attached. Items include Q2 review, Series B update, and…" },
];

function CommsView() {
  const [selected, setSelected] = useState(0);
  const t = threads[selected];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Thread list */}
      <div className="w-80 flex-shrink-0 border-r border-[#1E1E2E] flex flex-col">
        <div className="px-4 py-3 border-b border-[#1E1E2E] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#F1F5F9]">Inbox</span>
          <Badge className="bg-red-500/10 text-red-400">2 unread</Badge>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map((th, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cx("w-full text-left px-4 py-3 border-b border-[#1E1E2E]/60 transition-colors", selected === i ? "bg-indigo-600/10" : "hover:bg-[#111118]")}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  {th.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />}
                  <span className={cx("text-xs font-semibold", th.unread ? "text-[#F1F5F9]" : "text-[#94a3b8]")}>{th.from}</span>
                </div>
                <span className="font-mono text-[10px] text-[#64748B]">{th.time}</span>
              </div>
              <p className={cx("text-xs truncate mb-0.5", th.unread ? "text-[#F1F5F9]" : "text-[#64748B]")}>{th.subject}</p>
              <p className="text-[10px] text-[#64748B] truncate">{th.preview}</p>
              {th.isDraft && <Badge className="mt-1 bg-amber-500/10 text-amber-400">AI Draft</Badge>}
            </button>
          ))}
        </div>
      </div>

      {/* Thread detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1E1E2E] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#F1F5F9]">{t.subject}</h3>
            <p className="text-[11px] text-[#64748B] mt-0.5 font-mono">From: {t.from} · {t.time}</p>
          </div>
          <div className="flex items-center gap-2">
            {t.isDraft && <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">AI Draft — pending review</Badge>}
            <SecondaryBtn>Archive</SecondaryBtn>
            <PrimaryBtn>Reply</PrimaryBtn>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl">
            <p className="text-sm text-[#94a3b8] leading-relaxed">{t.preview}</p>
            <p className="text-sm text-[#94a3b8] leading-relaxed mt-4">Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. The quick brown fox jumps over the lazy dog and then proceeds to elaborate on the nature of fundraising timelines, board expectations, and term sheet negotiations.</p>
            <p className="text-sm text-[#94a3b8] leading-relaxed mt-4">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Please review the attached documents and let me know if you have any questions before the meeting tomorrow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────

function SettingsView() {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [riskAlertsEnabled, setRiskAlertsEnabled] = useState(true);
  const [threshold, setThreshold] = useState(80);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-5">
        <h2 className="text-base font-bold text-[#F1F5F9]">Settings</h2>
        <p className="text-xs text-[#64748B] mt-0.5">Workspace configuration · AI agent settings · integrations</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-4">
          <Card className="p-5">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-4 pb-3 border-b border-[#1E1E2E]">AI Agent</p>
            <div className="space-y-4">
              {[
                { label: "Push notifications", desc: "Browser alerts for critical events", state: notifEnabled, set: setNotifEnabled },
                { label: "Slack integration", desc: "Sync tasks and alerts to #chief-of-staff", state: slackEnabled, set: setSlackEnabled },
                { label: "Auto-reply drafts", desc: "Agent drafts email replies for your review", state: autoReplyEnabled, set: setAutoReplyEnabled },
                { label: "Risk escalation alerts", desc: "Notify immediately when risk level changes", state: riskAlertsEnabled, set: setRiskAlertsEnabled },
              ].map(({ label, desc, state, set }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-[#1E1E2E]/50 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-[#F1F5F9]">{label}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{desc}</p>
                  </div>
                  <Toggle checked={state} onChange={set} />
                </div>
              ))}
              <div className="py-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-medium text-[#F1F5F9]">Confidence threshold</p>
                    <p className="text-[11px] text-[#64748B]">Only surface insights above this confidence level</p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-indigo-400">{threshold}%</span>
                </div>
                <Slider value={threshold} onChange={setThreshold} />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-4 pb-3 border-b border-[#1E1E2E]">Integrations</p>
            <div className="space-y-2">
              {[
                { name: "Google Workspace", status: "connected", icon: "G" },
                { name: "Slack", status: "connected", icon: "S" },
                { name: "Linear", status: "connected", icon: "L" },
                { name: "Salesforce CRM", status: "disconnected", icon: "SF" },
                { name: "Notion", status: "pending", icon: "N" },
              ].map(({ name, status, icon }) => (
                <div key={name} className="flex items-center justify-between p-3 bg-[#0D0D14] border border-[#1E1E2E] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#1E1E2E] flex items-center justify-center font-mono text-[10px] font-bold text-[#94a3b8]">{icon}</div>
                    <p className="text-xs font-medium text-[#F1F5F9]">{name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={status === "connected" ? "bg-emerald-500/10 text-emerald-400" : status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-[#1E1E2E] text-[#64748B]"}>
                      {status}
                    </Badge>
                    {status !== "connected" && <PrimaryBtn>Connect</PrimaryBtn>}
                    {status === "connected" && <SecondaryBtn>Configure</SecondaryBtn>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-4">
          <Card className="p-5">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-3">Workspace</p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#64748B] block mb-1">Workspace name</label>
                <input defaultValue="Acme Corp · Ops" className="w-full bg-[#0D0D14] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-indigo-500/60 font-mono" />
              </div>
              <div>
                <label className="text-[11px] text-[#64748B] block mb-1">Timezone</label>
                <select className="w-full bg-[#0D0D14] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-[#94a3b8] font-mono focus:outline-none">
                  <option>America/New_York (UTC-4)</option>
                  <option>America/Los_Angeles (UTC-7)</option>
                  <option>Europe/London (UTC+1)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#64748B] block mb-1">Plan</label>
                <div className="flex items-center justify-between p-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-lg">
                  <span className="text-xs font-semibold text-indigo-300">Enterprise</span>
                  <Badge className="bg-indigo-500/20 text-indigo-400">Active</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-3">Danger Zone</p>
            <div className="space-y-2">
              <DangerBtn><Lock className="w-3 h-3" />Pause AI agent</DangerBtn>
              <DangerBtn><X className="w-3 h-3" />Delete all AI drafts</DangerBtn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── CEO Clarity Dashboard (Screen 1) ────────────────────────────────────────

const workstreams = [
  { priority: "P1", name: "Series B Close", owner: "Sarah K.", agents: 3, agentStatus: "On", status: "on-track", action: null },
  { priority: "P2", name: "Q3 Budget Sign-off", owner: "Raj M.", agents: 1, agentStatus: "Blocked", status: "blocked", action: "Decide" },
  { priority: "P3", name: "GTM Playbook v2", owner: "AI CoS", agents: 2, agentStatus: "On", status: "on-track", action: null },
];

const blockers = [
  { label: "Missing Context", type: "context", desc: "Finance agent needs Q2 actuals from Raj M." },
  { label: "Cross-Agent Conflict", type: "cross", desc: "Legal and Ops agents have conflicting timelines on vendor NDA." },
  { label: "Decision Needed", type: "decision", desc: "Series B valuation cap: approve redlines or counter?" },
];

function CEODashboardView() {
  const [briefOpen, setBriefOpen] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  return (
    <div className="p-6 h-full overflow-y-auto space-y-5">
      {/* Inner page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F1F5F9] tracking-tight">AI Chief of Staff</h1>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">Monday Jun 29 · Good morning. Here is what matters today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBriefOpen(!briefOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/15 border border-indigo-500/30 hover:bg-indigo-600/25 text-indigo-300 text-xs font-semibold transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Morning Brief
          </button>
          <button
            onClick={() => setInputOpen(!inputOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E1E2E] border border-[#2A2A3E] hover:bg-[#252536] text-[#F1F5F9] text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Input
          </button>
        </div>
      </div>

      {/* Morning Brief panel */}
      {briefOpen && (
        <Card className="p-5 border-indigo-500/20">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-[#F1F5F9]">Morning Brief</span>
              <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">AI Generated · 07:00</Badge>
            </div>
            <button onClick={() => setBriefOpen(false)} className="text-[#64748B] hover:text-[#F1F5F9]"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-2 text-xs text-[#94a3b8] leading-relaxed">
            <p>🔴 <strong className="text-[#F1F5F9]">Series B:</strong> Legal redlines unresolved for 48h. Wilson Sonsini needs a response by EOD. Decision required on valuation cap.</p>
            <p>🟡 <strong className="text-[#F1F5F9]">Q3 Budget:</strong> $142K variance flagged. Raj M. has the actuals — no action taken yet. Finance agent is blocked.</p>
            <p>🟢 <strong className="text-[#F1F5F9]">GTM Playbook v2:</strong> AI CoS completed territory split draft. Ready for your review. Tom R. aligned.</p>
            <p>⚡ <strong className="text-[#F1F5F9]">Your focus today:</strong> 1) Approve Series B counter, 2) Unblock budget with Raj, 3) Review board deck narrative (Sara).</p>
          </div>
        </Card>
      )}

      {/* Input panel */}
      {inputOpen && (
        <Card className="p-5 border-[#2A2A3E]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#F1F5F9]">Give the AI a directive</span>
            <button onClick={() => setInputOpen(false)} className="text-[#64748B] hover:text-[#F1F5F9]"><X className="w-4 h-4" /></button>
          </div>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="e.g. Draft a counter to Wilson Sonsini on the valuation cap. Keep it firm but collaborative."
            rows={3}
            className="w-full bg-[#0D0D14] border border-[#1E1E2E] rounded-xl px-4 py-3 text-xs text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-indigo-500/60 resize-none font-mono leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-[#64748B] font-mono">{inputText.length} chars</span>
            <div className="flex gap-2">
              <SecondaryBtn onClick={() => { setInputText(""); setInputOpen(false); }}>Cancel</SecondaryBtn>
              <PrimaryBtn icon={<ArrowRight className="w-3 h-3" />}>Send to AI</PrimaryBtn>
            </div>
          </div>
        </Card>
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="px-5 py-4">
          <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-medium mb-3">Top 3 Priorities</p>
          <div className="space-y-1.5">
            {["Series B Close", "Q3 Budget", "GTM v2"].map((p, i) => (
              <div key={p} className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#64748B]">P{i + 1}</span>
                <span className="text-[11px] text-[#F1F5F9] truncate">{p}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="px-5 py-4">
          <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-medium mb-2">Decisions Needed</p>
          <span className="font-mono text-3xl font-semibold text-amber-400">3</span>
          <p className="text-[10px] text-[#64748B] font-mono mt-1">awaiting your input</p>
        </Card>
        <Card className="px-5 py-4">
          <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-medium mb-2">Blocked</p>
          <span className="font-mono text-3xl font-semibold text-red-400">2</span>
          <p className="text-[10px] text-[#64748B] font-mono mt-1">agents stalled</p>
        </Card>
        <Card className="px-5 py-4">
          <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-medium mb-2">Agents at Risk</p>
          <span className="font-mono text-3xl font-semibold text-orange-400">1</span>
          <p className="text-[10px] text-[#64748B] font-mono mt-1">Finance · autonomy breach</p>
        </Card>
        <Card className="px-5 py-4">
          <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-medium mb-2">Cost Today</p>
          <span className="font-mono text-3xl font-semibold text-emerald-400">$24.80</span>
          <p className="text-[10px] text-[#64748B] font-mono mt-1">of $200 daily budget</p>
        </Card>
      </div>

      {/* Workstreams table + Blocker Lane */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <Card>
            <CardHeader
              title="Active Workstreams"
              subtitle="Agent-managed initiatives · sorted by CEO priority"
              action={<SecondaryBtn><Plus className="w-3 h-3" />Add workstream</SecondaryBtn>}
            />
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1E1E2E]">
                  {["Priority", "Workstream", "Owner", "Agents", "Status", "Action"].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workstreams.map((ws, i) => (
                  <tr key={ws.priority} className={cx("hover:bg-[#1A1A26] transition-colors", i < workstreams.length - 1 && "border-b border-[#1E1E2E]/50")}>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-bold text-indigo-400">{ws.priority}</span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[#F1F5F9] font-medium">{ws.name}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Avatar initials={ws.owner === "AI CoS" ? "AI" : ws.owner.split(" ").map(n => n[0]).join("")} />
                        <span className="text-[11px] text-[#94a3b8]">{ws.owner}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-[#F1F5F9]">{ws.agents}</span>
                        <span className="text-[10px] text-[#64748B]">agents</span>
                        <span className={cx(
                          "ml-1 w-1.5 h-1.5 rounded-full",
                          ws.agentStatus === "On" ? "bg-emerald-400 shadow-[0_0_5px_#10B981]" : "bg-red-400 shadow-[0_0_5px_#EF4444]"
                        )} />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cx(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wide border",
                        ws.status === "on-track" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" :
                        ws.status === "blocked" ? "bg-red-500/10 text-red-400 border-red-500/25" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/25"
                      )}>
                        <span className={cx("w-1.5 h-1.5 rounded-full", ws.status === "on-track" ? "bg-emerald-400" : ws.status === "blocked" ? "bg-red-400" : "bg-amber-400")} />
                        {ws.agentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {ws.action ? (
                        <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-semibold transition-colors uppercase tracking-wide">
                          <AlertTriangle className="w-3 h-3" />{ws.action}
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#1E1E2E] text-[#64748B] hover:text-[#94a3b8] text-[10px] font-mono transition-colors">
                          <Eye className="w-3 h-3" />View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-[#1E1E2E]">
              <p className="text-[10px] text-[#64748B] font-mono">3 active workstreams · 6 total agents deployed · last synced 2 min ago</p>
            </div>
          </Card>
        </div>

        {/* Blocker Lane */}
        <div className="col-span-4">
          <Card className="h-full">
            <CardHeader
              title="Blocker Lane"
              subtitle="Requires CEO resolution"
              action={<Badge className="bg-red-500/10 text-red-400 border border-red-500/20">3 open</Badge>}
            />
            <div className="px-5 pb-5 space-y-2">
              {blockers.map((b, i) => (
                <div key={i} className={cx(
                  "p-3 rounded-xl border transition-colors cursor-pointer hover:brightness-110",
                  b.type === "context" ? "bg-amber-500/5 border-amber-500/20" :
                  b.type === "cross" ? "bg-orange-500/5 border-orange-500/20" :
                  "bg-red-500/5 border-red-500/20"
                )}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={cx(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest border",
                      b.type === "context" ? "bg-amber-500/15 text-amber-400 border-amber-500/25" :
                      b.type === "cross" ? "bg-orange-500/15 text-orange-400 border-orange-500/25" :
                      "bg-red-500/15 text-red-400 border-red-500/25"
                    )}>
                      {b.type === "context" ? "⚠ " : b.type === "cross" ? "⇄ " : "● "}
                      {b.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-snug">{b.desc}</p>
                  <button className={cx(
                    "mt-2 text-[10px] font-mono font-semibold flex items-center gap-1 transition-colors",
                    b.type === "decision" ? "text-red-400 hover:text-red-300" : "text-[#64748B] hover:text-[#94a3b8]"
                  )}>
                    {b.type === "decision" ? "Resolve now" : "Provide context"} <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── AI Employee Org Chart (Screen 2) ────────────────────────────────────────

type AgentId = "finance" | "marketing" | "ops" | "cs" | "legal";

const agentNodes: { id: AgentId; label: string; role: string; status: "safe" | "at-risk" | "suspended"; owner: string; tasks: number }[] = [
  { id: "finance",   label: "Finance",   role: "Financial Analyst", status: "safe",      owner: "Raj M.",   tasks: 7 },
  { id: "marketing", label: "Marketing", role: "Campaign Manager",  status: "safe",      owner: "Tom R.",   tasks: 4 },
  { id: "ops",       label: "Ops",       role: "Operations Agent",  status: "at-risk",   owner: "Sarah K.", tasks: 9 },
  { id: "cs",        label: "CS",        role: "Customer Success",  status: "safe",      owner: "Dara M.",  tasks: 3 },
  { id: "legal",     label: "Legal",     role: "Legal Counsel",     status: "safe",      owner: "Marcus D.", tasks: 5 },
];

const agentDetails: Record<AgentId, {
  fullName: string; status: "safe" | "at-risk"; owner: string;
  autonomy: string; budgetUsed: number; budgetTotal: number;
  current: string; tools: string[];
}> = {
  finance: {
    fullName: "Finance Analyst Agent", status: "safe", owner: "Raj M.",
    autonomy: "L3", budgetUsed: 50, budgetTotal: 200,
    current: "Analyzing Q2 cashflow variance vs. forecast",
    tools: ["Notion", "Sheets", "Slack"],
  },
  marketing: {
    fullName: "Campaign Manager Agent", status: "safe", owner: "Tom R.",
    autonomy: "L2", budgetUsed: 18, budgetTotal: 150,
    current: "Drafting GTM launch email sequence for Segment A",
    tools: ["HubSpot", "Notion", "Canva"],
  },
  ops: {
    fullName: "Operations Agent", status: "at-risk", owner: "Sarah K.",
    autonomy: "L4", budgetUsed: 112, budgetTotal: 120,
    current: "Vendor contract reconciliation — near budget limit",
    tools: ["Linear", "Slack", "Airtable"],
  },
  cs: {
    fullName: "Customer Success Agent", status: "safe", owner: "Dara M.",
    autonomy: "L2", budgetUsed: 22, budgetTotal: 100,
    current: "Triaging support queue and drafting renewal outreach",
    tools: ["Intercom", "Notion", "Slack"],
  },
  legal: {
    fullName: "Legal Counsel Agent", status: "safe", owner: "Marcus D.",
    autonomy: "L3", budgetUsed: 65, budgetTotal: 250,
    current: "Reviewing Series B term sheet redline delta",
    tools: ["Notion", "DocuSign", "Slack"],
  },
};

// Positions for 5 agent nodes in a gentle arc below the center
const agentPositions: Record<AgentId, { x: number; y: number }> = {
  finance:   { x: 120,  y: 260 },
  marketing: { x: 290,  y: 310 },
  ops:       { x: 470,  y: 330 },
  cs:        { x: 650,  y: 310 },
  legal:     { x: 820,  y: 260 },
};
const CENTER = { x: 470, y: 80 };

function AgentNodeSVG({
  id, label, status, x, y, selected, onClick,
}: {
  id: AgentId; label: string; status: string;
  x: number; y: number; selected: boolean; onClick: () => void;
}) {
  const borderColor = selected ? "#6366F1" : status === "at-risk" ? "#F59E0B" : "#1E1E2E";
  const bgColor = selected ? "#1a1a3a" : "#111118";
  const dotColor = status === "at-risk" ? "#F59E0B" : status === "suspended" ? "#EF4444" : "#10B981";

  return (
    <g transform={`translate(${x - 44}, ${y - 24})`} style={{ cursor: "pointer" }} onClick={onClick}>
      <rect width={88} height={48} rx={12} fill={bgColor} stroke={borderColor} strokeWidth={selected ? 1.5 : 1} />
      <circle cx={10} cy={10} r={4} fill={dotColor} />
      <text x={44} y={20} textAnchor="middle" fill="#F1F5F9" fontSize={11} fontWeight={600} fontFamily="Inter, sans-serif">{label}</text>
      <text x={44} y={34} textAnchor="middle" fill="#64748B" fontSize={9} fontFamily="JetBrains Mono, monospace">
        {status === "at-risk" ? "⚠ at risk" : status === "suspended" ? "suspended" : "● safe"}
      </text>
    </g>
  );
}

function OrgChartView() {
  const [selectedAgent, setSelectedAgent] = useState<AgentId>("finance");
  const detail = agentDetails[selectedAgent];

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-[#F1F5F9]">AI Employees</h2>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">5 agents deployed · 1 at risk · reporting to AI Chief of Staff</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">4 Safe</Badge>
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">1 At Risk</Badge>
          <PrimaryBtn icon={<Plus className="w-3 h-3" />}>Add Agent</PrimaryBtn>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Org chart canvas */}
        <div className="col-span-8">
          <Card className="overflow-hidden">
            <div className="relative w-full" style={{ height: 420 }}>
              <svg width="100%" height="100%" viewBox="0 0 940 420" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0 }}>
                {/* Connection lines */}
                {agentNodes.map(n => {
                  const pos = agentPositions[n.id];
                  const isSelected = selectedAgent === n.id;
                  return (
                    <line
                      key={`line-${n.id}`}
                      x1={CENTER.x} y1={CENTER.y + 28}
                      x2={pos.x} y2={pos.y - 24}
                      stroke={isSelected ? "#6366F1" : "#1E1E2E"}
                      strokeWidth={isSelected ? 1.5 : 1}
                      strokeDasharray={isSelected ? "none" : "4 3"}
                    />
                  );
                })}

                {/* Center node: AI Chief of Staff */}
                <g transform={`translate(${CENTER.x - 80}, ${CENTER.y - 28})`}>
                  <rect width={160} height={56} rx={14} fill="#1a1a3a" stroke="#6366F1" strokeWidth={1.5} />
                  <rect x={0} y={0} width={160} height={56} rx={14} fill="url(#cosGrad)" />
                  <text x={80} y={22} textAnchor="middle" fill="#F1F5F9" fontSize={12} fontWeight={700} fontFamily="Inter, sans-serif">AI Chief of Staff</text>
                  <text x={80} y={38} textAnchor="middle" fill="#818CF8" fontSize={9} fontFamily="JetBrains Mono, monospace">● Active · 24 actions today</text>
                  <defs>
                    <linearGradient id="cosGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                </g>

                {/* Agent nodes */}
                {agentNodes.map(n => (
                  <AgentNodeSVG
                    key={n.id}
                    id={n.id}
                    label={n.label}
                    status={n.status}
                    x={agentPositions[n.id].x}
                    y={agentPositions[n.id].y}
                    selected={selectedAgent === n.id}
                    onClick={() => setSelectedAgent(n.id)}
                  />
                ))}

                {/* Task count badges below nodes */}
                {agentNodes.map(n => {
                  const pos = agentPositions[n.id];
                  return (
                    <g key={`badge-${n.id}`} transform={`translate(${pos.x - 16}, ${pos.y + 30})`}>
                      <rect width={32} height={16} rx={8} fill="#1E1E2E" />
                      <text x={16} y={11} textAnchor="middle" fill="#64748B" fontSize={8} fontFamily="JetBrains Mono, monospace">{agentNodes.find(a => a.id === n.id)?.tasks}t</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="px-5 py-3 border-t border-[#1E1E2E] flex items-center gap-6">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[10px] font-mono text-[#64748B]">Safe</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[10px] font-mono text-[#64748B]">At Risk</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[10px] font-mono text-[#64748B]">Suspended</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-px bg-indigo-500" /><span className="text-[10px] font-mono text-[#64748B]">Active link</span></div>
              <div className="flex items-center gap-1.5"><span className="font-mono text-[10px] text-[#64748B]">Nt = open tasks</span></div>
              <p className="ml-auto text-[10px] text-[#64748B] font-mono">Click any agent to inspect</p>
            </div>
          </Card>
        </div>

        {/* Agent detail card */}
        <div className="col-span-4">
          <Card className={cx("p-5 h-full flex flex-col", detail.status === "at-risk" ? "border-amber-500/25" : "border-[#1E1E2E]")}>
            {/* Agent header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cx(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest border",
                    detail.status === "safe" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                  )}>
                    <span className={cx("w-1.5 h-1.5 rounded-full", detail.status === "safe" ? "bg-emerald-400" : "bg-amber-400")} />
                    {detail.status}
                  </span>
                  <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Autonomy {detail.autonomy}</Badge>
                </div>
                <h3 className="text-sm font-bold text-[#F1F5F9] leading-tight">{detail.fullName}</h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4.5 h-4.5 text-indigo-400" />
              </div>
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-[#0D0D14] border border-[#1E1E2E] rounded-xl p-2.5">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-0.5">Owner</p>
                <div className="flex items-center gap-1.5">
                  <Avatar initials={detail.owner.split(" ").map(n => n[0]).join("")} />
                  <span className="text-[11px] font-semibold text-[#F1F5F9]">{detail.owner}</span>
                </div>
              </div>
              <div className="bg-[#0D0D14] border border-[#1E1E2E] rounded-xl p-2.5">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-0.5">Autonomy</p>
                <div className="flex items-center gap-1">
                  {["L1","L2","L3","L4","L5"].map(l => (
                    <span key={l} className={cx(
                      "text-[9px] font-mono font-bold px-1 py-0.5 rounded",
                      l === detail.autonomy ? "bg-indigo-600 text-white" : "bg-[#1E1E2E] text-[#64748B]"
                    )}>{l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="mb-4 bg-[#0D0D14] border border-[#1E1E2E] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono">Budget</p>
                <span className={cx("font-mono text-xs font-semibold", detail.budgetUsed / detail.budgetTotal > 0.85 ? "text-amber-400" : "text-[#F1F5F9]")}>
                  ${detail.budgetUsed}<span className="text-[#64748B]">/${detail.budgetTotal}</span>
                </span>
              </div>
              <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
                <div
                  className={cx("h-full rounded-full transition-all", detail.budgetUsed / detail.budgetTotal > 0.85 ? "bg-amber-400" : "bg-indigo-500")}
                  style={{ width: `${(detail.budgetUsed / detail.budgetTotal) * 100}%` }}
                />
              </div>
            </div>

            {/* Current task */}
            <div className="mb-4 bg-[#0D0D14] border border-[#1E1E2E] rounded-xl p-3">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-1.5">Currently Running</p>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 shadow-[0_0_5px_#10B981]" />
                <p className="text-[11px] text-[#F1F5F9] leading-relaxed">{detail.current}</p>
              </div>
            </div>

            {/* Tools */}
            <div className="mb-5">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2">Tools Access</p>
              <div className="flex flex-wrap gap-1.5">
                {detail.tools.map(t => (
                  <span key={t} className="px-2 py-1 bg-[#1E1E2E] border border-[#2A2A3E] rounded-lg text-[10px] font-mono text-[#94a3b8]">{t}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-2">
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />View Tasks
                </button>
                <button className="flex-1 py-2 rounded-xl bg-[#1E1E2E] hover:bg-[#252536] border border-[#2A2A3E] text-[#94a3b8] text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />Adjust Autonomy
                </button>
              </div>
              <button className="w-full py-2 rounded-xl bg-red-500/8 hover:bg-red-500/15 border border-red-500/25 text-red-400 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5">
                <PauseCircle className="w-3.5 h-3.5" />Suspend Agent
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Decision Desk (Screen 3) ─────────────────────────────────────────────────

type DecisionStatus = "needs-ceo" | "auto-resolved" | "delegated";

const decisionPackets = [
  {
    id: "D-14",
    risk: "medium" as RiskLevel,
    reversible: true,
    question: "Should we send a follow-up to Acme Corp before the contract is signed?",
    context: "CS Agent flagged a 3-day silence post-demo. Acme has high ACV ($180K). Previous touchpoint was overwhelmingly positive but no response to draft contract sent Mon.",
    agent: "CS Agent",
    agentAvatar: "CS",
    created: "2h ago",
    status: "needs-ceo" as DecisionStatus,
    options: [
      { key: "A", label: "Send follow-up now", risk: "Premature pressure — may feel pushy", riskPct: 40, upside: "Keeps deal warm, shows responsiveness", recommended: true },
      { key: "B", label: "Wait 2 more days", risk: "Risk losing momentum if they go cold", riskPct: 35, upside: "Respects buyer timeline", recommended: false },
      { key: "C", label: "Ask Sarah K. to call directly", risk: "+1 day delay, depends on Sarah's schedule", riskPct: 20, upside: "Human touch at critical juncture", recommended: false },
    ],
    recommendation: "A",
    rationale: "Past 6 similar decisions favored speed in silence >48h. Deals closed faster when followed up on day 3.",
    confidence: 82,
    similarDecisions: 6,
  },
  {
    id: "D-13",
    risk: "low" as RiskLevel,
    reversible: true,
    question: "Approve $12K spend on Notion Enterprise upgrade for Q3?",
    context: "Ops Agent flagged that the current Notion plan is blocking 3 workflow automations needed for board prep. Legal already approved vendor.",
    agent: "Ops Agent",
    agentAvatar: "OA",
    created: "4h ago",
    status: "needs-ceo" as DecisionStatus,
    options: [
      { key: "A", label: "Approve immediately", risk: "Minor budget variance", riskPct: 15, upside: "Unblocks 3 automations this week", recommended: true },
      { key: "B", label: "Defer to next budget cycle", risk: "Automations blocked for 4 weeks", riskPct: 60, upside: "Budget discipline", recommended: false },
    ],
    recommendation: "A",
    rationale: "Cost is within discretionary ops budget. Blocking risk outweighs spend.",
    confidence: 94,
    similarDecisions: 11,
  },
  {
    id: "D-12",
    risk: "high" as RiskLevel,
    reversible: false,
    question: "Counter Wilson Sonsini on Series B valuation cap at $42M pre-money?",
    context: "Legal Agent reviewed redlines. WS pushed cap from $40M to $38M. Finance model supports $42M based on current ARR trajectory.",
    agent: "Legal Agent",
    agentAvatar: "LA",
    created: "6h ago",
    status: "needs-ceo" as DecisionStatus,
    options: [
      { key: "A", label: "Counter at $42M pre-money", risk: "May delay close by 5–7 days", riskPct: 45, upside: "Protects founder equity significantly", recommended: true },
      { key: "B", label: "Accept $38M to close faster", risk: "Equity dilution, sets precedent", riskPct: 55, upside: "Closes by Jul 15 as planned", recommended: false },
      { key: "C", label: "Request founder call with lead investor", risk: "+3 days, uncertain outcome", riskPct: 30, upside: "Direct relationship, may unlock flexibility", recommended: false },
    ],
    recommendation: "A",
    rationale: "ARR growth trajectory supports higher valuation. Similar founder counters succeeded 4/5 times.",
    confidence: 71,
    similarDecisions: 5,
  },
];

const resolvedPackets = [
  { id: "D-11", question: "Auto-approve Slack Pro renewal ($4.2K/yr)?", resolvedAs: "Auto-approved", confidence: 98 },
  { id: "D-10", question: "Schedule weekly sync with RevOps?", resolvedAs: "Delegated to Sarah K.", confidence: 91 },
  { id: "D-09", question: "Acknowledge DataStream NDA receipt?", resolvedAs: "Auto-sent confirmation", confidence: 99 },
  { id: "D-08", question: "Reschedule GDPR prep call +1 day?", resolvedAs: "Auto-rescheduled", confidence: 96 },
  { id: "D-07", question: "Assign board deck formatting to design intern?", resolvedAs: "Delegated to Dara M.", confidence: 88 },
  { id: "D-06", question: "Enable 2FA enforcement for new hires?", resolvedAs: "Auto-enabled", confidence: 97 },
  { id: "D-05", question: "Send Q2 summary to investor updates list?", resolvedAs: "Auto-sent", confidence: 93 },
];

function ConfidenceArc({ pct, color }: { pct: number; color: string }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      <circle cx={28} cy={28} r={r} fill="none" stroke="#1E1E2E" strokeWidth={4} />
      <circle
        cx={28} cy={28} r={r} fill="none"
        stroke={color} strokeWidth={4}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 28 28)"
      />
      <text x={28} y={33} textAnchor="middle" fill="#F1F5F9" fontSize={11} fontWeight={700} fontFamily="JetBrains Mono, monospace">{pct}%</text>
    </svg>
  );
}

function DecisionCard({ packet, onDecide }: { packet: typeof decisionPackets[0]; onDecide: (id: string, choice: string) => void }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [delegateTo, setDelegateTo] = useState("");
  const [showDelegate, setShowDelegate] = useState(false);

  const riskColors: Record<RiskLevel, string> = {
    critical: "text-red-400 bg-red-500/10 border-red-500/25",
    high:     "text-orange-400 bg-orange-500/10 border-orange-500/25",
    medium:   "text-amber-400 bg-amber-500/10 border-amber-500/25",
    low:      "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  };
  const confColor = packet.confidence >= 85 ? "#10B981" : packet.confidence >= 70 ? "#F59E0B" : "#EF4444";

  return (
    <Card className={cx("transition-all", chosen ? "opacity-60" : "")}>
      {/* Card header strip */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#1E1E2E]">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-[#64748B]">{packet.id}</span>
          <span className={cx("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest border", riskColors[packet.risk])}>
            <span className={cx("w-1.5 h-1.5 rounded-full", packet.risk === "critical" ? "bg-red-400" : packet.risk === "high" ? "bg-orange-400" : packet.risk === "medium" ? "bg-amber-400" : "bg-emerald-400")} />
            {packet.risk} risk
          </span>
          <span className={cx(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold uppercase tracking-widest border",
            packet.reversible ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
          )}>
            {packet.reversible ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
            {packet.reversible ? "Reversible" : "Irreversible"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Avatar initials={packet.agentAvatar} />
            <span className="text-[10px] text-[#64748B] font-mono">{packet.agent} · {packet.created}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-12 gap-5">
          {/* Left: question + options */}
          <div className="col-span-8 space-y-4">
            {/* Question */}
            <div>
              <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-mono mb-1.5">Decision</p>
              <p className="text-sm font-semibold text-[#F1F5F9] leading-snug">{packet.question}</p>
            </div>

            {/* Context */}
            <div className="bg-[#0D0D14] border border-[#1E1E2E] rounded-xl p-3">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-1">Context</p>
              <p className="text-xs text-[#94a3b8] leading-relaxed">{packet.context}</p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono">Options</p>
              {packet.options.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setChosen(chosen === opt.key ? null : opt.key)}
                  className={cx(
                    "w-full text-left p-3 rounded-xl border transition-all",
                    chosen === opt.key
                      ? "border-indigo-500/50 bg-indigo-600/10"
                      : opt.recommended && !chosen
                      ? "border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/8"
                      : "border-[#1E1E2E] bg-[#0D0D14] hover:border-[#2A2A3E]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cx(
                      "w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5",
                      chosen === opt.key ? "bg-indigo-600 text-white" : opt.recommended ? "bg-indigo-500/20 text-indigo-400" : "bg-[#1E1E2E] text-[#64748B]"
                    )}>{opt.key}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={cx("text-xs font-semibold", chosen === opt.key || opt.recommended ? "text-[#F1F5F9]" : "text-[#94a3b8]")}>{opt.label}</span>
                        {opt.recommended && (
                          <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase tracking-wide">AI Rec</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] text-[#64748B]">↑ {opt.upside}</p>
                        <span className="text-[#1E1E2E]">·</span>
                        <p className="text-[10px] text-red-400/80">↓ Risk {opt.riskPct}% — {opt.risk}</p>
                      </div>
                    </div>
                    {/* Mini risk bar */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="font-mono text-[10px] text-red-400">{opt.riskPct}%</span>
                      <div className="w-16 h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                        <div className={cx("h-full rounded-full", opt.riskPct > 45 ? "bg-red-500" : opt.riskPct > 30 ? "bg-amber-400" : "bg-emerald-500")} style={{ width: `${opt.riskPct}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: AI rec + confidence */}
          <div className="col-span-4 space-y-3">
            {/* Confidence arc */}
            <div className="bg-[#0D0D14] border border-[#1E1E2E] rounded-xl p-4 flex flex-col items-center gap-2">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono">AI Confidence</p>
              <ConfidenceArc pct={packet.confidence} color={confColor} />
              <p className="text-[10px] text-[#64748B] text-center leading-relaxed">
                Based on <span className="font-mono font-semibold text-[#94a3b8]">{packet.similarDecisions}</span> similar past decisions
              </p>
            </div>

            {/* Recommendation */}
            <div className="bg-indigo-600/8 border border-indigo-500/20 rounded-xl p-3">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-1.5">Recommendation</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-mono text-sm font-bold text-white">{packet.recommendation}</span>
                <span className="text-xs font-semibold text-indigo-300">{packet.options.find(o => o.key === packet.recommendation)?.label}</span>
              </div>
              <p className="text-[10px] text-[#94a3b8] leading-relaxed">{packet.rationale}</p>
            </div>

            {/* Delegate panel */}
            {showDelegate && (
              <div className="bg-[#0D0D14] border border-[#1E1E2E] rounded-xl p-3 space-y-2">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono">Delegate to</p>
                <select
                  value={delegateTo}
                  onChange={e => setDelegateTo(e.target.value)}
                  className="w-full bg-[#111118] border border-[#1E1E2E] rounded-lg px-2.5 py-1.5 text-[11px] text-[#94a3b8] font-mono focus:outline-none focus:border-indigo-500/60"
                >
                  <option value="">Select person…</option>
                  <option>Sarah K.</option>
                  <option>Marcus D.</option>
                  <option>Raj M.</option>
                  <option>Tom R.</option>
                </select>
                <PrimaryBtn onClick={() => { setShowDelegate(false); onDecide(packet.id, `Delegated to ${delegateTo}`); }}>
                  Confirm Delegation
                </PrimaryBtn>
              </div>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#1E1E2E]">
          <button
            onClick={() => onDecide(packet.id, chosen || packet.recommendation)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Approve {chosen || packet.recommendation}
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-400 text-xs font-semibold transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Override
          </button>
          <button
            onClick={() => setShowDelegate(!showDelegate)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E1E2E] hover:bg-[#252536] border border-[#2A2A3E] text-[#94a3b8] hover:text-[#F1F5F9] text-xs font-semibold transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            Delegate
          </button>
          <span className="ml-auto text-[10px] text-[#64748B] font-mono">Tap an option to pre-select before approving</span>
        </div>
      </div>
    </Card>
  );
}

function DecisionDeskView() {
  const [tab, setTab] = useState<"pending" | "resolved">("pending");
  const [dismissed, setDismissed] = useState<string[]>([]);

  const pending = decisionPackets.filter(d => !dismissed.includes(d.id));

  return (
    <div className="p-6 h-full overflow-y-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F1F5F9] tracking-tight">Decision Desk</h1>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">AI-escalated decisions requiring your judgment · Jun 29</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_#EF4444]" />
            Needs CEO: {pending.length}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Auto-resolved: 7
          </span>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex items-center gap-1 p-1 bg-[#111118] border border-[#1E1E2E] rounded-xl w-fit">
        {[
          { key: "pending", label: `Needs Decision (${pending.length})` },
          { key: "resolved", label: "Auto-resolved (7)" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "pending" | "resolved")}
            className={cx(
              "px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              tab === t.key ? "bg-[#1E1E2E] text-[#F1F5F9]" : "text-[#64748B] hover:text-[#94a3b8]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pending" && (
        <div className="space-y-4">
          {pending.length === 0 ? (
            <EmptyState icon={<CheckSquare className="w-5 h-5" />} title="All clear" body="No decisions pending. AI CoS is handling everything autonomously." />
          ) : (
            pending.map(packet => (
              <DecisionCard
                key={packet.id}
                packet={packet}
                onDecide={(id) => setDismissed(prev => [...prev, id])}
              />
            ))
          )}
        </div>
      )}

      {tab === "resolved" && (
        <Card>
          <CardHeader title="Auto-resolved by AI CoS" subtitle="No CEO input required — logged for audit" />
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1E1E2E]">
                {["ID", "Decision", "Resolved As", "Confidence", ""].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resolvedPackets.map((r, i) => (
                <tr key={r.id} className={cx("hover:bg-[#1A1A26] transition-colors", i < resolvedPackets.length - 1 && "border-b border-[#1E1E2E]/50")}>
                  <td className="px-5 py-3 font-mono text-[10px] text-[#64748B]">{r.id}</td>
                  <td className="px-5 py-3 text-[#94a3b8] max-w-[340px] truncate">{r.question}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{r.resolvedAs}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.confidence}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400">{r.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-[#64748B] hover:text-[#F1F5F9] transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ─── Cross-Agent Friction Resolver (Screen 4) ─────────────────────────────────

type FrictionType = "contradictory-assumption" | "resource-conflict" | "priority-clash" | "data-mismatch";

const frictionConflicts = [
  {
    id: "F-07",
    agentA: "Finance Agent",
    agentAAvatar: "FA",
    agentAColor: "#6366F1",
    agentB: "Legal Agent",
    agentBAvatar: "LA",
    agentBColor: "#F59E0B",
    type: "contradictory-assumption" as FrictionType,
    typeLabel: "Contradictory Assumption",
    severity: "high" as RiskLevel,
    discovered: "1h ago",
    claimA: "Contract clause 4.2 allows autonomous spend up to $50K without approval.",
    claimB: "Internal policy requires CFO approval for any spend above $10K per vendor.",
    impact: "Finance Agent is about to auto-approve a $42K vendor invoice. Legal Agent has flagged this as a policy breach that could expose the company to audit risk.",
    resolution: {
      proposedBy: "AI CoS",
      text: "Apply the stricter threshold: enforce $10K approval requirement immediately. Finance Agent pauses invoice. Route to Raj M. for CFO sign-off. Update shared policy context for both agents.",
      confidence: 89,
      riskIfIgnored: "High — potential audit exposure, policy inconsistency on record",
    },
    status: "pending",
    workstream: "Finance Ops",
  },
  {
    id: "F-06",
    agentA: "Ops Agent",
    agentAAvatar: "OA",
    agentAColor: "#10B981",
    agentB: "CS Agent",
    agentBAvatar: "CA",
    agentBColor: "#8B5CF6",
    type: "resource-conflict" as FrictionType,
    typeLabel: "Resource Conflict",
    severity: "medium" as RiskLevel,
    discovered: "3h ago",
    claimA: "Scheduled Sarah K. for vendor contract review on Jul 2, 10:00–12:00.",
    claimB: "Scheduled Sarah K. for Acme renewal call on Jul 2, 10:30–11:30 (overlapping).",
    impact: "Sarah K. has two conflicting calendar holds from different agents. Neither agent is aware of the other's scheduling. One or both meetings will fail.",
    resolution: {
      proposedBy: "AI CoS",
      text: "Move Acme renewal call to Jul 2 at 13:00. Notify CS Agent and Ops Agent of updated schedule. Add calendar conflict guard to both agents' scheduling logic.",
      confidence: 97,
      riskIfIgnored: "Medium — missed meeting, relationship damage with Acme",
    },
    status: "pending",
    workstream: "People Ops",
  },
];

const frictionTypeStyles: Record<FrictionType, { bg: string; text: string; border: string; icon: string }> = {
  "contradictory-assumption": { bg: "bg-red-500/8",    text: "text-red-400",    border: "border-red-500/20",    icon: "⇄" },
  "resource-conflict":        { bg: "bg-amber-500/8",  text: "text-amber-400",  border: "border-amber-500/20",  icon: "⚡" },
  "priority-clash":           { bg: "bg-orange-500/8", text: "text-orange-400", border: "border-orange-500/20", icon: "↑↓" },
  "data-mismatch":            { bg: "bg-purple-500/8", text: "text-purple-400", border: "border-purple-500/20", icon: "≠" },
};

// Dependency graph nodes for the mini map
const depNodes = [
  { id: "cos",     label: "AI CoS",     x: 260, y: 60,  color: "#6366F1", r: 28 },
  { id: "finance", label: "Finance",    x: 80,  y: 180, color: "#6366F1", r: 22 },
  { id: "legal",   label: "Legal",      x: 200, y: 200, color: "#F59E0B", r: 22 },
  { id: "ops",     label: "Ops",        x: 320, y: 190, color: "#10B981", r: 22 },
  { id: "cs",      label: "CS",         x: 430, y: 180, color: "#8B5CF6", r: 22 },
  { id: "invoice", label: "$42K Invoice", x: 100, y: 300, color: "#EF4444", r: 18 },
  { id: "policy",  label: "Policy Doc",  x: 220, y: 300, color: "#F59E0B", r: 18 },
  { id: "sarah",   label: "Sarah K.",    x: 370, y: 300, color: "#64748B", r: 18 },
];

const depEdges = [
  { from: "cos", to: "finance", color: "#6366F1", dash: false },
  { from: "cos", to: "legal",   color: "#6366F1", dash: false },
  { from: "cos", to: "ops",     color: "#6366F1", dash: false },
  { from: "cos", to: "cs",      color: "#6366F1", dash: false },
  { from: "finance", to: "invoice", color: "#EF4444", dash: true },
  { from: "legal",   to: "policy",  color: "#F59E0B", dash: true },
  { from: "finance", to: "legal",   color: "#EF4444", dash: true, conflict: true },
  { from: "ops",     to: "sarah",   color: "#10B981", dash: true },
  { from: "cs",      to: "sarah",   color: "#8B5CF6", dash: true, conflict: true },
];

function getNodeById(id: string) { return depNodes.find(n => n.id === id)!; }

function DependencyGraph() {
  return (
    <Card>
      <CardHeader title="Agent Dependency Map" subtitle="Conflict edges highlighted in red" />
      <div className="px-5 pb-5">
        <svg width="100%" viewBox="0 0 520 340" style={{ maxHeight: 240 }}>
          <defs>
            <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#EF4444" />
            </marker>
            <marker id="arrowGray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#1E1E2E" />
            </marker>
            <marker id="arrowNorm" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#2A2A3E" />
            </marker>
          </defs>

          {depEdges.map((e, i) => {
            const a = getNodeById(e.from);
            const b = getNodeById(e.to);
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const x1 = a.x + (dx / len) * a.r;
            const y1 = a.y + (dy / len) * a.r;
            const x2 = b.x - (dx / len) * (b.r + 6);
            const y2 = b.y - (dy / len) * (b.r + 6);
            return (
              <line
                key={`dep-edge-${i}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={e.conflict ? "#EF4444" : e.color === "#6366F1" ? "#2A2A3E" : e.color}
                strokeWidth={e.conflict ? 2 : 1}
                strokeDasharray={e.dash ? "4 3" : "none"}
                strokeOpacity={e.conflict ? 1 : 0.5}
                markerEnd={e.conflict ? "url(#arrowRed)" : "url(#arrowNorm)"}
              />
            );
          })}

          {depNodes.map(n => (
            <g key={`dep-node-${n.id}`} transform={`translate(${n.x}, ${n.y})`}>
              <circle r={n.r} fill={n.color} fillOpacity={0.12} stroke={n.color} strokeWidth={1.5} strokeOpacity={0.6} />
              <text textAnchor="middle" y={4} fill="#F1F5F9" fontSize={n.r > 20 ? 10 : 8} fontFamily="Inter, sans-serif" fontWeight={600}>{n.label.split(" ")[0]}</text>
              {n.label.includes(" ") && n.r <= 18 && (
                <text textAnchor="middle" y={14} fill="#64748B" fontSize={7} fontFamily="JetBrains Mono, monospace">{n.label.split(" ").slice(1).join(" ")}</text>
              )}
            </g>
          ))}
        </svg>
        <div className="flex items-center gap-5 mt-2">
          <div className="flex items-center gap-1.5"><span className="w-4 h-px bg-red-500 inline-block" /><span className="text-[10px] font-mono text-[#64748B]">Conflict edge</span></div>
          <div className="flex items-center gap-1.5"><span className="w-4 h-px border-t border-dashed border-[#2A2A3E] inline-block" /><span className="text-[10px] font-mono text-[#64748B]">Dependency</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/60 inline-block" /><span className="text-[10px] font-mono text-[#64748B]">Conflict node</span></div>
        </div>
      </div>
    </Card>
  );
}

function FrictionCard({ conflict, onResolve }: { conflict: typeof frictionConflicts[0]; onResolve: (id: string) => void }) {
  const [resolved, setResolved] = useState(false);
  const ts = frictionTypeStyles[conflict.type];

  return (
    <Card className={cx("transition-all", resolved && "opacity-50")}>
      {/* Header strip */}
      <div className={cx("flex items-center justify-between px-5 py-3 border-b border-[#1E1E2E] rounded-t-2xl", ts.bg)}>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-[#64748B]">{conflict.id}</span>
          <span className={cx("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest border", ts.text, ts.border)}>
            {ts.icon} {conflict.typeLabel}
          </span>
          <RiskChip level={conflict.severity} />
          <span className="text-[10px] font-mono text-[#64748B]">{conflict.workstream}</span>
        </div>
        <span className="text-[10px] font-mono text-[#64748B]">Discovered {conflict.discovered}</span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-12 gap-5">
          {/* Agent claims */}
          <div className="col-span-7 space-y-3">
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono">Conflicting Claims</p>

            {/* Agent A */}
            <div className="flex items-start gap-3 p-3 bg-[#0D0D14] border rounded-xl" style={{ borderColor: conflict.agentAColor + "33" }}>
              <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                <Avatar initials={conflict.agentAAvatar} />
                <span className="text-[10px] font-semibold font-mono" style={{ color: conflict.agentAColor }}>{conflict.agentA}</span>
              </div>
              <div className="w-px h-full bg-[#1E1E2E] self-stretch mx-1 flex-shrink-0" />
              <p className="text-xs text-[#F1F5F9] leading-relaxed">{conflict.claimA}</p>
            </div>

            {/* Versus badge */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1E1E2E]" />
              <span className="font-mono text-[10px] font-bold text-[#64748B] bg-[#1E1E2E] px-2.5 py-1 rounded-full">VS</span>
              <div className="flex-1 h-px bg-[#1E1E2E]" />
            </div>

            {/* Agent B */}
            <div className="flex items-start gap-3 p-3 bg-[#0D0D14] border rounded-xl" style={{ borderColor: conflict.agentBColor + "33" }}>
              <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                <Avatar initials={conflict.agentBAvatar} />
                <span className="text-[10px] font-semibold font-mono" style={{ color: conflict.agentBColor }}>{conflict.agentB}</span>
              </div>
              <div className="w-px h-full bg-[#1E1E2E] self-stretch mx-1 flex-shrink-0" />
              <p className="text-xs text-[#F1F5F9] leading-relaxed">{conflict.claimB}</p>
            </div>

            {/* Impact */}
            <div className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/15 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] text-red-400 uppercase tracking-widest font-mono font-bold mb-1">Impact if unresolved</p>
                <p className="text-xs text-[#94a3b8] leading-relaxed">{conflict.impact}</p>
              </div>
            </div>
          </div>

          {/* Resolution */}
          <div className="col-span-5 space-y-3">
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono">AI CoS Resolution</p>

            <div className="bg-indigo-600/8 border border-indigo-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-indigo-300">Proposed by {conflict.resolution.proposedBy}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-12 h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${conflict.resolution.confidence}%` }} />
                    </div>
                    <span className="font-mono text-[9px] text-indigo-400">{conflict.resolution.confidence}% conf.</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">{conflict.resolution.text}</p>

              <div className="flex items-start gap-2 p-2 bg-red-500/5 border border-red-500/15 rounded-lg">
                <span className="text-[9px] text-red-400 font-mono font-bold flex-shrink-0 mt-0.5">RISK:</span>
                <p className="text-[9px] text-[#94a3b8]">{conflict.resolution.riskIfIgnored}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setResolved(true); onResolve(conflict.id); }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Accept Resolution
              </button>
              <button className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                <ArrowRight className="w-3.5 h-3.5" />
                Escalate to CEO
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FrictionResolverView() {
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const active = frictionConflicts.filter(c => !resolvedIds.includes(c.id));

  return (
    <div className="p-6 h-full overflow-y-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F1F5F9] tracking-tight">Cross-Agent Friction Resolver</h1>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">AI-detected inter-agent conflicts · requires mediation</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_5px_#F97316]" />
            Active Friction: {active.length} conflict{active.length !== 1 ? "s" : ""}
          </span>
          {resolvedIds.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {resolvedIds.length} resolved this session
            </span>
          )}
          <SecondaryBtn><RefreshCw className="w-3 h-3" />Scan for conflicts</SecondaryBtn>
        </div>
      </div>

      {/* Two-col layout: conflicts + graph */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8 space-y-4">
          {active.length === 0 ? (
            <EmptyState
              icon={<Shield className="w-5 h-5" />}
              title="No active conflicts"
              body="All agents are operating without friction. AI CoS continues monitoring."
            />
          ) : (
            active.map(conflict => (
              <FrictionCard
                key={conflict.id}
                conflict={conflict}
                onResolve={(id) => setResolvedIds(prev => [...prev, id])}
              />
            ))
          )}
        </div>

        {/* Right col: dependency graph + stats */}
        <div className="col-span-4 space-y-4">
          <DependencyGraph />

          {/* Conflict log */}
          <Card className="p-4">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-3">Conflict History (7d)</p>
            <div className="space-y-2">
              {[
                { type: "Resource Conflict", count: 3, trend: "up" },
                { type: "Contradictory Assumption", count: 2, trend: "stable" },
                { type: "Priority Clash", count: 1, trend: "down" },
                { type: "Data Mismatch", count: 1, trend: "stable" },
              ].map(({ type, count, trend }) => (
                <div key={type} className="flex items-center justify-between py-1.5 border-b border-[#1E1E2E]/60 last:border-0">
                  <span className="text-[10px] text-[#94a3b8]">{type}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-semibold text-[#F1F5F9]">{count}</span>
                    {trend === "up" ? <TrendingUp className="w-2.5 h-2.5 text-red-400" /> : trend === "down" ? <TrendingDown className="w-2.5 h-2.5 text-emerald-400" /> : <Dot className="w-3 h-3 text-[#64748B]" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#1E1E2E] flex items-center justify-between">
              <span className="text-[10px] text-[#64748B]">Avg resolution time</span>
              <span className="font-mono text-[10px] font-semibold text-emerald-400">4.2 min</span>
            </div>
          </Card>

          {/* Agent conflict score */}
          <Card className="p-4">
            <p className="text-xs font-semibold text-[#F1F5F9] mb-3">Agent Friction Score</p>
            <div className="space-y-2.5">
              {[
                { agent: "Finance", score: 72, color: "bg-amber-400" },
                { agent: "Legal",   score: 68, color: "bg-amber-400" },
                { agent: "Ops",     score: 45, color: "bg-indigo-500" },
                { agent: "CS",      score: 38, color: "bg-indigo-500" },
                { agent: "Marketing", score: 12, color: "bg-emerald-500" },
              ].map(({ agent, score, color }) => (
                <div key={agent}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#94a3b8]">{agent}</span>
                    <span className={cx("font-mono text-[10px] font-semibold", score > 60 ? "text-amber-400" : score > 40 ? "text-indigo-400" : "text-emerald-400")}>{score}</span>
                  </div>
                  <div className="h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                    <div className={cx("h-full rounded-full", color)} style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── CEO Operating Brain (Screen 5) ──────────────────────────────────────────

const EXAMPLE_INPUT = `We need to close 3 enterprise deals before end of Q2. CS is overwhelmed — they're handling 40+ tickets a day with a 3-person team. Marketing isn't aligned with Sales on the ICP. We've been targeting mid-market but Sales says enterprise is converting faster. Budget for Q2 marketing is $80K, most of it uncommitted. The board wants a progress update by June 30.`;

type BriefStatus = "idle" | "generating" | "ready" | "activated";

const GENERATED_BRIEF = {
  goal: "Close 3 enterprise deals before June 30, 2026",
  metrics: ["Deal velocity (days to close)", "CS response time < 4h", "ICP conversion rate by segment"],
  agents: [
    { name: "Sales Agent", role: "Pipeline acceleration + outreach sequencing", avatar: "SA", color: "#6366F1" },
    { name: "CS Agent",    role: "Triage + capacity rebalancing + auto-responses", avatar: "CS", color: "#10B981" },
    { name: "Marketing Agent", role: "ICP alignment + budget reallocation to enterprise", avatar: "MA", color: "#F59E0B" },
  ],
  risks: [
    { label: "ICP misalignment", level: "high" as RiskLevel,   detail: "Marketing spend targeting mid-market while Sales is closing enterprise" },
    { label: "CS capacity",      level: "high" as RiskLevel,   detail: "3-person team at 40+ tickets/day — blocking deal renewals" },
    { label: "Q2 timeline",      level: "medium" as RiskLevel, detail: "June 30 deadline leaves 2 days of buffer — no room for delays" },
  ],
  decisions: [
    { label: "ICP definition", urgency: "Today",  desc: "Confirm: enterprise or mid-market as primary segment?" },
    { label: "CS headcount",   urgency: "Jul 1",  desc: "Approve temporary contractor or redirect eng support?" },
    { label: "Budget pivot",   urgency: "Jul 2",  desc: "Reallocate $40K from mid-market ads to enterprise ABM?" },
  ],
  workstreams: 3,
  estimatedCost: "$18–$34/day",
  confidence: 87,
};

function OperatingBrainView() {
  const [input, setInput] = useState(EXAMPLE_INPUT);
  const [status, setStatus] = useState<BriefStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);

  function handleGenerate() {
    if (!input.trim()) return;
    setStatus("generating");
    setProgress(0);
    const steps = [12, 28, 45, 61, 74, 88, 95, 100];
    steps.forEach((p, i) => setTimeout(() => {
      setProgress(p);
      if (p === 100) setStatus("ready");
    }, i * 320));
  }

  const riskColors: Record<RiskLevel, string> = {
    critical: "text-red-400 bg-red-500/10 border-red-500/25",
    high:     "text-orange-400 bg-orange-500/10 border-orange-500/25",
    medium:   "text-amber-400 bg-amber-500/10 border-amber-500/25",
    low:      "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  };

  return (
    <div className="p-6 h-full overflow-y-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F1F5F9] tracking-tight">CEO Operating Brain</h1>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Drop raw context — get a structured operating brief with agents, risks, and workstreams
          </p>
        </div>
        {status === "activated" && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
            Brief activated · 3 workstreams running
          </span>
        )}
      </div>

      {/* Input zone */}
      <Card className={cx("transition-all", status === "activated" && "opacity-50 pointer-events-none")}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-mono">Raw Input</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#1E1E2E] text-[#64748B]">{input.length} chars</Badge>
              {input !== EXAMPLE_INPUT && (
                <button onClick={() => setInput("")} className="text-[#64748B] hover:text-[#F1F5F9] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Drop anything here. Notes, Slack threads, email snippets, meeting notes."
              rows={8}
              className="w-full bg-[#0D0D14] border border-[#1E1E2E] focus:border-indigo-500/50 rounded-xl px-5 py-4 text-sm text-[#F1F5F9] placeholder:text-[#2A2A3E] resize-none font-[Inter] leading-relaxed focus:outline-none transition-colors"
              style={{ caretColor: "#6366F1" }}
            />
            {/* Corner watermark */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 pointer-events-none select-none">
              <Cpu className="w-3 h-3 text-[#1E1E2E]" />
              <span className="text-[10px] font-mono text-[#1E1E2E]">AI CoS · Brain Mode</span>
            </div>
          </div>

          {/* Source chips */}
          <div className="flex items-center gap-2 mt-3">
            <p className="text-[10px] text-[#64748B] font-mono">Source detected:</p>
            {["Slack thread", "Email snippet", "Meeting notes", "Strategy note"].map(s => (
              <span key={s} className="px-2 py-0.5 bg-indigo-500/8 border border-indigo-500/15 rounded-md text-[9px] font-mono text-indigo-400">{s}</span>
            ))}
          </div>

          {/* Generate row */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1E1E2E]">
            <button
              onClick={handleGenerate}
              disabled={status === "generating" || !input.trim()}
              className={cx(
                "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                status === "generating"
                  ? "bg-indigo-600/50 text-indigo-300 cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              )}
            >
              {status === "generating" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating brief…
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Generate Operating Brief
                </>
              )}
            </button>
            <SecondaryBtn onClick={() => setInput("")}>Clear</SecondaryBtn>
            <span className="text-[10px] text-[#64748B] font-mono ml-auto">Supports: freeform text, bullet lists, Slack pastes, email threads</span>
          </div>

          {/* Progress bar */}
          {status === "generating" && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-[#64748B]">
                  {progress < 30 ? "Parsing context…" : progress < 55 ? "Identifying agents & risks…" : progress < 80 ? "Structuring workstreams…" : progress < 100 ? "Finalising decisions…" : "Done"}
                </span>
                <span className="font-mono text-[10px] text-indigo-400">{progress}%</span>
              </div>
              <div className="h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(99,102,241,0.6)" }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Generated Brief */}
      {(status === "ready" || status === "activated" || editMode) && (
        <div className="space-y-4">
          {/* Brief header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366F1]" />
              <h2 className="text-sm font-bold text-[#F1F5F9]">Generated Operating Brief</h2>
              <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {GENERATED_BRIEF.confidence}% confidence
              </Badge>
              {status === "activated" && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</Badge>
              )}
            </div>
            <span className="text-[10px] text-[#64748B] font-mono">Est. cost: {GENERATED_BRIEF.estimatedCost}</span>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Left 8 cols: main brief */}
            <div className="col-span-8 space-y-4">

              {/* Goal */}
              <Card className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-1">Primary Goal</p>
                    {editMode ? (
                      <input
                        defaultValue={GENERATED_BRIEF.goal}
                        className="w-full bg-[#0D0D14] border border-indigo-500/40 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#F1F5F9] focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-[#F1F5F9]">{GENERATED_BRIEF.goal}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {GENERATED_BRIEF.metrics.map(m => (
                        <span key={m} className="px-2 py-0.5 bg-[#1E1E2E] border border-[#2A2A3E] rounded-lg text-[10px] font-mono text-[#94a3b8]">
                          📊 {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Agents needed */}
              <Card className="p-5">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-3">Agents Needed</p>
                <div className="space-y-2">
                  {GENERATED_BRIEF.agents.map(a => (
                    <div key={a.name} className="flex items-center gap-3 p-3 bg-[#0D0D14] border border-[#1E1E2E] rounded-xl hover:border-[#2A2A3E] transition-colors">
                      <Avatar initials={a.avatar} />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#F1F5F9]">{a.name}</p>
                        <p className="text-[10px] text-[#64748B]">{a.role}</p>
                      </div>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Decisions needed */}
              <Card className="p-5">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-3">Decisions Needed from CEO</p>
                <div className="space-y-2">
                  {GENERATED_BRIEF.decisions.map((d, i) => (
                    <div key={d.label} className="flex items-start gap-3 p-3 bg-[#0D0D14] border border-amber-500/15 rounded-xl">
                      <span className="font-mono text-xs font-bold text-amber-400 flex-shrink-0 mt-0.5">{i + 1}.</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-[#F1F5F9]">{d.label}</p>
                          <span className="font-mono text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">{d.urgency}</span>
                        </div>
                        <p className="text-[10px] text-[#94a3b8]">{d.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right 4 cols: risks + workstreams */}
            <div className="col-span-4 space-y-4">

              {/* Risks */}
              <Card className="p-4">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-3">Risks Identified</p>
                <div className="space-y-2">
                  {GENERATED_BRIEF.risks.map(r => (
                    <div key={r.label} className={cx("p-3 rounded-xl border", riskColors[r.level].replace("text-", "border-").split(" ")[0], "bg-transparent border")}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={cx("w-1.5 h-1.5 rounded-full", r.level === "high" ? "bg-orange-400" : r.level === "medium" ? "bg-amber-400" : "bg-red-400")} />
                        <span className={cx("text-[10px] font-mono font-bold uppercase tracking-wide", r.level === "high" ? "text-orange-400" : r.level === "medium" ? "text-amber-400" : "text-red-400")}>{r.label}</span>
                      </div>
                      <p className="text-[10px] text-[#94a3b8] leading-snug">{r.detail}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Workstreams summary */}
              <Card className="p-4">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-3">Workstreams Created</p>
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <span className="font-mono text-5xl font-bold text-indigo-400 block leading-none"
                      style={{ textShadow: "0 0 30px rgba(99,102,241,0.4)" }}>
                      {GENERATED_BRIEF.workstreams}
                    </span>
                    <p className="text-xs text-[#64748B] mt-2">workstreams ready to activate</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {GENERATED_BRIEF.agents.map((a, i) => (
                    <div key={a.name} className="flex items-center gap-2 px-2 py-1.5 bg-[#0D0D14] rounded-lg">
                      <span className="font-mono text-[9px] font-bold text-[#64748B]">WS-{i + 1}</span>
                      <span className="text-[10px] text-[#94a3b8]">{a.name} workstream</span>
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Action bar */}
          {status !== "activated" && (
            <div className="flex items-center gap-3 p-4 bg-[#111118] border border-[#1E1E2E] rounded-2xl">
              <button
                onClick={() => setStatus("activated")}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                <PlayCircle className="w-4 h-4" />
                Approve & Activate
              </button>
              <button
                onClick={() => setEditMode(!editMode)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E1E2E] hover:bg-[#252536] border border-[#2A2A3E] text-[#94a3b8] hover:text-[#F1F5F9] text-sm font-semibold transition-colors"
              >
                <Hash className="w-4 h-4" />
                {editMode ? "Done Editing" : "Edit"}
              </button>
              <DangerBtn onClick={() => setStatus("idle")}>
                <X className="w-3.5 h-3.5" />Discard
              </DangerBtn>
              <span className="ml-auto text-[10px] text-[#64748B] font-mono">
                Activating will deploy {GENERATED_BRIEF.workstreams} agents and begin task execution
              </span>
            </div>
          )}

          {status === "activated" && (
            <div className="flex items-center gap-2.5 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
              <p className="text-xs text-emerald-400 font-semibold">
                Brief activated. 3 workstreams deployed. Agents are executing. Check Command Center for live status.
              </p>
              <button onClick={() => setStatus("idle")} className="ml-auto text-[#64748B] hover:text-[#F1F5F9] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Safety & Cost Control Panel (Screen 6) ───────────────────────────────────

type AgentSafetyRow = {
  id: AgentId;
  name: string;
  avatar: string;
  autonomy: number;       // 1–5
  budgetSpent: number;
  budgetLimit: number;
  active: boolean;
  policies: { legal: boolean; money: boolean; comms: boolean };
  riskScore: number;
  lastAction: string;
};

const initialSafetyAgents: AgentSafetyRow[] = [
  { id: "finance",   name: "Finance Agent",   avatar: "FA", autonomy: 3, budgetSpent: 50,  budgetLimit: 200, active: true,  policies: { legal: true,  money: true,  comms: false }, riskScore: 42, lastAction: "Flagged $42K invoice — awaiting approval" },
  { id: "marketing", name: "Marketing Agent", avatar: "MA", autonomy: 2, budgetSpent: 18,  budgetLimit: 150, active: true,  policies: { legal: false, money: true,  comms: true  }, riskScore: 12, lastAction: "Drafted launch email sequence" },
  { id: "ops",       name: "Ops Agent",       avatar: "OA", autonomy: 4, budgetSpent: 112, budgetLimit: 120, active: true,  policies: { legal: true,  money: false, comms: false }, riskScore: 78, lastAction: "Vendor contract reconciliation near limit" },
  { id: "cs",        name: "CS Agent",        avatar: "CA", autonomy: 2, budgetSpent: 22,  budgetLimit: 100, active: true,  policies: { legal: false, money: false, comms: true  }, riskScore: 24, lastAction: "Triaging support queue — 17 open tickets" },
  { id: "legal",     name: "Legal Agent",     avatar: "LA", autonomy: 3, budgetSpent: 65,  budgetLimit: 250, active: false, policies: { legal: true,  money: false, comms: false }, riskScore: 55, lastAction: "Series B term sheet review — paused" },
];

const AUTONOMY_LABELS = ["L1 — Suggest only", "L2 — Draft + notify", "L3 — Execute low-risk", "L4 — Full autonomy", "L5 — Unrestricted"];

function SafetyMeter({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 80 ? "#EF4444" : pct >= 60 ? "#F59E0B" : pct >= 40 ? "#F97316" : "#10B981";
  const segments = 12;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: segments }).map((_, i) => {
        const threshold = ((i + 1) / segments) * 100;
        const lit = pct >= threshold - 100 / segments / 2;
        const segColor = i >= 9 ? "#EF4444" : i >= 7 ? "#F59E0B" : "#10B981";
        return (
          <div
            key={i}
            className="h-3 flex-1 rounded-sm transition-all"
            style={{ backgroundColor: lit ? segColor : "#1E1E2E", opacity: lit ? 1 : 0.4 }}
          />
        );
      })}
    </div>
  );
}

function SafetyControlView() {
  const [agents, setAgents] = useState<AgentSafetyRow[]>(initialSafetyAgents);
  const [globalKill, setGlobalKill] = useState(false);
  const [globalBudget, setGlobalBudget] = useState(1000);
  const [globalSpent] = useState(267);
  const [confirmKill, setConfirmKill] = useState<AgentId | null>(null);

  function updateAgent(id: AgentId, patch: Partial<AgentSafetyRow>) {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  }
  function updatePolicy(id: AgentId, key: keyof AgentSafetyRow["policies"], val: boolean) {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, policies: { ...a.policies, [key]: val } } : a));
  }

  const totalRisk = Math.round(agents.reduce((s, a) => s + a.riskScore, 0) / agents.length);

  return (
    <div className="p-6 h-full overflow-y-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F1F5F9] tracking-tight">Safety & Cost Control</h1>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Autonomy limits · budget guardrails · risk policy overrides · global kill switch
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111118] border border-[#1E1E2E] rounded-xl">
            <span className="text-[10px] font-mono text-[#64748B]">System Risk</span>
            <span className={cx("font-mono text-sm font-bold", totalRisk >= 60 ? "text-red-400" : totalRisk >= 40 ? "text-amber-400" : "text-emerald-400")}>
              {totalRisk}
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">/ 100</span>
          </div>

          {/* Global kill switch */}
          <button
            onClick={() => setGlobalKill(!globalKill)}
            className={cx(
              "flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all",
              globalKill
                ? "bg-red-500/20 border-red-500/60 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                : "bg-[#111118] border-[#2A2A3E] text-[#64748B] hover:border-red-500/30 hover:text-red-400"
            )}
          >
            {globalKill ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
            {globalKill ? "RESUME ALL AGENTS" : "KILL ALL AGENTS"}
          </button>
        </div>
      </div>

      {/* Global kill banner */}
      {globalKill && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
          <PauseCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-400">All agents suspended</p>
            <p className="text-xs text-red-400/70 mt-0.5">No agent is executing any action. Tasks are paused. Click RESUME to restore.</p>
          </div>
          <span className="ml-auto font-mono text-xs text-red-400/60">GLOBAL KILL ACTIVE</span>
        </div>
      )}

      {/* Global budget bar */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F1F5F9]">Daily Budget — All Agents</p>
              <p className="text-[10px] text-[#64748B] font-mono">Resets at 00:00 UTC</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-lg font-bold text-[#F1F5F9]">${globalSpent} <span className="text-[#64748B] text-sm font-medium">/ ${globalBudget}</span></p>
              <p className={cx("text-[10px] font-mono", globalSpent / globalBudget > 0.8 ? "text-amber-400" : "text-emerald-400")}>
                {Math.round((globalSpent / globalBudget) * 100)}% used
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#64748B] font-mono">Limit</span>
              <input
                type="number"
                value={globalBudget}
                onChange={e => setGlobalBudget(Number(e.target.value))}
                className="w-20 bg-[#0D0D14] border border-[#1E1E2E] rounded-lg px-2 py-1 text-xs font-mono text-[#F1F5F9] text-center focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>
        </div>
        <div className="h-2 bg-[#1E1E2E] rounded-full overflow-hidden">
          <div
            className={cx("h-full rounded-full transition-all", globalSpent / globalBudget > 0.8 ? "bg-amber-400" : "bg-emerald-500")}
            style={{ width: `${Math.min((globalSpent / globalBudget) * 100, 100)}%`, boxShadow: globalSpent / globalBudget > 0.8 ? "0 0 8px #F59E0B" : "0 0 8px #10B981" }}
          />
        </div>
        {/* Per-agent cost breakdown */}
        <div className="flex items-center gap-1 mt-3">
          {agents.map(a => {
            const pct = (a.budgetSpent / globalBudget) * 100;
            return (
              <div key={a.id} className="relative group" style={{ flex: pct || 1 }}>
                <div
                  className="h-1 rounded-sm"
                  style={{
                    backgroundColor: a.budgetSpent / a.budgetLimit > 0.85 ? "#EF4444" : a.budgetSpent / a.budgetLimit > 0.6 ? "#F59E0B" : "#6366F1",
                    opacity: a.active ? 1 : 0.3,
                  }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111118] border border-[#1E1E2E] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <p className="text-[9px] font-mono text-[#F1F5F9]">{a.name}: ${a.budgetSpent}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-1.5">
          {agents.map(a => (
            <div key={a.id} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: a.budgetSpent / a.budgetLimit > 0.85 ? "#EF4444" : a.budgetSpent / a.budgetLimit > 0.6 ? "#F59E0B" : "#6366F1", opacity: a.active ? 1 : 0.4 }} />
              <span className="text-[9px] font-mono text-[#64748B]">{a.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Per-agent table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-mono">Agent Controls</p>
          <p className="text-[10px] text-[#64748B] font-mono">Click autonomy level to change · Toggle kill switch to suspend</p>
        </div>

        {agents.map(agent => {
          const budgetPct = (agent.budgetSpent / agent.budgetLimit) * 100;
          const isAtRisk = budgetPct > 85 || agent.riskScore > 65;

          return (
            <Card key={agent.id} className={cx(
              "transition-all",
              !agent.active && "opacity-60",
              isAtRisk && agent.active && "border-amber-500/20"
            )}>
              {/* Agent header row */}
              <div className={cx(
                "flex items-center justify-between px-5 py-3 border-b border-[#1E1E2E] rounded-t-2xl",
                isAtRisk && agent.active ? "bg-amber-500/4" : "bg-[#0D0D14]/50"
              )}>
                <div className="flex items-center gap-3">
                  <Avatar initials={agent.avatar} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#F1F5F9]">{agent.name}</p>
                      {isAtRisk && agent.active && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-2.5 h-2.5" /> AT RISK
                        </span>
                      )}
                      {!agent.active && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          <PauseCircle className="w-2.5 h-2.5" /> SUSPENDED
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#64748B] font-mono mt-0.5">{agent.lastAction}</p>
                  </div>
                </div>

                {/* Kill switch */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[9px] text-[#64748B] font-mono">Risk Score</p>
                    <p className={cx("font-mono text-sm font-bold", agent.riskScore >= 65 ? "text-red-400" : agent.riskScore >= 45 ? "text-amber-400" : "text-emerald-400")}>{agent.riskScore}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => {
                        if (agent.active) setConfirmKill(agent.id);
                        else updateAgent(agent.id, { active: true });
                      }}
                      className={cx(
                        "relative w-12 h-6 rounded-full border transition-all",
                        agent.active
                          ? "bg-emerald-500/20 border-emerald-500/40"
                          : "bg-red-500/20 border-red-500/40"
                      )}
                    >
                      <span className={cx(
                        "absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all",
                        agent.active ? "left-6 bg-emerald-500" : "left-0.5 bg-red-500"
                      )}>
                        {agent.active
                          ? <PlayCircle className="w-3 h-3 text-white" />
                          : <PauseCircle className="w-3 h-3 text-white" />
                        }
                      </span>
                    </button>
                    <span className={cx("text-[8px] font-mono font-bold", agent.active ? "text-emerald-400" : "text-red-400")}>
                      {agent.active ? "LIVE" : "KILLED"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kill confirm prompt */}
              {confirmKill === agent.id && (
                <div className="px-5 py-3 bg-red-500/8 border-b border-red-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <p className="text-xs text-red-400 font-semibold">Kill {agent.name}? All in-progress tasks will pause immediately.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { updateAgent(agent.id, { active: false }); setConfirmKill(null); }} className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-bold transition-colors">Confirm Kill</button>
                    <button onClick={() => setConfirmKill(null)} className="px-3 py-1 rounded-lg bg-[#1E1E2E] text-[#94a3b8] text-xs font-semibold transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              {/* Controls body */}
              <div className="px-5 py-4 grid grid-cols-12 gap-6">

                {/* Autonomy ladder */}
                <div className="col-span-4">
                  <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2.5">Autonomy Level</p>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => updateAgent(agent.id, { autonomy: lvl })}
                        className={cx(
                          "flex-1 py-2 rounded-lg text-[10px] font-mono font-bold transition-all border",
                          agent.autonomy === lvl
                            ? lvl >= 4
                              ? "bg-red-500/20 border-red-500/40 text-red-300"
                              : lvl === 3
                              ? "bg-indigo-600/25 border-indigo-500/40 text-indigo-300"
                              : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                            : "bg-[#0D0D14] border-[#1E1E2E] text-[#64748B] hover:border-[#2A2A3E]"
                        )}
                      >
                        L{lvl}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-[#64748B] leading-snug">{AUTONOMY_LABELS[agent.autonomy - 1]}</p>
                </div>

                {/* Budget gauge */}
                <div className="col-span-4">
                  <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2.5">Daily Budget</p>
                  <div className="flex items-end gap-1.5 mb-2">
                    <span className={cx("font-mono text-xl font-bold", budgetPct > 85 ? "text-red-400" : budgetPct > 60 ? "text-amber-400" : "text-emerald-400")}>
                      ${agent.budgetSpent}
                    </span>
                    <span className="font-mono text-xs text-[#64748B] mb-0.5">/ ${agent.budgetLimit}</span>
                  </div>
                  <SafetyMeter value={agent.budgetSpent} max={agent.budgetLimit} />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] text-[#64748B] font-mono">Limit</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateAgent(agent.id, { budgetLimit: Math.max(agent.budgetSpent, agent.budgetLimit - 25) })}
                        className="w-5 h-5 rounded bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#64748B] text-xs flex items-center justify-center"
                      >−</button>
                      <span className="font-mono text-[10px] text-[#F1F5F9] w-10 text-center">${agent.budgetLimit}</span>
                      <button
                        onClick={() => updateAgent(agent.id, { budgetLimit: agent.budgetLimit + 25 })}
                        className="w-5 h-5 rounded bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#64748B] text-xs flex items-center justify-center"
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* Risk policies */}
                <div className="col-span-4">
                  <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2.5">Risk Policies</p>
                  <div className="space-y-2">
                    {([
                      { key: "legal" as const, label: "Legal Review Gate",  icon: "⚖", desc: "Require legal check before execution" },
                      { key: "money" as const, label: "Spend Approval",     icon: "💰", desc: "Require CEO approval for spend" },
                      { key: "comms" as const, label: "Comms Pre-approval", icon: "✉",  desc: "Review all outgoing messages" },
                    ] as const).map(({ key, label, icon, desc }) => (
                      <div key={key} className="flex items-center gap-2.5">
                        <span className="text-sm leading-none">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-[#F1F5F9] leading-tight">{label}</p>
                          <p className="text-[9px] text-[#64748B] truncate">{desc}</p>
                        </div>
                        <Toggle
                          checked={agent.policies[key]}
                          onChange={v => updatePolicy(agent.id, key, v)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Global policy defaults */}
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#F1F5F9]">Global Policy Defaults</p>
            <p className="text-[10px] text-[#64748B]">Applied to all agents unless overridden per-agent above</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Legal Review Gate",   desc: "Block any action touching contracts, NDAs, or IP",  icon: "⚖", defaultOn: true  },
            { label: "Spend Approval >$10K", desc: "Route all spend above $10K to CFO for approval",     icon: "💰", defaultOn: true  },
            { label: "Customer Comms Gate",  desc: "Hold all outgoing customer emails for 15 min review", icon: "✉",  defaultOn: false },
          ].map(({ label, desc, icon, defaultOn }) => {
            const [on, setOn] = useState(defaultOn);
            return (
              <div key={label} className={cx("p-3 rounded-xl border transition-all", on ? "bg-indigo-500/5 border-indigo-500/20" : "bg-[#0D0D14] border-[#1E1E2E]")}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{icon}</span>
                    <p className="text-[10px] font-semibold text-[#F1F5F9]">{label}</p>
                  </div>
                  <Toggle checked={on} onChange={setOn} />
                </div>
                <p className="text-[9px] text-[#64748B] leading-snug">{desc}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── Accountability & Evidence Pack (Screen 7) ───────────────────────────────

type EvidenceTask = {
  id: string; title: string; agent: string; agentAvatar: string;
  completedAt: string; duration: string; confidence: number; cost: number;
  sources: { name: string; type: string; used: boolean }[];
  toolCalls: { tool: string; action: string; time: string; tokens: number }[];
  output: string;
};

const evidenceTasks: EvidenceTask[] = [
  {
    id: "T-0068", title: "Draft follow-up email to Acme Corp post-demo",
    agent: "CS Agent", agentAvatar: "CA",
    completedAt: "08:41 today", duration: "2m 14s", confidence: 88, cost: 0.42,
    sources: [
      { name: "Acme Corp CRM record", type: "CRM", used: true },
      { name: "Demo recording transcript", type: "Document", used: true },
      { name: "Previous email thread (3 msgs)", type: "Email", used: true },
      { name: "Competitor battlecard v2", type: "Notion", used: false },
    ],
    toolCalls: [
      { tool: "Notion", action: "Read: Acme account notes", time: "08:39:12", tokens: 840 },
      { tool: "Gmail API", action: "Read: thread history", time: "08:39:18", tokens: 1200 },
      { tool: "CRM API", action: "Get: last interaction", time: "08:39:22", tokens: 320 },
      { tool: "Gmail API", action: "Draft: follow-up email", time: "08:40:44", tokens: 2100 },
    ],
    output: "Draft email saved to Gmail Drafts. Subject: 'Following up — excited about what we showed you.' Body: 2 paragraphs, references specific demo moment. Includes proposed next step (30-min Q&A call). Tone: warm but direct.",
  },
  {
    id: "T-0065", title: "Analyze Q2 cashflow variance vs forecast",
    agent: "Finance Agent", agentAvatar: "FA",
    completedAt: "07:30 today", duration: "4m 58s", confidence: 94, cost: 0.87,
    sources: [
      { name: "Q2 actuals — Sheets (CFO copy)", type: "Sheets", used: true },
      { name: "Q2 forecast model v3", type: "Sheets", used: true },
      { name: "Legal invoices (May–Jun)", type: "Document", used: true },
      { name: "Contractor spend log", type: "Notion", used: true },
    ],
    toolCalls: [
      { tool: "Google Sheets", action: "Read: Q2 actuals tab", time: "07:26:01", tokens: 3200 },
      { tool: "Google Sheets", action: "Read: Q2 forecast", time: "07:26:08", tokens: 2900 },
      { tool: "Google Sheets", action: "Compute: variance table", time: "07:28:44", tokens: 1100 },
      { tool: "Notion", action: "Write: analysis summary", time: "07:30:12", tokens: 1800 },
      { tool: "Slack", action: "Send: CFO digest to #finance", time: "07:30:51", tokens: 420 },
    ],
    output: "Variance report written to Notion (Finance > Q2 Analysis). Total: $142K overspend. Breakdown: Eng contractors +$87K, Legal invoices +$55K. Chart created. CFO digest sent to #finance.",
  },
  {
    id: "T-0062", title: "Review Series B term sheet — redline delta",
    agent: "Legal Agent", agentAvatar: "LA",
    completedAt: "Yesterday 16:20", duration: "6m 33s", confidence: 79, cost: 1.24,
    sources: [
      { name: "Term sheet v4 (Wilson Sonsini redline)", type: "Document", used: true },
      { name: "Term sheet v3 (original)", type: "Document", used: true },
      { name: "Internal deal memo", type: "Notion", used: true },
    ],
    toolCalls: [
      { tool: "DocuSign API", action: "Read: redline delta v3→v4", time: "16:14:01", tokens: 5400 },
      { tool: "Notion", action: "Read: deal memo", time: "16:15:22", tokens: 1800 },
      { tool: "Notion", action: "Write: clause-by-clause analysis", time: "16:19:33", tokens: 4200 },
      { tool: "Slack", action: "Alert: CEO + Marcus D.", time: "16:20:14", tokens: 340 },
    ],
    output: "7 clauses reviewed. 2 flagged material: §4.2 valuation cap ($38M vs $42M), §6.1 board seat. Recommendation: counter on §4.2, accept §6.1. CEO and Marcus D. notified.",
  },
];

const agentScoreData = [
  { id: "finance",   name: "Finance Agent",  color: "#6366F1", scores: [72, 91, 78, 95, 82] },
  { id: "marketing", name: "Marketing Agent", color: "#F59E0B", scores: [85, 78, 92, 88, 70] },
  { id: "ops",       name: "Ops Agent",       color: "#10B981", scores: [68, 74, 55, 72, 60] },
  { id: "cs",        name: "CS Agent",        color: "#8B5CF6", scores: [94, 88, 91, 96, 85] },
  { id: "legal",     name: "Legal Agent",     color: "#F97316", scores: [62, 95, 71, 98, 75] },
];

const SCORE_LABELS = ["Speed", "Quality", "Cost", "Safety", "Autonomy"];

const fridayBrief = {
  weekOf: "Jun 23–29, 2026",
  wins: [
    "Closed Meridian Health pilot — $42K ARR added to pipeline",
    "Board deck v3 approved by Sara L. and Marcus D. with zero revisions",
    "Legal Agent completed Series B redline review 1 day ahead of schedule",
    "CS Agent resolved 47 tickets autonomously with zero escalations",
  ],
  blockers: [
    "Series B valuation cap §4.2 unresolved — counter needed by Jul 1",
    "Ops Agent at 93% budget ($112/$120) — 4 tasks queued and stalled",
    "Head of Design hire delayed 3 weeks — final decision needed this week",
  ],
  decisions: [
    { label: "Slack Pro renewal $4.2K/yr", outcome: "Auto-approved" },
    { label: "GTM territory split aligned", outcome: "CEO approved" },
    { label: "GDPR audit vendor selected", outcome: "Delegated → Priya K." },
    { label: "Board deck narrative pass", outcome: "CEO approved" },
  ],
  budgetSpent: 267,
  budgetLimit: 1000,
  budgetByAgent: [
    { name: "Finance", spent: 50, limit: 200, color: "#6366F1" },
    { name: "Marketing", spent: 18, limit: 150, color: "#F59E0B" },
    { name: "Ops", spent: 112, limit: 120, color: "#10B981" },
    { name: "CS", spent: 22, limit: 100, color: "#8B5CF6" },
    { name: "Legal", spent: 65, limit: 250, color: "#F97316" },
  ],
  nextActions: [
    { action: "Counter Series B §4.2 — valuation cap at $42M", urgency: "Today", owner: "CEO" },
    { action: "Decide CS headcount or contractor path", urgency: "Jul 1", owner: "CEO" },
    { action: "Approve ICP pivot to enterprise segment", urgency: "Jul 2", owner: "CEO" },
    { action: "Review Head of Design final candidate", urgency: "Jul 5", owner: "Sara L." },
  ],
};

// Radar scorecard SVG
function RadarScorecard({ scores, color = "#6366F1" }: { scores: number[]; color?: string }) {
  const CX = 90, CY = 90, R = 66;
  const angles = SCORE_LABELS.map((_, i) => ((i * 360 / 5) - 90) * (Math.PI / 180));
  const pt = (a: number, s: number) => ({ x: CX + R * s * Math.cos(a), y: CY + R * s * Math.sin(a) });
  const toPath = (pts: {x:number;y:number}[]) => pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('') + 'Z';
  const scorePts = angles.map((a, i) => pt(a, scores[i] / 100));
  return (
    <svg width={180} height={180} viewBox="0 0 180 180">
      {[0.25,0.5,0.75,1].map(s => (
        <polygon key={s} points={angles.map(a => { const p=pt(a,s); return `${p.x},${p.y}`; }).join(' ')} fill="none" stroke="#1E1E2E" strokeWidth={1} />
      ))}
      {angles.map((a,i) => { const o=pt(a,1); return <line key={`sp-${i}`} x1={CX} y1={CY} x2={o.x} y2={o.y} stroke="#1E1E2E" strokeWidth={1} />; })}
      <path d={toPath(scorePts)} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2} />
      {scorePts.map((p,i) => <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={3.5} fill={color} />)}
      {angles.map((a,i) => {
        const lx = CX + (R+18)*Math.cos(a); const ly = CY + (R+18)*Math.sin(a);
        return <text key={`lbl-${i}`} x={lx} y={ly+4} textAnchor="middle" fill="#64748B" fontSize={9} fontFamily="JetBrains Mono, monospace">{SCORE_LABELS[i]}</text>;
      })}
    </svg>
  );
}

// Evidence drawer — fixed overlay
function EvidenceDrawer({ task, onClose }: { task: EvidenceTask | null; onClose: () => void }) {
  const isOpen = !!task;
  const totalTokens = task ? task.toolCalls.reduce((s, t) => s + t.tokens, 0) : 0;
  return (
    <>
      <div onClick={onClose} className={cx("fixed inset-0 bg-black/60 z-40 transition-opacity duration-200", isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")} />
      <div className={cx("fixed top-0 right-0 h-full w-[540px] bg-[#0D0D14] border-l border-[#1E1E2E] z-50 flex flex-col transition-transform duration-300", isOpen ? "translate-x-0" : "translate-x-full")}>
        {task && (
          <>
            {/* Drawer header */}
            <div className="px-6 py-4 border-b border-[#1E1E2E] flex items-start justify-between gap-4 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-[#64748B]">{task.id}</span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</Badge>
                </div>
                <p className="text-sm font-bold text-[#F1F5F9] leading-snug">{task.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5"><Avatar initials={task.agentAvatar} /><span className="text-[10px] text-[#64748B]">{task.agent}</span></div>
                  <span className="text-[#1E1E2E]">·</span>
                  <span className="font-mono text-[10px] text-[#64748B]">{task.completedAt}</span>
                  <span className="text-[#1E1E2E]">·</span>
                  <span className="font-mono text-[10px] text-[#64748B]">{task.duration}</span>
                </div>
              </div>
              <button onClick={onClose} className="text-[#64748B] hover:text-[#F1F5F9] transition-colors flex-shrink-0 mt-1"><X className="w-4 h-4" /></button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 border-b border-[#1E1E2E] flex-shrink-0">
              {[
                { label: "Confidence", value: `${task.confidence}%`, color: task.confidence >= 85 ? "text-emerald-400" : task.confidence >= 70 ? "text-amber-400" : "text-red-400" },
                { label: "Cost", value: `$${task.cost.toFixed(2)}`, color: "text-[#F1F5F9]" },
                { label: "Tokens", value: totalTokens.toLocaleString(), color: "text-indigo-400" },
              ].map(s => (
                <div key={s.label} className="px-5 py-3 flex flex-col gap-0.5 border-r border-[#1E1E2E] last:border-0">
                  <span className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono">{s.label}</span>
                  <span className={cx("font-mono text-lg font-bold", s.color)}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Output */}
              <div>
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2">Output</p>
                <div className="bg-[#111118] border border-indigo-500/20 rounded-xl p-4">
                  <p className="text-xs text-[#F1F5F9] leading-relaxed">{task.output}</p>
                </div>
              </div>

              {/* Sources */}
              <div>
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2">Sources Used ({task.sources.length})</p>
                <div className="space-y-1.5">
                  {task.sources.map((s, i) => (
                    <div key={i} className={cx("flex items-center gap-2.5 px-3 py-2 rounded-lg border", s.used ? "bg-[#111118] border-[#1E1E2E]" : "bg-transparent border-[#1E1E2E]/40 opacity-50")}>
                      <span className={cx("w-1.5 h-1.5 rounded-full flex-shrink-0", s.used ? "bg-emerald-400" : "bg-[#2A2A3E]")} />
                      <span className="text-[11px] text-[#F1F5F9] flex-1 truncate">{s.name}</span>
                      <Badge className={s.used ? "bg-[#1E1E2E] text-[#64748B]" : "bg-transparent text-[#2A2A3E]"}>{s.type}</Badge>
                      {!s.used && <span className="text-[9px] font-mono text-[#2A2A3E]">unused</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool calls */}
              <div>
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2">Tool Calls ({task.toolCalls.length})</p>
                <div className="space-y-0">
                  {task.toolCalls.map((t, i) => (
                    <div key={i} className={cx("flex items-center gap-3 py-2.5", i < task.toolCalls.length-1 && "border-b border-[#1E1E2E]/50")}>
                      <span className="font-mono text-[9px] text-[#64748B] w-16 flex-shrink-0">{t.time}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-semibold text-indigo-400">{t.tool}</span>
                        <span className="text-[11px] text-[#64748B] ml-1.5">{t.action}</span>
                      </div>
                      <span className="font-mono text-[9px] text-[#64748B] flex-shrink-0">{t.tokens.toLocaleString()} tok</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Token breakdown bar */}
              <div>
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2">Token Distribution</p>
                <div className="flex h-2 rounded-full overflow-hidden gap-px">
                  {task.toolCalls.map((t, i) => {
                    const colors = ["#6366F1","#10B981","#F59E0B","#8B5CF6","#F97316"];
                    return <div key={i} className="h-full rounded-sm" style={{ flex: t.tokens, backgroundColor: colors[i % colors.length] }} />;
                  })}
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {task.toolCalls.map((t, i) => {
                    const colors = ["#6366F1","#10B981","#F59E0B","#8B5CF6","#F97316"];
                    return (
                      <div key={i} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }} />
                        <span className="text-[9px] font-mono text-[#64748B]">{t.tool}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function AccountabilityView() {
  const [tab, setTab] = useState<"evidence" | "scorecards" | "brief">("evidence");
  const [openTask, setOpenTask] = useState<EvidenceTask | null>(null);

  return (
    <div className="p-6 h-full overflow-y-auto relative space-y-5">
      <EvidenceDrawer task={openTask} onClose={() => setOpenTask(null)} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F1F5F9] tracking-tight">Accountability & Evidence</h1>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">Agent audit trail · scorecards · weekly brief</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {evidenceTasks.length} completed tasks with evidence
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#111118] border border-[#1E1E2E] rounded-xl w-fit">
        {[
          { key: "evidence" as const, label: "Evidence Pack" },
          { key: "scorecards" as const, label: "Agent Scorecards" },
          { key: "brief" as const, label: "Friday Brief" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cx("px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors", tab === t.key ? "bg-[#1E1E2E] text-[#F1F5F9]" : "text-[#64748B] hover:text-[#94a3b8]")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Evidence Pack tab ── */}
      {tab === "evidence" && (
        <Card>
          <CardHeader title="Completed Tasks — Evidence Available" subtitle="Click any row to open the evidence drawer" />
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1E1E2E]">
                {["ID","Task","Agent","Completed","Duration","Confidence","Cost",""].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {evidenceTasks.map((t, i) => (
                <tr key={t.id} onClick={() => setOpenTask(t)} className={cx("cursor-pointer transition-colors hover:bg-indigo-500/5 group", i < evidenceTasks.length-1 && "border-b border-[#1E1E2E]/50")}>
                  <td className="px-5 py-3 font-mono text-[10px] text-[#64748B]">{t.id}</td>
                  <td className="px-5 py-3 max-w-[220px]"><p className="text-[#F1F5F9] font-medium truncate group-hover:text-indigo-300 transition-colors">{t.title}</p></td>
                  <td className="px-5 py-3"><div className="flex items-center gap-1.5"><Avatar initials={t.agentAvatar} /><span className="text-[11px] text-[#94a3b8] whitespace-nowrap">{t.agent}</span></div></td>
                  <td className="px-5 py-3 font-mono text-[10px] text-[#64748B] whitespace-nowrap">{t.completedAt}</td>
                  <td className="px-5 py-3 font-mono text-[10px] text-[#64748B]">{t.duration}</td>
                  <td className="px-5 py-3">
                    <span className={cx("font-mono text-[11px] font-semibold", t.confidence>=85?"text-emerald-400":t.confidence>=70?"text-amber-400":"text-red-400")}>{t.confidence}%</span>
                  </td>
                  <td className="px-5 py-3 font-mono text-[10px] text-[#94a3b8]">${t.cost.toFixed(2)}</td>
                  <td className="px-5 py-3"><button className="text-[#64748B] group-hover:text-indigo-400 transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-[#1E1E2E] flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] font-mono">Showing 3 of 24 completed tasks</span>
            <span className="text-[10px] text-indigo-400 font-mono">← Click any row to inspect evidence</span>
          </div>
        </Card>
      )}

      {/* ── Scorecards tab ── */}
      {tab === "scorecards" && (
        <div className="grid grid-cols-5 gap-4">
          {agentScoreData.map(agent => {
            const avg = Math.round(agent.scores.reduce((a,b)=>a+b,0)/agent.scores.length);
            return (
              <Card key={agent.id} className="p-4 hover:border-[#2A2A3E] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar initials={agent.id.slice(0,2).toUpperCase()} />
                  <div>
                    <p className="text-[11px] font-bold text-[#F1F5F9] leading-tight">{agent.name}</p>
                    <p className="font-mono text-[10px]" style={{ color: agent.color }}>Avg {avg}</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <RadarScorecard scores={agent.scores} color={agent.color} />
                </div>
                <div className="space-y-1.5 mt-2">
                  {SCORE_LABELS.map((lbl, i) => (
                    <div key={lbl} className="flex items-center gap-2">
                      <span className="text-[9px] text-[#64748B] w-14 font-mono">{lbl}</span>
                      <div className="flex-1 h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${agent.scores[i]}%`, backgroundColor: agent.color, opacity: 0.7 }} />
                      </div>
                      <span className="font-mono text-[9px] text-[#94a3b8] w-6 text-right">{agent.scores[i]}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Friday Brief tab ── */}
      {tab === "brief" && (
        <div className="space-y-4">
          {/* Brief masthead */}
          <div className="flex items-center justify-between p-5 bg-[#111118] border border-[#1E1E2E] rounded-2xl">
            <div>
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-1">Weekly Operating Brief</p>
              <h2 className="text-lg font-bold text-[#F1F5F9]">Week of {fridayBrief.weekOf}</h2>
              <p className="text-xs text-[#64748B] mt-0.5">AI-generated · Friday summary · {agentScoreData.length} agents · 24 tasks completed</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">4 Wins</Badge>
              <Badge className="bg-red-500/10 text-red-400 border border-red-500/20">3 Blockers</Badge>
              <SecondaryBtn><RefreshCw className="w-3 h-3" />Export PDF</SecondaryBtn>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 space-y-4">

              {/* Wins */}
              <Card className="p-5">
                <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />Wins this week
                </p>
                <div className="space-y-2">
                  {fridayBrief.wins.map((w,i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2 border-b border-[#1E1E2E]/50 last:border-0">
                      <span className="font-mono text-xs font-bold text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                      <p className="text-xs text-[#F1F5F9]">{w}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Blockers */}
              <Card className="p-5">
                <p className="text-[9px] text-red-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />Blockers carrying into next week
                </p>
                <div className="space-y-2">
                  {fridayBrief.blockers.map((b,i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2 border-b border-[#1E1E2E]/50 last:border-0">
                      <span className="font-mono text-xs font-bold text-red-400 flex-shrink-0 mt-0.5">!</span>
                      <p className="text-xs text-[#94a3b8]">{b}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Decisions made */}
              <Card className="p-5">
                <p className="text-[9px] text-indigo-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />Decisions made
                </p>
                <div className="space-y-1.5">
                  {fridayBrief.decisions.map((d,i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#1E1E2E]/50 last:border-0">
                      <p className="text-xs text-[#94a3b8]">{d.label}</p>
                      <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{d.outcome}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Next actions */}
              <Card className="p-5">
                <p className="text-[9px] text-amber-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />Next actions — week of Jun 30
                </p>
                <div className="space-y-2">
                  {fridayBrief.nextActions.map((a,i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[#1E1E2E]/50 last:border-0">
                      <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded whitespace-nowrap">{a.urgency}</span>
                      <p className="text-xs text-[#F1F5F9] flex-1">{a.action}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Avatar initials={a.owner === "CEO" ? "YO" : a.owner.split(" ").map(n=>n[0]).join("")} />
                        <span className="text-[10px] text-[#64748B]">{a.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Budget sidebar */}
            <div className="col-span-4 space-y-4">
              <Card className="p-4">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-3">Weekly Budget</p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="font-mono text-2xl font-bold text-[#F1F5F9]">${fridayBrief.budgetSpent}</span>
                  <span className="font-mono text-sm text-[#64748B] mb-1">/ ${fridayBrief.budgetLimit}</span>
                </div>
                <div className="h-2 bg-[#1E1E2E] rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(fridayBrief.budgetSpent/fridayBrief.budgetLimit)*100}%` }} />
                </div>
                <div className="space-y-2">
                  {fridayBrief.budgetByAgent.map(a => (
                    <div key={a.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-[#94a3b8]">{a.name}</span>
                        <span className={cx("font-mono text-[10px] font-semibold", a.spent/a.limit>0.85?"text-red-400":a.spent/a.limit>0.6?"text-amber-400":"text-[#94a3b8]")}>${a.spent}<span className="text-[#64748B]">/{a.limit}</span></span>
                      </div>
                      <div className="h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${(a.spent/a.limit)*100}%`, backgroundColor: a.spent/a.limit>0.85?"#EF4444":a.spent/a.limit>0.6?"#F59E0B":a.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-3">Week at a Glance</p>
                {[
                  { label: "Tasks completed", value: "24", color: "text-emerald-400" },
                  { label: "Autonomous",       value: "19", color: "text-indigo-400" },
                  { label: "Escalated to CEO", value: "5",  color: "text-amber-400" },
                  { label: "Auto-resolved",    value: "7",  color: "text-emerald-400" },
                  { label: "Agent actions",    value: "148",color: "text-[#F1F5F9]" },
                  { label: "Total tokens used",value: "2.4M",color:"text-[#F1F5F9]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#1E1E2E]/60 last:border-0">
                    <span className="text-[10px] text-[#64748B]">{label}</span>
                    <span className={cx("font-mono text-[11px] font-semibold", color)}>{value}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mobile Screens (390px) ───────────────────────────────────────────────────

function PhoneFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center gap-4 flex-shrink-0">
      <p className="text-xs font-mono font-semibold text-[#64748B] uppercase tracking-widest">{title}</p>
      <div className="relative rounded-[44px] overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.15)]" style={{ width: 390, height: 780, background: "#0A0A0F", border: "3px solid #1E1E2E" }}>
        {/* Status bar */}
        <div className="h-11 bg-[#0D0D14] flex items-center justify-between px-7 flex-shrink-0 border-b border-[#1E1E2E]/50">
          <span className="text-[11px] font-mono font-semibold text-[#F1F5F9]">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#64748B]">●●●</span>
            <span className="text-[10px] font-mono text-[#64748B]">WiFi</span>
            <span className="text-[10px] font-mono text-[#F1F5F9]">100%</span>
          </div>
        </div>
        <div className="overflow-y-auto" style={{ height: 733 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileDashboard() {
  return (
    <div className="bg-[#0A0A0F] p-4 space-y-4">
      {/* Mobile header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[10px] text-[#64748B] font-mono">Mon Jun 29</p>
          <h1 className="text-base font-bold text-[#F1F5F9]">AI Chief of Staff</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4.5 h-4.5 text-[#64748B]" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </div>
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-mono text-[10px] font-bold text-white">YO</div>
        </div>
      </div>

      {/* Agent status pill */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#10B981]" />
        <span className="text-[11px] font-semibold text-emerald-400">5 agents active · 24 actions today</span>
      </div>

      {/* Stat grid 2×2 */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: "Open Tasks", value: "47", accent: "text-[#F1F5F9]", sub: "+3 today" },
          { label: "Decisions", value: "3", accent: "text-amber-400", sub: "Need CEO" },
          { label: "Blocked", value: "2", accent: "text-red-400", sub: "Agent stalls" },
          { label: "Cost Today", value: "$24.80", accent: "text-emerald-400", sub: "of $200" },
        ].map(({ label, value, accent, sub }) => (
          <div key={label} className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-4">
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2">{label}</p>
            <p className={cx("font-mono text-xl font-bold", accent)}>{value}</p>
            <p className="text-[9px] text-[#64748B] font-mono mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Top 3 priorities — list */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1E1E2E] flex items-center justify-between">
          <p className="text-[11px] font-semibold text-[#F1F5F9]">Top Priorities</p>
          <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
        </div>
        {[
          { id: "T-0091", label: "Q3 budget reconciliation", priority: "critical" as Priority, status: "blocked" as TaskStatus, due: "Today" },
          { id: "T-0088", label: "Series B term sheet redlines", priority: "critical" as Priority, status: "in-progress" as TaskStatus, due: "Today" },
          { id: "T-0085", label: "Board deck v3 — narrative pass", priority: "high" as Priority, status: "in-progress" as TaskStatus, due: "Jun 30" },
        ].map((t, i) => {
          const ss = statusStyle(t.status);
          return (
            <div key={t.id} className={cx("flex items-center gap-3 px-4 py-3", i < 2 && "border-b border-[#1E1E2E]/60")}>
              <PriorityDot priority={t.priority} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#F1F5F9] truncate">{t.label}</p>
                <p className={cx("text-[9px] font-mono", ss.text)}>{ss.label}</p>
              </div>
              <span className={cx("text-[9px] font-mono flex-shrink-0", t.due==="Today"?"text-amber-400":"text-[#64748B]")}>{t.due}</span>
            </div>
          );
        })}
      </div>

      {/* Risk chips — horizontal scroll */}
      <div>
        <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-2">Active Risks</p>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {risks.slice(0,4).map(r => (
            <div key={r.id} className={cx("flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border", riskStyle(r.level))}>
              <span className="text-[9px] font-mono font-bold whitespace-nowrap">{r.id}</span>
              <span className="text-[9px] text-[#94a3b8] max-w-[120px] truncate">{r.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI digest — compact */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1E1E2E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <p className="text-[11px] font-semibold text-[#F1F5F9]">AI Digest</p>
          </div>
          <Badge className="bg-indigo-500/10 text-indigo-400">Live</Badge>
        </div>
        {aiDigest.slice(0,3).map((item, i) => (
          <div key={i} className={cx("flex gap-2.5 px-4 py-3", i < 2 && "border-b border-[#1E1E2E]/60")}>
            <span className="text-sm flex-shrink-0">{item.icon}</span>
            <div>
              <p className="text-[10px] text-[#F1F5F9] leading-snug line-clamp-2">{item.text}</p>
              <p className="text-[9px] font-mono text-[#64748B] mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileDecisionDesk() {
  const [chosen, setChosen] = useState<string>("A");
  const [approved, setApproved] = useState(false);
  const packet = decisionPackets[0];

  return (
    <div className="bg-[#0A0A0F] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[10px] text-[#64748B] font-mono">Decision Desk</p>
          <h1 className="text-base font-bold text-[#F1F5F9]">Needs Your Call</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          3 pending
        </span>
      </div>

      {/* Approved state */}
      {approved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
          <p className="text-[11px] text-emerald-400 font-semibold">Option A approved — CS Agent sending follow-up now.</p>
        </div>
      )}

      {/* Decision card */}
      <div className={cx("bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden", approved && "opacity-60")}>
        {/* Card header */}
        <div className="px-4 py-3 border-b border-[#1E1E2E] bg-[#0D0D14] flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] text-[#64748B]">{packet.id}</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1 h-1 rounded-full bg-amber-400" />MEDIUM RISK
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
            <Unlock className="w-2 h-2" />Reversible
          </span>
        </div>

        <div className="p-4 space-y-3">
          {/* Question */}
          <div>
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-1">Decision</p>
            <p className="text-[13px] font-semibold text-[#F1F5F9] leading-snug">{packet.question}</p>
          </div>

          {/* Context — collapsed summary */}
          <div className="px-3 py-2 bg-[#0D0D14] rounded-xl border border-[#1E1E2E]">
            <p className="text-[10px] text-[#94a3b8] line-clamp-2">{packet.context}</p>
          </div>

          {/* Options — full width tappable cards */}
          <div className="space-y-2">
            {packet.options.map(opt => (
              <button key={opt.key} onClick={() => setChosen(opt.key)} className={cx("w-full text-left p-3 rounded-xl border transition-all", chosen===opt.key ? "border-indigo-500/50 bg-indigo-600/10" : opt.recommended ? "border-indigo-500/20 bg-indigo-500/4" : "border-[#1E1E2E] bg-[#0D0D14]")}>
                <div className="flex items-start gap-2.5">
                  <span className={cx("w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0", chosen===opt.key?"bg-indigo-600 text-white":opt.recommended?"bg-indigo-500/20 text-indigo-400":"bg-[#1E1E2E] text-[#64748B]")}>{opt.key}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-[11px] font-semibold text-[#F1F5F9]">{opt.label}</p>
                      {opt.recommended && <span className="text-[8px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded">AI Rec</span>}
                    </div>
                    <p className="text-[10px] text-red-400/70">↓ Risk {opt.riskPct}%</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-600/8 border border-indigo-500/15 rounded-xl">
            <ConfidenceArc pct={packet.confidence} color="#6366F1" />
            <div>
              <p className="text-[10px] font-semibold text-indigo-300">AI recommends Option A</p>
              <p className="text-[9px] text-[#64748B]">{packet.rationale}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button onClick={() => setApproved(true)} className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
              <PlayCircle className="w-3.5 h-3.5" />Approve {chosen}
            </button>
            <button className="flex-1 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5">
              Override
            </button>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-[#1E1E2E] text-[#94a3b8] text-xs font-semibold flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5" />Delegate
          </button>
        </div>
      </div>

      {/* Queue of remaining decisions */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#1E1E2E]">
          <p className="text-[10px] font-semibold text-[#64748B]">Also pending</p>
        </div>
        {decisionPackets.slice(1).map((p, i) => (
          <div key={p.id} className={cx("flex items-center gap-2.5 px-4 py-3", i===0 && "border-b border-[#1E1E2E]/60")}>
            <span className="font-mono text-[9px] text-[#64748B]">{p.id}</span>
            <p className="text-[10px] text-[#94a3b8] flex-1 truncate">{p.question}</p>
            <RiskChip level={p.risk} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MobilePreviewView() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#F1F5F9] tracking-tight">Mobile Preview</h1>
        <p className="text-xs text-[#64748B] font-mono mt-0.5">390px · iOS · Dark command-center feel · Tap-optimized</p>
      </div>
      <div className="flex items-start justify-center gap-12 overflow-x-auto pb-6">
        <PhoneFrame title="Screen M1 — Dashboard Home">
          <MobileDashboard />
        </PhoneFrame>
        <PhoneFrame title="Screen M2 — Decision Desk">
          <MobileDecisionDesk />
        </PhoneFrame>
      </div>
    </div>
  );
}

// ─── Design System View ───────────────────────────────────────────────────────

const TOKEN_COLORS = [
  { name: "Background", hex: "#0A0A0F", token: "--background", use: "Page ground" },
  { name: "Surface", hex: "#111118", token: "--card", use: "Cards, panels" },
  { name: "Border", hex: "#1E1E2E", token: "--border", use: "Hairline rules" },
  { name: "Accent", hex: "#6366F1", token: "--primary", use: "CTAs, active states" },
  { name: "Accent Warm", hex: "#F59E0B", token: "--accent-warm", use: "Warnings, decisions" },
  { name: "Success", hex: "#10B981", token: "--success", use: "Positive states" },
  { name: "Danger", hex: "#EF4444", token: "--destructive", use: "Errors, kills" },
  { name: "Text Primary", hex: "#F1F5F9", token: "--foreground", use: "Body copy, headings" },
  { name: "Text Muted", hex: "#64748B", token: "--muted-foreground", use: "Labels, captions" },
];

const SCREENS_INDEX = [
  { num: 1, name: "CEO Dashboard", view: "ceo-dashboard" as View, desc: "Priorities, workstreams, blocker lane" },
  { num: 2, name: "AI Org Chart", view: "org-chart" as View, desc: "Employee hierarchy, agent detail" },
  { num: 3, name: "Decision Desk", view: "decision-desk" as View, desc: "Decision packets, AI confidence" },
  { num: 4, name: "Friction Resolver", view: "friction-resolver" as View, desc: "Cross-agent conflict mediation" },
  { num: 5, name: "Operating Brain", view: "operating-brain" as View, desc: "Raw input → structured brief" },
  { num: 6, name: "Safety & Cost", view: "safety-control" as View, desc: "Autonomy ladders, kill switches" },
  { num: 7, name: "Accountability", view: "accountability" as View, desc: "Evidence drawer, scorecards, brief" },
  { num: "M1", name: "Mobile Dashboard", view: "mobile-preview" as View, desc: "390px stacked cards + digest" },
  { num: "M2", name: "Mobile Decisions", view: "mobile-preview" as View, desc: "390px tap-optimized packet" },
];

const PROTOTYPE_FLOWS = [
  { from: "CEO Dashboard", to: "Decision Desk", trigger: "Tap 'Decide' blocker chip", arrow: "→" },
  { from: "Decision Desk", to: "Approved State", trigger: "Tap 'Approve A'", arrow: "→" },
  { from: "Task Queue", to: "Evidence Drawer", trigger: "Click completed task row", arrow: "→" },
  { from: "Operating Brain", to: "CEO Dashboard", trigger: "Tap 'Approve & Activate'", arrow: "→" },
  { from: "Org Chart", to: "Safety & Cost", trigger: "Tap 'Adjust Autonomy'", arrow: "→" },
  { from: "All screens", to: "Any screen", trigger: "Sidebar navigation", arrow: "↔" },
];

function DesignSystemView({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [dsTab, setDsTab] = useState<"tokens" | "components" | "screens" | "prototype">("tokens");

  return (
    <div className="p-6 h-full overflow-y-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F1F5F9] tracking-tight">Design System</h1>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">Tokens · Components · Screen Index · Prototype Flows</p>
        </div>
        <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">AI Chief of Staff v1.0</Badge>
      </div>

      <div className="flex items-center gap-1 p-1 bg-[#111118] border border-[#1E1E2E] rounded-xl w-fit">
        {(["tokens","components","screens","prototype"] as const).map(t => (
          <button key={t} onClick={() => setDsTab(t)} className={cx("px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors", dsTab===t?"bg-[#1E1E2E] text-[#F1F5F9]":"text-[#64748B] hover:text-[#94a3b8]")}>{t}</button>
        ))}
      </div>

      {/* ── Tokens ── */}
      {dsTab === "tokens" && (
        <div className="space-y-5">
          <Card className="p-5">
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-4">Color Tokens</p>
            <div className="grid grid-cols-3 gap-3">
              {TOKEN_COLORS.map(c => (
                <div key={c.name} className="flex items-center gap-3 p-3 bg-[#0D0D14] border border-[#1E1E2E] rounded-xl hover:border-[#2A2A3E] transition-colors">
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 border border-white/10" style={{ backgroundColor: c.hex }} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#F1F5F9]">{c.name}</p>
                    <p className="font-mono text-[9px] text-[#64748B]">{c.hex}</p>
                    <p className="font-mono text-[9px] text-indigo-400/70 truncate">{c.token}</p>
                    <p className="text-[9px] text-[#64748B]">{c.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-3">Typography</p>
              <div className="space-y-3">
                {[
                  { label: "Display", sample: "AI Chief of Staff", className: "text-2xl font-extrabold text-[#F1F5F9]", spec: "Inter 800 · 24px" },
                  { label: "Heading", sample: "Decision Desk", className: "text-lg font-bold text-[#F1F5F9]", spec: "Inter 700 · 18px" },
                  { label: "Body", sample: "Analyzing Q2 cashflow variance", className: "text-sm text-[#94a3b8]", spec: "Inter 400 · 14px" },
                  { label: "Mono", sample: "T-0091 · $24.80 · 94%", className: "font-mono text-sm text-indigo-400", spec: "JetBrains Mono 500" },
                  { label: "Label", sample: "CRITICAL RISK", className: "font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-widest", spec: "Mono 700 · 10px" },
                ].map(({ label, sample, className, spec }) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-2 border-b border-[#1E1E2E]/60 last:border-0">
                    <div>
                      <p className="text-[9px] text-[#64748B] font-mono mb-1">{label} · {spec}</p>
                      <span className={className}>{sample}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-3">Spacing & Radius</p>
              <div className="space-y-2">
                {[
                  { label: "Page padding", value: "24px", sample: "p-6" },
                  { label: "Card radius", value: "16px", sample: "rounded-2xl" },
                  { label: "Button radius", value: "12px", sample: "rounded-xl" },
                  { label: "Badge radius", value: "6px", sample: "rounded-md" },
                  { label: "Border width", value: "1px", sample: "border" },
                  { label: "Grid columns", value: "12 col", sample: "grid-cols-12" },
                  { label: "Card gap", value: "16px", sample: "gap-4" },
                  { label: "Section gap", value: "20px", sample: "gap-5" },
                ].map(({ label, value, sample }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#1E1E2E]/60 last:border-0">
                    <span className="text-[10px] text-[#94a3b8]">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold text-[#F1F5F9]">{value}</span>
                      <Badge className="bg-[#1E1E2E] text-[#64748B]">{sample}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Components ── */}
      {dsTab === "components" && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-4">Buttons</p>
            <div className="flex flex-wrap gap-3">
              <PrimaryBtn icon={<Plus className="w-3 h-3" />}>Primary Button</PrimaryBtn>
              <SecondaryBtn>Secondary Button</SecondaryBtn>
              <DangerBtn>Danger Button</DangerBtn>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">Success</button>
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-4">Badges & Chips</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Indigo Badge</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Success</Badge>
              <Badge className="bg-red-500/10 text-red-400 border border-red-500/20">Danger</Badge>
              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">Warning</Badge>
              <Badge className="bg-[#1E1E2E] text-[#64748B]">Neutral</Badge>
              <RiskChip level="critical" />
              <RiskChip level="high" />
              <RiskChip level="medium" />
              <RiskChip level="low" />
              <PriorityDot priority="critical" />
              <PriorityDot priority="high" />
              <PriorityDot priority="medium" />
              <PriorityDot priority="low" />
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-4">Toggles & Sliders</p>
              <div className="space-y-4">
                {[true, false].map(v => {
                  const [on, setOn] = useState(v);
                  return (
                    <div key={String(v)} className="flex items-center gap-3">
                      <Toggle checked={on} onChange={setOn} />
                      <span className="text-xs text-[#94a3b8]">{on ? "Enabled" : "Disabled"}</span>
                    </div>
                  );
                })}
                <div>
                  <p className="text-[10px] text-[#64748B] mb-1.5">Slider</p>
                  {(() => { const [v, setV] = useState(65); return <Slider value={v} onChange={setV} />; })()}
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-4">Avatars & Mono Metrics</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {["YO","FA","LA","CS","MA","OA"].map(i => <Avatar key={i} initials={i} size="md" />)}
                {["YO","FA","LA","CS"].map(i => <Avatar key={i+"sm"} initials={i} />)}
              </div>
              <div className="space-y-2">
                <MonoMetric value="$24.80" label="Cost today" trend="+12%" trendDir="up" />
                <MonoMetric value="94%" label="Confidence" trend="-3%" trendDir="down" />
              </div>
            </Card>
          </div>
          <Card className="p-5">
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-4">Empty States</p>
            <div className="grid grid-cols-2 gap-4">
              <EmptyState icon={<CheckSquare className="w-5 h-5" />} title="No tasks found" body="Adjust filters to see tasks." />
              <EmptyState icon={<Shield className="w-5 h-5" />} title="No conflicts" body="All agents operating normally." />
            </div>
          </Card>
        </div>
      )}

      {/* ── Screens Index ── */}
      {dsTab === "screens" && (
        <div className="grid grid-cols-3 gap-4">
          {SCREENS_INDEX.map(s => (
            <button key={String(s.num)} onClick={() => onNavigate(s.view)} className="text-left p-5 bg-[#111118] border border-[#1E1E2E] hover:border-indigo-500/40 rounded-2xl transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-2xl font-bold text-indigo-400 opacity-40 group-hover:opacity-70 transition-opacity">{s.num}</span>
                <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-indigo-400 transition-colors" />
              </div>
              <p className="text-sm font-bold text-[#F1F5F9] mb-1">{s.name}</p>
              <p className="text-[10px] text-[#64748B]">{s.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* ── Prototype Flows ── */}
      {dsTab === "prototype" && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-4">Prototype Link Map</p>
            <div className="space-y-2">
              {PROTOTYPE_FLOWS.map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-[#0D0D14] border border-[#1E1E2E] rounded-xl hover:border-[#2A2A3E] transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs font-semibold text-[#F1F5F9] bg-[#1E1E2E] px-2.5 py-1 rounded-lg whitespace-nowrap">{f.from}</span>
                    <span className="font-mono text-sm text-indigo-400">{f.arrow}</span>
                    <span className="text-xs font-semibold text-[#F1F5F9] bg-[#1E1E2E] px-2.5 py-1 rounded-lg whitespace-nowrap">{f.to}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span className="text-[10px] text-[#94a3b8]">{f.trigger}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Flow diagram */}
          <Card className="p-5">
            <p className="text-[9px] text-[#64748B] uppercase tracking-widest font-mono mb-4">Flow Diagram — Desktop Screens</p>
            <svg width="100%" viewBox="0 0 900 260" style={{ maxHeight: 260 }}>
              {/* Screen boxes */}
              {[
                { label: "S1\nCEO Dashboard", x: 30,  y: 100 },
                { label: "S2\nOrg Chart",     x: 150, y: 20  },
                { label: "S3\nDecision Desk", x: 270, y: 100 },
                { label: "S4\nFriction",      x: 420, y: 20  },
                { label: "S5\nOp Brain",      x: 540, y: 100 },
                { label: "S6\nSafety",        x: 690, y: 20  },
                { label: "S7\nAccountability",x: 780, y: 100 },
              ].map(({ label, x, y }) => (
                <g key={label} transform={`translate(${x},${y})`}>
                  <rect width={90} height={44} rx={10} fill="#111118" stroke="#1E1E2E" strokeWidth={1} />
                  {label.split('\n').map((line, li) => (
                    <text key={li} x={45} y={li===0?16:30} textAnchor="middle" fill={li===0?"#6366F1":"#94a3b8"} fontSize={li===0?9:9} fontFamily="JetBrains Mono, monospace" fontWeight={li===0?700:400}>{line}</text>
                  ))}
                </g>
              ))}
              {/* Arrows */}
              {[
                { x1:120,y1:122, x2:270,y2:122, label:"Decide" },
                { x1:360,y1:122, x2:540,y2:122, label:"Brief" },
                { x1:630,y1:122, x2:780,y2:122, label:"Evidence" },
                { x1:75,y1:100,  x2:195,y2:64,  label:"" },
                { x1:315,y1:100, x2:465,y2:64,  label:"" },
                { x1:735,y1:100, x2:735,y2:64,  label:"" },
              ].map((a, i) => (
                <g key={i}>
                  <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke="#2A2A3E" strokeWidth={1} markerEnd="url(#arrGray)" />
                  {a.label && <text x={(a.x1+a.x2)/2} y={(a.y1+a.y2)/2-5} textAnchor="middle" fill="#64748B" fontSize={8} fontFamily="JetBrains Mono, monospace">{a.label}</text>}
                </g>
              ))}
              <defs>
                <marker id="arrGray" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 Z" fill="#2A2A3E" />
                </marker>
              </defs>
              {/* Nav bar label */}
              <rect x={0} y={200} width={880} height={24} rx={6} fill="#111118" stroke="#1E1E2E" strokeWidth={1} />
              <text x={440} y={216} textAnchor="middle" fill="#64748B" fontSize={9} fontFamily="JetBrains Mono, monospace">← Sidebar navigation connects all screens bidirectionally →</text>
            </svg>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("ceo-dashboard");

  const views: Record<View, React.ReactNode> = {
    "ceo-dashboard": <CEODashboardView />,
    "org-chart": <OrgChartView />,
    "decision-desk": <DecisionDeskView />,
    "friction-resolver": <FrictionResolverView />,
    "operating-brain": <OperatingBrainView />,
    "safety-control": <SafetyControlView />,
    "accountability": <AccountabilityView />,
    "mobile-preview": <MobilePreviewView />,
    "design-system": <DesignSystemView onNavigate={setView} />,
    dashboard: <DashboardView />,
    tasks: <TasksView />,
    projects: <ProjectsView />,
    people: <PeopleView />,
    calendar: <CalendarView />,
    comms: <CommsView />,
    intelligence: <IntelligenceView />,
    settings: <SettingsView />,
  };

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-[#0A0A0F] text-[#F1F5F9]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", minWidth: 1200 }}
    >
      <Sidebar view={view} setView={setView} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar view={view} />
        <main className="flex-1 overflow-hidden">
          {views[view]}
        </main>
      </div>
    </div>
  );
}
