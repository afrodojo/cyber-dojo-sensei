import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, Paperclip, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessageBubble({ message, onRate }) {
  const [copied, setCopied] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rated, setRated] = useState(message.rating ? true : false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRate = (rating) => {
    onRate(rating, "");
    setRated(true);
    setShowRating(false);
  };

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="h-7 w-7 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </div>
      )}

      <div className={cn("max-w-[75%]", isUser && "flex flex-col items-end")}>
        {/* Message Content */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            isUser
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
              : "bg-slate-800 border border-slate-700 text-white"
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              components={{
                code: ({ inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <div className="relative group/code my-2">
                      <pre className="bg-slate-950 text-slate-100 rounded p-3 overflow-x-auto text-xs">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/code:opacity-100 bg-slate-800 hover:bg-slate-700"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <CheckCircle className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <code className="px-1 py-0.5 rounded bg-slate-900 text-slate-200 text-xs">
                      {children}
                    </code>
                  );
                },
                a: ({ children, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    {children}
                  </a>
                ),
                p: ({ children }) => <p className="my-1">{children}</p>,
                ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Attached Files */}
        {message.file_urls && message.file_urls.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.file_urls.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300"
              >
                <Paperclip className="w-3 h-3" />
                Attachment {idx + 1}
              </a>
            ))}
          </div>
        )}

        {/* Message Actions */}
        {!isUser && (
          <div className="mt-2 flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-slate-400 hover:text-slate-300"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCircle className="h-3 w-3 text-green-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>

            {!rated ? (
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-slate-400 hover:text-green-400"
                  onClick={() => handleRate(5)}
                  title="Helpful"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-slate-400 hover:text-red-400"
                  onClick={() => handleRate(1)}
                  title="Not helpful"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <span className="text-xs text-slate-500">
                {message.rating >= 4 ? "👍 Helpful" : "👎 Needs work"}
              </span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-slate-500 mt-1">
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ""}
        </span>
      </div>
    </div>
  );
}