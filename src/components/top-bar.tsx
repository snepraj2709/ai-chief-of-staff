import { Search, Command, Bell, Zap, Plus } from "lucide-react"

interface TopBarProps {
  onMorningBrief?: () => void
  onNewInput?: () => void
}

export function TopBar({ onMorningBrief, onNewInput }: TopBarProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-6">
      {/* Product identity */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold tracking-tight text-foreground">AI Chief of Staff</span>
        <span className="hidden items-center gap-1.5 rounded-md border border-[#10B981]/20 bg-[#10B981]/10 px-2 py-0.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
          <span className="font-mono text-[10px] font-semibold text-[#10B981]">All systems nominal</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search agents, decisions, evidence…"
            aria-label="Search"
            className="w-64 rounded-lg border border-border bg-card py-1.5 pl-8 pr-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 font-mono text-[10px] text-muted-foreground lg:flex">
            <Command className="h-2.5 w-2.5" aria-hidden="true" />K
          </span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#EF4444] shadow-[0_0_4px_#EF4444]" />
        </button>

        <button
          type="button"
          onClick={onMorningBrief}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
        >
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          Morning Brief
        </button>

        <button
          type="button"
          onClick={onNewInput}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          New Input
        </button>
      </div>
    </header>
  )
}
