
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import HeritageTeam from "./pages/HeritageTeam";
import CommunityTeam from "./pages/CommunityTeam";
import Staff from "./pages/Staff";
import Fixtures from "./pages/Fixtures";
import NRLD from "./pages/NRLD";
import Sponsors from "./pages/Sponsors";
import Contact from "./pages/Contact";
import News from "./pages/News";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/heritage-team" element={<HeritageTeam />} />
            <Route path="/community-team" element={<CommunityTeam />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/nrld" element={<NRLD />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
