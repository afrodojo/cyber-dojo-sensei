import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ensureMasterAdmin } from "@/functions/ensureMasterAdmin";
import { isMasterAdmin } from "@/lib/masterAdmin";

/**
 * Shared admin access hook.
 * Calls ensureMasterAdmin to auto-promote master accounts before checking role,
 * so cyberdojosensei@gmail.com and cyberdojosensai@gmail.com always get access.
 */
export function useAdminAccess() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) { setLoading(false); return; }

        const user = await base44.auth.me();

        // Auto-promote master admin accounts if needed
        if (!user?.role || user.role !== "admin") {
          try {
            const result = await ensureMasterAdmin({});
            if (result.data?.master_admin) {
              setIsAdmin(true);
              setLoading(false);
              return;
            }
          } catch {}
        }

        setIsAdmin(user?.role === "admin" || isMasterAdmin(user?.email));
      } catch {
        setIsAdmin(false);
      }
      setLoading(false);
    };
    check();
  }, []);

  return { isAdmin, loading };
}