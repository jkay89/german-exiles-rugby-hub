import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

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
}

interface ProductSize {
  id: string;
  product_id: string;
  size: string;
  stock_quantity: number;
}

const CATEGORIES = ["All", "Jerseys", "Training Wear", "Casual Wear", "Accessories", "Equipment", "Memorabilia"];

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<Record<string, ProductSize[]>>({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data: productData } = await supabase.from("products").select("*").eq("is_active", true).order("name");
    if (productData) {
      setProducts(productData);
      // Fetch sizes for products that have them
      const sizedProducts = productData.filter(p => p.has_sizes);
      if (sizedProducts.length > 0) {
        const { data: sizeData } = await supabase
          .from("product_sizes")
          .select("*")
          .in("product_id", sizedProducts.map(p => p.id))
          .order("display_order");
        if (sizeData) {
          const grouped: Record<string, ProductSize[]> = {};
          sizeData.forEach(s => {
            if (!grouped[s.product_id]) grouped[s.product_id] = [];
            grouped[s.product_id].push(s);
          });
          setSizes(grouped);
        }
      }
    }
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  const getStockStatus = (product: Product) => {
    if (product.has_sizes) {
      const productSizes = sizes[product.id];
      if (!productSizes) return { inStock: false, label: "Loading..." };
      const totalStock = productSizes.reduce((sum, s) => sum + s.stock_quantity, 0);
      return { inStock: totalStock > 0, label: totalStock > 0 ? "In Stock" : "Out of Stock" };
    }
    return { inStock: product.stock_quantity > 0, label: product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of Stock" };
  };

  const getSizeStock = (productId: string, size: string) => {
    const productSizes = sizes[productId];
    if (!productSizes) return 0;
    const found = productSizes.find(s => s.size === size);
    return found ? found.stock_quantity : 0;
  };

  const getMaxQuantity = (product: Product) => {
    if (product.has_sizes) {
      const selectedSize = selectedSizes[product.id];
      if (!selectedSize) return 0;
      return getSizeStock(product.id, selectedSize);
    }
    return product.stock_quantity;
  };

  const handleAddToCart = (product: Product) => {
    const qty = selectedQuantities[product.id] || 1;
    const size = product.has_sizes ? selectedSizes[product.id] : undefined;
    if (product.has_sizes && !size) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      size,
      imageUrl: product.image_url,
    });
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient">German Exiles Shop</h1>
            <p className="text-muted-foreground mt-1">Official merchandise and gear</p>
          </div>
          <Button variant="outline" className="relative border-german-gold/50 hover:border-german-gold" onClick={() => navigate("/shop/cart")}>
            <ShoppingCart className="h-5 w-5 mr-2" /> Cart
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-german-red text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              className={selectedCategory === cat ? "bg-german-red hover:bg-german-red/90" : "border-border"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const stock = getStockStatus(product);
            const maxQty = getMaxQuantity(product);
            return (
              <Card key={product.id} className="overflow-hidden flex flex-col border-border/50 hover:border-german-gold/30 transition-colors">
                <div className="aspect-square bg-muted relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                  )}
                  {!stock.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <Badge variant="secondary" className="self-start mb-2">{product.category}</Badge>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  {product.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>}
                  <p className="text-xl font-bold mt-2">£{product.price.toFixed(2)}</p>
                  <p className={`text-sm mt-1 ${stock.inStock ? "text-german-gold" : "text-destructive"}`}>{stock.label}</p>

                  {stock.inStock && (
                    <div className="mt-auto pt-4 space-y-2">
                      {product.has_sizes && (
                        <Select value={selectedSizes[product.id] || ""} onValueChange={(v) => setSelectedSizes(prev => ({ ...prev, [product.id]: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                          <SelectContent>
                            {(sizes[product.id] || []).map(s => (
                              <SelectItem key={s.id} value={s.size} disabled={s.stock_quantity === 0}>
                                {s.size} {s.stock_quantity === 0 ? "(Out of stock)" : `(${s.stock_quantity})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <div className="flex items-center gap-2">
                        <Select
                          value={String(selectedQuantities[product.id] || 1)}
                          onValueChange={(v) => setSelectedQuantities(prev => ({ ...prev, [product.id]: parseInt(v) }))}
                        >
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: Math.min(maxQty || 1, 10) }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.has_sizes && !selectedSizes[product.id]}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
