import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReactMarkdown from "react-markdown";
import {
  BookOpen, Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff,
  Search, AlertTriangle, Loader2, X, Save, ArrowLeft,
  FileText, CheckCircle, Clock, SplitSquareHorizontal, Code, LayoutTemplate,
  Share2, Sparkles, Linkedin, Send, Twitter, Instagram, CheckCircle2,
  Upload, Download, Paperclip
} from "lucide-react";
import { generateSocialPostsFromBlog } from "@/functions/generateSocialPostsFromBlog";
import { postBlogToLinkedIn } from "@/functions/postBlogToLinkedIn";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TemplateManager from "@/components/blog/TemplateManager";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const CATEGORIES = ["red-team", "technical", "leadership", "threat-intelligence", "architecture", "business"];

const emptyPost = {
  title: "", excerpt: "", content: "", category: "technical",
  tags: [], read_time: "5 min read", featured: false, published: false,
  meta_title: "", meta_description: "", image_url: "",
  attachment_url: "", attachment_name: "", scheduled_date: ""
};

// ── Attachment Uploader ────────────────────────────────────────────────────────
function AttachmentUploader({ attachmentUrl, attachmentName, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setError("Only PDF and Word (.doc / .docx) files are allowed.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("File must be under 25 MB.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange(file_url, file.name);
    } catch (err) {
      setError("Upload failed. Please try again.");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleRemove = () => {
    onChange("", "");
    setError("");
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        <Paperclip className="w-4 h-4 text-cyan-400" /> Downloadable Attachment
      </h3>
      <p className="text-xs text-slate-500">Attach a PDF or Word document visitors can download directly from the post.</p>

      {attachmentUrl ? (
        <div className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2.5 border border-slate-600">
          <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="text-slate-200 text-xs flex-1 truncate" title={attachmentName}>{attachmentName || "Attached file"}</span>
          <div className="flex gap-1">
            <a href={attachmentUrl} target="_blank" rel="noopener noreferrer"
              className="p-1 text-slate-400 hover:text-cyan-400 transition-colors" title="Preview">
              <Download className="w-3.5 h-3.5" />
            </a>
            <button onClick={handleRemove} className="p-1 text-slate-400 hover:text-red-400 transition-colors" title="Remove">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-slate-600 hover:border-cyan-500/60 rounded-lg py-5 flex flex-col items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer disabled:opacity-50"
        >
          {uploading
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : <Upload className="w-5 h-5" />}
          <span className="text-xs font-medium">{uploading ? "Uploading..." : "Click to upload PDF or Word doc"}</span>
          <span className="text-xs text-slate-600">Max 25 MB</span>
        </button>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── Editor View ────────────────────────────────────────────────────────────────
function BlogEditor({ post, onSave, onCancel }) {
  const [editing, setEditing] = useState({ ...post });
  const [tagsInput, setTagsInput] = useState(post.tags?.join(", ") || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [socialDraftsCreated, setSocialDraftsCreated] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // "write" | "split" | "preview"
  const [showTemplates, setShowTemplates] = useState(false);

  const set = (field, val) => setEditing(e => ({ ...e, [field]: val }));

  const applyTemplate = (template) => {
    set("category", template.category);
    set("excerpt", template.excerpt || "");
    set("content", template.contentTemplate);
    setTagsInput([...template.tags || []].join(", "));
    setShowTemplates(false);
  };

  const handleSave = async (publishNow) => {
    setSaving(true);
    const data = {
      ...editing,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      ...(publishNow !== undefined ? { published: publishNow } : {})
    };
    let savedPost;
    if (editing.id) {
      savedPost = await base44.entities.BlogPost.update(editing.id, data);
    } else {
      savedPost = await base44.entities.BlogPost.create(data);
    }

    // If publishing, trigger social post generation
    const isPublishing = publishNow === true || (publishNow === undefined && data.published);
    const wasAlreadyPublished = editing.id && editing.published;
    if (isPublishing && !wasAlreadyPublished) {
      try {
        await generateSocialPostsFromBlog({ blogPost: { ...data, id: savedPost?.id || editing.id } });
        setSocialDraftsCreated(true);
      } catch (e) {
        console.error("Social post generation failed:", e);
      }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => { onSave(); }, 1200);
  };

  const wordCount = editing.content?.trim().split(/\s+/).filter(Boolean).length || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-3 flex-wrap">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-400 hover:text-white gap-2 pl-0">
            <ArrowLeft className="w-4 h-4" /> All Posts
          </Button>

          <div className="flex-1 min-w-0">
            <input
              value={editing.title}
              onChange={e => set("title", e.target.value)}
              placeholder="Article title..."
              className="w-full bg-transparent text-xl font-bold text-white placeholder:text-slate-600 outline-none border-none"
            />
          </div>

          {/* View mode toggles */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            {[
              { id: "write", icon: Code, label: "Write" },
              { id: "split", icon: SplitSquareHorizontal, label: "Split" },
              { id: "preview", icon: LayoutTemplate, label: "Preview" },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === m.id ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <m.icon className="w-3.5 h-3.5" /> {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {socialDraftsCreated && (
              <span className="text-cyan-400 text-sm flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 rounded-md px-2 py-1">
                <Share2 className="w-3.5 h-3.5" /> Social drafts created
              </span>
            )}
            {saved && <span className="text-green-400 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved</span>}
            <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={saving}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-xs">
              Save Draft
            </Button>
            <Button size="sm" onClick={() => handleSave(true)} disabled={saving}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs gap-1.5">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {editing.published ? "Update & Publish" : "Publish + Social Drafts"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6 gap-6">
        {/* Main Editor Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Template Manager */}
          {showTemplates && (
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-4">
              <TemplateManager onSelectTemplate={applyTemplate} CATEGORIES={CATEGORIES} />
            </div>
          )}
          {!showTemplates && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTemplates(true)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 w-fit text-xs gap-1.5"
            >
              <LayoutTemplate className="w-3.5 h-3.5" /> Load Template
            </Button>
          )}

          {/* Excerpt */}
          <input
            value={editing.excerpt}
            onChange={e => set("excerpt", e.target.value)}
            placeholder="Short excerpt / summary (shown in article cards)..."
            className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-300 placeholder:text-slate-600 outline-none focus:border-cyan-500/50 text-sm"
          />

          {/* Content editor / preview */}
          <div className={`flex gap-4 flex-1 ${viewMode === "split" ? "md:flex-row" : "flex-col"}`}>
            {/* Write pane */}
            {(viewMode === "write" || viewMode === "split") && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Markdown</span>
                  <span className="text-xs text-slate-600">{wordCount} words</span>
                </div>
                <textarea
                  value={editing.content}
                  onChange={e => set("content", e.target.value)}
                  placeholder={`# Your Article Title\n\nStart writing your article here in **Markdown** format...\n\n## Section Heading\n\nYour content goes here.`}
                  className="flex-1 w-full bg-slate-900/60 border border-slate-700/50 rounded-lg p-4 text-slate-200 placeholder:text-slate-700 outline-none focus:border-cyan-500/50 font-mono text-sm resize-none leading-relaxed min-h-[500px]"
                />
              </div>
            )}

            {/* Preview pane */}
            {(viewMode === "preview" || viewMode === "split") && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center mb-2">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Preview</span>
                </div>
                <div className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-lg p-6 overflow-auto min-h-[500px]">
                  {editing.content ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-code:text-cyan-300 prose-pre:bg-slate-800 prose-blockquote:border-cyan-500 prose-blockquote:text-slate-400">
                      <ReactMarkdown>{editing.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-slate-700 italic text-sm">Preview will appear here as you write...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Publish settings */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Publish Settings</h3>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Editorial Status</label>
              <Select value={editing.status || "draft"} onValueChange={v => set("status", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">📝 Draft</SelectItem>
                  <SelectItem value="under-review">🔍 Under Review</SelectItem>
                  <SelectItem value="published">✅ Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">Live on Site</span>
              <div
                onClick={() => set("published", !editing.published)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${editing.published ? "bg-green-500" : "bg-slate-600"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${editing.published ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
            <p className="text-xs text-slate-500">{editing.published ? "Visible on live blog" : "Hidden from public"}</p>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Scheduled Date</label>
              <Input
                type="date"
                value={editing.scheduled_date || ""}
                onChange={e => set("scheduled_date", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm h-8"
              />
              <p className="text-[10px] text-slate-600 mt-1">Used by the Blog Calendar to track your publishing schedule.</p>
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">Featured</span>
              <div
                onClick={() => set("featured", !editing.featured)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${editing.featured ? "bg-yellow-500" : "bg-slate-600"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${editing.featured ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
          </div>

          {/* Article details */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Article Details</h3>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <Select value={editing.category} onValueChange={v => set("category", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/-/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Read Time</label>
              <Input value={editing.read_time} onChange={e => set("read_time", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="5 min read" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Tags (comma separated)</label>
              <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="tag1, tag2" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Cover Image URL</label>
              <Input value={editing.image_url || ""} onChange={e => set("image_url", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="https://..." />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">SEO</h3>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Meta Title</label>
              <Input value={editing.meta_title} onChange={e => set("meta_title", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm h-8" placeholder="Custom page title" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Meta Description</label>
              <Textarea value={editing.meta_description} onChange={e => set("meta_description", e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm" rows={3} placeholder="Custom meta description" />
            </div>
          </div>

          {/* File Attachment */}
          <AttachmentUploader
            attachmentUrl={editing.attachment_url}
            attachmentName={editing.attachment_name}
            onChange={(url, name) => { set("attachment_url", url); set("attachment_name", name); }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Social Share Modal ──────────────────────────────────────────────────────────
const SHARE_PLATFORMS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    bg: "bg-[#0077B5]",
    maxChars: 3000,
    buildPrompt: (post) =>
      `Write a professional LinkedIn post for Asaad Morman (cybersecurity entrepreneur, TS/SCI, CEO of Emerging Defense Solutions) about this blog article:\n\nTitle: ${post.title}\nExcerpt: ${post.excerpt}\nCategory: ${post.category}\nTags: ${post.tags?.join(", ") || ""}\n\nKeep it 150-200 words, professional tone, end with a question, include 3-4 relevant hashtags.`,
  },
  {
    id: "twitter",
    label: "Twitter / X",
    icon: Twitter,
    bg: "bg-slate-800",
    maxChars: 280,
    buildPrompt: (post) =>
      `Write a punchy Twitter/X post for Asaad Morman promoting this blog article:\n\nTitle: ${post.title}\nExcerpt: ${post.excerpt}\n\nMax 280 characters, 2-3 hashtags, no fluff.`,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    bg: "bg-gradient-to-br from-purple-600 to-pink-500",
    maxChars: 2200,
    buildPrompt: (post) =>
      `Write an Instagram caption for Asaad Morman promoting this blog article:\n\nTitle: ${post.title}\nExcerpt: ${post.excerpt}\n\nEngaging, 100-150 words, 5-8 relevant hashtags at the end.`,
  },
];

function SocialShareModal({ post, onClose }) {
  const [activePlatform, setActivePlatform] = useState("linkedin");
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState({});
  const [posting, setPosting] = useState({});
  const [done, setDone] = useState({});
  const [errors, setErrors] = useState({});

  const platform = SHARE_PLATFORMS.find(p => p.id === activePlatform);

  useEffect(() => {
    loadPlatform(activePlatform);
  }, [activePlatform]);

  const loadPlatform = async (pid) => {
    if (contents[pid] !== undefined) return; // already loaded
    setLoading(prev => ({ ...prev, [pid]: true }));
    try {
      const existing = await base44.entities.SocialPost.filter({ source_id: post.id, platform: pid });
      if (existing.length > 0 && existing[0].status !== "published") {
        setContents(prev => ({ ...prev, [pid]: existing[0].content }));
      } else {
        const p = SHARE_PLATFORMS.find(p => p.id === pid);
        const result = await base44.integrations.Core.InvokeLLM({ prompt: p.buildPrompt(post) });
        setContents(prev => ({ ...prev, [pid]: result }));
      }
    } catch {
      const p = SHARE_PLATFORMS.find(p => p.id === pid);
      setContents(prev => ({ ...prev, [pid]: `Check out my latest article: "${post.title}"\n\n${post.excerpt || ""}\n\n#Cybersecurity` }));
    }
    setLoading(prev => ({ ...prev, [pid]: false }));
  };

  const handlePost = async () => {
    const pid = activePlatform;
    setPosting(prev => ({ ...prev, [pid]: true }));
    setErrors(prev => ({ ...prev, [pid]: "" }));
    try {
      if (pid === "linkedin") {
        await postBlogToLinkedIn({ postContent: contents[pid], blogPostId: post.id });
      } else {
        // Save as approved SocialPost for non-LinkedIn (manual posting reminder)
        const existing = await base44.entities.SocialPost.filter({ source_id: post.id, platform: pid });
        if (existing.length > 0) {
          await base44.entities.SocialPost.update(existing[0].id, { content: contents[pid], status: "approved" });
        } else {
          await base44.entities.SocialPost.create({
            platform: pid, content: contents[pid], status: "approved",
            source_type: "blog", source_id: post.id, source_title: post.title
          });
        }
      }
      setDone(prev => ({ ...prev, [pid]: true }));
    } catch (e) {
      setErrors(prev => ({ ...prev, [pid]: e.message || "Failed to post" }));
    }
    setPosting(prev => ({ ...prev, [pid]: false }));
  };

  const content = contents[activePlatform] || "";
  const isLoading = loading[activePlatform];
  const isPosting = posting[activePlatform];
  const isDone = done[activePlatform];
  const error = errors[activePlatform];
  const PlatformIcon = platform?.icon;

  const [showPreview, setShowPreview] = useState(false);

  // Format content for LinkedIn preview (bold **text**, line breaks)
  const formatLinkedInPreview = (text) => {
    if (!text) return [];
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
      });
      return <p key={i} className={`${line === "" ? "h-3" : ""}`}>{parts}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full shadow-2xl transition-all duration-300 ${activePlatform === "linkedin" ? "max-w-4xl" : "max-w-xl"}`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-bold text-lg">Share to Social Media</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-slate-500 text-xs mb-4">Article: <span className="text-slate-300 font-medium">{post.title}</span></p>

        {/* Platform Tabs */}
        <div className="flex gap-2 mb-5">
          {SHARE_PLATFORMS.map(p => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => { setActivePlatform(p.id); setShowPreview(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  activePlatform === p.id
                    ? "bg-slate-700 text-white border-slate-500"
                    : "text-slate-400 border-slate-700 hover:border-slate-600 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {p.label}
                {done[p.id] && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        {isDone ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-white font-semibold">
              {activePlatform === "linkedin" ? "Posted to LinkedIn!" : `Saved as approved draft for ${platform?.label}`}
            </p>
            {activePlatform !== "linkedin" && (
              <p className="text-slate-400 text-sm mt-1">Head to Social Media Manager to publish manually.</p>
            )}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-cyan-400 animate-spin" /></div>
        ) : (
          <div className={`${activePlatform === "linkedin" ? "grid grid-cols-2 gap-6" : ""}`}>
            {/* Edit column */}
            <div>
              {activePlatform === "linkedin" && (
                <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">Edit Content</p>
              )}
              <textarea
                value={content}
                onChange={e => setContents(prev => ({ ...prev, [activePlatform]: e.target.value }))}
                rows={activePlatform === "linkedin" ? 12 : 7}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-slate-200 text-sm resize-none outline-none focus:border-cyan-500/60 leading-relaxed"
              />
              <div className="flex items-center justify-between mt-1.5 mb-4">
                <span className={`text-xs ${content.length > (platform?.maxChars || 9999) ? "text-red-400" : "text-slate-500"}`}>
                  {content.length}/{platform?.maxChars}
                </span>
                {error && <span className="text-red-400 text-xs">{error}</span>}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">Cancel</Button>
                <Button
                  onClick={handlePost}
                  disabled={isPosting || !content.trim() || content.length > (platform?.maxChars || 9999)}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2"
                >
                  {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {activePlatform === "linkedin" ? "Post to LinkedIn" : `Save & Approve for ${platform?.label}`}
                </Button>
              </div>
            </div>

            {/* LinkedIn Preview column */}
            {activePlatform === "linkedin" && (
              <div>
                <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">LinkedIn Preview</p>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  {/* LinkedIn post card */}
                  <div className="p-4">
                    {/* Author row */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                        A
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">Asaad Morman</p>
                        <p className="text-gray-500 text-xs leading-tight">Cybersecurity Entrepreneur · CEO @ Emerging Defense Solutions</p>
                        <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">Just now · <span className="text-blue-600">🌐</span></p>
                      </div>
                    </div>

                    {/* Post text */}
                    <div className="text-gray-800 text-sm leading-relaxed space-y-1 max-h-64 overflow-y-auto">
                      {formatLinkedInPreview(content)}
                    </div>

                    {/* Article link card if image exists */}
                    {post.image_url && (
                      <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                        <img src={post.image_url} alt={post.title} className="w-full h-28 object-cover" />
                        <div className="p-2 bg-gray-50">
                          <p className="text-xs font-semibold text-gray-800 truncate">{post.title}</p>
                          <p className="text-xs text-gray-500 truncate">{post.excerpt}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reaction bar */}
                  <div className="border-t border-gray-100 px-4 py-1.5 flex items-center gap-4 text-gray-500">
                    {["👍 Like", "💬 Comment", "🔁 Repost", "✈️ Send"].map(action => (
                      <button key={action} className="flex items-center gap-1 text-xs font-medium hover:text-blue-600 py-1.5 transition-colors">
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">Preview only — actual formatting may vary slightly</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Post List View ─────────────────────────────────────────────────────────────
export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const { isAdmin, loading } = useAdminAccess();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | published | draft
  const [socialSharePost, setSocialSharePost] = useState(null); // post to share

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        const all = await base44.entities.BlogPost.list("-created_date");
        setPosts(all);
      } catch {}
    };
    init();
  }, [isAdmin]);

  const reload = async () => {
    const all = await base44.entities.BlogPost.list("-created_date");
    setPosts(all);
    setEditing(null);
  };

  const deletePost = async (id) => {
    if (!confirm("Delete this post permanently?")) return;
    await base44.entities.BlogPost.delete(id);
    setPosts(posts.filter(p => p.id !== id));
  };

  const toggle = async (post, field) => {
    await base44.entities.BlogPost.update(post.id, { [field]: !post[field] });
    setPosts(posts.map(p => p.id === post.id ? { ...p, [field]: !p[field] } : p));
  };

  const changeStatus = async (post, newStatus) => {
    await base44.entities.BlogPost.update(post.id, { status: newStatus });
    setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
  };

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "published" ? p.published : !p.published);
    return matchSearch && matchFilter;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.published).length,
    drafts: posts.filter(p => !p.published).length,
    featured: posts.filter(p => p.featured).length,
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

  if (editing !== null) {
    return <BlogEditor post={editing} onSave={reload} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-6">
      {socialSharePost && <SocialShareModal post={socialSharePost} onClose={() => setSocialSharePost(null)} />}
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-cyan-400" /> Blog Manager
            </h1>
            <p className="text-slate-400 mt-1">Write and publish articles to your site</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to={createPageUrl("BlogCalendar")}>📅 Calendar</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to={createPageUrl("Blog")}>View Live Blog</Link>
            </Button>
            <Button onClick={() => setEditing({ ...emptyPost })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" /> New Article
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Articles", value: stats.total, icon: FileText, color: "text-slate-300" },
            { label: "Published", value: stats.published, icon: Eye, color: "text-green-400" },
            { label: "Drafts", value: stats.drafts, icon: Clock, color: "text-yellow-400" },
            { label: "Featured", value: stats.featured, icon: Star, color: "text-yellow-400" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                <Icon className={`w-6 h-6 ${s.color}`} />
                <div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..." className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
          </div>
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            {[["all", "All"], ["published", "Published"], ["draft", "Drafts"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === val ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Post List */}
        <div className="space-y-3">
          {filtered.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="bg-slate-900/60 border-slate-700/50 hover:border-slate-600 transition-all group">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs capitalize">{post.category?.replace(/-/g, " ")}</Badge>
                      {post.featured && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs border">⭐ Featured</Badge>}
                      {post.published
                        ? <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs border">Published</Badge>
                        : <Badge className="bg-slate-600/40 text-slate-400 border-slate-600 text-xs border">Draft</Badge>}
                      {post.status === "under-review" && <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs border">🔍 Under Review</Badge>}
                      {post.status === "published" && !post.published && <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs border">✅ Approved</Badge>}
                      {post.read_time && <span className="text-slate-600 text-xs">{post.read_time}</span>}
                      {post.attachment_url && (
                        <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs border gap-1">
                          <Paperclip className="w-2.5 h-2.5" /> Attachment
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight">{post.title || <span className="text-slate-600 italic">Untitled</span>}</h3>
                    {post.excerpt && <p className="text-slate-400 text-sm mt-1 line-clamp-1">{post.excerpt}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 flex-wrap">
                    <Select value={post.status || "draft"} onValueChange={v => changeStatus(post, v)}>
                      <SelectTrigger className="h-7 text-xs bg-slate-800 border-slate-600 text-slate-300 w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">📝 Draft</SelectItem>
                        <SelectItem value="under-review">🔍 Under Review</SelectItem>
                        <SelectItem value="published">✅ Published</SelectItem>
                      </SelectContent>
                    </Select>
                    {post.published && (
                      <Button size="sm" variant="ghost" onClick={() => setSocialSharePost(post)}
                        className="text-slate-400 hover:text-cyan-400 gap-1.5 text-xs">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setEditing({ ...post })}
                      className="text-slate-400 hover:text-cyan-400 gap-1.5 text-xs">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => toggle(post, "published")}
                      className="text-slate-400 hover:text-white" title={post.published ? "Unpublish" : "Publish"}>
                      {post.published ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => toggle(post, "featured")}
                      className="text-slate-400 hover:text-yellow-400" title="Toggle featured">
                      {post.featured ? <Star className="w-4 h-4 text-yellow-400" /> : <StarOff className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deletePost(post.id)}
                      className="text-slate-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-600">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No articles found</p>
              <p className="text-sm mt-1">Click "New Article" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}