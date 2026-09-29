import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import {
  ShieldCheck, BookOpen, PlayCircle, Library, FileText, Mic, Award,
  Settings, LogOut, ArrowRight, Lock, Zap, TrendingUp, Users, Phone,
  Volume2, VolumeX, User, Clock, Download, Mail, CalendarClock, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { playSlash } from "@/lib/ninjaSounds";

export default function MemberPortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(() => localStorage.getItem("ninja_audio_enabled") !== "false");
  const [courses, setCourses] = useState([]);
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) {
          base44.auth.redirectToLogin(createPageUrl("MemberPortal"));
          return;
        }
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch {
        base44.auth.redirectToLogin(createPageUrl("MemberPortal"));
      } finally {
        setLoading(false);
      }
    };
    const loadCourses = async () => {
      try {
        const data = await base44.entities.Course.filter({ is_active: true }, "display_order", 20);
        setCourses(data);
      } catch {}
    };
    const loadGrants = async () => {
      try {
        const data = await base44.entities.PhDGrant.filter({ is_active: true }, "deadline", 20);
        // Only show upcoming deadlines (today or later)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = data.filter(g => g.deadline && new Date(g.deadline) >= today);
        setGrants(upcoming.slice(0, 5));
      } catch {}
    };
    loadUser();
    loadCourses();
    loadGrants();
  }, []);

  const getDaysUntil = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(deadline);
    due.setHours(0, 0, 0, 0);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  const toggleAudio = () => {
    const newVal = !audioEnabled;
    setAudioEnabled(newVal);
    localStorage.setItem("ninja_audio_enabled", newVal.toString());
    if (newVal) playSlash();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const firstName = user?.full_name?.split(' ')[0] || 'Member';

  const memberLinks = [
    { icon: BookOpen, title: "Exclusive Blog Posts", desc: "In-depth articles from industry experts", path: "Blog", iconColor: "text-cyan-400" },
    { icon: PlayCircle, title: "Video Content", desc: "Training videos and tactical breakdowns", path: "Webinars", iconColor: "text-purple-400" },
    { icon: Library, title: "Resource Library", desc: "Tools, templates & threat assessments", path: "Publications", iconColor: "text-green-400" },
    { icon: Mic, title: "Shield & Signal Podcast", desc: "Exclusive podcast episodes and interviews", path: "Webinars", iconColor: "text-orange-400" },
    { icon: Award, title: "PhD Grants Hub", desc: "Autonomous funding discovery dashboard", path: "PhDGrantsHub", iconColor: "text-yellow-400" },
    { icon: FileText, title: "Training Catalog", desc: "Professional certifications and courses", path: "TrainingCatalog", iconColor: "text-blue-400" },
  ];

  const adminLinks = [
    { icon: Settings, title: "Admin Dashboard", desc: "Centralized command center", path: "AdminDashboard" },
    { icon: FileText, title: "Blog Manager", desc: "Create and manage blog content", path: "BlogAdmin" },
    { icon: TrendingUp, title: "SEO Dashboard", desc: "Monitor search performance", path: "SEODashboard" },
    { icon: Users, title: "Subscriber Manager", desc: "Manage newsletter subscribers", path: "SubscriberManager" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 ninja-grid text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  {isAdmin ? "Admin Portal" : "Member Portal"}
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{firstName}</span>
              </h1>
              <p className="text-slate-400 text-base">
                Your exclusive access to cybersecurity research, resources, and training content.
              </p>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
                audioEnabled
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Cyber Ninja Audio: {audioEnabled ? "On" : "Off"}
            </button>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <Card className="bg-slate-900/50 border border-cyan-500/20 shuriken-clip">
            <CardContent className="p-6">
              <div className="flex items-center gap-5 flex-wrap">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 text-2xl font-bold">
                    {(user?.full_name || "?")[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white">{user?.full_name || "Member"}</h2>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{user?.email || "—"}</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />{isAdmin ? "Admin" : "Member"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Member Since</div>
                  <div className="text-sm text-white">
                    {user?.created_date ? new Date(user.created_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grant Deadlines + Training Catalog Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid lg:grid-cols-2 gap-6 mb-10"
        >
          {/* Grant Deadlines */}
          <Card className="bg-slate-900/50 border border-cyan-500/20 shuriken-clip">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-cyan-400" />
                <CardTitle className="text-lg text-white">Grant Deadlines</CardTitle>
              </div>
              <Link to={createPageUrl("PhDGrantsHub")} onClick={() => { playSlash(); window.scrollTo(0, 0); }}>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-xs">
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {grants.length === 0 ? (
                <p className="text-slate-500 text-sm py-6 text-center">No upcoming grant deadlines.</p>
              ) : (
                <div className="space-y-2">
                  {grants.map((grant) => {
                    const days = getDaysUntil(grant.deadline);
                    const urgent = days !== null && days <= 7;
                    const soon = days !== null && days <= 30 && days > 7;
                    return (
                      <Link key={grant.id} to={createPageUrl("PhDGrantsHub")} onClick={() => { playSlash(); window.scrollTo(0, 0); }}>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer">
                          <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 ${
                            urgent ? "bg-red-500/15 border border-red-500/30" :
                            soon ? "bg-yellow-500/15 border border-yellow-500/30" :
                            "bg-cyan-500/10 border border-cyan-500/20"
                          }`}>
                            {urgent ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <Award className="w-5 h-5 text-cyan-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium line-clamp-1">{grant.title}</h4>
                            <p className="text-xs text-slate-500">{grant.provider}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-sm font-bold ${
                              urgent ? "text-red-400" : soon ? "text-yellow-400" : "text-cyan-400"
                            }`}>
                              {days === 0 ? "Today!" : `${days}d`}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(grant.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training Catalog Quick Access */}
          <Card className="bg-slate-900/50 border border-blue-500/20 shuriken-clip">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-lg text-white">Training Catalog</CardTitle>
              </div>
              <Link to={createPageUrl("TrainingCatalog")} onClick={() => { playSlash(); window.scrollTo(0, 0); }}>
                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 text-xs">
                  Browse All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {courses.length === 0 ? (
                <p className="text-slate-500 text-sm py-6 text-center">No courses available.</p>
              ) : (
                <div className="space-y-2">
                  {courses.slice(0, 5).map((course) => (
                    <Link key={course.id} to={createPageUrl("TrainingCatalog")} onClick={() => { playSlash(); window.scrollTo(0, 0); }}>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/30 transition-all duration-200 cursor-pointer">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium line-clamp-1">{course.title}</h4>
                          <p className="text-xs text-slate-500">{course.category} · {course.duration}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-blue-400">
                            {course.price_label || `$${course.price?.toLocaleString()}`}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { icon: Zap, label: "Early Research Access", value: "Active", color: "text-cyan-400" },
            { icon: BookOpen, label: "Exclusive Articles", value: "Full Access", color: "text-blue-400" },
            { icon: Library, label: "Resource Library", value: "Unlocked", color: "text-green-400" },
            { icon: Lock, label: "Account Status", value: isAdmin ? "Admin" : "Member", color: "text-violet-400" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900/50 border border-slate-800">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                <div className="text-sm font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Course Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Premium Training Materials</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 6).map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
              >
                <Link to={createPageUrl("TrainingCatalog")} onClick={() => { playSlash(); window.scrollTo(0, 0); }}>
                  <Card className="bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer h-full group">
                    <CardContent className="p-4">
                      <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs mb-2">{course.category}</Badge>
                      <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3" />{course.duration}</span>
                        <span className="text-cyan-400 font-bold text-sm">{course.price_label || `$${course.price}`}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Admin Section */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Admin Tools</h2>
              </div>
              <Link to={createPageUrl("AdminDashboard")} onClick={() => { playSlash(); window.scrollTo(0, 0); }}>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm">
                  Full Admin Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminLinks.map((link) => (
                <Link key={link.title} to={createPageUrl(link.path)} onClick={() => { playSlash(); window.scrollTo(0, 0); }}>
                  <Card className="bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/50 transition-all duration-200 cursor-pointer h-full">
                    <CardContent className="p-5">
                      <link.icon className="w-6 h-6 text-cyan-400 mb-3" />
                      <h3 className="font-semibold text-white text-sm mb-1">{link.title}</h3>
                      <p className="text-xs text-slate-500">{link.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Member Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Library className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Exclusive Content</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {memberLinks.map((link, i) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
              >
                <Link to={createPageUrl(link.path)} onClick={() => { playSlash(); window.scrollTo(0, 0); }}>
                  <Card className="bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer h-full overflow-hidden group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <link.icon className={`w-6 h-6 ${link.iconColor}`} />
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="text-white text-base mt-2">{link.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400">{link.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold flex-1">
            <Link to={createPageUrl('Contact')} onClick={() => { playSlash(); window.scrollTo(0, 0); }}>
              <Phone className="w-4 h-4 mr-2" />
              Request a Consultation
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => base44.auth.logout(createPageUrl('Portfolio'))}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}