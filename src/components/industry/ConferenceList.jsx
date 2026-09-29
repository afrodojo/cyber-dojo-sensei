import React from 'react';
import { Calendar, MapPin, ExternalLink, Building2, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ConferenceList({ conferences }) {
  if (!conferences || conferences.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No conferences found yet. Click "Refresh" to pull in upcoming events.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {conferences.map((conf) => (
        <Card key={conf.id} className="bg-slate-900 border-slate-800 hover:border-cyan-500/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg text-white leading-tight">{conf.name}</CardTitle>
              {conf.virtual && (
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                  <Video className="w-3 h-3 mr-1" /> Virtual
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {conf.description && <p className="text-sm text-slate-400 line-clamp-3">{conf.description}</p>}
            <div className="space-y-1.5 text-sm">
              {conf.start_date && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  {conf.start_date}{conf.end_date && conf.end_date !== conf.start_date ? ` – ${conf.end_date}` : ''}
                </div>
              )}
              {conf.location && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  {conf.location}
                </div>
              )}
              {conf.organizer && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  {conf.organizer}
                </div>
              )}
            </div>
            {conf.url && (
              <Button asChild variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                <a href={conf.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Visit Site
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}