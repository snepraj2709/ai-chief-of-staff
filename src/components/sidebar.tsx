import { Cpu, Settings, LogOut } from "lucide-react"
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
    <aside className="flex h-full w-[220px] flex-shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <Cpu className="h-3.5 w-3.5 text-primary-foreground" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight text-foreground">AI Chief of Staff</p>
          <p className="font-mono text-[10px] text-muted-foreground">v2.4.1 · prod</p>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-2 pb-2" aria-label="Primary">
        <p className="mb-1 mt-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
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
                "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-[15px] w-[15px] flex-shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
                aria-hidden="true"
              />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
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

        {/* System section */}
        <p className="mb-1 mt-3 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          System
        </p>
        <button
          type="button"
          className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Settings className="h-[15px] w-[15px] flex-shrink-0" aria-hidden="true" />
          <span className="truncate">Settings</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3">
        {/* AI Agent toggle */}
        <div className="mb-2 flex items-center justify-between rounded-md px-1 py-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
            <span className="text-xs font-semibold text-foreground">AI Agent</span>
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
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#F59E0B] font-mono text-[11px] font-bold text-black">
            YO
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">You (Owner)</p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">CEO · Ops workspace</p>
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
