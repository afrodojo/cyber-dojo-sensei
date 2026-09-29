import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const FEEDS = [
  { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/' },
  { name: 'Schneier on Security', url: 'https://www.schneier.com/feed/atom/' },
  { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },
  { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' },
  { name: 'The Register', url: 'https://www.theregister.com/security/headlines.atom' },
];

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function extractAttr(xml, tag, attr) {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim().substring(0, 400);
}

function parseFeed(xml, sourceName, feedUrl) {
  const items = [];

  const rssItems = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  for (const itemXml of rssItems) {
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link') || extractAttr(itemXml, 'link', 'href');
    const description = stripHtml(extractTag(itemXml, 'description'));
    const pubDate = extractTag(itemXml, 'pubDate');
    const author = extractTag(itemXml, 'dc:creator') || extractTag(itemXml, 'author') || sourceName;
    if (title && link) {
      items.push({ title, link, description, published_date: pubDate, author, source: sourceName, feed_url: feedUrl });
    }
  }

  if (items.length === 0) {
    const atomEntries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
    for (const entryXml of atomEntries) {
      const title = extractTag(entryXml, 'title');
      const link = extractAttr(entryXml, 'link', 'href');
      const description = stripHtml(extractTag(entryXml, 'summary') || extractTag(entryXml, 'content'));
      const pubDate = extractTag(entryXml, 'published') || extractTag(entryXml, 'updated');
      const author = extractTag(entryXml, 'name') || sourceName;
      if (title && link) {
        items.push({ title, link, description, published_date: pubDate, author, source: sourceName, feed_url: feedUrl });
      }
    }
  }

  return items;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let isScheduled = false;
    try {
      const body = await req.clone().json().catch(() => ({}));
      isScheduled = !!body?.automation;
    } catch (_) {}

    if (!isScheduled) {
      const user = await base44.auth.me().catch(() => null);
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }
    }

    const feedPromises = FEEDS.map(async (feed) => {
      try {
        const res = await fetch(feed.url, {
          headers: { 'User-Agent': 'CyberDojo-FeedBot/1.0' },
          signal: AbortSignal.timeout(10000)
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return parseFeed(xml, feed.name, feed.url);
      } catch (e) {
        return [];
      }
    });

    const feedResults = await Promise.all(feedPromises);
    const allItems = feedResults.flat();

    const existing = await base44.asServiceRole.entities.BlogFeedItem.list('-created_date', 500);
    const existingUrls = new Set(existing.map(i => i.url));

    const newItems = allItems.filter(i => i.link && !existingUrls.has(i.link));

    if (newItems.length > 0) {
      await base44.asServiceRole.entities.BlogFeedItem.bulkCreate(
        newItems.map(i => ({
          title: i.title,
          description: i.description,
          url: i.link,
          author: i.author,
          source: i.source,
          source_type: 'rss',
          published_date: i.published_date,
          feed_url: i.feed_url
        }))
      );
    }

    return Response.json({
      success: true,
      fetched: allItems.length,
      added: newItems.length,
      total: existing.length + newItems.length,
      sources: FEEDS.map(f => f.name)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});