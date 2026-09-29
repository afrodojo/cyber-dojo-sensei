import React from "react";
import { motion } from "framer-motion";
import { Mic, Calendar, MapPin, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Added import
import { createPageUrl } from "@/utils"; // Added import

export default function SpeakingEngagements() {
  const engagements = [
    {
      title: "The Future of Offensive Cybersecurity",
      event: "CyberCon 2025",
      date: "May 2025",
      location: "Las Vegas, NV",
      audience: "2000+ Industry Professionals",
      description: "Exploring emerging trends in offensive cybersecurity, including AI-powered attacks, cloud security challenges, and next-generation red team tactics.",
      topics: ["Future Trends", "AI in Security", "Cloud Attacks"],
      type: "Conference",
      status: "upcoming"
    },
    {
      title: "Cybersecurity Leadership for Executives",
      event: "Fortune 500 Security Summit",
      date: "July 2025",
      location: "New York, NY",
      audience: "100+ C-Level Executives",
      description: "Executive-level presentation on cybersecurity strategy, risk management, and building effective security programs in large organizations.",
      topics: ["Executive Leadership", "Risk Management", "Strategy"],
      type: "Executive Briefing",
      status: "upcoming"
    },
    {
      title: "Advanced Threat Intelligence & Red Team Operations",
      event: "Recorded Future Security Conference 2026",
      date: "February 2026",
      location: "Washington, DC",
      audience: "1000+ Security & Intelligence Professionals",
      description: "Keynote presentation on advanced threat intelligence, red team operations, and emerging cyber threats facing government and enterprise organizations.",
      topics: ["Threat Intelligence", "Red Team Operations", "Cybersecurity Strategy"],
      type: "Conference",
      status: "upcoming"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "upcoming": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Keynote": return Award;
      case "Workshop": return Users;
      default: return Mic;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Speaking Engagements
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Sharing knowledge and insights with the cybersecurity community through conferences, workshops, and executive briefings.
        </p>
      </motion.div>

      {/* Speaking Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-teal-400 mb-1">15+</div>
              <div className="text-sm text-slate-400">Speaking Events</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-cyan-400 mb-1">5000+</div>
              <div className="text-sm text-slate-400">Professionals Reached</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-400 mb-1">9</div>
              <div className="text-sm text-slate-400">Major Conferences</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-400 mb-1">12</div>
              <div className="text-sm text-slate-400">Workshop Sessions</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Engagements List */}
      <div className="space-y-8">
        {engagements.map((engagement, index) => {
          const TypeIcon = getTypeIcon(engagement.type);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Icon & Status */}
                    <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:gap-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                        <TypeIcon className="w-8 h-8 text-white" />
                      </div>
                      <Badge className={`${getStatusColor(engagement.status)} border text-xs font-medium`}>
                        {engagement.status}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors pb-1">
                            {engagement.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{engagement.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{engagement.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{engagement.audience}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-slate-700/50 text-slate-300 text-xs border-slate-600 mt-2 md:mt-0">
                          {engagement.type}
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-teal-400 font-semibold text-lg mb-2">{engagement.event}</h4>
                        <p className="text-slate-300 leading-relaxed">{engagement.description}</p>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {engagement.topics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} className="bg-slate-700/50 text-slate-300 text-xs border-slate-600">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Buttons - REMOVED */}
                      {/* No longer showing slides/recording buttons since they don't exist */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Speaking Invitation CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border-teal-500/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Invite Me to Speak
            </h3>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Looking for an experienced cybersecurity professional to speak at your event? I offer engaging presentations on offensive security, leadership, and military-to-civilian career transitions.
            </p>
            <Button 
              asChild // Added asChild prop
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold"
            >
              <Link to={createPageUrl('Contact')}> {/* Wrapped content with Link */}
                <Mic className="w-5 h-5 mr-2" />
                Request Speaker Info
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}