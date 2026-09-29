import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
  Loader2, AlertTriangle, BookOpen, TrendingUp, Clock, CheckCircle
} from "lucide-react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameDay, isSameMonth, addMonths, subMonths,
  parseISO, isAfter, isBefore, differenceInDays
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLES = {
  "published": { dot: "bg-green-400", badge: "bg-green-500/20 text-green-300 border-green-500/30", label: "Published" },
  "under-review": { dot: "bg-orange-400", badge: "bg-orange-500/20 text-orange-300 border-orange-500/30", label: "Under Review" },
  "draft": { dot: "bg-slate-500", badge: "bg-slate-600/40 text-slate-400 border-slate-600", label: "Draft" },
};

function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES["draft"];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BlogCalendar() {
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const init = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role === "admin") {
          setIsAdmin(true);
          const all = await base44.entities.BlogPost.list("-created_date");
          setPosts(all);
        }
      } catch {}
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="w-12 h-12 text-ninja-green animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="flex flex-col justify-center items-center min-h-screen text-white">
      <div className="text-center p-8 bg-slate-900 rounded-lg border border-red-500/30">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400">Admin access required.</p>
      </div>
    </div>
  );

  // Build calendar days for the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  // Map posts to their scheduled dates
  const postsByDate = {};
  posts.forEach(post => {
    if (post.scheduled_date) {
      try {
        const date = parseISO(post.scheduled_date);
        const key = format(date, "yyyy-MM-dd");
        if (!postsByDate[key]) postsByDate[key] = [];
        postsByDate[key].push(post);
      } catch {}
    }
  });

  const getPostsForDay = (day) => postsByDate[format(day, "yyyy-MM-dd")] || [];

  // Stats
  const today = new Date();
  const scheduledPosts = posts.filter(p => p.scheduled_date);
  const upcoming = scheduledPosts
    .filter(p => {
      try { return isAfter(parseISO(p.scheduled_date), today) || isSameDay(parseISO(p.scheduled_date), today); } catch { return false; }
    })
    .sort((a, b) => {
      try { return parseISO(a.scheduled_date) - parseISO(b.scheduled_date); } catch { return 0; }
    });

  const publishedThisMonth = posts.filter(p => {
    if (p.status !== "published" || !p.scheduled_date) return false;
    try {
      const d = parseISO(p.scheduled_date);
      return isSameMonth(d, currentMonth);
    } catch { return false; }
  }).length;

  // Consistency: posts per week this month
  const monthScheduledCount = scheduledPosts.filter(p => {
    try { return isSameMonth(parseISO(p.scheduled_date), currentMonth); } catch { return false; }
  }).length;
  const weeksInMonth = Math.ceil(days.length / 7);
  const postsPerWeek = (monthScheduledCount / weeksInMonth).toFixed(1);

  const selectedDayPosts = getPostsForDay(selectedDate);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-ninja-green" /> Blog Calendar
            </h1>
            <p className="text-slate-400 mt-1">Visualize your publishing schedule and stay consistent</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to={createPageUrl("BlogAdmin")}>
                <BookOpen className="w-4 h-4 mr-2" /> Blog Manager
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-ninja-green to-ninja-green text-white gap-2">
              <Link to={createPageUrl("BlogAdmin")}>
                <Plus className="w-4 h-4" /> New Article
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Scheduled Total", value: scheduledPosts.length, icon: CalendarIcon, color: "text-cyan-400" },
            { label: "Upcoming", value: upcoming.length, icon: Clock, color: "text-yellow-400" },
            { label: "Published This Month", value: publishedThisMonth, icon: CheckCircle, color: "text-green-400" },
            { label: "Posts / Week", value: postsPerWeek, icon: TrendingUp, color: "text-ninja-green" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="ninja-surface border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                <Icon className={`w-6 h-6 ${s.color}`} />
                <div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Calendar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="ninja-surface border border-slate-700/50 rounded-xl overflow-hidden">
            {/* Month navigation */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-bold text-white capitalize">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="text-slate-400 hover:text-white h-8 w-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 text-xs">
                  Today
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="text-slate-400 hover:text-white h-8 w-8">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-slate-700/50">
              {WEEKDAYS.map(day => (
                <div key={day} className="px-2 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                const dayPosts = getPostsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[90px] sm:min-h-[110px] border-r border-b border-slate-800/50 p-1.5 cursor-pointer transition-colors ${
                      isSelected ? "bg-ninja-green/10" : "hover:bg-slate-800/30"
                    } ${!isCurrentMonth ? "opacity-40" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        isToday ? "bg-ninja-green text-ninja-void rounded-full w-5 h-5 flex items-center justify-center" :
                        isCurrentMonth ? "text-slate-300" : "text-slate-600"
                      }`}>
                        {format(day, "d")}
                      </span>
                      {dayPosts.length > 0 && (
                        <span className="text-[10px] text-slate-500">{dayPosts.length}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayPosts.slice(0, 3).map(post => {
                        const style = getStatusStyle(post.status);
                        return (
                          <div key={post.id} className={`flex items-center gap-1 px-1 py-0.5 rounded text-[10px] sm:text-xs truncate ${style.badge} border`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                            <span className="truncate text-slate-200">{post.title}</span>
                          </div>
                        );
                      })}
                      {dayPosts.length > 3 && (
                        <p className="text-[10px] text-slate-500 px-1">+{dayPosts.length - 3} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Sidebar — Selected day details */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="space-y-4">
            <div className="ninja-surface border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-1">
                {format(selectedDate, "EEEE, MMM d")}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {selectedDayPosts.length} {selectedDayPosts.length === 1 ? "post" : "posts"} scheduled
              </p>

              {selectedDayPosts.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Nothing scheduled</p>
                  <Button asChild size="sm" variant="outline" className="mt-3 border-slate-600 text-slate-300 hover:bg-slate-800 text-xs">
                    <Link to={createPageUrl("BlogAdmin")}>
                      <Plus className="w-3 h-3 mr-1" /> Schedule one
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDayPosts.map(post => {
                    const style = getStatusStyle(post.status);
                    return (
                      <Link key={post.id} to={createPageUrl("BlogAdmin")}
                        className="block p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-ninja-green/50 transition-colors">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${style.badge}`}>{style.label}</span>
                        </div>
                        <p className="text-sm font-medium text-white line-clamp-2">{post.title}</p>
                        {post.excerpt && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{post.excerpt}</p>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upcoming posts */}
            <div className="ninja-surface border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" /> Upcoming
              </h3>
              {upcoming.length === 0 ? (
                <p className="text-xs text-slate-600">No upcoming scheduled posts.</p>
              ) : (
                <div className="space-y-2">
                  {upcoming.slice(0, 5).map(post => {
                    const style = getStatusStyle(post.status);
                    let daysAway = "";
                    try {
                      const diff = differenceInDays(parseISO(post.scheduled_date), today);
                      daysAway = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : `in ${diff} days`;
                    } catch {}
                    return (
                      <div key={post.id} className="flex items-center gap-2 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                        <span className="text-slate-300 truncate flex-1">{post.title}</span>
                        <span className="text-slate-500 flex-shrink-0">{daysAway}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}