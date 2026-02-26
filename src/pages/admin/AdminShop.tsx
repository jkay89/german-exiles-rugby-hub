import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package, Truck, ShoppingBag } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  has_sizes: boolean;
  stock_quantity: number;
  created_at: string;
}

interface ProductSize {
  id: string;
  product_id: string;
  size: string;
  stock_quantity: number;
  display_order: number;
}

interface ShippingRate {
  id: string;
  name: string;
  rate: number;
  shipping_type: string;
  is_active: boolean;
}

interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  shipping_city: string;
  shipping_country: string;
  shipping_type: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  created_at: string;
}

const CATEGORIES = ["Jerseys", "Training Wear", "Casual Wear", "Accessories", "Equipment", "Memorabilia"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const AdminShop = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Product form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("Jerseys");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formHasSizes, setFormHasSizes] = useState(false);
  const [formStockQuantity, setFormStockQuantity] = useState("0");
  const [formSizes, setFormSizes] = useState<{size: string; quantity: number}[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }
    fetchProducts();
    fetchOrders();
    fetchShippingRates();
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const fetchShippingRates = async () => {
    const { data } = await supabase.from("shipping_rates").select("*").order("shipping_type");
    if (data) setShippingRates(data);
  };

  const fetchProductSizes = async (productId: string) => {
    const { data } = await supabase.from("product_sizes").select("*").eq("product_id", productId).order("display_order");
    if (data) setProductSizes(data);
  };

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormCategory("Jerseys");
    setFormIsActive(true);
    setFormHasSizes(false);
    setFormStockQuantity("0");
    setFormSizes([]);
    setImageFile(null);
    setEditingProduct(null);
  };

  const openEditProduct = async (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormDescription(product.description || "");
    setFormPrice(String(product.price));
    setFormCategory(product.category);
    setFormIsActive(product.is_active);
    setFormHasSizes(product.has_sizes);
    setFormStockQuantity(String(product.stock_quantity));
    if (product.has_sizes) {
      const { data } = await supabase.from("product_sizes").select("*").eq("product_id", product.id).order("display_order");
      if (data) setFormSizes(data.map(s => ({ size: s.size, quantity: s.stock_quantity })));
    } else {
      setFormSizes([]);
    }
    setShowProductDialog(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) {
      toast.error("Failed to upload image");
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSaveProduct = async () => {
    if (!formName || !formPrice) {
      toast.error("Name and price are required");
      return;
    }
    setLoading(true);
    try {
      let imageUrl = editingProduct?.image_url || null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        name: formName,
        description: formDescription || null,
        price: parseFloat(formPrice),
        category: formCategory,
        image_url: imageUrl,
        is_active: formIsActive,
        has_sizes: formHasSizes,
        stock_quantity: formHasSizes ? 0 : parseInt(formStockQuantity),
      };

      let productId: string;

      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id);
        if (error) throw error;
        productId = editingProduct.id;
        // Delete old sizes
        await supabase.from("product_sizes").delete().eq("product_id", productId);
      } else {
        const { data, error } = await supabase.from("products").insert(productData).select().single();
        if (error) throw error;
        productId = data.id;
      }

      // Insert sizes
      if (formHasSizes && formSizes.length > 0) {
        const sizesData = formSizes.map((s, i) => ({
          product_id: productId,
          size: s.size,
          stock_quantity: s.quantity,
          display_order: i,
        }));
        await supabase.from("product_sizes").insert(sizesData);
      }

      toast.success(editingProduct ? "Product updated" : "Product created");
      setShowProductDialog(false);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Product deleted");
      fetchProducts();
    }
  };

  const handleToggleProduct = async (id: string, isActive: boolean) => {
    await supabase.from("products").update({ is_active: !isActive }).eq("id", id);
    fetchProducts();
  };

  const handleUpdateShippingRate = async (id: string, rate: number) => {
    const { error } = await supabase.from("shipping_rates").update({ rate }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Shipping rate updated");
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Order status updated");
      fetchOrders();
    }
  };

  const addSizeRow = () => {
    setFormSizes([...formSizes, { size: "M", quantity: 0 }]);
  };

  const updateSizeRow = (index: number, field: "size" | "quantity", value: string | number) => {
    const updated = [...formSizes];
    if (field === "size") updated[index].size = value as string;
    else updated[index].quantity = value as number;
    setFormSizes(updated);
  };

  const removeSizeRow = (index: number) => {
    setFormSizes(formSizes.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-8 w-8" /> Shop Management
          </h1>
          <Button onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</Button>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-4">
            <TabsTrigger value="products"><Package className="h-4 w-4 mr-1" /> Products</TabsTrigger>
            <TabsTrigger value="orders"><ShoppingBag className="h-4 w-4 mr-1" /> Orders</TabsTrigger>
            <TabsTrigger value="shipping"><Truck className="h-4 w-4 mr-1" /> Shipping</TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Products</CardTitle>
                <Dialog open={showProductDialog} onOpenChange={(open) => { setShowProductDialog(open); if (!open) resetForm(); }}>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Name *</Label>
                        <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Price (£) *</Label>
                          <Input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select value={formCategory} onValueChange={setFormCategory}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Product Image</Label>
                        <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                        {editingProduct?.image_url && !imageFile && (
                          <img src={editingProduct.image_url} alt="" className="mt-2 h-20 w-20 object-cover rounded" />
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
                          <Label>Active</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={formHasSizes} onCheckedChange={setFormHasSizes} />
                          <Label>Has Sizes</Label>
                        </div>
                      </div>
                      {!formHasSizes && (
                        <div>
                          <Label>Stock Quantity</Label>
                          <Input type="number" value={formStockQuantity} onChange={(e) => setFormStockQuantity(e.target.value)} />
                        </div>
                      )}
                      {formHasSizes && (
                        <div>
                          <Label>Sizes & Stock</Label>
                          <div className="space-y-2 mt-2">
                            {formSizes.map((s, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Select value={s.size} onValueChange={(v) => updateSizeRow(i, "size", v)}>
                                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {SIZE_OPTIONS.map(so => <SelectItem key={so} value={so}>{so}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                                <Input type="number" className="w-24" placeholder="Qty" value={s.quantity} onChange={(e) => updateSizeRow(i, "quantity", parseInt(e.target.value) || 0)} />
                                <Button variant="ghost" size="sm" onClick={() => removeSizeRow(i)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addSizeRow}><Plus className="h-4 w-4 mr-1" /> Add Size</Button>
                          </div>
                        </div>
                      )}
                      <Button onClick={handleSaveProduct} disabled={loading} className="w-full">
                        {loading ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>
                          {p.image_url ? <img src={p.image_url} alt="" className="h-10 w-10 object-cover rounded" /> : <div className="h-10 w-10 bg-gray-200 rounded" />}
                        </TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>£{p.price.toFixed(2)}</TableCell>
                        <TableCell>{p.has_sizes ? "By size" : p.stock_quantity}</TableCell>
                        <TableCell>
                          <Switch checked={p.is_active} onCheckedChange={() => handleToggleProduct(p.id, p.is_active)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditProduct(p)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {products.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No products yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders">
            <Card>
              <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(o => (
                      <TableRow key={o.id}>
                        <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{o.customer_name}</TableCell>
                        <TableCell>{o.customer_email}</TableCell>
                        <TableCell>£{o.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Select value={o.status} onValueChange={(v) => handleUpdateOrderStatus(o.id, v)}>
                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="dispatched">Dispatched</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/admin/shop/order/${o.id}`)}>View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No orders yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SHIPPING TAB */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader><CardTitle>Shipping Rates</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shippingRates.map(sr => (
                    <div key={sr.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{sr.name}</p>
                        <p className="text-sm text-muted-foreground">Type: {sr.shipping_type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label>£</Label>
                        <Input
                          type="number"
                          step="0.01"
                          className="w-24"
                          defaultValue={sr.rate}
                          onBlur={(e) => handleUpdateShippingRate(sr.id, parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminShop;
