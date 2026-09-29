import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Bot, Send, Loader2, Plus, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MessageBubble from "@/components/social/MessageBubble";

const STARTER_PROMPTS = [
  "Write a weekly expert article about red team operations and insider threats",
  "Draft an article on cybersecurity leadership for small defense contractors",
  "Create an article on the intersection of 2A legislation and cybersecurity risks",
  "Write about nation-state threat actors targeting critical infrastructure",
  "Draft an expert piece on physical security and hybrid threat assessment",
];

export default function AgentArticleChat({ onArticleCreated }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    if (conversation?.id) {
      const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
        setMessages(data.messages || []);
        // If agent saved an article, notify parent
        const lastMsg = data.messages?.[data.messages.length - 1];
        if (lastMsg?.role !== "user" && lastMsg?.content?.toLowerCase().includes("pending review")) {
          onArticleCreated?.();
        }
      });
      return unsub;
    }
  }, [conversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initConversation = async () => {
    try {
      const conv = await base44.agents.createConversation({
        agent_name: "content_strategist",
        metadata: { name: "Weekly Content Session" }
      });
      setConversation(conv);
      setMessages(conv.messages || []);
    } catch {}
    setLoading(false);
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !conversation || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
    setSending(false);
  };

  const sendPrompt = (prompt) => {
    setInput(prompt);
    setTimeout(() => {
      if (!sending && conversation) {
        base44.agents.addMessage(conversation, { role: "user", content: prompt });
      }
    }, 100);
  };

  const startNewSession = async () => {
    setLoading(true);
    setConversation(null);
    setMessages([]);
    await initConversation();
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Chat */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-900/60 border-slate-700/50 flex flex-col" style={{ height: "620px" }}>
          <CardHeader className="border-b border-slate-700/50 pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Content Strategist
              <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Active
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium text-slate-400 mb-1">Expert Article Writer</p>
                <p className="text-xs mb-4">I'll write expert-level cybersecurity articles in your voice for your review. Every article goes to Pending Review before anything is published.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {sending && (
              <div className="flex gap-2 text-slate-500 text-sm items-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Agent is writing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 border-t border-slate-700/50">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Tell the agent what to write, or pick a topic below..."
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

      {/* Sidebar */}
      <div className="space-y-4">
        <Card className="bg-slate-900/60 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Quick Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {STARTER_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => sendPrompt(prompt)}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-xs transition-colors border border-slate-700/30 hover:border-slate-600/50 leading-snug"
              >
                ✍️ {prompt}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-purple-900/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bot className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-white text-sm font-semibold mb-1">Approval Required</p>
                <p className="text-purple-300 text-xs leading-relaxed">All AI-written articles go to <span className="font-semibold">Pending Review</span> first. Nothing posts automatically — you review and approve each piece before it goes live.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={startNewSession} variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
          <Plus className="w-4 h-4" /> Start New Session
        </Button>
      </div>
    </div>
  );
}