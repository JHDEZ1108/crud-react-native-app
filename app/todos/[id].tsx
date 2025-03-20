import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  Platform,
  SafeAreaView
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNotification } from "@/context/NotificationContext";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  date: string;
  time: string;
}

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [todo, setTodo] = useState<TodoItem | null>(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);
  
  const { showMessage } = useNotification();

  useEffect(() => {
    const fetchData = async (todoId: string) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos: TodoItem[] = jsonValue ? JSON.parse(jsonValue) : [];
        const myTodo = storageTodos.find((t) => t.id.toString() === todoId);
        if (myTodo) {
          setTodo(myTodo);
          setDate(new Date(myTodo.date));
          const [hours, minutes] = myTodo.time.split(':');
          const timeCopy = new Date();
          timeCopy.setHours(parseInt(hours), parseInt(minutes), 0);
          setTime(timeCopy);
        }
      } catch (e) {
        console.error("Error fetching todo:", e);
      }
    };

    if (id) {
      fetchData(id);
    }
  }, [id]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      if (todo) {
        setTodo({ ...todo, date: selectedDate.toISOString().split('T')[0] });
      }
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      if (todo) {
        const formattedTime = selectedTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        setTodo({ ...todo, time: formattedTime });
      }
    }
  };

  const handleSave = async () => {
    if (todo) {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos: TodoItem[] = jsonValue ? JSON.parse(jsonValue) : [];
        const updatedTodos = storageTodos.map((t) =>
          t.id === todo.id ? todo : t
        );
        await AsyncStorage.setItem("TodoApp", JSON.stringify(updatedTodos));
        showMessage("Todo updated successfully!");
        router.push("/");
      } catch (e) {
        console.error("Error saving todo:", e);
      }
    }
  };

  if (!todo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.textCenter}>
          Todo not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Todo</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Todo Title:</Text>
        <TextInput
          style={styles.input}
          placeholder="Edit Todo Title"
          placeholderTextColor={theme.icon}
          value={todo.title}
          onChangeText={(text) => setTodo(prev => prev ? { ...prev, title: text } : null)}
        />
      </View>

      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Change Date:</Text>
        <Feather name="calendar" size={24} color={theme.primary} />
        <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateInfoContainer}>
          <Text style={styles.todoDate}>
            {date.toISOString().split("T")[0]}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDate}
          />
        )}
      </View>

      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Change Time:</Text>
        <FontAwesome6 name="clock" size={24} color={theme.primary} />
        <Pressable onPress={() => setShowTimePicker(true)} style={styles.dateInfoContainer}>
          <Text style={styles.todoDate}>
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeTime}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/")} style={[styles.saveButton, { backgroundColor: "red" }]}>
          <Text style={[styles.buttonText, { color: "white" }]}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 20,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  dateInfoContainer: {
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 2
  },
  input: {
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    color: theme.text,
  },
  todoDate: {
    marginLeft: 10,
    fontSize: 16,
    color: theme.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: theme.primary,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  textCenter: {
    color: theme.text,
    textAlign: "center",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
