/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import AgentChatPage from './pages/AgentChatPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Blog from './pages/Blog';
import BlogAdmin from './pages/BlogAdmin';
import BlogManager from './pages/BlogManager';
import BlogPost from './pages/BlogPost';
import BlogPostDetail from './pages/BlogPostDetail';
import CRMIntegration from './pages/CRMIntegration';
import CalendarSync from './pages/CalendarSync';
import CapabilityStatement from './pages/CapabilityStatement';
import CaseStudyDetail from './pages/CaseStudyDetail';
import ClientPortal from './pages/ClientPortal';
import Contact from './pages/Contact';
import CyberBulletins from './pages/CyberBulletins';
import EmailFollowUp from './pages/EmailFollowUp';
import ExecutiveBriefings from './pages/ExecutiveBriefings';
import FollowUpManager from './pages/FollowUpManager';
import Home from './pages/Home';
import Insights from './pages/Insights';
import LeadAnalyticsDashboard from './pages/LeadAnalyticsDashboard';
import LeadDashboard from './pages/LeadDashboard';
import LeadFollowUp from './pages/LeadFollowUp';
import LeadIntelligence from './pages/LeadIntelligence';
import LeadReports from './pages/LeadReports';
import CyberNewsletterWriter from './pages/CyberNewsletterWriter';
import NewsletterDraftEditor from './pages/NewsletterDraftEditor';
import OpportunityDashboard from './pages/OpportunityDashboard';
import Partners from './pages/Partners';
import Portfolio from './pages/Portfolio';
import Publications from './pages/Publications';
import ROICalculator from './pages/ROICalculator';
import ReferralProgram from './pages/ReferralProgram';
import Resources from './pages/Resources';
import SEODashboard from './pages/SEODashboard';
import SearchResults from './pages/SearchResults';
import SecurityAssessment from './pages/SecurityAssessment';
import SecurityMonitor from './pages/SecurityMonitor';
import Services from './pages/Services';
import Sitemap from './pages/Sitemap';
import SocialMediaManager from './pages/SocialMediaManager';
import StrategicPlanner from './pages/StrategicPlanner';
import SupportInquiries from './pages/SupportInquiries';
import TestimonialAdmin from './pages/TestimonialAdmin';
import ThreatIntelligenceDashboard from './pages/ThreatIntelligenceDashboard';
import Webinars from './pages/Webinars';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SecurityViolationsDashboard from './pages/SecurityViolationsDashboard';
import SentinelSimulator from './pages/SentinelSimulator';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AgentChatPage": AgentChatPage,
    "AnalyticsDashboard": AnalyticsDashboard,
    "Blog": Blog,
    "BlogAdmin": BlogAdmin,
    "BlogManager": BlogManager,
    "BlogPost": BlogPost,
    "BlogPostDetail": BlogPostDetail,
    "CRMIntegration": CRMIntegration,
    "CalendarSync": CalendarSync,
    "CapabilityStatement": CapabilityStatement,
    "CaseStudyDetail": CaseStudyDetail,
    "ClientPortal": ClientPortal,
    "Contact": Contact,
    "CyberBulletins": CyberBulletins,
    "EmailFollowUp": EmailFollowUp,
    "ExecutiveBriefings": ExecutiveBriefings,
    "FollowUpManager": FollowUpManager,
    "Home": Home,
    "Insights": Insights,
    "LeadAnalyticsDashboard": LeadAnalyticsDashboard,
    "LeadDashboard": LeadDashboard,
    "LeadFollowUp": LeadFollowUp,
    "LeadIntelligence": LeadIntelligence,
    "LeadReports": LeadReports,
    "CyberNewsletterWriter": CyberNewsletterWriter,
    "NewsletterDraftEditor": NewsletterDraftEditor,
    "OpportunityDashboard": OpportunityDashboard,
    "Partners": Partners,
    "Portfolio": Portfolio,
    "Publications": Publications,
    "ROICalculator": ROICalculator,
    "ReferralProgram": ReferralProgram,
    "Resources": Resources,
    "SEODashboard": SEODashboard,
    "SearchResults": SearchResults,
    "SecurityAssessment": SecurityAssessment,
    "SecurityMonitor": SecurityMonitor,
    "Services": Services,
    "Sitemap": Sitemap,
    "SocialMediaManager": SocialMediaManager,
    "StrategicPlanner": StrategicPlanner,
    "SupportInquiries": SupportInquiries,
    "TestimonialAdmin": TestimonialAdmin,
    "ThreatIntelligenceDashboard": ThreatIntelligenceDashboard,
    "Webinars": Webinars,
    "TermsOfUse": TermsOfUse,
    "PrivacyPolicy": PrivacyPolicy,
    "SecurityViolationsDashboard": SecurityViolationsDashboard,
    "SentinelSimulator": SentinelSimulator,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};