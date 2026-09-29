import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, BookOpen, Mic, Users, Shield, BarChart2, Mail,
  FileText, Target, AlertTriangle, Loader2, ChevronRight, Newspaper,
  Wrench, Globe, Brain, Clipboard, Search, ShieldAlert, CalendarDays,
  MessageSquare, Zap, TrendingUp, Star, Share2, RefreshCw, CheckCircle2, ExternalLink,
  DollarSign, Award, UserCog, ArrowLeft, KanbanSquare
} from "lucide-react";
import SocialAnalytics from "@/components/dashboard/SocialAnalytics";
import BlogPerformanceChart from "@/components/dashboard/BlogPerformanceChart";
import RecentCommits from "@/components/dashboard/RecentCommits";
import CourseManager from "@/components/admin/CourseManager";
import GrantManager from "@/components/admin/GrantManager";
import UserManager from "@/components/admin/UserManager";
import LeadKanban from "@/components/admin/LeadKanban";
import LeadAnalyticsDashboard from "@/components/admin/LeadAnalyticsDashboard";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { playSlash } from "@/lib/ninjaSounds";

const tools = [
  {
    group: "Content",
    color: "from-cyan-600 to-blue-600",
    border: "border-cyan-500/30",
    icon: BookOpen,
    items: [
      { label: "Blog Manager", sub: "Write & publish articles", path: "BlogAdmin", icon: BookOpen },
      { label: "Bulletin Curator", sub: "AI cyber bulletins", path: "CyberBulletins", icon: Newspaper },
      { label: "Cyber Newsletter Writer", sub: "AI newsletter content", path: "CyberNewsletterWriter", icon: Mail },
      { label: "Newsletter Draft Editor", sub: "Draft & compose newsletters", path: "NewsletterDraftEditor", icon: Mail },
      { label: "Newsletter Subscribers", sub: "Manage subscriber list", path: "SubscriberManager", icon: Users },
      { label: "Social Media Manager", sub: "Schedule & post content", path: "SocialMediaManager", icon: Globe },
    ],
  },
  {
    group: "Events & Engagement",
    color: "from-violet-600 to-purple-600",
    border: "border-violet-500/30",
    icon: CalendarDays,
    items: [
      { label: "Webinars", sub: "Manage webinar sessions", path: "Webinars", icon: Mic },
      { label: "Workshop Booking", sub: "Schedule & manage workshops", path: "WorkshopBooking", icon: CalendarDays },
      { label: "Executive Briefings", sub: "Manage briefing sessions", path: "ExecutiveBriefings", icon: MessageSquare },
      { label: "Referral Program", sub: "Track referrals & rewards", path: "ReferralProgram", icon: Star },
    ],
  },
  {
    group: "Leads & CRM",
    color: "from-emerald-600 to-green-600",
    border: "border-emerald-500/30",
    icon: Target,
    items: [
      { label: "Lead Dashboard", sub: "View & manage leads", path: "LeadDashboard", icon: Target },
      { label: "Lead Intelligence", sub: "AI scoring & insights", path: "LeadIntelligence", icon: Brain },
      { label: "Lead Reports", sub: "Automated lead reports", path: "LeadReports", icon: TrendingUp },
      { label: "Follow-Up Manager", sub: "Email follow-up sequences", path: "FollowUpManager", icon: Mail },
      { label: "CRM Integration", sub: "HubSpot / Salesforce sync", path: "CRMIntegration", icon: Zap },
      { label: "Support Inquiries", sub: "AI-categorized support tickets", path: "SupportInquiries", icon: MessageSquare },
    ],
  },
  {
    group: "Security & Intelligence",
    color: "from-red-600 to-orange-600",
    border: "border-red-500/30",
    icon: Shield,
    items: [
      { label: "Security Monitor", sub: "Vulnerability scanning", path: "SecurityMonitor", icon: Shield },
      { label: "Security Violations", sub: "Threat & violation logs", path: "SecurityViolationsDashboard", icon: ShieldAlert },
      { label: "Threat Intelligence", sub: "Real-time threat feeds", path: "ThreatIntelligenceDashboard", icon: AlertTriangle },
      { label: "Security Assessment", sub: "Client assessment tool", path: "SecurityAssessment", icon: Clipboard },
    ],
  },
  {
    group: "Analytics & SEO",
    color: "from-yellow-600 to-amber-600",
    border: "border-yellow-500/30",
    icon: BarChart2,
    items: [
      { label: "Analytics Dashboard", sub: "Traffic & conversion data", path: "AnalyticsDashboard", icon: BarChart2 },
      { label: "SEO Dashboard", sub: "Search optimization tools", path: "SEODashboard", icon: Search },
      { label: "Opportunity Dashboard", sub: "Market & contract leads", path: "OpportunityDashboard", icon: TrendingUp },
      { label: "Strategic Planner", sub: "AI-powered planning", path: "StrategicPlanner", icon: Brain },
    ],
  },
  {
    group: "Tools & Config",
    color: "from-slate-500 to-slate-600",
    border: "border-slate-500/30",
    icon: Wrench,
    items: [
      { label: "Case Study Manager", sub: "Vuln findings & risk reduction", path: "CaseStudyAdmin", icon: Shield },
      { label: "Capability Matrix", sub: "Service capability overview", path: "CapabilityMatrix", icon: FileText },
      { label: "Sitemap", sub: "XML sitemap manager", path: "Sitemap", icon: Globe },
      { label: "Testimonial Admin", sub: "Manage testimonials", path: "TestimonialAdmin", icon: Star },
    ],
  },
];

