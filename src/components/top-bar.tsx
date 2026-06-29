import { Search, Command, Bell, RefreshCw } from "lucide-react"

interface TopBarProps {
  pageTitle?: string
}

export function TopBar({ pageTitle = "Clarity Dashboard" }: TopBarProps) {
  const today = new Date()
  const formatted = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <header className="flex h-12 flex-shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-5">
      {/* Left: date + page title */}
      <div className="flex items-center gap-2 min-w-0">
        {/* <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{formatted}</span>
        <span className="text-muted-foreground/50 text-xs">·</span> */}
      </div>

      {/* Right: search + actions + status */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search tasks, people, doc"
            aria-label="Search"
            className="w-52 rounded-lg border border-border bg-card py-1.5 pl-8 pr-8 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground">
            <Command className="h-2.5 w-2.5" aria-hidden="true" />K
          </span>
        </div>

        <button
          type="button"
          aria-label="Refresh"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#EF4444] shadow-[0_0_4px_#EF4444]" />
        </button>

        <span className="flex items-center gap-1.5 rounded-md border border-[#10B981]/20 bg-[#10B981]/10 px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
          <span className="font-mono text-[10px] font-semibold text-[#10B981]">All systems nominal</span>
        </span>
      </div>
    </header>
  )
}
