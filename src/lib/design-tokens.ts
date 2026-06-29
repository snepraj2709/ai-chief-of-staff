/**
 * Design tokens for the AI Chief of Staff operating dashboard.
 *
 * These mirror the CSS custom properties defined in `src/styles/theme.css`.
 * Use the CSS variables / Tailwind theme classes (e.g. `bg-card`, `text-foreground`)
 * in markup. Import this object only where raw hex values are required in JS —
 * for example Recharts series colors, canvas drawing, or inline SVG fills.
 */

export const colors = {
  background: "#0A0A0F",
  surface: "#111118",
  surfaceRaised: "#16161F",
  sidebar: "#0D0D14",
  border: "#1E1E2E",
  borderStrong: "#2A2A3E",
  primary: "#6366F1",
  warning: "#F59E0B",
  success: "#10B981",
  danger: "#EF4444",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
} as const

/** Ordered palette for charts and multi-series data visualizations. */
export const chartColors = [
  colors.primary,
  colors.success,
  colors.warning,
  colors.danger,
  "#8B5CF6",
] as const

export const fonts = {
  sans: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', monospace",
} as const

export type ColorToken = keyof typeof colors
