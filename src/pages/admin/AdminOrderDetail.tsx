import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAdmin();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data: o, error: oErr } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (oErr) { toast.error(oErr.message); setLoading(false); return; }
      setOrder(o);
      const { data: it } = await supabase.from("order_items").select("*").eq("order_id", id);
      setItems(it || []);
      setLoading(false);
    })();
  }, [id]);

  const updateStatus = async (status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setOrder({ ...order, status });
    toast.success("Status updated");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/admin/shop")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
        </Button>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : !order ? (
          <p className="text-muted-foreground">Order not found.</p>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Select value={order.status} onValueChange={updateStatus}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p>{order.customer_name}</p>
                  <p>{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shipping</p>
                  <p>{order.shipping_address_line1}</p>
                  {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                  <p>{order.shipping_city}, {order.shipping_postcode}</p>
                  <p>{order.shipping_country}</p>
                  <p className="text-muted-foreground mt-1">Method: {order.shipping_type}</p>
                </div>
                {order.notes && (
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Notes</p>
                    <p>{order.notes}</p>
                  </div>
                )}
                {order.stripe_session_id && (
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Stripe Session</p>
                    <p className="break-all text-xs">{order.stripe_session_id}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Items</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit £</TableHead>
                      <TableHead className="text-right">Total £</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(it => (
                      <TableRow key={it.id}>
                        <TableCell>{it.product_name}</TableCell>
                        <TableCell>{it.size || "-"}</TableCell>
                        <TableCell>{it.quantity}</TableCell>
                        <TableCell>£{Number(it.unit_price).toFixed(2)}</TableCell>
                        <TableCell className="text-right">£{(Number(it.unit_price) * it.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {items.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No items</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="flex flex-col items-end gap-1 mt-4 text-sm">
                  <p>Subtotal: £{Number(order.subtotal).toFixed(2)}</p>
                  <p>Shipping: £{Number(order.shipping_cost).toFixed(2)}</p>
                  <p className="font-bold text-base">Total: £{Number(order.total).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetail;
