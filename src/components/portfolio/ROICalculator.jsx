
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Shield, DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function ROICalculator() {
  const [inputs, setInputs] = useState({
    companySize: "",
    industry: "",
    currentSecuritySpend: 100000,
    hasBeenBreached: false,
    complianceRequired: false,
    riskTolerance: "medium"
  });
  
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const industryMultipliers = {
    "financial": 2.5,
    "healthcare": 2.2,
    "government": 2.0,
    "technology": 1.8,
    "manufacturing": 1.5,
    "retail": 1.6,
    "energy": 2.1,
    "other": 1.4
  };

  const companySizeMultipliers = {
    "startup": 0.8,
    "small": 1.0,
    "medium": 1.5,
    "large": 2.0,
    "enterprise": 3.0
  };

  const calculateROI = () => {
    const industryMultiplier = industryMultipliers[inputs.industry] || 1.4;
    const sizeMultiplier = companySizeMultipliers[inputs.companySize] || 1.0;
    
    // Base breach cost calculation
    const baseBreach = 4500000; // Average data breach cost
    const adjustedBreachCost = baseBreach * industryMultiplier * sizeMultiplier;
    
    // Risk reduction through red team services
    const riskReduction = 0.75; // 75% risk reduction
    const potentialSavings = adjustedBreachCost * riskReduction;
    
    // Service investment estimate
    const serviceInvestment = Math.max(50000, inputs.currentSecuritySpend * 0.15);
    
    // ROI calculation
    const roi = ((potentialSavings - serviceInvestment) / serviceInvestment) * 100;
    
    // Additional benefits
    const complianceSavings = inputs.complianceRequired ? 250000 : 0;
    const productivityGains = inputs.currentSecuritySpend * 0.1;
    const reputationProtection = adjustedBreachCost * 0.3;
    
    setResults({
      potentialBreachCost: adjustedBreachCost,
      serviceInvestment: serviceInvestment,
      potentialSavings: potentialSavings,
      roi: roi,
      complianceSavings: complianceSavings,
      productivityGains: productivityGains,
      reputationProtection: reputationProtection,
      totalBenefit: potentialSavings + complianceSavings + productivityGains
    });
    
    setShowResults(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
          Cybersecurity ROI Calculator
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Estimate the potential return on investment by preventing a single data breach with proactive cybersecurity services.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Calculator className="w-6 h-6 text-cyan-400" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company Size
                </label>
                <Select value={inputs.companySize} onValueChange={(value) => setInputs({...inputs, companySize: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                    <SelectItem value="small">Small Business (51-200 employees)</SelectItem>
                    <SelectItem value="medium">Medium Business (201-1000 employees)</SelectItem>
                    <SelectItem value="large">Large Enterprise (1001-5000 employees)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (5000+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Industry
                </label>
                <Select value={inputs.industry} onValueChange={(value) => setInputs({...inputs, industry: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial Services</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="government">Government/Defense</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail/E-commerce</SelectItem>
                    <SelectItem value="energy">Energy/Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Annual Security Spend: {formatCurrency(inputs.currentSecuritySpend)}
                </label>
                <Slider
                  value={[inputs.currentSecuritySpend]}
                  onValueChange={(value) => setInputs({...inputs, currentSecuritySpend: value[0]})}
                  min={25000}
                  max={2000000}
                  step={25000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>$25K</span>
                  <span>$2M</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={inputs.hasBeenBreached}
                    onChange={(e) => setInputs({...inputs, hasBeenBreached: e.target.checked})}
                    className="rounded"
                  />
                  Previously experienced a security incident
                </label>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={inputs.complianceRequired}
                    onChange={(e) => setInputs({...inputs, complianceRequired: e.target.checked})}
                    className="rounded"
                  />
                  Subject to compliance requirements (HIPAA, PCI-DSS, etc.)
                </label>
              </div>

              <Button 
                onClick={calculateROI}
                disabled={!inputs.companySize || !inputs.industry}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Calculate ROI
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {showResults && results ? (
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  ROI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-sm text-red-300 mb-1">Potential Breach Cost</div>
                    <div className="text-xl font-bold text-red-400">
                      {formatCurrency(results.potentialBreachCost)}
                    </div>
                  </div>

                  <div className="bg-green-950/30 border border-green-500/20 rounded-lg p-4 text-center">
                    <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-sm text-green-300 mb-1">Service Investment</div>
                    <div className="text-xl font-bold text-green-400">
                      {formatCurrency(results.serviceInvestment)}
                    </div>
                  </div>
                </div>

                {/* ROI Highlight */}
                <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-lg p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                  <div className="text-lg text-cyan-300 mb-2">Estimated ROI</div>
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {Math.round(results.roi)}%
                  </div>
                  <div className="text-sm text-slate-400">
                    Return on cybersecurity investment
                  </div>
                </div>

                {/* Benefits Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Potential Benefits:</h4>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-300">Breach Prevention Savings</span>
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(results.potentialSavings)}
                    </span>
                  </div>

                  {results.complianceSavings > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                      <span className="text-slate-300">Compliance Cost Savings</span>
                      <span className="text-green-400 font-semibold">
                        {formatCurrency(results.complianceSavings)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-300">Productivity Improvements</span>
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(results.productivityGains)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-300">Reputation Protection Value</span>
                    <span className="text-cyan-400 font-semibold">
                      {formatCurrency(results.reputationProtection)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 bg-green-950/20 px-4 rounded-lg mt-4">
                    <span className="text-white font-semibold">Total Estimated Benefit</span>
                    <span className="text-green-400 font-bold text-lg">
                      {formatCurrency(results.totalBenefit)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                  <p className="text-slate-300 text-sm mb-3">
                    Ready to protect your organization and realize these benefits?
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Your Custom Security Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/30 border-slate-700/50 h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Calculator className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  Complete the form to see your ROI
                </h3>
                <p className="text-slate-500">
                  Enter your organization details to calculate potential cybersecurity ROI
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <p className="text-xs text-slate-500 max-w-4xl mx-auto">
          * This calculator provides estimates based on industry averages and historical data. 
          Actual costs and savings may vary depending on specific circumstances, threat landscape, 
          and implementation details. For a detailed assessment tailored to your organization, 
          please contact us for a consultation.
        </p>
      </motion.div>
    </div>
  );
}
