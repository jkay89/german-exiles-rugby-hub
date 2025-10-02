
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { uploadToCloudinary } from "@/utils/cloudinaryUtils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit, Plus, Trash2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";

interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
}

const AdminSponsors = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      fetchSponsors();
    }
  }, [isAuthenticated, navigate]);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('tier', { ascending: true });

      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      toast({
        title: "Error fetching sponsors",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    toast({
      title: "Uploading logo",
      description: "Please wait while we upload to Cloudinary...",
    });

    const result = await uploadToCloudinary(file, 'sponsors');
    return result.url;
  };

  const handleSponsorSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      let logoUrl = formData.logo_url;

      if (selectedFile) {
        logoUrl = await uploadLogo(selectedFile);
      }

      if (isEditing) {
        const { error } = await supabase
          .from('sponsors')
          .update({
            ...formData,
            logo_url: logoUrl,
            updated_at: new Date(),
          })
          .eq('id', isEditing);

        if (error) throw error;

        toast({
          title: "Sponsor updated",
          description: "The sponsor has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('sponsors')
          .insert([{
            ...formData,
            logo_url: logoUrl,
          }]);

        if (error) throw error;

        toast({
          title: "Sponsor created",
          description: "The new sponsor has been created successfully",
        });
      }

      setIsEditing(null);
      setSelectedFile(null);
      fetchSponsors();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sponsor?')) {
      try {
        const { error } = await supabase
          .from('sponsors')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Sponsor deleted",
          description: "The sponsor has been deleted successfully",
        });

        fetchSponsors();
      } catch (error) {
        toast({
          title: "Error deleting sponsor",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Sponsor Management</h1>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isEditing ? "Edit Sponsor" : "Add New Sponsor"}
          </h2>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData);
            handleSponsorSubmit(data);
          }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <Input
                  name="name"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tier</label>
                <select
                  name="tier"
                  required
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="affiliate">Affiliate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Website URL</label>
                <Input
                  name="website_url"
                  type="url"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Logo</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(null)}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading} className="bg-german-red hover:bg-german-gold">
                {isLoading ? "Processing..." : isEditing ? "Update Sponsor" : "Add Sponsor"}
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Existing Sponsors</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Tier</TableHead>
                  <TableHead className="text-white">Website</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell className="text-white">{sponsor.name}</TableCell>
                    <TableCell className="text-white capitalize">{sponsor.tier}</TableCell>
                    <TableCell className="text-white">
                      {sponsor.website_url ? (
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-german-gold hover:underline"
                        >
                          Visit Website
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditing(sponsor.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(sponsor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSponsors;
