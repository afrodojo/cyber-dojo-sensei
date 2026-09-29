import React from "react";
import { motion } from "framer-motion";
import { Building, Shield, Users, Target, Zap, Award, TrendingUp, Globe, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BusinessVentures() {
  const businesses = [
    {
      name: "Emerging Defense Solutions",
      url: "https://emergingdefensesolutions.com",
      role: "Co-Founder & CEO",
      description: "A unified S-Corporation serving as the strategic headquarters for a connected universe of mission-driven companies across cybersecurity, defensive training, property care, and sustainable agriculture. Founded by Asaad and Shauntze Morman.",
      services: [
        "Corporate Strategy & Governance",
        "Cybersecurity & IT Consulting (EDS Cyber)",
        "Firearms, CPR & Executive Protection (EDS Defense)",
        "Mobile Notary & Process Server (EDS NPS)",
        "Veteran-Owned Enterprise Leadership"
      ],
      logo: "https://www.google.com/s2/favicons?sz=128&domain=emergingdefensesolutions.com",
      icon: Building,
      color: "from-indigo-500 to-purple-600",
      established: "2020",
      activeDate: "Nov 2026 – Present"
    },
    {
      name: "Mow Dojo",
      url: "https://mowdojo.eds-360.com",
      role: "Co-Founder",
      description: "Veteran and family-owned lawn care and home services company delivering precision cuts with warrior results. Combining military discipline with cutting-edge AI technology to provide elite lawn care services.",
      services: [
        "Precision Lawn Mowing",
        "Edging & Trimming",
        "Seasonal Yard Prep",
        "Gutter Cleaning",
        "Snow Removal"
      ],
      logo: "https://www.google.com/s2/favicons?sz=128&domain=mowdojo.eds-360.com",
      icon: Leaf,
      color: "from-lime-500 to-green-600",
      established: "2025"
    },
    {
      name: "Clucking Chickenz",
      role: "Co-Founder",
      description: "Sustainable agriculture division bringing farm-fresh eggs and heritage breed chickens to the community. Powered by Havenstead for family farm management.",
      services: [
        "Farm Fresh Pasture-Raised Eggs",
        "Heritage Breed Chickens & Chicks",
        "Egg Subscription Delivery",
        "Sustainable Poultry Products",
        "Community Agriculture Education"
      ],
      logo: null,
      logoEmoji: "🐔",
      icon: Leaf,
      color: "from-amber-500 to-orange-600",
      established: "2025"
    }
  ];

  const achievements = [
    { icon: Building, value: "3", label: "Active Companies", color: "text-green-400" },
    { icon: Users, value: "500+", label: "Professionals Trained", color: "text-blue-400" },
    { icon: Globe, value: "50+", label: "Enterprise Clients", color: "text-purple-400" },
    { icon: TrendingUp, value: "95%", label: "Client Satisfaction", color: "text-cyan-400" }
  ];

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
          Business Leadership
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-6">
          Co-Founder & CEO of{' '}
          <a 
            href="https://emergingdefensesolutions.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
          >
            Emerging Defense Solutions
          </a>
          , a unified S-Corporation operating multiple mission-driven divisions across cybersecurity, defensive training, notary services, and property care.
        </p>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Transforming communities through innovative business solutions, combining
          <span className="text-green-400 font-semibold"> entrepreneurial vision</span>
          {' '}with{' '}
          <span className="text-cyan-400 font-semibold">elite tactical expertise</span>
          {' '}to protect organizations and develop the next generation of security professionals.
        </p>
      </motion.div>

      {/* EDS Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex justify-center mb-16"
      >
        <a href="https://emergingdefensesolutions.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://media.base44.com/images/public/6887c5e144c3e560dc989c1b/be7571420_Screenshot2026-03-27212838.png"
            alt="Emerging Defense Solutions"
            className="w-72 h-72 md:w-96 md:h-96 object-contain hover:scale-105 transition-transform duration-300"
          />
        </a>
      </motion.div>

      {/* Leadership Philosophy */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card className="bg-slate-900/50 border-slate-800/50 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-2">
                Strategic Leadership & Tactical Excellence
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-cyan-500 mx-auto mb-6" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3 pb-1">Tactical Innovation</h4>
                <p className="text-slate-300 leading-relaxed">
                  Developing cutting-edge tactical methodologies and training programs that prepare 
                  security professionals for real-world cyber threats and scenarios.
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3 pb-1">Veteran Empowerment</h4>
                <p className="text-slate-300 leading-relaxed">
                  Leveraging military experience to build strong teams and develop talent, 
                  especially supporting fellow veterans transitioning into cybersecurity careers.
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3 pb-1">Operational Excellence</h4>
                <p className="text-slate-300 leading-relaxed">
                  Maintaining the highest standards of tactical training and operational readiness, 
                  combining Marine Corps discipline with advanced cybersecurity expertise.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}