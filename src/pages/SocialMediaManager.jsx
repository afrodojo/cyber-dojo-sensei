import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Send, Bot, User, Loader2, AlertTriangle, Plus, Eye,
  CheckCircle2, Clock, XCircle, Linkedin, Twitter, Instagram,
  RefreshCw, Trash2, ThumbsUp, Zap
} from "lucide-react";
import { postCareerTransitionToLinkedIn } from "@/functions/postCareerTransitionToLinkedIn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MessageBubble from "@/components/social/MessageBubble";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const PLATFORM_ICONS = {
  linkedin: <Linkedin className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  facebook: <span className="text-xs font-bold">f</span>,
  tiktok: <span className="text-xs font-bold">TT</span>,
};

const PLATFORM_COLORS = {
  linkedin: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  twitter: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  facebook: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  tiktok: "bg-slate-500/20 text-slate-300 border-slate-400/30",
};

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: Clock },
  approved: { label: "Approved", color: "bg-green-500/20 text-green-300 border-green-500/30", icon: CheckCircle2 },
  published: { label: "Published", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", icon: CheckCircle2 },
  failed: { label: "Failed", color: "bg-red-500/20 text-red-300 border-red-500/30", icon: XCircle },
};

export default function SocialMediaManager() {
  const { isAdmin, loading } = useAdminAccess();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        await loadPosts();
        // Create a new conversation
        const conv = await base44.agents.createConversation({
          agent_name: "social_media_manager",
          metadata: { name: "Social Media Session" }
        });
        setConversation(conv);
        setMessages(conv.messages || []);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [isAdmin]);

  useEffect(() => {
    if (conversation?.id) {
      const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
        setMessages(data.messages || []);
      });
      return unsub;
    }
  }, [conversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadPosts = async () => {
    const all = await base44.entities.SocialPost.list("-created_date", 50);
    setPosts(all);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversation || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
    setSending(false);
    // Refresh posts after agent might have created/updated some
    setTimeout(loadPosts, 2000);
  };

  const handleApprove = async (post) => {
    await base44.entities.SocialPost.update(post.id, { status: "approved" });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: "approved" } : p));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    await base44.entities.SocialPost.delete(id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const [postingCareer, setPostingCareer] = useState(false);
  const [careerPostResult, setCareerPostResult] = useState(null);

  const handlePostCareerAdvice = async () => {
    setPostingCareer(true);
    setCareerPostResult(null);
    try {
      const res = await postCareerTransitionToLinkedIn({});
      setCareerPostResult({ success: true, content: res.data?.content });
      await loadPosts();
    } catch (e) {
      setCareerPostResult({ success: false, error: e.message });
    }
    setPostingCareer(false);
  };

  const startNewChat = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: "social_media_manager",
      metadata: { name: "Social Media Session" }
    });
    setConversation(conv);
    setMessages([]);
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
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400">Admin access required.</p>
      </div>
    </div>
  );

  const draftCount = posts.filter(p => p.status === "draft").length;
  const approvedCount = posts.filter(p => p.status === "approved").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                Social Media Manager
              </h1>
              <p className="text-slate-400 mt-1">AI-powered agent to manage your social media presence</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={startNewChat} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
                <Plus className="w-4 h-4" /> New Chat
              </Button>
              <Button onClick={loadPosts} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh Posts
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Posts", value: posts.length, color: "text-white" },
            { label: "Drafts", value: draftCount, color: "text-yellow-400" },
            { label: "Approved", value: approvedCount, color: "text-green-400" },
            { label: "Published", value: posts.filter(p => p.status === "published").length, color: "text-cyan-400" },
          ].map(stat => (
            <Card key={stat.label} className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-lg p-1 w-fit">
          {["chat", "posts"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                activeTab === tab ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "chat" ? "🤖 AI Chat" : `📋 Posts (${posts.length})`}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "chat" ? (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Chat */}
                <div className="lg:col-span-2">
                  <Card className="bg-slate-900/60 border-slate-700/50 flex flex-col" style={{ height: "600px" }}>
                    <CardHeader className="border-b border-slate-700/50 pb-4">
                      <CardTitle className="text-white flex items-center gap-2 text-base">
                        <Bot className="w-5 h-5 text-cyan-400" />
                        Social Media AI Agent
                        <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Active
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                          <Bot className="w-12 h-12 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">Ask me to draft social posts, announce your latest blog, or promote an upcoming webinar!</p>
                          <div className="mt-4 space-y-2">
                            {[
                              "Draft a LinkedIn post for my latest blog",
                              "Create a Twitter thread about my cybersecurity services",
                              "Announce my next webinar on all platforms",
                            ].map(s => (
                              <button key={s} onClick={() => setInput(s)} className="block w-full text-left px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors">
                                💬 {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {messages.map((msg, i) => (
                        <MessageBubble key={i} message={msg} />
                      ))}
                      {sending && (
                        <div className="flex gap-2 text-slate-500 text-sm items-center">
                          <Loader2 className="w-4 h-4 animate-spin" /> Agent is thinking...
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </CardContent>
                    <div className="p-4 border-t border-slate-700/50">
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          placeholder="Ask the agent to draft, edit, or manage posts..."
                          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!input.trim() || sending}
                          className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-40 text-white rounded-lg transition-all"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </Card>
                </div>

                {/* Quick Posts Sidebar */}
                <div>
                  <Card className="bg-slate-900/60 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-400" /> Recent Drafts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-[520px] overflow-y-auto">
                      {posts.filter(p => p.status === "draft").slice(0, 5).map(post => (
                        <div key={post.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge className={`${PLATFORM_COLORS[post.platform]} border text-xs flex items-center gap-1`}>
                              {PLATFORM_ICONS[post.platform]} {post.platform}
                            </Badge>
                            <button onClick={() => handleDelete(post.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-slate-300 text-xs line-clamp-3">{post.content}</p>
                          <button
                            onClick={() => handleApprove(post)}
                            className="w-full py-1.5 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 rounded-md transition-colors flex items-center justify-center gap-1"
                          >
                            <ThumbsUp className="w-3 h-3" /> Approve
                          </button>
                        </div>
                      ))}
                      {posts.filter(p => p.status === "draft").length === 0 && (
                        <p className="text-slate-500 text-sm text-center py-4">No drafts yet. Chat with the agent!</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-0">
                  {posts.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                      <Eye className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p>No posts yet. Chat with the agent to create some!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700/50 text-slate-400">
                            <th className="text-left px-6 py-3 font-medium">Platform</th>
                            <th className="text-left px-6 py-3 font-medium">Content</th>
                            <th className="text-left px-6 py-3 font-medium">Source</th>
                            <th className="text-left px-6 py-3 font-medium">Status</th>
                            <th className="text-left px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((post, i) => {
                            const sc = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;
                            const Icon = sc.icon;
                            return (
                              <motion.tr
                                key={post.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                                className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <Badge className={`${PLATFORM_COLORS[post.platform]} border flex items-center gap-1 w-fit`}>
                                    {PLATFORM_ICONS[post.platform]} {post.platform}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-slate-300 max-w-xs">
                                  <p className="line-clamp-2 text-xs">{post.content}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs capitalize">{post.source_type || "manual"}</td>
                                <td className="px-6 py-4">
                                  <Badge className={`${sc.color} border flex items-center gap-1 w-fit`}>
                                    <Icon className="w-3 h-3" /> {sc.label}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">
                                  {post.created_date ? new Date(post.created_date).toLocaleDateString() : "—"}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 justify-end">
                                    {post.status === "draft" && (
                                      <button
                                        onClick={() => handleApprove(post)}
                                        className="text-xs px-3 py-1 rounded bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 transition-colors"
                                      >
                                        Approve
                                      </button>
                                    )}
                                    <button onClick={() => handleDelete(post.id)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Career Transition LinkedIn Post */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border border-blue-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Linkedin className="w-8 h-8 text-blue-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" /> Post Cybersecurity Career Transition Advice
              </h3>
              <p className="text-slate-400 text-sm mt-1">AI-generates and instantly posts personalized career transition advice to your LinkedIn feed as Asaad Morman.</p>
              {careerPostResult && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${careerPostResult.success ? "bg-green-500/10 border border-green-500/30 text-green-300" : "bg-red-500/10 border border-red-500/30 text-red-300"}`}>
                  {careerPostResult.success ? (
                    <><CheckCircle2 className="w-4 h-4 inline mr-1" /> Posted successfully to LinkedIn!</>
                  ) : (
                    <>Failed: {careerPostResult.error}</>
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={handlePostCareerAdvice}
              disabled={postingCareer}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 flex-shrink-0"
            >
              {postingCareer ? <Loader2 className="w-4 h-4 animate-spin" /> : <Linkedin className="w-4 h-4" />}
              {postingCareer ? "Posting..." : "Post to LinkedIn"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}