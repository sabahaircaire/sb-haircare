import "../global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { brandFonts } from "@/theme/fonts";
import { useAuth } from "@/store/auth";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(brandFonts);
  const bootstrap = useAuth((s) => s.bootstrap);
  const authLoading = useAuth((s) => s.loading);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, authLoading]);

  if ((!fontsLoaded && !fontError) || authLoading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#FFFFFF" },
            }}
          >
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="wash" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
