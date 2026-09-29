import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown, MapPin, Phone, Mail, Shield, Target, Award, Building, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedCounter from "./AnimatedCounter";

export default function HeroSection({ scrollY, onScrollToNext }) {
  const headshotUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c6149b9a7_DI6A0794.jpg";
  const emergingDefenseLogo = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6887c5e144c3e560dc989c1b/2d8954477_1000002209.jpg";
  const cyberDojoLogo = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c2fde588f_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png";
  const mowDojoLogo = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6887c5e144c3e560dc989c1b/fc87df104_MowDojo.png";
  const heritageShieldLogo = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6887c5e144c3e560dc989c1b/cb7b15f2c_Exploreourgearat8.png";

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24 pb-12">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full"
        />
        
        {/* Additional animated elements */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/60 rounded-full"
          />
          <motion.div 
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full"
          />
          <motion.div 
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/50 rounded-full"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          
          {/* Enhanced Headshot Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 flex justify-center lg:order-last"
          >
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-full blur-2xl opacity-40"
              />
              <div className="absolute inset-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-xl opacity-30"></div>
              <motion.img 
                src={headshotUrl} 
                alt="Asaad Morman - Cybersecurity Expert & Business Owner" 
                className="relative w-full h-full object-cover rounded-full border-4 border-slate-700/50 shadow-2xl hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.02 }}
              />
            </div>
          </motion.div>

          {/* Enhanced Text Content */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-red-950/50 border border-red-500/30 rounded-full px-4 py-2 mb-6"
              >
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-red-300 font-medium">TS/SCI w/CI Polygraph</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3"
              >
                <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                  Cyber Dojo Sensei
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-xl md:text-2xl text-cyan-300 font-semibold mb-4"
              >
                Asaad Morman
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300 mb-4 max-w-4xl mx-auto lg:mx-0 leading-relaxed"
              >
                <span className="text-cyan-400 font-semibold">Doctoral Candidate</span>, Doctor of Applied Science in Computer Science • 
                <span className="text-violet-400 font-semibold"> Bowie State University</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-base md:text-lg text-slate-400 mb-8 max-w-4xl mx-auto lg:mx-0 leading-relaxed"
              >
                <span className="text-emerald-400 font-semibold">CEO of Emerging Defense Solutions (EDS)</span> • 
                <span className="text-cyan-400 font-semibold"> Former DARPA SETA</span> transitioning to USCYBERCOM • 
                <span className="text-violet-400 font-semibold"> Principal Investigator</span> — Applied AI, Zero-Trust Architectures &amp; Cybersecurity Defense • 
                <span className="text-green-400 font-semibold"> US Marine Veteran</span>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Transforming cybersecurity through <AnimatedCounter value="15" suffix="+" /> years of elite federal experience, 
                <AnimatedCounter value="7" /> years of Marine Corps leadership, and innovative business solutions that protect critical infrastructure.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-x-6 gap-y-3 mb-8"
            >
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>cyberdojosensei@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>657-658-5859</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Fredericksburg, VA</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('business')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Target className="w-5 h-5 mr-2" />
                Explore My Portfolio
              </Button>
            </motion.div>

            {/* EDS Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center lg:justify-start mb-8"
            >
              <a href="https://emergingdefensesolutions.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://media.base44.com/images/public/6887c5e144c3e560dc989c1b/be7571420_Screenshot2026-03-27212838.png"
                  alt="Emerging Defense Solutions"
                  className="w-40 h-40 object-contain hover:scale-105 transition-transform duration-300"
                />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Skill Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3 mt-16"
        >
          {[
            { text: "Business Owner", color: "bg-gradient-to-r from-green-500 to-emerald-600" },
            { text: "Red Team Expert", color: "bg-gradient-to-r from-red-500 to-pink-600" },
            { text: "Exploit Developer", color: "bg-gradient-to-r from-purple-500 to-indigo-600" },
            { text: "Marine Veteran", color: "bg-gradient-to-r from-yellow-500 to-orange-600" },
            { text: "Security Architect", color: "bg-gradient-to-r from-blue-500 to-cyan-600" }
          ].map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className={`${skill.color} text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}>
                {skill.text}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onScrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 hover:text-cyan-400 transition-colors group"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
        </motion.div>
      </motion.button>
    </div>
  );
}