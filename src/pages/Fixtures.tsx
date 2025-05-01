import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { format, parseISO } from 'date-fns';
import { enGB, de } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client-extensions";
import { getPlayerStats, PlayerStats } from "@/utils/playerStats";

interface Fixture {
  id: string;
  date: string;
  time: string;
  opponent: string;
  location: string;
  is_home: boolean;
  competition: string;
}

const Fixtures = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const parsedDate = parseISO(dateString);
    const locale = i18n.language === 'de' ? de : enGB;
    return format(parsedDate, 'EEE, d MMM yyyy', { locale });
  };

  const formatTime = (timeString: string) => {
    const parsedTime = parseISO(`2000-01-01T${timeString}`);
    return format(parsedTime, 'HH:mm');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: fixtureData, error: fixtureError } = await supabase
          .from('fixtures')
          .select('*')
          .order('date', { ascending: true });

        if (fixtureError) {
          throw new Error(`Error fetching fixtures: ${fixtureError.message}`);
        }

        if (!fixtureData) {
          throw new Error('No fixtures data received');
        }

        // Filter fixtures based on date
        const today = new Date();
        const upcoming = fixtureData.filter(fixture => new Date(fixture.date) >= today);
        const past = fixtureData.filter(fixture => new Date(fixture.date) < today);

        // Sort upcoming fixtures by date and time
        upcoming.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          return a.time.localeCompare(b.time); // Sort by time if dates are equal
        });

        // Sort past fixtures by date in descending order
        past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Combine and set fixtures based on the active tab
        const combinedFixtures = activeTab === "upcoming" ? upcoming : past;
        setFixtures(combinedFixtures);
      } catch (err: any) {
        setError(err.message);
        console.error("Error loading fixtures:", err);
      } finally {
        setLoading(false);
      }
      
      // Get player statistics
      setStatsLoading(true);
      try {
        const stats = await getPlayerStats();
        setPlayerStats(stats);
      } catch (error) {
        console.error("Error loading player stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchData();
  }, [t, activeTab, i18n.language]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{t('fixtures.title')}</h1>
        <Button variant="outline" onClick={() => navigate('/')}>{t('backToHome')}</Button>
      </div>

      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 rounded-md bg-secondary p-1 text-secondary-foreground">
          <Button
            variant={activeTab === "upcoming" ? "default" : "ghost"}
            onClick={() => setActiveTab("upcoming")}
            className="h-9 rounded-md px-3"
          >
            {t('fixtures.upcoming')}
          </Button>
          <Button
            variant={activeTab === "past" ? "default" : "ghost"}
            onClick={() => setActiveTab("past")}
            className="h-9 rounded-md px-3"
          >
            {t('fixtures.past')}
          </Button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">{t('loading')}</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fixtures.map((fixture) => (
          <Card key={fixture.id} className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{fixture.competition}</CardTitle>
              <CardDescription>
                {formatDate(fixture.date)} - {formatTime(fixture.time)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-400">{t('fixtures.opponent')}</p>
                <p className="text-lg">{fixture.opponent}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">{t('fixtures.location')}</p>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <p className="text-base">{fixture.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Player Statistics Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">Player Statistics</h2>
        {statsLoading ? (
          <p className="text-center text-gray-500">Loading player statistics...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of player statistics.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Games</TableHead>
                  <TableHead>Trys</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Yellow Cards</TableHead>
                  <TableHead>Red Cards</TableHead>
                  <TableHead>MotM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playerStats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.name}</TableCell>
                    <TableCell>{stat.position}</TableCell>
                    <TableCell>{stat.gamesPlayed}</TableCell>
                    <TableCell>{stat.trysScored}</TableCell>
                    <TableCell>{stat.pointsScored}</TableCell>
                    <TableCell>{stat.yellowCards}</TableCell>
                    <TableCell>{stat.redCards}</TableCell>
                    <TableCell>{stat.manOfTheMatch}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Fixtures;
