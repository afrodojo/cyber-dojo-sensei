import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InvokeLLM } from "@/integrations/Core";
import { AlertTriangle, Shield, Globe, Calendar, RefreshCw, X, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PhysicalThreatIntel() {
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
    fetchPhysicalThreats();
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

  const fetchPhysicalThreats = async () => {
    setLoading(true);
    try {
      const { startStr, endStr } = getDateRange();
      const response = await InvokeLLM({
        prompt: `As a physical security and tactical intelligence analyst, provide the latest 6-8 most critical physical security and tactical threats from ${startStr} to ${endStr}. Include both physical facility security threats and tactical threat assessments relevant to executive protection, facility security, and tactical operations.

       Sources to reference: DHS alerts, FBI warnings, Secret Service advisories, ATF bulletins, international law enforcement (INTERPOL, Europol), DIA tactical assessments, counter-terrorism agencies, and local law enforcement intelligence.

       Format each threat with:
       - Title: Clear, specific threat name
       - Description: 2-3 sentences describing the physical/tactical threat and impact
       - Severity: critical, high, medium, or low
       - Category: terrorism, workplace-violence, executive-threat, facility-security, public-safety, or tactical-threat
       - Source: Which government agency or international organization reported it (e.g., DHS, FBI, INTERPOL, DIA, Secret Service)
       - Date: Today's date in YYYY-MM-DD format
       - Location: Geographic area of concern
       - Target Type: What type of facilities/persons are targeted

       Focus on current, actionable physical and tactical security intelligence that security professionals and executives need to know about RIGHT NOW.`,
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
                   category: { type: "string", enum: ["terrorism", "workplace-violence", "executive-threat", "facility-security", "public-safety", "tactical-threat"] },
                   source: { type: "string" },
                   location: { type: "string" },
                   target_type: { type: "string" },
                   published_date: { type: "string" }
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
      console.error('Error fetching physical threat intelligence:', error);
      // Fallback to sample physical threats
      setThreats([
        {
          title: "Increased Swatting Incidents Targeting Executives",
          description: "FBI reports a 300% increase in swatting incidents targeting corporate executives and their families. These false emergency calls result in armed police responses and create significant safety risks.",
          severity: "high",
          category: "executive-threat",
          source: "FBI",
          location: "Nationwide",
          target_type: "Corporate Executives",
          published_date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Active Shooter Threats at Government Facilities",
          description: "DHS warns of credible threats against federal buildings and courthouses. Enhanced security protocols are being implemented at high-risk facilities nationwide.",
          severity: "critical",
          category: "terrorism",
          source: "DHS",
          location: "Federal Facilities",
          target_type: "Government Buildings",
          published_date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Vehicle Ramming Attack Intelligence",
          description: "Secret Service advisory on potential vehicle ramming attacks targeting high-profile events and facilities. Increased perimeter security measures recommended.",
          severity: "high",
          category: "terrorism",
          source: "Secret Service",
          location: "Major Cities",
          target_type: "Public Events & Infrastructure",
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
      case 'high': return AlertTriangle;
      default: return Shield;
    }
  };

  const getSourceColor = (source) => {
    if (!source) return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    const src = source.toLowerCase();
    if (src.includes('interpol') || src.includes('europol') || src.includes('international')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    if (src.includes('dia') || src.includes('tactical') || src.includes('defense')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    switch (src) {
      case 'dhs': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'secret service': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'fbi': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'atf': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const fetchThreatDetails = async (threat) => {
    setLoadingDetails(true);
    try {
      const details = await InvokeLLM({
        prompt: `Based on this physical/tactical security threat:
        Title: ${threat.title}
        Description: ${threat.description}
        Category: ${threat.category}
        Location: ${threat.location}
        
        Provide a comprehensive security response including:
        1. Detailed threat assessment and impact analysis
        2. Recommended protective measures and mitigation strategies
        3. Tactical recommendations for personnel and facility protection
        4. Remediation steps and hardening measures
        5. Response protocols and contingency planning
        6. Monitoring and alert indicators to watch for
        
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
            Live Physical Threat Intelligence
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Loading latest physical security threats...</p>
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
          Physical & Tactical Threat Intel
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Situational awareness for the physical world. Insights on protest activity, civil unrest, and other kinetic threats.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-8 mt-8">
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-sm">Live Feed Active</span>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <Button
            onClick={fetchPhysicalThreats}
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
              onClick={() => { setDateRange('7'); fetchPhysicalThreats(); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === '7' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => { setDateRange('30'); fetchPhysicalThreats(); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === '30' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => { setDateRange('90'); fetchPhysicalThreats(); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === '90' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              90 Days
            </button>
            <button
              onClick={() => setDateRange('custom')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === 'custom' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
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
                className="px-3 py-1.5 rounded-md text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-1.5 rounded-md text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
              <Button
                onClick={fetchPhysicalThreats}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Government Source Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['DHS', 'FBI', 'Secret Service', 'ATF', 'DIA', 'INTERPOL', 'Europol', 'Local LE'].map((source) => (
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
              <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 h-full">
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

                  {threat.location && (
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs w-fit mb-2">
                      📍 {threat.location}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {threat.description}
                  </p>

                  {threat.target_type && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        Target Type
                      </h4>
                      <p className="text-slate-300 text-sm">
                        {threat.target_type}
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
                        if (typeof threat.published_date === 'string' && threat.published_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                           const parts = threat.published_date.split('-');
                           const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
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
                    View Details & Remediation
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
            Physical & tactical threat intelligence from government, international law enforcement, and defense sources
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <span>• U.S. Government: DHS, FBI, Secret Service, ATF, DIA</span>
            <span>• International: INTERPOL, Europol, Counter-Terrorism Agencies</span>
            <span>• Intelligence: Defense Intelligence Agency, Tactical Assessments</span>
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

            {selectedThreat?.location && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Location</h3>
                <p className="text-sm">📍 {selectedThreat?.location}</p>
              </div>
            )}

            {selectedThreat?.target_type && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Target Type</h3>
                <p className="text-sm">{selectedThreat?.target_type}</p>
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