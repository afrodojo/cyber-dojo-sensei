import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { playSlash } from "@/lib/ninjaSounds";
import { trackEvent } from "@/lib/stealthAnalytics";
import TerminalText from "@/components/portfolio/TerminalText";

export default function PublicationsSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const publications = [
    {
      title: "How Not To Be A Sh*tty Boss",
      description: "A guide offering practical leadership lessons drawn from real-world experience, designed for leaders at all levels.",
      coverUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/1c34884b0_81Q4HuJUOL_SL1500_.jpg",
      amazonLink: "https://www.amazon.com/How-Not-Be-Shitty-Boss-ebook/dp/B0FFBDZXST/",
    },
    {
      title: "Integrating Cybersecurity and Counterintelligence",
      description: "A proof of concept on combining cybersecurity and counterintelligence to effectively counter foreign intelligence threats.",
      coverUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/0a768acb6_61bM7dBKeL_SL1500_.jpg",
      amazonLink: "https://www.amazon.com/Enhancing-National-Security-Cybersecurity-Counterintelligence-ebook/dp/B0FFBHJGLD/",
    },
    {
      title: "Building an Offensive Security Lab",
      description: "A step-by-step guide for creating a robust offensive security lab to train and equip enterprise cyber teams for real-world scenarios.",
      coverUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/304fdf4b1_71ha4eRNoeL_SL1500_.jpg",
      amazonLink: "https://www.amazon.com/Building-Offensive-Security-Enterprise-Cyber-ebook/dp/B0DFB89ZYK/",
    },
    {
      title: "Artificial Intelligence and Cybersecurity",
      description: "An exploration of how AI is transforming cybersecurity, enhancing threat detection, and shaping the future of digital security.",
      coverUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/09d8dd5c0_91aA0yAuOpL_SL1500_.jpg",
      amazonLink: "https://www.amazon.com/Artificial-Intelligence-Cybersecurity-Enhancing-Security-ebook/dp/B0C3NQMGRP/",
    }
  ];

  const toggleExpand = (index) => {
    playSlash();
    trackEvent("publication_expand");
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-6">
        {publications.map((book, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className="bg-ninja-surface shuriken-clip shuriken-stroke hover:ninja-glow transition-all duration-300 group cursor-pointer overflow-hidden"
                onClick={() => toggleExpand(index)}
              >
                <CardContent className="p-0">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-28 sm:w-32">
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover aspect-[2/3] rounded-l-xl" />
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-ninja-green transition-colors pr-2">
                          {book.title}
                        </h3>
                        <ChevronDown className={`w-5 h-5 text-ninja-green flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <BookOpen className="w-4 h-4 text-ninja-green/60" />
                        <span className="text-xs text-slate-400">
                          {isExpanded ? "Abstract revealed" : "Click to expand abstract"}
                        </span>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="text-foreground/80 mt-3 leading-relaxed text-sm border-t border-primary/20 pt-3">
                              <TerminalText text={book.description} speed={15} />
                            </p>
                            <Button
                              asChild
                              variant="outline"
                              className="mt-4 w-full border-ninja-green/40 text-ninja-green hover:bg-ninja-green/10 hover:text-ninja-green hover:border-ninja-green"
                            >
                              <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                View on Amazon <ExternalLink className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}