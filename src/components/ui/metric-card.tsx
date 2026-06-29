import * as React from "react"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Trend = "up" | "down" | "neutral"

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
  /** Supporting caption shown under the value. */
  caption?: string
  /** Optional change indicator, e.g. "+3" or "18%". */
  delta?: string
  /** Direction of the delta. `up` is rendered as positive (success). */
  trend?: Trend
  /** Treat a downward trend as the positive outcome (e.g. cost, blockers). */
  invertTrend?: boolean
  icon?: LucideIcon
  /** Override the value color, e.g. "text-[#F59E0B]" for warning metrics. */
  valueClassName?: string
}

const trendIcon: Record<Trend, LucideIcon | null> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: null,
}

export function MetricCard({
  label,
  value,
  caption,
  delta,
  trend = "neutral",
  invertTrend = false,
  icon: Icon,
  valueClassName,
  className,
  ...props
}: MetricCardProps) {
  const positive = invertTrend ? trend === "down" : trend === "up"
  const TrendIcon = trendIcon[trend]

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card px-5 py-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "font-mono text-2xl font-semibold tracking-tight text-foreground",
              valueClassName,
            )}
          >
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                "flex items-center gap-0.5 font-mono text-[11px] font-semibold",
                trend === "neutral"
                  ? "text-muted-foreground"
                  : positive
                    ? "text-[#10B981]"
                    : "text-[#EF4444]",
              )}
            >
              {TrendIcon && <TrendIcon className="h-3 w-3" aria-hidden="true" />}
              {delta}
            </span>
          )}
        </div>
        {caption && (
          <p className="font-mono text-[11px] text-muted-foreground">{caption}</p>
        )}
      </div>
    </div>
  )
}
