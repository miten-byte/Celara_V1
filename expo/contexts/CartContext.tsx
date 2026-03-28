import { useState, useCallback, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

const CART_KEY = "@celara_cart";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  metal?: string;
  size?: string;
  quantity: number;
}

export const [CartProvider, useCart] = createContextHook(() => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(CART_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCart = async (cartData: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  };

  const addToCart = useCallback(
    (item: Omit<CartItem, "id" | "quantity">) => {
      setCart((prev) => {
        const existingItemIndex = prev.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.metal === item.metal &&
            i.size === item.size
        );

        let newCart: CartItem[];
        if (existingItemIndex > -1) {
          newCart = prev.map((i, idx) =>
            idx === existingItemIndex
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          const newItem: CartItem = {
            ...item,
            id: `${item.productId}-${Date.now()}`,
            quantity: 1,
          };
          newCart = [...prev, newItem];
        }

        saveCart(newCart);
        return newCart;
      });
    },
    []
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== itemId);
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
    try {
      await AsyncStorage.removeItem(CART_KEY);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, []);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return useMemo(
    () => ({
      cart,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
    }),
    [cart, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount]
  );
});
