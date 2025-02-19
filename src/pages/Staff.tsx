
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface StaffMember {
  name: string;
  role: string;
  image?: string;
  contact?: string;
}

const Staff = () => {
  const staffMembers: StaffMember[] = [
    { 
      name: "Iain Bowie",
      role: "Head Coach"
    },
    {
      name: "Kieron Billsborough",
      role: "Assistant Coach"
    }
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
            alt="German Exiles Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-german-gold">Staff</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Meet the dedicated staff members who work behind the scenes to support and develop German Exiles Rugby League.
          </p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black border-german-red hover:border-german-gold transition-colors duration-300">
                  <CardHeader className="flex flex-col items-center">
                    <div className="w-32 h-32 mb-4">
                      {member.image ? (
                        <img 
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-german-red flex items-center justify-center text-white text-3xl">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-german-red font-semibold">{member.role}</p>
                  </CardHeader>
                  {member.contact && (
                    <CardContent className="text-center">
                      <p className="text-sm text-german-gold">
                        Contact: {member.contact}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Staff;
