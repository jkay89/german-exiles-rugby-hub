import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Team from "./pages/Team";
import Fixtures from "./pages/Fixtures";
import NRLD from "./pages/NRLD";
import Sponsors from "./pages/Sponsors";
import Contact from "./pages/Contact";
import News from "./pages/News";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/team" element={<Team />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/nrld" element={<NRLD />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<News />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;