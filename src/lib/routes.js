// Centralized route & link configuration
// All navigation paths are defined here — no placeholders or dead links.

export const PHD_SENSEI_URL = 'https://phdsensei.eda-360.com';

export const ROUTES = {
  HOME: '/',
  BUSINESS: '/business',
  CAREER: '/career',
  INSTITUTIONS: '/institutions',
  KNOWLEDGE: '/knowledge',
  RESEARCH: '/research',
  CYBER_DOJO: '/cyber-dojo',
  CYBER_DOJO_BLOG: '/cyber-dojo/blog',
};

// Primary navigation items — used by header, mobile nav, and homepage router
export const PRIMARY_NAV = [
  { label: 'Home', path: ROUTES.HOME, sector: null },
  { label: 'Business Solutions', path: ROUTES.BUSINESS, sector: 'business' },
  { label: 'Career Accelerator', path: ROUTES.CAREER, sector: 'career' },
  { label: 'Institutional Partnerships', path: ROUTES.INSTITUTIONS, sector: 'education' },
  { label: 'Research & PhD', path: ROUTES.RESEARCH, sector: 'education' },
  { label: 'Knowledge Hub', path: ROUTES.KNOWLEDGE, sector: 'general' },
];

// Sector labels for display
export const SECTOR_LABELS = {
  business: 'Business',
  career: 'Career Seeker',
  education: 'Education',
  general: 'Knowledge',
};