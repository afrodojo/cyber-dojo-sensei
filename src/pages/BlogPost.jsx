import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '@/entities/BlogPost';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import SEOHead from '../components/seo/SEOHead';

export default function BlogPostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (id) {
                try {
                    const fetchedPost = await BlogPost.get(id);
                    setPost(fetchedPost);
                } catch (error) {
                    console.error("Failed to fetch blog post:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading post...</div>
            </div>
        );
    }

    if (!post) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
                <p className="text-slate-400 mb-8">The blog post you're looking for doesn't exist or may have been moved.</p>
                <Link to={createPageUrl("Insights")} className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Insights
                </Link>
            </div>
        );
    }

    return (
        <div className="py-12 md:py-20 bg-slate-950 text-white">
            <SEOHead 
                title={post.meta_title || post.title}
                description={post.meta_description || post.excerpt}
                type="article"
                blogPost={post}
            />
            <div className="max-w-4xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="mb-8">
                        <Link to={createPageUrl("Insights")} className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to All Insights
                        </Link>
                    </div>
                    <Badge className="bg-cyan-900/50 text-cyan-300 border-cyan-500/30 mb-4">{post.category}</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 mb-8 border-y border-slate-800 py-4">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>By Asaad Morman</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.read_time}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="prose prose-invert prose-lg max-w-none prose-h2:text-3xl prose-h2:font-bold prose-h2:text-cyan-300 prose-p:leading-relaxed prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-blockquote:border-l-cyan-400 prose-img:rounded-xl"
                >
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </motion.div>

                {post.tags && post.tags.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-12 pt-8 border-t border-slate-800"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Tag className="w-5 h-5"/> Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">{tag}</Badge>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}