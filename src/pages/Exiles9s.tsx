
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface PlayerProfile {
  number: string;
  name: string;
  position?: string;
  countryHeritage: "DE" | "GB" | "CH";
  currentClub?: string;
  role?: string;
  image?: string;
}

const Exiles9s = () => {
  const { t } = useLanguage();
  
  const players: PlayerProfile[] = [
    { number: "15", name: "Jay Kay", position: "Outside Backs", countryHeritage: "DE", currentClub: "Thornhill Trojans", role: "Captain", image: "/lovable-uploads/7cdbd50d-8320-4db0-9303-53445bf0e348.png" },
    { number: "5", name: "Zak Bredin", position: "Half Back", countryHeritage: "DE", currentClub: "Eastern Rhinos", role: "Vice Captain", image: "/lovable-uploads/2c677fd8-f43a-45a8-b0a1-491ba2d9eae4.png" },
    { number: "44", name: "Henning Brockmann", countryHeritage: "DE", role: "Vice Captain" },
    { number: "23", name: "Malte Rohrmoser", position: "2nd Row", countryHeritage: "DE", currentClub: "Ruhrpott Ritter", image: "/lovable-uploads/aa6b1a91-c03b-47ce-834c-19f208fc23b9.png" },
    { number: "17", name: "Fabian Wendt", countryHeritage: "DE" },
    { number: "1", name: "Benedikt Esser", countryHeritage: "DE" },
    { number: "3", name: "Aaron Willmott", countryHeritage: "DE" },
    { number: "10", name: "Joshua McConnell", position: "Loose Forward", countryHeritage: "DE", currentClub: "Wath Brow Hornets" },
    { number: "8", name: "Korbi Mayer", countryHeritage: "DE" },
    { number: "19", name: "Harry Cartwright", countryHeritage: "DE" },
    { number: "12", name: "Zach Burke", position: "Centre", countryHeritage: "GB", currentClub: "Featherstone Lions" },
    { number: "4", name: "Ad Morley", position: "Centre", countryHeritage: "DE" },
    { number: "6", name: "Lewis Wilson", position: "Centre", countryHeritage: "GB", currentClub: "Bentley" },
    { number: "2", name: "Marcél Schlicht", position: "None", countryHeritage: "CH", currentClub: "None", role: "Sponsor", image: "/lovable-uploads/b469f12d-4b0e-4ec7-a440-89ef8e502500.png" },
  ];

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
            alt={t("german_exiles_logo")}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-german-gold text-center">{t("schlicht_exiles_9s")}</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center mb-10 gap-8">
            <div className="w-64 h-64">
              <img 
                src="/lovable-uploads/51da26a8-d895-4a08-91d5-1c75e6c64b39.png" 
                alt={t("schlicht_exiles_9s_logo")}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-gray-300 max-w-2xl">
              {t("exiles_9s_description")}
            </p>
          </div>
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
                  <CardHeader className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-full mb-4 space-x-8">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-german-red flex items-center justify-center text-white font-bold">
                          {player.number}
                        </div>
                      </div>
                      
                      <div className={`${player.name === "Marcél Schlicht" ? "w-32 h-32" : "w-24 h-24"} flex items-center justify-center`}>
                        {player.image ? (
                          <img 
                            src={player.image}
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
                            alt={t("german_flag")}
                            className="w-8 h-5 object-cover rounded"
                          />
                        ) : player.countryHeritage === "GB" ? (
                          <img 
                            src="/lovable-uploads/a18e25c3-ea1c-4820-a9a0-900357680eeb.png"
                            alt={t("british_flag")}
                            className="w-8 h-5 object-cover rounded"
                          />
                        ) : (
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg"
                            alt={t("swiss_flag")}
                            className="w-8 h-5 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{player.name}</h3>
                    {player.position && player.position !== "None" && (
                      <p className="text-german-red font-semibold">{player.position}</p>
                    )}
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-2">
                      {player.currentClub && player.currentClub !== "None" && (
                        <p className="text-sm text-gray-300">
                          <span className="text-german-gold font-semibold">{t("club")}:</span> {player.currentClub}
                        </p>
                      )}
                      {player.role && (
                        <p className="text-sm text-german-gold font-semibold">
                          {player.role}
                        </p>
                      )}
                    </div>
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

export default Exiles9s;
