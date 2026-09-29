import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, BookOpen } from 'lucide-react';
import { playSlash } from '@/lib/ninjaSounds';
import { trackEvent } from '@/lib/stealthAnalytics';
import { base44 } from '@/api/base44Client';

// Sample course data structure - will be replaced with live API data
const SAMPLE_COURSES = [
  {
    title: 'Babysitter CPR Bootcamp (Ages 12-17)',
    description: 'CPR certification for babysitters and youth instructors.',
    syllabus: 'Hands-on CPR training for babysitters and caregivers of youth ages 12-17.',
    duration: '4 hours',
    format: 'In-Person',
    price: 40,
    category: 'Certification',
    image_url: 'https://images.unsplash.com/photo-1576091160550-112173f31446?w=500&h=300&fit=crop',
    registration_url: 'https://defense.eds-360.com/training-programs'
  },
  {
    title: 'Heartsaver First-Aid CPR AED Training Certification',
    description: 'First-aid and CPR/AED certification training.',
    syllabus: 'American Heart Association Heartsaver First-Aid CPR AED certification course.',
    duration: '4 hours',
    format: 'In-Person',
    price: 50,
    category: 'Certification',
    image_url: 'https://images.unsplash.com/photo-1576091160550-112173f31446?w=500&h=300&fit=crop',
    registration_url: 'https://defense.eds-360.com/training-programs'
  },
  {
    title: 'Basic Life Support (BLS) CPR Certification Course',
    description: 'Professional BLS certification for healthcare providers.',
    syllabus: 'Comprehensive Basic Life Support training and certification.',
    duration: '4 hours',
    format: 'In-Person',
    price: 110,
    category: 'Certification',
    image_url: 'https://images.unsplash.com/photo-1576091160550-112173f31446?w=500&h=300&fit=crop',
    registration_url: 'https://defense.eds-360.com/training-programs'
  },
  {
    title: 'Basic Pistol & Firearms Safety Course - Virginia',
    description: 'Foundational firearms safety and pistol handling.',
    syllabus: 'Virginia-compliant pistol and firearms safety training.',
    duration: '5 hours',
    format: 'In-Person',
    price: 95,
    category: 'Firearms',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f2?w=500&h=300&fit=crop',
    registration_url: 'https://defense.eds-360.com/training-programs'
  },
  {
    title: 'Virginia Concealed Carry Certification Course',
    description: 'Concealed carry certification for Virginia residents.',
    syllabus: 'Virginia concealed carry permit training and certification.',
    duration: '5 hours',
    format: 'In-Person',
    price: 125,
    category: 'Firearms',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f2?w=500&h=300&fit=crop',
    registration_url: 'https://defense.eds-360.com/training-programs'
  },
  {
    title: 'District of Columbia Concealed Carry Certification Course',
    description: 'Concealed carry certification for DC residents.',
    syllabus: 'District of Columbia concealed carry permit training and certification.',
    duration: '5 hours',
    format: 'In-Person',
    price: 150,
    category: 'Firearms',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f2?w=500&h=300&fit=crop',
    registration_url: 'https://defense.eds-360.com/training-programs'
  },
  {
    title: 'Maryland Handgun Qualification License (HQL) Course',
    description: 'HQL certification for Maryland handgun purchases.',
    syllabus: 'Maryland-required Handgun Qualification License training.',
    duration: '5 hours',
    format: 'In-Person',
    price: 95,
    category: 'Firearms',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f2?w=500&h=300&fit=crop',
    registration_url: 'https://defense.eds-360.com/training-programs'
  },
  {
    title: 'Maryland Wear & Carry Permit Certification Course',
    description: 'Maryland wear and carry permit training.',
    syllabus: 'Maryland Wear and Carry Permit certification training.',
    duration: '5 hours',
    format: 'In-Person',
    price: 150,
    category: 'Firearms',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f2?w=500&h=300&fit=crop',
    registration_url: 'https://defense.eds-360.com/training-programs'
  },
  {
    title: 'Live Fire Pistol Shooting Course (Range Training)',
    description: 'Hands-on live fire pistol training at a range.',
    syllabus: 'Professional range training and live fire pistol techniques.',
    duration: '1 hour per session',
    format: 'In-Person',
    price: 75,
    category: 'Firearms',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f2?w=500&h=300&fit=crop',
    registration_url: 'https://defense.eds-360.com/training-programs'
  },
];

export default function TrainingCatalog() {
  const [courses, setCourses] = useState(SAMPLE_COURSES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load courses from Course entity (managed via Admin Dashboard)
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const entityCourses = await base44.entities.Course.filter({ is_active: true }, "display_order", 50);
        if (entityCourses && entityCourses.length > 0) {
          setCourses(entityCourses);
        }
      } catch (error) {
        console.log('Using sample courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(courses.map(c => c.category))];
  
  // Filter courses by category
  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const handleCourseInteraction = (courseTitle) => {
    playSlash();
    trackEvent('training_course_view', { course: courseTitle });
  };

  return (
    <div className="min-h-screen bg-ninja-void ninja-grid pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-ninja-green" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Training Catalog
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Expert-led cybersecurity training courses from Emerging Defense Solutions.
            Master offensive and defensive security techniques through hands-on instruction.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                playSlash();
                trackEvent('training_category_filter', { category });
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-ninja-green text-ninja-void shuriken-clip ninja-pulse-glow'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-ninja-green hover:text-ninja-green'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Course Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={`${course.title}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onHoverStart={() => handleCourseInteraction(course.title)}
                onClick={() => setExpandedCourse(expandedCourse === index ? null : index)}
                className="group cursor-pointer"
              >
                {/* Course Card */}
                <motion.div
                  className={`h-full bg-ninja-surface border-2 border-slate-700 rounded-lg overflow-hidden transition-all duration-300 shuriken-clip-sm ${
                    expandedCourse === index ? 'border-ninja-green ninja-pulse-glow' : 'group-hover:border-ninja-green/50'
                  }`}
                  style={{
                    boxShadow: expandedCourse === index ? '0 0 20px rgba(0, 255, 255, 0.4)' : 'none'
                  }}
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-800">
                    {course.image_url && (
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ninja-void via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-ninja-green text-ninja-void px-3 py-1 rounded-full text-xs font-bold">
                      {course.format}
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-ninja-green mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Category */}
                    <span className="text-xs text-slate-400 mb-3 uppercase tracking-wider">
                      {course.category}
                    </span>

                    {/* Description */}
                    <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Duration & Price */}
                    <div className="flex justify-between items-center mb-4 mt-auto">
                      <div className="text-xs text-slate-400">
                        <div className="font-semibold text-slate-200">{course.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-ninja-green">
                          {course.price_label || `$${course.price?.toLocaleString()}`}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.a
                      href={course.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackEvent('training_register_click', { course: course.title });
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-ninja-green/10 border border-ninja-green text-ninja-green font-semibold rounded-lg hover:bg-ninja-green hover:text-ninja-void transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Register
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </motion.div>

                {/* Expanded Details Overlay */}
                <AnimatePresence>
                  {expandedCourse === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 top-full mt-2 bg-ninja-surface border border-ninja-green/50 rounded-lg p-4 shuriken-clip-sm max-h-64 overflow-y-auto"
                    >
                      <h4 className="text-sm font-bold text-ninja-green mb-2">Syllabus</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {course.syllabus}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-ninja-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-400 text-lg">
              No courses available in this category. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}