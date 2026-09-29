import React from "react";
import { motion } from "framer-motion";
import PublicationsSection from "../components/portfolio/PublicationsSection";
import { BookMarked } from "lucide-react";

export default function Publications() {
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
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <BookMarked className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Books & Publications
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8" />
                    <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
                        Sharing knowledge and expertise with the cybersecurity community through in-depth publications on advanced topics.
                    </p>
                </motion.div>
            </div>
        </section>

        {/* Publications Section */}
        <section className="pb-20 bg-slate-950">
            <PublicationsSection />
        </section>
    </div>
  );
}