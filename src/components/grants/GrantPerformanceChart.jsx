import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function GrantPerformanceChart({ grants }) {
  // Calculate funding by sponsor
  const fundingBySponsor = useMemo(() => {
    const sponsorMap = {};
    
    grants.forEach(grant => {
      if (!sponsorMap[grant.provider]) {
        sponsorMap[grant.provider] = 0;
      }
      if (typeof grant.amount === 'number') {
        sponsorMap[grant.provider] += grant.amount;
      }
    });

    return Object.entries(sponsorMap)
      .map(([provider, amount]) => ({
        provider: provider.length > 20 ? provider.substring(0, 17) + '...' : provider,
        amount: Math.round(amount / 1000), // Convert to thousands for readability
        fullProvider: provider
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8); // Top 8 sponsors
  }, [grants]);

  // Calculate upcoming deadlines for next 6 months
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    const sixMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
    
    const deadlineMap = {};
    
    grants.forEach(grant => {
      const deadline = new Date(grant.deadline);
      
      if (deadline >= today && deadline <= sixMonthsFromNow) {
        const monthKey = deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        
        if (!deadlineMap[monthKey]) {
          deadlineMap[monthKey] = 0;
        }
        deadlineMap[monthKey]++;
      }
    });

    // Create array with all months
    const result = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      result.push({
        month: monthKey,
        count: deadlineMap[monthKey] || 0
      });
    }
    
    return result;
  }, [grants]);

  // Calculate total funding and grant count
  const stats = useMemo(() => {
    const total = grants.reduce((sum, grant) => sum + (typeof grant.amount === 'number' ? grant.amount : 0), 0);
    return {
      totalFunding: total,
      grantCount: grants.length,
      avgFunding: grants.length > 0 ? Math.round(total / grants.length) : 0
    };
  }, [grants]);

  if (!grants || grants.length === 0) {
    return (
      <div className="text-center py-12 text-foreground/60">
        <p>No grant data available for charts.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-8 mb-12"
    >
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card border border-primary/30 rounded-lg p-6 shuriken-clip-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm mb-1">Total Funding</p>
              <p className="text-2xl font-bold text-primary">
                ${(stats.totalFunding / 1000000).toFixed(1)}M
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/50" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card border border-primary/30 rounded-lg p-6 shuriken-clip-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm mb-1">Active Grants</p>
              <p className="text-2xl font-bold text-primary">{stats.grantCount}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/50" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card border border-primary/30 rounded-lg p-6 shuriken-clip-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm mb-1">Average Funding</p>
              <p className="text-2xl font-bold text-primary">
                ${(stats.avgFunding / 1000).toFixed(0)}k
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/50" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Funding by Sponsor Bar Chart */}
        <motion.div
          whileHover={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' }}
          className="bg-card border border-primary/30 rounded-lg p-6 shuriken-clip-sm transition-all"
        >
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Funding Sponsors
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fundingBySponsor}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
              <XAxis dataKey="provider" stroke="rgba(255, 255, 255, 0.5)" fontSize={12} />
              <YAxis stroke="rgba(255, 255, 255, 0.5)" label={{ value: 'Amount ($k)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(26, 29, 38, 0.95)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  borderRadius: '6px',
                  padding: '8px'
                }}
                labelStyle={{ color: '#00ffff' }}
                formatter={(value) => `$${value}k`}
              />
              <Bar dataKey="amount" fill="hsl(180, 100%, 50%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Deadlines Timeline */}
        <motion.div
          whileHover={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' }}
          className="bg-card border border-primary/30 rounded-lg p-6 shuriken-clip-sm transition-all"
        >
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Upcoming Deadlines (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={upcomingDeadlines}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
              <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.5)" fontSize={12} />
              <YAxis stroke="rgba(255, 255, 255, 0.5)" label={{ value: 'Number of Grants', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(26, 29, 38, 0.95)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  borderRadius: '6px',
                  padding: '8px'
                }}
                labelStyle={{ color: '#00ffff' }}
                formatter={(value) => `${value} grant(s)`}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(180, 100%, 50%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(180, 100%, 50%)', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}