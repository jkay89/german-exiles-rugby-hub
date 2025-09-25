
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon, Calendar, Clock } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { enGB, de } from 'date-fns/locale';

interface FixtureCardProps {
  id: string;
  date: string;
  time: string;
  opponent: string;
  location: string;
  is_home: boolean;
  competition: string;
  locale: string;
  team?: string;
}

const FixtureCard = ({
  id,
  date,
  time,
  opponent,
  location,
  is_home,
  competition,
  locale,
  team
}: FixtureCardProps) => {
  
  const formatDate = (dateString: string) => {
    try {
      const parsedDate = parseISO(dateString);
      const localeObj = locale === 'de' ? de : enGB;
      return format(parsedDate, 'EEE, d MMM yyyy', { locale: localeObj });
    } catch (error) {
      console.error("Error formatting date:", error, "for date:", dateString);
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === "TBC") return "TBC";
    
    try {
      const parsedTime = parseISO(`2000-01-01T${timeString}`);
      return format(parsedTime, 'HH:mm');
    } catch (error) {
      console.error("Error formatting time:", error, "for time:", timeString);
      return timeString;
    }
  };

  // Determine badge color based on is_home
  const badgeClass = is_home 
    ? "bg-green-600 text-white" 
    : "bg-blue-600 text-white";

  return (
    <Card className="bg-gradient-to-b from-gray-900 to-gray-800 text-white h-full border border-gray-700 hover:border-german-gold transition-all duration-300 shadow-md hover:shadow-german-gold/20">
      <CardHeader className="border-b border-gray-700 pb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded ${badgeClass}`}>
            {is_home ? 'Home' : 'Away'}
          </span>
          <span className="text-xs font-medium bg-gray-700 text-german-gold px-2 py-1 rounded">
            {competition || "Friendly"}
          </span>
        </div>
        <CardTitle className="text-xl font-bold text-german-gold flex items-center justify-between">
          <span className="truncate">
            {is_home ? `${team || 'German Exiles'} vs ${opponent}` : `${opponent} vs ${team || 'German Exiles'}`}
          </span>
        </CardTitle>
        <CardDescription className="text-gray-300 flex flex-col gap-1 mt-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-german-gold" />
            {formatDate(date)}
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-german-gold" />
            {formatTime(time)}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-start">
          <MapPinIcon className="h-4 w-4 mt-1 mr-2 text-german-gold flex-shrink-0" />
          <p className="text-sm text-gray-300">{location}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FixtureCard;
