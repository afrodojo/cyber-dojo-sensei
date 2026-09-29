
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BlogPost } from "@/entities/BlogPost";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, BookOpen, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function BlogManager() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetchPosts = async () => {
      try {
        const user = await User.me();
        if (user && user.role === 'admin') {
          setIsAdmin(true);
          const posts = await BlogPost.list('-created_date');
          setBlogPosts(posts);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking user or fetching posts:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkUserAndFetchPosts();
  }, []);

  const handleCopyMarkdown = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Markdown content copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-white">
        <div className="text-center p-8 bg-slate-900 rounded-lg border border-red-500/30">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2 pb-2">Access Denied</h1>
            <p className="text-slate-400 max-w-md">You do not have permission to view this page. Please log in as an administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
            Blog Migration Assistant
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Copy the markdown for each post below and paste it into your external blog.
          </p>
        </motion.div>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white mb-2 pb-2">{post.title}</CardTitle>
                    <div className="flex gap-2">
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{post.category}</Badge>
                        {post.tags?.map(tag => <Badge key={tag} variant="outline" className="text-slate-300 border-slate-600">{tag}</Badge>)}
                    </div>
                  </div>
                   <Button onClick={() => handleCopyMarkdown(post.content)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Markdown
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 italic mb-6">{post.excerpt}</p>
                  <div className="prose prose-invert prose-sm max-w-none p-4 border border-slate-700 rounded-lg bg-slate-900/50 text-slate-200">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
