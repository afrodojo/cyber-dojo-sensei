import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function PersonalizedBlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        let sessionId = localStorage.getItem('user_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('user_session_id', sessionId);
        }

        const result = await base44.functions.invoke('personalizeContent', {
          session_id: sessionId,
          page_context: { current_page: 'Portfolio', time_spent: 0 }
        });

        if (result?.recommendations?.featured_blog_posts) {
          setPosts(result.recommendations.featured_blog_posts);
        } else {
          const allPosts = await base44.entities.BlogPost.filter({ published: true }, '-created_date', 3);
          setPosts(allPosts || []);
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, idx) => (
          <div key={idx} className="h-32 bg-slate-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {posts.map((post, idx) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-700 rounded-lg p-4 transition-all cursor-pointer"
        >
          <Link to={createPageUrl(`BlogPostDetail?id=${post.id}`)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-400 capitalize">{post.category}</span>
                  {post.personalization_score > 0.3 && (
                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full ml-auto">
                      Personalized
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  {post.read_time && <span>{post.read_time}</span>}
                  {post.created_date && (
                    <span>{new Date(post.created_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}