import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "@/context/ThemeProvider";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useFonts, Vazirmatn_300Light, Vazirmatn_400Regular, Vazirmatn_600SemiBold } from "@expo-google-fonts/vazirmatn";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { theme } = useTheme(); // Access theme context
  const [fontsLoaded] = useFonts({
    Vazirmatn_300Light,
    Vazirmatn_400Regular,
    Vazirmatn_600SemiBold,
  });

  // Hide splash screen when fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Show blank screen if fonts are not loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="todos/[id]" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
