import {
  LayoutDashboard,
  Cpu,
  GitBranch,
  Waypoints,
  Brain,
  ShieldCheck,
  FileCheck2,
  Terminal,
  ListTodo,
  FolderOpen,
  Users,
  Calendar,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

export type NavId =
  | "dashboard"
  | "ai-employees"
  | "decisions"
  | "friction"
  | "operating-brain"
  | "safety"
  | "evidence"
  | "command-center"
  | "task-queue"
  | "projects"
  | "people"
  | "calendar"
  | "communications"
  | "ai-intelligence"

export type NavBadge = {
  label: string
  tone: "primary" | "warning" | "danger" | "neutral"
}

export type NavItem = {
  id: NavId
  label: string
  title: string
  description: string
  icon: LucideIcon
  badge?: NavBadge
  statusDot?: "warning" | "danger"
}

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "CEO Clarity Dashboard",
    description: "Today's priorities, blockers, and AI activity at a glance",
    icon: LayoutDashboard,
  },
  {
    id: "ai-employees",
    label: "AI Employees",
    title: "AI Employee Org Chart",
    description: "Autonomous agents, their mandates, and operating health",
    icon: Cpu,
    badge: { label: "1 risk", tone: "warning" },
  },
  {
    id: "decisions",
    label: "Decision Desk",
    title: "Decision Desk",
    description: "Items escalated to you for approval or direction",
    icon: GitBranch,
    badge: { label: "3", tone: "danger" },
  },
  {
    id: "friction",
    label: "Friction Resolver",
    title: "Cross-Agent Friction Resolver",
    description: "Conflicts and dependencies blocking forward progress",
    icon: Waypoints,
    badge: { label: "2", tone: "warning" },
  },
  {
    id: "operating-brain",
    label: "Operating Brain",
    title: "CEO Operating Brain",
    description: "The shared context, goals, and memory agents reason over",
    icon: Brain,
  },
  {
    id: "safety",
    label: "Safety & Cost",
    title: "Safety & Cost Control",
    description: "Autonomy limits, spend guardrails, and policy enforcement",
    icon: ShieldCheck,
    statusDot: "warning",
  },
  {
    id: "evidence",
    label: "Accountability",
    title: "Accountability & Evidence",
    description: "Audit trail of every agent action with full provenance",
    icon: FileCheck2,
  },
  {
    id: "command-center",
    label: "Command Center",
    title: "Command Center",
    description: "Direct agent instructions and execution monitoring",
    icon: Terminal,
  },
  {
    id: "task-queue",
    label: "Task Queue",
    title: "Task Queue",
    description: "All pending and in-progress tasks across agents",
    icon: ListTodo,
    badge: { label: "47", tone: "neutral" },
  },
  {
    id: "projects",
    label: "Projects",
    title: "Projects",
    description: "Long-running initiatives and project portfolios",
    icon: FolderOpen,
  },
  {
    id: "people",
    label: "People & Capacity",
    title: "People & Capacity",
    description: "Team capacity, roles, and human-AI collaboration",
    icon: Users,
  },
  {
    id: "calendar",
    label: "Calendar",
    title: "Calendar",
    description: "Scheduled agent actions and CEO time commitments",
    icon: Calendar,
  },
  {
    id: "communications",
    label: "Communications",
    title: "Communications",
    description: "Outbound communications drafted or sent by agents",
    icon: MessageCircle,
    statusDot: "danger",
  },
  {
    id: "ai-intelligence",
    label: "AI Intelligence",
    title: "AI Intelligence",
    description: "Market signals, news, and competitive intelligence",
    icon: Sparkles,
  },
]

export const DEFAULT_NAV_ID: NavId = "dashboard"

export function getNavItem(id: NavId): NavItem {
  return navItems.find((item) => item.id === id) ?? navItems[0]
}
