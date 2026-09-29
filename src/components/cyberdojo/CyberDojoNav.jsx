import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Terminal, Menu, X, Github, BookOpen, Rss } from "lucide-react";

export default function CyberDojoNav() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", to: "/cyber-dojo" },
    { label: "Tech Blog", to: "/cyber-dojo/blog" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/cyber-dojo" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.5)]">
            <Terminal className="w-4.5 h-4.5 text-black" />
          </div>
          <span className="font-mono font-bold text-white text-lg tracking-tight">
            afro<span className="text-cyan-400">dojo</span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/afrodojo"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
        </nav>

        <button
          onClick={() => setOpen(v => !v)}
          className="sm:hidden p-2 text-slate-300 hover:text-cyan-400"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-cyan-500/20 bg-black/95 px-4 py-3 space-y-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/afrodojo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>
      )}
    </header>
  );
}