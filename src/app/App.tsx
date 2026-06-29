import { AppShell } from "@/components/app-shell"
import { DashboardView } from "@/components/pages/dashboard-view"
import { AgentsView } from "@/components/pages/agents-view"
import { DecisionsView } from "@/components/pages/decisions-view"
import { FrictionView } from "@/components/pages/friction-view"
import { OperatingBrainView } from "@/components/pages/operating-brain-view"
import { SafetyView } from "@/components/pages/safety-view"
import { EvidenceView } from "@/components/pages/evidence-view"
import type { NavId } from "@/lib/navigation"
import type { ReactNode } from "react"

const pages: Partial<Record<NavId, ReactNode>> = {
  dashboard: <DashboardView />,
  "ai-employees": <AgentsView />,
  decisions: <DecisionsView />,
  friction: <FrictionView />,
  "operating-brain": <OperatingBrainView />,
  safety: <SafetyView />,
  evidence: <EvidenceView />,
}

export default function App() {
  return <AppShell pages={pages} initialView="dashboard" />
}
