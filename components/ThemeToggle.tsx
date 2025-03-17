import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Animated, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeProvider";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === Colors.dark;

  const animation = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const togglePosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Movement of the circle
  });

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: isDarkMode ? "#EAEAEA" : "#222" }]} 
      onPress={toggleTheme}
    >
      <Animated.View
        style={[
          styles.toggleCircle,
          {
            transform: [{ translateX: togglePosition }],
            backgroundColor: isDarkMode ? "#444" : "#FFF",
          },
        ]}
      >
        <FontAwesome 
          name={isDarkMode ? "moon-o" : "sun-o"} 
          size={16} 
          color={isDarkMode ? "#FFF" : "#444"}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 25,
    borderRadius: 15,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default ThemeToggle;