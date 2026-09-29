import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Home, LogIn } from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import ShurikenIcon from "@/components/icons/ShurikenIcon";

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-slate-950 ninja-grid flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full"
      >
        <div className="relative bg-slate-900/80 border-2 border-red-500/40 rounded-2xl p-10 text-center overflow-hidden shuriken-clip">
          {/* Background glow */}
          <div className="absolute inset-0 bg-red-500/5 blur-3xl pointer-events-none" />

          {/* Shuriken icon */}
          <div className="relative z-10 flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
              <ShurikenIcon className="w-10 h-10 text-red-400" />
            </div>
          </div>

          <h1 className="relative z-10 text-2xl md:text-3xl font-black text-white mb-3">
            Access Denied
          </h1>
          <p className="relative z-10 text-cyan-400 font-semibold text-sm tracking-wider uppercase mb-4">
            Dojo Authorization Required
          </p>
          <p className="relative z-10 text-slate-400 text-sm leading-relaxed mb-8">
            This area is restricted to authorized Cyber Dojo Sensei administrators.
            If you believe this is an error, contact the dojo master for elevation.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={createPageUrl("Portfolio")}
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <Link
              to={createPageUrl("SignIn")}
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-semibold"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}