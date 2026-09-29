import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, AlertTriangle, CheckCircle, XCircle, Activity, Terminal, RefreshCw, Play, Lock, Wifi, Server, Database, Monitor, Globe, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Network topology ──────────────────────────────────────────────────────────
const INITIAL_NODES = [
  { id: "internet",   label: "Internet",        icon: Globe,    x: 50,  y: 50,  type: "external" },
  { id: "firewall",   label: "Firewall",         icon: Shield,   x: 50,  y: 25,  type: "security" },
  { id: "web",        label: "Web Server",       icon: Server,   x: 22,  y: 50,  type: "server" },
  { id: "app",        label: "App Server",       icon: Cpu,      x: 50,  y: 50,  type: "server" },
  { id: "db",         label: "Database",         icon: Database, x: 78,  y: 50,  type: "server" },
  { id: "workstation",label: "Workstation",      icon: Monitor,  x: 28,  y: 75,  type: "endpoint" },
  { id: "siem",       label: "Outpost Zero",     icon: Activity, x: 72,  y: 75,  type: "sentinel" },
];

const EDGES = [
  ["internet", "firewall"],
  ["firewall", "web"],
  ["firewall", "app"],
  ["firewall", "db"],
  ["web", "app"],
  ["app", "db"],
  ["workstation", "app"],
  ["siem", "web"],
  ["siem", "app"],
  ["siem", "db"],
  ["siem", "firewall"],
];

