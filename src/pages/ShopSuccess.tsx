import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShopSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-10 px-4 max-w-xl mx-auto flex items-center justify-center min-h-[80vh]">
        <Card className="w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. You will receive a confirmation email shortly.
              Our team will dispatch your order as soon as possible.
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
              <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopSuccess;
