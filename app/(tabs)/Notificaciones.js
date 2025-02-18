import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { CustomHeader } from "../../components/CustomHeader";
import NotificationItem from "../../components/NotificationItem";
import logo from "../../assets/ulagos.png";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// Configura el manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Muestra una alerta cuando llega una notificación
    shouldPlaySound: true, // Reproduce sonido
    shouldSetBadge: false, // No actualiza el badge de la app
  }),
});

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Solicita permisos para notificaciones y obtén las notificaciones al cargar el componente
  useEffect(() => {
    obtenerNotificaciones();
    setupNotifications();
  }, []);

  // Configura los listeners y permisos para notificaciones push
  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("No se otorgaron permisos para notificaciones.");
    }

    // Obtén el token de dispositivo
    try {
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "e6131196-2a80-4089-bff4-9d0fd7651d97",
        })
      ).data;
      //console.log("Token de dispositivo:", token);
      await AsyncStorage.setItem("notificationToken", token);
    } catch (error) {
      console.error("Error al obtener el tokennn:", error);
    }

    try {
      const usertoken = await AsyncStorage.getItem("userToken");
      const token = await AsyncStorage.getItem("notificationToken");
      const decodedToken = jwtDecode(usertoken);
      const userId = decodedToken.id;
      const response = await axios.put(
        `http://192.168.1.11:8080/update-token`,
        { token: token, userId: userId },
      );
      console.log("Respuesta de actualización de tokenaa:", response.data);
    } catch (error) {
      console.error("Error al actualizar el tokenaaaaasas:", error);
    }

    // Configura los listeners para notificaciones
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificación recibida:", notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Usuario interactuó con la notificación:", response);
      });

    // Limpia los listeners al desmontar el componente
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  };

  // Obtiene las notificaciones del servidor
  const obtenerNotificaciones = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No hay token disponible.");
        return;
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.get(
        `http://192.168.1.11:8080/notifications?userId=${userId}`,
      );
      const ultimasNotificaciones = response.data.slice(-10);
      setNotificaciones(ultimasNotificaciones);
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Maneja el clic en una notificación
  const handleNotificationPress = async (notificacion) => {
    // Abre el modal
    setSelectedNotification(notificacion);
    setModalVisible(true);

    // Si la notificación ya está vista, no hagas nada
    if (notificacion.estado === 1) return;

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No hay token disponible.");
        return;
      }

      // Actualiza el estado de la notificación a "visto" (1)
      await axios.put(
        `http://192.168.1.11:8080/updatenotification/${notificacion.id}`,
        { estado: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Actualiza la lista de notificaciones localmente
      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.map((n) =>
          n.id === notificacion.id ? { ...n, estado: 1 } : n,
        ),
      );
    } catch (error) {
      console.error("Error al actualizar la notificación:", error);
    }
  };

  // Función para programar una notificación local
  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Notificación de prueba!",
        body: "Esta es una notificación local programada.",
      },
      trigger: { seconds: 2 }, // Se muestra después de 2 segundos
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="h-full">
      <CustomHeader />
      <Image source={logo} className="w-40 h-8 mb-12" resizeMode="contain" />
      <ScrollView>
        {notificaciones.length === 0 ? (
          <View className="flex-1 justify-center items-center h-12">
            <Text className="text-gray-500 text-lg">
              Aun no tienes notificaciones
            </Text>
          </View>
        ) : (
          notificaciones.map((notificacion, index) => (
            <NotificationItem
              key={index}
              image={logo}
              title={notificacion.titulo}
              text={notificacion.descripcion}
              status={notificacion.estado}
              onPress={() => handleNotificationPress(notificacion)}
            />
          ))
        )}
      </ScrollView>

      {/* Modal para mostrar detalles de la notificación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
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

      {/* Botón para probar la notificación local */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text onPress={scheduleNotification} style={{ color: "blue" }}>
          Presiona aquí para enviar una notificación
        </Text>
      </View>
    </View>
  );
}

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
