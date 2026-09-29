import { Activity, Radar, FileText, Radio } from "lucide-react";
import ThreatResearchFeed from "@/components/phdsensei/ThreatResearchFeed";
import RecentInsights from "@/components/phdsensei/RecentInsights";

const STATS = [
  { label: "Papers Tracked", value: "128", icon: FileText, accent: "text-cyan-400" },
  { label: "Active PoCs", value: "07", icon: Activity, accent: "text-emerald-400" },
  { label: "Feed Sources", value: "02", icon: Radio, accent: "text-amber-400" },
  { label: "Last Sync", value: "12m", icon: Radar, accent: "text-violet-400" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Command Center header */}
      <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/60 to-cyan-950/20 p-6 sm:p-8">
        <div className="absolute inset-0 opacity-30 pointer-events-none [background-image:linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
              Operations · Real-Time
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Command Center
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-relaxed">
            Adversarial ML, network anomaly detection, and AI security research —
            unified into a single SOC-style monitoring surface. Track literature,
            triage emerging threats, and prototype defenses.
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${s.accent}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono leading-none">{s.value}</div>
                <div className="text-[11px] text-slate-500 mt-1">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feed + Insights */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThreatResearchFeed />
        </div>
        <div className="lg:col-span-1">
          <RecentInsights />
        </div>
      </div>
    </div>
  );
}