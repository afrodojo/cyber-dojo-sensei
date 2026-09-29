import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AddSubscriberDialog({ open, onClose, onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("manual");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setEmail("");
    setSource("manual");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setSaving(true);
    try {
      const created = await base44.entities.Subscriber.create({
        email: email.trim().toLowerCase(),
        name: name.trim() || undefined,
        source: source.trim() || "manual",
        active: true,
      });
      onAdded(created);
      reset();
      onClose();
    } catch (err) {
      setError(err?.message?.includes("duplicate") || err?.message?.includes("already")
        ? "This email is already on the list."
        : err?.message || "Failed to add subscriber.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <UserPlus className="w-5 h-5 text-cyan-400" /> Add Subscriber
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Email *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@example.com"
              className="bg-slate-800 border-slate-700 text-white"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Name (optional)</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Source</Label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="manual, import, event, etc."
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Add Subscriber
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}