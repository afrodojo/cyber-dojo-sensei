import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, Copy, CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const FunctionDisplay = ({ toolCall }) => {
  const [expanded, setExpanded] = useState(false);
  const name = toolCall?.name || "Function";
  const status = toolCall?.status || "pending";
  const results = toolCall?.results;

  const parsedResults = (() => {
    if (!results) return null;
    try { return typeof results === "string" ? JSON.parse(results) : results; }
    catch { return results; }
  })();

  const isError = results && (
    (typeof results === "string" && /error|failed/i.test(results)) ||
    parsedResults?.success === false
  );

  const statusConfig = {
    pending: { icon: Clock, color: "text-slate-400", text: "Pending" },
    running: { icon: Loader2, color: "text-cyan-400", text: "Running...", spin: true },
    in_progress: { icon: Loader2, color: "text-cyan-400", text: "Working...", spin: true },
    completed: isError
      ? { icon: AlertCircle, color: "text-red-400", text: "Failed" }
      : { icon: CheckCircle2, color: "text-green-400", text: "Done" },
    success: { icon: CheckCircle2, color: "text-green-400", text: "Done" },
    failed: { icon: AlertCircle, color: "text-red-400", text: "Failed" },
  }[status] || { icon: Clock, color: "text-slate-400", text: "" };

  const Icon = statusConfig.icon;
  const formattedName = name.replace(/_/g, " ").replace(/\./g, " › ");

  return (
    <div className="mt-1.5 text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition-all"
      >
        <Icon className={cn("h-3 w-3 flex-shrink-0", statusConfig.color, statusConfig.spin && "animate-spin")} />
        <span className="text-slate-400">{formattedName}</span>
        {statusConfig.text && <span className={cn("text-slate-500", isError && "text-red-400")}>• {statusConfig.text}</span>}
        {!statusConfig.spin && (toolCall.arguments_string || results) && (
          <ChevronRight className={cn("h-3 w-3 text-slate-600 transition-transform ml-1", expanded && "rotate-90")} />
        )}
      </button>
      {expanded && !statusConfig.spin && (
        <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-700 space-y-2">
          {parsedResults && (
            <pre className="bg-slate-900 rounded p-2 text-xs text-slate-400 whitespace-pre-wrap max-h-40 overflow-auto">
              {typeof parsedResults === "object" ? JSON.stringify(parsedResults, null, 2) : parsedResults}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-cyan-400" />
        </div>
      )}
      <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
        {message.content && (
          <div className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            isUser
              ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white"
              : "bg-slate-800/80 border border-slate-700/50 text-slate-200"
          )}>
            {isUser ? (
              <p className="leading-relaxed">{message.content}</p>
            ) : (
              <ReactMarkdown
                className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                components={{
                  p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
                  li: ({ children }) => <li className="my-0.5">{children}</li>,
                  strong: ({ children }) => <strong className="text-cyan-300 font-semibold">{children}</strong>,
                  code: ({ children }) => <code className="px-1 py-0.5 rounded bg-slate-700 text-cyan-300 text-xs">{children}</code>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
        {message.tool_calls?.length > 0 && (
          <div className="mt-1 space-y-1">
            {message.tool_calls.map((tc, i) => <FunctionDisplay key={i} toolCall={tc} />)}
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      )}
    </div>
  );
}