import { useState, useCallback, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

const WISHLIST_KEY = "@luxury_jewelry_wishlist";

export const [WishlistProvider, useWishlist] = createContextHook(() => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const stored = await AsyncStorage.getItem(WISHLIST_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = useCallback(async (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      
      AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist)).catch((error) => {
        console.error("Failed to save wishlist:", error);
      });
      
      return newWishlist;
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const clearWishlist = useCallback(async () => {
    setWishlist([]);
    try {
      await AsyncStorage.removeItem(WISHLIST_KEY);
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
    }
  }, []);

  return useMemo(
    () => ({
      wishlist,
      isLoading,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    }),
    [wishlist, isLoading, toggleWishlist, isInWishlist, clearWishlist]
  );
});
