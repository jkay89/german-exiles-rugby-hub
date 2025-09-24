import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { DrawTabNavigation } from "@/components/lottery/DrawTabNavigation";

const LotteryTerms = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Tab Navigation */}
      <DrawTabNavigation />
      
      {/* Header */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="outline" asChild className="mb-6">
              <Link to="/lottery" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Lottery
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold">Terms & Conditions</h1>
            </div>
            <p className="text-xl text-gray-400">
              German Exiles Rugby League Lottery – Legal Terms & Conditions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Section 1 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  1. Lottery Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>The lottery is operated by German Exiles Rugby League (the "Club"), a non-commercial society registered with [Local Council Name] under a Small Society Lottery Registration.</li>
                  <li>The promoter of the lottery is [Full Name], [Address], acting on behalf of the Club.</li>
                  <li>Each line costs £5 and contains four distinct numbers. Players select four numbers from 1 to 32. No number may be selected more than once per line.</li>
                  <li>Players may enter one or more lines per draw. Each line is valid for a single monthly draw.</li>
                  <li>The minimum payment accepted is £5 per line. Payment must be completed and verified before the entry is deemed valid.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">2. Number Selection</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ol className="list-decimal list-inside" start={6}>
                  <li>Players may select their own numbers manually via the online portal or use the "Quick Pick" option to receive four computer-generated numbers from 1 to 32.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">3. Draws</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <ol className="list-decimal list-inside space-y-2" start={7}>
                  <li>Draws take place at a predetermined location during the last week of each month, generally around 8:00 pm. The exact date of each draw will be published on the German Exiles Rugby League website, displayed at the checkout when purchasing, and confirmed on the entry receipt.</li>
                  <li>Draws will be streamed live on the German Exiles Rugby League Facebook page (subject to availability).</li>
                  <li>Draws will be recorded and published on German Exiles Rugby League social media.</li>
                  <li>In the unlikely event that a live draw cannot take place, a computer will randomly generate winning numbers.</li>
                  <li>All draws are conducted fairly, and winning numbers are selected impartially.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">4. Winners</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <ol className="list-decimal list-inside space-y-2" start={12}>
                  <li>Winners are selected from all valid entries for that month.</li>
                  <li>Jackpot prizes are awarded to entries matching all four numbers. If multiple entries match, the jackpot will be shared equally.</li>
                  <li>Every player who has purchased at least one valid line for the relevant month's draw will have their name entered once into that month's Lucky Dip, regardless of how many lines they have purchased. The Lucky Dip is drawn randomly from the list of eligible player names. A player may win more than one Lucky Dip prize, as there is no restriction preventing the same name being drawn multiple times. Players without a valid line for that month will not be entered into that month's Lucky Dip draw.</li>
                  <li>Winners will be notified by email or text within three days of the draw and will be published on German Exiles Rugby League social media.</li>
                  <li>Winners must claim their prizes within 14 days of notification. Any unclaimed prizes after this period will be retained by the Club and applied to its charitable, sporting, and community purposes.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">5. Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <ol className="list-decimal list-inside space-y-2" start={17}>
                  <li>The lottery is open to persons aged 18 or over who are legally permitted to participate in UK lotteries. The statutory minimum age is 16, but the Club has chosen to restrict entry to 18+ only. Any entry from ineligible persons will be void and not refunded.</li>
                  <li>All claims to a prize are subject to an ID check for proof of age. Refusal to comply will result in the claim being void.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">6. Payments and Checkout</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <ol className="list-decimal list-inside space-y-2" start={19}>
                  <li>All payments must be made online via the official payment portal. No other forms of payment are accepted.</li>
                  <li>The Club may offer an "Auto Renew" option, allowing payment to be automatically deducted from the card provided to ensure participation in future draws.</li>
                  <li>All sales are final. No refunds or cancellations are allowed once payment has been accepted. If a scheduled draw is cancelled, all valid entries will be carried forward to the next available draw.</li>
                  <li>At checkout, you are required to:
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>Accept these Terms & Conditions,</li>
                      <li>Declare that you are aged 18 or over, and</li>
                      <li>Acknowledge that if you win a prize (Jackpot or Lucky Dip), you must claim it within 14 days of notification.</li>
                    </ul>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">7. Prize Allocation</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <ol className="list-decimal list-inside space-y-2" start={23}>
                  <li>The maximum value of any single prize will not exceed £25,000, in line with the Gambling Act 2005.</li>
                  <li>The proceeds from the lottery will be allocated as follows:
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>At least 20% of proceeds will be applied to the Club's charitable, sporting, and community purposes.</li>
                      <li>Up to 80% may be used for prizes and reasonable administrative costs.</li>
                    </ul>
                  </li>
                  <li>All prizes are non-transferable and will be paid via online banking from the German Exiles Rugby League Club account by the Club Treasurer within 2 to 3 working days of prize confirmation.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">8. General Rules</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <ol className="list-decimal list-inside space-y-2" start={26}>
                  <li>Entries submitted after the deadline (7:50 pm on the day of the draw) will be carried forward to the following month.</li>
                  <li>Players should retain proof of purchase, a copy of these Terms & Conditions, and any transaction records.</li>
                  <li>The decision of the Club regarding draws, winners, and prize distribution is final. This does not affect a participant's statutory rights. Complaints may be raised with the Club in the first instance or with [Local Council Name] as the licensing authority.</li>
                  <li>These Terms & Conditions may be amended at any time by the Club. Players will be advised of significant changes via the Club's official communication channels.</li>
                  <li>A statutory return will be submitted to [Local Council Name] following each draw, detailing the income, expenses, prizes, and amounts applied to the Club's purposes, in line with licensing requirements.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Footer CTA */}
            <div className="text-center pt-8">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/lottery">Return to Lottery Page</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LotteryTerms;