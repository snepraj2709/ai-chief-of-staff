import { useState, type ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { getNavItem, DEFAULT_NAV_ID, type NavId } from "@/lib/navigation"

interface AppShellProps {
  pages: Partial<Record<NavId, ReactNode>>
  initialView?: NavId
}

export function AppShell({
  pages,
  initialView = DEFAULT_NAV_ID,
}: AppShellProps) {
  const [activeId, setActiveId] = useState<NavId>(initialView)
  const active = getNavItem(activeId)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Sidebar activeId={activeId} onNavigate={setActiveId} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar pageTitle={active.title} />

        <main className="flex-1 overflow-y-auto">
          {pages[activeId] ?? <ComingSoon label={active.label} />}
        </main>
      </div>
    </div>
  )
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card m-8 py-20 text-center">
      <p className="text-sm font-semibold text-foreground">{label} module</p>
      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground text-pretty">
        This surface is part of the operating dashboard and will be wired up in a
        following step.
      </p>
    </div>
  )
}
