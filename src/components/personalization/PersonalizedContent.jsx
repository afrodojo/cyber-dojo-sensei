import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

export default function PersonalizedContent({ pageName, contentType, defaultContent, limit = 3, children }) {
  const [content, setContent] = useState(defaultContent || []);
  const [personalizationScore, setPersonalizationScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Get or create session ID
        let sessionId = localStorage.getItem('user_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('user_session_id', sessionId);
        }

        // Get personalization data
        const result = await base44.functions.invoke('personalizeContent', {
          session_id: sessionId,
          page_context: {
            current_page: pageName,
            time_spent: 0,
            interaction_type: contentType
          }
        });

        // Use personalized recommendations
        if (result?.recommendations) {
          let personalized = [];
          
          if (contentType === 'blog_posts' && result.recommendations.featured_blog_posts) {
            personalized = result.recommendations.featured_blog_posts;
          } else if (contentType === 'case_studies' && result.recommendations.featured_case_studies) {
            personalized = result.recommendations.featured_case_studies;
          } else if (contentType === 'webinars' && result.recommendations.recommended_webinars) {
            personalized = result.recommendations.recommended_webinars;
          }

          if (personalized.length > 0) {
            setContent(personalized.slice(0, limit));
          }
        }
      } catch (error) {
        console.error('Personalization failed, using defaults:', error);
        setContent(defaultContent || []);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [pageName, contentType, defaultContent, limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(limit).fill(0).map((_, idx) => (
          <div key={idx} className="h-24 bg-slate-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {content.length === 0 ? (
        <p className="text-slate-400">No content available</p>
      ) : (
        content.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            {item.personalization_score > 0.3 && (
              <div className="absolute top-0 right-0 bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full">
                Recommended for you
              </div>
            )}
            {children ? children(item) : <div className="text-white">{item.title}</div>}
          </motion.div>
        ))
      )}
    </div>
  );
}