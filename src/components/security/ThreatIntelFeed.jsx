import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InvokeLLM } from "@/integrations/Core";
import { AlertTriangle, Shield, Zap, Globe, Calendar, RefreshCw, X, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ThreatIntelFeed() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [threatDetails, setThreatDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    fetchCurrentThreats();
  }, []);

  const getDateRange = () => {
    const today = new Date();
    let start, end;

    if (dateRange === 'custom' && customStart && customEnd) {
      start = new Date(customStart);
      end = new Date(customEnd);
    } else {
      end = new Date();
      start = new Date();
      start.setDate(start.getDate() - parseInt(dateRange));
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    return { startStr, endStr };
  };

  const fetchCurrentThreats = async () => {
   setLoading(true);
   try {
     const { startStr, endStr } = getDateRange();
     const response = await InvokeLLM({
       prompt: `As a cybersecurity and physical security intelligence analyst, provide the latest 10-12 most critical threats across cyber, physical, and tactical domains from ${startStr} to ${endStr}. Include:
       - Cyber Government sources: CISA, NSA, FBI, DISA, DHS
       - International Cyber sources: ENISA (EU), APAC CERTs, Interpol
       - International Physical Security sources: INTERPOL, Europol, national police cybercrime units, UK NCSC physical security advisories, international counter-terrorism agencies
       - Tactical/Defense sources: DIA (Defense Intelligence Agency), military threat assessments, international defense intelligence
       - Commercial feeds: Shodan, Censys, APT tracking, vulnerability databases, physical security threat reports
       - DISA STIGs & SCAP: Latest STIG updates, critical security controls (CAT I, II, III findings)

       For each item, include:
       - Title: Clear, specific threat/STIG/recommendation name
       - Description: 2-3 sentences describing the threat, vulnerability, physical security risk, or control requirement and impact
       - Severity: critical, high, medium, or low (for DISA: CAT I=critical, CAT II=high, CAT III=medium)
       - Category: malware, ransomware, vulnerability, phishing, apt, data-breach, compliance-control, physical-security, or tactical-threat
       - Source: Government agency, international body, commercial source, law enforcement, or defense intelligence
       - Date: Today's date in YYYY-MM-DD format
       - CVE ID: If applicable (cyber threats)
       - Affected Systems: What systems/facilities/personnel are impacted
       - STIG/CAT Level: If DISA-related, specify the CAT level (I, II, or III)

       Focus on current, actionable intelligence across all threat domains. Mix cyber threats, DISA STIG findings, physical security vulnerabilities, and tactical threat assessments to provide comprehensive intelligence to security professionals.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            threats: {
              type: "array",
              items: {
                type: "object",
                properties: {
                   title: { type: "string" },
                   description: { type: "string" },
                   severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
                   category: { type: "string", enum: ["malware", "ransomware", "vulnerability", "phishing", "apt", "data-breach", "compliance-control", "physical-security", "tactical-threat"] },
                   source: { type: "string" },
                   cve_id: { type: "string" },
                   affected_systems: { type: "string" },
                   published_date: { type: "string" },
                   stig_cat_level: { type: "string", enum: ["I", "II", "III"] }
                }
              }
            }
          }
        }
      });

      if (response && response.threats) {
        setThreats(response.threats);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching threat intelligence:', error);
      // Fallback to sample current threats
      setThreats([
        {
          title: "Critical Apache HTTP Server Vulnerability (CVE-2024-38474)",
          description: "CISA reports active exploitation of a critical vulnerability in Apache HTTP Server that allows remote code execution. Nation-state actors are actively scanning for vulnerable instances.",
          severity: "critical",
          category: "vulnerability",
          source: "CISA",
          cve_id: "CVE-2024-38474",
          affected_systems: "Apache HTTP Server 2.4.x",
          published_date: new Date().toISOString().split('T')[0]
        },
        {
          title: "LockBit 3.0 Ransomware Targeting Healthcare",
          description: "FBI warns of increased LockBit 3.0 ransomware attacks against healthcare organizations. New variants include advanced evasion techniques and target backup systems.",
          severity: "critical",
          category: "ransomware",
          source: "FBI",
          cve_id: null,
          affected_systems: "Healthcare IT Infrastructure",
          published_date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Chinese APT Group Targeting Defense Contractors",
          description: "NSA identifies sophisticated campaign by Chinese threat actors targeting defense industrial base. Attack involves supply chain compromise and living-off-the-land techniques.",
          severity: "high",
          category: "apt",
          source: "NSA",
          cve_id: null,
          affected_systems: "Defense Contractor Networks",
          published_date: new Date().toISOString().split('T')[0]
        }
      ]);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'high': return Zap;
      default: return Shield;
    }
  };

  const getSourceColor = (source) => {
    if (!source) return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    const src = source.toLowerCase();
    if (src.includes('interpol') || src.includes('europol') || src.includes('ncsc')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    if (src.includes('dia') || src.includes('military') || src.includes('defense intelligence')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    switch (src) {
      case 'cisa': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'nsa': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'fbi': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'disa': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'enisa': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'shodan': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'censys': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const fetchThreatDetails = async (threat) => {
    setLoadingDetails(true);
    try {
      const details = await InvokeLLM({
        prompt: `Based on this cyber/physical security threat:
        Title: ${threat.title}
        Description: ${threat.description}
        Category: ${threat.category}
        Affected Systems: ${threat.affected_systems || 'N/A'}
        CVE: ${threat.cve_id || 'N/A'}
        
        Provide a comprehensive security response including:
        1. Detailed threat assessment and impact analysis
        2. Affected systems/organizations breakdown
        3. Detection methods and indicators of compromise
        4. Recommended protective measures and mitigation strategies
        5. Remediation steps and implementation guidance
        6. Monitoring and alert indicators to watch for
        7. References and additional resources
        
        Format as actionable, professional security guidance.`,
        add_context_from_internet: true
      });
      setThreatDetails(details);
    } catch (error) {
      console.error('Error fetching threat details:', error);
      setThreatDetails('Unable to retrieve detailed analysis. Please try again.');
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Live Threat Intelligence Feed
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Loading latest security threats from government sources...</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="bg-slate-800/30 border-slate-700/50 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-600/50 rounded mb-4"></div>
                <div className="h-6 bg-slate-600/50 rounded mb-2"></div>
                <div className="h-4 bg-slate-600/50 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
          Live Threat Intelligence
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Real-time alerts on emerging cybersecurity threats, vulnerabilities, and active campaigns to keep you ahead of adversaries.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-8 mt-6">
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-green-400" />
            <span className="text-sm">Live Feed Active</span>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <Button
            onClick={fetchCurrentThreats}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Date Filter Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => { setDateRange('7'); fetchCurrentThreats(); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === '7' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => { setDateRange('30'); fetchCurrentThreats(); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === '30' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => { setDateRange('90'); fetchCurrentThreats(); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === '90' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              90 Days
            </button>
            <button
              onClick={() => setDateRange('custom')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === 'custom' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Custom
            </button>
          </div>
          
          {dateRange === 'custom' && (
            <div className="flex gap-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-1.5 rounded-md text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-1.5 rounded-md text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
              <Button
                onClick={fetchCurrentThreats}
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Government, International, Physical & Commercial Source Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['CISA', 'NSA', 'FBI', 'DISA', 'ENISA', 'INTERPOL', 'Europol', 'DIA', 'Shodan', 'Censys', 'CVE'].map((source) => (
            <Badge key={source} className={`${getSourceColor(source)} text-xs font-semibold`}>
              {source}
            </Badge>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {threats.map((threat, index) => {
          const SeverityIcon = getSeverityIcon(threat.severity);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 h-full flex flex-col cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${getSeverityColor(threat.severity)} flex items-center gap-1`}>
                      <SeverityIcon className="w-3 h-3" />
                      {threat.severity.toUpperCase()}
                    </Badge>
                    <Badge className={`${getSourceColor(threat.source)} text-xs font-bold`}>
                      {threat.source}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg text-white leading-tight mb-2">
                    {threat.title}
                  </CardTitle>

                  <div className="flex gap-2 flex-wrap">
                    {threat.cve_id && (
                      <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs w-fit">
                        {threat.cve_id}
                      </Badge>
                    )}
                    {threat.stig_cat_level && (
                      <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs w-fit font-bold">
                        CAT {threat.stig_cat_level}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col">
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {threat.description}
                  </p>

                  {threat.affected_systems && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        Affected Systems
                      </h4>
                      <p className="text-slate-300 text-sm">
                        {threat.affected_systems}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                      {threat.category}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {(() => {
                        if (!threat.published_date) return '';
                        // Handle YYYY-MM-DD format specifically to avoid timezone bugs
                        if (typeof threat.published_date === 'string' && threat.published_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                           const parts = threat.published_date.split('-');
                           const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])); // Month is 0-indexed
                           return date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });
                        }
                        const date = new Date(threat.published_date);
                        return !isNaN(date.getTime()) ? date.toLocaleDateString() : threat.published_date;
                      })()}
                    </span>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedThreat(threat);
                      fetchThreatDetails(threat);
                    }}
                    size="sm"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Details & Mitigation
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {threats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 text-sm mb-4">
            Cyber, physical security & tactical threat intelligence from government, law enforcement, defense, and commercial feeds
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <span>• Cyber Government: CISA, NSA, FBI, DISA, DHS</span>
            <span>• International: ENISA, APAC CERTs, INTERPOL, Europol, UK NCSC</span>
            <span>• Physical & Tactical: DIA, Counter-Terrorism Agencies, International Defense Intelligence</span>
            <span>• Compliance: DISA STIGs, SCAP Scans (CAT I/II/III)</span>
            <span>• Commercial: Shodan, Censys, Threat Feeds, CVE Database</span>
          </div>
        </motion.div>
      )}

      {/* Threat Details Modal */}
      <Dialog open={selectedThreat !== null} onOpenChange={(open) => {
        if (!open) {
          setSelectedThreat(null);
          setThreatDetails(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl text-white mb-3">
                  {selectedThreat?.title}
                </DialogTitle>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={`${getSeverityColor(selectedThreat?.severity)} flex items-center gap-1`}>
                    <AlertTriangle className="w-3 h-3" />
                    {selectedThreat?.severity?.toUpperCase()}
                  </Badge>
                  <Badge className={`${getSourceColor(selectedThreat?.source)} text-xs font-bold`}>
                    {selectedThreat?.source}
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                    {selectedThreat?.category}
                  </Badge>
                  {selectedThreat?.cve_id && (
                    <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs">
                      {selectedThreat?.cve_id}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedThreat(null);
                  setThreatDetails(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Overview</h3>
              <p className="text-sm leading-relaxed">{selectedThreat?.description}</p>
            </div>

            {selectedThreat?.affected_systems && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Affected Systems</h3>
                <p className="text-sm">{selectedThreat?.affected_systems}</p>
              </div>
            )}

            {loadingDetails ? (
              <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                <div className="inline-block animate-spin">
                  <Shield className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-sm text-slate-400 mt-2">Loading detailed analysis...</p>
              </div>
            ) : threatDetails ? (
              <div className="space-y-4">
                {typeof threatDetails === 'string' ? (
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{threatDetails}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      const content = typeof threatDetails === 'string' ? threatDetails : String(threatDetails);
                      const sections = [];
                      let currentSection = null;
                      
                      content.split('\n').forEach((line) => {
                        const trimmed = line.trim();
                        if (!trimmed) return;
                        
                        // Check for section headers (marked with ** or numbered)
                        const sectionMatch = trimmed.match(/^\*\*([^*]+)\*\*:?\s*(.*)$/) || trimmed.match(/^(\d+\.\s*[^:]+):\s*(.*)$/);
                        
                        if (sectionMatch) {
                          if (currentSection) sections.push(currentSection);
                          currentSection = {
                            header: sectionMatch[1].replace(/^\*\*/, '').replace(/\*\*/, ''),
                            content: sectionMatch[2] ? [sectionMatch[2]] : []
                          };
                        } else if (currentSection) {
                          currentSection.content.push(trimmed);
                        }
                      });
                      
                      if (currentSection) sections.push(currentSection);
                      
                      return sections.length > 0 ? (
                        sections.map((section, idx) => (
                          <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
                              {section.header}
                            </h4>
                            <div className="text-sm text-slate-300 space-y-2">
                              {section.content.map((line, i) => (
                                <p key={i} className="leading-relaxed">
                                  {line.replace(/\*\*/g, '').replace(/[-•]\s/, '• ')}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{content}</p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}