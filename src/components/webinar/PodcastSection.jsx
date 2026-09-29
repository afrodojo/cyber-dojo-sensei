import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Headphones, ExternalLink, Users } from 'lucide-react';

export default function PodcastSection() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Headphones className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 pb-2">
          Shield and Signal Podcast
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A podcast hosted by Asaad and Shauntze Morman exploring cybersecurity, threat intelligence, and tactical excellence.
        </p>
      </div>

      <Card className="bg-slate-800/30 border-slate-700/50">
        <CardContent className="p-12 text-center">
          <p className="text-slate-300 text-lg">Coming Soon</p>
          <p className="text-slate-400 mt-2">Episodes launching in 2026</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}