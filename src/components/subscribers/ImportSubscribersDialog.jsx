import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, CheckCircle2, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line) => {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

function findEmailIndex(headers) {
  const emailIdx = headers.findIndex((h) => h.includes("email") || h.includes("e-mail") || h.includes("mail"));
  return emailIdx >= 0 ? emailIdx : 0;
}

function findNameIndex(headers) {
  const nameIdx = headers.findIndex((h) => h.includes("name"));
  return nameIdx >= 0 ? nameIdx : -1;
}

export default function ImportSubscribersDialog({ open, onClose, onImported }) {
  const [parsed, setParsed] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const reset = () => {
    setParsed(null);
    setResult(null);
    setDragOver(false);
  };

  const handleFile = async (file) => {
    setResult(null);
    if (!file) return;
    if (!file.name.match(/\.csv$/i)) {
      setResult({ error: "Please upload a .csv file." });
      return;
    }
    const text = await file.text();
    const { headers, rows } = parseCSV(text);
    if (rows.length === 0) {
      setResult({ error: "CSV file is empty or has no data rows." });
      return;
    }
    const emailIdx = findEmailIndex(headers);
    const nameIdx = findNameIndex(headers);
    const contacts = rows
      .map((row) => ({
        email: (row[emailIdx] || "").trim().toLowerCase(),
        name: nameIdx >= 0 ? (row[nameIdx] || "").trim() : "",
      }))
      .filter((c) => c.email && c.email.includes("@"));

    if (contacts.length === 0) {
      setResult({ error: "No valid email addresses found in the file." });
      return;
    }
    setParsed({ contacts, fileName: file.name });
  };

  const handleImport = async () => {
    if (!parsed) return;
    setImporting(true);
    setResult(null);
    try {
      const created = await base44.entities.Subscriber.bulkCreate(
        parsed.contacts.map((c) => ({
          email: c.email,
          name: c.name || undefined,
          source: "import",
          active: true,
        }))
      );
      setResult({
        success: true,
        added: Array.isArray(created) ? created.length : parsed.contacts.length,
      });
      onImported();
      setParsed(null);
    } catch (err) {
      setResult({ error: err?.message || "Import failed." });
    } finally {
      setImporting(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <UploadCloud className="w-5 h-5 text-cyan-400" /> Import Subscribers from CSV
          </DialogTitle>
        </DialogHeader>

        {!parsed && !result?.success && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver ? "border-cyan-500 bg-cyan-500/10" : "border-slate-600 hover:border-slate-500"
            }`}
          >
            <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Click to browse or drag a CSV file here</p>
            <p className="text-slate-500 text-sm mt-1">CSV must have an "email" column. A "name" column is optional.</p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        )}

        {parsed && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Found <span className="font-bold text-white">{parsed.contacts.length}</span> valid contacts in <span className="text-slate-400">{parsed.fileName}</span>
            </div>
            <div className="max-h-48 overflow-y-auto bg-slate-800/50 rounded-lg border border-slate-700/50">
              {parsed.contacts.slice(0, 50).map((c, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2 text-sm border-b border-slate-700/30 last:border-0">
                  <span className="text-white">{c.email}</span>
                  {c.name && <span className="text-slate-500">{c.name}</span>}
                </div>
              ))}
              {parsed.contacts.length > 50 && (
                <div className="px-4 py-2 text-xs text-slate-500">...and {parsed.contacts.length - 50} more</div>
              )}
            </div>
          </div>
        )}

        {result?.error && (
          <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {result.error}
          </div>
        )}

        {result?.success && (
          <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 rounded-lg p-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Successfully imported {result.added} subscriber{result.added !== 1 ? "s" : ""}.
          </div>
        )}

        <DialogFooter>
          {result?.success ? (
            <Button onClick={() => { reset(); onClose(); }} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              Done
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => { reset(); onClose(); }} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              {parsed && (
                <Button onClick={handleImport} disabled={importing} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white gap-2">
                  {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  Import {parsed.contacts.length} Contacts
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}