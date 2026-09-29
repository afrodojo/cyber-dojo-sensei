import React from "react";
import { motion } from "framer-motion";
import { Building, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TerminalText from "@/components/portfolio/TerminalText";

export default function ExperienceTimeline() {
  const experiences = [
    {
      title: "Cybersecurity Researcher / SETA Technical Advisor",
      company: "Blue Sky Innovators",
      location: "Onsite",
      period: "January 2026 – Present",
      description: "Serving as a Systems Engineering and Technical Assistance (SETA) advisor providing elite technical and strategic cybersecurity guidance to government program managers and senior leaders.",
      achievements: [
        "Acting as SETA advisor to government clients, advising on the planning, design, and optimization of Network Operations Center (NOC) and Security Operations Center (SOC) teams, capabilities, and operations",
        "Developing SOC/NOC staffing models, capability roadmaps, and operational playbooks aligned with mission requirements",
        "Advising on SOC/NOC tool selection, integration (SIEM, SOAR, IDS/IPS), and process maturation from initial concept through full operational capability",
        "Planning and designing tiered SOC architectures including Tier 1–3 analyst workflows, escalation procedures, and detection engineering pipelines",
        "Offering deep expertise in reverse engineering, malware analysis, network defense, and exploit development",
        "Providing unbiased 'honest broker' advice to government leaders, free from vendor bias",
        "Assisting with program definition and translating mission needs to technical specifications",
        "Supporting integration of new cyber technologies from research into operational use",
        "Identifying system vulnerabilities, analyzing threats, and developing mitigation strategies",
        "Developing cyber strategies and supporting policy compliance across cyber/crypto programs"
      ],
      tags: ["SETA", "SOC Advisory", "NOC Planning", "SME", "Reverse Engineering", "Strategic Advisory"]
    },
    {
      title: "Cybersecurity Operations Center Manager / ISSM",
      company: "Maximus (DISA)",
      location: "Arlington, VA",
      period: "May 2023 – July 2025",
      description: "Leading DevSecOps strategies and incident response operations for critical government systems.",
      achievements: [
        "Developed DevOps and DevSecOps strategies through offensive security lens",
        "Managed incident response workflows and optimized Splunk dashboards",
        "Automated SIEM/SOAR integrations, improving response times by 40%",
        "Provided technical briefings to senior government stakeholders"
      ],
      tags: ["Leadership", "DevSecOps", "SIEM", "Incident Response"]
    },
    {
      title: "Cyber Defense Security Auditor (Cybersecurity Subject Matter Expert / Purple Team Lead)",
      company: "ICS-Nett (DCSA)",
      location: "Quantico, VA", 
      period: "April 2021 – May 2023",
      description: "Conducted advanced offensive intrusion operations and led purple team operations for classified environments.",
      achievements: [
        "Executed advanced offensive intrusion operations across enterprise networks",
        "Led targeted phishing campaigns and social engineering assessments",
        "Conducted web application security assessments using latest methodologies",
        "Developed cybersecurity training programs for analysts and clients"
      ],
      tags: ["Cybersecurity SME", "Purple Team", "Social Engineering", "Training"]
    },
    {
      title: "Cybersecurity Engineer / IdentityIQ Engineer",
      company: "Booz Allen Hamilton",
      location: "McLean/Rockville, VA",
      period: "Jan 2016 – Apr 2021",
      description: "Engineered secure cloud environments and identity management solutions for federal clients.",
      achievements: [
        "Engineered SailPoint IdentityIQ integrations for DHS, VA, and NIH",
        "Developed secure cloud environments across AWS, Azure, and GCP",
        "Implemented CI/CD pipelines with integrated security controls",
        "Managed vulnerability remediation programs for large-scale deployments"
      ],
      tags: ["Cloud Security", "Identity Management", "CI/CD", "Federal Clients"]
    },
    {
      title: "United States Marine Corps Service",
      company: "U.S. Marine Corps",
      location: "Various",
      period: "May 2001 – April 2008",
      description: "Seven years of distinguished military service with progressive responsibility in technical operations, combat training, and leadership roles.",
      achievements: [
        "Assistant Facilities Manager (2007–2008) - Managed security oversight of 250+ barracks, personnel, and facilities; developed access rosters and emergency protocols",
        "MCMAP Black Belt Instructor (2005–2008) - Trained combat personnel in Marine Corps Martial Arts Program; specialized instruction in close-quarters combat",
        "Avionics Technician (August 2002–April 2008) - Provided aircraft systems support, troubleshooting electrical/electronic systems; maintained precision standards in aviation electronics",
        "Production Control Specialist (2002–2003) - Managed logistics and production operations for military units",
        "Airborne Qualified (2004) - Completed airborne training and jump certifications; tactical air operations capability"
      ],
      tags: ["Military Leadership", "Facilities Security", "MCMAP", "Avionics", "Airborne", "Technical Operations"]
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
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary pb-2">
          Professional Experience
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-ninja-green to-emerald-500 mx-auto mb-8" />
        <p className="text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
          Progressive career growth through top-tier cybersecurity roles in classified federal environments, 
          consistently delivering exceptional results in high-stakes security operations.
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-ninja-green to-emerald-500 rounded-full" />

        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative mb-16"
          >
            {/* Timeline Dot */}
            <div className="hidden lg:block absolute top-12 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-ninja-green to-emerald-500 rounded-full border-4 border-ninja-void z-10" />

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
              {/* Left Side - Odd items (Company info) */}
              {index % 2 === 0 && (
                <>
                  <div className="text-right pr-8">
                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex items-center gap-2 text-ninja-green font-semibold text-lg">
                        <span>{exp.company}</span>
                        <Building className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{exp.period}</span>
                          <Calendar className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="font-medium">{exp.location}</span>
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="pl-8">
                    <Card className="bg-ninja-surface shuriken-clip shuriken-stroke hover:ninja-glow transition-all duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-3 leading-tight pb-2">
                          {exp.title}
                        </h3>
                        <p className="text-foreground/80 mb-4 leading-relaxed">
                          <TerminalText text={exp.description} />
                        </p>
                        <div className="space-y-2 mb-4">
                          {exp.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-ninja-green mt-0.5 flex-shrink-0" />
                              <span className="text-slate-300 text-sm leading-relaxed">{achievement}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exp.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              className="bg-ninja-green/10 border border-ninja-green/30 text-ninja-green hover:bg-ninja-green/20 transition-colors text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Right Side - Even items (Company info) */}
              {index % 2 === 1 && (
                <>
                  <div className="pr-8">
                    <Card className="bg-ninja-surface shuriken-clip shuriken-stroke hover:ninja-glow transition-all duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-3 leading-tight pb-2">
                          {exp.title}
                        </h3>
                        <p className="text-foreground/80 mb-4 leading-relaxed">
                          <TerminalText text={exp.description} />
                        </p>
                        <div className="space-y-2 mb-4">
                          {exp.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-ninja-green mt-0.5 flex-shrink-0" />
                              <span className="text-slate-300 text-sm leading-relaxed">{achievement}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exp.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              className="bg-ninja-green/10 border border-ninja-green/30 text-ninja-green hover:bg-ninja-green/20 transition-colors text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="text-left pl-8">
                    <div className="flex flex-col items-start space-y-3">
                      <div className="flex items-center gap-2 text-ninja-green font-semibold text-lg">
                        <Building className="w-5 h-5" />
                        <span>{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{exp.period}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
              <Card className="bg-ninja-surface shuriken-clip shuriken-stroke hover:ninja-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-5 h-5 text-ninja-green" />
                    <span className="text-ninja-green font-semibold text-lg">{exp.company}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight pb-2">
                    {exp.title}
                  </h3>
                  
                  <div className="flex flex-col gap-2 mb-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{exp.location}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-ninja-green mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm leading-relaxed">{achievement}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        className="bg-ninja-green/10 border border-ninja-green/30 text-ninja-green hover:bg-ninja-green/20 transition-colors text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}