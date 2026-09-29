import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/entities/User";
import { Webinar } from "@/entities/Webinar";
import { Button } from "@/components/ui/button";
import { Mic, Plus, ServerCrash } from "lucide-react";
import WebinarForm from "../components/webinar/WebinarForm";
import WebinarCard from "../components/webinar/WebinarCard";
import PodcastSection from "../components/webinar/PodcastSection";
import { isFuture, isPast, parseISO } from 'date-fns';

export default function WebinarsPage() {
  const [webinars, setWebinars] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetchWebinars = async () => {
      setLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      }
      
      try {
        const fetchedWebinars = await Webinar.list('-date');
        setWebinars(fetchedWebinars);
      } catch (error) {
        console.error("Failed to fetch webinars:", error);
        setWebinars([]);
      }
      setLoading(false);
    };

    checkUserAndFetchWebinars();
  }, []);

  const handleFormSubmit = async (webinarData) => {
    await Webinar.create(webinarData);
    setShowForm(false);
    const fetchedWebinars = await Webinar.list('-date');
    setWebinars(fetchedWebinars);
  };
  
  const today = new Date();
  const upcomingWebinars = webinars.filter(w => isFuture(parseISO(w.date)));
  const pastWebinars = webinars.filter(w => isPast(parseISO(w.date)));

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent pb-2">
            Webinars & Live Training
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Join live sessions to learn about the latest in offensive security, threat intelligence, and cybersecurity leadership.
          </p>
        </motion.div>

        {/* Podcast Section */}
        <PodcastSection />

        {currentUser?.role === 'admin' && (
          <div className="text-center mb-12">
            <Button onClick={() => setShowForm(!showForm)} size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              {showForm ? "Cancel" : "Add New Webinar"}
            </Button>
          </div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <WebinarForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {loading ? (
            <div className="text-center text-slate-400">Loading webinars...</div>
        ) : (
          <>
            {/* Upcoming Webinars */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-purple-500 pl-4 pb-2">Upcoming Webinars</h2>
              {upcomingWebinars.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingWebinars.map(webinar => <WebinarCard key={webinar.id} webinar={webinar} />)}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-900/50 rounded-lg">
                  <ServerCrash className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white pb-2">No Upcoming Webinars</h3>
                  <p className="text-slate-400">New training sessions are being planned. Please check back soon!</p>
                </div>
              )}
            </div>

            {/* Past Webinars */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-slate-600 pl-4 pb-2">Past Webinars</h2>
              {pastWebinars.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastWebinars.map(webinar => <WebinarCard key={webinar.id} webinar={webinar} />)}
                </div>
              ) : (
                 <div className="text-center py-16 bg-slate-900/50 rounded-lg">
                  <ServerCrash className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white pb-2">No Past Webinars</h3>
                  <p className="text-slate-400">The archive of past webinars will appear here.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}