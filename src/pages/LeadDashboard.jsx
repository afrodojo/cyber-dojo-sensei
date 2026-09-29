import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lead } from "@/entities/Lead";
import { User } from "@/entities/User";
import { TrendingUp, Users, Star, Eye, Search, Mail, Phone, Building, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function LeadDashboard() {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedLead, setSelectedLead] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            // Only allow access if user is admin or is Asaad
            if (currentUser.role === 'admin' || currentUser.email === 'AsaadMorman@gmail.com') {
                setIsAuthorized(true);
                loadLeads();
            }
        } catch (error) {
            setIsAuthorized(false);
        } finally {
            setLoading(false);
        }
    };

    const loadLeads = async () => {
        const allLeads = await Lead.list('-created_date');
        setLeads(allLeads);
        setFilteredLeads(allLeads);
    };

    useEffect(() => {
        let filtered = leads;

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter(lead => lead.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(lead => 
                lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredLeads(filtered);
    }, [leads, statusFilter, searchTerm]);

    const updateLeadStatus = async (leadId, newStatus) => {
        await Lead.update(leadId, { status: newStatus });
        loadLeads();
        setSelectedLead(null);
    };

    const getStatusColor = (status) => {
        const colors = {
            'new': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            'contacted': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            'qualified': 'bg-green-500/20 text-green-300 border-green-500/30',
            'proposal-sent': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            'closed-won': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            'closed-lost': 'bg-red-500/20 text-red-300 border-red-500/30'
        };
        return colors[status] || colors.new;
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        if (score >= 30) return 'text-orange-400';
        return 'text-red-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Card className="bg-slate-800/30 border-slate-700/50 p-8 text-center">
                    <CardContent>
                        <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
                        <p className="text-slate-400">This dashboard is only accessible to authorized users.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'new').length,
        qualified: leads.filter(l => l.status === 'qualified').length,
        avgScore: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length) : 0
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Lead Management Dashboard</h1>
                    <p className="text-slate-400">Track and manage your business inquiries</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="bg-slate-800/30 border-slate-700/50">
                            <CardContent className="p-6 text-center">
                                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{stats.total}</div>
                                <div className="text-sm text-slate-400">Total Leads</div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="bg-slate-800/30 border-slate-700/50">
                            <CardContent className="p-6 text-center">
                                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{stats.new}</div>
                                <div className="text-sm text-slate-400">New Leads</div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="bg-slate-800/30 border-slate-700/50">
                            <CardContent className="p-6 text-center">
                                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{stats.qualified}</div>
                                <div className="text-sm text-slate-400">Qualified</div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="bg-slate-800/30 border-slate-700/50">
                            <CardContent className="p-6 text-center">
                                <DollarSign className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{stats.avgScore}</div>
                                <div className="text-sm text-slate-400">Avg Score</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6"
                >
                    <Card className="bg-slate-800/30 border-slate-700/50">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search leads..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                                        />
                                    </div>
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="proposal-sent">Proposal Sent</SelectItem>
                                        <SelectItem value="closed-won">Closed Won</SelectItem>
                                        <SelectItem value="closed-lost">Closed Lost</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Leads Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="bg-slate-800/30 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white">Leads ({filteredLeads.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredLeads.map((lead, index) => (
                                    <motion.div
                                        key={lead.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-white">{lead.name}</h3>
                                                    <p className="text-sm text-slate-400">{lead.company || 'No company'}</p>
                                                </div>
                                                <Badge className={`${getStatusColor(lead.status)} border text-xs`}>
                                                    {lead.status?.replace('-', ' ') || 'new'}
                                                </Badge>
                                                <div className="text-right">
                                                    <div className={`text-lg font-bold ${getScoreColor(lead.score || 0)}`}>
                                                        {lead.score || 0}
                                                    </div>
                                                    <div className="text-xs text-slate-400">Score</div>
                                                </div>
                                            </div>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-slate-600 text-slate-300 hover:bg-slate-600"
                                                    onClick={() => setSelectedLead(lead)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl">{lead.name}</DialogTitle>
                                                </DialogHeader>
                                                {selectedLead && (
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-sm text-slate-400">Email</label>
                                                                <div className="flex items-center gap-2 text-white">
                                                                    <Mail className="w-4 h-4" />
                                                                    {selectedLead.email}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-sm text-slate-400">Phone</label>
                                                                <div className="flex items-center gap-2 text-white">
                                                                    <Phone className="w-4 h-4" />
                                                                    {selectedLead.phone || 'Not provided'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-sm text-slate-400">Company</label>
                                                                <div className="flex items-center gap-2 text-white">
                                                                    <Building className="w-4 h-4" />
                                                                    {selectedLead.company || 'Not provided'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-sm text-slate-400">Lead Score</label>
                                                                <div className={`text-lg font-bold ${getScoreColor(selectedLead.score || 0)}`}>
                                                                    {selectedLead.score || 0}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="text-sm text-slate-400">Message</label>
                                                            <div className="mt-1 p-3 bg-slate-700/50 rounded text-white">
                                                                {selectedLead.message}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-sm text-slate-400 mb-2 block">Update Status</label>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {['new', 'contacted', 'qualified', 'proposal-sent', 'closed-won', 'closed-lost'].map(status => (
                                                                    <Button
                                                                        key={status}
                                                                        size="sm"
                                                                        variant={selectedLead.status === status ? "default" : "outline"}
                                                                        onClick={() => updateLeadStatus(selectedLead.id, status)}
                                                                        className={selectedLead.status === status ? "bg-cyan-600" : "border-slate-600 text-slate-300 hover:bg-slate-600"}
                                                                    >
                                                                        {status.replace('-', ' ')}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </motion.div>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <div className="text-center py-8 text-slate-400">
                                        No leads found matching your criteria.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}