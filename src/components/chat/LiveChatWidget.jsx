import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Send, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageBubble from "../social/MessageBubble";

export default function LiveChatWidget({ pageName = "default" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpen, setHasBeenOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [agentReady, setAgentReady] = useState(false);
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasBeenOpen) {
      initializeChat();
      setHasBeenOpen(true);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [isOpen, hasBeenOpen]);

  const initializeChat = async () => {
    try {
      const newConversation = await base44.agents.createConversation({
        agent_name: "live_chat_support",
        metadata: {
          name: `Chat - ${pageName}`,
          description: `Live chat conversation from ${pageName}`,
          page: pageName,
          timestamp: new Date().toISOString()
        }
      });
      setConversation(newConversation);
      setMessages(newConversation.messages || []);
      setAgentReady(true);

      // Subscribe to conversation updates
      unsubscribeRef.current = base44.agents.subscribeToConversation(
        newConversation.id,
        (updatedConversation) => {
          setMessages(updatedConversation.messages || []);
        }
      );

      // Send initial greeting
      if (!newConversation.messages || newConversation.messages.length === 0) {
        await base44.agents.addMessage(newConversation, {
          role: "user",
          content: `Hi! I'm visiting the ${pageName} page and would like to learn more about the services offered.`
        });
      }
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      setAgentReady(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversation || sending) return;

    const userMessage = input;
    setInput("");
    setSending(true);

    try {
      await base44.agents.addMessage(conversation, {
        role: "user",
        content: userMessage
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setInput(userMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40 flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6" />
            <div className="absolute bottom-full right-0 mb-2 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Need help? Chat with us!
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 w-96 max-h-[600px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold">Live Chat Support</h3>
                <p className="text-cyan-100 text-xs">
                  {agentReady ? "Online" : "Connecting..."}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-cyan-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
              {!agentReady && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Initializing chat...</p>
                  </div>
                </div>
              )}

              {agentReady && messages.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No messages yet</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} />
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {agentReady && (
              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-700 p-4 bg-slate-900"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:border-cyan-500 outline-none disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}