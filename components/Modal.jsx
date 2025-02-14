import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

// Estilos para el modal
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

export default function CustomModal({ visible, children }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {selectedNotification?.titulo}
          </Text>
          <Text>{selectedNotification?.descripcion}</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ marginTop: 20, alignSelf: "flex-end" }}
          >
            <Text style={{ color: "blue" }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
