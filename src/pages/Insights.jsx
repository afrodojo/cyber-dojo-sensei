import React from "react";
import { motion } from "framer-motion";
import BlogSection from "../components/portfolio/BlogSection";

export default function Insights() {
    return (
        <div className="min-h-screen bg-slate-950 overflow-x-hidden">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Cybersecurity Insights
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Expert insights and strategic thinking from the frontlines of offensive cybersecurity.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Blog Content Section */}
            <section className="py-20 bg-slate-950">
                <BlogSection />
            </section>
        </div>
    );
}