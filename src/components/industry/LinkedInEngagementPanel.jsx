import React from 'react';
import { MessageCircle, Send, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LinkedInEngagementPanel({ onEngage, loading, results }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageCircle className="w-5 h-5 text-cyan-400" />
          LinkedIn Comment Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-400">
          Automatically reads comments on your published LinkedIn posts and generates AI-powered replies to engage with your audience. Each comment is replied to only once.
        </p>
        <Button onClick={onEngage} disabled={loading} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Engaging...</> : <><Send className="w-4 h-4 mr-2" />Engage Comments Now</>}
        </Button>

        {results?.error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{results.error}</span>
          </div>
        )}

        {results && !results.error && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{results.postsProcessed || 0}</p>
                <p className="text-xs text-slate-400">Posts Processed</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{results.commentsFound || 0}</p>
                <p className="text-xs text-slate-400">Comments Found</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-cyan-400">{results.repliesPosted || 0}</p>
                <p className="text-xs text-slate-400">Replies Posted</p>
              </div>
            </div>

            {results.details && results.details.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.details.slice(0, 30).map((d, i) => (
                  <div key={i} className="bg-slate-800/30 rounded-lg p-3 text-sm">
                    {d.error ? (
                      <p className="text-red-400 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{d.error}</span>
                      </p>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          {d.status === 'replied'
                            ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                          <span className="font-medium text-slate-300">{d.commenter || 'Unknown'}</span>
                        </div>
                        <p className="text-slate-500 text-xs">Comment: {d.comment}</p>
                        {d.reply && <p className="text-cyan-400/70 text-xs mt-1">Reply: {d.reply}</p>}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}