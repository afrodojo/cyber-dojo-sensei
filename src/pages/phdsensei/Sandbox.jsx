import { FlaskConical } from "lucide-react";
import ResearchPost from "@/components/phdsensei/ResearchPost";
import { SANDBOX_POSTS } from "@/lib/phdsenseiMockData";

export default function Sandbox() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="w-5 h-5 text-emerald-400" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
            Proofs of Concept
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Synthetic Research Sandbox</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-relaxed">
          Short research updates and reproducible PoCs. Each post renders markdown
          with syntax-highlighted code blocks — the first entry walks through
          feature extraction from a PCAP for network anomaly detection.
        </p>
      </header>

      <div className="space-y-6">
        {SANDBOX_POSTS.map((post) => (
          <ResearchPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}