import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Upload, FileText, X, Loader2, CheckCircle2, Linkedin, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processArticleSubmission } from "@/functions/processArticleSubmission";

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "bg-blue-600/20 text-blue-400 border-blue-500/30" },
  { id: "twitter", label: "Twitter/X", icon: Twitter, color: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
];

export default function ArticleUploader({ onSubmitted }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [platforms, setPlatforms] = useState(["linkedin"]);
  const [publishAsBlog, setPublishAsBlog] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState("idle"); // idle | uploading | extracting | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef();

  const togglePlatform = (id) => {
    setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleFileSelect = (f) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    if (!allowed.includes(f.type)) {
      setErrorMsg("Please upload a PDF or Word (.docx) file.");
      return;
    }
    setFile(f);
    setErrorMsg("");
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    setStep("uploading");
    setErrorMsg("");

    try {
      // 1. Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      const ext = file.name.split(".").pop().toLowerCase();
      const fileType = ext === "pdf" ? "pdf" : ext === "docx" ? "docx" : "doc";

      // 2. Create ArticleSubmission record
      const article = await base44.entities.ArticleSubmission.create({
        title: title.trim(),
        file_url,
        file_name: file.name,
        file_type: fileType,
        source: "upload",
        status: "pending",
        social_platforms: platforms
      });

      // 3. Extract content
      setStep("extracting");
      await processArticleSubmission({ articleId: article.id, action: "extract" });

      setStep("done");
      setTimeout(() => onSubmitted?.(), 1500);
    } catch (err) {
      setErrorMsg(err.message || "Upload failed. Please try again.");
      setStep("error");
    }
    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Upload className="w-5 h-5 text-cyan-400" /> Submit an Article
        </h2>

        {step === "done" ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Article Submitted!</h3>
            <p className="text-slate-400">Your article has been uploaded and content extracted. Head to the Pending Review tab to approve and post.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Drop Zone */}
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                file ? "border-cyan-500/50 bg-cyan-500/5" : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/30"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-slate-400 text-sm">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }} className="ml-2 text-slate-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-white font-medium">Drop your article here</p>
                  <p className="text-slate-500 text-sm mt-1">PDF or Word (.docx) — up to 25MB</p>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="text-sm text-slate-400 block mb-2">Article Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter article title..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            {/* Platforms */}
            <div>
              <label className="text-sm text-slate-400 block mb-3">Post to Social Media (after approval)</label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => togglePlatform(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      platforms.includes(id)
                        ? `${color} border-current`
                        : "bg-slate-800/50 text-slate-500 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div>
                <p className="text-white text-sm font-medium">Also add to Blog (as draft)</p>
                <p className="text-slate-500 text-xs mt-0.5">Creates a draft blog post for the article — you can publish separately</p>
              </div>
              <div
                onClick={() => setPublishAsBlog(v => !v)}
                className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${publishAsBlog ? "bg-cyan-500" : "bg-slate-600"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${publishAsBlog ? "translate-x-6" : "translate-x-1"}`} />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{errorMsg}</div>
            )}

            <Button
              type="submit"
              disabled={!file || !title.trim() || uploading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {step === "uploading" ? "Uploading file..." : "Extracting content with AI..."}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Submit for Review
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}