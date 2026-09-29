import { useState } from "react";
import { Radar, ExternalLink, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FEED_ITEMS } from "@/lib/phdsenseiMockData";

const SOURCES = ["All", "arXiv cs.CR", "MITRE ATLAS"];

const TAG_COLOR = {
  "Adversarial ML": "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
  "Data Poisoning": "border-rose-500/30 text-rose-300 bg-rose-500/10",
  "Supply Chain": "border-amber-500/30 text-amber-300 bg-amber-500/10",
  Reconnaissance: "border-violet-500/30 text-violet-300 bg-violet-500/10",
  NIDS: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
};

export default function ThreatResearchFeed() {
  const [source, setSource] = useState("All");
  const items =
    source === "All"
      ? FEED_ITEMS
      : FEED_ITEMS.filter((i) => i.source === source);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <Radar className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Threat &amp; Research Feed</h2>
            <p className="text-[11px] text-slate-500 font-mono">
              Live aggregator · arXiv cs.CR + MITRE ATLAS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {SOURCES.map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                source === s
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <ul className="divide-y divide-slate-800/70">
        {items.map((item) => (
          <li
            key={item.id}
            className="px-5 py-4 hover:bg-slate-800/40 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    {item.source}
                  </span>
                  <Badge
                    className={`text-[10px] px-2 py-0 border ${
                      TAG_COLOR[item.tag] || "border-slate-600/40 text-slate-300 bg-slate-700/30"
                    }`}
                  >
                    {item.tag}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.summary}
                </p>
                <p className="mt-1.5 text-[11px] text-slate-600 font-mono">
                  {item.authors} · {item.publishedAt}
                </p>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-cyan-400 transition-colors shrink-0 mt-1"
                aria-label="Open source"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}