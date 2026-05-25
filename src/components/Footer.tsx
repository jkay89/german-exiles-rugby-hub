import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  // Don't render on admin or auth pages
  if (pathname.startsWith("/admin") || pathname === "/auth") return null;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-center md:text-left">
            <p className="text-white font-semibold">German Exiles Rugby League</p>
            <p>The club for German-eligible rugby league players in the UK.</p>
            <p className="mt-1">
              Contact:{" "}
              <a
                href="mailto:info@germanexilesrl.co.uk"
                className="text-german-gold hover:underline"
              >
                info@germanexilesrl.co.uk
              </a>
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookies Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-center text-gray-500">
          © {year} German Exiles Rugby League. All rights reserved. An amateur sports club, not a
          commercial business.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
