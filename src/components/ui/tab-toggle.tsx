import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

export const tabToggleListClassName =
  "inline-flex h-auto w-fit max-w-full shrink-0 items-center justify-start gap-1 overflow-x-auto rounded-full border border-[#25263A] bg-[#0B0B11] p-1.5 text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden"

export const tabToggleItemClassName =
  "inline-flex h-8 min-w-max flex-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-transparent px-3 text-xs font-medium text-muted-foreground transition-all duration-200 focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#252438] data-[state=active]:text-foreground data-[state=active]:shadow-[0_8px_22px_rgba(0,0,0,0.28)] sm:h-11 sm:px-7 sm:text-base [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export interface TabToggleOption<TValue extends string> {
  value: TValue
  label: ReactNode
  disabled?: boolean
}

interface TabToggleProps<TValue extends string>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: TValue
  options: readonly TabToggleOption<TValue>[]
  onValueChange: (value: TValue) => void
  itemClassName?: string
}

export function TabToggle<TValue extends string>({
  value,
  options,
  onValueChange,
  className,
  itemClassName,
  "aria-label": ariaLabel,
  ...props
}: TabToggleProps<TValue>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(tabToggleListClassName, className)}
      {...props}
    >
      {options.map((option) => {
        const selected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            data-state={selected ? "active" : "inactive"}
            disabled={option.disabled}
            onClick={() => onValueChange(option.value)}
            className={cn(tabToggleItemClassName, itemClassName)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
