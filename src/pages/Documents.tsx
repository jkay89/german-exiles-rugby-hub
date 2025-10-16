import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { fetchDocuments, Document } from "@/utils/documentUtils";
import { Loader2, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PageWithPositionedElements } from "@/components/PageWithPositionedElements";

const Documents = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const data = await fetchDocuments();
        console.log("Fetched documents:", data);
        setDocuments(data);
      } catch (error) {
        console.error("Error loading documents:", error);
        toast({
          title: "Error loading documents",
          description: error instanceof Error ? error.message : "Failed to load documents",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDocuments();
  }, [toast]);

  const handleDownload = async (document: Document) => {
    try {
      toast({
        title: "Downloading document",
        description: `Preparing ${document.title}...`,
      });

      // Use edge function to proxy the download
      const { data, error } = await supabase.functions.invoke('download-document', {
        body: { url: document.file_url }
      });

      if (error) throw error;

      // Create blob from the response
      const blob = new Blob([data], { 
        type: document.file_type || 'application/octet-stream' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.title}.${document.file_type.split('/')[1] || 'pdf'}`;
      
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download complete",
        description: `Downloaded ${document.title}`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Could not download the document. Please try re-uploading it from the admin panel.",
        variant: "destructive",
      });
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'constitution':
        return t('constitution');
      case 'code_of_conduct':
        return t('code_of_conduct');
      case 'meeting_minutes':
        return t('meeting_minutes');
      case 'agm_minutes':
        return t('agm_minutes');
      default:
        return category;
    }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <PageWithPositionedElements page="documents">
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
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4 text-german-gold">{t("documents_title")}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            {t("documents_description")}
          </p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 text-german-gold animate-spin" />
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedDocuments).map(([category, categoryDocuments]) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-german-gold mb-6 text-center">
                    {getCategoryDisplayName(category)}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryDocuments.map((document, index) => (
                      <motion.div
                        key={document.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-black border-german-red hover:border-german-gold transition-colors duration-300 h-full">
                          <CardHeader className="flex flex-col items-center">
                            <FileText className="h-12 w-12 text-german-gold mb-4" />
                            <h3 className="text-lg font-bold text-white text-center">{document.title}</h3>
                            {document.description && (
                              <p className="text-sm text-gray-300 text-center mt-2">
                                {document.description}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent className="text-center">
                            <Button 
                              className="bg-german-red hover:bg-german-gold text-white"
                              onClick={() => handleDownload(document)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t("download_document")}
                            </Button>
                            <p className="text-xs text-gray-400 mt-2">
                              {document.file_type.toUpperCase()}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(groupedDocuments).length === 0 && (
                <div className="text-center py-20">
                  <FileText className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No documents available yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </PageWithPositionedElements>
  );
};

export default Documents;