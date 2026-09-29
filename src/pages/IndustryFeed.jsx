import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { RefreshCw, Calendar, Rss, Linkedin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConferenceList from '@/components/industry/ConferenceList';
import BlogFeedList from '@/components/industry/BlogFeedList';
import LinkedInEngagementPanel from '@/components/industry/LinkedInEngagementPanel';
import { fetchConferences } from '@/functions/fetchConferences';
import { fetchBlogFeed } from '@/functions/fetchBlogFeed';
import { engageLinkedInComments } from '@/functions/engageLinkedInComments';

export default function IndustryFeed() {
  const [conferences, setConferences] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [ownPosts, setOwnPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshingConfs, setRefreshingConfs] = useState(false);
  const [refreshingBlogs, setRefreshingBlogs] = useState(false);
  const [engaging, setEngaging] = useState(false);
  const [engagementResults, setEngagementResults] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [confs, feeds, posts, authed] = await Promise.all([
        base44.entities.Conference.list('-start_date', 50).catch(() => []),
        base44.entities.BlogFeedItem.list('-created_date', 50).catch(() => []),
        base44.entities.BlogPost.filter({ published: true }, '-created_date', 20).catch(() => []),
        base44.auth.isAuthenticated().catch(() => false)
      ]);
      setConferences(confs || []);
      setFeedItems(feeds || []);
      setOwnPosts(posts || []);
      if (authed) {
        const me = await base44.auth.me().catch(() => null);
        setIsAdmin(me?.role === 'admin');
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefreshConferences = async () => {
    setRefreshingConfs(true);
    try {
      const res = await fetchConferences({});
      if (res.data?.success) {
        const confs = await base44.entities.Conference.list('-start_date', 50);
        setConferences(confs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshingConfs(false);
    }
  };

  const handleRefreshBlogs = async () => {
    setRefreshingBlogs(true);
    try {
      const res = await fetchBlogFeed({});
      if (res.data?.success) {
        const feeds = await base44.entities.BlogFeedItem.list('-created_date', 50);
        setFeedItems(feeds || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshingBlogs(false);
    }
  };

  const handleEngageLinkedIn = async () => {
    setEngaging(true);
    setEngagementResults(null);
    try {
      const res = await engageLinkedInComments({});
      setEngagementResults(res.data);
    } catch (e) {
      setEngagementResults({ error: e.response?.data?.error || e.message });
    } finally {
      setEngaging(false);
    }
  };

  const mergedFeed = [
    ...feedItems.map(i => ({ ...i, type: 'external' })),
    ...ownPosts.map(p => ({
      ...p,
      type: 'own',
      url: `/BlogPostDetail?id=${p.id}`,
      source: 'Your Blog',
      description: p.excerpt,
      published_date: p.created_date,
      author: ''
    }))
  ].sort((a, b) => {
    const da = new Date(a.published_date || a.created_date || 0);
    const db = new Date(b.published_date || b.created_date || 0);
    return db - da;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Industry Feed</h1>
          <p className="text-slate-400">Conferences, cybersecurity blogs, and LinkedIn engagement in one place.</p>
        </div>

        <Tabs defaultValue="conferences" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="conferences" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <Calendar className="w-4 h-4 mr-2" /> Conferences
            </TabsTrigger>
            <TabsTrigger value="blogs" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <Rss className="w-4 h-4 mr-2" /> Blog Feed
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="linkedin" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
                <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="conferences" className="mt-6">
            {isAdmin && (
              <div className="mb-4 flex justify-end">
                <Button onClick={handleRefreshConferences} disabled={refreshingConfs} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  {refreshingConfs
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Fetching...</>
                    : <><RefreshCw className="w-4 h-4 mr-2" />Refresh Conferences</>}
                </Button>
              </div>
            )}
            <ConferenceList conferences={conferences} />
          </TabsContent>

          <TabsContent value="blogs" className="mt-6">
            {isAdmin && (
              <div className="mb-4 flex justify-end">
                <Button onClick={handleRefreshBlogs} disabled={refreshingBlogs} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  {refreshingBlogs
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Fetching...</>
                    : <><RefreshCw className="w-4 h-4 mr-2" />Refresh Feed</>}
                </Button>
              </div>
            )}
            <BlogFeedList items={mergedFeed} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="linkedin" className="mt-6">
              <LinkedInEngagementPanel onEngage={handleEngageLinkedIn} loading={engaging} results={engagementResults} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}