
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
          alt="German Exiles RL Logo"
          className="h-12 w-12 object-contain brightness-125"
        />
        <span className="text-german-gold font-bold text-xl hidden sm:block">German Exiles RL</span>
      </Link>
    </div>
  );
};
