
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { fetchCoachingStaff, CoachingStaffMember } from "@/utils/coachingStaffUtils";
import { Loader2, Mail, Phone } from "lucide-react";
import { PageWithPositionedElements } from "@/components/PageWithPositionedElements";

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
    <PageWithPositionedElements page="coaching-team">
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
            <div className="text-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffMembers.map((member) => (
                  <div key={member.id} className="bg-gray-800 rounded-lg border border-german-gold overflow-hidden flex flex-col hover:shadow-lg hover:shadow-german-gold/20 transition-shadow">
                    {member.photo_url ? (
                      <div className="w-full aspect-square bg-gray-900 overflow-hidden">
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-gray-900 flex items-center justify-center text-gray-600 text-6xl font-bold">
                        {member.name?.charAt(0)}
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col gap-1">
                      <h3 className="text-german-gold font-bold text-lg">{member.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">{member.role}</p>
                      {member.contact_email && (
                        <a href={`mailto:${member.contact_email}`} className="text-gray-400 hover:text-german-gold flex items-center gap-2 text-sm break-all">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="break-all">{member.contact_email}</span>
                        </a>
                      )}
                      {member.contact_number && (
                        <a href={`tel:${member.contact_number}`} className="text-gray-400 hover:text-german-gold flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{member.contact_number}</span>
                        </a>
                      )}
                      {member.bio && (
                        <p className="text-gray-400 text-sm mt-2 whitespace-pre-line">{member.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageWithPositionedElements>
  );
};

export default CoachingTeam;
