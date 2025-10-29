import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartProvider } from "@/contexts/CartContext";

import { UserProvider } from "@/contexts/UserContext";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ title: "Product Details" }} />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = React.useState(false);
  const [trpcClient] = useState(() => {
    const getBaseUrl = () => {
      if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
        return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
      }
      throw new Error("No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL");
    };

    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          async headers() {
            const token = await AsyncStorage.getItem('adminToken');
            return token ? { authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    });
  });

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <CartProvider>
            <WishlistProvider>
              <GestureHandlerRootView>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
