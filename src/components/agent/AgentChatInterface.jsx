import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Copy, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";

export default function AgentChatInterface({ agentName, conversationId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [ratingMessage, setRatingMessage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadConversation = async () => {
      try {
        if (conversationId) {
          const conversation = await base44.agents.getConversation(conversationId);
          setMessages(conversation.messages || []);
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();

    // Subscribe to real-time updates
    if (conversationId) {
      const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
        setMessages(data.messages || []);
        setTypingIndicator(false);
      });
      return unsubscribe;
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingIndicator]);

  const handleFileAttach = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setAttachedFiles(prev => [...prev, { name: file.name, url: file_url }]);
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    setSending(true);
    setTypingIndicator(true);

    try {
      const conversation = conversationId 
        ? await base44.agents.getConversation(conversationId)
        : await base44.agents.createConversation({ agent_name: agentName });

      await base44.agents.addMessage(conversation, {
        role: "user",
        content: input,
        file_urls: attachedFiles.map(f => f.url)
      });

      setInput("");
      setAttachedFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setTypingIndicator(false);
    } finally {
      setSending(false);
    }
  };

  const handleRateMessage = async (messageId, rating, feedback) => {
    // Update message with rating
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, rating, rating_feedback: feedback } : msg
    );
    setMessages(updatedMessages);
    setRatingMessage(null);

    // Could save to database if needed
    try {
      if (conversationId) {
        await base44.agents.updateConversation(conversationId, {
          messages: updatedMessages
        });
      }
    } catch (error) {
      console.error("Failed to save rating:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-lg border border-slate-700/50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, idx) => (
            <motion.div
              key={message.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MessageBubble 
                message={message} 
                onRate={(rating, feedback) => handleRateMessage(message.id, rating, feedback)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {typingIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 p-4"
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attached Files Preview */}
      {attachedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-3 bg-slate-800/50 border-t border-slate-700/50"
        >
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, idx) => (
              <div
                key={idx}
                className="bg-slate-700/50 rounded px-3 py-1 text-sm text-slate-300 flex items-center gap-2"
              >
                <Paperclip className="w-3 h-3" />
                {file.name}
                <button
                  onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                  className="text-slate-500 hover:text-slate-300 ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-700/50 p-4">
        <div className="flex gap-3">
          <input
            type="file"
            multiple
            onChange={handleFileAttach}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="border-slate-700 hover:bg-slate-800 cursor-pointer"
            >
              <span>
                <Paperclip className="w-4 h-4" />
              </span>
            </Button>
          </label>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask the agent..."
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />

          <Button
            onClick={handleSendMessage}
            disabled={sending || (!input.trim() && attachedFiles.length === 0)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}