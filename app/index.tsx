import { 
  Text, 
  View, 
  Pressable, 
  StyleSheet, 
  SectionList 
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeProvider"; 
import ThemeToggle from "@/components/ThemeToggle"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { data } from "@/data/todos";
import TodoOptions from "@/components/TodoOptions";
import AddTodoModal from "@/components/AddTodoModal";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  date?: string;
  time?: string;
}

export default function Index() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false); 
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    Pending: true,
    Completed: true,
  });

  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  // **Load todos from AsyncStorage when the app starts**
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos: TodoItem[] = jsonValue ? JSON.parse(jsonValue) : [];

        if (storageTodos.length > 0) {
          setTodos(sortTodos(storageTodos));
        } else {
          setTodos(sortTodos(data));
        }
      } catch (e) {
        console.error("Error loading todos:", e);
      }
    };

    fetchData();
  }, []);

  // **Save todos to AsyncStorage whenever they change**
  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (e) {
        console.error("Error saving todos:", e);
      }
    };

    if (todos.length > 0) {
      storeData();
    }
  }, [todos]);

  /*
  // ** Uncomment this to clear AsyncStorage if data structure changes **
  useEffect(() => {
    const clearStorage = async () => {
      await AsyncStorage.removeItem("TodoApp");
      console.log("AsyncStorage cleared for data structure update.");
    };
    clearStorage();
  }, []);
  */

  // **Sort todos by date and time (earliest first)**
  const sortTodos = (todos: TodoItem[]) => {
    return [...todos].sort((a, b) => {
      if (!a.date || !b.date) return 0; // Ignore items without dates
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // **Function to add a new todo**
  const addTodo = (title: string, date?: string, time?: string): void => {
    if (title.trim()) {
      // Find the highest ID and add 1 to avoid duplicates
      const newId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
      
      const newTodos = [...todos, { id: newId, title, completed: false, date, time }];
      setTodos(sortTodos(newTodos));
    }
  };

  // **Function to toggle the completion status of a todo**
  const toggleTodo = (id: number): void => {
    setTodos(sortTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    ));
  };

  // **Function to remove a todo by ID**
  const removeTodo = (id: number): void => {
    setTodos(sortTodos(todos.filter((todo) => todo.id !== id)));
  };

  // **Function to navigate to the edit screen**
  const handlePress = (id: number) => {
    router.push({ pathname: "/todos/[id]", params: { id: id.toString() } });
  };

  // **Toggle Section Expansion**
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // **Prepare the sections for SectionList**
  const sections = [
    { title: "Pending", data: todos.filter(todo => !todo.completed) },
    { title: "Completed", data: todos.filter(todo => todo.completed) },
  ];

  // **Render a single todo item**
  const renderItem = ({ item }: { item: TodoItem }) => (
    <View 
      style={[
        styles.todoItem, 
        { backgroundColor: item.completed ? theme.backgroundCompleted : theme.background }
      ]}
    >
      <Pressable onPress={() => handlePress(item.id)} onLongPress={() => toggleTodo(item.id)}>
        <View>
          <Text style={[styles.todoText, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          {item.date && item.time && (
            <View style={styles.dateContainer}>
              {/* Date Icon */}
              <Feather 
                name="calendar" 
                size={16} 
                color={item.completed ? theme.icon : theme.primary} 
                style={styles.dateIcon} 
              />
              <Text style={styles.todoDate}>{item.date}</Text>

              {/* Time Icon */}
              <FontAwesome6 
                name="clock" 
                size={16} 
                color={item.completed ? theme.icon : theme.primary} 
                style={styles.timeIcon} 
              />
              <Text style={styles.todoDate}>{item.time}</Text>
            </View>
          )}
        </View>
      </Pressable>
      <TodoOptions 
        id={item.id} 
        completed={item.completed}
        onDelete={removeTodo} 
        onEdit={handlePress} 
        onToggleComplete={toggleTodo} 
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Todo List</Text>
        <View style={styles.headerIcons}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={30} color={theme.primary} />
          </Pressable>
          <ThemeToggle />
        </View>
      </View>
      
      {/* Display the list of todos using SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(todo) => `${todo.id}-${todo.title}`} // Unique key to avoid duplicates.
        renderItem={({ item, section }) => 
          expandedSections[section.title] ? renderItem({ item }) : null
        }
        renderSectionHeader={({ section }) => (
          <Pressable onPress={() => toggleSection(section.title)} style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
            <MaterialIcons 
              name={expandedSections[section.title] ? "expand-less" : "expand-more"} 
              size={24} 
              color={theme.text} 
            />
          </Pressable>
        )}
      />
      
      {/* Add Todo Modal */}
      <AddTodoModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onAdd={addTodo} 
      />
    </SafeAreaView>
  );
} 

// **Styles function that adapts to the theme**
function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
    },
    headerText: {
      fontSize: 22,
      fontFamily: "Vazirmatn_600SemiBold",
      color: theme.text,
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15, 
    },
    todoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    todoText: {
      fontSize: 18,
      fontFamily: "Vazirmatn_400Regular",
      color: theme.text,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      gap: 5, 
    },
    dateIcon: {
      marginRight: 5,
    },
    timeIcon: {
      marginLeft: 15, 
    },
    todoDate: {
      fontSize: 14,
      fontFamily: "Vazirmatn_300Light",
      color: theme.gray,
    },
    completedText: {
      textDecorationLine: "line-through",
      fontFamily: "Vazirmatn_300Light",
      color: theme.icon,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: theme.headerBackground,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
    sectionHeaderText: {
      fontSize: 18,
      fontFamily: "Vazirmatn_600SemiBold",
      color: theme.text,
    },
  });
}
