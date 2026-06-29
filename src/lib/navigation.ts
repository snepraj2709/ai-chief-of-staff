import {
  LayoutDashboard,
  Cpu,
  GitBranch,
  Waypoints,
  Brain,
  ShieldCheck,
  FileCheck2,
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
    label: "CEO Dashboard",
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
]

export const DEFAULT_NAV_ID: NavId = "dashboard"

export function getNavItem(id: NavId): NavItem {
  return navItems.find((item) => item.id === id) ?? navItems[0]
}
