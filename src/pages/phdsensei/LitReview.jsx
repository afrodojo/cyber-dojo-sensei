import { BookOpen, Library } from "lucide-react";
import LitReviewTable from "@/components/phdsensei/LitReviewTable";

export default function LitReview() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Living Document
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Literature Review</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-relaxed">
          A searchable, filterable index of seminal AI-for-cyber-defense research —
          annotated with my own takeaways. The table below uses static mock data;
          a Zotero API integration is wired in as the next milestone.
        </p>
      </header>

      <LitReviewTable />

      <p className="flex items-center gap-2 text-xs text-slate-600 font-mono">
        <Library className="w-3.5 h-3.5" />
        {/* TODO(ZOTERO): swap mock data for `await fetchZoteroLibrary()` — see phdsenseiMockData.js */}
        Future: auto-sync from Zotero · annotations stored per itemKey
      </p>
    </div>
  );
}