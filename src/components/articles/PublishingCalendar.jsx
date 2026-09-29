import React, { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Share2 } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

const PLATFORM_COLORS = {
  linkedin: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  twitter: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  instagram: "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

function buildCalendarDays(currentMonth) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = [];
  let d = startDate;
  while (d <= endDate) {
    days.push(d);
    d = addDays(d, 1);
  }
  return days;
}

export default function PublishingCalendar({ articles, socialPosts }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const days = buildCalendarDays(currentMonth);

  // Index events by date string (yyyy-MM-dd)
  const eventsByDate = {};

  articles.forEach(a => {
    const dateStr = a.scheduled_publish_date || a.created_date?.slice(0, 10);
    if (!dateStr) return;
    if (!eventsByDate[dateStr]) eventsByDate[dateStr] = [];
    eventsByDate[dateStr].push({ type: "article", label: a.title, status: a.status, id: a.id });
  });

  (socialPosts || []).forEach(p => {
    const dateStr = p.scheduled_at?.slice(0, 10) || p.published_at?.slice(0, 10) || p.created_date?.slice(0, 10);
    if (!dateStr) return;
    if (!eventsByDate[dateStr]) eventsByDate[dateStr] = [];
    eventsByDate[dateStr].push({ type: "social", label: p.content?.slice(0, 60) || "Social post", platform: p.platform, status: p.status, id: p.id });
  });

  const selectedDateStr = selected ? format(selected, "yyyy-MM-dd") : null;
  const selectedEvents = selectedDateStr ? (eventsByDate[selectedDateStr] || []) : [];

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 border-b border-slate-700/50 pb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px">
        {days.map((day, idx) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const events = eventsByDate[dateStr] || [];
          const inMonth = isSameMonth(day, currentMonth);
          const isSelected = selected && isSameDay(day, selected);
          const todayDay = isToday(day);
          const articleCount = events.filter(e => e.type === "article").length;
          const socialCount = events.filter(e => e.type === "social").length;

          return (
            <div
              key={idx}
              onClick={() => setSelected(isSameDay(day, selected) ? null : day)}
              className={`min-h-[72px] p-1.5 rounded-lg cursor-pointer transition-all border text-xs ${
                isSelected
                  ? "bg-cyan-500/15 border-cyan-500/60"
                  : inMonth
                  ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-700/50"
                  : "bg-slate-900/20 border-slate-800/20 opacity-40"
              }`}
            >
              <div className={`w-6 h-6 flex items-center justify-center rounded-full font-semibold mb-1 ${
                todayDay ? "bg-cyan-500 text-white" : "text-slate-400"
              }`}>
                {format(day, "d")}
              </div>
              <div className="space-y-0.5">
                {articleCount > 0 && (
                  <div className="flex items-center gap-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded px-1 py-0.5 truncate">
                    <FileText className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="truncate">{articleCount > 1 ? `${articleCount} articles` : events.find(e => e.type === "article")?.label?.slice(0, 14)}</span>
                  </div>
                )}
                {socialCount > 0 && (
                  <div className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded px-1 py-0.5 truncate">
                    <Share2 className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="truncate">{socialCount > 1 ? `${socialCount} posts` : events.find(e => e.type === "social")?.platform || "Social"}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selected && (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">
            {format(selected, "EEEE, MMMM d, yyyy")}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-slate-500 text-sm">No scheduled content on this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((ev, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                  ev.type === "article"
                    ? "bg-purple-500/10 border-purple-500/30"
                    : "bg-cyan-500/10 border-cyan-500/30"
                }`}>
                  {ev.type === "article"
                    ? <FileText className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    : <Share2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{ev.label}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {ev.type === "social" && ev.platform && (
                        <Badge className={`text-xs border ${PLATFORM_COLORS[ev.platform] || "bg-slate-700 text-slate-300"}`}>
                          {ev.platform}
                        </Badge>
                      )}
                      {ev.status && (
                        <Badge className={`text-xs border ${
                          ev.status === "published" ? "bg-green-500/20 text-green-300 border-green-500/30" :
                          ev.status === "approved" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                          ev.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" :
                          "bg-slate-700 text-slate-300 border-slate-600"
                        }`}>
                          {ev.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-500/40 inline-block"/> Articles</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-500/40 inline-block"/> Social Posts</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"/> Today</span>
      </div>
    </div>
  );
}