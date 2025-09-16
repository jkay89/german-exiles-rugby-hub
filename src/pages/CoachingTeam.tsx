
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { fetchCoachingStaff, CoachingStaffMember } from "@/utils/coachingStaffUtils";
import { Loader2, Mail, Phone } from "lucide-react";

const CoachingTeam = () => {
  const { t } = useLanguage();
  const [staffMembers, setStaffMembers] = useState<CoachingStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      try {
        const data = await fetchCoachingStaff();
        setStaffMembers(data);
      } catch (error) {
        console.error("Error loading coaching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStaff();
  }, []);

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
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4 text-german-gold">{t("staff_title")}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            {t("staff_description")}
          </p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 text-german-gold animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staffMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-black border-german-red hover:border-german-gold transition-colors duration-300">
                    <CardHeader className="flex flex-col items-center">
                      <div className="w-32 h-32 mb-4 rounded-full overflow-hidden flex items-center justify-center bg-gray-800">
                        {member.photo_url ? (
                          <img 
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="bg-german-red flex items-center justify-center text-white text-3xl w-full h-full">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-german-red font-semibold">{member.role}</p>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      {member.contact_email && (
                        <div className="flex items-center justify-center text-sm text-german-gold">
                          <Mail className="h-4 w-4 mr-2" />
                          <a href={`mailto:${member.contact_email}`} className="hover:underline">
                            {member.contact_email}
                          </a>
                        </div>
                      )}
                      {member.contact_number && (
                        <div className="flex items-center justify-center text-sm text-german-gold">
                          <Phone className="h-4 w-4 mr-2" />
                          <a href={`tel:${member.contact_number}`} className="hover:underline">
                            {member.contact_number}
                          </a>
                        </div>
                      )}
                      {member.bio && (
                        <p className="text-sm text-gray-300 mt-3">{member.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CoachingTeam;
