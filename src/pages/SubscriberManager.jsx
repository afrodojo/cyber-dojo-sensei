import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Mail, Download, Trash2, AlertTriangle, Loader2, Users, CheckCircle2, XCircle, UserPlus, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AddSubscriberDialog from "@/components/subscribers/AddSubscriberDialog";
import ImportSubscribersDialog from "@/components/subscribers/ImportSubscribersDialog";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function SubscriberManager() {
  const [subscribers, setSubscribers] = useState([]);
  const { isAdmin, loading } = useAdminAccess();
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (isAdmin) {
        try {
          const all = await base44.entities.Subscriber.list("-created_date");
          setSubscribers(all);
        } catch {}
      }
    };
    init();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!confirm("Remove this subscriber?")) return;
    await base44.entities.Subscriber.delete(id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleActive = async (sub) => {
    await base44.entities.Subscriber.update(sub.id, { active: !sub.active });
    setSubscribers(prev => prev.map(s => s.id === sub.id ? { ...s, active: !s.active } : s));
  };

  const exportCSV = () => {
    const active = subscribers.filter(s => s.active);
    const rows = [["Email", "Name", "Source", "Subscribed Date"], ...active.map(s => [
      s.email, s.name || "", s.source || "footer",
      s.created_date ? new Date(s.created_date).toLocaleDateString() : ""
    ])];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-white">
      <div className="text-center p-8 bg-slate-900 rounded-lg border border-red-500/30">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400">Admin access required.</p>
      </div>
    </div>
  );

  const activeCount = subscribers.filter(s => s.active).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Mail className="w-8 h-8 text-cyan-400" /> Newsletter Subscribers
              </h1>
              <p className="text-slate-400 mt-1">{activeCount} active · {subscribers.length} total</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setShowAdd(true)} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white gap-2">
                <UserPlus className="w-4 h-4" /> Add Subscriber
              </Button>
              <Button onClick={() => setShowImport(true)} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white gap-2">
                <UploadCloud className="w-4 h-4" /> Import CSV
              </Button>
              <Button onClick={exportCSV} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-5 flex items-center gap-3">
              <Users className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold text-white">{subscribers.length}</p>
                <p className="text-slate-400 text-sm">Total Subscribers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-5 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{activeCount}</p>
                <p className="text-slate-400 text-sm">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-5 flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-white">{subscribers.length - activeCount}</p>
                <p className="text-slate-400 text-sm">Inactive</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">Subscriber List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {subscribers.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No subscribers yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 text-slate-400">
                      <th className="text-left px-6 py-3 font-medium">Email</th>
                      <th className="text-left px-6 py-3 font-medium">Source</th>
                      <th className="text-left px-6 py-3 font-medium">Date</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, i) => (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-6 py-4 text-white font-medium">{sub.email}</td>
                        <td className="px-6 py-4 text-slate-400">{sub.source || "footer"}</td>
                        <td className="px-6 py-4 text-slate-400">
                          {sub.created_date ? new Date(sub.created_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={sub.active ? "bg-green-500/20 text-green-300 border-green-500/30 border" : "bg-slate-600/30 text-slate-400 border-slate-600 border"}>
                            {sub.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleToggleActive(sub)}
                              className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                            >
                              {sub.active ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddSubscriberDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdded={(sub) => setSubscribers(prev => [sub, ...prev])}
      />
      <ImportSubscribersDialog
        open={showImport}
        onClose={() => setShowImport(false)}
        onImported={async () => {
          const all = await base44.entities.Subscriber.list("-created_date");
          setSubscribers(all);
        }}
      />
    </div>
  );
}