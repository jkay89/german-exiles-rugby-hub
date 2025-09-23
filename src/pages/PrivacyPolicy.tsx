import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Mail, Phone, MapPin } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/lottery" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Lottery
            </Link>
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy & GDPR Compliance</h1>
            <p className="text-xl text-gray-400">
              How German Exiles Rugby League protects and processes your personal data
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">1. Data Controller Information</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Organisation Details:</h4>
                  <p><strong>Name:</strong> German Exiles Rugby League</p>
                  <p><strong>Type:</strong> Amateur Sports Club</p>
                  <p><strong>Registration:</strong> Registered Sports Association in Germany</p>
                  <p><strong>Contact Email:</strong> privacy@germanexilesrl.co.uk</p>
                  <p><strong>General Enquiries:</strong> info@germanexilesrl.co.uk</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Data Protection Contact:</h4>
                  <p>For all data protection enquiries, please contact us at: <strong>privacy@germanexilesrl.co.uk</strong></p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">2. Personal Data We Collect</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">For Lottery Participation:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Email address (required for account creation and communications)</li>
                    <li>Date of birth (to verify you are 18+ as required by law)</li>
                    <li>Password (encrypted and stored securely)</li>
                    <li>Lottery number selections and entry history</li>
                    <li>Payment information (processed securely by Stripe)</li>
                    <li>Subscription preferences and status</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Technical Data:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>IP address and browser information</li>
                    <li>Device type and operating system</li>
                    <li>Website usage analytics (anonymised)</li>
                    <li>Cookie preferences and settings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">3. Legal Basis for Processing</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Contract Performance (Article 6(1)(b) GDPR):</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Processing your lottery entries and managing your subscription</li>
                    <li>Processing payments and refunds</li>
                    <li>Notifying you of lottery results and winnings</li>
                    <li>Providing customer support related to your account</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Legal Obligation (Article 6(1)(c) GDPR):</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Age verification to comply with UK gambling regulations</li>
                    <li>Financial record keeping as required by law</li>
                    <li>Anti-money laundering compliance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Legitimate Interest (Article 6(1)(f) GDPR):</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Website analytics to improve user experience</li>
                    <li>Security monitoring and fraud prevention</li>
                    <li>Club communications and updates (with opt-out available)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">4. How We Use Your Data</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Lottery Administration:</strong> Managing your entries, processing draws, and notifying winners</li>
                  <li><strong>Payment Processing:</strong> Handling subscription payments and prize distributions</li>
                  <li><strong>Account Management:</strong> Maintaining your user account and preferences</li>
                  <li><strong>Communications:</strong> Sending lottery updates, results, and club news (where consented)</li>
                  <li><strong>Legal Compliance:</strong> Meeting regulatory requirements for lottery operations</li>
                  <li><strong>Security:</strong> Protecting against fraud and ensuring system security</li>
                  <li><strong>Analytics:</strong> Understanding website usage to improve our services (anonymised data only)</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">5. Data Sharing and Third Parties</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Payment Processing:</h4>
                  <p>We use <strong>Stripe Inc.</strong> for secure payment processing. Stripe is PCI DSS compliant and processes your payment data according to their privacy policy. We do not store your full payment card details on our systems.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Technical Services:</h4>
                  <p>We use <strong>Supabase</strong> for database hosting and user authentication. All data is processed within the EU/EEA or under appropriate safeguards.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Email Communications:</h4>
                  <p>We use <strong>Resend</strong> for sending lottery notifications and updates. Only necessary contact information is shared.</p>
                </div>
                <div>
                  <p><strong>We do not sell, rent, or trade your personal data to third parties for marketing purposes.</strong></p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">6. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Active Accounts:</strong> Data retained while your account is active and for 3 months after account closure</li>
                  <li><strong>Financial Records:</strong> Payment and lottery entry records retained for 7 years as required by UK financial regulations</li>
                  <li><strong>Winner Information:</strong> Details of lottery wins retained permanently for audit and verification purposes</li>
                  <li><strong>Marketing Preferences:</strong> Retained until you withdraw consent or for 2 years of inactivity</li>
                  <li><strong>Security Logs:</strong> Retained for 12 months for fraud prevention and security purposes</li>
                </ul>
                <p className="mt-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                  <strong>Note:</strong> You can request earlier deletion of your data, but we may need to retain certain information to comply with legal obligations.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">7. Your Rights Under GDPR</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Access & Portability:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Request a copy of your personal data</li>
                      <li>Receive your data in a portable format</li>
                      <li>Transfer your data to another service</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Correction & Deletion:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Correct inaccurate personal data</li>
                      <li>Request deletion of your data</li>
                      <li>Restrict processing in certain cases</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Objection & Consent:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Object to processing for legitimate interests</li>
                      <li>Withdraw consent at any time</li>
                      <li>Opt-out of marketing communications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Complaints:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Lodge a complaint with the ICO (UK)</li>
                      <li>Lodge a complaint with your local DPA</li>
                      <li>Contact us directly to resolve issues</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">How to Exercise Your Rights:</h4>
                  <p>Email us at <strong>privacy@germanexilesrl.co.uk</strong> with your request. We will respond within 30 days and may require identity verification for security purposes.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">8. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Essential Cookies:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Authentication tokens to keep you logged in</li>
                    <li>Security cookies to protect against attacks</li>
                    <li>Session management for lottery entries</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Analytics Cookies (Optional):</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Website usage statistics (anonymised)</li>
                    <li>Performance monitoring</li>
                    <li>User experience improvements</li>
                  </ul>
                </div>
                <p className="text-sm">You can manage cookie preferences through your browser settings. Disabling essential cookies may affect website functionality.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">9. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Technical Safeguards:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>SSL/TLS encryption for all data transmission</li>
                    <li>Password encryption using industry-standard hashing</li>
                    <li>Regular security updates and monitoring</li>
                    <li>Access controls and authentication systems</li>
                    <li>Regular backups with encryption at rest</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Organisational Measures:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Limited access to personal data on need-to-know basis</li>
                    <li>Staff training on data protection requirements</li>
                    <li>Regular reviews of data processing activities</li>
                    <li>Incident response procedures for data breaches</li>
                  </ul>
                </div>
                <div className="mt-4 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Data Breach Notification:</h4>
                  <p>In the unlikely event of a data breach that poses a risk to your rights, we will notify the relevant authorities within 72 hours and inform affected users without undue delay.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">10. International Transfers</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>Your data is primarily processed within the European Union. Where data is transferred outside the EU/EEA:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Stripe:</strong> Uses Standard Contractual Clauses and adequacy decisions for secure transfers</li>
                  <li><strong>Supabase:</strong> Offers EU hosting with data residency controls</li>
                  <li><strong>Resend:</strong> Operates with appropriate safeguards for international transfers</li>
                </ul>
                <p>All transfers are made under appropriate safeguards as required by GDPR Article 46.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">11. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p className="font-semibold text-white">Our lottery is strictly for adults aged 18 and over.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>We do not knowingly collect data from anyone under 18</li>
                  <li>Age verification is required during registration</li>
                  <li>If we discover data from a minor, we will delete it immediately</li>
                  <li>Parents/guardians can contact us if they believe we have data from their child</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">12. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      Data Protection Enquiries
                    </h4>
                    <p><strong>Email:</strong> privacy@germanexilesrl.co.uk</p>
                    <p><strong>Response Time:</strong> Within 30 days</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-400" />
                      General Contact
                    </h4>
                    <p><strong>Email:</strong> info@germanexilesrl.co.uk</p>
                    <p><strong>Website:</strong> www.germanexilesrl.co.uk</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    Regulatory Authorities
                  </h4>
                  <div className="text-sm">
                    <p><strong>UK Data Protection:</strong> Information Commissioner's Office (ICO)</p>
                    <p>Website: ico.org.uk | Helpline: 0303 123 1113</p>
                    <p><strong>German Data Protection:</strong> Your local state data protection authority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">13. Policy Updates</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We may update this privacy policy to reflect changes in:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Legal requirements or regulatory guidance</li>
                  <li>Our data processing activities</li>
                  <li>Technology or security improvements</li>
                  <li>Feedback from users or authorities</li>
                </ul>
                <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <p><strong>Notification of Changes:</strong> We will notify you of significant changes via email or prominent notice on our website. Continued use of our services after changes indicates acceptance of the updated policy.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back to top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-center pt-8"
          >
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/lottery">Return to Lottery</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;