import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

// Define theme context type
interface ThemeContextType {
  theme: typeof Colors.light | typeof Colors.dark;
  toggleTheme: () => void;
}

// Create theme context with default value
const ThemeContext = createContext<ThemeContextType | null>(null);

// Define props type for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider with persistent theme storage
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme() ?? "light"; // Ensures no undefined values
  const [themeMode, setThemeMode] = useState<"light" | "dark">(systemColorScheme);

  // Load stored theme preference
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme") as "light" | "dark" | null;
      if (storedTheme) {
        setThemeMode(storedTheme);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const toggleTheme = async () => {
    const newTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const theme = themeMode === "dark" ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme in any component
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};