import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, ArrowLeft, AlertCircle, CheckCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Reset form state when switching tabs
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setDateOfBirth("");
    setTermsAccepted(false);
    setError("");
    setSuccessMessage("");
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/lottery");
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/lottery");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please check your email and click the confirmation link before signing in.");
        } else {
          setError(error.message);
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    if (!dateOfBirth) {
      setError("Please enter your date of birth.");
      setIsLoading(false);
      return;
    }

    const age = calculateAge(dateOfBirth);
    if (age < 18) {
      setError("You must be 18 or over to register for the lottery.");
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("Please read and accept the Terms & Conditions to continue.");
      setIsLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/lottery`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setError("An account with this email already exists. Please sign in instead.");
        } else {
          setError(error.message);
        }
      } else {
        setSuccessMessage("Please check your email for a confirmation link to complete your registration.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-md mx-auto">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </section>

      {/* Auth Forms */}
      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">
                  German Exiles Lottery
                </CardTitle>
                <p className="text-gray-400">Sign in or create an account to play</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="space-y-6" onValueChange={resetForm}>
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-blue-600">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {/* Error/Success Messages */}
                  {error && (
                    <Alert className="border-red-600/50 bg-red-600/10">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-400">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {successMessage && (
                    <Alert className="border-green-600/50 bg-green-600/10">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-400">
                        {successMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Sign In Form */}
                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-white">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-white">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Sign Up Form */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-white">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-white">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Choose a password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700 text-white"
                            minLength={6}
                            required
                          />
                        </div>
                      </div>

                       <div className="space-y-2">
                         <Label htmlFor="confirm-password" className="text-white">
                           Confirm Password
                         </Label>
                         <div className="relative">
                           <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                           <Input
                             id="confirm-password"
                             type="password"
                             placeholder="Confirm your password"
                             value={confirmPassword}
                             onChange={(e) => setConfirmPassword(e.target.value)}
                             className="pl-10 bg-gray-800 border-gray-700 text-white"
                             required
                           />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <Label htmlFor="signup-dob" className="text-white">
                           Date of Birth
                         </Label>
                         <div className="relative">
                           <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                           <Input
                             id="signup-dob"
                             type="date"
                             value={dateOfBirth}
                             onChange={(e) => setDateOfBirth(e.target.value)}
                             className="pl-10 bg-gray-800 border-gray-700 text-white"
                             required
                           />
                         </div>
                         <p className="text-xs text-gray-400">You must be 18 or over to participate</p>
                       </div>

                       <div className="space-y-2">
                         <div className="flex items-start space-x-2">
                           <Checkbox
                             id="terms"
                             checked={termsAccepted}
                             onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                             className="border-gray-600 data-[state=checked]:bg-blue-600"
                           />
                           <Label 
                             htmlFor="terms" 
                             className="text-sm text-gray-300 leading-5 cursor-pointer"
                           >
                             I have read and agree to the{" "}
                             <Link 
                               to="/lottery/terms" 
                               className="text-blue-400 hover:text-blue-300 underline"
                               target="_blank"
                             >
                               Terms and Conditions
                             </Link>
                           </Label>
                         </div>
                       </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-dob" className="text-white">
                          Date of Birth
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-dob"
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-400">You must be 18 or over to participate</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms"
                            checked={termsAccepted}
                            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                            className="border-gray-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label 
                            htmlFor="terms" 
                            className="text-sm text-gray-300 leading-5 cursor-pointer"
                          >
                            I have read and agree to the{" "}
                            <Link 
                              to="/lottery/terms" 
                              className="text-blue-400 hover:text-blue-300 underline"
                              target="_blank"
                            >
                              Terms and Conditions
                            </Link>
                          </Label>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <Separator className="my-6 bg-gray-700" />

                <div className="text-center text-sm text-gray-400">
                  <p>
                    By creating an account, you agree to our{" "}
                    <Link to="/lottery/terms" className="text-blue-400 hover:text-blue-300">
                      Terms & Conditions
                    </Link>
                  </p>
                  <p className="mt-2">
                    Must be 18+ to participate in the lottery
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AuthPage;