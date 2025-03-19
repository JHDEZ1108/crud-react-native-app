import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/context/ThemeProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, date: string, time: string) => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ visible, onClose, onAdd }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [text, setText] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAdd = () => {
    if (text.trim()) {
      const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // HH:mm
      onAdd(text, formattedDate, formattedTime);
      setText("");
      setDate(new Date());
      setTime(new Date());
      onClose();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Todo</Text>

          {/* Input Field */}
          <TextInput
            style={styles.input}
            placeholder="Enter todo"
            placeholderTextColor={theme.icon}
            value={text}
            onChangeText={setText}
          />

          {/* Date Picker */}
          <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateContainer}>
            <Feather name="calendar" size={18} color={theme.primary} />
            <Text style={styles.todoDate}>
              {date.toISOString().split("T")[0]}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          {/* Time Picker */}
          <Pressable onPress={() => setShowTimePicker(true)} style={styles.dateContainer}>
            <FontAwesome6 name="clock" size={18} color={theme.primary} />
            <Text style={styles.todoDate}>
              {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </Pressable>

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setTime(selectedTime);
                }
              }}
            />
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.addButton, !text.trim() ? styles.disabledButton : {}]}
              onPress={handleAdd}
              disabled={!text.trim()}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

// **Dynamic styles based on theme**
const getStyles = (theme: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: "100%",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      padding: 20,
      minHeight: 250,
      backgroundColor: theme.headerBackground,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 15,
      textAlign: "center",
    },
    input: {
      width: "100%",
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.background,
      marginBottom: 15,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },
    todoDate: {
      marginLeft: 10,
      fontSize: 16,
      color: theme.text,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    cancelButton: {
      paddingVertical: 8,
      paddingHorizontal: 30,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: theme.text,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
    },
    addButton: {
      paddingVertical: 8,
      paddingHorizontal: 30,
      borderRadius: 5,
      backgroundColor: theme.primary,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
    disabledButton: {
      backgroundColor: theme.border,
    },
  });

export default AddTodoModal;
