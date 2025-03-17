import { 
  useFonts, 
  Vazirmatn_300Light, 
  Vazirmatn_400Regular, 
  Vazirmatn_600SemiBold 
} from "@expo-google-fonts/vazirmatn";

import { Text, View, TextInput, Pressable, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useTheme } from "@/context/ThemeProvider"; // Theme hook
import ThemeToggle from "@/components/ThemeToggle"; // Theme switcher button

import { data } from "@/data/todos";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

export default function Index() {
  // State to store todos, sorted by descending ID
  const [todos, setTodos] = useState<TodoItem[]>(data.sort((a, b) => b.id - a.id));
  const [text, setText] = useState<string>("");

  const { theme } = useTheme(); // Access theme context

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Vazirmatn_300Light,
    Vazirmatn_400Regular,
    Vazirmatn_600SemiBold,
  });

  // Show loading indicator if fonts are not loaded
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color={theme.primary} />;
  }

  // Function to add a new todo
  const addTodo = (): void => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText("");
    }
  };

  // Function to toggle the completion status of a todo
  const toggleTodo = (id: number): void => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Function to remove a todo by ID
  const removeTodo = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Render a single todo item
  const renderItem = ({ item }: { item: TodoItem }) => (
    <View style={[styles.todoItem, { borderBottomColor: theme.border }]}>
      <Text
        style={[styles.todoText, { color: theme.text }, item.completed && styles.completedText]}
        onPress={() => toggleTodo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={30} color={theme.primary} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header with ThemeToggle button */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.text }]}>Todo List</Text>
        <ThemeToggle />
      </View>

      {/* Input section for adding new todos */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.border, backgroundColor: theme.headerBackground },
          ]}
          placeholder="Add a new todo"
          placeholderTextColor={theme.icon}
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={[styles.addButton, { backgroundColor: theme.primary }]}>
          <Text style={[styles.addButtonText, { color: theme.background }]}>Add</Text>
        </Pressable>
      </View>

      {/* Display the list of todos */}
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(todo) => todo.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
}

// **Updated styles**
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  headerText: {
    fontSize: 22,
    fontFamily: "Vazirmatn_600SemiBold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 18,
    minWidth: 0,
    fontFamily: "Vazirmatn_400Regular",
  },
  addButton: {
    borderRadius: 5,
    padding: 10,
  },
  addButtonText: {
    fontSize: 18,
    fontFamily: "Vazirmatn_600SemiBold",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Vazirmatn_400Regular",
  },
  completedText: {
    textDecorationLine: "line-through",
    fontFamily: "Vazirmatn_300Light",
  },
});

