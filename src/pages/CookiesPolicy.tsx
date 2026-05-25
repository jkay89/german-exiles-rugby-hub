import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";

const CookiesPolicy = () => {
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
            <Cookie className="w-12 h-12 text-german-gold mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-3">Cookies Policy</h1>
            <p className="text-lg text-muted-foreground">
              How germanexilesrl.co.uk uses cookies and similar technologies.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: {updated}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">What are cookies?</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>
                Cookies are small text files placed on your device when you visit a website. They
                let the site remember you between pages and visits. We also use similar
                technologies such as local storage.
              </p>
              <p>
                German Exiles Rugby League is an amateur club, not a commercial business — we only
                use cookies that are necessary to make the site work and a small amount of
                anonymous analytics to help us improve it.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">Cookies we use</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-1">Strictly necessary</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Authentication / session cookies (Supabase) — keep you logged in to the lottery or admin area.</li>
                  <li>Security tokens — protect forms and payment flows from abuse.</li>
                  <li>Shopping cart storage — remembers items in your basket.</li>
                  <li>Language preference — remembers EN/DE selection.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Functional</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Stripe — secure checkout for tickets, shop and lottery payments.</li>
                  <li>Cloudinary — delivery of optimised images and video.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Analytics (anonymous)</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Basic, aggregated visit statistics so we can see which pages are useful. No advertising or cross-site tracking cookies are set by us.</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                We do <strong>not</strong> use advertising cookies, third-party marketing trackers,
                or sell data to advertisers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">Managing cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>
                You can clear or block cookies in your browser settings at any time. If you block
                strictly necessary cookies, parts of the site (login, basket, lottery, ticket
                purchases) may not work properly.
              </p>
              <p>
                Most browsers also offer a “Do Not Track” option which we respect for any
                non-essential analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-german-gold">Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                Questions about cookies? Email{" "}
                <strong>info@germanexilesrl.co.uk</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CookiesPolicy;
