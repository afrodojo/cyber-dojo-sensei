
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Shield, CheckSquare, Book, Users, Lock, AlertTriangle, ExternalLink, Globe, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ResourceDownload } from "@/entities/ResourceDownload";
import { SendEmail } from "@/integrations/Core";

export default function ResourceHub() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    title: ""
  });
  const [loading, setLoading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState("");

  const resources = [
    // DISA STIGs and Security Guides
    {
      id: "disa-stig-viewer",
      title: "DISA STIG Viewer & Security Technical Implementation Guides",
      description: "Complete collection of DISA Security Technical Implementation Guides (STIGs) for hardening various systems and applications according to DoD standards.",
      type: "guide",
      icon: Shield,
      color: "from-red-500 to-pink-600",
      downloadCount: "15,000+",
      pages: "Multiple Guides",
      format: "PDF/XML",
      featured: true,
      source: "DISA",
      directLink: "https://public.cyber.mil/stigs/",
      isExternal: true
    },
    {
      id: "nist-cybersecurity-framework",
      title: "NIST Cybersecurity Framework 2.0",
      description: "The updated NIST Cybersecurity Framework providing a comprehensive approach to managing cybersecurity risk for organizations of all sizes.",
      type: "framework",
      icon: Book,
      color: "from-blue-500 to-cyan-600",
      downloadCount: "25,000+",
      pages: "50 pages",
      format: "PDF",
      featured: true,
      source: "NIST",
      directLink: "https://www.nist.gov/cyberframework",
      isExternal: true
    },
    {
      id: "sans-incident-response",
      title: "SANS Incident Response Process and Procedures",
      description: "Comprehensive incident response methodology and procedures from SANS, including templates for incident handling and forensic analysis.",
      type: "template",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-600",
      downloadCount: "12,000+",
      pages: "35 pages",
      format: "PDF",
      featured: false,
      source: "SANS",
      directLink: "https://www.sans.org/white-papers/",
      isExternal: true
    },
    {
      id: "cis-controls",
      title: "CIS Critical Security Controls v8",
      description: "The Center for Internet Security's prioritized set of actions to protect organizations and data from cyber attack vectors.",
      type: "guide",
      icon: CheckSquare,
      color: "from-green-500 to-emerald-600",
      downloadCount: "18,000+",
      pages: "78 pages",
      format: "PDF",
      featured: false,
      source: "CIS",
      directLink: "https://www.cisecurity.org/controls",
      isExternal: true
    },
    {
      id: "owasp-top-10",
      title: "OWASP Top 10 Web Application Security Risks",
      description: "The most critical web application security risks according to OWASP, with detailed explanations and mitigation strategies.",
      type: "guide",
      icon: Globe,
      color: "from-purple-500 to-indigo-600",
      downloadCount: "30,000+",
      pages: "25 pages",
      format: "PDF",
      featured: false,
      source: "OWASP",
      directLink: "https://owasp.org/www-project-top-ten/",
      isExternal: true
    },
    {
      id: "iso-27001-checklist",
      title: "ISO 27001 Implementation Checklist",
      description: "Comprehensive checklist for implementing ISO 27001 Information Security Management System requirements and controls.",
      type: "checklist",
      icon: CheckSquare,
      color: "from-teal-500 to-green-600",
      downloadCount: "8,500+",
      pages: "15 pages",
      format: "PDF + Excel",
      featured: false,
      source: "ISO",
      directLink: "https://www.iso.org/isoiec-27001-information-security.html",
      isExternal: true
    },
    {
      id: "mitre-attack-framework",
      title: "MITRE ATT&CK Framework Navigator",
      description: "Interactive framework for understanding adversary tactics, techniques, and procedures based on real-world observations.",
      type: "framework",
      icon: Target,
      color: "from-red-600 to-pink-600",
      downloadCount: "20,000+",
      pages: "Interactive",
      format: "Web Tool",
      featured: true,
      source: "MITRE",
      directLink: "https://attack.mitre.org/",
      isExternal: true
    },
    {
      id: "fisma-compliance-template",
      title: "FISMA Compliance Documentation Templates",
      description: "Complete set of templates for FISMA compliance including System Security Plans (SSP), Risk Assessment templates, and POA&M formats.",
      type: "template",
      icon: FileText,
      color: "from-blue-600 to-indigo-600",
      downloadCount: "6,000+",
      pages: "Multiple Templates",
      format: "Word + Excel",
      featured: false,
      source: "NIST",
      directLink: "https://csrc.nist.gov/Projects/risk-management/about-rmf",
      isExternal: true
    },
    {
      id: "sans-security-awareness",
      title: "SANS Security Awareness Training Materials",
      description: "Free security awareness training materials including presentations, newsletters, and assessment tools for building organizational security culture.",
      type: "template",
      icon: Users,
      color: "from-yellow-500 to-orange-600",
      downloadCount: "10,000+",
      pages: "Multiple Resources",
      format: "PPT + PDF",
      featured: false,
      source: "SANS",
      directLink: "https://www.sans.org/security-awareness-training/resources/",
      isExternal: true
    },
    {
      id: "nist-privacy-framework",
      title: "NIST Privacy Framework",
      description: "Comprehensive framework for managing privacy risk and implementing privacy protections in organizational systems and processes.",
      type: "framework",
      icon: Lock,
      color: "from-indigo-500 to-purple-600",
      downloadCount: "7,500+",
      pages: "40 pages",
      format: "PDF",
      featured: false,
      source: "NIST",
      directLink: "https://www.nist.gov/privacy-framework",
      isExternal: true
    }
  ];

  const handleDownloadRequest = (resource) => {
    if (resource.isExternal) {
      // For external resources, open in new tab and track the "download"
      window.open(resource.directLink, '_blank');
      
      // Still show form to capture lead information
      setSelectedResource(resource);
      setFormData({ name: "", email: "", company: "", title: "" });
      setDownloadMessage("");
    } else {
      setSelectedResource(resource);
      setFormData({ name: "", email: "", company: "", title: "" });
      setDownloadMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save download record
      await ResourceDownload.create({
        ...formData,
        resource_name: selectedResource.title,
        resource_type: selectedResource.type
      });

      // Send notification email
      await SendEmail({
        to: 'AsaadMorman@gmail.com',
        subject: `Resource Access: ${selectedResource.title}`,
        body: `
          <p>Someone accessed "${selectedResource.title}" from your resource hub!</p>
          <ul>
            <li><strong>Name:</strong> ${formData.name}</li>
            <li><strong>Company:</strong> ${formData.company || 'N/A'}</li>
            <li><strong>Email:</strong> ${formData.email}</li>
            <li><strong>Title:</strong> ${formData.title || 'N/A'}</li>
            <li><strong>Resource:</strong> ${selectedResource.title}</li>
            <li><strong>Source:</strong> ${selectedResource.source}</li>
          </ul>
        `
      });

      // Send follow-up email to user
      await SendEmail({
        to: formData.email,
        subject: `Resource Access: ${selectedResource.title}`,
        from_name: 'Asaad Morman - Cybersecurity Expert',
        body: `
          <p>Hi ${formData.name},</p>
          <p>Thank you for your interest in "${selectedResource.title}".</p>
          ${selectedResource.isExternal ? 
            `<p><strong>Access Link:</strong> <a href="${selectedResource.directLink}" target="_blank">${selectedResource.directLink}</a></p>
             <p>This resource is provided by ${selectedResource.source}. You can access it directly through the link above.</p>` :
            `<p><strong>Download Link:</strong> <a href="#">Click here to download</a></p>`
          }
          <p>I hope you find this resource valuable for your cybersecurity initiatives. If you have any questions or would like to discuss how I can help with your specific security challenges, please don't hesitate to reach out.</p>
          <p>Best regards,<br>Asaad Morman<br>Offensive Cybersecurity Subject Matter Expert</p>
          <p>Email: AsaadMorman@gmail.com<br>Phone: (571) 245-2303</p>
        `
      });

      setDownloadMessage("Thank you! The resource link has been sent to your email.");
      setSelectedResource(null);
    } catch (error) {
      setDownloadMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const featuredResources = resources.filter(r => r.featured);
  const otherResources = resources.filter(r => !r.featured);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Cybersecurity Resource Hub
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Curated collection of essential cybersecurity resources from leading organizations including DISA, NIST, SANS, CIS, and OWASP. 
          Access proven frameworks, templates, and guides to strengthen your security posture.
        </p>
      </motion.div>

      {/* Download Message */}
      {downloadMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-block bg-green-950/30 border border-green-500/30 rounded-lg px-6 py-3">
            <p className="text-green-300 font-medium">{downloadMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Download className="w-6 h-6 text-cyan-400" />
            Featured Resources
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredResources.map((resource, index) => {
              // const Icon = getIcon(resource.type); // This line is removed as per outline
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 h-full group">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <resource.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-slate-700/50 text-slate-300 text-xs border-slate-600 capitalize">
                              {resource.type}
                            </Badge>
                            <Badge className="bg-cyan-500/20 text-cyan-300 text-xs border-cyan-500/30">
                              FEATURED
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-300 text-xs border-blue-500/30">
                              {resource.source}
                            </Badge>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors leading-tight">
                            {resource.title}
                          </h4>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 mb-6 leading-relaxed">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
                        <div className="flex items-center gap-4">
                          <span>{resource.pages}</span>
                          <span>{resource.format}</span>
                        </div>
                        <span>{resource.downloadCount} downloads</span>
                      </div>
                      
                      <Button 
                        onClick={() => handleDownloadRequest(resource)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                      >
                        {resource.isExternal ? (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Access Resource
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download Free
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other Resources */}
      {otherResources.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Additional Resources
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherResources.map((resource, index) => {
              // const Icon = getIcon(resource.type); // This line is removed as per outline
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 h-full group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-lg flex items-center justify-center`}>
                          <resource.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-slate-700/50 text-slate-300 text-xs border-slate-600 capitalize w-fit">
                            {resource.type}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-300 text-xs border-blue-500/30 w-fit">
                            {resource.source}
                          </Badge>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight">
                        {resource.title}
                      </h4>
                      
                      <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span>{resource.pages}</span>
                        <span>{resource.downloadCount} downloads</span>
                      </div>
                      
                      <Button 
                        onClick={() => handleDownloadRequest(resource)}
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-purple-400 transition-all duration-300"
                      >
                        {resource.isExternal ? (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Access
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Download Form Modal */}
      {selectedResource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700"
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${selectedResource.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                {selectedResource.isExternal ? (
                  <ExternalLink className="w-8 h-8 text-white" />
                ) : (
                  <Download className="w-8 h-8 text-white" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedResource.isExternal ? 'Access' : 'Download'} {selectedResource.title}
              </h3>
              <p className="text-slate-400 text-sm">
                {selectedResource.isExternal 
                  ? `This resource will open from ${selectedResource.source}. Enter your details to receive the link and stay updated.`
                  : 'Enter your details to receive the download link'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your Name *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="bg-slate-700/50 border-slate-600 text-white"
              />
              <Input
                type="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="bg-slate-700/50 border-slate-600 text-white"
              />
              <Input
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
              <Input
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="bg-slate-700/50 border-slate-600 text-white"
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedResource(null)}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  {loading ? "Processing..." : selectedResource.isExternal ? "Get Access" : "Get Download"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
