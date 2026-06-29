import { Cpu, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems, type NavId, type NavBadge } from "@/lib/navigation"

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
  return (
    <aside className="flex h-full w-[232px] flex-shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Cpu className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight text-foreground">AI Chief of Staff</p>
          <p className="font-mono text-[10px] text-muted-foreground">v2.4.1 · production</p>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4" aria-label="Primary">
        <p className="mb-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Operating Surface
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
                "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors",
                isActive
                  ? "border border-primary/25 bg-primary/15 text-primary"
                  : "border border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
                aria-hidden="true"
              />
              <span className="truncate">{label}</span>
              {badge && (
                <span
                  className={cn(
                    "ml-auto rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                    badgeTone[badge.tone],
                  )}
                >
                  {badge.label}
                </span>
              )}
              {statusDot && (
                <span className={cn("ml-auto h-1.5 w-1.5 rounded-full", dotTone[statusDot])} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3">
        <button
          type="button"
          className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Settings className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Settings
        </button>
        <div className="mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-bold text-primary-foreground">
            AV
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">Alex Vance</p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">CEO · Northwind</p>
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
