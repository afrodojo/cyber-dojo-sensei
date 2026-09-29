
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Pricing() {
    const packages = [
        {
            name: "Security Consultation",
            price: "Custom",
            description: "Expert guidance for your security strategy, architecture, and compliance needs.",
            features: [
                "Security Architecture Review",
                "Compliance Gap Analysis (NIST, HIPAA, etc.)",
                "DevSecOps Strategy",
                "Virtual CISO Services"
            ],
            buttonText: "Request a Quote",
            featured: false,
        },
        {
            name: "Penetration Testing",
            price: "Starting at $15k",
            description: "Comprehensive penetration tests to identify and remediate vulnerabilities.",
            features: [
                "Network & Infrastructure Testing",
                "Web Application Assessment",
                "Cloud Security Assessment (AWS, Azure)",
                "Detailed Reporting & Remediation Plan"
            ],
            buttonText: "Scope Your Test",
            featured: true,
        },
        {
            name: "Red Team Operations",
            price: "Starting at $40k",
            description: "Simulate real-world adversary attacks to test your defense-in-depth.",
            features: [
                "Adversary Emulation (APT)",
                "Physical & Social Engineering",
                "Custom C2 Infrastructure",
                "Executive & Technical Debriefs"
            ],
            buttonText: "Plan an Operation",
            featured: false,
        }
    ];

    return (
        <div className="py-20 bg-slate-950">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Service Packages
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Transparent pricing for elite cybersecurity services. Custom packages are available to meet your specific needs.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="h-full"
                        >
                            <Card className={`h-full flex flex-col bg-slate-800/30 border-slate-700/50 transition-all duration-300 ${pkg.featured ? 'border-cyan-400/50 scale-105 shadow-cyan-500/10 shadow-lg' : 'hover:border-slate-600'}`}>
                                <CardContent className="p-8 flex flex-col flex-grow">
                                    {pkg.featured && (
                                        <div className="text-center mb-4">
                                            <span className="bg-cyan-500 text-white px-3 py-1 text-sm font-semibold rounded-full">Most Popular</span>
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold text-white text-center mb-2">{pkg.name}</h3>
                                    <p className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent pb-2">{pkg.price}</p>
                                    <p className="text-slate-400 text-center mb-8 min-h-[40px]">{pkg.description}</p>
                                    
                                    <div className="space-y-4 mb-8 flex-grow">
                                        {pkg.features.map(feature => (
                                            <div key={feature} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                                <span className="text-slate-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button asChild size="lg" className={`w-full mt-auto font-semibold ${pkg.featured ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                        <Link to={createPageUrl("Contact")}>
                                            {pkg.buttonText}
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
