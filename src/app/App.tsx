import { AppShell } from "@/components/app-shell"
import { DashboardView } from "@/components/pages/dashboard-view"
import type { NavId } from "@/lib/navigation"
import type { ReactNode } from "react"

const pages: Partial<Record<NavId, ReactNode>> = {
  dashboard: <DashboardView />,
}

export default function App() {
  return <AppShell pages={pages} initialView="dashboard" />
}
