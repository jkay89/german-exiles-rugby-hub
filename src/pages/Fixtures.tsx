
import { motion } from "framer-motion";
import { useState } from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Trophy, 
  CalendarCheck, 
  Star, 
  Zap, 
  Shield, 
  User,
  Search
} from "lucide-react";
import { getPlayerStats, getMatchResults } from "@/utils/playerStats";
import { Fixture, getFixtures } from "@/utils/fixtureUtils";

const Fixtures = () => {
  const [activeTab, setActiveTab] = useState<string>("fixtures");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const fixtures: Fixture[] = getFixtures();
  const results = getMatchResults();
  const playerStats = getPlayerStats();
  
  // Filter players based on search query
  const filteredPlayers = playerStats.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative py-16 bg-black text-white overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 opacity-10">
          <img 
            src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png" 
            alt="German Exiles Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-german-gold">Fixtures & Results</h1>
          <p className="text-gray-300">View our upcoming games, past results, and player statistics</p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="fixtures" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8 bg-gray-800 text-white">
              <TabsTrigger 
                value="fixtures" 
                className="data-[state=active]:bg-german-red data-[state=active]:text-white"
              >
                Upcoming Fixtures
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="data-[state=active]:bg-german-red data-[state=active]:text-white"
              >
                Results
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fixtures" className="mt-0">
              <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-4 text-white">Upcoming Fixtures</h2>
                <div className="space-y-4">
                  {fixtures.map((fixture, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-4 border-german-red p-4 bg-gray-900"
                    >
                      <p className="font-bold text-white">{fixture.opponent}</p>
                      <p className="text-sm text-gray-300">
                        {format(new Date(fixture.date), "dd MMMM yyyy")} at {fixture.time}
                      </p>
                      <p className="text-sm text-german-gold">{fixture.location}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="mt-0">
              <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-4 text-white">Match Results</h2>
                
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-l-4 border-german-red p-4 bg-gray-900"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white">
                              {result.isHome ? "German Exiles" : result.opponent} vs {result.isHome ? result.opponent : "German Exiles"}
                            </p>
                            <p className="text-sm text-gray-300">
                              {format(new Date(result.date), "dd MMMM yyyy")}
                            </p>
                            <p className="text-sm text-german-gold">{result.location}</p>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {result.homeScore} - {result.awayScore}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg">
                    <div className="bg-gray-800 p-4 rounded-full mb-4">
                      <Trophy className="h-12 w-12 text-german-gold" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No Results Yet</h3>
                    <p className="text-center text-gray-400">
                      The German Exiles haven't played any official matches yet. 
                      Stay tuned for our upcoming fixtures!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12">
            <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Star className="h-6 w-6 text-german-gold" /> Player Statistics
              </h2>
              
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  type="search" 
                  placeholder="Find player..." 
                  className="pl-10 bg-gray-900 border-gray-700 text-white w-full md:w-1/3" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <ScrollArea className="h-80">
                <div className="overflow-x-auto">
                  <Table className="w-full text-white">
                    <TableHeader className="bg-gray-900 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="text-white">Player</TableHead>
                        <TableHead className="text-white">Position</TableHead>
                        <TableHead className="text-white text-center">
                          <div className="flex flex-col items-center">
                            <CalendarCheck className="h-4 w-4 mb-1" />
                            <span>Games</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-white text-center">
                          <div className="flex flex-col items-center">
                            <Trophy className="h-4 w-4 mb-1" />
                            <span>Tries</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-white text-center">
                          <div className="flex flex-col items-center">
                            <Zap className="h-4 w-4 mb-1" />
                            <span>Points</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-white text-center">
                          <div className="flex flex-col items-center">
                            <Shield className="h-4 w-4 mb-1 text-yellow-400" />
                            <span>Yellow</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-white text-center">
                          <div className="flex flex-col items-center">
                            <Shield className="h-4 w-4 mb-1 text-red-500" />
                            <span>Red</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-white text-center">
                          <div className="flex flex-col items-center">
                            <Star className="h-4 w-4 mb-1 text-german-gold" />
                            <span>MotM</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlayers.length > 0 ? (
                        filteredPlayers.map((player, index) => (
                          <TableRow 
                            key={player.id}
                            className={index % 2 === 0 ? "bg-gray-800/40" : "bg-gray-900/40"}
                          >
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>{player.position}</TableCell>
                            <TableCell className="text-center">{player.gamesPlayed}</TableCell>
                            <TableCell className="text-center">{player.trysScored}</TableCell>
                            <TableCell className="text-center">{player.pointsScored}</TableCell>
                            <TableCell className="text-center">{player.yellowCards}</TableCell>
                            <TableCell className="text-center">{player.redCards}</TableCell>
                            <TableCell className="text-center">{player.manOfTheMatch}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-gray-400">No players found matching "{searchQuery}"</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fixtures;
