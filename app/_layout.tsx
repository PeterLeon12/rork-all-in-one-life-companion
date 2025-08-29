import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { UserProvider } from "@/contexts/UserContext";
import { trpc, trpcClient } from "@/lib/trpc";
import AuthGuard from "@/components/AuthGuard";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <CategoryProvider>
            <GestureHandlerRootView>
              <AuthGuard>
                <RootLayoutNav />
              </AuthGuard>
            </GestureHandlerRootView>
          </CategoryProvider>
        </UserProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
