import React from 'react';
import { ExternalLink, User, Clock, Rss } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BlogFeedList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <Rss className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No articles found. Click "Refresh" to pull in the latest posts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOwn = item.type === 'own' || item.source_type === 'own';
        return (
          <Card key={item.id} className="bg-slate-900 border-slate-800 hover:border-cyan-500/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={isOwn ? "default" : "secondary"} className={isOwn ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400"}>
                      {isOwn ? "Your Post" : item.source}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-white mb-1 hover:text-cyan-400 transition-colors">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.description && <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>}
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    {item.author && (
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.author}</span>
                    )}
                    {item.published_date && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{new Date(item.published_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 flex-shrink-0 mt-1">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}