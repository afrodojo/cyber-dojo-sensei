import React from "react";
import { motion } from "framer-motion";
import { Award, Shield, Star, BookOpen, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CertificationsGrid() {
  const certifications = [
    {
      name: "CompTIA Security+",
      issuer: "CompTIA",
      icon: Award,
      color: "from-green-500 to-teal-600",
      category: "Foundational"
    },
    {
      name: "CompTIA Network+",
      issuer: "CompTIA",
      icon: Award,
      color: "from-purple-500 to-indigo-600",
      category: "Networking"
    },
    {
      name: "Six Sigma Yellow Belt",
      issuer: "ASQ",
      icon: Star,
      color: "from-yellow-500 to-orange-600",
      category: "Process Improvement"
    },
    {
      name: "Scrum Fundamentals Certified",
      issuer: "ScrumStudy",
      icon: Users,
      color: "from-indigo-500 to-purple-600",
      category: "Agile/Scrum"
    },
    {
      name: "CompTIA Advanced Security Practitioner (CASP+)",
      issuer: "CompTIA",
      icon: Shield,
      color: "from-cyan-500 to-blue-600",
      category: "Advanced Security"
    },
    {
      name: "CompTIA A+",
      issuer: "CompTIA",
      icon: Award,
      color: "from-slate-500 to-slate-600",
      category: "Foundational"
    },
    {
      name: "Certified Chief Information Security Officer (CCISO)",
      issuer: "EC-Council",
      icon: Shield,
      color: "from-amber-500 to-orange-600",
      category: "Executive Leadership"
    },
    {
      name: "Computer Hacking Forensics Investigator (CHFI)",
      issuer: "EC-Council",
      icon: Target,
      color: "from-rose-500 to-red-600",
      category: "Digital Forensics"
    },
    {
      name: "Project Management Professional (PMP)",
      issuer: "Project Management Institute (PMI)",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      category: "Project Management"
    }
  ];

  const education = [
    {
      degree: "D.A.S., Computer Science",
      school: "Bowie State University",
      location: "Bowie, MD",
      period: "In Progress",
      featured: true
    },
    {
      degree: "B.S., Computer Information Systems – Security Administration",
      school: "Strayer University",
      location: "Alexandria, VA",
      period: "Sep 2008 – Jun 2011"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
          Certifications & Education
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Dedicated to continuous professional development, encompassing industry-recognized certifications and formal education in cybersecurity and information systems.
        </p>
      </motion.div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 group h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${cert.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <cert.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors leading-tight pb-2">
                      {cert.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">{cert.issuer}</p>
                    <Badge className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs">
                      {cert.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Education Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Card className="bg-slate-900/50 border-slate-800/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 pb-2">Education</h3>
                <p className="text-slate-400">Formal academic foundation in cybersecurity</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={idx} className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 pb-2">{edu.degree}</h4>
                    <p className={`font-semibold mb-1 ${edu.featured ? 'text-cyan-400' : 'text-slate-300'}`}>{edu.school}</p>
                    <p className="text-slate-400">{edu.location}</p>
                  </div>
                  <div className="flex items-center justify-start md:justify-end">
                    <Badge className="bg-slate-950 border-slate-800 text-slate-400 px-4 py-2 text-base">
                      {edu.period}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}