
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useEffect } from "react";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import HeritageTeam from "./pages/HeritageTeam";
import CommunityTeam from "./pages/CommunityTeam";
import Exiles9s from "./pages/Exiles9s";
import Staff from "./pages/Staff";
import Fixtures from "./pages/Fixtures";
import NRLD from "./pages/NRLD";
import Sponsors from "./pages/Sponsors";
import Contact from "./pages/Contact";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Media from "./pages/Media";
import MediaFolder from "./pages/MediaFolder";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPlayers from "./pages/admin/AdminPlayers";
import AdminNews from "./pages/admin/AdminNews";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSponsors from "./pages/admin/AdminSponsors";
import AdminFixtures from "./pages/admin/AdminFixtures";
import { AdminProvider } from "./contexts/AdminContext";
import { setupSupabase } from "./lib/supabase-setup";
import { seedInitialContent } from "./utils/seedInitialContent";

const queryClient = new QueryClient();

// Initialize Supabase setup and seed initial data
Promise.all([
  setupSupabase().catch(console.error),
  seedInitialContent().catch(console.error)
]);

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/heritage-team" element={<HeritageTeam />} />
              <Route path="/community-team" element={<CommunityTeam />} />
              <Route path="/exiles-9s" element={<Exiles9s />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/fixtures" element={<Fixtures />} />
              <Route path="/nrld" element={<NRLD />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsArticle />} />
              <Route path="/media" element={<Media />} />
              <Route path="/media/:id" element={<MediaFolder />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/players" element={<AdminPlayers />} />
              <Route path="/admin/news" element={<AdminNews />} />
              <Route path="/admin/media" element={<AdminMedia />} />
              <Route path="/admin/sponsors" element={<AdminSponsors />} />
              <Route path="/admin/fixtures" element={<AdminFixtures />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
