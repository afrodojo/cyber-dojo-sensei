
import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogSection() {
    const blogArticles = [
        {
            url: "https://blog.cyberdojosensai.org/f/effects-of-implementing-an-offensive-cybersecurity-program",
            title: "Effects of Implementing an Offensive Cybersecurity Program",
            description: "Discover the transformative impact of implementing offensive cybersecurity programs in modern organizations.",
            icon: "🎯"
        },
        {
            url: "https://blog.cyberdojosensai.org/f/the-impact-of-ai-on-cybersecurity-in-modern-society",
            title: "The Impact of AI on Cybersecurity in Modern Society",
            description: "Explore how artificial intelligence is revolutionizing cybersecurity practices and defense strategies.",
            icon: "🤖"
        },
        {
            url: "https://blog.cyberdojosensai.org/f/the-difference-between-anti-virus-software-and-mssps",
            title: "The Difference Between Anti-Virus Software and MSSPs",
            description: "Understanding the key differences between traditional antivirus and Managed Security Service Providers.",
            icon: "🛡️"
        },
        {
            url: "https://blog.cyberdojosensai.org/f/the-importance-of-cybersecurity-hygiene-for-smbs",
            title: "The Importance of Cybersecurity Hygiene for SMBs",
            description: "Essential cybersecurity practices for small and medium-sized businesses.",
            icon: "🧼"
        },
        {
            url: "https://blog.cyberdojosensai.org/f/stay-secure-with-mobile-devices",
            title: "Stay Secure with Mobile Devices",
            description: "Critical security measures for protecting your mobile devices from cyber threats.",
            icon: "📱"
        },
        {
            url: "https://blog.cyberdojosensai.org/f/security-operations-center-as-a-service",
            title: "Security Operations Center as-a-Service",
            description: "Benefits and implementation of SOC-as-a-Service solutions for advanced security monitoring.",
            icon: "👁️"
        }
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    From the Blog
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto mb-8" />
                <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    Insights and analysis from the frontlines of cybersecurity leadership and offensive operations.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogArticles.map((article, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full"
                    >
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="h-full block">
                            <Card className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-cyan-400/50 transition-all duration-300 h-full group flex flex-col">
                                <CardContent className="p-6 flex flex-col flex-grow">
                                    <div className="text-4xl mb-4">{article.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors flex-grow">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-400 mb-6 leading-relaxed text-sm">
                                        {article.description}
                                    </p>
                                    <div className="flex items-center text-cyan-400 font-semibold mt-auto">
                                        Read Article <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mt-16"
            >
                <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold"
                >
                    <a href="https://blog.cyberdojosensai.org" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Visit Full Blog
                    </a>
                </Button>
            </motion.div>
        </div>
    );
}
