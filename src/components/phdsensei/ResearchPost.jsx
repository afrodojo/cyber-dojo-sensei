import ReactMarkdown from "react-markdown";
import { Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "./CodeBlock";

const TAG_ACCENTS = {
  NIDS: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "Feature Engineering": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export default function ResearchPost({ post }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 hover:border-slate-700 transition-colors">
      <header className="mb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight">{post.title}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            {post.tags.map((t) => (
              <Badge
                key={t}
                className={`text-[10px] px-2 py-0.5 border ${
                  TAG_ACCENTS[t] || "bg-slate-700/40 text-slate-300 border-slate-600/40"
                }`}
              >
                {t}
              </Badge>
            ))}
          </span>
        </div>
      </header>

      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-cyan-300 prose-strong:text-slate-100 prose-li:text-slate-300">
        <ReactMarkdown
          components={{
            pre: ({ children }) => <>{children}</>,
            code: ({ className, children }) => {
              const match = /language-(\w+)/.exec(className || "");
              const text = String(children);
              const isBlock = !!match || text.includes("\n");
              if (!isBlock) {
                return (
                  <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[13px]">
                    {children}
                  </code>
                );
              }
              return <CodeBlock language={match?.[1] || "text"} code={text.replace(/\n$/, "")} />;
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}