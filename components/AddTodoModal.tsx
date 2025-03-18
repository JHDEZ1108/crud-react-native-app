import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeProvider";

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ visible, onClose, onAdd }) => {
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const styles = getStyles(theme);

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text);
      setText("");
      onClose();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          {/* Input Field */}
          <Text style={styles.modalTitle}>Add New Todo</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter todo"
            placeholderTextColor={theme.icon}
            value={text}
            onChangeText={setText}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.addButton} onPress={handleAdd}>
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
      minHeight: 180,
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
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
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
  });

export default AddTodoModal;
