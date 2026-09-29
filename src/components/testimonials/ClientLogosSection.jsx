import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Upload, Trash2, Plus, Building2, Loader2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ClientLogosSection() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    const all = await base44.entities.ClientLogo.list("display_order");
    setLogos(all);
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAdding(true);
  };

  const handleUpload = async () => {
    if (!previewFile || !newName.trim()) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file: previewFile });
    await base44.entities.ClientLogo.create({
      company_name: newName.trim(),
      logo_url: file_url,
      website_url: newWebsite.trim() || undefined,
      display_order: logos.length,
      is_active: true,
    });
    setAdding(false);
    setNewName("");
    setNewWebsite("");
    setPreviewFile(null);
    setPreviewUrl(null);
    setUploading(false);
    await loadLogos();
  };

  const cancelAdd = () => {
    setAdding(false);
    setNewName("");
    setNewWebsite("");
    setPreviewFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleActive = async (logo) => {
    await base44.entities.ClientLogo.update(logo.id, { is_active: !logo.is_active });
    setLogos(logos.map(l => l.id === logo.id ? { ...l, is_active: !l.is_active } : l));
  };

  const deleteLogo = async (id) => {
    if (!confirm("Remove this logo?")) return;
    await base44.entities.ClientLogo.delete(id);
    setLogos(logos.filter(l => l.id !== id));
  };

  if (loading) return (
    <div className="flex justify-center py-10">
      <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" /> Client Logos
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Logos appear in the "Trusted By" section on your portfolio</p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Logo
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>

      {/* Upload Form */}
      {adding && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/70 border border-cyan-500/30 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-cyan-400">New Client Logo</h3>

          {/* Preview */}
          {previewUrl && (
            <div className="w-32 h-16 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-700">
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Company Name *</label>
              <Input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="e.g., Accenture Federal" className="bg-slate-800/60 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Website URL (optional)</label>
              <Input value={newWebsite} onChange={e => setNewWebsite(e.target.value)}
                placeholder="https://..." className="bg-slate-800/60 border-slate-700 text-white" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={uploading || !newName.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white gap-1.5 text-sm">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading..." : "Save Logo"}
            </Button>
            <Button variant="ghost" onClick={cancelAdd} className="text-slate-400 hover:text-white text-sm">
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Logos Grid */}
      {logos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl text-slate-600">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No logos yet — click "Add Logo" to upload your first client logo</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {logos.map((logo, i) => (
            <motion.div key={logo.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
              <Card className={`bg-slate-900/60 border transition-all ${logo.is_active ? "border-slate-700/50" : "border-slate-800 opacity-50"}`}>
                <CardContent className="p-3 space-y-2">
                  <div className="h-14 bg-slate-800/60 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={logo.logo_url} alt={logo.company_name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className="text-white text-xs font-medium truncate text-center">{logo.company_name}</p>
                  <div className="flex items-center justify-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => toggleActive(logo)}
                      className={`w-7 h-7 ${logo.is_active ? "text-green-400 hover:text-green-300" : "text-slate-600 hover:text-slate-400"}`}
                      title={logo.is_active ? "Hide from portfolio" : "Show on portfolio"}>
                      {logo.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteLogo(logo.id)}
                      className="w-7 h-7 text-slate-600 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-600">
        {logos.filter(l => l.is_active).length} of {logos.length} logos visible on your public portfolio
      </p>
    </div>
  );
}