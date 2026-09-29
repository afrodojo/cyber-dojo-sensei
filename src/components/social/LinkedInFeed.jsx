import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Linkedin, ExternalLink, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LinkedInFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const linkedinPosts = await base44.entities.SocialPost.filter(
          { platform: "linkedin", status: "published" },
          "-published_at",
          10
        );
        setPosts(linkedinPosts);
      } catch (error) {
        console.error("Failed to load LinkedIn posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!posts.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <Linkedin className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-white">Latest LinkedIn Updates</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-blue-500" />
                  <span className="text-xs text-slate-400">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                {post.source_type && (
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">
                    {post.source_type === "blog"
                      ? "Blog Update"
                      : "Security Insight"}
                  </span>
                )}
              </div>

              <p className="text-slate-200 text-sm leading-relaxed line-clamp-4 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.hashtags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs text-cyan-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
              >
                <a
                  href={`https://www.linkedin.com/feed/update/${post.platform_post_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View on LinkedIn
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <a
              href="https://www.linkedin.com/in/asaad-morman"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4" />
              Follow on LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}