
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { removeBackground, loadImage } from "@/utils/imageUtils";
import { useToast } from "@/components/ui/use-toast";

interface PlayerProfile {
  teamNumber: string;
  name: string;
  position: string;
  countryHeritage: "DE" | "GB";
  nationalTeamNumber?: string;
  image?: string;
  sponsors?: string[];
}

const HeritageTeam = () => {
  const { toast } = useToast();
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({});

  const players: PlayerProfile[] = [
    { 
      teamNumber: "#001", 
      name: "Jay Kay", 
      position: "Outside Backs", 
      countryHeritage: "DE", 
      nationalTeamNumber: "#204", 
      image: "/lovable-uploads/ed51f6ed-0dc5-4ecf-b2ba-bfc97899d0e3.png",
      sponsors: [
        "/lovable-uploads/ec0861b7-d266-4334-aeff-fcb00e3c916e.png",
        "/lovable-uploads/3766a9db-3b01-4c39-a8a7-1c3f2f59981b.png"
      ]
    },
    { teamNumber: "#002", name: "Zak Bredin", position: "Centre", countryHeritage: "DE" },
    { teamNumber: "#003", name: "Oliver Bowie", position: "Second Row", countryHeritage: "DE", nationalTeamNumber: "#205" },
    { teamNumber: "#004", name: "Charlie Tetley", position: "Prop", countryHeritage: "DE" },
    { teamNumber: "#005", name: "George Wood", position: "Centre", countryHeritage: "DE" },
    { teamNumber: "#006", name: "Will Waring", position: "Second Row", countryHeritage: "DE" },
    { teamNumber: "#007", name: "Anthony Hackman", position: "Prop", countryHeritage: "DE" },
    { teamNumber: "#008", name: "Connor Hampson", position: "Prop", countryHeritage: "DE" },
    { teamNumber: "#009", name: "Alex Land", position: "Prop", countryHeritage: "GB" },
    { teamNumber: "#010", name: "Andy Hoggins", position: "Loose Forward", countryHeritage: "DE" },
    { teamNumber: "#011", name: "Joe Wood", position: "Dummy Half", countryHeritage: "GB" },
    { teamNumber: "#012", name: "Jamie Billsborough", position: "Hooker", countryHeritage: "GB" },
    { teamNumber: "#013", name: "Brad Billsborough", position: "Half Back", countryHeritage: "DE" },
    { teamNumber: "#014", name: "Ryan Hudson", position: "Prop", countryHeritage: "GB" },
    { teamNumber: "#015", name: "Zach Burke", position: "Centre", countryHeritage: "GB" },
    { teamNumber: "#016", name: "Eddie Briggs", position: "Second Row", countryHeritage: "DE" },
    { teamNumber: "#017", name: "Eoin Bowie", position: "Second Row", countryHeritage: "DE" },
    { teamNumber: "#018", name: "Joshua McConnell", position: "Loose Forward", countryHeritage: "DE" },
    { teamNumber: "#019", name: "Ad Morley", position: "Centre", countryHeritage: "DE" },
    { teamNumber: "#020", name: "Iain Bowie", position: "Coach", countryHeritage: "GB" },
    { teamNumber: "#021", name: "Kieron Billsborough", position: "Coach", countryHeritage: "GB" },
    { teamNumber: "#022", name: "Callum Corey", position: "Second Row", countryHeritage: "DE" },
    { teamNumber: "#023", name: "Shaun Smith", position: "Centre", countryHeritage: "DE" },
    { teamNumber: "#024", name: "Lewis Wilson", position: "Centre", countryHeritage: "GB" },
    { teamNumber: "#025", name: "Michael MacDonald", position: "Half Back", countryHeritage: "DE" },
    { teamNumber: "#026", name: "Arron Williams", position: "Second Row", countryHeritage: "DE" },
    { teamNumber: "#027", name: "Jordan Williams", position: "Prop", countryHeritage: "DE" },
    { teamNumber: "#028", name: "Louis Beattie", position: "Loose Forward", countryHeritage: "DE" },
    { teamNumber: "#029", name: "Michael Knight", position: "Prop", countryHeritage: "GB" },
    { teamNumber: "#030", name: "James Adams", position: "Second Row", countryHeritage: "DE" },
  ];

  useEffect(() => {
    const processImages = async () => {
      for (const player of players) {
        if (player.image && !processedImages[player.image]) {
          try {
            const response = await fetch(player.image);
            const blob = await response.blob();
            const img = await loadImage(blob);
            const processedBlob = await removeBackground(img);
            const processedUrl = URL.createObjectURL(processedBlob);
            
            setProcessedImages(prev => ({
              ...prev,
              [player.image!]: processedUrl
            }));
          } catch (error) {
            console.error(`Error processing image for ${player.name}:`, error);
            toast({
              title: "Image Processing Error",
              description: `Could not remove background for ${player.name}'s image`,
              variant: "destructive",
            });
          }
        }
      }
    };

    processImages();
  }, [players]);

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
          <h1 className="text-4xl font-bold mb-4 text-german-gold">Heritage Team</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Meet the players representing German Exiles Rugby League. Our heritage team consists of German-eligible players based in the UK, 
            all committed to growing the sport in Germany.
          </p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {players.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black border-german-red hover:border-german-gold transition-colors duration-300">
                  <CardHeader className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center w-full mb-4 space-x-8">
                      <div className="flex flex-col items-center">
                        <img 
                          src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
                          alt="German Exiles Logo"
                          className="w-8 h-8 object-contain"
                        />
                        <span className="text-sm mt-2 text-gray-300">{player.teamNumber}</span>
                      </div>
                      
                      <div className="w-24 h-24 flex items-center justify-center">
                        {player.image ? (
                          <img 
                            src={processedImages[player.image] || player.image}
                            alt={player.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-german-red flex items-center justify-center text-white text-2xl">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center">
                        {player.countryHeritage === "DE" ? (
                          <img 
                            src="/lovable-uploads/8765443e-9005-4411-b6f9-6cf0bbf78182.png"
                            alt="German Flag"
                            className="w-8 h-5 object-cover rounded"
                          />
                        ) : (
                          <img 
                            src="/lovable-uploads/a18e25c3-ea1c-4820-a9a0-900357680eeb.png"
                            alt="British Flag"
                            className="w-8 h-5 object-cover rounded"
                          />
                        )}
                        <span className="text-sm mt-2 text-gray-300">
                          {player.nationalTeamNumber || "N/A"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 items-center gap-4 w-full">
                      {player.sponsors?.[0] && (
                        <div className="flex justify-end">
                          <img 
                            src={player.sponsors[0]}
                            alt="Sponsor 1"
                            className="h-48 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-white text-center">{player.name}</h3>
                        <p className="text-german-red font-semibold">{player.position}</p>
                      </div>
                      {player.sponsors?.[1] && (
                        <div className="flex justify-start">
                          <img 
                            src={player.sponsors[1]}
                            alt="Sponsor 2"
                            className="h-48 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-german-gold">
                      Heritage: {player.countryHeritage === "DE" ? "German" : "British"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeritageTeam;
