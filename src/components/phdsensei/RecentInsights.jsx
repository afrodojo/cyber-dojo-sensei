import { Lightbulb, TrendingUp, TrendingDown } from "lucide-react";
import { INSIGHTS } from "@/lib/phdsenseiMockData";

const ACCENT = {
  amber: { ring: "border-amber-500/30", glow: "text-amber-400", chip: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
  rose: { ring: "border-rose-500/30", glow: "text-rose-400", chip: "bg-rose-500/10 text-rose-300 border-rose-500/30" },
  emerald: { ring: "border-emerald-500/30", glow: "text-emerald-400", chip: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
  cyan: { ring: "border-cyan-500/30", glow: "text-cyan-400", chip: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" },
};

export default function RecentInsights() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h2 className="text-base font-semibold text-white">Recent Insights</h2>
      </div>
      <div className="space-y-4">
        {INSIGHTS.map((insight) => {
          const a = ACCENT[insight.accent] || ACCENT.cyan;
          const isDown = insight.metric.startsWith("−") || insight.metric.startsWith("-");
          return (
            <div
              key={insight.id}
              className={`rounded-xl border bg-slate-900/40 p-4 hover:bg-slate-900/70 transition-colors ${a.ring}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                  {insight.title}
                </h3>
                <div className="text-right shrink-0">
                  <div className={`flex items-center gap-1 text-lg font-bold font-mono ${a.glow}`}>
                    {isDown ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    {insight.metric}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{insight.summary}</p>
              <p className={`mt-2 inline-block text-[10px] px-2 py-0.5 rounded border font-mono ${a.chip}`}>
                {insight.metricLabel}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}