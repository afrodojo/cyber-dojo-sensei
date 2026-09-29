import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ensureMasterAdmin } from "@/functions/ensureMasterAdmin";
import { isMasterAdmin } from "@/lib/masterAdmin";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }) {
  const [state, setState] = useState({ loading: true, isAdmin: false });

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) {
          window.location.href = "/AccessDenied";
          return;
        }
        const user = await base44.auth.me();

        // Try to auto-promote master admin accounts
        let isMaster = isMasterAdmin(user?.email);
        if (!user?.role || user.role !== "admin") {
          try {
            const result = await ensureMasterAdmin({});
            if (result.data?.master_admin) {
              isMaster = true;
            }
          } catch {}
        }

        if (user?.role === "admin" || isMaster) {
          setState({ loading: false, isAdmin: true });
        } else {
          window.location.href = "/AccessDenied";
        }
      } catch {
        window.location.href = "/AccessDenied";
      }
    };
    checkAdmin();
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-slate-400 text-sm">Verifying Dojo credentials…</p>
        </div>
      </div>
    );
  }

  return children;
}