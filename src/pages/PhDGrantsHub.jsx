import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import GrantCard from "@/components/grants/GrantCard";
import GrantPerformanceChart from "@/components/grants/GrantPerformanceChart";
import SEOHead from "@/components/seo/SEOHead";

export default function PhDGrantsHub() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [filterAmount, setFilterAmount] = useState("all");

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        setLoading(true);
        const data = await base44.entities.PhDGrant.filter({ is_active: true }, "-created_date");
        setGrants(data);
      } catch (error) {
        console.error("Error fetching grants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
    const unsubscribe = base44.entities.PhDGrant.subscribe(() => {
      fetchGrants();
    });

    return unsubscribe;
  }, []);

  const getFilteredAndSorted = () => {
    let filtered = grants.filter((grant) => {
      const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (grant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesAmount = filterAmount === "all" ||
        (filterAmount === "0-25k" && grant.amount <= 25000) ||
        (filterAmount === "25-50k" && grant.amount > 25000 && grant.amount <= 50000) ||
        (filterAmount === "50-100k" && grant.amount > 50000 && grant.amount <= 100000) ||
        (filterAmount === "100k+" && grant.amount > 100000);

      return matchesSearch && matchesAmount;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sortBy === "amount-high") {
        return b.amount - a.amount;
      } else if (sortBy === "amount-low") {
        return a.amount - b.amount;
      }
      return 0;
    });
  };

  const sorted = getFilteredAndSorted();

  return (
    <>
      <SEOHead
        title="PhD Funding & Grants Hub | Asaad Morman"
        description="Active PhD grants, fellowships, and funding opportunities for cybersecurity research and education."
        ogImage="https://media.base44.com/images/public/default.jpg"
      />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-black text-primary mb-4 tracking-tight">
            Scrolls of Opportunity
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Active PhD Grants & Research Funding curated by AI agents and updated in real-time
          </p>
        </motion.div>

        {/* Performance Charts */}
        {!loading && grants.length > 0 && (
          <GrantPerformanceChart grants={grants} />
        )}

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search grants by title, provider, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-primary/40 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-foreground/60" />
              <select
                value={filterAmount}
                onChange={(e) => setFilterAmount(e.target.value)}
                className="px-3 py-2 bg-card border border-primary/40 rounded-lg text-foreground focus:outline-none focus:border-primary text-sm"
              >
                <option value="all">All Funding Amounts</option>
                <option value="0-25k">$0 - $25k</option>
                <option value="25-50k">$25k - $50k</option>
                <option value="50-100k">$50k - $100k</option>
                <option value="100k+">$100k+</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-foreground/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-card border border-primary/40 rounded-lg text-foreground focus:outline-none focus:border-primary text-sm"
              >
                <option value="deadline">Closest Deadline</option>
                <option value="amount-high">Highest Funding First</option>
                <option value="amount-low">Lowest Funding First</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Grants Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground/60">Loading grants...</p>
          </div>
        ) : sorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-card/30 rounded-lg border border-primary/20 shuriken-clip"
          >
            <p className="text-foreground/60 text-lg">No grants match your criteria. Try adjusting your filters.</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid gap-6"
          >
            {sorted.map((grant) => {
              const today = new Date();
              const deadlineDate = new Date(grant.deadline);
              const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
              const isDeadlineSoon = daysLeft < 30 && daysLeft > 0;

              return (
                <GrantCard
                  key={grant.id}
                  grant={grant}
                  isDeadlineSoon={isDeadlineSoon}
                />
              );
            })}
          </motion.div>
        )}

        {/* Result Count */}
        {!loading && sorted.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-foreground/50 text-sm mt-8"
          >
            Showing {sorted.length} of {grants.length} active grants
          </motion.p>
        )}
      </main>
    </>
  );
}