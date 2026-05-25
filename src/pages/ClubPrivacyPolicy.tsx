import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const updated = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Shield className="w-12 h-12 text-german-gold mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              How German Exiles Rugby League (“the Club”) handles your personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: {updated}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">1. Who We Are</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <p>
                German Exiles Rugby League is an amateur, not-for-profit sports club representing
                German-eligible rugby league players based in the United Kingdom. We are not a
                commercial business; any income (membership, lottery, ticket sales, merchandise)
                is reinvested into running the Club.
              </p>
              <p>
                For any data protection enquiries contact us at{" "}
                <strong>info@germanexilesrl.co.uk</strong>.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">
                2. What Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <p>Depending on how you interact with the Club, we may collect:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Name, email address and (optionally) phone number when you contact us, register as a player/member, or buy tickets/merchandise.</li>
                <li>Player information (position, eligibility, playing history) if you join a squad.</li>
                <li>Delivery address for shop orders.</li>
                <li>Payment information processed by Stripe — we never see or store your full card details.</li>
                <li>Basic technical data (IP address, browser, device) and anonymous analytics so we can keep the site working.</li>
                <li>Photos and video taken at Club events (see section 6).</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Lottery-specific data (age verification, lottery entries, winnings) is covered by
                the{" "}
                <Link to="/lottery/privacy" className="text-german-gold hover:underline">
                  Lottery Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">3. Why We Use It</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>To run the Club: organising fixtures, squads, training and events.</li>
                <li>To respond to enquiries you send us.</li>
                <li>To fulfil ticket and shop orders.</li>
                <li>To send Club news and updates if you’ve asked to receive them.</li>
                <li>To meet legal, safeguarding and tax obligations.</li>
              </ul>
              <p>
                Our legal bases under UK GDPR are typically <em>consent</em> (newsletters, photos),{" "}
                <em>contract</em> (orders/tickets), <em>legitimate interests</em> (running the
                Club), and <em>legal obligation</em> where applicable.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">4. Who We Share It With</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>We only share personal data with trusted providers needed to run the Club:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Supabase</strong> – website database and authentication.</li>
                <li><strong>Stripe</strong> – payment processing.</li>
                <li><strong>Resend</strong> – transactional emails (tickets, lottery, order confirmations).</li>
                <li><strong>Cloudinary</strong> – hosting of images/media.</li>
                <li><strong>BARLA / governing bodies</strong> – player registration where required.</li>
              </ul>
              <p>
                We <strong>do not</strong> sell or rent your personal data to anyone for marketing.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">5. How Long We Keep It</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Member / player records: while you are involved with the Club and up to 3 years after.</li>
                <li>Financial records (tickets, shop, lottery): 6 years to meet HMRC requirements.</li>
                <li>Newsletter contacts: until you unsubscribe.</li>
                <li>Website analytics: anonymised and rolling 12 months.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">6. Photos & Video</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>
                Photos and video are taken at matches, training and Club events for use on this
                website, social media and promotional material. If you would prefer not to appear,
                please tell the photographer at the event or email us and we will remove
                identifiable images on request.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">7. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>Under UK GDPR you have the right to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Access the personal data we hold about you.</li>
                <li>Ask us to correct anything that is wrong.</li>
                <li>Ask us to delete your data (where we are not legally required to keep it).</li>
                <li>Object to or restrict certain processing.</li>
                <li>Withdraw consent at any time.</li>
                <li>Lodge a complaint with the UK Information Commissioner’s Office (ico.org.uk).</li>
              </ul>
              <p>
                To exercise any of these, email <strong>info@germanexilesrl.co.uk</strong>. We aim
                to respond within 30 days.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">8. Changes</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                As a volunteer-run Club we may update this policy from time to time. The “last
                updated” date above will always reflect the latest version.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
