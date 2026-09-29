import React from "react";
import { motion } from "framer-motion";
import { Shield, Star, Award, Users, ChevronRight, Target, Crosshair, ExternalLink, BookOpen, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MilitaryService() {
  const militaryStats = [
    { icon: Shield, label: "Years of Service", value: "7+", color: "text-red-400" },
    { icon: Star, label: "Branch", value: "US Marines", color: "text-yellow-400" },
    { icon: Award, label: "Security Clearance", value: "TS/SCI", color: "text-blue-400" },
    { icon: Users, label: "Martial Arts", value: "MCMAP 1st Dan", color: "text-purple-400" }
  ];

  const firearmsCerts = [
    { name: "NRA-Certified Firearms Safety Instructor", org: "National Rifle Association", icon: "🎯" },
    { name: "Concealed Carry / CHP Instructor", org: "Multi-State (DC, MD, VA, UT)", icon: "🛡️" },
    { name: "MCMAP Black Belt Instructor — 1st Degree", org: "United States Marine Corps", icon: "🥋" },
    { name: "Executive Protection Specialist", org: "EDS Defense Division", icon: "🕴️" },
    { name: "Drone Surveillance Operator", org: "EDS Defense Division", icon: "🚁" },
  ];

  const edsCourses = [
    { name: "Babysitter CPR Bootcamp (Ages 12–17)", level: "Beginner", duration: "4h", price: "$40", icon: "🚑" },
    { name: "Heartsaver First-Aid CPR AED Training Certification", level: "All Levels", duration: "4h", price: "$50", icon: "🚑" },
    { name: "Basic Life Support (BLS) CPR Certification Course", level: "Intermediate", duration: "4h", price: "$75", icon: "🚑" },
    { name: "Basic Pistol & Firearms Safety Course – Virginia", level: "Beginner", duration: "5h", price: "$75", icon: "🎯" },
    { name: "Virginia Concealed Carry Certification Course", level: "Intermediate", duration: "5h", price: "$75", icon: "🎯" },
    { name: "Basic Pistol & Firearms Safety Course – DC", level: "Beginner", duration: "5h", price: "$75", icon: "🎯" },
    { name: "District of Columbia Concealed Carry Certification Course", level: "Intermediate", duration: "5h", price: "$75", icon: "🎯" },
    { name: "Maryland Handgun Qualification License (HQL) Course", level: "Beginner", duration: "5h", price: "$75", icon: "🎯" },
    { name: "Maryland Wear & Carry Permit Certification Course", level: "Intermediate", duration: "5h", price: "$75", icon: "🎯" },
    { name: "Live Fire Pistol Shooting Course (Range Training)", level: "All Levels", duration: "1h/session", price: "$75/hr", icon: "🎯" },
  ];

  const epExperience = [
    {
      role: "Co-Founder & CEO",
      org: "Emerging Defense Solutions — EDS Defense Division",
      highlights: [
        "Designed and delivered executive protection curricula for corporate and high-net-worth clients",
        "Conducted comprehensive threat assessments and advance-work operations for principal protection",
        "Led close protection details covering travel security, motorcade operations, and event overwatch",
        "Developed Standard Operating Procedures (SOPs) for emergency communications and crisis response",
        "Deployed drone surveillance for perimeter sweeps, real-time monitoring, and search support",
        "Built corporate active shooter response and safety training programs",
      ]
    },
    {
      role: "MCMAP Black Belt Instructor — 1st Degree",
      org: "United States Marine Corps",
      highlights: [
        "Trained active-duty combat personnel in Marine Corps Martial Arts Program (MCMAP)",
        "Developed advanced close-quarters combat and hand-to-hand fighting curriculum",
        "Mentored junior instructors in martial arts pedagogy and real-world combat application",
        "Applied ground-combat and control techniques to high-pressure, live-training scenarios",
      ]
    },
  ];

  const militaryPositions = [
    {
      title: "Basic Training, Combat Training & Aviation Technical Schools",
      period: "May 2001 – August 2002",
      achievements: [
        "Completed recruit training at Marine Corps Recruit Depot (MCRD) Parris Island, SC — earning the title United States Marine through 13 weeks of rigorous physical and mental conditioning, weapons qualification, and core values development",
        "Completed Marine Combat Training (MCT) at Camp Geiger, NC — receiving advanced infantry tactics, land navigation, and small unit leadership fundamentals required of all non-infantry Marines",
        "Graduated Avionics Electrician Basic Course (MOS 6042) at NATTC Pensacola, FL — trained in aircraft electrical systems theory, wiring schematics, circuit analysis, and fault isolation for fixed and rotary wing platforms",
        "Graduated Avionics Rotary Wing-Advanced Course at NATTC Pensacola, FL — specialized in advanced rotary wing avionics systems including navigation, communications, and integrated electronic warfare suite maintenance",
        "Qualified on M16A2 Service Rifle and M9 Pistol; earned rifle and pistol marksmanship badges"
      ]
    },
    {
      title: "Assistant Facilities Manager",
      achievements: [
        "Managed security oversight of 250+ barracks including personnel and facilities",
        "Maintained specific sign-out procedures to consistently keep track of personnel access",
        "Developed access rosters and log books to maintain accurate records, resulting in highest premises security possible",
        "Performed inspections of all living quarters of barracks' personnel and developed emergency escape routes",
        "Specifically chosen by Supervisors to oversee multi-million dollar barracks renovation",
        "Left renovation task remarkably ahead of projected schedule"
      ]
    },
    {
      title: "MCMAP Black Belt Instructor",
      period: "2005 - 2008",
      achievements: [
        "Trained combat personnel in Marine Corps Martial Arts Program (MCMAP) methodologies",
        "Developed and delivered advanced close-quarters combat curriculum",
        "Achieved and maintained MCMAP 1st Degree Black Belt certification",
        "Specialized instruction in hand-to-hand combat and tactical fighting techniques",
        "Mentored junior instructors in martial arts pedagogy and combat applications"
      ]
    },
    {
      title: "Avionics Technician",
      period: "August 2002 - April 2008",
      achievements: [
        "Provided setup and ground-based operation equipment testing support for functional flight testing",
        "Executed troubleshooting techniques and proper installation of electrical and electronic aircraft systems",
        "Installed electrical and electronic components, assemblies, and systems in aircraft",
        "Maintained highest standards of precision and safety in aviation electronics"
      ]
    },
    {
      title: "Production Control Specialist",
      period: "2002 - 2003",
      achievements: [
        "Managed logistics and production operations for military units",
        "Coordinated inventory management and resource allocation",
        "Maintained operational readiness and supply chain efficiency",
        "Ensured compliance with military production standards and protocols"
      ]
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
          Military Service
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Proud to have served <span className="text-red-400 font-semibold">7 years</span> with the <span className="text-yellow-400 font-semibold">United States Marine Corps</span>,
          developing leadership, discipline, and unwavering commitment to excellence. Certified Martial Arts Instructor, <span className="text-purple-400 font-semibold">MCMAP Black Belt 1st Degree</span>.
        </p>
      </motion.div>

      {/* Military Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {militaryStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-slate-300 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Military Experience */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-red-950/30 to-blue-950/30 border border-red-500/20 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white pb-2">
                United States Marine Corps Service
              </h3>
            </div>
            <p className="text-slate-300 text-lg">May 2001 – April 2008</p>
          </div>

          <div className="space-y-8">
            {militaryPositions.map((position, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-xl font-bold text-white pb-2">{position.title}</h4>
                    <Badge className="bg-slate-700/50 text-slate-300 ml-auto">
                      {position.period}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {position.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Firearms & Martial Arts Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-orange-950/30 to-slate-900 border border-orange-500/20 rounded-2xl p-8 md:p-12">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Firearms & Tactical Instructor Credentials
              </h3>
            </div>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Co-Founder & CEO of{" "}
              <a href="https://defense.eds-360.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 font-semibold">
                EDS Defense Division <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {" "}— providing firearms instruction, executive protection, and drone surveillance services.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: "500+", label: "Students Trained", color: "text-orange-400" },
              { value: "23+", label: "Years Experience", color: "text-red-400" },
              { value: "8", label: "Course Programs", color: "text-yellow-400" },
              { value: "100%", label: "Veteran Instructors", color: "text-green-400" },
            ].map((s, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-slate-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Instructor Certifications */}
          <div className="mb-10">
            <h4 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-orange-400" />
              Instructor Certifications
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {firearmsCerts.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4"
                >
                  <span className="text-xl flex-shrink-0">{cert.icon}</span>
                  <div>
                    <div className="text-white font-semibold text-sm">{cert.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{cert.org}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tactical & EP Experience */}
          <div className="mb-10">
            <h4 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-400" />
              Tactical & Executive Protection Experience
            </h4>
            <div className="space-y-4">
              {epExperience.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="text-white font-bold">{exp.role}</div>
                      <div className="text-orange-400 text-sm">{exp.org}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {exp.highlights.map((h, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{h}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Course Programs */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-400" />
              Active Course Programs — EDS Defense
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {edsCourses.map((course, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
                  <div className="text-lg mb-2">{course.icon}</div>
                  <div className="text-white font-semibold text-sm leading-tight mb-2">{course.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{course.duration}</span>
                    <span className="text-xs font-bold text-orange-400">{course.price}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{course.level}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <a
                href="https://defense.eds-360.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl text-sm transition-all"
              >
                <Crosshair className="w-4 h-4" />
                Visit EDS Defense Division
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Marine Corps Values */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-red-950/30 to-blue-950/30 border border-red-500/20 rounded-2xl p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white pb-2">
              Marine Corps Values in Cybersecurity
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Honor",
              description: "Ethical hacking and responsible disclosure practices. Maintaining integrity in all security assessments and vulnerability research.",
              icon: Award,
              color: "from-yellow-400 to-orange-500"
            },
            {
              title: "Courage",
              description: "Fearlessly tackling complex security challenges and advanced persistent threats. Taking calculated risks in red team operations.",
              icon: Shield,
              color: "from-red-400 to-pink-500"
            },
            {
              title: "Commitment",
              description: "Dedicated to continuous learning and staying ahead of evolving cyber threats. Committed to protecting national security assets.",
              icon: Star,
              color: "from-blue-400 to-cyan-500"
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center`}>
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 pb-2">{value.title}</h4>
              <p className="text-slate-300 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}