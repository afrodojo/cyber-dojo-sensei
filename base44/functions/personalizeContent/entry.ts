import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { session_id, page_context } = await req.json();

    if (!session_id) {
      return Response.json({ error: 'session_id required' }, { status: 400 });
    }

    // Get or create user preference
    let userPref = await base44.entities.UserPreference.filter({ session_id }).then(r => r[0]);

    if (!userPref) {
      userPref = await base44.entities.UserPreference.create({
        session_id,
        interests: [],
        interest_scores: JSON.stringify({}),
        pages_visited: page_context?.current_page ? [page_context.current_page] : [],
        time_on_pages: JSON.stringify({}),
        content_interactions: JSON.stringify({}),
        preferred_categories: [],
        personalization_enabled: true,
        last_activity: new Date().toISOString()
      });
    }

    // Parse stored data
    const interestScores = JSON.parse(userPref.interest_scores || '{}');
    const contentInteractions = JSON.parse(userPref.content_interactions || '{}');
    const timeOnPages = JSON.parse(userPref.time_on_pages || '{}');

    // Update activity
    if (page_context?.current_page) {
      const pagesVisited = new Set(userPref.pages_visited || []);
      pagesVisited.add(page_context.current_page);
      
      timeOnPages[page_context.current_page] = (timeOnPages[page_context.current_page] || 0) + (page_context.time_spent || 0);
    }

    // Track interactions (clicks on content)
    if (page_context?.interaction_type && page_context?.interaction_id) {
      const key = `${page_context.interaction_type}:${page_context.interaction_id}`;
      contentInteractions[key] = (contentInteractions[key] || 0) + 1;
    }

    // Infer interests from pages visited and interactions
    const inferredInterests = inferInterests(userPref.pages_visited || [], contentInteractions, interestScores);

    // Get personalized recommendations
    const blogPosts = await base44.entities.BlogPost.list('-created_date', 50).catch(() => []);
    const caseStudies = await base44.entities.CaseStudy.list('-created_date', 50).catch(() => []);
    const webinars = await base44.entities.Webinar.list('-created_date', 20).catch(() => []);

    const recommendations = {
      featured_blog_posts: scoreAndRank(blogPosts, inferredInterests, 'category', 3),
      featured_case_studies: scoreAndRank(caseStudies, inferredInterests, 'category', 3),
      recommended_webinars: scoreAndRank(webinars, inferredInterests, 'topics', 2),
      inferred_interests: Object.entries(inferredInterests)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([interest, score]) => ({ interest, confidence: score }))
    };

    // Update user preference
    await base44.entities.UserPreference.update(userPref.id, {
      pages_visited: Array.from(new Set(userPref.pages_visited || []).add(page_context?.current_page)).filter(Boolean),
      time_on_pages: JSON.stringify(timeOnPages),
      content_interactions: JSON.stringify(contentInteractions),
      interest_scores: JSON.stringify(inferredInterests),
      preferred_categories: Object.entries(inferredInterests)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([interest]) => interest),
      last_activity: new Date().toISOString()
    });

    return Response.json({
      user_pref_id: userPref.id,
      recommendations,
      session_id
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function inferInterests(pagesVisited, contentInteractions, currentScores) {
  const interests = { ...currentScores };

  // Map pages to interests
  const pageInterestMap = {
    'Services': ['penetration-testing', 'security-consulting', 'red-team'],
    'Blog': ['technical', 'leadership', 'threat-intelligence'],
    'Publications': ['research', 'technical', 'threat-intelligence'],
    'Webinars': ['training', 'leadership', 'technical'],
    'CaseStudies': ['penetration-testing', 'red-team', 'compliance'],
    'ExecutiveBriefings': ['compliance', 'business', 'leadership'],
    'SecurityAssessment': ['compliance', 'security-consulting', 'penetration-testing']
  };

  // Score based on pages visited
  pagesVisited.forEach(page => {
    const relatedInterests = pageInterestMap[page] || [];
    relatedInterests.forEach(interest => {
      interests[interest] = (interests[interest] || 0) + 0.1;
    });
  });

  // Score based on content interactions
  Object.entries(contentInteractions).forEach(([key, count]) => {
    const [type, id] = key.split(':');
    // Weight interactions by type
    const weight = type === 'blog_post' ? 0.05 : type === 'case_study' ? 0.15 : 0.08;
    
    // Distribute interaction weight across related interests
    const baseInterests = ['penetration-testing', 'red-team', 'security-consulting', 'compliance'];
    baseInterests.forEach(interest => {
      interests[interest] = (interests[interest] || 0) + (weight * count);
    });
  });

  // Normalize scores to 0-1
  const maxScore = Math.max(...Object.values(interests), 1);
  Object.keys(interests).forEach(key => {
    interests[key] = Math.min(interests[key] / maxScore, 1);
  });

  return interests;
}

function scoreAndRank(items, interests, categoryField, limit) {
  const scored = items.map(item => {
    let score = 0;
    
    // Match categories with interests
    const categories = Array.isArray(item[categoryField]) ? item[categoryField] : [item[categoryField]];
    categories.forEach(cat => {
      if (interests[cat]) {
        score += interests[cat];
      }
    });

    // Featured items get boost
    if (item.featured) {
      score += 0.2;
    }

    return { ...item, personalization_score: score };
  });

  return scored
    .sort((a, b) => b.personalization_score - a.personalization_score)
    .slice(0, limit);
}