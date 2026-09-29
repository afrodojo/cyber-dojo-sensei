import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "@/entities/User";
import { Shield, FileText, MessageSquare, Download, Calendar, AlertCircle, CheckCircle2, Clock, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function ClientPortal() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        checkClientAccess();
    }, []);

    const checkClientAccess = async () => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            
            // Check if user has client role or is in client list
            // For demo purposes, we'll check if user has a custom field indicating client status
            if (currentUser.client_access === true || currentUser.role === 'client') {
                setIsClient(true);
            }
        } catch (error) {
            setIsClient(false);
        } finally {
            setLoading(false);
        }
    };

    // Mock data for demonstration
    const projectData = {
        name: "Red Team Assessment - Q1 2024",
        status: "in-progress",
        progress: 65,
        startDate: "2024-01-15",
        endDate: "2024-03-15",
        nextMilestone: "Phase 2 Testing",
        vulnerabilities: {
            critical: 3,
            high: 7,
            medium: 12,
            low: 8
        }
    };

    const documents = [
        {
            id: 1,
            name: "Initial Assessment Report",
            type: "report",
            date: "2024-01-20",
            status: "completed",
            size: "2.4 MB"
        },
        {
            id: 2,
            name: "Vulnerability Details",
            type: "technical",
            date: "2024-02-01",
            status: "completed",
            size: "1.8 MB"
        },
        {
            id: 3,
            name: "Remediation Plan",
            type: "plan",
            date: "2024-02-15",
            status: "in-progress",
            size: "1.2 MB"
        }
    ];

    const messages = [
        {
            id: 1,
            from: "Asaad Morman",
            subject: "Project Update - Week 6",
            date: "2024-02-14",
            read: false,
            preview: "Completed network reconnaissance phase. Moving to exploitation testing..."
        },
        {
            id: 2,
            from: "Asaad Morman",
            subject: "Critical Vulnerability Identified",
            date: "2024-02-10",
            read: true,
            preview: "We've identified a critical SQL injection vulnerability in your web application..."
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!isClient) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Card className="bg-slate-800/30 border-slate-700/50 p-8 text-center max-w-md">
                    <CardContent>
                        <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-4">Client Access Required</h2>
                        <p className="text-slate-400 mb-6">
                            This portal is exclusively for active cybersecurity consulting clients. 
                            If you're a client and experiencing access issues, please contact support.
                        </p>
                        <Button 
                            onClick={() => window.location.href = 'mailto:AsaadMorman@gmail.com'}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        >
                            Contact Support
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Client Portal</h1>
                            <p className="text-slate-400">Welcome back, {user?.full_name}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-400">Current Project</div>
                            <div className="text-lg font-semibold text-white">{projectData.name}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Project Status Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Card className="bg-slate-800/30 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Shield className="w-5 h-5 text-cyan-400" />
                                Project Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Progress</div>
                                    <div className="flex items-center gap-3">
                                        <Progress value={projectData.progress} className="flex-1" />
                                        <span className="text-cyan-400 font-semibold">{projectData.progress}%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Status</div>
                                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                        In Progress
                                    </Badge>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Next Milestone</div>
                                    <div className="text-white font-semibold">{projectData.nextMilestone}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">End Date</div>
                                    <div className="text-white font-semibold">
                                        {new Date(projectData.endDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Tabs defaultValue="dashboard" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4 bg-slate-800/30">
                            <TabsTrigger value="dashboard" className="data-[state=active]:bg-cyan-600">
                                Dashboard
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="data-[state=active]:bg-cyan-600">
                                Documents
                            </TabsTrigger>
                            <TabsTrigger value="messages" className="data-[state=active]:bg-cyan-600">
                                Messages
                            </TabsTrigger>
                            <TabsTrigger value="schedule" className="data-[state=active]:bg-cyan-600">
                                Schedule
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="dashboard" className="space-y-6">
                            {/* Vulnerability Summary */}
                            <Card className="bg-slate-800/30 border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Security Findings Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-red-950/30 border border-red-500/20 rounded-lg">
                                            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-red-400">{projectData.vulnerabilities.critical}</div>
                                            <div className="text-sm text-red-300">Critical</div>
                                        </div>
                                        <div className="text-center p-4 bg-orange-950/30 border border-orange-500/20 rounded-lg">
                                            <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-orange-400">{projectData.vulnerabilities.high}</div>
                                            <div className="text-sm text-orange-300">High</div>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-950/30 border border-yellow-500/20 rounded-lg">
                                            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-yellow-400">{projectData.vulnerabilities.medium}</div>
                                            <div className="text-sm text-yellow-300">Medium</div>
                                        </div>
                                        <div className="text-center p-4 bg-blue-950/30 border border-blue-500/20 rounded-lg">
                                            <CheckCircle2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-blue-400">{projectData.vulnerabilities.low}</div>
                                            <div className="text-sm text-blue-300">Low</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="bg-slate-800/30 border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                                            <div>
                                                <div className="text-white font-medium">Network Reconnaissance Completed</div>
                                                <div className="text-sm text-slate-400">February 12, 2024</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                                            <div>
                                                <div className="text-white font-medium">Critical SQL Injection Found</div>
                                                <div className="text-sm text-slate-400">February 10, 2024</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                                            <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
                                            <div>
                                                <div className="text-white font-medium">Initial Report Delivered</div>
                                                <div className="text-sm text-slate-400">February 1, 2024</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-6">
                            <Card className="bg-slate-800/30 border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Project Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {documents.map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-6 h-6 text-blue-400" />
                                                    <div>
                                                        <div className="text-white font-medium">{doc.name}</div>
                                                        <div className="text-sm text-slate-400">
                                                            {new Date(doc.date).toLocaleDateString()} • {doc.size}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className={doc.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}>
                                                        {doc.status}
                                                    </Badge>
                                                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-600">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="messages" className="space-y-6">
                            <Card className="bg-slate-800/30 border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Secure Messages</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {messages.map((message) => (
                                            <div key={message.id} className={`p-4 rounded-lg border ${message.read ? 'bg-slate-700/20 border-slate-600' : 'bg-blue-950/20 border-blue-500/30'}`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                                                        <span className="font-medium text-white">{message.from}</span>
                                                        {!message.read && (
                                                            <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-slate-400">{new Date(message.date).toLocaleDateString()}</span>
                                                </div>
                                                <h4 className="font-semibold text-white mb-2">{message.subject}</h4>
                                                <p className="text-slate-300 text-sm">{message.preview}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="schedule" className="space-y-6">
                            <Card className="bg-slate-800/30 border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Upcoming Meetings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-white mb-2">No Upcoming Meetings</h3>
                                        <p className="text-slate-400 mb-4">Schedule a meeting with your security consultant</p>
                                        <Button 
                                            onClick={() => window.open('https://calendly.com/asaad-morman', '_blank')}
                                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                                        >
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Schedule Meeting
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}