import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { fetchCommitteeMembers, CommitteeMember } from "@/utils/committeeUtils";
import { Loader2, Mail, Phone } from "lucide-react";

const CommitteeMembers = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      try {
        const data = await fetchCommitteeMembers();
        setMembers(data);
      } catch (error) {
        console.error("Error loading committee members:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMembers();
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
          <h1 className="text-4xl font-bold mb-4 text-german-gold">{t("committee_members_title")}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            {t("committee_members_description")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member, index) => (
                  <div key={member.id} className="bg-gray-800 p-4 rounded border border-german-gold flex gap-4">
                    <div className="flex-1">
                      <h3 className="text-german-gold font-bold">{member.name}</h3>
                      <p className="text-gray-300">{member.role}</p>
                      {member.contact_email && (
                        <p className="text-gray-400">{member.contact_email}</p>
                      )}
                      {member.contact_number && (
                        <p className="text-gray-400">{member.contact_number}</p>
                      )}
                    </div>
                    {member.photo_url && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover rounded" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CommitteeMembers;