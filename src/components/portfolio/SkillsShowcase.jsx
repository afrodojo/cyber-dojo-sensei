import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, Code, Server, Cloud, Lock, Search, Eye, Settings, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState('offensive'); // Changed initial active category

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
          Elite Cybersecurity &amp; Tactical Specialist
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          A unique fusion of elite offensive cybersecurity and advanced tactical expertise, providing comprehensive threat mitigation from digital exploits to physical security.
        </p>
      </motion.div>

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory('offensive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeCategory === 'offensive'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <Target className="w-4 h-4" />
          <span className="hidden sm:inline">Offensive Operations</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory('reverse')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeCategory === 'reverse'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Reverse Engineering & Exploit Dev</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory('infrastructure')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeCategory === 'infrastructure'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span className="hidden sm:inline">Adversary Infrastructure</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory('cloud')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeCategory === 'cloud'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span className="hidden sm:inline">Cloud Offensive Security</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory('programming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeCategory === 'programming'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <Code className="w-4 h-4" />
          <span className="hidden sm:inline">Programming & Scripting</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory('windows')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeCategory === 'windows'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span className="hidden sm:inline">Windows & Active Directory</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory('tactical')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeCategory === 'tactical'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Tactical & Martial Arts</span>
        </motion.button>
      </div>

      {/* Active Category Display - Offensive Operations */}
      {activeCategory === 'offensive' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white pb-2">Offensive Operations & Red Teaming</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {["Cobalt Strike", "Metasploit", "Nmap", "Burp Suite", "CrackMapExec", "BloodHound", "Core Impact", "MITRE ATT&CK", "Adversary Emulation", "Red Teaming", "Attack Surface Management", "Phishing Campaigns", "Social Engineering", "Physical Security Testing", "Web App Assessments"].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge className="w-full justify-center bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 transition-colors py-2 px-3">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Category Display - Reverse Engineering & Exploit Dev */}
      {activeCategory === 'reverse' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white pb-2">Reverse Engineering & Exploit Development</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {["IDA Pro", "Ghidra", "x64dbg", "WinDbg", "OllyDbg", "Binary Analysis", "Malware Analysis", "Shellcode Dev", "Vulnerability Research", "Fuzzing", "Wireshark", "EnCase", "Threat Reports"].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge className="w-full justify-center bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 transition-colors py-2 px-3">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Category Display - Adversary Infrastructure */}
      {activeCategory === 'infrastructure' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Server className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white pb-2">Adversary Infrastructure & OpSec</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {["C2 Infrastructure", "Domain Fronting", "Egress Bypass", "Network Pivoting", "Operational Security", "Secure Comms", "Payload Obfuscation", "Container Escapes", "Cloud Exploitation", "DevOps", "DevSecOps", "CI/CD Pipelines", "SIEM/SOAR", "Splunk", "Endpoint Protection"].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge className="w-full justify-center bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 transition-colors py-2 px-3">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Category Display - Cloud Offensive Security */}
      {activeCategory === 'cloud' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white pb-2">Cloud Offensive Security</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {["AWS Security", "Azure Security", "GCP Security", "Container Security", "Serverless Exploitation", "Cloud IAM Attacks", "Cloud Data Exfil", "Kubernetes Security", "CSPM Bypass", "SailPoint IdentityIQ", "Cloud IAM", "FedRAMP", "NIST 800-53"].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge className="w-full justify-center bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 transition-colors py-2 px-3">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Category Display - Programming & Scripting */}
      {activeCategory === 'programming' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white pb-2">Programming & Scripting</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {["Python", "C/C++", "Assembly", "PowerShell", "Bash Scripting", "Go", "Rust", "JavaScript"].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge className="w-full justify-center bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 transition-colors py-2 px-3">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Category Display - Windows & Active Directory */}
      {activeCategory === 'windows' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white pb-2">Windows & Active Directory Exploitation</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {["Active Directory Attacks", "Kerberos Attacks", "NTLM Relay", "Lateral Movement", "Persistence Techniques", "Privilege Escalation", "Bypasses (UAC/AMSI)", "GPO Exploitation", "Defender Bypass"].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge className="w-full justify-center bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 transition-colors py-2 px-3">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Category Display - Tactical Training & Martial Arts */}
      {activeCategory === 'tactical' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white pb-2">Tactical Training & Personal Protection</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {["Certified Firearms Instructor", "VA Personal Protection Specialist", "Brazilian Jiu-Jitsu", "Muay Thai", "Tactical Defense", "Close Quarters Combat", "Threat Assessment", "Protective Intelligence"].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge className="w-full justify-center bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 transition-colors py-2 px-3">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Core Competencies Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-lg font-bold text-white mb-1 pb-2">Red Team Ops</div>
              <div className="text-sm font-medium text-red-400">Expert</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-lg font-bold text-white mb-1 pb-2">Exploit Dev</div>
              <div className="text-sm font-medium text-orange-400">Advanced</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white mb-1 pb-2">Threat Hunting</div>
              <div className="text-sm font-medium text-blue-400">Expert</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 3 * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-lg font-bold text-white mb-1 pb-2">Automation</div>
              <div className="text-sm font-medium text-green-400">Advanced</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 4 * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-lg font-bold text-white mb-1 pb-2">Tactical Expert</div>
              <div className="text-sm font-medium text-yellow-400">Certified</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}