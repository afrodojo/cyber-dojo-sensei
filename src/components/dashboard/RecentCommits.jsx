import React, { useState, useEffect } from "react";
import { getGitHubCommits } from "@/functions/getGitHubCommits";
import { GitCommitHorizontal, ExternalLink, RefreshCw, GitBranch, Loader2, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function RecentCommits() {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repo, setRepo] = useState("");

  const fetchCommits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGitHubCommits({});
      setCommits(res.data?.commits?.slice(0, 8) || []);
      setRepo(res.data?.repo || "");
    } catch (e) {
      setError(e.message || "Failed to load commits");
    }
    setLoading(false);
  };

  useEffect(() => { fetchCommits(); }, []);

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Latest Commits</h2>
            {repo && <p className="text-slate-500 text-xs">{repo}</p>}
          </div>
        </div>
        <button
          onClick={fetchCommits}
          disabled={loading}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 py-6 text-center justify-center text-slate-500">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <p className="text-sm">{error}</p>
        </div>
      ) : commits.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-6">No commits found.</p>
      ) : (
        <div className="space-y-2">
          {commits.map((commit) => (
            <a
              key={commit.sha}
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              {commit.avatarUrl ? (
                <img src={commit.avatarUrl} alt={commit.author} className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GitCommitHorizontal className="w-3.5 h-3.5 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm leading-snug line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {commit.message.split("\n")[0]}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  <span className="font-mono text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded text-[10px] mr-2">{commit.shortSha}</span>
                  {commit.author} · {formatDistanceToNow(new Date(commit.date), { addSuffix: true })}
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}