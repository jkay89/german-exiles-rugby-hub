
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon } from "lucide-react";
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
  team?: string; // Make team optional as it might not always be provided
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
      return dateString; // Return original string if parsing fails
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === "TBC") return "TBC";
    
    try {
      const parsedTime = parseISO(`2000-01-01T${timeString}`);
      return format(parsedTime, 'HH:mm');
    } catch (error) {
      console.error("Error formatting time:", error, "for time:", timeString);
      return timeString; // Return original string if parsing fails
    }
  };

  return (
    <Card className="bg-gray-900 text-white h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {competition || "Friendly"}
          {team && <span className="text-sm ml-2 text-gray-400">({team})</span>}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {formatDate(date)} - {formatTime(time)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-400">Opponent</p>
          <p className="text-lg">{opponent}</p>
        </div>
        <div className="mb-2">
          <p className="text-sm text-gray-400">Match Type</p>
          <p className="text-base">{is_home ? 'Home' : 'Away'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Location</p>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
            <p className="text-base">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FixtureCard;
