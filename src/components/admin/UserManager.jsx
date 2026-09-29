import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Loader2, Users, Shield, Search, ChevronDown, ChevronUp, Crown, Trash2, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { isMasterAdmin } from "@/lib/masterAdmin";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { toast } = useToast();

  const handleRoleChange = async (user, newRole) => {
    if (isMasterAdmin(user.email)) {
      toast({ title: "Protected Account", description: "Master admin role cannot be changed.", variant: "destructive" });
      return;
    }
    setActionLoading(user.id);
    try {
      await base44.entities.User.update(user.id, { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      toast({ title: "Role Updated", description: `${user.full_name} is now ${newRole === 'admin' ? 'an admin' : 'a member'}.` });
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (user) => {
    if (isMasterAdmin(user.email)) {
      toast({ title: "Protected Account", description: "Master admin accounts cannot be deleted.", variant: "destructive" });
      return;
    }
    if (!window.confirm(`Delete ${user.full_name}? This cannot be undone.`)) return;
    setActionLoading(user.id);
    try {
      await base44.entities.User.delete(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast({ title: "User Deleted", description: `${user.full_name} has been removed.` });
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await base44.entities.User.list();
        setUsers(data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    loadUsers();
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  }).sort((a, b) => {
    const cmp = (a.full_name || "").localeCompare(b.full_name || "");
    return sortAsc ? cmp : -cmp;
  });

  if (loading) return (
    <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
  );

  const adminCount = users.filter(u => u.role === "admin").length;
  const memberCount = users.filter(u => u.role !== "admin").length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <p className="text-slate-400 text-sm">View active members, track engagement, and adjust roles.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 text-center">
          <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{users.length}</div>
          <div className="text-xs text-slate-400">Total Members</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 text-center">
          <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{adminCount}</div>
          <div className="text-xs text-slate-400">Admins</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 text-center">
          <Users className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{memberCount}</div>
          <div className="text-xs text-slate-400">Members</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
        />
      </div>

      {/* User table */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-slate-700/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <button onClick={() => setSortAsc(!sortAsc)} className="flex items-center gap-1 hover:text-white transition-colors text-left">
            Name {sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-slate-800/50">
          {filtered.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-4 py-3 hover:bg-slate-800/40 transition-all duration-200"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 text-xs font-bold">
                    {(user.full_name || "?")[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-white text-sm truncate">{user.full_name || "Unnamed"}</span>
              </div>
              <span className="text-slate-400 text-sm truncate self-center">{user.email || "—"}</span>
              <div className="self-center">
                {isMasterAdmin(user.email) ? (
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Master Admin
                  </Badge>
                ) : user.role === "admin" ? (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">Admin</Badge>
                ) : (
                  <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs">Member</Badge>
                )}
              </div>
              <span className="text-slate-500 text-xs self-center">
                {user.created_date ? new Date(user.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
              </span>
              <div className="self-center flex items-center gap-1">
                {isMasterAdmin(user.email) ? (
                  <span className="text-xs text-slate-600 italic">Protected</span>
                ) : (
                  <>
                    {user.role === "admin" ? (
                      <Button size="sm" variant="ghost" disabled={actionLoading === user.id}
                        onClick={() => handleRoleChange(user, "user")}
                        className="text-slate-400 hover:text-yellow-400 h-7 px-2 text-xs">
                        <UserCog className="w-3 h-3 mr-1" /> Demote
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" disabled={actionLoading === user.id}
                        onClick={() => handleRoleChange(user, "admin")}
                        className="text-slate-400 hover:text-emerald-400 h-7 px-2 text-xs">
                        <UserCog className="w-3 h-3 mr-1" /> Promote
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" disabled={actionLoading === user.id}
                      onClick={() => handleDeleteUser(user)}
                      className="text-slate-400 hover:text-red-400 h-7 px-2 text-xs">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">No users found.</div>
        )}
      </div>
    </div>
  );
}