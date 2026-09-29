import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaseStudy } from "@/entities/CaseStudy";
import { 
  Shield, Target, Lock, Building, Award, ArrowRight, 
  Filter, Grid3X3, List, Search, Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CaseStudyModal from "./CaseStudyModal";

const categories = [
  { id: "all", label: "All Projects", icon: Grid3X3 },
  { id: "red-team", label: "Red Team", icon: Target },
  { id: "penetration-testing", label: "Pen Testing", icon: Lock },
  { id: "security-architecture", label: "Architecture", icon: Building },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "incident-response", label: "Incident Response", icon: Award }
];

const categoryColors = {
  "red-team": "from-red-500 to-pink-600",
  "penetration-testing": "from-orange-500 to-amber-600",
  "compliance": "from-blue-500 to-cyan-600",
  "incident-response": "from-purple-500 to-indigo-600",
  "security-architecture": "from-green-500 to-emerald-600"
};

export default function ProjectGallery() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [filteredStudies, setFilteredStudies] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const studies = await CaseStudy.list('-created_date');
        // Remove duplicates based on title
        const uniqueStudies = studies.reduce((acc, study) => {
          if (!acc.find(s => s.title === study.title)) {
            acc.push(study);
          }
          return acc;
        }, []);
        setCaseStudies(uniqueStudies);
        setFilteredStudies(uniqueStudies);
      } catch (error) {
        console.error("Error fetching case studies:", error);
        setCaseStudies([]);
        setFilteredStudies([]);
      }
    };
    fetchCaseStudies();
  }, []);

  useEffect(() => {
    let result = caseStudies;
    
    // Filter by category
    if (activeFilter !== "all") {
      result = result.filter(study => study.category === activeFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(study => 
        study.title?.toLowerCase().includes(query) ||
        study.client?.toLowerCase().includes(query) ||
        study.challenge?.toLowerCase().includes(query)
      );
    }
    
    setFilteredStudies(result);
  }, [activeFilter, searchQuery, caseStudies]);

  const handleOpenCase = (study) => {
    setSelectedCase(study);
    setIsModalOpen(true);
  };

  const featuredStudies = filteredStudies.filter(s => s.featured);
  const regularStudies = filteredStudies.filter(s => !s.featured);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
          Project Portfolio
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Real-world security challenges solved through advanced offensive cybersecurity expertise
        </p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-cyan-600" : "border-slate-600 text-slate-300"}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-cyan-600" : "border-slate-600 text-slate-300"}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeFilter === cat.id;
            return (
              <Button
                key={cat.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(cat.id)}
                className={`${
                  isActive 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0" 
                    : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Results Count */}
      <div className="text-slate-400 text-sm mb-6">
        Showing {filteredStudies.length} project{filteredStudies.length !== 1 ? 's' : ''}
        {activeFilter !== "all" && ` in ${categories.find(c => c.id === activeFilter)?.label}`}
      </div>

      {/* Featured Projects */}
      {featuredStudies.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Featured Case Studies
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {featuredStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    className="bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group overflow-hidden h-full"
                    onClick={() => handleOpenCase(study)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${categoryColors[study.category] || "from-cyan-500 to-blue-600"}`} />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[study.category] || "from-cyan-500 to-blue-600"} rounded-lg flex items-center justify-center`}>
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-1">
                              Featured
                            </Badge>
                            <p className="text-slate-400 text-sm">{study.client}</p>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                        {study.title}
                      </h4>
                      
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {study.challenge}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {study.risk_reduction && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {study.risk_reduction} Risk Reduction
                          </Badge>
                        )}
                        {study.potential_savings && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            {study.potential_savings} Savings
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300">
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Case Study
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Regular Projects */}
      {regularStudies.length > 0 && (
        <div>
          {featuredStudies.length > 0 && (
            <h3 className="text-xl font-bold text-white mb-6">All Projects</h3>
          )}
          
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {regularStudies.map((study, index) => (
                  <motion.div
                    key={study.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      className="bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group h-full"
                      onClick={() => handleOpenCase(study)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 bg-gradient-to-br ${categoryColors[study.category] || "from-cyan-500 to-blue-600"} rounded-lg flex items-center justify-center`}>
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 capitalize">
                            {study.category?.replace("-", " ")}
                          </Badge>
                        </div>
                        
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {study.title}
                        </h4>
                        
                        <p className="text-slate-500 text-sm mb-3">{study.client}</p>
                        
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                          {study.challenge}
                        </p>

                        <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {regularStudies.map((study, index) => (
                  <motion.div
                    key={study.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      className="bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleOpenCase(study)}
                    >
                      <CardContent className="p-5 flex items-center gap-6">
                        <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[study.category] || "from-cyan-500 to-blue-600"} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {study.title}
                            </h4>
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 capitalize flex-shrink-0">
                              {study.category?.replace("-", " ")}
                            </Badge>
                          </div>
                          <p className="text-slate-500 text-sm">{study.client}</p>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          {study.risk_reduction && (
                            <div className="text-center hidden md:block">
                              <div className="text-green-400 font-bold">{study.risk_reduction}</div>
                              <div className="text-slate-500 text-xs">Risk Reduction</div>
                            </div>
                          )}
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredStudies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Filter className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
          <p className="text-slate-400">Try adjusting your filters or search query</p>
          <Button 
            variant="outline" 
            className="mt-4 border-slate-600 text-slate-300"
            onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
          >
            Clear Filters
          </Button>
        </motion.div>
      )}

      {/* Modal */}
      <CaseStudyModal 
        caseStudy={selectedCase} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}