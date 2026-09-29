import React, { useState } from "react";
import { subscribeNewsletter } from "@/functions/subscribeNewsletter";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    const res = await subscribeNewsletter({ email: email.trim(), source: "footer" });
    if (res.data?.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <span>You're subscribed! Thanks for joining.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-all flex items-center gap-2 justify-center whitespace-nowrap"
      >
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Subscribe
      </button>
    </form>
  );
}