import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { getGitHubCommits } from '@/functions/getGitHubCommits';
import { Button } from '@/components/ui/button';
import { GitCommit, ExternalLink, RefreshCw, Github, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const CONNECTOR_ID = '69ed28f97f067570c44d9347';

export default function CommitHistory() {
  const [user, setUser] = useState(null);
  const [commits, setCommits] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [repo, setRepo] = useState('');

  const fetchCommits = async () => {
    try {
      const res = await getGitHubCommits({});
      setCommits(res.data.commits);
      setRepo(res.data.repo);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  };

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        await fetchCommits();
      }
      setLoading(false);
    });
  }, []);

  const handleConnect = async () => {
    const url = await base44.connectors.connectAppUser(CONNECTOR_ID);
    const popup = window.open(url, '_blank');
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        fetchCommits();
      }
    }, 500);
  };

  const handleDisconnect = async () => {
    await base44.connectors.disconnectAppUser(CONNECTOR_ID);
    setConnected(false);
    setCommits([]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCommits();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-slate-400 mb-4">You must be signed in to view commit history.</p>
          <Button onClick={() => base44.auth.redirectToLogin()} className="bg-gradient-to-r from-cyan-500 to-blue-600">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-1">
                <Github className="w-8 h-8 text-cyan-400" />
                Project Hardening — Commit History
              </h1>
              {repo && <p className="text-slate-400 text-sm">{repo}</p>}
            </div>
            <div className="flex items-center gap-2">
              {connected && (
                <>
                  <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button onClick={handleDisconnect} variant="outline" size="sm" className="border-red-800 text-red-400 hover:bg-red-950">
                    Disconnect GitHub
                  </Button>
                </>
              )}
              {!connected && (
                <Button onClick={handleConnect} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Github className="w-4 h-4 mr-2" />
                  Connect GitHub
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Not connected state */}
        {!connected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
            <Github className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your GitHub Account</h3>
            <p className="text-slate-400 mb-6">Authorize GitHub to view recent commit history for the project hardening repository.</p>
            <Button onClick={handleConnect} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              <Github className="w-4 h-4 mr-2" />
              Connect GitHub
            </Button>
          </motion.div>
        )}

        {/* Commit list */}
        {connected && commits.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {commits.map((commit, idx) => (
              <motion.div
                key={commit.sha}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {commit.avatarUrl ? (
                    <img src={commit.avatarUrl} alt={commit.author} className="w-9 h-9 rounded-full flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <GitCommit className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium leading-snug line-clamp-2 mb-1">
                      {commit.message.split('\n')[0]}
                    </p>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-slate-400">
                      <span className="text-cyan-400 font-mono">{commit.shortSha}</span>
                      <span>{commit.authorLogin || commit.author}</span>
                      <span>{formatDistanceToNow(new Date(commit.date), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-cyan-400 transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {connected && commits.length === 0 && !refreshing && (
          <div className="text-center py-16 text-slate-400">
            <GitCommit className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No commits found in this repository.</p>
          </div>
        )}
      </div>
    </div>
  );
}