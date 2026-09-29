import React from "react";
import { motion } from "framer-motion";
import ResourceHub from "../components/portfolio/ResourceHub";

export default function Resources() {
  return (
    <div className="overflow-x-hidden">
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Cybersecurity Resources
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Free, practical cybersecurity resources created from real-world experience. 
              Strengthen your security posture with proven methodologies and frameworks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resource Hub */}
      <section className="py-20 bg-slate-950">
        <ResourceHub />
      </section>
    </div>
  );
}