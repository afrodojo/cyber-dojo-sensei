
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SecurityAssessment } from "@/entities/SecurityAssessment";
import { Shield, CheckCircle2, AlertTriangle, XCircle, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SecurityAssessmentTool() {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessment, setAssessment] = useState({
    company_name: "",
    contact_email: "",
    contact_name: "",
    industry: "",
    employee_count: "",
    security_budget: "",
    current_security_tools: [],
    biggest_concern: "",
    last_assessment: "",
    compliance_requirements: []
  });
  const [results, setResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: "basic_info",
      title: "Basic Information",
      fields: [
        { key: "company_name", label: "Company Name", type: "input", required: true },
        { key: "contact_name", label: "Your Name", type: "input", required: true },
        { key: "contact_email", label: "Email Address", type: "email", required: true },
        { key: "industry", label: "Industry", type: "input", required: false }
      ]
    },
    {
      id: "company_size",
      title: "Company Details",
      fields: [
        { 
          key: "employee_count", 
          label: "Number of Employees", 
          type: "select", 
          options: ["1-50", "51-200", "201-500", "501-1000", "1000+"],
          required: true 
        },
        { 
          key: "security_budget", 
          label: "Annual Security Budget", 
          type: "select", 
          options: ["under-50k", "50k-100k", "100k-250k", "250k-500k", "500k+"],
          required: false 
        }
      ]
    },
    {
      id: "security_current",
      title: "Current Security Posture",
      fields: [
        { key: "biggest_concern", label: "What's your biggest security concern?", type: "textarea", required: true },
        { 
          key: "last_assessment", 
          label: "When was your last security assessment?", 
          type: "select", 
          options: ["never", "1-year", "2-years", "3+ years"],
          required: true 
        }
      ]
    }
  ];

  const calculateSecurityScore = (data) => {
    let score = 100;
    
    // Deduct points based on risk factors
    if (data.last_assessment === "never") score -= 30;
    else if (data.last_assessment === "3+ years") score -= 20;
    else if (data.last_assessment === "2-years") score -= 10;
    
    if (data.security_budget === "under-50k") score -= 15;
    else if (data.security_budget === "50k-100k") score -= 10;
    
    if (data.employee_count === "1000+") score -= 15; // Large companies have more attack surface
    else if (data.employee_count === "501-1000") score -= 10;
    
    // Additional deductions based on concerns
    if (data.biggest_concern?.toLowerCase().includes("ransomware")) score -= 10;
    if (data.biggest_concern?.toLowerCase().includes("phishing")) score -= 8;
    if (data.biggest_concern?.toLowerCase().includes("insider")) score -= 12;
    
    return Math.max(score, 20); // Minimum score of 20
  };

  const generateRecommendations = (data, score) => {
    const recommendations = [];
    
    if (data.last_assessment === "never" || data.last_assessment === "3+ years") {
      recommendations.push("Conduct immediate comprehensive security assessment");
    }
    
    if (score < 50) {
      recommendations.push("Implement advanced threat detection and response capabilities");
      recommendations.push("Establish incident response procedures and team");
    }
    
    if (score < 70) {
      recommendations.push("Enhance employee security awareness training");
      recommendations.push("Review and update security policies");
    }
    
    if (data.employee_count === "1000+" || data.employee_count === "501-1000") {
      recommendations.push("Consider red team exercises to test security controls");
    }
    
    recommendations.push("Regular security monitoring and threat hunting");
    recommendations.push("Backup and disaster recovery planning");
    
    return recommendations;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const score = calculateSecurityScore(assessment);
    const recommendations = generateRecommendations(assessment, score);
    
    const assessmentData = {
      ...assessment,
      calculated_score: score,
      recommendations: recommendations
    };
    
    try {
      await SecurityAssessment.create(assessmentData);
      setResults({ score, recommendations });
    } catch (error) {
      console.error("Error saving assessment:", error);
      setResults({ score, recommendations });
    }
    
    setIsSubmitting(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return CheckCircle2;
    if (score >= 60) return Shield;
    if (score >= 40) return AlertTriangle;
    return XCircle;
  };

  if (results) {
    const ScoreIcon = getScoreIcon(results.score);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-700/50 rounded-full flex items-center justify-center">
              <ScoreIcon className={`w-10 h-10 ${getScoreColor(results.score)}`} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 pb-2">Security Assessment Complete</h3>
            <div className={`text-4xl font-bold mb-6 ${getScoreColor(results.score)}`}>
              {results.score}/100
            </div>
            
            <div className="text-left mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Recommendations:</h4>
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              onClick={() => window.location.href = '/Contact'}
            >
              Get Professional Assessment
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{currentQuestion.title}</h3>
          <span className="text-slate-400">Step {currentStep + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="bg-slate-800/30 border-slate-700/50">
        <CardContent className="p-8">
          <div className="space-y-6">
            {currentQuestion.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                
                {field.type === "input" && (
                  <Input
                    value={assessment[field.key] || ""}
                    onChange={(e) => setAssessment({...assessment, [field.key]: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                )}
                
                {field.type === "email" && (
                  <Input
                    type="email"
                    value={assessment[field.key] || ""}
                    onChange={(e) => setAssessment({...assessment, [field.key]: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                )}
                
                {field.type === "textarea" && (
                  <Textarea
                    value={assessment[field.key] || ""}
                    onChange={(e) => setAssessment({...assessment, [field.key]: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white h-24"
                  />
                )}
                
                {field.type === "select" && (
                  <Select
                    value={assessment[field.key] || ""}
                    onValueChange={(value) => setAssessment({...assessment, [field.key]: value})}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              {currentStep === questions.length - 1 ? 
                (isSubmitting ? "Calculating..." : "Get Results") : 
                "Next"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
