import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
            <FileText className="w-12 h-12 text-german-gold mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              The terms on which German Exiles Rugby League (“the Club”) provides this website.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: {updated}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">1. About the Club</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>
                German Exiles Rugby League is an amateur, volunteer-run rugby league club for
                German-eligible players based in the UK. This website (germanexilesrl.co.uk and
                its subdomains) is provided by the Club for information about fixtures, news,
                tickets, merchandise, the Club lottery and related activities.
              </p>
              <p>
                The Club is not a commercial business. Any income generated through the site is
                used solely to fund Club activities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">
                2. Using the site
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>By using this site you agree to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use it lawfully and not to disrupt, hack, scrape or overload it.</li>
                <li>Not impersonate another person or submit false information.</li>
                <li>Be at least 18 years old to take part in the Club lottery or buy alcohol-related hospitality.</li>
                <li>Respect the Club, players, volunteers, opponents and officials in any communications.</li>
              </ul>
              <p>
                We may suspend access to accounts that breach these terms or behave abusively
                towards Club volunteers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">3. Tickets</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Tickets are issued electronically and must be presented (printed or on phone) at the gate.</li>
                <li>Each ticket has a unique QR code valid for a single entry.</li>
                <li>Matches may be postponed, abandoned or relocated due to weather, ground or governing body decisions. In that case we will reschedule or refund.</li>
                <li>Refund requests should be sent to <strong>info@germanexilesrl.co.uk</strong> at least 24 hours before kick-off.</li>
                <li>Hospitality and concession tickets are subject to availability and any age restrictions stated at purchase.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">4. Shop & Merchandise</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Orders are confirmed by email and dispatched as soon as the volunteer kit team is able — please allow up to 21 days.</li>
                <li>Shipping is UK-only unless stated. International orders are by arrangement only.</li>
                <li>Faulty or incorrect items will be replaced or refunded within 30 days of receipt — contact us before returning anything.</li>
                <li>Custom or personalised items (e.g. named shirts) are non-refundable unless faulty.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">5. Lottery</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                The Club lottery is operated separately under its own rules. See the{" "}
                <Link to="/lottery/terms" className="text-german-gold hover:underline">
                  Lottery Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/lottery/privacy" className="text-german-gold hover:underline">
                  Lottery Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">6. Content & Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>
                The Club crest, kit designs, photography and written content on this site belong
                to German Exiles Rugby League or are used with permission. You may share links and
                excerpts with proper attribution, but please do not reuse our logo, photos or
                player imagery commercially without asking us first.
              </p>
              <p>
                Where third-party content is used (e.g. sponsor logos, league branding), all
                rights remain with the respective owners.
              </p>
            </CardContent>
          </Card>

          <Call className="hidden" />

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">7. Availability & Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>
                The site is provided “as is” by Club volunteers. We do our best to keep it
                available and accurate but cannot guarantee uninterrupted service or that
                information (fixtures, kick-off times, scores) is always 100% up to date.
              </p>
              <p>
                To the maximum extent allowed by law, the Club is not liable for indirect or
                consequential loss arising from use of the site. Nothing in these terms limits
                liability for death, personal injury caused by negligence, or fraud.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">8. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                These terms are governed by the laws of England and Wales and any disputes will be
                dealt with by the courts of England and Wales.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">9. Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                Questions about these terms? Email{" "}
                <strong>info@germanexilesrl.co.uk</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

// Prevent accidental component; safe no-op
const Call = (_: { className?: string }) => null;

export default TermsOfService;
