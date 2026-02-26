import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react";

interface ShippingRate {
  id: string;
  name: string;
  rate: number;
  shipping_type: string;
}

const INTERNATIONAL_COUNTRIES = ["US", "CA", "AU", "NZ", "ZA", "DE", "FR", "ES", "IT", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PT", "IE", "PL", "CZ", "HU", "RO", "BG", "HR", "GR", "JP", "KR", "CN", "IN", "BR", "MX", "AR"];

const ShopCart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const navigate = useNavigate();
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [shippingType, setShippingType] = useState("standard");
  const [processing, setProcessing] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("GB");

  useEffect(() => {
    fetchShippingRates();
  }, []);

  // Auto-select international shipping for non-GB countries
  useEffect(() => {
    if (INTERNATIONAL_COUNTRIES.includes(country)) {
      setShippingType("international");
    } else if (country !== "GB") {
      setShippingType("international");
    }
  }, [country]);

  const fetchShippingRates = async () => {
    const { data } = await supabase.from("shipping_rates").select("*").eq("is_active", true);
    if (data) setShippingRates(data);
  };

  const getShippingCost = () => {
    const rate = shippingRates.find(r => r.shipping_type === shippingType);
    return rate ? rate.rate : 0;
  };

  const subtotal = getTotal();
  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (!name || !email || !addressLine1 || !city || !postcode || !country) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-shop-payment", {
        body: {
          items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
          })),
          customer: { name, email, addressLine1, addressLine2, city, postcode, country },
          shippingType,
          shippingCost,
          subtotal,
          total,
        },
      });

      if (error) throw error;
      if (data?.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20 pb-10 px-4 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mt-10 mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some items from the shop to get started.</p>
          <Button onClick={() => navigate("/shop")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/shop")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader><CardTitle>Shopping Cart ({cart.length} items)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item, i) => (
                  <div key={`${item.productId}-${item.size}-${i}`} className="flex items-center gap-4 p-3 border rounded-lg">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="h-16 w-16 object-cover rounded" />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                      <p className="font-semibold">£{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold w-20 text-right">£{(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId, item.size)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Details */}
            <Card>
              <CardHeader><CardTitle>Delivery Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <Label>Address Line 1 *</Label>
                  <Input value={addressLine1} onChange={e => setAddressLine1(e.target.value)} placeholder="123 High Street" />
                </div>
                <div>
                  <Label>Address Line 2</Label>
                  <Input value={addressLine2} onChange={e => setAddressLine2(e.target.value)} placeholder="Flat 2" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} placeholder="London" />
                  </div>
                  <div>
                    <Label>Postcode *</Label>
                    <Input value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="SW1A 1AA" />
                  </div>
                  <div>
                    <Label>Country *</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="IE">Ireland</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="NL">Netherlands</SelectItem>
                        <SelectItem value="BE">Belgium</SelectItem>
                        <SelectItem value="AT">Austria</SelectItem>
                        <SelectItem value="CH">Switzerland</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {country === "GB" && (
                  <div>
                    <Label>Delivery Method</Label>
                    <Select value={shippingType} onValueChange={setShippingType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {shippingRates.filter(r => r.shipping_type !== "international").map(r => (
                          <SelectItem key={r.id} value={r.shipping_type}>
                            {r.name} - £{r.rate.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>£{shippingCost.toFixed(2)}</span></div>
                <Separator />
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span>£{total.toFixed(2)}</span></div>
                <Button className="w-full mt-4" size="lg" onClick={handleCheckout} disabled={processing}>
                  {processing ? "Processing..." : `Pay £${total.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
