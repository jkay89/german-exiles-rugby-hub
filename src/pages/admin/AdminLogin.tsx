
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, loading } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Wait for auth state to load before redirecting
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [loading, isAuthenticated, navigate]);

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">
          <p>Loading auth state...</p>
          <p className="text-sm text-gray-400 mt-2">If this persists, there may be a database connection issue</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and we're still loading role, show login form anyway
  if (isAuthenticated) {
    return (
      <div className="pt-16 min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>You are already authenticated.</p>
          <button 
            onClick={() => navigate("/admin/dashboard")} 
            className="mt-4 px-4 py-2 bg-german-red text-white rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg border border-gray-800">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm text-gray-400 block mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="text-sm text-gray-400 block mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-german-red hover:bg-german-gold text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
