import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Archive, Trash2 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import AgentChatInterface from "../components/agent/AgentChatInterface";
import { motion } from "framer-motion";

export default function AgentChatPage() {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conv_id");
  const agentName = searchParams.get("agent");
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === "admin");

        if (conversationId) {
          const conv = await base44.agents.getConversation(conversationId);
          setConversation(conv);
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [conversationId]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">Agent chats are restricted to administrators.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <p className="text-slate-400">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to={createPageUrl("Portfolio")} className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {conversation?.metadata?.name || agentName || "Agent Chat"}
              </h1>
              <p className="text-slate-400 text-sm">
                {conversation?.metadata?.description || `Chat with ${agentName} agent`}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-slate-700 hover:bg-slate-800"
                title="Archive conversation"
              >
                <Archive className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-700 hover:bg-slate-800 hover:text-red-400"
                title="Delete conversation"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-[600px] flex flex-col"
        >
          <AgentChatInterface
            agentName={agentName || conversation?.agent_name}
            conversationId={conversationId}
          />
        </motion.div>

        {/* Conversation Stats */}
        {conversation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 grid md:grid-cols-3 gap-4"
          >
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-sm text-slate-400">Messages</p>
              <p className="text-2xl font-bold text-white">{conversation.total_messages || 0}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-sm text-slate-400">Status</p>
              <p className="text-2xl font-bold text-cyan-400 capitalize">{conversation.status || "Active"}</p>
            </div>
            {conversation.average_rating && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400">Avg Rating</p>
                <p className="text-2xl font-bold text-white">
                  {conversation.average_rating.toFixed(1)} / 5
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}