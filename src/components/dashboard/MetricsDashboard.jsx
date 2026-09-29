import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SecurityMetric } from "@/entities/SecurityMetric";
import { TrendingUp, Target, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await SecurityMetric.list('display_order');
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Fallback data
        setMetrics([
          { metric_name: "vulnerabilities_found_this_year", current_value: 1247, unit: "count", description: "Critical vulnerabilities identified" },
          { metric_name: "clients_served", current_value: 89, unit: "count", description: "Enterprise clients served" },
          { metric_name: "average_risk_reduction", current_value: 87, unit: "%", description: "Average risk reduction achieved" },
          { metric_name: "threat_actors_identified", current_value: 34, unit: "count", description: "Threat actors identified" }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  const getIcon = (metricName) => {
    switch (metricName) {
      case "vulnerabilities_found_this_year": return Target;
      case "clients_served": return Users;
      case "average_risk_reduction": return Shield;
      default: return TrendingUp;
    }
  };

  const getColor = (metricName) => {
    switch (metricName) {
      case "vulnerabilities_found_this_year": return "text-red-400";
      case "clients_served": return "text-blue-400";
      case "average_risk_reduction": return "text-green-400";
      default: return "text-cyan-400";
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <Card key={i} className="bg-slate-800/30 border-slate-700/50 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-600/50 rounded mb-2"></div>
              <div className="h-8 bg-slate-600/50 rounded mb-2"></div>
              <div className="h-3 bg-slate-600/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = getIcon(metric.metric_name);
        const color = getColor(metric.metric_name);
        
        return (
          <motion.div
            key={metric.metric_name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${color}`} />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">
                    {metric.unit === '%' ? 'Percentage' : 'Total'}
                  </span>
                </div>
                <div className={`text-3xl font-bold mb-2 ${color}`}>
                  {metric.current_value.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                </div>
                <p className="text-slate-400 text-sm leading-tight">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}