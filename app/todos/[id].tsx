import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeProvider";
import { StatusBar } from "expo-status-bar";
import { 
  useFonts, 
  Vazirmatn_300Light, 
  Vazirmatn_400Regular, 
  Vazirmatn_600SemiBold 
} from "@expo-google-fonts/vazirmatn";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Get the todo ID from the URL params
  const [todo, setTodo] = useState<TodoItem | null>(null);
  const { theme } = useTheme(); // Access theme context
  const router = useRouter(); // Navigation hook

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Vazirmatn_300Light, 
    Vazirmatn_400Regular, 
    Vazirmatn_600SemiBold 
  });

  // Fetch the selected todo from AsyncStorage
  useEffect(() => {
    const fetchData = async (todoId: string) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos: TodoItem[] = jsonValue ? JSON.parse(jsonValue) : [];

        if (storageTodos.length) {
          const myTodo = storageTodos.find((t) => t.id.toString() === todoId);
          if (myTodo) setTodo(myTodo);
        }
      } catch (e) {
        console.error("Error fetching todo:", e);
      }
    };

    if (id) {
      fetchData(id);
    }
  }, [id]);

  // Show loading indicator while fonts are loading
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color={theme.primary} />;
  }

  // Show a message if the todo is not found
  if (!todo) {
    return (
      <SafeAreaView style={styles(theme).container}>
        <Text style={{ color: theme.text, textAlign: "center", marginTop: 20 }}>
          Todo not found
        </Text>
      </SafeAreaView>
    );
  }

  // Save the updated todo to AsyncStorage
  const handleSave = async () => {
    try {
      const savedTodo = { ...todo, title: todo.title };

      const jsonValue = await AsyncStorage.getItem("TodoApp");
      const storageTodos: TodoItem[] = jsonValue ? JSON.parse(jsonValue) : [];

      const updatedTodos = storageTodos.map((t) =>
        t.id === savedTodo.id ? savedTodo : t
      );

      await AsyncStorage.setItem("TodoApp", JSON.stringify(updatedTodos));

      router.push("/"); // Navigate back to the home screen
    } catch (e) {
      console.error("Error saving todo:", e);
    }
  };

  return (
    <SafeAreaView style={styles(theme).container}>
      {/* Todo title input */}
      <View style={styles(theme).inputContainer}>
        <TextInput
          style={styles(theme).input}
          maxLength={30}
          placeholder="Edit todo"
          placeholderTextColor={theme.icon}
          value={todo?.title || ""}
          onChangeText={(text) => setTodo((prev) => (prev ? { ...prev, title: text } : null))}
        />
      </View>

      {/* Save and Cancel buttons */}
      <View style={styles(theme).inputContainer}>
        <Pressable onPress={handleSave} style={styles(theme).saveButton}>
          <Text style={styles(theme).saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/")}
          style={[styles(theme).saveButton, { backgroundColor: "red" }]}
        >
          <Text style={[styles(theme).saveButtonText, { color: "white" }]}>Cancel</Text>
        </Pressable>
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

// **Styles function that adapts to the theme**
const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 6,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: "Vazirmatn_400Regular",
      minWidth: 0,
      color: theme.text,
    },
    saveButton: {
      backgroundColor: theme.primary,
      borderRadius: 5,
      padding: 10,
    },
    saveButtonText: {
      fontSize: 18,
      color: theme.text,
    },
  });
