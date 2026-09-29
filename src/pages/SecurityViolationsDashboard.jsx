import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "@/entities/User";
import { SecurityViolationLog } from "@/entities/SecurityViolationLog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, TrendingUp, Clock, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function SecurityViolationsDashboard() {
  const [violations, setViolations] = useState([]);
  const { isAdmin: currentUser, loading } = useAdminAccess();
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    blockedIps: 0
  });

  useEffect(() => {
    const fetchViolations = async () => {
      if (!currentUser) return;
      try {
        const fetchedViolations = await SecurityViolationLog.list('-created_date');
        setViolations(fetchedViolations);

        // Calculate stats
        const critical = fetchedViolations.filter(v => v.severity === 'critical').length;
        const high = fetchedViolations.filter(v => v.severity === 'high').length;
        const blocked = new Set(fetchedViolations
          .filter(v => v.action_taken === 'blocked')
          .map(v => v.source_ip)
        ).size;

        setStats({
          total: fetchedViolations.length,
          critical,
          high,
          blockedIps: blocked
        });
      } catch (error) {
        console.error("Failed to fetch violations:", error);
      }
    };

    fetchViolations();
  }, [currentUser]);

  const filteredViolations = violations.filter(v => {
    const severityMatch = filterSeverity === 'all' || v.severity === filterSeverity;
    const typeMatch = filterType === 'all' || v.violation_type === filterType;
    return severityMatch && typeMatch;
  });

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      critical: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[severity] || colors.low;
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'critical') return '🔴';
    if (severity === 'high') return '🟠';
    if (severity === 'medium') return '🟡';
    return '🔵';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-slate-400">Loading security violations...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-red-400">Access denied. Admin role required.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Security Violations Monitor
          </h1>
          <p className="text-xl text-slate-400">
            Real-time tracking of security violations, policy breaches, and compliance incidents
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Total Violations</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                  </div>
                  <Shield className="w-8 h-8 text-slate-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-400 text-sm mb-2">Critical</p>
                    <p className="text-3xl font-bold text-red-400">{stats.critical}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-400 text-sm mb-2">High Priority</p>
                    <p className="text-3xl font-bold text-orange-400">{stats.high}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Blocked IPs</p>
                    <p className="text-3xl font-bold text-white">{stats.blockedIps}</p>
                  </div>
                  <Shield className="w-8 h-8 text-slate-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="unauthorized_scraping">Unauthorized Scraping</SelectItem>
                <SelectItem value="excessive_requests">Excessive Requests</SelectItem>
                <SelectItem value="bot_detection">Bot Detection</SelectItem>
                <SelectItem value="data_exfiltration_attempt">Data Exfiltration</SelectItem>
                <SelectItem value="suspicious_behavior">Suspicious Behavior</SelectItem>
                <SelectItem value="compliance_breach">Compliance Breach</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Violations List */}
        <div className="space-y-4">
          {filteredViolations.length > 0 ? (
            filteredViolations.map((violation, index) => (
              <motion.div
                key={violation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-900 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{getSeverityIcon(violation.severity)}</span>
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {violation.violation_type.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-slate-400 text-sm">{violation.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Source IP</p>
                            <p className="text-sm font-mono text-white">{violation.source_ip}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Status</p>
                            <Badge className={getSeverityColor(violation.severity)}>
                              {violation.severity}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Action</p>
                            <Badge className="bg-slate-700 text-slate-300">
                              {violation.action_taken}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Detected</p>
                            <p className="text-sm text-white flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(violation.created_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No violations matching current filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}