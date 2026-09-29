import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Testimonial } from "@/entities/Testimonial";
import {
  Quote,
  Star,
  Building,
  User,
  Award,
  Shield,
  MessageSquarePlus,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TestimonialForm from "./TestimonialForm";

// Sector-aligned tags shown on each card based on reviewer user_type.
const USER_TYPE_TAG = {
  "client-employer": { label: "Employer", className: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30", icon: Briefcase },
  "career-seeker": { label: "Seeker", className: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30", icon: Sparkles },
  "educational-institution": { label: "Institution", className: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: GraduationCap },
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const fetched = await Testimonial.list("-created_date");
      // Only display approved reviews. Legacy records (no is_approved field)
      // remain visible; new public submissions are pending until an admin approves.
      const approved = (fetched || []).filter((t) => t.is_approved !== false);
      setTestimonials(approved);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    }
  };

  const handleSubmitted = () => {
    setShowForm(false);
    setSubmissionMessage(
      "Thank you! Your review has been submitted and is pending approval."
    );
    fetchTestimonials();
    setTimeout(() => setSubmissionMessage(""), 6000);
  };

  const getIcon = (relationship) => {
    switch (relationship?.toLowerCase()) {
      case "direct supervisor":
      case "program manager":
        return Shield;
      case "team lead":
      case "client":
        return Building;
      case "business partner":
        return User;
      default:
        return Award;
    }
  };

  const getColor = (relationship) => {
    switch (relationship?.toLowerCase()) {
      case "direct supervisor":
        return "from-blue-600 to-cyan-600";
      case "team lead":
        return "from-green-600 to-emerald-600";
      case "program manager":
        return "from-red-600 to-pink-600";
      case "client":
        return "from-purple-600 to-indigo-600";
      case "business partner":
        return "from-yellow-600 to-orange-600";
      default:
        return "from-teal-600 to-blue-600";
    }
  };

  const userTypeTag = (t) =>
    USER_TYPE_TAG[t.user_type] || {
      label: "Peer",
      className: "bg-slate-600/40 text-slate-300 border-slate-500/40",
      icon: User,
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
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
          What My Colleagues Say
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Testimonials from leaders, clients, and peers who have witnessed my
          expertise and professionalism firsthand.
        </p>
      </motion.div>

      {!showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold"
          >
            <MessageSquarePlus className="w-5 h-5 mr-2" />
            Leave a Review
          </Button>
          {submissionMessage && (
            <p className="mt-4 text-green-400 text-sm max-w-md mx-auto">
              {submissionMessage}
            </p>
          )}
        </motion.div>
      )}

      {showForm && (
        <TestimonialForm
          onSubmitted={handleSubmitted}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Testimonials Grid */}
      {testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {testimonials.map((testimonial, index) => {
            const Icon = getIcon(testimonial.relationship);
            const color = getColor(testimonial.relationship);
            const tag = userTypeTag(testimonial);
            const TagIcon = tag.icon;
            return (
              <motion.div
                key={testimonial.id || testimonial.name + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 6) * 0.08 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all duration-300 h-full flex flex-col group">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white mb-0.5 truncate">
                          {testimonial.name}
                        </h3>
                        <p className="text-cyan-400 font-semibold text-xs mb-0.5 truncate">
                          {testimonial.title}
                        </p>
                        {testimonial.company && (
                          <p className="text-slate-400 text-xs truncate">
                            {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (testimonial.rating || 5)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge
                        className={`text-[10px] px-2 py-0.5 border ${tag.className} flex items-center gap-1`}
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag.label}
                      </Badge>
                    </div>

                    <div className="relative flex-1">
                      <Quote className="w-5 h-5 text-slate-600 mb-2" />
                      <p className="text-slate-300 leading-relaxed text-sm italic">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquarePlus className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No testimonials yet
          </h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Be the first to leave a review about working with Asaad.
          </p>
        </div>
      )}
    </div>
  );
}