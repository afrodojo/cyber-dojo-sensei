import React from "react";
import { motion } from "framer-motion";
import { Shield, Target, Award, Building, User, Phone, Mail, MapPin, Star, Calendar, Users, FileText, ExternalLink, ChevronRight, Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CapabilityStatement() {
  const coreCapabilities = [
    {
      title: "Offensive Cybersecurity Operations",
      description: "Advanced red team operations, penetration testing, and adversary emulation",
      icon: Target,
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Security Architecture & Consulting", 
      description: "Enterprise security design, risk assessment, and compliance consulting",
      icon: Shield,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Tactical Training & Personal Protection",
      description: "Firearms instruction, martial arts training, and personal protection services",
      icon: Award,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Leadership Development & Training",
      description: "Cybersecurity workforce development and executive leadership programs",
      icon: Users,
      color: "from-purple-500 to-indigo-600"
    }
  ];

  const certifications = [
    "Certified Ethical Hacker (CEH)",
    "Certified Network Defense Architect (CNDA)", 
    "CompTIA Security+",
    "CompTIA CASP+ (Advanced Security Practitioner)",
    "CompTIA Network+",
    "CompTIA A+",
    "Six Sigma Yellow Belt",
    "Scrum Fundamentals Certified",
    "Certified Firearms Instructor",
    "VA Personal Protection Specialist (Armed)",
    "Brazilian Jiu-Jitsu Practitioner",
    "Muay Thai Trained"
  ];

  const keyStats = [
    { icon: Calendar, value: "15+", label: "Years Cybersecurity Experience" },
    { icon: Shield, value: "7", label: "Years Military Service" },
    { icon: Building, value: "2", label: "Companies Founded" },
    { icon: Users, value: "500+", label: "Professionals Trained" }
  ];

  const militaryService = {
    branch: "United States Marine Corps",
    period: "August 2002 - April 2008",
    positions: [
      {
        title: "Assistant Facilities Manager",
        period: "2007 - 2008",
        achievements: [
          "Managed security oversight of 250+ barracks including personnel and facilities",
          "Maintained specific sign-out procedures to consistently keep track of personnel access",
          "Developed access rosters and log books to maintain accurate records",
          "Performed inspections of all living quarters and developed emergency escape routes",
          "Specifically chosen by Supervisors to oversee multi-million dollar barracks renovation",
          "Completed renovation project remarkably ahead of projected schedule"
        ]
      },
      {
        title: "Avionics Technician", 
        period: "August 2002 - April 2008",
        achievements: [
          "Provided setup and ground-based operation equipment testing support for functional flight testing",
          "Executed troubleshooting techniques for electrical and electronic aircraft systems",
          "Proper installation of electrical and electronic components, assemblies, and systems in aircraft",
          "Maintained highest standards of precision and safety in aviation electronics"
        ]
      }
    ]
  };

  const professionalExperience = [
    {
      company: "Blue Sky Innovators",
      title: "Cybersecurity Subject Matter Expert / Technical Advisor",
      location: "Remote",
      period: "January 2026 – Present",
      achievements: [
        "Offering deep expertise in reverse engineering, malware analysis, network defense, and exploit development",
        "Providing unbiased 'honest broker' advice to government leaders, free from vendor bias",
        "Assisting with program definition and translating mission needs to technical specifications",
        "Supporting integration of new cyber technologies from research into operational use",
        "Identifying system vulnerabilities, analyzing threats, and developing mitigation strategies",
        "Developing cyber strategies and supporting policy compliance across cyber/crypto programs"
      ]
    },
    {
      company: "DARPA",
      title: "Cybersecurity Researcher / Technical Advisor",
      location: "Arlington, VA",
      period: "Consulting",
      achievements: [
        "Provided technical expertise in offensive security and advanced threat research",
        "Supported program definition and requirement translation for next-generation cyber capabilities",
        "Assisted with technology transition from research into operational deployment",
        "Contributed to threat and vulnerability management research initiatives"
      ]
    },
    {
      company: "Maximus (DISA)",
      title: "Cybersecurity Operations Center Manager / ISSM",
      location: "Arlington, VA",
      period: "May 2023 – July 2025",
      achievements: [
        "Developed DevOps and DevSecOps strategies through offensive security lens",
        "Managed incident response workflows and optimized Splunk dashboards",
        "Automated SIEM/SOAR integrations, improving response times by 40%",
        "Provided technical briefings to senior government stakeholders"
      ]
    },
    {
      company: "ICS-Nett (DCSA)",
      title: "Cyber Defense Security Auditor / Purple Team Lead",
      location: "Quantico, VA", 
      period: "April 2021 – May 2023",
      achievements: [
        "Executed advanced offensive intrusion operations across enterprise networks",
        "Led targeted phishing campaigns and social engineering assessments",
        "Conducted web application security assessments using latest methodologies",
        "Developed cybersecurity training programs for analysts and clients"
      ]
    },
    {
      company: "Booz Allen Hamilton",
      title: "Cybersecurity Engineer / IdentityIQ Engineer",
      location: "McLean/Rockville, VA",
      period: "Jan 2016 – Apr 2021",
      achievements: [
        "Engineered SailPoint IdentityIQ integrations for DHS, VA, and NIH",
        "Developed secure cloud environments across AWS, Azure, and GCP",
        "Implemented CI/CD pipelines with integrated security controls",
        "Managed vulnerability remediation programs for large-scale deployments"
      ]
    },
    {
      company: "SAIC (Science Applications International Corporation)",
      title: "Customer Support Analyst",
      location: "Washington, DC",
      period: "February 2015 - April 2015",
      achievements: [
        "Provided Tier 1 Support for Pension Benefit Guaranty Corporation",
        "RSA token setups and email configuration",
        "iPhone configuration and Airwatch management",
        "New employee orientation and account configuration",
        "Printer setup and comprehensive technical support"
      ]
    },
    {
      company: "Jacobs Technology",
      title: "Help Desk Analyst/Desktop Support",
      location: "Silver Springs, MD",
      period: "September 2012 – November 2015",
      achievements: [
        "Provided operations and records management support to 7 campuses of Montgomery College",
        "Supported 50,000+ students, staff, faculty, retirees, and alumni",
        "Expertise in Microsoft Office, Windows systems, Active Directory, and network configuration",
        "Achieved 90% First Call Resolution rate for technical issues",
        "Experience with Remedy/Helpdesk management systems and remote management tools"
      ]
    },
    {
      company: "Self-Employed Contractor",
      title: "Security Analyst",
      location: "Woodbridge, VA",
      period: "January 2009 – September 2012",
      achievements: [
        "Delivered exceptional hardware and software installation services",
        "Maintained clientele wired and wireless networks, desktop and server computers",
        "Diagnosed and troubleshot hardware failures with external support coordination",
        "Managed computer peripheral equipment including printers, scanners, and projectors"
      ]
    },
    {
      company: "Dell",
      title: "Field Service Technician",
      location: "Centreville, VA",
      period: "October 2008 - January 2009",
      achievements: [
        "Provided exceptional hardware and software service to Dell customers",
        "Accurately troubleshot and repaired products while teaching customers optimization",
        "Worked closely with call center to meet company deadlines",
        "Obtained all required certifications and upheld security protocols"
      ]
    }
  ];

  const tacticalExpertise = [
    {
      category: "Firearms Training",
      details: [
        "Certified Firearms Instructor",
        "Advanced tactical shooting techniques",
        "Firearms safety and handling protocols",
        "Marksmanship training and assessment"
      ]
    },
    {
      category: "Martial Arts",
      details: [
        "Brazilian Jiu-Jitsu practitioner",
        "Muay Thai training and techniques",
        "Close quarters combat applications",
        "Self-defense and tactical movement"
      ]
    },
    {
      category: "Personal Protection",
      details: [
        "VA Personal Protection Specialist (Armed)",
        "Threat assessment and risk evaluation",
        "Executive protection protocols",
        "Tactical defense strategies"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
                  Capability Statement
                </h1>
              </div>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-3">
                Elite Cybersecurity Professional & Entrepreneur
              </p>
              <p className="text-lg text-cyan-400 font-semibold">
                Co-Founder & CEO, Emerging Defense Solutions
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="py-20 max-w-5xl mx-auto px-6 space-y-16">
        {/* Profile & Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Asaad Morman</h2>
            <h3 className="text-xl font-semibold text-slate-300 mb-4">Offensive Cybersecurity Subject Matter Expert</h3>
            <p className="text-slate-400 leading-relaxed">
              A highly accomplished and results-oriented cybersecurity expert with over 15 years of experience in leading-edge offensive security operations for federal and commercial clients. Combines deep technical expertise with 7 years of U.S. Marine Corps leadership and proven business acumen as a founder of multiple security-focused enterprises. Holds an active TS/SCI with CI Polygraph clearance.
            </p>
            <div className="mt-6 p-4 bg-gradient-to-r from-red-950/30 to-blue-950/30 border border-red-500/20 rounded-lg inline-block">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-semibold">Security Clearance</span>
              </div>
              <p className="text-white font-bold text-lg">TS/SCI w/CI Polygraph</p>
            </div>
          </div>
          
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Contact Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Asaad Morman, CEO</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Emerging Defense Solutions, LLC</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>cyberdojosensai@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>657-658-5859</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Fredericksburg, VA</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {keyStats.map((stat, index) => (
            <div key={index} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-center">
              <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Core Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Core Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {coreCapabilities.map((capability, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${capability.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <capability.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{capability.title}</h3>
                    <p className="text-slate-400 text-sm">{capability.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Services */}
          <div className="grid lg:grid-cols-2 gap-8 mt-12">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-400" />
                  Cybersecurity Services
                </h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <div>• Advanced Red Team Operations & Adversary Emulation</div>
                  <div>• Penetration Testing & Vulnerability Assessment</div>
                  <div>• Security Architecture Design & Review</div>
                  <div>• Incident Response & Digital Forensics</div>
                  <div>• Compliance Consulting (FISMA, HIPAA, PCI-DSS)</div>
                  <div>• Cybersecurity Training & Workforce Development</div>
                  <div>• Cloud Security Assessment (AWS, Azure, GCP)</div>
                  <div>• Threat Intelligence & Analysis</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Tactical & Training Services
                </h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <div>• Advanced Firearms Training & Instruction</div>
                  <div>• Personal Protection Services (Armed Specialist)</div>
                  <div>• Brazilian Jiu-Jitsu & Muay Thai Training</div>
                  <div>• Tactical Defense Programs</div>
                  <div>• CPR & BLS Certification Courses</div>
                  <div>• Leadership Development Programs</div>
                  <div>• Executive Protection Training</div>
                  <div>• Physical Security Assessments</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Military Service Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Military Service</h2>
          
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{militaryService.branch}</h3>
                  <p className="text-slate-400">{militaryService.period}</p>
                </div>
              </div>

              {militaryService.positions.map((position, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-xl font-bold text-white">{position.title}</h4>
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
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Experience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Professional Experience</h2>
          
          <div className="space-y-8">
            {professionalExperience.map((exp, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                        <Building className="w-4 h-4" />
                        <span>{exp.company}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{exp.location}</p>
                    </div>
                    <Badge className="bg-slate-700/50 text-slate-300 whitespace-nowrap">
                      {exp.period}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
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
        </motion.div>

        {/* Tactical Expertise Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Tactical & Martial Arts Expertise</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {tacticalExpertise.map((expertise, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{expertise.category}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {expertise.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Certifications</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert, index) => (
              <Badge key={index} className="bg-slate-700/50 border-slate-600 text-slate-300 px-3 py-1 text-sm">
                {cert}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Business Ventures */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">BUSINESS LEADERSHIP</h2>

          {/* Parent Company */}
          <Card className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Emerging Defense Solutions</h3>
                  <div className="text-indigo-400 font-semibold">Co-Founder & CEO</div>
                  <div className="text-slate-400 text-sm">Parent Corporation | Est. 2024</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3">
                Unified S-Corporation bringing together multiple mission-driven companies under one cohesive, 
                disciplined, and future-focused structure across cybersecurity, defensive training, property care, and sustainable agriculture.
              </p>
              <div className="text-sm text-slate-400 mb-3">
                <strong className="text-white">Divisions:</strong> Cybersecurity Division, Defense Division, Property Care Division, Sustainable Agriculture Division
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/30"
              >
                <a href="https://emergingdefensesolutions.com" target="_blank" rel="noopener noreferrer">
                  Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Cybersecurity Division</h3>
                    <div className="text-cyan-400 font-semibold">Division Lead</div>
                    <div className="text-slate-400 text-sm">EDS Division</div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Elite cybersecurity consulting firm specializing in advanced offensive intrusion operations,
                  red team operations, and enterprise security architecture.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <a href="https://emergingdefensesolutions.com" target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Defense Division</h3>
                    <div className="text-green-400 font-semibold">Chief Tactical Officer</div>
                    <div className="text-slate-400 text-sm">EDS Division</div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Premier tactical training academy providing comprehensive firearms instruction, martial arts training,
                  and life-saving medical certifications.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <a href="https://defense.eds-360.com" target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Podcast Section */}
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Shield & Signal Podcast</h3>
                    <div className="text-purple-400 font-semibold">Host</div>
                    <div className="text-slate-400 text-sm">Cybersecurity Insights & Discussions</div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Tune in to Shield & Signal for expert discussions on cybersecurity trends, threat intelligence, 
                  and practical security strategies for organizations of all sizes.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
                >
                  <a href="https://shieldsignal.cyberdojosolutions.com" target="_blank" rel="noopener noreferrer">
                    Listen Now <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">READY TO SECURE YOUR FUTURE?</h2>
          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Partner with a proven cybersecurity leader who combines elite technical expertise
            with real-world business acumen and military discipline.
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
            onClick={() => window.location.href = 'mailto:cyberdojosensai@gmail.com?subject=Consultation Request'}
          >
            <Mail className="w-5 h-5 mr-2" />
            Request Consultation
          </Button>
        </motion.div>
      </div>
    </div>
  );
}