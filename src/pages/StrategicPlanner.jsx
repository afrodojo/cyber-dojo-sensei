import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, AlertCircle, Loader2, Plus, MessageCircle } from "lucide-react";
import MessageBubble from "../components/social/MessageBubble";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function StrategicPlanner() {
  const { isAdmin, loading } = useAdminAccess();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        // Initialize conversation
        const conv = await base44.agents.createConversation({
          agent_name: "strategic_planner",
          metadata: {
            name: "Strategic Planning Session",
            description: "Strategic analysis and business planning conversation"
          }
        });
        setConversation(conv);
      } catch (error) {
        console.error("Failed to initialize:", error);
      }
    };
    init();
  }, []);

  // Subscribe to conversation updates
  useEffect(() => {
    if (!conversation?.id) return;

    setIsLoadingMessages(true);
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
      setIsLoadingMessages(false);
    });

    return unsubscribe;
  }, [conversation?.id]);

  const handleSendMessage = async () => {
    if (!input.trim() || !conversation) return;

    setSending(true);
    try {
      await base44.agents.addMessage(conversation, {
        role: "user",
        content: input.trim()
      });
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const conv = await base44.agents.createConversation({
        agent_name: "strategic_planner",
        metadata: {
          name: "Strategic Planning Session",
          description: "Strategic analysis and business planning conversation"
        }
      });
      setConversation(conv);
      setMessages([]);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const whatsappUrl = base44.agents.getWhatsAppConnectURL('strategic_planner');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Strategic Planner</h1>
                <p className="text-slate-400">AI-powered strategic analysis and business planning</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <Button
                onClick={handleNewConversation}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[70vh]"
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg mb-2">Welcome to Strategic Planner</p>
                  <p className="text-slate-500 text-sm max-w-md">
                    Ask for strategic analysis, business recommendations, market insights, or help with planning and decision-making.
                  </p>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <MessageBubble message={msg} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-800 p-6 bg-slate-800/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for strategic analysis, market insights, or recommendations..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={sending || !input.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Available Data</p>
            <p className="text-white font-semibold">Analytics, Opportunities, Leads</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Use Cases</p>
            <p className="text-white font-semibold">Strategy, Market Analysis, Planning</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">AI Model</p>
            <p className="text-white font-semibold">Claude (Anthropic)</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}