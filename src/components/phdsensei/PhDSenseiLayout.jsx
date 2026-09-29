import { useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { LayoutDashboard, BookOpen, FlaskConical, Menu, X, ShieldCheck, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { to: "/phd-sensei", label: "Command Center", icon: LayoutDashboard, end: true },
  { to: "/phd-sensei/lit-review", label: "Literature Review", icon: BookOpen, end: false },
  { to: "/phd-sensei/sandbox", label: "Sandbox & PoCs", icon: FlaskConical, end: false },
];

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/phd-sensei" onClick={onNavigate} className="flex items-center gap-3 px-6 h-20 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Terminal className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <div className="text-lg font-bold text-white tracking-tight">PhD Sensei</div>
          <div className="text-[11px] text-cyan-400/80 font-mono uppercase tracking-wider">AI · Cyber Defense</div>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 mb-2 text-[10px] text-slate-600 font-mono uppercase tracking-widest">Research Hub</p>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`
            }
          >
            <item.icon className="w-4.5 h-4.5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono">SYSTEM ONLINE</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
          <ShieldCheck className="w-3 h-3" /> Defense-Tech · Academic Rigor
        </div>
      </div>
    </div>
  );
}

export default function PhDSenseiLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-slate-800 bg-slate-900/70 backdrop-blur-md z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-40">
        <Link to="/phd-sensei" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-slate-950" />
          </div>
          <span className="font-bold text-white">PhD Sensei</span>
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}