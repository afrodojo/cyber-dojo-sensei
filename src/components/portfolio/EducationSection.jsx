import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Award } from "lucide-react";
import TerminalText from "@/components/portfolio/TerminalText";
// Education credentials — Doctor of Applied Science (D.A.S.), Bowie State University

export default function EducationSection() {
  const education = [
    {
      institution: "Bowie State University",
      degree: "Doctor of Applied Science (D.A.S.) in Computer Science",
      period: "In Progress",
      status: "Doctoral Candidate",
      description: "Doctoral Candidate in the Department of Computer Science, Center for Cyber Security and Emerging Technologies. Research focused on applied AI, zero-trust architectures, and cybersecurity defense.",
      icon: GraduationCap,
      featured: true,
    },
    {
      institution: "Strayer University",
      degree: "Bachelor of Science (BS) in Information Systems",
      period: "Completed",
      status: "Alumni",
      description: "Earned a Bachelor's degree in Information Systems, building a strong foundation in systems architecture, data management, and enterprise technology.",
      icon: BookOpen,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-ninja-void to-ninja-surface">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ninja-green/10 border border-ninja-green/30 rounded-2xl mb-6 ninja-glow">
            <GraduationCap className="w-8 h-8 text-ninja-green" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Education
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-ninja-green to-emerald-500 mx-auto mb-6" />
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Committed to continuous learning and academic excellence in computer science and cybersecurity.
          </p>
        </motion.div>

        <div className="space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-ninja-surface shuriken-clip shuriken-stroke rounded-2xl p-8 hover:ninja-glow transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-ninja-green/10 border border-ninja-green/30 rounded-xl flex items-center justify-center">
                      <edu.icon className="w-7 h-7 text-ninja-green" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-foreground">{edu.institution}</h3>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-ninja-green/10 border border-ninja-green/30 text-ninja-green text-xs font-semibold rounded-full">
                        <Award className="w-3 h-3" />
                        {edu.status}
                      </span>
                    </div>
                    <p className="text-lg text-ninja-green font-semibold mb-1">{edu.degree}</p>
                    <p className="text-sm text-foreground/50 mb-4">{edu.period}</p>
                    <p className="text-foreground/80 leading-relaxed"><TerminalText text={edu.description} /></p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}