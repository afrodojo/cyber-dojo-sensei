import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Building2, CheckCircle2, TrendingUp, AlertTriangle, ChevronDown, ChevronRight, DollarSign, Clock, Target, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/seo/SEOHead";

// ─── Data ────────────────────────────────────────────────────────────────────

const COMPLIANCE_FRAMEWORKS = [
  { id: "cmmc", label: "CMMC", fullName: "Cybersecurity Maturity Model Certification", sector: "Defense" },
  { id: "nist", label: "NIST CSF", fullName: "NIST Cybersecurity Framework", sector: "Federal / General" },
  { id: "fisma", label: "FISMA", fullName: "Federal Information Security Management Act", sector: "Federal Agencies" },
  { id: "hipaa", label: "HIPAA", fullName: "Health Insurance Portability & Accountability Act", sector: "Healthcare" },
  { id: "pci", label: "PCI-DSS", fullName: "Payment Card Industry Data Security Standard", sector: "Finance / Retail" },
  { id: "iso27001", label: "ISO 27001", fullName: "ISO/IEC 27001 Information Security Management", sector: "Enterprise" },
  { id: "soc2", label: "SOC 2", fullName: "Service Organization Control 2", sector: "SaaS / Tech" },
];

const ORG_SIZES = [
  { id: "small", label: "Small", desc: "1–50 employees", multiplier: 1 },
  { id: "medium", label: "Medium", desc: "51–500 employees", multiplier: 2.5 },
  { id: "large", label: "Large", desc: "500–5,000 employees", multiplier: 6 },
  { id: "enterprise", label: "Enterprise", desc: "5,000+ employees", multiplier: 15 },
];

const SERVICES = [
  {
    id: "red-team",
    title: "Red Team Operations",
    category: "Offensive Security",
    description: "Full-scope adversarial simulation mimicking nation-state and APT tactics to expose critical gaps before real attackers do.",
    frameworks: ["cmmc", "nist", "fisma", "iso27001"],
    orgSizes: ["medium", "large", "enterprise"],
    baseRoi: 420,
    baseRoiMonths: 18,
    baseCost: 45000,
    priority: "critical",
    outcomes: ["Identifies exploitable attack paths", "Tests incident response readiness", "CMMC Level 2/3 validation", "Executive risk briefing"],
    icon: "🎯",
  },
  {
    id: "pentest",
    title: "Penetration Testing",
    category: "Offensive Security",
    description: "Systematic exploitation of vulnerabilities across network, web, cloud, and physical attack surfaces with detailed remediation guidance.",
    frameworks: ["cmmc", "nist", "fisma", "hipaa", "pci", "iso27001", "soc2"],
    orgSizes: ["small", "medium", "large", "enterprise"],
    baseRoi: 310,
    baseRoiMonths: 12,
    baseCost: 18000,
    priority: "high",
    outcomes: ["CVE-level vulnerability disclosure", "Compliance gap reports", "Developer remediation runbooks", "Risk scoring dashboard"],
    icon: "🔍",
  },
  {
    id: "security-arch",
    title: "Security Architecture Review",
    category: "Consulting",
    description: "Zero-trust architecture design, network segmentation strategy, and cloud security posture hardening aligned to compliance mandates.",
    frameworks: ["nist", "fisma", "cmmc", "iso27001", "soc2"],
    orgSizes: ["medium", "large", "enterprise"],
    baseRoi: 280,
    baseRoiMonths: 24,
    baseCost: 35000,
    priority: "high",
    outcomes: ["Zero-trust roadmap", "Cloud hardening blueprint", "Architecture risk register", "Board-ready security strategy"],
    icon: "🏗",
  },
  {
    id: "compliance-advisory",
    title: "Compliance Advisory",
    category: "Compliance",
    description: "Gap assessments, policy authoring, and audit readiness programs for CMMC, NIST, FISMA, HIPAA, PCI-DSS, and more.",
    frameworks: ["cmmc", "nist", "fisma", "hipaa", "pci", "iso27001", "soc2"],
    orgSizes: ["small", "medium", "large", "enterprise"],
    baseRoi: 190,
    baseRoiMonths: 9,
    baseCost: 12000,
    priority: "high",
    outcomes: ["Pre-assessment gap analysis", "Policy & procedure library", "Audit-ready evidence packs", "Continuous monitoring plan"],
    icon: "📋",
  },
  {
    id: "incident-response",
    title: "Incident Response Planning",
    category: "Resilience",
    description: "IR plan development, tabletop exercises, and 24/7 retainer services to contain and recover from breaches in minimum time.",
    frameworks: ["nist", "fisma", "hipaa", "iso27001", "soc2"],
    orgSizes: ["small", "medium", "large", "enterprise"],
    baseRoi: 560,
    baseRoiMonths: 6,
    baseCost: 22000,
    priority: "critical",
    outcomes: ["IR playbooks per threat scenario", "Tabletop simulation exercises", "MTTR reduction by avg 67%", "Regulatory breach notification SOPs"],
    icon: "🚨",
  },
  {
    id: "training",
    title: "Security Awareness & Training",
    category: "Human Risk",
    description: "Role-based cyber training, phishing simulations, and CMMC/FISMA workforce development programs.",
    frameworks: ["cmmc", "nist", "fisma", "hipaa", "iso27001"],
    orgSizes: ["small", "medium", "large", "enterprise"],
    baseRoi: 220,
    baseRoiMonths: 6,
    baseCost: 8000,
    priority: "medium",
    outcomes: ["Phishing susceptibility reduction", "Role-based training modules", "Compliance workforce certs", "Culture-of-security metrics"],
    icon: "🎓",
  },
  {
    id: "threat-intel",
    title: "Threat Intelligence Program",
    category: "Intelligence",
    description: "Tailored threat feeds, adversary profiling, and OSINT-driven intelligence collection aligned to your sector and attack surface.",
    frameworks: ["nist", "fisma", "cmmc", "iso27001"],
    orgSizes: ["medium", "large", "enterprise"],
    baseRoi: 340,
    baseRoiMonths: 12,
    baseCost: 28000,
    priority: "high",
    outcomes: ["Sector-specific threat actor profiles", "IOC/TTP feeds", "OSINT surface mapping", "Monthly executive threat briefs"],
    icon: "🛰",
  },
  {
    id: "vciso",
    title: "Virtual CISO (vCISO)",
    category: "Leadership",
    description: "Fractional CISO services providing executive security leadership, board reporting, and strategic roadmap ownership.",
    frameworks: ["nist", "fisma", "cmmc", "hipaa", "pci", "iso27001", "soc2"],
    orgSizes: ["small", "medium"],
    baseRoi: 400,
    baseRoiMonths: 12,
    baseCost: 7500,
    priority: "high",
    outcomes: ["Security roadmap & budget planning", "Board & executive reporting", "Vendor risk management", "Program KPIs & metrics"],
    icon: "👔",
  },
];

