
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Link to="/" className="flex items-center">
        <img
          src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
          alt="German Exiles RL Logo"
          className="h-12 w-12 object-contain brightness-125"
        />
      </Link>
    </div>
  );
};
