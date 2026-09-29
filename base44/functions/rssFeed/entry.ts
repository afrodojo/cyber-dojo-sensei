import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const DOJO_CATEGORIES = ["hands-on-tutorials", "writeups", "coding-projects"];

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const posts = await base44.asServiceRole.entities.BlogPost.list('-created_date', 20);
    const published = posts.filter(p => p.published !== false && DOJO_CATEGORIES.includes(p.category));

    const appUrl = Deno.env.get("BASE44_APP_URL") || "https://apps.base44.com";
    const siteUrl = appUrl.replace(/\/$/, "");
    const blogUrl = `${siteUrl}/cyber-dojo/blog`;
    const selfUrl = `${siteUrl}/api/functions/rssFeed`;

    const items = published.map(p => {
      const link = `${blogUrl}?id=${p.id}`;
      const title = escapeXml(p.title || "Untitled");
      const desc = escapeXml(p.excerpt || "");
      const pubDate = p.created_date ? new Date(p.created_date).toUTCString() : new Date().toUTCString();
      const cats = [p.category, ...(p.tags || [])].filter(Boolean).map(escapeXml);
      const catTags = cats.map(c => `      <category>${c}</category>`).join("\n");
      return `    <item>
      <title>${title}</title>
      <link>${escapeXml(link)}</link>
      <description>${desc}</description>
      <content:encoded><![CDATA[${p.content || p.excerpt || ""}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${escapeXml(p.id)}</guid>
${catTags}
    </item>`;
    }).join("\n");

    const lastBuild = new Date().toUTCString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Cyber Dojo Sensei — afrodojo Tech Blog</title>
    <link>${escapeXml(blogUrl)}</link>
    <description>Hands-on tutorials, security writeups, and coding projects from afrodojo — security engineer, researcher, and mentor.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600',
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});