const PRIORITY_CONFIG = {
  critical: { label: "Critical Priority", color: "text-red-400", bg: "bg-red-950/40 border-red-500/30", dot: "bg-red-500" },
  high: { label: "High Priority", color: "text-orange-400", bg: "bg-orange-950/40 border-orange-500/30", dot: "bg-orange-500" },
  medium: { label: "Medium Priority", color: "text-yellow-400", bg: "bg-yellow-950/40 border-yellow-500/30", dot: "bg-yellow-500" },
};

// ─── ROI Calculator ───────────────────────────────────────────────────────────

function getRoiData(service, orgSize) {
  const size = ORG_SIZES.find(s => s.id === orgSize) || ORG_SIZES[0];
  const cost = Math.round(service.baseCost * size.multiplier);
  const breachAvoidanceSavings = Math.round(cost * (service.baseRoi / 100));
  const roi = service.baseRoi;
  return { cost, breachAvoidanceSavings, roi, months: service.baseRoiMonths };
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, orgSize, index }) {
  const [expanded, setExpanded] = useState(false);
  const roi = getRoiData(service, orgSize);
  const p = PRIORITY_CONFIG[service.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`rounded-2xl border ${p.bg} backdrop-blur-sm overflow-hidden`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{service.icon}</span>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">{service.title}</h3>
              <span className="text-xs text-slate-500 font-medium">{service.category}</span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-700/50 flex-shrink-0`}>
            <div className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
            <span className={`text-xs font-semibold ${p.color}`}>{p.label}</span>
          </div>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.description}</p>

        {/* ROI Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-900/60 rounded-xl p-3 text-center">
            <DollarSign className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-white font-bold text-sm">${(roi.cost / 1000).toFixed(0)}K</div>
            <div className="text-slate-500 text-xs">Est. Investment</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 text-center">
            <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <div className="text-green-400 font-bold text-sm">{roi.roi}%</div>
            <div className="text-slate-500 text-xs">Avg. ROI</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-white font-bold text-sm">{roi.months}mo</div>
            <div className="text-slate-500 text-xs">Payback Period</div>
          </div>
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          {expanded ? "Hide" : "See"} deliverables
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="mt-4 space-y-2">
                {service.outcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {o}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 pb-5">
        <Button asChild size="sm" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-xs">
          <Link to={createPageUrl("Contact")}>Request This Service →</Link>
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CapabilityMatrix() {
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [selectedOrgSize, setSelectedOrgSize] = useState("medium");

  const toggleFramework = (id) => {
    setSelectedFrameworks(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    return SERVICES.filter(s => {
      const frameworkMatch = selectedFrameworks.length === 0 ||
        selectedFrameworks.some(f => s.frameworks.includes(f));
      const sizeMatch = s.orgSizes.includes(selectedOrgSize);
      return frameworkMatch && sizeMatch;
    });
  }, [selectedFrameworks, selectedOrgSize]);

  const totalInvestment = filtered.reduce((sum, s) => {
    const size = ORG_SIZES.find(o => o.id === selectedOrgSize);
    return sum + Math.round(s.baseCost * (size?.multiplier || 1));
  }, 0);

  const avgRoi = filtered.length
    ? Math.round(filtered.reduce((s, svc) => s + svc.baseRoi, 0) / filtered.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6">
      <SEOHead
        title="Capability Matrix | Asaad Morman – Cybersecurity Services"
        description="Filter cybersecurity services by compliance framework (CMMC, NIST, FISMA, HIPAA) and organization size to get tailored security recommendations and ROI."
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 text-xs font-semibold">Interactive Capability Matrix</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Security Stack
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Filter by your compliance requirements and organization size to get tailored service recommendations with projected ROI.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h2 className="text-white font-semibold text-sm">Configure Your Profile</h2>
          </div>

          {/* Org Size */}
          <div className="mb-6">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Organization Size</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ORG_SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedOrgSize(size.id)}
                  className={`rounded-xl p-3 text-left border transition-all duration-200 ${
                    selectedOrgSize === size.id
                      ? "bg-cyan-950/60 border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600"
                  }`}
                >
                  <div className={`font-bold text-sm ${selectedOrgSize === size.id ? "text-cyan-300" : "text-white"}`}>{size.label}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{size.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Compliance Frameworks */}
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Compliance Frameworks <span className="text-slate-600 font-normal normal-case">(select all that apply — leave blank for all)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {COMPLIANCE_FRAMEWORKS.map(fw => (
                <button
                  key={fw.id}
                  onClick={() => toggleFramework(fw.id)}
                  className={`group flex flex-col items-start px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    selectedFrameworks.includes(fw.id)
                      ? "bg-blue-950/60 border-blue-500/60 shadow-md shadow-blue-500/10"
                      : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600"
                  }`}
                >
                  <div className={`font-bold text-sm ${selectedFrameworks.includes(fw.id) ? "text-blue-300" : "text-white"}`}>{fw.label}</div>
                  <div className="text-slate-500 text-xs">{fw.sector}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Summary Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 px-1"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span><span className="text-white font-bold">{filtered.length}</span> services match your profile</span>
          </div>
          {filtered.length > 0 && (
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-slate-400 text-sm">Est. Total: <span className="text-white font-bold">${(totalInvestment / 1000).toFixed(0)}K</span></span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400 text-sm">Avg. ROI: <span className="text-cyan-400 font-bold">{avgRoi}%</span></span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4 opacity-60" />
              <h3 className="text-white font-semibold text-lg mb-2">No services match this profile</h3>
              <p className="text-slate-400 text-sm">Try selecting a different organization size or removing some framework filters.</p>
            </motion.div>
          ) : (
            <motion.div key="results" className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((service, i) => (
                <ServiceCard key={service.id} service={service} orgSize={selectedOrgSize} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/20 rounded-2xl px-10 py-8 max-w-xl">
              <Building2 className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Ready to Build Your Security Program?</h2>
              <p className="text-slate-400 text-sm mb-5">Schedule an executive briefing to walk through your custom capability matrix and investment roadmap.</p>
              <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold">
                <Link to={createPageUrl("ExecutiveBriefings")}>Schedule Executive Briefing →</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}