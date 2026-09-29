import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

export default function CodeBlock({ code, language = "python", filename }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-slate-700/60 bg-[#0a0e14] shadow-lg shadow-black/40">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-700/60">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="lowercase">{filename || language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <code className="text-slate-200 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}