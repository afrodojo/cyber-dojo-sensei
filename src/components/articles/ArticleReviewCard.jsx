import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  FileText, ChevronDown, ChevronUp, CheckCircle2, XCircle,
  Linkedin, Twitter, Instagram, Send, Loader2, Eye, Clock, Bot
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { processArticleSubmission } from "@/functions/processArticleSubmission";

const STATUS_CONFIG = {
  pending: { label: "Pending Review", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: Clock },
  approved: { label: "Approved", color: "bg-green-500/20 text-green-300 border-green-500/30", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-300 border-red-500/30", icon: XCircle },
  published: { label: "Published", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", icon: CheckCircle2 },
};

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "twitter", label: "Twitter/X", icon: Twitter },
  { id: "instagram", label: "Instagram", icon: Instagram },
];

export default function ArticleReviewCard({ article, onUpdate, readOnly = false }) {
  const [expanded, setExpanded] = useState(false);
  const [approving, setApproving] = useState(false);
  const [publishing, setPublishing] = useState(null); // platform id
  const [socialDrafts, setSocialDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(article.social_platforms || ["linkedin"]);

  const sc = STATUS_CONFIG[article.status] || STATUS_CONFIG.pending;
  const StatusIcon = sc.icon;

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleExpand = async () => {
    setExpanded(v => !v);
    if (!expanded && article.status === "approved" && article.social_post_ids?.length > 0) {
      setLoadingDrafts(true);
      const drafts = await Promise.all(
        article.social_post_ids.map(id => base44.entities.SocialPost.get ? base44.entities.SocialPost.filter({ id }) : Promise.resolve([]))
      );
      setSocialDrafts(drafts.flat());
      setLoadingDrafts(false);
    }
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      await processArticleSubmission({
        articleId: article.id,
        action: "approve",
        platforms: selectedPlatforms,
        publishAsBlog: true
      });
      onUpdate?.();
    } catch (err) {
      alert(err.message || "Approval failed");
    }
    setApproving(false);
  };

  const handleReject = async () => {
    if (!confirm("Mark this article as rejected?")) return;
    await base44.entities.ArticleSubmission.update(article.id, { status: "rejected" });
    onUpdate?.();
  };

  const handlePublishLinkedIn = async (draft) => {
    setPublishing(draft.id);
    try {
      await processArticleSubmission({
        articleId: article.id,
        action: "publish_linkedin",
        postContent: draft.content,
        socialPostId: draft.id
      });
      onUpdate?.();
    } catch (err) {
      alert(err.message || "Publishing failed");
    }
    setPublishing(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden">
        {/* Header */}
        <div
          className="p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
          onClick={handleExpand}
        >
          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            {article.source === "agent" ? <Bot className="w-5 h-5 text-cyan-400" /> : <FileText className="w-5 h-5 text-slate-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge className={`${sc.color} border flex items-center gap-1 text-xs`}>
                <StatusIcon className="w-3 h-3" /> {sc.label}
              </Badge>
              {article.source === "agent" && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 border text-xs">🤖 AI Written</Badge>
              )}
              {article.file_name && (
                <span className="text-slate-500 text-xs">{article.file_name}</span>
              )}
            </div>
            <h3 className="text-white font-semibold text-lg leading-tight">{article.title || "Untitled Article"}</h3>
            {article.extracted_content && (
              <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                {article.extracted_content.replace(/[#*]/g, "").substring(0, 150)}...
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <span className="text-xs text-slate-500">
              {article.created_date ? new Date(article.created_date).toLocaleDateString() : ""}
            </span>
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-700/50"
            >
              <div className="p-5 space-y-5">
                {/* Content preview */}
                {article.extracted_content && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Article Content</p>
                    <div className="bg-slate-800/50 rounded-xl p-4 max-h-64 overflow-y-auto text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {article.extracted_content}
                    </div>
                  </div>
                )}

                {/* Pending review actions */}
                {!readOnly && article.status === "pending" && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Generate social posts for (after approval):</p>
                      <div className="flex gap-3 flex-wrap">
                        {PLATFORMS.map(({ id, label, icon: Icon }) => (
                          <button
                            key={id}
                            onClick={() => togglePlatform(id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all ${
                              selectedPlatforms.includes(id)
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                                : "bg-slate-800/50 text-slate-500 border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" /> {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApprove}
                        disabled={approving}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                      >
                        {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Approve & Generate Social Drafts
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="outline"
                        className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </div>
                )}

                {/* Approved — show social drafts */}
                {article.status === "approved" && (
                  <div>
                    <p className="text-sm text-slate-400 mb-3">Social Media Drafts — ready to post:</p>
                    {loadingDrafts ? (
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading drafts...
                      </div>
                    ) : (
                      <SocialDraftsForArticle articleId={article.id} />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SocialDraftsForArticle({ articleId }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(null);
  const [editContent, setEditContent] = useState({});

  React.useEffect(() => {
    base44.entities.SocialPost.filter({ source_id: articleId }).then(d => {
      setDrafts(d);
      setLoading(false);
    });
  }, [articleId]);

  const handlePublishLinkedIn = async (draft) => {
    setPublishing(draft.id);
    try {
      await processArticleSubmission({
        articleId,
        action: "publish_linkedin",
        postContent: editContent[draft.id] ?? draft.content,
        socialPostId: draft.id
      });
      setDrafts(prev => prev.map(d => d.id === draft.id ? { ...d, status: "published" } : d));
    } catch (err) {
      alert(err.message || "Publish failed");
    }
    setPublishing(null);
  };

  if (loading) return <div className="text-slate-500 text-sm flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;
  if (drafts.length === 0) return <p className="text-slate-500 text-sm">No social drafts yet.</p>;

  const platformColors = { linkedin: "text-blue-400", twitter: "text-sky-400", instagram: "text-pink-400" };
  const platformIcons = { linkedin: Linkedin, twitter: Twitter, instagram: Instagram };

  return (
    <div className="space-y-3">
      {drafts.map(draft => {
        const Icon = platformIcons[draft.platform] || FileText;
        const content = editContent[draft.id] ?? draft.content;
        return (
          <div key={draft.id} className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-2 text-sm font-medium ${platformColors[draft.platform]}`}>
                <Icon className="w-4 h-4" /> {draft.platform}
              </span>
              <Badge className={
                draft.status === "published" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 border text-xs" :
                "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 border text-xs"
              }>
                {draft.status}
              </Badge>
            </div>
            <textarea
              value={content}
              onChange={e => setEditContent(prev => ({ ...prev, [draft.id]: e.target.value }))}
              rows={5}
              disabled={draft.status === "published"}
              className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 text-slate-300 text-sm resize-none outline-none focus:border-cyan-500/50 disabled:opacity-60"
            />
            {draft.platform === "linkedin" && draft.status !== "published" && (
              <Button
                onClick={() => handlePublishLinkedIn(draft)}
                disabled={publishing === draft.id}
                className="bg-[#0077B5] hover:bg-[#005f91] text-white gap-2 text-sm"
              >
                {publishing === draft.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Post to LinkedIn
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}