const PRICING_SYNC_KEY = "eds_pricing_last_synced";
const LAST_CODE_UPDATE = "2026-05-18T00:00:00.000Z";

const managementTabs = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "leads", label: "Lead Pipeline", icon: KanbanSquare },
  { key: "analytics", label: "Lead Analytics", icon: BarChart2 },
  { key: "courses", label: "Courses & Pricing", icon: DollarSign },
  { key: "grants", label: "Funding Feeds", icon: Award },
  { key: "users", label: "User Management", icon: UserCog },
];

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminAccess();
  const [stats, setStats] = useState({ posts: 0, leads: 0, subscribers: 0, webinars: 0 });
  const [pricingSyncedAt, setPricingSyncedAt] = useState(() => localStorage.getItem(PRICING_SYNC_KEY) || LAST_CODE_UPDATE);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const init = async () => {
      if (!isAdmin) return;
      try {
        const [allPosts, allLeads, allSubs, allWebinars] = await Promise.all([
          base44.entities.BlogPost.list("-created_date", 500).catch(() => []),
          base44.entities.Lead.list("-created_date", 500).catch(() => []),
          base44.entities.Subscriber.list("-created_date", 500).catch(() => []),
          base44.entities.Webinar.list("-created_date", 500).catch(() => []),
        ]);
        setStats({ posts: allPosts.length, leads: allLeads.length, subscribers: allSubs.length, webinars: allWebinars.length });
      } catch {}
    };
    init();
  }, [isAdmin]);

  const handleTabChange = (key) => {
    playSlash();
    setActiveTab(key);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-white">
      <div className="text-center p-10 bg-slate-900 rounded-xl border border-red-500/30 max-w-sm">
        <AlertTriangle className="w-14 h-14 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6">Dojo authorization required to view this page.</p>
        <Link to={createPageUrl("AccessDenied")} className="text-cyan-400 hover:text-cyan-300 text-sm">Go to Access Denied page →</Link>
      </div>
    </div>
  );

  const statCards = [
    { label: "Blog Articles", value: stats.posts, icon: BookOpen, color: "text-cyan-400" },
    { label: "Total Leads", value: stats.leads, icon: Target, color: "text-emerald-400" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, color: "text-violet-400" },
    { label: "Webinars", value: stats.webinars, icon: Mic, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400 text-sm">Emerging Defense Solutions — Command Center</p>
              </div>
            </div>
            <Link to={createPageUrl("MemberPortal")} onClick={() => { playSlash(); window.scrollTo(0, 0); }} className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Member Portal
            </Link>
          </div>
        </motion.div>

        {/* Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-1 mb-8 bg-slate-900/60 border border-slate-700/50 rounded-xl p-1.5 overflow-x-auto"
        >
          {managementTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "leads" && <LeadKanban />}
            {activeTab === "analytics" && <LeadAnalyticsDashboard />}
            {activeTab === "courses" && <CourseManager />}
            {activeTab === "grants" && <GrantManager />}
            {activeTab === "users" && <UserManager />}
            {activeTab === "overview" && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {statCards.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
                        <Icon className={`w-8 h-8 flex-shrink-0 ${s.color}`} />
                        <div>
                          <div className="text-2xl font-bold text-white">{s.value}</div>
                          <div className="text-xs text-slate-400">{s.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* EDS Pricing Sync Status */}
                <div className="mb-6 flex items-center justify-between gap-4 px-5 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-white text-sm font-medium">EDS Defense Course Pricing</span>
                      <span className="text-slate-400 text-xs ml-2">
                        Last synced: <span className="text-slate-300">{new Date(pricingSyncedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href="https://defense.eds-360.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                      Check site <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => {
                        const now = new Date().toISOString();
                        localStorage.setItem(PRICING_SYNC_KEY, now);
                        setPricingSyncedAt(now);
                      }}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-lg transition-all"
                    >
                      <RefreshCw className="w-3 h-3" /> Mark as synced
                    </button>
                  </div>
                </div>

                {/* Quick Action: New Blog Post */}
                <div className="mb-10 p-6 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <BookOpen className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                    <div>
                      <h2 className="text-lg font-bold text-white">Write a New Blog Article</h2>
                      <p className="text-slate-400 text-sm">Publish insights, research, and thought leadership content.</p>
                    </div>
                  </div>
                  <Link to={createPageUrl("BlogAdmin")} className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
                    <BookOpen className="w-4 h-4" /> Open Blog Manager <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Social Analytics */}
                <div className="mb-10 bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6">
                  <SocialAnalytics />
                </div>

                {/* Blog Performance Chart */}
                <div className="mb-10 bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6">
                  <BlogPerformanceChart />
                </div>

                {/* Recent GitHub Commits */}
                <div className="mb-10">
                  <RecentCommits />
                </div>

                {/* Tool Groups */}
                <div className="space-y-10">
                  {tools.map((group, gi) => {
                    const GroupIcon = group.icon;
                    return (
                      <div key={group.group}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center`}>
                            <GroupIcon className="w-4 h-4 text-white" />
                          </div>
                          <h2 className="text-lg font-semibold text-white">{group.group}</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {group.items.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <Link
                                key={item.path}
                                to={createPageUrl(item.path)}
                                onClick={() => playSlash()}
                                className={`group flex items-center gap-4 bg-slate-900/60 border ${group.border} hover:bg-slate-800/60 rounded-xl p-4 transition-all duration-200 hover:shadow-lg`}
                              >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity`}>
                                  <ItemIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white font-semibold text-sm group-hover:text-cyan-300 transition-colors">{item.label}</div>
                                  <div className="text-slate-500 text-xs truncate">{item.sub}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}