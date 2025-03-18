import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@/context/ThemeProvider";

interface TodoOptionsProps {
  id: number;
  completed: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TodoOptions: React.FC<TodoOptionsProps> = ({ id, completed, onDelete, onEdit, onToggleComplete }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme); // Apply dynamic styles
  const [visible, setVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Handle delete confirmation
  const handleDelete = () => {
    setShowDeleteModal(false);
    setTimeout(() => onDelete(id), 300);
  };

  // Handle toggle completion with smooth close
  const handleToggleComplete = () => {
    onToggleComplete(id);
    setTimeout(() => setVisible(false), 300);
  };

  return (
    <>
      {/* Options Button */}
      <Pressable onPress={() => setVisible(true)}>
        <Feather name="more-vertical" size={24} color={theme.icon} />
      </Pressable>

      {/* Bottom Sheet Modal */}
      <Modal transparent visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Mark as Done / Not Done */}
            <Pressable style={styles.option} onPress={handleToggleComplete}>
              <MaterialCommunityIcons
                name={completed ? "checkbox-marked-outline" : "checkbox-blank-outline"}
                size={20}
                color={theme.text}
              />
              <Text style={styles.optionText}>
                {completed ? "Mark as Not Done" : "Mark as Done"}
              </Text>
            </Pressable>

            {/* Edit Option */}
            <Pressable style={styles.option} onPress={() => { 
              setVisible(false);
              onEdit(id);
            }}>
              <Feather name="edit" size={20} color={theme.text} />
              <Text style={styles.optionText}>Edit</Text>
            </Pressable>

            {/* Delete Option */}
            <Pressable style={styles.option} onPress={() => setShowDeleteModal(true)}>
              <MaterialIcons name="delete" size={20} color={theme.red} />
              <Text style={[styles.optionText, { color: theme.red }]}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Custom Delete Confirmation Modal */}
      <Modal transparent visible={showDeleteModal} animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <Text style={styles.deleteTitle}>Confirm Delete</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to delete this to-do?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// **Dynamic styles based on theme**
const getStyles = (theme: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: "100%",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      padding: 20,
      minHeight: 180,
      position: "absolute",
      bottom: 0,
      backgroundColor: theme.headerBackground,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
    },
    optionText: {
      marginLeft: 10,
      fontSize: 18,
      color: theme.text,
    },
    deleteModal: {
      width: "80%",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    deleteTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    deleteMessage: {
      fontSize: 16,
      marginTop: 10,
      textAlign: "center",
      color: theme.text,
    },
    buttonContainer: {
      flexDirection: "row",
      marginTop: 20,
      justifyContent: "space-around",
      width: "100%",
    },
    cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.text,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text, // Ensure cancel button text is correct
    },
    deleteButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: theme.red,
    },
    deleteButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
  });

export default TodoOptions;
