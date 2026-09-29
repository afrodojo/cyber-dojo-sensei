import React, { useState } from "react";
import { Plus, X, Copy, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PILLARS = [
  { id: "all", label: "All", color: "text-slate-300", activeColor: "bg-slate-600 text-white" },
  { id: "business", label: "Business", color: "text-blue-300", activeColor: "bg-blue-500/80 text-white" },
  { id: "career", label: "Career", color: "text-emerald-300", activeColor: "bg-emerald-500/80 text-white" },
  { id: "education", label: "Education", color: "text-amber-300", activeColor: "bg-amber-500/80 text-white" },
  { id: "general", label: "General", color: "text-cyan-300", activeColor: "bg-cyan-500/80 text-white" },
];

const PILLAR_COLORS = {
  business: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  career: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  education: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  general: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

const DEFAULT_TEMPLATES = [
  // ── Business ──────────────────────────────────────────────
  {
    id: "business-insight",
    pillar: "business",
    name: "Business Insight",
    category: "business",
    excerpt: "Strategic insights on cybersecurity business trends and leadership.",
    contentTemplate: `# [Title]\n\n## The Business Challenge\n\n[Describe the business problem]\n\n## Market Context\n\n[Industry trends and data]\n\n## Strategic Implications\n\n[What this means for your organization]\n\n## Action Plan\n\n1. [Initiative 1]\n2. [Initiative 2]\n3. [Initiative 3]\n\n## Expected Outcomes\n\n[Benefits and ROI]\n\n## Final Thoughts\n\n[Strategic conclusion]`,
    tags: ["business", "strategy", "leadership"],
  },
  {
    id: "security-roi-business-case",
    pillar: "business",
    name: "Security ROI Business Case",
    category: "business",
    excerpt: "Build a financial case for a cybersecurity investment or initiative.",
    contentTemplate: `# [Title]\n\n## Executive Summary\n\n[One-paragraph summary of the investment and expected return]\n\n## The Problem\n\n[Current security gap or risk exposure]\n\n## Proposed Solution\n\n[What you're recommending and why]\n\n## Cost Analysis\n\n| Item | Cost |\n|------|------|\n| [Item 1] | $[Amount] |\n| [Item 2] | $[Amount] |\n| **Total** | **$[Total]** |\n\n## Expected ROI\n\n- Risk reduction: [%]\n- Cost savings: $[Amount]\n- Productivity gains: [Details]\n\n## Implementation Timeline\n\n1. Phase 1: [Timeline + milestone]\n2. Phase 2: [Timeline + milestone]\n3. Phase 3: [Timeline + milestone]\n\n## Recommendation\n\n[Clear call to action for stakeholders]`,
    tags: ["business", "roi", "leadership", "budget"],
  },
  {
    id: "thought-leadership-opinion",
    pillar: "business",
    name: "Thought Leadership Opinion",
    category: "business",
    excerpt: "Share a bold industry perspective to position yourself as a voice in the field.",
    contentTemplate: `# [Title]\n\n## The Contrarian View\n\n[State your bold opinion upfront]\n\n## Why Everyone Gets This Wrong\n\n[Explain the common misconception]\n\n## The Reality\n\n[Your evidence-based perspective]\n\n## What This Means for the Industry\n\n[Broader implications]\n\n## What You Should Do Instead\n\n[Actionable alternative approach]\n\n## Over to You\n\n[Invite discussion — what's your take?]`,
    tags: ["business", "thought-leadership", "opinion"],
  },
  // ── Career ────────────────────────────────────────────────
  {
    id: "military-transition-tip",
    pillar: "career",
    name: "Military Transition Tip",
    category: "leadership",
    excerpt: "Actionable advice for military professionals transitioning to the civilian sector.",
    contentTemplate: `# [Title]\n\n## The Challenge\n\n[Describe the transition challenge]\n\n## The Military Approach\n\n[How military thinking applies]\n\n## The Civilian Translation\n\n[How to apply this in the civilian world]\n\n## Action Steps\n\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n## Key Takeaway\n\n[Summarize the tip]`,
    tags: ["military", "transition", "leadership", "career"],
  },
  {
    id: "certification-roadmap",
    pillar: "career",
    name: "Certification Roadmap",
    category: "leadership",
    excerpt: "Guide readers through earning a cybersecurity certification step by step.",
    contentTemplate: `# [Title]\n\n## Why This Certification Matters\n\n[Value of the cert in the job market]\n\n## Prerequisites\n\n- [Requirement 1]\n- [Requirement 2]\n- [Requirement 3]\n\n## Exam Overview\n\n- **Format:** [Multiple choice / practical / etc.]\n- **Duration:** [Time]\n- **Cost:** $[Amount]\n- **Passing score:** [Score]\n\n## Study Plan\n\n### Phase 1: Foundations (Weeks 1-2)\n[What to study and resources]\n\n### Phase 2: Deep Dive (Weeks 3-5)\n[Core topics to master]\n\n### Phase 3: Practice (Weeks 6-7)\n[Practice exams and labs]\n\n### Phase 4: Review (Week 8)\n[Final review strategy]\n\n## Recommended Resources\n\n- [Book / course]\n- [Practice exam platform]\n- [Lab environment]\n\n## Exam Day Tips\n\n1. [Tip 1]\n2. [Tip 2]\n3. [Tip 3]\n\n## What Comes Next\n\n[Next cert or career step after passing]`,
    tags: ["career", "certification", "training", "roadmap"],
  },
  {
    id: "interview-prep-guide",
    pillar: "career",
    name: "Interview Prep Guide",
    category: "leadership",
    excerpt: "Help candidates ace cybersecurity interviews with common questions and strategies.",
    contentTemplate: `# [Title]\n\n## The Role\n\n[Brief description of the position and what it entails]\n\n## What Employers Look For\n\n- [Technical skill]\n- [Soft skill]\n- [Experience indicator]\n\n## Common Questions and How to Answer\n\n### Q1: [Question]\n**What they're really asking:** [Underlying intent]\n**Sample answer:** [Framework + example]\n\n### Q2: [Question]\n**What they're really asking:** [Underlying intent]\n**Sample answer:** [Framework + example]\n\n### Q3: [Question]\n**What they're really asking:** [Underlying intent]\n**Sample answer:** [Framework + example]\n\n## Technical Assessment Prep\n\n[What to review: tools, concepts, scenarios]\n\n## Red Flags to Avoid\n\n- [Mistake 1]\n- [Mistake 2]\n- [Mistake 3]\n\n## The Day Before\n\n[Checklist of final prep steps]\n\n## You've Got This\n\n[Encouraging closing note]`,
    tags: ["career", "interview", "job-search", "preparation"],
  },
  // ── Education ──────────────────────────────────────────────
  {
    id: "tutorial-how-to",
    pillar: "education",
    name: "Tutorial / How-To Guide",
    category: "technical",
    excerpt: "Step-by-step instructional guide teaching a specific skill or technique.",
    contentTemplate: `# [Title]\n\n## What You'll Learn\n\n[One-sentence outcome the reader will achieve]\n\n## Prerequisites\n\n- [Requirement 1]\n- [Requirement 2]\n- [Requirement 3]\n\n## Step 1: [Action]\n\n[Explanation]\n\n\`\`\`bash\n[Command or code]\n\`\`\`\n\n[What this does]\n\n## Step 2: [Action]\n\n[Explanation]\n\n\`\`\`bash\n[Command or code]\n\`\`\`\n\n[What this does]\n\n## Step 3: [Action]\n\n[Explanation]\n\n\`\`\`bash\n[Command or code]\n\`\`\`\n\n[What this does]\n\n## Verification\n\n[How to confirm it worked]\n\n## Common Issues\n\n| Problem | Solution |\n|--------|----------|\n| [Issue] | [Fix] |\n| [Issue] | [Fix] |\n\n## What's Next\n\n[Where to go from here — advanced topics or related guides]`,
    tags: ["education", "tutorial", "how-to", "guide"],
  },
  {
    id: "course-announcement",
    pillar: "education",
    name: "Course / Training Announcement",
    category: "technical",
    excerpt: "Announce a new course, workshop, or training program.",
    contentTemplate: `# [Title]\n\n## What Is It?\n\n[One-paragraph overview of the course]\n\n## Who Is This For?\n\n- [Audience 1]\n- [Audience 2]\n- [Audience 3]\n\n## What You'll Learn\n\nBy the end of this course, you'll be able to:\n\n1. [Learning objective 1]\n2. [Learning objective 2]\n3. [Learning objective 3]\n\n## Course Outline\n\n### Module 1: [Title]\n[Topics covered]\n\n### Module 2: [Title]\n[Topics covered]\n\n### Module 3: [Title]\n[Topics covered]\n\n## Format and Duration\n\n- **Format:** [In-person / online / hybrid]\n- **Duration:** [Hours/weeks]\n- **Schedule:** [Dates/times]\n\n## Prerequisites\n\n[Any required knowledge or experience]\n\n## How to Register\n\n[Registration link and instructions]\n\n## Pricing\n\n[Cost, early-bird discounts, group rates]`,
    tags: ["education", "course", "training", "announcement"],
  },
  {
    id: "concept-explainer",
    pillar: "education",
    name: "Concept Explainer",
    category: "technical",
    excerpt: "Break down a complex cybersecurity concept into approachable terms.",
    contentTemplate: `# [Title]\n\n## The TL;DR\n\n[One-paragraph plain-English summary]\n\n## Why It Matters\n\n[Why readers should care about this concept]\n\n## Breaking It Down\n\n### The Basics\n\n[Simple explanation without jargon]\n\n### How It Works\n\n[Step-by-step or visual explanation]\n\n### Real-World Example\n\n[Concrete scenario that illustrates the concept]\n\n## Common Misconceptions\n\n- **Myth:** [Misconception]\n  **Reality:** [Correction]\n- **Myth:** [Misconception]\n  **Reality:** [Correction]\n\n## Key Terms\n\n| Term | Meaning |\n|------|---------|\n| [Term] | [Definition] |\n| [Term] | [Definition] |\n\n## Where to Learn More\n\n- [Resource 1]\n- [Resource 2]\n- [Resource 3]`,
    tags: ["education", "explainer", "concepts", "fundamentals"],
  },
  // ── General ───────────────────────────────────────────────
  {
    id: "cybersecurity-briefing",
    pillar: "general",
    name: "Cybersecurity Briefing",
    category: "threat-intelligence",
    excerpt: "Latest cybersecurity trends, vulnerabilities, and mitigation strategies.",
    contentTemplate: `# [Title]\n\n## Overview\n\n[Add your briefing overview here]\n\n## Key Threats\n\n- Threat 1\n- Threat 2\n- Threat 3\n\n## Mitigation Strategies\n\n### Strategy 1\n[Details here]\n\n### Strategy 2\n[Details here]\n\n## Recommendations\n\n[Add specific recommendations for your audience]`,
    tags: ["cybersecurity", "threat-intelligence", "briefing"],
  },
  {
    id: "red-team-case-study",
    pillar: "general",
    name: "Red Team Case Study",
    category: "red-team",
    excerpt: "Deep dive into a real-world red team engagement and lessons learned.",
    contentTemplate: `# [Title]\n\n## Executive Summary\n\n[Quick overview of the engagement]\n\n## Client Scenario\n\n[Describe the client's environment and objectives]\n\n## Engagement Approach\n\n[Detail your methodology]\n\n## Key Findings\n\n### Critical Issues\n[List critical findings]\n\n### Notable Observations\n[Additional insights]\n\n## Recommendations\n\n[Remediation and hardening advice]\n\n## Lessons Learned\n\n[What this teaches about security posture]`,
    tags: ["red-team", "penetration-testing", "case-study"],
  },
  {
    id: "technical-deep-dive",
    pillar: "general",
    name: "Technical Deep Dive",
    category: "technical",
    excerpt: "In-depth technical analysis of security concepts, tools, or frameworks.",
    contentTemplate: `# [Title]\n\n## Introduction\n\n[Why this topic matters]\n\n## Background\n\n[Explain the concepts]\n\n## How It Works\n\n[Technical explanation with steps]\n\n## Practical Applications\n\n[Real-world use cases]\n\n## Best Practices\n\n- Practice 1\n- Practice 2\n- Practice 3\n\n## Conclusion\n\n[Summarize key points]`,
    tags: ["technical", "security", "tools"],
  },
];

export default function TemplateManager({ onSelectTemplate, CATEGORIES }) {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [activePillar, setActivePillar] = useState("all");
  const [showCustom, setShowCustom] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [customTemplate, setCustomTemplate] = useState({
    name: "", pillar: "general", category: "technical", excerpt: "", contentTemplate: "", tags: []
  });

  const filteredTemplates = activePillar === "all"
    ? templates
    : templates.filter(t => t.pillar === activePillar);

  const handleSaveCustom = () => {
    if (!customTemplate.name.trim() || !customTemplate.contentTemplate.trim()) return;
    if (editingId) {
      setTemplates(templates.map(t => t.id === editingId ? { ...customTemplate, id: editingId } : t));
      setEditingId(null);
    } else {
      setTemplates([...templates, { ...customTemplate, id: `custom-${Date.now()}` }]);
    }
    setCustomTemplate({ name: "", pillar: "general", category: "technical", excerpt: "", contentTemplate: "", tags: [] });
    setShowCustom(false);
  };

  const handleDeleteTemplate = (id) => {
    if (!confirm("Delete this template?")) return;
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleEditTemplate = (template) => {
    setCustomTemplate(template);
    setEditingId(template.id);
    setShowCustom(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            Quick Templates
          </h3>
          <p className="text-xs text-slate-500 mt-1">Pick a structure by content type to jump-start your article</p>
        </div>
        <Button
          size="sm"
          onClick={() => { setShowCustom(true); setCustomTemplate({ name: "", pillar: "general", category: "technical", excerpt: "", contentTemplate: "", tags: [] }); setEditingId(null); }}
          className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30 gap-1.5 text-xs"
        >
          <Plus className="w-3.5 h-3.5" /> New Template
        </Button>
      </div>

      {/* Pillar filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {PILLARS.map(p => {
          const count = p.id === "all"
            ? templates.length
            : templates.filter(t => t.pillar === p.id).length;
          return (
            <button
              key={p.id}
              onClick={() => setActivePillar(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                activePillar === p.id
                  ? `${p.activeColor} border-transparent`
                  : `bg-slate-800/50 ${p.color} border-slate-700/50 hover:border-slate-600`
              }`}
            >
              {p.label}
              <span className={`text-[10px] ${activePillar === p.id ? "opacity-70" : "opacity-40"}`}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Create/Edit Custom Template */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-white">{editingId ? "Edit Template" : "Create Custom Template"}</h4>
              <button onClick={() => { setShowCustom(false); setEditingId(null); }} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <Input
              value={customTemplate.name}
              onChange={e => setCustomTemplate({ ...customTemplate, name: e.target.value })}
              placeholder="Template name (e.g., 'Quick Update')"
              className="bg-slate-900 border-slate-600 text-white text-sm h-8"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Content Pillar</label>
                <Select value={customTemplate.pillar} onValueChange={v => setCustomTemplate({ ...customTemplate, pillar: v })}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white text-sm h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PILLARS.filter(p => p.id !== "all").map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Category</label>
                <Select value={customTemplate.category} onValueChange={v => setCustomTemplate({ ...customTemplate, category: v })}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white text-sm h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/-/g, " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input
              value={customTemplate.excerpt}
              onChange={e => setCustomTemplate({ ...customTemplate, excerpt: e.target.value })}
              placeholder="Excerpt (brief description)"
              className="bg-slate-900 border-slate-600 text-white text-sm h-8"
            />
            <Textarea
              value={customTemplate.contentTemplate}
              onChange={e => setCustomTemplate({ ...customTemplate, contentTemplate: e.target.value })}
              placeholder="Template markdown content"
              rows={6}
              className="bg-slate-900 border-slate-600 text-white text-xs font-mono"
            />
            <Input
              value={customTemplate.tags?.join(", ") || ""}
              onChange={e => setCustomTemplate({ ...customTemplate, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
              placeholder="Tags (comma separated)"
              className="bg-slate-900 border-slate-600 text-white text-sm h-8"
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setShowCustom(false); setEditingId(null); }}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveCustom}
                disabled={!customTemplate.name.trim() || !customTemplate.contentTemplate.trim()}
                className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs"
              >
                {editingId ? "Save Changes" : "Create Template"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTemplates.map(template => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <Card className="bg-slate-800/40 border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors flex-1">{template.name}</h4>
                    <Badge className={`${PILLAR_COLORS[template.pillar] || PILLAR_COLORS.general} text-xs capitalize shrink-0`}>
                      {template.pillar}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{template.excerpt || "No description"}</p>
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs capitalize">{template.category?.replace(/-/g, " ")}</Badge>
                    {template.tags?.slice(0, 2).map(tag => (
                      <Badge key={tag} className="bg-slate-700/30 text-slate-400 border-slate-700 text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3 pt-3 border-t border-slate-700/30">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelectTemplate(template)}
                    className="flex-1 text-cyan-400 hover:bg-cyan-500/10 gap-1.5 text-xs h-7"
                  >
                    <Copy className="w-3 h-3" /> Use Template
                  </Button>
                  {template.id.startsWith("custom-") && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditTemplate(template)}
                        className="text-slate-400 hover:text-white gap-1 text-xs h-7"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-slate-400 hover:text-red-400 gap-1 text-xs h-7"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-8 text-slate-600">
            <p className="text-sm">No templates in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}