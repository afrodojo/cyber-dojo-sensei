import React, { useEffect, useState } from "react";
import { SITE_URL } from "@/components/seo/SEOHead";
import { base44 } from "@/api/base44Client";
import { Download, FileCode, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.9", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
  { path: "/webinars", priority: "0.7", changefreq: "weekly" },
  { path: "/partners", priority: "0.6", changefreq: "monthly" },
  { path: "/capability-statement", priority: "0.8", changefreq: "monthly" },
  { path: "/security-assessment", priority: "0.7", changefreq: "monthly" },
  { path: "/executive-briefings", priority: "0.7", changefreq: "monthly" },
  { path: "/referral-program", priority: "0.6", changefreq: "monthly" },
  { path: "/publications", priority: "0.7", changefreq: "monthly" },
];

export default function Sitemap() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xml, setXml] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const posts = await base44.entities.BlogPost.filter({ published: true }, "-created_date", 200);
        setBlogPosts(posts);
        generateXML(posts);
      } catch { generateXML([]); }
      setLoading(false);
    };
    load();
  }, []);

  const generateXML = (posts) => {
    const today = new Date().toISOString().split("T")[0];
    const urls = [
      ...STATIC_PAGES.map(p => `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`),
      ...posts.map(p => `  <url>\n    <loc>${SITE_URL}/blog/${p.id}</loc>\n    <lastmod>${(p.updated_date || p.created_date || today).split("T")[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`)
    ];
    setXml(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`);
  };

  const downloadXML = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([xml], { type: "application/xml" }));
    a.download = "sitemap.xml";
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileCode className="w-8 h-8 text-cyan-400" /> Sitemap Generator
            </h1>
            <p className="text-slate-400 mt-1">{STATIC_PAGES.length} static pages + {blogPosts.length} blog posts</p>
          </div>
          <button onClick={downloadXML} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg text-sm transition-all">
            <Download className="w-4 h-4" /> Download sitemap.xml
          </button>
        </div>

        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardHeader><CardTitle className="text-white text-base">sitemap.xml Preview</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
            ) : (
              <pre className="bg-slate-900 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                {xml}
              </pre>
            )}
          </CardContent>
        </Card>

        <p className="text-slate-500 text-sm mt-4 text-center">
          Submit this file to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google Search Console</a> and <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Bing Webmaster Tools</a> to improve indexing.
        </p>
      </div>
    </div>
  );
}