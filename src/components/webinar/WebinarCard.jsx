import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, ExternalLink, Video } from 'lucide-react';
import { format, parseISO, isFuture } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import WebinarRegistrationForm from './WebinarRegistrationForm';

export default function WebinarCard({ webinar }) {
  const [showRegistration, setShowRegistration] = useState(false);
  const isUpcoming = isFuture(parseISO(webinar.date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Card className={`bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 h-full group flex flex-col ${isUpcoming ? 'hover:border-purple-500/50' : 'opacity-70'}`}>
        <CardHeader className="p-6 pb-4"> {/* Added padding to header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors pb-2">
                {webinar.title}
              </h3>
              <Badge variant={isUpcoming ? "default" : "secondary"} className={isUpcoming ? 'bg-purple-600/80' : 'bg-slate-600/80'}>
                {isUpcoming ? 'Upcoming' : 'Completed'}
              </Badge>
            </div>
            <div className="w-14 h-14 bg-slate-700/50 rounded-lg flex flex-col items-center justify-center ml-4 flex-shrink-0">
              <div className="text-xs text-slate-400 uppercase">{format(parseISO(webinar.date), 'MMM')}</div>
              <div className="text-2xl font-bold text-white">{format(parseISO(webinar.date), 'dd')}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2 flex flex-col flex-grow"> {/* Adjusted padding-top for content */}
          <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow">{webinar.description}</p>
          
          <div className="space-y-3 text-sm mb-6">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{format(parseISO(webinar.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>{webinar.time} ({webinar.duration})</span>
            </div>
            {webinar.max_attendees > 0 && (
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Up to {webinar.max_attendees} attendees</span>
              </div>
            )}
          </div>
          
          {webinar.topics && webinar.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {webinar.topics.map((topic, index) => (
                <Badge key={index} variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs border-slate-600">
                  {topic}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-auto">
            {isUpcoming ? (
              <Button 
                onClick={() => setShowRegistration(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold"
              >
                Register Now <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            ) : webinar.meeting_link ? (
              <Button asChild variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                <a href={webinar.meeting_link} target="_blank" rel="noopener noreferrer">
                  Watch Recording <Video className="w-4 h-4 ml-2" />
                </a>
              </Button>
            ) : (
               <Button disabled className="w-full">Registration Opening Soon</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registration Dialog */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">{webinar.title}</DialogTitle>
          </DialogHeader>
          <WebinarRegistrationForm 
            webinar={webinar} 
            onClose={() => setShowRegistration(false)}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}