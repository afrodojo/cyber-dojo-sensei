import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER = 'asaadmorman-bit';
const REPO = 'cyberdojosensei';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = Deno.env.get('GitHub');
    if (!token) {
      return Response.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'CyberDojo-App',
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return Response.json({ error: err.message || 'GitHub API error' }, { status: response.status });
    }

    const commits = await response.json();

    const simplified = commits.map((c) => ({
      sha: c.sha,
      shortSha: c.sha.slice(0, 7),
      message: c.commit.message,
      author: c.commit.author.name,
      authorEmail: c.commit.author.email,
      date: c.commit.author.date,
      url: c.html_url,
      avatarUrl: c.author?.avatar_url || null,
      authorLogin: c.author?.login || null,
    }));

    return Response.json({ commits: simplified, repo: `${OWNER}/${REPO}` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});