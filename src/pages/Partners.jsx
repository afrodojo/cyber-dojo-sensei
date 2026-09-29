import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Building, Users, Globe, ExternalLink, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    // Real partnerships only with actual logos
    setPartners([
      {
        company_name: "Microsoft",
        partnership_type: "technology",
        logo_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e7d16b948_Microsoftlogo.png",
        specialties: ["Azure Security", "Sentinel SIEM", "Active Directory"],
        geographic_focus: ["Global"],
        description: "Technology partner for Microsoft's security ecosystem, including Azure, Sentinel, and Defender ATP.",
        featured: true
      },
      {
        company_name: "Cisco",
        partnership_type: "technology",
        logo_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9cdb6c887_partner-logo.png",
        specialties: ["Network Security", "Firewalls", "Endpoint Protection"],
        geographic_focus: ["Global"],
        description: "Collaboration on advanced network security solutions and endpoint protection strategies.",
        featured: true
      },
      {
        company_name: "Fortinet",
        partnership_type: "technology",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Fortinet_logo.svg/2560px-Fortinet_logo.svg.png",
        specialties: ["FortiGate", "Security Fabric", "SD-WAN"],
        geographic_focus: ["Global"],
        description: "Partnering to deliver integrated and automated security solutions through the Fortinet Security Fabric.",
        featured: true
      },
      {
        company_name: "Amazon Web Services (AWS)",
        partnership_type: "technology",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png",
        specialties: ["Cloud Security", "GuardDuty", "IAM"],
        geographic_focus: ["Global"],
        description: "Cloud security partner for architecting and securing workloads within the AWS ecosystem.",
        featured: true
      },
      {
        company_name: "Google Cloud",
        partnership_type: "technology",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/2560px-Google_Cloud_logo.svg.png",
        specialties: ["Chronicle SIEM", "Cloud Armor", "BeyondCorp"],
        geographic_focus: ["Global"],
        description: "Leveraging Google's advanced security analytics and zero-trust models to protect enterprise clients.",
        featured: true
      },
      {
        company_name: "HSOC Cyber",
        partnership_type: "strategic",
        specialties: ["Managed SOC", "Threat Hunting", "Incident Response"],
        geographic_focus: ["North America"],
        description: "Strategic alliance providing 24/7 Managed Security Operations and advanced threat hunting.",
      },
      {
        company_name: "TES Consultants",
        partnership_type: "consulting",
        specialties: ["Government Compliance", "Risk Assessment", "FISMA"],
        geographic_focus: ["United States"],
        description: "Consulting partnership for navigating complex federal compliance and risk management frameworks.",
      },
      {
        company_name: "Synaptech",
        partnership_type: "consulting",
        specialties: ["Cybersecurity Training", "Workforce Development"],
        geographic_focus: ["United States"],
        description: "Collaborating on cybersecurity education and workforce development programs for government and enterprise.",
      }
    ]);
    setLoading(false);
  };

  const partnershipTypes = [
    { id: "all", label: "All Partners", icon: Globe },
    { id: "technology", label: "Technology", icon: Shield },
    { id: "strategic", label: "Strategic", icon: Award },
    { id: "consulting", label: "Consulting", icon: Building }
  ];

  const filteredPartners = activeFilter === "all" 
    ? partners 
    : partners.filter(partner => partner.partnership_type === activeFilter);

  const getPartnerIcon = (type) => {
    switch (type) {
      case "technology": return Shield;
      case "strategic": return Award;
      case "consulting": return Building;
      default: return Users;
    }
  };

  const getPartnerColor = (type) => {
    switch (type) {
      case "technology": return "from-blue-500 to-cyan-600";
      case "strategic": return "from-green-500 to-emerald-600";
      case "consulting": return "from-purple-500 to-indigo-600";
      default: return "from-gray-500 to-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Strategic Partnerships
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8" />
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Collaborating with industry leaders to deliver comprehensive cybersecurity solutions. 
              Our strategic partnerships enable us to provide cutting-edge technology and expertise to our clients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partnership Stats */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/30 border-slate-700/50 text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-purple-400 mb-1">8+</div>
                  <div className="text-sm text-slate-400">Active Partners</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/30 border-slate-700/50 text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-400 mb-1">15+</div>
                  <div className="text-sm text-slate-400">Joint Projects</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/30 border-slate-700/50 text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-400 mb-1">3</div>
                  <div className="text-sm text-slate-400">Countries</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/30 border-slate-700/50 text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">500+</div>
                  <div className="text-sm text-slate-400">Clients Served</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {partnershipTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(type.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === type.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </motion.button>
            ))}
          </div>

          {/* Partners Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner, index) => {
              const Icon = getPartnerIcon(partner.partnership_type);
              const color = getPartnerColor(partner.partnership_type);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 h-full group">
                    <CardContent className="p-8">
                      {/* Partner Header */}
                      <div className="flex items-start gap-4 mb-6">
                        {partner.logo_url ? (
                          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                            <img 
                              src={partner.logo_url} 
                              alt={`${partner.company_name} logo`}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {partner.company_name}
                          </h3>
                          <Badge className={`bg-gradient-to-r ${color} text-white border-0 text-xs font-semibold`}>
                            {partner.partnership_type.charAt(0).toUpperCase() + partner.partnership_type.slice(1)} Partner
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 mb-6 leading-relaxed">
                        {partner.description}
                      </p>

                      {/* Specialties */}
                      {partner.specialties && partner.specialties.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-white font-semibold mb-2 text-sm">Specialties:</h4>
                          <div className="flex flex-wrap gap-1">
                            {partner.specialties.map((specialty, specIndex) => (
                              <Badge
                                key={specIndex}
                                className="bg-slate-700/50 text-slate-300 text-xs border-slate-600"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Geographic Focus */}
                      {partner.geographic_focus && partner.geographic_focus.length > 0 && (
                        <div className="pt-4 border-t border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-400">Coverage</span>
                            </div>
                            <span className="text-sm text-slate-300 font-medium">
                              {partner.geographic_focus.join(", ")}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Partnership CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Card className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border-purple-500/20">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Interested in Partnering?
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  We're always looking for strategic partnerships that can enhance our cybersecurity offerings 
                  and deliver greater value to our clients.
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold"
                  onClick={() => window.location.href = 'mailto:cyberdojosensai@gmail.com?subject=Partnership Inquiry'}
                >
                  Contact Us About Partnership
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}