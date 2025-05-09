
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { getNextFixture } from "@/utils/fixtureUtils";
import { Fixture } from "@/utils/fixtureUtils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client-extensions";

export const NextFixtureCard = () => {
  const { t } = useLanguage();
  const [nextFixture, setNextFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNextFixture = async () => {
      setLoading(true);
      try {
        // Direct database query to ensure fresh data
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase.rest
          .from("fixtures")
          .select('*')
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log("Next fixture from direct DB query:", data[0]);
          setNextFixture(data[0] as Fixture);
        } else {
          // Fallback to hardcoded fixture from utils if no data in DB
          const fallbackFixture = await getNextFixture();
          console.log("Using fallback fixture data:", fallbackFixture);
          
          // Add missing properties to ensure the fallback fixture has the same structure
          const completeFixture = {
            ...fallbackFixture,
            id: fallbackFixture.id || `fallback-${Date.now()}`,
            team: fallbackFixture.team || "Heritage Team",
            competition: fallbackFixture.competition || "Friendly",
            is_home: fallbackFixture.is_home !== undefined ? fallbackFixture.is_home : true
          };
          
          setNextFixture(completeFixture);
        }
      } catch (error) {
        console.error("Error fetching next fixture:", error);
        toast({
          title: "Error",
          description: "Could not load upcoming fixture",
          variant: "destructive",
        });
        setNextFixture(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNextFixture();
  }, [toast]);

  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  return (
    <Card className="bg-gray-900 border-german-red border-2 h-full">
      <CardHeader className="bg-german-red">
        <CardTitle className="flex items-center text-white">
          <CalendarDays className="mr-2 h-5 w-5 text-white" />
          {t("next_fixture")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-german-gold animate-spin" />
          </div>
        ) : nextFixture ? (
          <div className="space-y-3 text-white">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium bg-gray-800 text-german-gold px-2 py-0.5 rounded">
                  {nextFixture.team || "Heritage Team"}
                </span>
                <span className="text-xs font-medium bg-gray-800 text-white px-2 py-0.5 rounded">
                  {nextFixture.competition || "Friendly"}
                </span>
              </div>
              <h3 className="text-lg font-bold">
                {nextFixture.is_home ? "German Exiles" : nextFixture.opponent} vs {nextFixture.is_home ? nextFixture.opponent : "German Exiles"}
              </h3>
            </div>
            <p className="text-german-gold flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              {format(parseISO(nextFixture.date), "EEEE, MMMM d, yyyy")} at {nextFixture.time}
            </p>
            <p>
              <a 
                href={getGoogleMapsUrl(nextFixture.location)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 flex items-center hover:text-german-gold transition-colors"
              >
                <MapPin className="mr-2 h-4 w-4 text-german-gold" />
                {nextFixture.location}
              </a>
            </p>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-gray-300">{t("no_upcoming_fixtures")}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to="/fixtures" className="w-full">
          <Button className="w-full bg-german-gold hover:bg-german-red text-white transition-colors">
            {t("view_all_fixtures")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
