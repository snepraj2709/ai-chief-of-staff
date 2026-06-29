import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md font-mono font-semibold uppercase tracking-wider whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-secondary text-muted-foreground border border-border",
        primary: "bg-primary/10 text-primary border border-primary/25",
        success: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25",
        warning: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25",
        danger: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/25",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-0.5 text-[11px]",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "sm",
    },
  },
)

const dotColor: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-[#10B981]",
  warning: "bg-[#F59E0B]",
  danger: "bg-[#EF4444]",
}

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  /** Show a leading status dot. */
  dot?: boolean
}

export function StatusBadge({
  className,
  tone,
  size,
  dot = false,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ tone, size }), className)} {...props}>
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[tone ?? "neutral"])} />
      )}
      {children}
    </span>
  )
}

export { statusBadgeVariants }
