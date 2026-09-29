
import React from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";
import SecurityAssessmentTool from "../components/assessment/SecurityAssessmentTool";

export default function SecurityAssessment() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
            Free Security Assessment
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Get an instant security risk score for your organization. This 5-minute assessment provides actionable insights into your current security posture.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Quick 5-minute assessment</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Instant security score</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Actionable recommendations</span>
            </div>
          </div>
        </motion.div>

        <SecurityAssessmentTool />
      </div>
    </div>
  );
}
