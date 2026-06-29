import { Cpu, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems, type NavId, type NavBadge } from "@/lib/navigation"
import { Switch } from "@/app/components/ui/switch"
import { useState } from "react"

interface SidebarProps {
  activeId: NavId
  onNavigate: (id: NavId) => void
}

const badgeTone: Record<NavBadge["tone"], string> = {
  primary: "bg-primary/15 text-primary",
  warning: "bg-[#F59E0B]/15 text-[#F59E0B]",
  danger: "bg-[#EF4444]/15 text-[#EF4444]",
  neutral: "bg-secondary text-muted-foreground",
}

const dotTone = {
  warning: "bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]",
  danger: "bg-[#EF4444] shadow-[0_0_6px_#EF4444]",
}

export function Sidebar({ activeId, onNavigate }: SidebarProps) {
  const [agentEnabled, setAgentEnabled] = useState(true)

  return (
    <aside className="flex h-full w-[216px] flex-shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex h-12 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-[0_0_18px_rgba(99,102,241,0.35)]">
          <Cpu className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold leading-tight text-foreground">AI Chief of Staff</p>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-2 pb-2 pt-2" aria-label="Primary">
        <p className="mb-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </p>
        {navItems.map(({ id, label, icon: Icon, badge, statusDot }) => {
          const isActive = id === activeId
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex w-full items-center gap-2.5 rounded-[18px] border px-2.5 py-1.5 text-left text-[12px] font-semibold transition-colors",
                isActive
                  ? "border-primary/30 bg-primary/18 text-primary"
                  : "border-transparent text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5 flex-shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
                aria-hidden="true"
              />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none",
                    badgeTone[badge.tone],
                  )}
                >
                  {badge.label}
                </span>
              )}
              {statusDot && (
                <span className={cn("h-1.5 w-1.5 rounded-full", dotTone[statusDot])} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-2.5">
        {/* AI Agent toggle */}
        <div className="mb-2 flex items-center justify-between rounded-md px-1 py-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
            <span className="text-[11px] font-semibold text-foreground">AI Agent</span>
          </div>
          <Switch
            checked={agentEnabled}
            onCheckedChange={setAgentEnabled}
            aria-label="Toggle AI Agent"
          />
        </div>
        <p className="mb-3 px-1 font-mono text-[10px] text-muted-foreground">
          24 actions taken today
        </p>

        {/* User row */}
        <div className="flex items-center gap-2 rounded-md px-1 py-1">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F59E0B] font-mono text-[10px] font-bold text-black">
            YO
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-foreground">You (Owner)</p>
            <p className="truncate font-mono text-[10px] text-muted-foreground"> Ops workspace</p>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  )
}
