import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Require admin authentication for syncing
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: admin access required' }, { status: 403 });
    }

    // Fetch courses from defense.eds-360.com training programs
    const defenseApiUrl = 'https://defense.eds-360.com/training-programs';
    const apiKey = Deno.env.get('DEFENSE_PLATFORM_API_KEY');
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(defenseApiUrl, { headers });
    
    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch from defense platform: ${response.status}` },
        { status: response.status }
      );
    }

    const courseData = await response.json();
    
    // Validate and normalize course data
    const courses = Array.isArray(courseData) ? courseData : courseData.courses || [];
    
    const normalizedCourses = courses.map(course => ({
      title: course.title || course.name || '',
      description: course.description || '',
      syllabus: course.syllabus || course.overview || '',
      duration: course.duration || '',
      format: course.format || 'In-Person',
      price: course.price || 0,
      category: course.category || course.track || 'General',
      image_url: course.image_url || course.image || '',
      registration_url: course.registration_url || course.checkout_url || '',
      last_updated: new Date().toISOString()
    }));

    // Store courses in a cache entity or database for real-time access
    // For now, return the courses directly
    return Response.json({
      success: true,
      courses_fetched: normalizedCourses.length,
      courses: normalizedCourses,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching defense platform courses:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});