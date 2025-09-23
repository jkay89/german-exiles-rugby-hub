import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Users, Banknote } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LotteryEntry from "@/components/lottery/LotteryEntry";
import SubscriptionManager from "@/components/lottery/SubscriptionManager";

const Lottery = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-red-600/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              German Exiles Rugby League
              <span className="block text-blue-400">Lottery</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Support your club and win big every month
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Play Now - £5 per line
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/lottery/terms">View Terms & Conditions</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">£5 per line</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">
                    Pick 4 numbers from 1 to 32. Each line is valid for one monthly draw. 
                    Buy as many lines as you like.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Monthly Draws</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">
                    Draws take place in the last week of each month. 
                    Live-streamed when possible and results published online.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Two Ways to Win</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">
                    <strong>Jackpot:</strong> Match all 4 numbers<br/>
                    <strong>Lucky Dip:</strong> 5 winners × £10 each month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Support the Club</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">
                    At least 20% of proceeds go directly to supporting German Exiles 
                    Rugby League's community and sporting activities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Prizes</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-600/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
                    <Trophy className="w-6 h-6" />
                    Jackpot Prize
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Match all 4 numbers to win the jackpot. If multiple winners, 
                    the jackpot is shared equally.
                  </p>
                  <p className="text-sm text-gray-400">
                    Maximum prize: £25,000 (by law)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-600/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-400 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Lucky Dip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Every player with at least one valid line is entered once into 
                    the Lucky Dip draw. You could win multiple times!
                  </p>
                  <p className="font-semibold text-blue-400">
                    5 winners each month × £10 each
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Eligibility & Payment */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Important Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Who Can Play</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>• Open to anyone 18 or over</p>
                  <p>• Must be legally allowed to participate in UK lotteries</p>
                  <p>• ID verification required for prize claims</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Payments</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>• Online payments only via official portal</p>
                  <p>• Auto Renew option available</p>
                  <p>• Sales are final - no refunds once payment taken</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Winners</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>• Notified by email/text within 3 days</p>
                  <p>• Names published on social media</p>
                  <p>• Prizes paid by bank transfer in 2-3 working days</p>
                  <p>• Must claim within 14 days</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Where Your Money Goes</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-2">
                  <p>• At least 20% supports club activities</p>
                  <p>• Remainder used for prizes and running costs</p>
                  <p>• Helping German Exiles Rugby League grow</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600/10 to-red-600/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Play?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Entries close at 7:50 PM on the day of the draw. 
                Late entries are carried forward to the next month.
              </p>
            </div>
            
          {/* Lottery Entry Component */}
          <LotteryEntry />
          
          {/* Subscription Management for logged-in users */}
          <SubscriptionManager />
          
          {/* Dashboard Link for logged-in users */}
          {user && (
            <div className="text-center">
              <Button asChild variant="outline">
                <Link to={`/lottery/${user.email?.split('@')[0] || ''}`}>
                  View My Dashboard
                </Link>
              </Button>
            </div>
          )}
            
            <div className="text-center pt-8">
              <Button size="lg" variant="outline" asChild>
                <Link to="/lottery/terms">Read Full Terms & Conditions</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Lottery;