import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5", className)}>
      <ol className="flex items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const interactive = !isLast && (item.href || item.onClick)

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {interactive ? (
                <a
                  href={item.href ?? "#"}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault()
                      item.onClick()
                    }
                  }}
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "text-xs font-medium",
                    isLast ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="h-3 w-3 text-border" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
