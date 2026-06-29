import { useState } from "react"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"

export function FrictionView() {
  const [resolved, setResolved] = useState([false, false])

  const resolve = (i: number) =>
    setResolved((prev) => prev.map((v, idx) => (idx === i ? true : v)))

  return (
    <div className="p-6 text-[var(--foreground)] space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Active Friction</h2>
          <Badge variant="destructive" className="ml-2">2 conflicts</Badge>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">Resolved this week: 5</span>
      </div>

      {/* Dependency Graph */}
      <Card className="bg-[var(--card)] border-[var(--border)] rounded-lg p-4" style={{ height: 260 }}>
        <svg
          viewBox="0 0 800 200"
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          {/* Lines from AI CoS to children */}
          <line x1="400" y1="70" x2="80"  y2="128" stroke="var(--border)" strokeWidth="1" />
          <line x1="400" y1="70" x2="240" y2="128" stroke="var(--border)" strokeWidth="1" />
          <line x1="400" y1="70" x2="400" y2="128" stroke="var(--border)" strokeWidth="1" />
          <line x1="400" y1="70" x2="560" y2="128" stroke="var(--border)" strokeWidth="1" />
          <line x1="400" y1="70" x2="720" y2="128" stroke="var(--border)" strokeWidth="1" />

          {/* CS → Legal conflict line */}
          <line x1="400" y1="150" x2="240" y2="150" stroke="var(--destructive)" strokeWidth="2" strokeDasharray="5,3" />
          <text x="310" y="145" fontSize="10" fill="var(--destructive)" textAnchor="middle">&#9940; Blocked</text>

          {/* Marketing → MktRes duplicate line */}
          <line x1="560" y1="150" x2="720" y2="150" stroke="var(--chart-3)" strokeWidth="2" strokeDasharray="5,3" />
          <text x="640" y="145" fontSize="10" fill="var(--chart-3)" textAnchor="middle">&#9888; Duplicate</text>

          {/* AI CoS node */}
          <circle cx="400" cy="40" r="30" fill="var(--primary)" />
          <text x="400" y="44" fontSize="11" fill="white" textAnchor="middle" fontWeight="600">AI CoS</text>

          {/* Finance */}
          <circle cx="80"  cy="150" r="22" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
          <text x="80"  cy="150" fontSize="10" fill="var(--foreground)" textAnchor="middle" dominantBaseline="middle">Fin</text>
          <text x="80"  y="182" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle">Finance</text>

          {/* Legal */}
          <circle cx="240" cy="150" r="22" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
          <text x="240" y="150" fontSize="10" fill="var(--foreground)" textAnchor="middle" dominantBaseline="middle">Legal</text>
          <text x="240" y="182" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle">Legal</text>

          {/* CS */}
          <circle cx="400" cy="150" r="22" fill="var(--card)" stroke="var(--destructive)" strokeWidth="2" />
          <text x="400" y="150" fontSize="10" fill="var(--foreground)" textAnchor="middle" dominantBaseline="middle">CS</text>
          <text x="400" y="182" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle">CS</text>

          {/* Marketing */}
          <circle cx="560" cy="150" r="22" fill="var(--card)" stroke="var(--chart-3)" strokeWidth="2" />
          <text x="560" y="150" fontSize="10" fill="var(--foreground)" textAnchor="middle" dominantBaseline="middle">Mkt</text>
          <text x="560" y="182" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle">Marketing</text>

          {/* Market Research */}
          <circle cx="720" cy="150" r="22" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
          <text x="720" y="150" fontSize="10" fill="var(--foreground)" textAnchor="middle" dominantBaseline="middle">MR</text>
          <text x="720" y="182" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle">MktRes</text>
        </svg>
      </Card>

      {/* Conflict Cards */}
      <div className="space-y-4">

        {/* Card 1 */}
        {resolved[0] ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 flex items-center gap-2 text-sm text-green-600">
            <span>&#10003; Conflict resolved &mdash; workstream updated.</span>
          </div>
        ) : (
          <div className="bg-[var(--card)] border-l-4 rounded-lg p-5" style={{ borderLeftColor: "var(--destructive)" }}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">Finance Agent &#x2194; Legal Agent</span>
              <Badge variant="outline">Contradictory Assumption</Badge>
              <Badge variant="destructive">HIGH</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-[var(--background)] rounded p-3">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Finance Agent:</p>
                <p className="text-sm">&ldquo;Contract clause permits $50K autonomous spend&rdquo;</p>
              </div>
              <div className="bg-[var(--background)] rounded p-3">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Legal Agent:</p>
                <p className="text-sm">&ldquo;Same clause requires approval above $10K&rdquo;</p>
              </div>
            </div>
            <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded p-3 mt-3">
              <p className="text-xs font-semibold text-[var(--primary)] mb-1">AI CoS Resolution:</p>
              <p className="text-sm">Apply $10K approval threshold as the conservative interpretation. Pending CEO confirmation.</p>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Button size="sm" onClick={() => resolve(0)}>Accept Resolution</Button>
              <Button size="sm" variant="destructive" className="bg-transparent border border-[var(--destructive)] text-[var(--destructive)] hover:bg-[var(--destructive)]/10">Escalate to CEO</Button>
              <Button size="sm" variant="ghost">View Full Context</Button>
            </div>
          </div>
        )}

        {/* Card 2 */}
        {resolved[1] ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 flex items-center gap-2 text-sm text-green-600">
            <span>&#10003; Conflict resolved &mdash; workstream updated.</span>
          </div>
        ) : (
          <div className="bg-[var(--card)] border-l-4 rounded-lg p-5" style={{ borderLeftColor: "var(--chart-3)" }}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">Marketing Agent &#x2194; Market Research Agent</span>
              <Badge variant="outline">Duplicate Work</Badge>
              <Badge variant="outline" className="border-amber-500 text-amber-500">MEDIUM</Badge>
            </div>
            <p className="text-sm mt-3">
              Both agents are independently generating competitor pricing analysis with no shared context or coordination. Estimated waste: 4 hours, $18.
            </p>
            <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded p-3 mt-3">
              <p className="text-xs font-semibold text-[var(--primary)] mb-1">AI CoS Resolution:</p>
              <p className="text-sm">Merge tasks. Market Research Agent leads full analysis. Marketing Agent reviews and validates final output.</p>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Button size="sm" onClick={() => resolve(1)}>Accept Resolution</Button>
              <Button size="sm" variant="outline">Keep Separate</Button>
              <Button size="sm" variant="ghost">Escalate</Button>
            </div>
          </div>
        )}
      </div>

      {/* Cross-Agent Standup Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { value: "2", label: "Agents blocked by dependency" },
          { value: "1", label: "Stale handoffs (48h+)" },
          { value: "1", label: "Workstreams without clear owner" },
          { value: "3", label: "Conflicts resolved without CEO this week" },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="bg-[var(--card)] border border-[var(--border)] rounded p-3 text-center"
          >
            <p className="text-2xl font-mono font-bold text-[var(--foreground)]">{value}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
