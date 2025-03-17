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

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Vazirmatn_300Light,
    Vazirmatn_400Regular,
    Vazirmatn_600SemiBold,
  });

  // Show loading indicator if fonts are not loaded
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#ffffff" />;
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
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
        onPress={() => toggleTodo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={30} color="#c65153" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Input section for adding new todos */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
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

// Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
    pointerEvents: "auto",
  },
  input: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 18,
    minWidth: 0,
    color: "white",
    fontFamily: "Vazirmatn_400Regular", 
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
  addButtonText: {
    fontSize: 18,
    color: "black",
    fontFamily: "Vazirmatn_600SemiBold", 
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
    pointerEvents: "auto",
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    color: "white",
    fontFamily: "Vazirmatn_400Regular", 
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
    fontFamily: "Vazirmatn_300Light", 
  },
});
