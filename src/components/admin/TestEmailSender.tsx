import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const TestEmailSender = () => {
  const [emailAddress, setEmailAddress] = useState("jay@germanexilesrl.co.uk");
  const [isLoading, setIsLoading] = useState(false);

  const sendTestEmails = async () => {
    if (!emailAddress) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-test-emails', {
        body: { emailAddress }
      });

      if (error) throw error;

      toast.success(`Test emails sent successfully to ${emailAddress}`);
    } catch (error) {
      console.error("Error sending test emails:", error);
      toast.error("Failed to send test emails: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Test Emails
        </CardTitle>
        <CardDescription>
          Send test copies of all lottery email templates to verify formatting and content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <Button 
          onClick={sendTestEmails}
          disabled={isLoading || !emailAddress}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? "Sending..." : "Send All Test Emails"}
        </Button>
        <div className="text-sm text-muted-foreground">
          <p>This will send 3 test emails:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Purchase confirmation email</li>
            <li>Subscription confirmation email</li>
            <li>Monthly reminder email</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};