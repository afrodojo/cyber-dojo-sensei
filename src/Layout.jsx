import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShieldCheck, Mail, Menu, X, Home, FileText, Info, Briefcase, BarChart2, BookOpen, Phone, Users, Handshake, Mic, UserCheck, Settings, Search, ChevronDown, Shield, BookMarked, Wrench, Award, Microscope } from "lucide-react";
import NewsletterSignup from "./components/newsletter/NewsletterSignup";
import NewsletterSection from "./components/newsletter/NewsletterSection";
import { trackPageView } from "./components/analytics/tracker";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ensureMasterAdmin } from "@/functions/ensureMasterAdmin";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingProvider } from "./components/onboarding/OnboardingContext";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import StealthModeToggle from "./components/StealthModeToggle";
import PageTransition from "./components/PageTransition";
import { initNinjaSounds, playSlash, playShurikenHit, playBladeClash } from "@/lib/ninjaSounds";
import { trackEvent } from "@/lib/stealthAnalytics";
import PortfolioDataModal from "./components/portfolio/PortfolioDataModal";
import ShurikenIcon from "./components/icons/ShurikenIcon";
import CyberDojoLogo from "./components/portfolio/CyberDojoLogo";
import SectorToggle from "./components/SectorToggle";
import { useSector } from "@/hooks/useSector.jsx";
import { PHD_SENSEI_URL, ROUTES } from "@/lib/routes";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showPortfolioData, setShowPortfolioData] = useState(false);
  const dropdownRef = useRef(null);
  const { sector, setSector } = useSector();
  const location = useLocation();
  const navTo = (path) => path.startsWith('/') ? path : createPageUrl(path);
  const isActive = (path) => location.pathname === navTo(path);

  useEffect(() => {
    // --- SECURITY HEADERS ---
    const addSecurityHeaders = () => {
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!cspMeta) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self';";
        document.head.appendChild(meta);
      }

      const noSniffMeta = document.querySelector('meta[http-equiv="X-UA-Compatible"]');
      if (!noSniffMeta) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-UA-Compatible';
        meta.content = 'IE=edge';
        document.head.appendChild(meta);
      }

      const refMeta = document.querySelector('meta[name="referrer"]');
      if (!refMeta) {
        const meta = document.createElement('meta');
        meta.name = 'referrer';
        meta.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(meta);
      }
    };
    
    addSecurityHeaders();
    // --- PWA SETUP ---
    // Remove previous attempts if they exist
    const oldManifest = document.getElementById('pwa-manifest');
    if (oldManifest) oldManifest.remove();

    // 1. Create and inject the Web App Manifest
    const manifestElement = document.createElement('link');
    manifestElement.id = 'pwa-manifest';
    manifestElement.rel = 'manifest';
    
    const manifestContent = {
      short_name: "Asaad Morman",
      name: "Asaad Morman - Cybersecurity Portfolio",
      icons: [
        {
          src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/33423797c_icon-192.png",
          type: "image/png",
          sizes: "192x192"
        },
        {
          src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b758253a6_icon-512.png",
          type: "image/png",
          sizes: "512x512"
        }
      ],
      start_url: "/",
      display: "standalone",
      theme_color: "#0f172a",
      background_color: "#0f172a"
    };

    const manifestString = JSON.stringify(manifestContent);
    const manifestBlob = new Blob([manifestString], { type: 'application/json' });
    manifestElement.href = URL.createObjectURL(manifestBlob);
    
    document.head.appendChild(manifestElement);

    // 2. Register the Service Worker
    if ('serviceWorker' in navigator) {
      const swCode = `
        const CACHE_NAME = 'cyber-dojo-pwa-cache-v2';
        const urlsToCache = ['/', '/index.html'];
        self.addEventListener('install', event => {
          event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
        });
        self.addEventListener('fetch', event => {
          event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
        });
        self.addEventListener('activate', event => {
          const cacheWhitelist = [CACHE_NAME];
          event.waitUntil(
            caches.keys().then(cacheNames => Promise.all(
              cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) === -1) return caches.delete(cacheName);
              })
            ))
          );
        });
      `;
      const swBlob = new Blob([swCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(swBlob);
      
      navigator.serviceWorker.register(swUrl)
        .then(registration => console.log('PWA ServiceWorker registration successful with scope: ', registration.scope))
        .catch(err => console.log('PWA ServiceWorker registration failed: ', err));
    }

    // --- Track page view ---
    trackPageView(currentPageName);

    // --- Check Admin Role (only if authenticated) ---
    const checkAdminStatus = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) {
          setIsAdmin(false);
          setIsAuthed(false);
          return;
        }
        
        const user = await base44.auth.me();
        setIsAuthed(true);
        setIsAdmin(user?.role === 'admin');

        // Master admin override: ensure master accounts always have admin access
        try {
          const result = await ensureMasterAdmin({});
          if (result.data?.master_admin) {
            setIsAdmin(true);
          }
        } catch {}
      } catch (error) {
        setIsAdmin(false);
        setIsAuthed(false);
      }
    };
    checkAdminStatus();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // --- Ninja Sound Effects (respects member portal audio toggle) ---
    initNinjaSounds();
    const handleSlashClick = (e) => {
      const audioEnabled = localStorage.getItem("ninja_audio_enabled") !== "false";
      if (!audioEnabled) return;
      const target = e.target.closest("a, button");
      if (!target) return;
      if (target.closest("header, nav") || target.getAttribute("data-ninja-sfx") === "slash") {
        playSlash();
      }
    };
    const handleShurikenSubmit = () => {
      const audioEnabled = localStorage.getItem("ninja_audio_enabled") !== "false";
      if (!audioEnabled) return;
      playShurikenHit();
    };
    document.addEventListener("click", handleSlashClick);
    document.addEventListener("submit", handleShurikenSubmit);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleSlashClick);
      document.removeEventListener("submit", handleShurikenSubmit);
    };
  }, []);

  // Auto-detect sector from pillar landing pages (only when no sector is actively selected)
  useEffect(() => {
    if (sector) return;
    const pillarPathToSector = {
      [ROUTES.BUSINESS]: "business",
      [ROUTES.CAREER]: "career",
      [ROUTES.INSTITUTIONS]: "education",
      [ROUTES.RESEARCH]: "education",
      [ROUTES.KNOWLEDGE]: "general",
    };
    const detected = pillarPathToSector[location.pathname];
    if (detected) {
      setSector(detected);
    }
  }, [location.pathname, sector, setSector]);

  // Flat list used only in footer
  const navItems = [
    { name: "Home", path: "Portfolio" },
    { name: "Business Solutions", path: ROUTES.BUSINESS },
    { name: "Career Accelerator", path: ROUTES.CAREER },
    { name: "Institutional Partnerships", path: ROUTES.INSTITUTIONS },
    { name: "Knowledge Hub", path: ROUTES.KNOWLEDGE },
    { name: "Research & Doctoral Studies", path: ROUTES.RESEARCH },
    { name: "About", path: "About" },
    { name: "Services", path: "Services" },
    { name: "Blog", path: "Blog" },
    { name: "Bulletins", path: "CyberBulletins" },
    { name: "Books", path: "Publications" },
    { name: "Webinars", path: "Webinars" },
    { name: "Partners", path: "Partners" },
    { name: "Security Assessment", path: "SecurityAssessment" },
    { name: "Executive Briefings", path: "ExecutiveBriefings" },
    { name: "Referral Program", path: "ReferralProgram" },
    { name: "Contact", path: "Contact" },
    { name: "Terms", path: "TermsOfUse" },
    { name: "Privacy", path: "PrivacyPolicy" },
    { name: "Sentinel Simulator", path: "SentinelSimulator" },
    { name: "Workshops", path: "WorkshopBooking" },
    { name: "Capability Matrix", path: "CapabilityMatrix" }
  ];

  // Grouped nav for desktop dropdown menus
  const navGroups = [
    { label: "Business Solutions", path: ROUTES.BUSINESS },
    { label: "Career Accelerator", path: ROUTES.CAREER },
    { label: "Institutional Partnerships", path: ROUTES.INSTITUTIONS },
    { label: "Research & Doctoral Studies", path: ROUTES.RESEARCH },
    { label: "Knowledge Hub", path: ROUTES.KNOWLEDGE },
    {
      label: "More",
      icon: BookMarked,
      items: [
        { name: "Home", path: "Portfolio" },
        { name: "About Me", path: "About" },
        { name: "Services", path: "Services", hideIn: ["career"] },
        { name: "Security Assessment", path: "SecurityAssessment", hideIn: ["career"] },
        { name: "Executive Briefings", path: "ExecutiveBriefings", hideIn: ["career"] },
        { name: "Workshops", path: "WorkshopBooking", hideIn: ["business"] },
        { name: "Capability Matrix", path: "CapabilityMatrix" },
        { name: "Sentinel Simulator", path: "SentinelSimulator", hideIn: ["business"] },
        { name: "Blog", path: "Blog", hideIn: ["business"] },
        { name: "Cyber Bulletins", path: "CyberBulletins", hideIn: ["business"] },
        { name: "Books", path: "Publications", hideIn: ["business"] },
        { name: "Webinars", path: "Webinars", hideIn: ["business"] },
        { name: "Training Catalog", path: "TrainingCatalog", hideIn: ["business"] },
        { name: "Industry Feed", path: "IndustryFeed", hideIn: ["business"] },
        { name: "Doctoral Grants", path: "PhDGrantsHub", hideIn: ["business"] },
        { name: "Partners", path: "Partners", hideIn: ["career"] },
        { name: "Referral Program", path: "ReferralProgram", hideIn: ["career"] },
        { name: "Contact", path: "Contact" },
      ]
    },
  ];

  // Sector-specific nav groups — shown when a sector is active (audience isolation)
  const sectorNavs = {
    business: [
      { label: "Business Solutions", path: ROUTES.BUSINESS },
      { label: "Services", path: "Services" },
      { label: "Security Assessment", path: "SecurityAssessment" },
      { label: "Executive Briefings", path: "ExecutiveBriefings" },
      { label: "Partners", path: "Partners" },
      { label: "Contact", path: "Contact" },
    ],
    career: [
      { label: "Career Accelerator", path: ROUTES.CAREER },
      { label: "Training Catalog", path: "TrainingCatalog" },
      { label: "Doctoral Grants", path: "PhDGrantsHub" },
      { label: "Workshops", path: "WorkshopBooking" },
      { label: "Webinars", path: "Webinars" },
      { label: "Blog", path: "Blog" },
      { label: "Contact", path: "Contact" },
    ],
    education: [
      { label: "Institutional Partnerships", path: ROUTES.INSTITUTIONS },
      { label: "Capability Matrix", path: "CapabilityMatrix" },
      { label: "Training Catalog", path: "TrainingCatalog" },
      { label: "Workshops", path: "WorkshopBooking" },
      { label: "Research & Doctoral Studies", path: ROUTES.RESEARCH },
      { label: "Contact", path: "Contact" },
    ],
    general: [
      { label: "Knowledge Hub", path: ROUTES.KNOWLEDGE },
      { label: "Blog", path: "Blog" },
      { label: "Cyber Bulletins", path: "CyberBulletins" },
      { label: "Books", path: "Publications" },
      { label: "Webinars", path: "Webinars" },
      { label: "Industry Feed", path: "IndustryFeed" },
      { label: "Contact", path: "Contact" },
    ],
  };

  const activeNavGroups = sector ? (sectorNavs[sector] || navGroups) : navGroups;

  const adminNavItems = [
    { name: "Admin Dashboard", path: "AdminDashboard" },
    { name: "Social Media Manager", path: "SocialMediaManager" },
    { name: "Blog Manager", path: "BlogAdmin" },
    { name: "Newsletter", path: "SubscriberManager" },
    { name: "SEO Dashboard", path: "SEODashboard" },
    { name: "Opportunities", path: "OpportunityDashboard" },
    { name: "Strategic Planner", path: "StrategicPlanner" },
    { name: "Security Monitor", path: "SecurityMonitor" },
    { name: "Newsletter Draft Editor", path: "NewsletterDraftEditor" },
    { name: "Cyber Newsletter Writer", path: "CyberNewsletterWriter" },
    { name: "Threat Intelligence", path: "ThreatIntelligenceDashboard" },
    { name: "Lead Reports", path: "LeadReports" },
    { name: "Bulletin Curator", path: "AgentChatPage?agent=bulletin_curator" },
    { name: "Security Violations", path: "SecurityViolationsDashboard" },
    { name: "Compliance Monitor", path: "AgentChatPage?agent=security_compliance_monitor" },
    { name: "Article & Content Hub", path: "ArticleHub" },
  ];

  const getPageTitle = () => {
    const item = navItems.find(item => item.path === currentPageName);
    return item ? item.name : currentPageName;
  };

  const mobileNavItems = [
    { name: "Home", path: "Portfolio", icon: Home },
    { name: "Business Solutions", path: ROUTES.BUSINESS, icon: Briefcase },
    { name: "Career Accelerator", path: ROUTES.CAREER, icon: Wrench },
    { name: "Institutional Partnerships", path: ROUTES.INSTITUTIONS, icon: Award },
    { name: "Knowledge Hub", path: ROUTES.KNOWLEDGE, icon: BookOpen },
    { name: "Research & Doctoral Studies", path: ROUTES.RESEARCH, icon: Microscope },
    { name: "About", path: "About", icon: Info },
    { name: "Services", path: "Services", icon: Briefcase },
    { name: "Blog", path: "Blog", icon: BarChart2 },
    { name: "Bulletins", path: "CyberBulletins", icon: ShieldCheck },
    { name: "Books", path: "Publications", icon: BookOpen },
    { name: "Webinars", path: "Webinars", icon: Mic },
    { name: "Doctoral Grants", path: "PhDGrantsHub", icon: Award },
    { name: "Training Catalog", path: "TrainingCatalog", icon: BookOpen },
    { name: "Partners", path: "Partners", icon: Handshake },
    { name: "Security Assessment", path: "SecurityAssessment", icon: ShieldCheck }, 
    { name: "Executive Briefings", path: "ExecutiveBriefings", icon: UserCheck },
    { name: "Referral Program", path: "ReferralProgram", icon: Users },
    { name: "Contact", path: "Contact", icon: Phone }
  ];

  // Sector-specific mobile nav items
  const sectorMobileNavs = {
    business: [
      { name: "Business Solutions", path: ROUTES.BUSINESS, icon: Briefcase },
      { name: "Services", path: "Services", icon: Briefcase },
      { name: "Security Assessment", path: "SecurityAssessment", icon: ShieldCheck },
      { name: "Executive Briefings", path: "ExecutiveBriefings", icon: UserCheck },
      { name: "Partners", path: "Partners", icon: Handshake },
    ],
    career: [
      { name: "Career Accelerator", path: ROUTES.CAREER, icon: Wrench },
      { name: "Training Catalog", path: "TrainingCatalog", icon: BookOpen },
      { name: "Doctoral Grants", path: "PhDGrantsHub", icon: Award },
      { name: "Workshops", path: "WorkshopBooking", icon: Briefcase },
      { name: "Webinars", path: "Webinars", icon: Mic },
      { name: "Blog", path: "Blog", icon: BarChart2 },
    ],
    education: [
      { name: "Institutional Partnerships", path: ROUTES.INSTITUTIONS, icon: Award },
      { name: "Capability Matrix", path: "CapabilityMatrix", icon: Settings },
      { name: "Training Catalog", path: "TrainingCatalog", icon: BookOpen },
      { name: "Workshops", path: "WorkshopBooking", icon: Briefcase },
      { name: "Research & Doctoral Studies", path: ROUTES.RESEARCH, icon: Microscope },
    ],
    general: [
      { name: "Knowledge Hub", path: ROUTES.KNOWLEDGE, icon: BookOpen },
      { name: "Blog", path: "Blog", icon: BarChart2 },
      { name: "Cyber Bulletins", path: "CyberBulletins", icon: ShieldCheck },
      { name: "Books", path: "Publications", icon: BookOpen },
      { name: "Webinars", path: "Webinars", icon: Mic },
      { name: "Industry Feed", path: "IndustryFeed", icon: BarChart2 },
    ],
  };

  const activeMobileNavItems = sector
    ? [
        { name: "Home", path: "Portfolio", icon: Home },
        ...(sectorMobileNavs[sector] || []),
        { name: "Contact", path: "Contact", icon: Phone },
      ]
    : mobileNavItems;

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-ninja-void ninja-grid text-white font-sans">
      <OnboardingFlow />
      {/* Header */}
      <header className="fixed top-0 w-full bg-ninja-void/80 backdrop-blur-md border-b border-slate-800/50 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <CyberDojoLogo />

            {/* Desktop Navigation */}
            <nav ref={dropdownRef} className="hidden lg:flex lg:items-center lg:gap-1">
              {activeNavGroups.map((group) => {
                // Direct link (no dropdown)
                if (group.path) {
                  return (
                    <Link
                      key={group.label}
                      to={navTo(group.path)}
                      onClick={() => { setOpenDropdown(null); window.scrollTo(0, 0); }}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive(group.path) ? 'text-ninja-green nav-active' : 'text-foreground/70 hover:text-primary'
                      }`}
                    >
                      {group.label}
                    </Link>
                  );
                }
                // Dropdown group
                const isOpen = openDropdown === group.label;
                const isGroupActive = group.items?.some(i => isActive(i.path));
                return (
                  <div key={group.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : group.label)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isGroupActive ? 'text-ninja-green' : 'text-foreground/70 hover:text-primary'
                      }`}
                    >
                      {group.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-52 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          {group.items.filter(item => !item.hideIn?.includes(sector)).map((item) => (
                            <Link
                              key={item.path}
                              to={navTo(item.path)}
                              onClick={() => { setOpenDropdown(null); window.scrollTo(0, 0); }}
                              className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                                isActive(item.path)
                                  ? 'bg-ninja-green/10 text-ninja-green font-medium'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Desktop CTA, Search & Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <SectorToggle />
              <StealthModeToggle />
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="p-2 rounded-md text-slate-400 hover:text-ninja-green hover:bg-slate-800 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <a
                href={PHD_SENSEI_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { playBladeClash(); trackEvent("research_lab_click"); }}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-ninja-void border-2 border-ninja-green text-ninja-green hover:bg-ninja-green/10 font-semibold rounded-md ninja-pulse-glow transition-all duration-300 text-sm"
              >
                <ShurikenIcon className="w-4 h-4" />
                Research Lab
              </a>
              <div className="hidden lg:flex items-center gap-2">
                {isAuthed ? (
                  <Button asChild variant="outline" className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                    <Link to={createPageUrl('MemberPortal')} onClick={() => window.scrollTo(0, 0)}>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Member Portal
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                    <Link to={createPageUrl('SignIn')} onClick={() => window.scrollTo(0, 0)}>
                      Sign In
                    </Link>
                  </Button>
                )}
                <Button asChild className="bg-gradient-to-r from-ninja-green to-ninja-green hover:from-ninja-green hover:to-ninja-green text-white font-semibold">
                  <Link to={createPageUrl('Contact')} onClick={() => window.scrollTo(0, 0)}>
                    <Mail className="w-4 h-4 mr-2" />
                    Get In Touch
                  </Link>
                </Button>
              </div>
              <div className="lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ninja-green"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Search Bar Dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 w-full z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-4"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setSearchOpen(false);
                  window.location.href = createPageUrl(`SearchResults?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery("");
                }
              }}
              className="max-w-2xl mx-auto flex gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search case studies, blog posts, pages..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-ninja-green text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-ninja-green to-ninja-green hover:from-ninja-green hover:to-ninja-green text-white font-semibold rounded-lg text-sm transition-all"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50"
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-slate-900 border-l border-slate-800 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-white">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {/* Mobile Sector Switcher */}
              <div className="mb-6 pb-6 border-b border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Switch Sector</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: null, label: "All" },
                    { value: "business", label: "Business" },
                    { value: "career", label: "Career" },
                    { value: "education", label: "Education" },
                    { value: "general", label: "Knowledge" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSector(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        sector === opt.value
                          ? "bg-ninja-green/10 text-ninja-green border border-ninja-green/40"
                          : "text-slate-300 bg-slate-800/50 border border-transparent hover:bg-slate-800"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <nav className="flex-grow overflow-y-auto">
                <ul className="space-y-4">
                  {activeMobileNavItems.map((item) => (
                    <li key={item.name}>
                      {item.isExternal ? (
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 rounded-lg text-lg font-medium text-slate-200 hover:bg-slate-800 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5 mr-4" />
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          to={navTo(item.path)}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            window.scrollTo(0, 0);
                          }}
                          className={`flex items-center p-3 rounded-lg text-lg font-medium transition-colors ${
                            isActive(item.path)
                              ? 'bg-ninja-green/10 text-ninja-green'
                              : 'text-slate-200 hover:bg-slate-800'
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-4" />
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                  {isAdmin && (
                    <>
                      <li>
                        <Link
                          to={createPageUrl('SocialMediaManager')}
                          onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                          className={`flex items-center p-3 rounded-lg text-lg font-medium transition-colors ${currentPageName === 'SocialMediaManager' ? 'bg-ninja-green/10 text-ninja-green' : 'text-slate-200 hover:bg-slate-800'}`}
                        >
                          <Settings className="w-5 h-5 mr-4" />
                          Social Media Manager
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={createPageUrl('BlogAdmin')}
                          onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                          className={`flex items-center p-3 rounded-lg text-lg font-medium transition-colors ${currentPageName === 'BlogAdmin' ? 'bg-ninja-green/10 text-ninja-green' : 'text-slate-200 hover:bg-slate-800'}`}
                        >
                          <Settings className="w-5 h-5 mr-4" />
                          Blog Manager
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
              <div className="mt-8 flex flex-col gap-3">
                {sector === 'education' && (
                  <a
                    href="https://phdsensei.eda-360.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-ninja-void border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 font-semibold rounded-lg transition-all duration-300"
                  >
                    <Microscope className="w-5 h-5" />
                    Doctoral Sensei Platform
                  </a>
                )}
                {isAuthed ? (
                  <Button asChild size="lg" variant="outline" className="w-full border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10">
                    <Link to={createPageUrl('MemberPortal')} onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }}>
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Member Portal
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Link to={createPageUrl('SignIn')} onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }}>
                      Sign In
                    </Link>
                  </Button>
                )}
                <a
                  href={PHD_SENSEI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { playBladeClash(); trackEvent("research_lab_click"); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-3 bg-ninja-void border-2 border-ninja-green text-ninja-green font-semibold rounded-lg ninja-pulse-glow transition-all duration-300"
                >
                  <ShurikenIcon className="w-5 h-5" />
                  Enter the Research Lab
                </a>
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-ninja-green to-ninja-green text-white font-semibold">
                  <Link to={createPageUrl('Contact')} onClick={() => {
                      setMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}>
                    <Mail className="w-5 h-5 mr-2" />
                    Get In Touch
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20">
        <PageTransition pageKey={currentPageName}>
          {children}
        </PageTransition>
      </main>

      {/* Newsletter Banner — hidden for business sector (strict sub-routing isolation) */}
      {sector !== 'business' && (
        <section className="bg-ninja-void border-t border-slate-800/50 py-16 px-4">
          <div className="max-w-screen-2xl mx-auto">
            <NewsletterSection variant="full" source="footer-banner" />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-ninja-void border-t border-slate-800 py-12">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-ninja-green to-ninja-green rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">Asaad Morman</span>
              </div>
              <p className="text-slate-400 text-sm">
                Elite Cybersecurity Professional & Entrepreneur
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm text-slate-400">
                {sector === 'education' && (
                  <a
                    href="https://phdsensei.eda-360.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-ninja-green font-medium hover:text-ninja-green/80 transition-colors"
                  >
                    <Microscope className="w-3.5 h-3.5" />
                    Doctoral Sensei Platform
                  </a>
                )}
                {navItems.map(item => (
                  <div key={item.name}>
                    {item.isExternal ? (
                       <a href={item.path} target="_blank" rel="noopener noreferrer" className="hover:text-ninja-green transition-colors">{item.name}</a>
                    ) : (
                       <Link to={navTo(item.path)} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">{item.name}</Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2 justify-center md:justify-start">
                  <Settings className="w-4 h-4 text-ninja-green"/>
                  Admin Tools
                </h4>
                <div className="space-y-2 text-sm text-slate-400">
                    <div>
                       <Link to={createPageUrl('AdminDashboard')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green font-semibold text-ninja-green transition-colors">⚙ Admin Dashboard</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('SocialMediaManager')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Social Media Manager</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('BlogAdmin')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Blog Manager</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('SubscriberManager')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Newsletter</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('SEODashboard')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">SEO Dashboard</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('OpportunityDashboard')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Opportunities</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('StrategicPlanner')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Strategic Planner</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('AnalyticsDashboard')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Analytics</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('SecurityMonitor')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Security Monitor</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('NewsletterDraftEditor')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Newsletter Draft Editor</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('CyberNewsletterWriter')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Cyber Newsletter Writer</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('ThreatIntelligenceDashboard')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Threat Intelligence</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('LeadReports')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Lead Reports</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('CyberBulletins')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Bulletins</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('Sitemap')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Sitemap</Link>
                    </div>
                    <div>
                       <Link to={createPageUrl('ArticleHub')} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Article &amp; Content Hub</Link>
                    </div>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>
                  <Link to={createPageUrl("TermsOfUse")} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Terms of Use</Link>
                </div>
                <div>
                  <Link to={createPageUrl("PrivacyPolicy")} onClick={() => window.scrollTo(0, 0)} className="hover:text-ninja-green transition-colors">Privacy Policy</Link>
                </div>
                <div>
                  <button onClick={() => setShowPortfolioData(true)} className="text-slate-500 hover:text-ninja-green transition-colors text-xs">Portfolio Data</button>
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-3 mt-6">Contact</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>cyberdojosensei@gmail.com</div>
                <div>657-658-5859</div>
                <div>Fredericksburg, VA</div>
              </div>
              <div className="mt-6">
                <NewsletterSection variant="sidebar" source="footer" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 Asaad Morman — Doctoral Candidate in Computer Science (D.A.S.), Bowie State University. Cybersecurity Professional with TS/SCI Clearance.
              <span className="text-green-400 font-medium"> Co-Founder & CEO of Emerging Defense Solutions</span>
            </p>
          </div>
        </div>
      </footer>
      <PortfolioDataModal open={showPortfolioData} onClose={() => setShowPortfolioData(false)} />
      </div>
    </OnboardingProvider>
  );
}