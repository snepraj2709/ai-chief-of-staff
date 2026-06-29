import { useState, type ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { Breadcrumb } from "@/components/breadcrumb"
import { getNavItem, DEFAULT_NAV_ID, type NavId } from "@/lib/navigation"

interface AppShellProps {
  /** Map of nav id to the content rendered in the main area. */
  pages: Partial<Record<NavId, ReactNode>>
  initialView?: NavId
  onMorningBrief?: () => void
  onNewInput?: () => void
}

export function AppShell({
  pages,
  initialView = DEFAULT_NAV_ID,
  onMorningBrief,
  onNewInput,
}: AppShellProps) {
  const [activeId, setActiveId] = useState<NavId>(initialView)
  const active = getNavItem(activeId)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Sidebar activeId={activeId} onNavigate={setActiveId} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar onMorningBrief={onMorningBrief} onNewInput={onNewInput} />

        <main className="flex-1 overflow-y-auto">
          {/* Content header */}
          <div className="border-b border-border bg-background/80 px-8 py-5 backdrop-blur">
            <Breadcrumb
              className="mb-2"
              items={[
                { label: "Workspace" },
                { label: active.label },
              ]}
            />
            <h1 className="text-xl font-bold tracking-tight text-balance text-foreground">
              {active.title}
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
              {active.description}
            </p>
          </div>

          {/* Active page */}
          <div className="px-8 py-6">
            {pages[activeId] ?? <ComingSoon label={active.label} />}
          </div>
        </main>
      </div>
    </div>
  )
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
      <p className="text-sm font-semibold text-foreground">{label} module</p>
      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground text-pretty">
        This surface is part of the operating dashboard and will be wired up in a
        following step.
      </p>
    </div>
  )
}
