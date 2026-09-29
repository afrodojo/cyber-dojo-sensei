import React, { useState } from "react";
import { submitTestimonial } from "@/functions/submitTestimonial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Star, Send, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const USER_TYPES = [
  { value: "client-employer", label: "Client / Employer" },
  { value: "career-seeker", label: "Career Seeker / Peer" },
  { value: "educational-institution", label: "Educational Institution" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip HTML tags & stray angle brackets before submission (defense in depth
// — the backend re-sanitizes, but this keeps accidental paste-injections
// from ever reaching the wire).
const sanitize = (str) =>
  String(str || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();

export default function TestimonialForm({ onSubmitted, onCancel }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    user_type: "",
    company: "",
    rating: 0,
    text: "",
  });
  const [errors, setErrors] = useState({});
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleRating = (rate) => {
    setFormData((prev) => ({ ...prev, rating: rate }));
    if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Please enter your full name.";
    if (!formData.email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(formData.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!formData.title.trim()) next.title = "Please enter your role or title.";
    if (!formData.user_type) next.user_type = "Please select a user type.";
    if (!formData.rating || formData.rating < 1)
      next.rating = "Please select a star rating.";
    if (!formData.text.trim()) next.text = "Please write your review.";
    else if (formData.text.trim().length < 10)
      next.text = "Review must be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: sanitize(formData.name),
        email: formData.email.trim(),
        title: sanitize(formData.title),
        user_type: formData.user_type,
        rating: formData.rating,
        text: sanitize(formData.text),
        company: sanitize(formData.company),
      };
      const res = await submitTestimonial(payload);
      const data = res.data || {};

      if (data.success) {
        toast({
          title: "Success! Check your inbox.",
          description: data.warning
            ? data.warning
            : "Thank you for your review — a confirmation email is on its way.",
        });
        onSubmitted?.();
      } else {
        throw new Error(data.error || "Submission failed.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Please try again.";
      setErrors((prev) => ({ ...prev, form: msg }));
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 my-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
          <Star className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Leave a Review</h3>
          <p className="text-sm text-slate-400">
            Your review is sent for a quick approval before it appears publicly.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name + Email */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200 mb-1.5">Full Name *</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={120}
              placeholder="Your full name"
              className="bg-slate-900/60 border-slate-700 text-white"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>
          <div>
            <Label className="text-slate-200 mb-1.5">Email *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={160}
              placeholder="you@email.com"
              className="bg-slate-900/60 border-slate-700 text-white"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Title + Company */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-200 mb-1.5">Role / Title *</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={120}
              placeholder="e.g., Chief Information Security Officer"
              className="bg-slate-900/60 border-slate-700 text-white"
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>
          <div>
            <Label className="text-slate-200 mb-1.5">Company / Organization</Label>
            <Input
              name="company"
              value={formData.company}
              onChange={handleChange}
              maxLength={120}
              placeholder="Optional"
              className="bg-slate-900/60 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* User Type */}
        <div>
          <Label className="text-slate-200 mb-1.5">I am a: *</Label>
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            className={`w-full bg-slate-900/60 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors ${
              errors.user_type ? "border-red-500/60" : "border-slate-700"
            }`}
          >
            <option value="">Select your user type…</option>
            {USER_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.user_type && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.user_type}
            </p>
          )}
        </div>

        {/* Rating */}
        <div>
          <Label className="text-slate-200 mb-1.5">Your Rating *</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((rate) => (
              <button
                type="button"
                key={rate}
                onClick={() => handleRating(rate)}
                onMouseEnter={() => setHoverRating(rate)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${rate} star${rate > 1 ? "s" : ""}`}
                className="p-0.5"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    (hoverRating || formData.rating) >= rate
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-600 hover:text-yellow-300"
                  }`}
                />
              </button>
            ))}
            {formData.rating > 0 && (
              <span className="ml-2 text-sm text-slate-400">
                {formData.rating} / 5
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.rating}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <Label className="text-slate-200 mb-1.5">Your Review *</Label>
          <Textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            maxLength={1000}
            rows={5}
            placeholder="Share your experience working with Asaad…"
            className={`bg-slate-900/60 text-white resize-none ${
              errors.text ? "border-red-500/60" : "border-slate-700"
            }`}
            aria-invalid={!!errors.text}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.text ? (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.text}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-slate-500">
              {formData.text.length}/1000
            </span>
          </div>
        </div>

        {/* Form-level error */}
        {errors.form && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-300">{errors.form}</p>
          </div>
        )}

        {/* Privacy note */}
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Your email is used only to send a confirmation and is never displayed
          publicly.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}