// ── Attack scenarios ──────────────────────────────────────────────────────────
const ATTACKS = [
  {
    id: "ddos",
    name: "DDoS Flood",
    description: "Overwhelm the firewall with massive traffic from multiple sources.",
    color: "#f87171",
    targetPath: ["internet", "firewall"],
    spreadTo: ["web"],
    severity: "high",
    ttd: 2200,   // ms to detect
    ttr: 5500,   // ms to remediate
    steps: [
      { t: 0,    msg: "⚠️  Anomalous traffic spike detected — 847,000 req/s inbound", level: "warn" },
      { t: 1200, msg: "🔴 DDoS confirmed. SYN-flood pattern matching MITRE T1498", level: "crit" },
      { t: 2200, msg: "🛡  Outpost Zero: Autonomous triage initiated — confidence 97%", level: "sentinel" },
      { t: 3000, msg: "⚙️  BGP null-route deployed. Scrubbing center activated", level: "action" },
      { t: 4000, msg: "✅ Traffic normalized. Firewall rule auto-hardened", level: "ok" },
      { t: 5500, msg: "🔒 Self-healing complete. Incident logged & playbook updated", level: "ok" },
    ],
  },
  {
    id: "sqli",
    name: "SQL Injection",
    description: "Attempt database exfiltration via malicious queries through the app layer.",
    color: "#fb923c",
    targetPath: ["internet", "firewall", "web", "app", "db"],
    spreadTo: ["db"],
    severity: "critical",
    ttd: 1800,
    ttr: 6000,
    steps: [
      { t: 0,    msg: "⚠️  Malformed query string in POST /api/users — suspicious payload", level: "warn" },
      { t: 900,  msg: "🔴 SQL injection vector confirmed — OR 1=1 pattern detected", level: "crit" },
      { t: 1800, msg: "🛡  ASOSINT: Adversary profiling initiated — TTP fingerprinting", level: "sentinel" },
      { t: 2800, msg: "⚙️  WAF rule auto-generated & deployed in 340ms", level: "action" },
      { t: 3800, msg: "⚙️  Database connection sandboxed — query whitelisting enabled", level: "action" },
      { t: 5000, msg: "✅ Exfiltration path severed. Zero data exfiltrated", level: "ok" },
      { t: 6000, msg: "🔒 Remediation complete. CVE mapping recorded", level: "ok" },
    ],
  },
  {
    id: "ransomware",
    name: "Ransomware",
    description: "Encrypt workstation files and attempt lateral movement to servers.",
    color: "#c084fc",
    targetPath: ["internet", "firewall", "workstation"],
    spreadTo: ["workstation", "app"],
    severity: "critical",
    ttd: 3000,
    ttr: 8000,
    steps: [
      { t: 0,    msg: "⚠️  Unusual file I/O burst on WORKSTATION-07 — 4,200 writes/sec", level: "warn" },
      { t: 1500, msg: "🔴 Ransomware signature: LockBit variant — encryption in progress", level: "crit" },
      { t: 3000, msg: "🛡  Izulu Sentinel: Physical + digital correlation triggered", level: "sentinel" },
      { t: 4000, msg: "⚙️  Workstation network-isolated in 120ms via SDN micro-segmentation", level: "action" },
      { t: 5000, msg: "⚙️  Shadow backup snapshot invoked — rollback point created", level: "action" },
      { t: 6200, msg: "⚙️  Lateral movement to APP-SERVER blocked by ML behavioral model", level: "action" },
      { t: 7200, msg: "✅ Workstation restored from snapshot — 0 data loss", level: "ok" },
      { t: 8000, msg: "🔒 Autonomous containment cycle complete", level: "ok" },
    ],
  },
  {
    id: "zeroday",
    name: "Zero-Day Exploit",
    description: "Unknown vulnerability exploitation targeting the application server.",
    color: "#22d3ee",
    targetPath: ["internet", "firewall", "app"],
    spreadTo: ["app", "db"],
    severity: "critical",
    ttd: 4000,
    ttr: 9500,
    steps: [
      { t: 0,    msg: "⚠️  Anomalous memory access pattern in app-server PID 4821", level: "warn" },
      { t: 2000, msg: "🔴 Zero-day exploit detected — no existing CVE signature match", level: "crit" },
      { t: 4000, msg: "🛡  Outpost Zero + ASOSINT: Novel TTP behavioral analysis engaged", level: "sentinel" },
      { t: 5200, msg: "⚙️  Generative AI model synthesizing countermeasure in real-time", level: "action" },
      { t: 6500, msg: "⚙️  Virtual patch deployed to app runtime — exploit neutralized", level: "action" },
      { t: 7800, msg: "⚙️  Threat shared to ISAC feed — ecosystem-wide protection updated", level: "action" },
      { t: 9000, msg: "✅ Novel threat contained. AI model retrained on new TTP", level: "ok" },
      { t: 9500, msg: "🔒 Zero-day response archived. Global playbook updated", level: "ok" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const nodeStatusColor = (status) => ({
  healthy:    "#22c55e",
  targeted:   "#ef4444",
  attacking:  "#f97316",
  healing:    "#eab308",
  protected:  "#06b6d4",
  sentinel:   "#8b5cf6",
}[status] || "#64748b");

const logColor = (level) => ({
  warn:     "text-yellow-400",
  crit:     "text-red-400",
  sentinel: "text-violet-400",
  action:   "text-cyan-400",
  ok:       "text-green-400",
  info:     "text-slate-400",
}[level] || "text-slate-400");

// ── Main Component ────────────────────────────────────────────────────────────
export default function SentinelSimulator() {
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [simState, setSimState] = useState("idle"); // idle | running | complete
  const [nodeStatuses, setNodeStatuses] = useState(() => Object.fromEntries(INITIAL_NODES.map(n => [n.id, "healthy"])));
  const [logs, setLogs] = useState([]);
  const [activePackets, setActivePackets] = useState([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stats, setStats] = useState({ detected: 0, blocked: 0, healed: 0, ttd: null, ttr: null });
  const logRef = useRef(null);
  const timersRef = useRef([]);
  const startTimeRef = useRef(null);
  const tickRef = useRef(null);

  // Scroll logs
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    clearInterval(tickRef.current);
  };

  const resetSim = useCallback(() => {
    clearTimers();
    setSimState("idle");
    setNodeStatuses(Object.fromEntries(INITIAL_NODES.map(n => [n.id, n.type === "sentinel" ? "sentinel" : "healthy"])));
    setLogs([]);
    setActivePackets([]);
    setElapsedMs(0);
    setStats({ detected: 0, blocked: 0, healed: 0, ttd: null, ttr: null });
  }, []);

  const launchAttack = useCallback(() => {
    if (!selectedAttack || simState === "running") return;
    resetSim();

    const atk = ATTACKS.find(a => a.id === selectedAttack);
    if (!atk) return;

    setSimState("running");
    startTimeRef.current = Date.now();

    // Tick counter
    tickRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);

    // Phase 1: propagate attack along path
    atk.targetPath.forEach((nodeId, i) => {
      const t = timersRef.current;
      t.push(setTimeout(() => {
        setNodeStatuses(prev => ({ ...prev, [nodeId]: i === 0 ? "attacking" : "targeted" }));
        // Animate packet
        if (i < atk.targetPath.length - 1) {
          const from = atk.targetPath[i];
          const to = atk.targetPath[i + 1];
          const pid = `${from}-${to}-${Date.now()}`;
          setActivePackets(prev => [...prev, { id: pid, from, to, color: atk.color }]);
          setTimeout(() => setActivePackets(prev => prev.filter(p => p.id !== pid)), 900);
        }
      }, i * 700));
    });

    // Log steps
    atk.steps.forEach(step => {
      timersRef.current.push(setTimeout(() => {
        setLogs(prev => [...prev, { ...step, ts: ((Date.now() - startTimeRef.current) / 1000).toFixed(1) }]);
        if (step.level === "sentinel") {
          setStats(s => ({ ...s, detected: s.detected + 1, ttd: atk.ttd }));
          // Sentinel node pulses
          setNodeStatuses(prev => ({ ...prev, siem: "sentinel" }));
        }
        if (step.level === "action") {
          setStats(s => ({ ...s, blocked: s.blocked + 1 }));
          // Start healing targeted nodes
          atk.spreadTo.forEach(nid => setNodeStatuses(prev => ({ ...prev, [nid]: "healing" })));
        }
        if (step.level === "ok") {
          setStats(s => ({ ...s, healed: s.healed + 1 }));
        }
      }, step.t));
    });

    // Final heal
    timersRef.current.push(setTimeout(() => {
      setNodeStatuses(Object.fromEntries(INITIAL_NODES.map(n => [n.id, n.type === "sentinel" ? "sentinel" : "protected"])));
      setStats(s => ({ ...s, ttr: atk.ttr }));
      setSimState("complete");
      clearInterval(tickRef.current);
    }, atk.ttr + 500));
  }, [selectedAttack, simState, resetSim]);

  // Cleanup on unmount
  useEffect(() => () => clearTimers(), []);

  // ── SVG network ──
  const getSVGPos = (node) => ({ x: node.x, y: node.y });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-500/30 rounded-full px-5 py-2 mb-4">
          <Activity className="w-4 h-4 text-violet-400" />
          <span className="text-violet-300 font-medium text-sm">Live Simulation Module</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-white via-cyan-200 to-violet-400 bg-clip-text text-transparent pb-2">
          Sentinel Ecosystem Simulator
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Launch a simulated cyber attack and watch Outpost Zero, Izulu Sentinel, and ASOSINT autonomously detect, triage, and self-heal the network in real time.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* ── Left: Attack Selection ── */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Select Attack Vector</h2>
          {ATTACKS.map(atk => (
            <button
              key={atk.id}
              onClick={() => { if (simState !== "running") { resetSim(); setSelectedAttack(atk.id); } }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedAttack === atk.id
                  ? "border-cyan-500/60 bg-cyan-950/30"
                  : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600"
              } ${simState === "running" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: atk.color }} />
                <span className="font-semibold text-white text-sm">{atk.name}</span>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                  atk.severity === "critical" ? "bg-red-950 text-red-400" : "bg-orange-950 text-orange-400"
                }`}>{atk.severity}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed pl-5">{atk.description}</p>
            </button>
          ))}

          {/* Launch / Reset buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={launchAttack}
              disabled={!selectedAttack || simState === "running"}
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold disabled:opacity-40"
            >
              <Play className="w-4 h-4 mr-1" />
              {simState === "running" ? "Running…" : "Launch Attack"}
            </Button>
            <Button
              onClick={resetSim}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: "Threats Detected", val: stats.detected, color: "text-red-400" },
              { label: "Vectors Blocked",  val: stats.blocked,  color: "text-orange-400" },
              { label: "Nodes Healed",     val: stats.healed,   color: "text-green-400" },
              { label: "Time to Detect",   val: stats.ttd ? `${(stats.ttd/1000).toFixed(1)}s` : "—", color: "text-cyan-400" },
              { label: "Time to Remediate",val: stats.ttr ? `${(stats.ttr/1000).toFixed(1)}s` : "—", color: "text-violet-400" },
              { label: "Elapsed",          val: `${(elapsedMs/1000).toFixed(1)}s`, color: "text-slate-300" },
            ].map(s => (
              <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 mt-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Node Status</h3>
            {[
              { status: "healthy",   label: "Healthy" },
              { status: "targeted",  label: "Under Attack" },
              { status: "attacking", label: "Attack Source" },
              { status: "healing",   label: "Self-Healing" },
              { status: "protected", label: "Protected" },
              { status: "sentinel",  label: "Sentinel Active" },
            ].map(l => (
              <div key={l.status} className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: nodeStatusColor(l.status) }} />
                <span className="text-xs text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Center + Right: Network viz + Logs ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Network Topology SVG */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 relative overflow-hidden" style={{ minHeight: 360 }}>
            <div className="absolute top-3 left-4 text-xs text-slate-500 font-semibold uppercase tracking-widest">Network Topology</div>
            {simState === "complete" && (
              <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-green-950/60 border border-green-500/30 rounded-full px-3 py-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 text-xs font-semibold">Threat Neutralized</span>
              </div>
            )}
            {simState === "running" && (
              <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-red-950/60 border border-red-500/30 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-red-400 text-xs font-semibold">Attack in Progress</span>
              </div>
            )}

            <svg
              viewBox="0 0 100 100"
              className="w-full"
              style={{ height: 320 }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Edges */}
              {EDGES.map(([a, b]) => {
                const na = INITIAL_NODES.find(n => n.id === a);
                const nb = INITIAL_NODES.find(n => n.id === b);
                if (!na || !nb) return null;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke="#334155" strokeWidth="0.5"
                  />
                );
              })}

              {/* Animated packets */}
              {activePackets.map(pkt => {
                const from = INITIAL_NODES.find(n => n.id === pkt.from);
                const to   = INITIAL_NODES.find(n => n.id === pkt.to);
                if (!from || !to) return null;
                return (
                  <motion.circle
                    key={pkt.id}
                    r="1.2"
                    fill={pkt.color}
                    initial={{ cx: from.x, cy: from.y, opacity: 1 }}
                    animate={{ cx: to.x, cy: to.y, opacity: 0 }}
                    transition={{ duration: 0.85, ease: "linear" }}
                  />
                );
              })}

              {/* Nodes */}
              {INITIAL_NODES.map(node => {
                const status = nodeStatuses[node.id];
                const color  = nodeStatusColor(status);
                const isActive = status === "targeted" || status === "attacking" || status === "healing";
                return (
                  <g key={node.id}>
                    {/* Glow ring */}
                    {isActive && (
                      <motion.circle
                        cx={node.x} cy={node.y} r={5}
                        fill="none" stroke={color} strokeWidth="0.8" opacity={0.4}
                        animate={{ r: [5, 7, 5], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    )}
                    {/* Node circle */}
                    <motion.circle
                      cx={node.x} cy={node.y} r={4}
                      fill="#0f172a" stroke={color} strokeWidth={status === "sentinel" ? "1.2" : "0.8"}
                      animate={status === "sentinel" ? { strokeWidth: ["1.2", "2", "1.2"] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {/* Label */}
                    <text x={node.x} y={node.y + 7} textAnchor="middle" fontSize="2.8" fill="#94a3b8">
                      {node.label}
                    </text>
                    {/* Status dot */}
                    <circle cx={node.x + 3.5} cy={node.y - 3.5} r="1.2" fill={color} />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Terminal / Log Feed */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden" style={{ minHeight: 260 }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/60">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-slate-300">Sentinel Response Log</span>
              {simState === "running" && (
                <span className="ml-auto text-xs text-cyan-400 animate-pulse">● Live</span>
              )}
            </div>
            <div
              ref={logRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5"
              style={{ maxHeight: 260 }}
            >
              {logs.length === 0 && (
                <div className="text-slate-600 italic">
                  {simState === "idle"
                    ? "Select an attack vector and click Launch Attack to begin simulation."
                    : "Initializing…"}
                </div>
              )}
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${logColor(log.level)}`}
                  >
                    <span className="text-slate-600 flex-shrink-0">[{log.ts}s]</span>
                    <span>{log.msg}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {simState === "complete" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 p-3 rounded-lg bg-green-950/40 border border-green-500/30 text-green-400"
                >
                  ✅ Simulation complete — Sentinel Ecosystem successfully contained the threat autonomously.
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Sentinel pillars callout */}
      <div className="max-w-7xl mx-auto mt-10 grid md:grid-cols-3 gap-4">
        {[
          { name: "Outpost Zero", subtitle: "Self-Healing SIEM", color: "from-cyan-500/10 to-blue-600/10", border: "border-cyan-500/20", accent: "text-cyan-400", icon: Shield, desc: "Autonomous threat triage, alert correlation, and self-healing playbook execution." },
          { name: "Izulu Sentinel", subtitle: "Physical-Digital Bridge", color: "from-violet-500/10 to-purple-600/10", border: "border-violet-500/20", accent: "text-violet-400", icon: Wifi, desc: "Fuses physical and digital signals into a unified operational threat picture." },
          { name: "ASOSINT", subtitle: "Edge OSINT Engine", color: "from-emerald-500/10 to-teal-600/10", border: "border-emerald-500/20", accent: "text-emerald-400", icon: Cpu, desc: "Adversary profiling and attack surface mapping without cloud dependency." },
        ].map(p => (
          <div key={p.name} className={`rounded-xl border ${p.border} bg-gradient-to-br ${p.color} p-5`}>
            <p.icon className={`w-5 h-5 ${p.accent} mb-2`} />
            <div className="font-bold text-white text-sm">{p.name}</div>
            <div className={`text-xs ${p.accent} mb-2`}>{p.subtitle}</div>
            <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}