import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  imageUrl: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === item.productId && c.size === item.size);
      if (existing) {
        return prev.map(c =>
          c.productId === item.productId && c.size === item.size
            ? { ...c, quantity: c.quantity + item.quantity }
            : c
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart(prev => prev.filter(c => !(c.productId === productId && c.size === size)));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev => prev.map(c =>
      c.productId === productId && c.size === size ? { ...c, quantity } : c
    ));
  };

  const clearCart = () => setCart([]);

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};
