import { useMemo, useState } from "react";
import { Search, ExternalLink, BookMarked } from "lucide-react";
import { LITERATURE } from "@/lib/phdsenseiMockData";

const ALL_TAGS = ["Adversarial ML", "Evasion", "FGSM", "Data Poisoning", "Backdoor", "Malware Detection", "Data Science", "NIDS"];

const TAG_COLOR = {
  "Adversarial ML": "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
  Evasion: "border-rose-500/30 text-rose-300 bg-rose-500/10",
  FGSM: "border-orange-500/30 text-orange-300 bg-orange-500/10",
  "Data Poisoning": "border-rose-500/30 text-rose-300 bg-rose-500/10",
  Backdoor: "border-fuchsia-500/30 text-fuchsia-300 bg-fuchsia-500/10",
  "Malware Detection": "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
  "Data Science": "border-teal-500/30 text-teal-300 bg-teal-500/10",
  NIDS: "border-blue-500/30 text-blue-300 bg-blue-500/10",
};

export default function LitReviewTable() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LITERATURE.filter((row) => {
      const matchesText =
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.authors.toLowerCase().includes(q) ||
        row.venue.toLowerCase().includes(q);
      const matchesTag = activeTag === "All" || row.tags.includes(activeTag);
      return matchesText && matchesTag;
    });
  }, [search, activeTag]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      {/* Controls */}
      <div className="p-5 border-b border-slate-800 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or venue…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", ...ALL_TAGS].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                activeTag === tag
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 text-[11px] uppercase tracking-wider text-slate-500 font-mono">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Author</th>
              <th className="px-5 py-3 font-medium">Year</th>
              <th className="px-5 py-3 font-medium">Core Theme</th>
              <th className="px-5 py-3 font-medium">My Takeaway</th>
              <th className="px-5 py-3 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-5 py-4 align-top">
                  <div className="text-sm font-semibold text-slate-100 leading-snug">{row.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{row.venue}</div>
                </td>
                <td className="px-5 py-4 align-top text-sm text-slate-300">{row.authors}</td>
                <td className="px-5 py-4 align-top text-sm text-slate-400 font-mono">{row.year}</td>
                <td className="px-5 py-4 align-top">
                  <div className="flex flex-wrap gap-1">
                    {row.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${TAG_COLOR[tag] || "border-slate-600/40 text-slate-300 bg-slate-700/30"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-xs text-slate-400 leading-relaxed max-w-md">
                  {row.takeaway}
                </td>
                <td className="px-5 py-4 align-top">
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-cyan-400 transition-colors inline-flex"
                    aria-label="Open paper"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-slate-500">
          <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No papers match your filters.</p>
        </div>
      )}

      <div className="px-5 py-3 border-t border-slate-800 text-[11px] text-slate-600 font-mono flex items-center justify-between">
        <span>
          {filtered.length} of {LITERATURE.length} entries
        </span>
        {/* TODO(ZOTERO): Replace static data above with `await fetchZoteroLibrary()` — see phdsenseiMockData.js */}
        <span className="text-slate-700">↳ Zotero integration pending</span>
      </div>
    </div>
  );
}