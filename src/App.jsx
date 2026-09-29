import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import PillarTimeTracker from '@/lib/PillarTimeTracker'
import { pagesConfig } from './pages.config'
import CapabilityMatrix from './pages/CapabilityMatrix';
import WorkshopBooking from './pages/WorkshopBooking';
import AdminDashboard from './pages/AdminDashboard';
import SubscriberManager from './pages/SubscriberManager';
import CyberNewsletterWriter from './pages/CyberNewsletterWriter';
import NewsletterDraftEditor from './pages/NewsletterDraftEditor';
import CaseStudyAdmin from './pages/CaseStudyAdmin';
import TestimonialAdmin from './pages/TestimonialAdmin';
import SignIn from './pages/SignIn';
import CommitHistory from './pages/CommitHistory';
import ArticleHub from './pages/ArticleHub';
import IndustryFeed from './pages/IndustryFeed';
import BlogCalendar from './pages/BlogCalendar';
import PhDGrantsHub from './pages/PhDGrantsHub';
import TrainingCatalog from './pages/TrainingCatalog';
import MemberPortal from './pages/MemberPortal';
import AccessDenied from './pages/AccessDenied';
import AdminGuard from './components/admin/AdminGuard';
import BusinessSolutions from './pages/BusinessSolutions';
import CareerAccelerator from './pages/CareerAccelerator';
import InstitutionalPartnerships from './pages/InstitutionalPartnerships';
import KnowledgeHub from './pages/KnowledgeHub';
import ResearchPhDHub from './pages/ResearchPhDHub';
import ResearchFunding from './pages/ResearchFunding';
import CyberDojo from './pages/CyberDojo';
import CyberDojoBlog from './pages/CyberDojoBlog';
import PhDSenseiLayout from './components/phdsensei/PhDSenseiLayout';
import PhDSenseiDashboard from './pages/phdsensei/Dashboard';
import LitReview from './pages/phdsensei/LitReview';
import Sandbox from './pages/phdsensei/Sandbox';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { SectorProvider } from '@/hooks/useSector.jsx';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/CapabilityMatrix" element={<LayoutWrapper currentPageName="CapabilityMatrix"><CapabilityMatrix /></LayoutWrapper>} />
      <Route path="/WorkshopBooking" element={<LayoutWrapper currentPageName="WorkshopBooking"><WorkshopBooking /></LayoutWrapper>} />
      <Route path="/SubscriberManager" element={<LayoutWrapper currentPageName="SubscriberManager"><SubscriberManager /></LayoutWrapper>} />
      <Route path="/CyberNewsletterWriter" element={<LayoutWrapper currentPageName="CyberNewsletterWriter"><CyberNewsletterWriter /></LayoutWrapper>} />
      <Route path="/NewsletterDraftEditor" element={<LayoutWrapper currentPageName="NewsletterDraftEditor"><NewsletterDraftEditor /></LayoutWrapper>} />
      <Route path="/CaseStudyAdmin" element={<LayoutWrapper currentPageName="CaseStudyAdmin"><CaseStudyAdmin /></LayoutWrapper>} />
      <Route path="/TestimonialAdmin" element={<LayoutWrapper currentPageName="TestimonialAdmin"><TestimonialAdmin /></LayoutWrapper>} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/CommitHistory" element={<LayoutWrapper currentPageName="CommitHistory"><CommitHistory /></LayoutWrapper>} />
      <Route path="/ArticleHub" element={<LayoutWrapper currentPageName="ArticleHub"><ArticleHub /></LayoutWrapper>} />
      <Route path="/IndustryFeed" element={<LayoutWrapper currentPageName="IndustryFeed"><IndustryFeed /></LayoutWrapper>} />
      <Route path="/BlogCalendar" element={<LayoutWrapper currentPageName="BlogCalendar"><BlogCalendar /></LayoutWrapper>} />
      <Route path="/PhDGrantsHub" element={<LayoutWrapper currentPageName="PhDGrantsHub"><PhDGrantsHub /></LayoutWrapper>} />
      <Route path="/TrainingCatalog" element={<LayoutWrapper currentPageName="TrainingCatalog"><TrainingCatalog /></LayoutWrapper>} />
      <Route path="/MemberPortal" element={<LayoutWrapper currentPageName="MemberPortal"><MemberPortal /></LayoutWrapper>} />
      <Route path="/AccessDenied" element={<LayoutWrapper currentPageName="AccessDenied"><AccessDenied /></LayoutWrapper>} />
      {/* Audience pillar pages — clean production URLs */}
      <Route path="/business" element={<LayoutWrapper currentPageName="business"><BusinessSolutions /></LayoutWrapper>} />
      <Route path="/career" element={<LayoutWrapper currentPageName="career"><CareerAccelerator /></LayoutWrapper>} />
      <Route path="/institutions" element={<LayoutWrapper currentPageName="institutions"><InstitutionalPartnerships /></LayoutWrapper>} />
      <Route path="/knowledge" element={<LayoutWrapper currentPageName="knowledge"><KnowledgeHub /></LayoutWrapper>} />
      <Route path="/research" element={<LayoutWrapper currentPageName="research"><ResearchPhDHub /></LayoutWrapper>} />
      <Route path="/research-funding" element={<LayoutWrapper currentPageName="research-funding"><ResearchFunding /></LayoutWrapper>} />
      {/* Cyber Dojo Sensei — afrodojo standalone portfolio + tech blog */}
      <Route path="/cyber-dojo" element={<CyberDojo />} />
      <Route path="/cyber-dojo/blog" element={<CyberDojoBlog />} />
      {/* PhD Sensei research hub — isolated sidebar layout */}
      <Route path="/phd-sensei" element={<PhDSenseiLayout />}>
        <Route index element={<PhDSenseiDashboard />} />
        <Route path="lit-review" element={<LitReview />} />
        <Route path="sandbox" element={<Sandbox />} />
      </Route>
      <Route path="/ResearchFunding" element={<Navigate to="/research-funding" replace />} />
      {/* Legacy redirects to clean URLs */}
      <Route path="/BusinessSolutions" element={<Navigate to="/business" replace />} />
      <Route path="/CareerAccelerator" element={<Navigate to="/career" replace />} />
      <Route path="/InstitutionalPartnerships" element={<Navigate to="/institutions" replace />} />
      <Route path="/KnowledgeHub" element={<Navigate to="/knowledge" replace />} />
      <Route path="/ResearchPhDHub" element={<Navigate to="/research" replace />} />
      <Route path="/solutions/business" element={<Navigate to="/business" replace />} />
      <Route path="/solutions/career" element={<Navigate to="/career" replace />} />
      <Route path="/solutions/education" element={<Navigate to="/institutions" replace />} />
      <Route path="/resources/knowledge-hub" element={<Navigate to="/knowledge" replace />} />
      <Route path="/solutions/research" element={<Navigate to="/research" replace />} />
      <Route path="/AdminDashboard" element={
        <AdminGuard>
          <LayoutWrapper currentPageName="AdminDashboard"><AdminDashboard /></LayoutWrapper>
        </AdminGuard>
      } />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <SectorProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <NavigationTracker />
            <PillarTimeTracker />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </SectorProvider>
    </AuthProvider>
  )
}

export default App