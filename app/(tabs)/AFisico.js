import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { CustomHeader } from "../../components/CustomHeader";
import logo from "../../assets/ulagos.png";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { AFisicoItem } from "../../components/AFisicoItem";
import { MaterialIcons } from "@expo/vector-icons";

export default function AFisico() {
  const [perfilFitness, setPerfilFitness] = useState(null);
  const [evaluacion, setEvaluacion] = useState(null);
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No hay token disponible.");
        return;
      }

      // Decodificar el token para obtener el ID del usuario
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      // Obtener el perfil fitness del usuario
      const perfilResponse = await axios.get(
        `http://192.168.1.11:8080/perfil-fitness?userId=${userId}`,
      );
      setPerfilFitness(perfilResponse.data);

      if (perfilResponse.data) {
        // Obtener la última evaluación del perfil fitness
        const evaluacionResponse = await axios.get(
          `http://192.168.1.11:8080/ultima-evaluacion?perfilFitnessId=${perfilResponse.data.id}`,
        );
        setEvaluacion(evaluacionResponse.data);

        // Obtener las rutinas del perfil fitness
        const rutinasResponse = await axios.get(
          `http://192.168.1.11:8080/rutinas?perfilFitnessId=${perfilResponse.data.id}`,
        );
        console.log("Rutinas en la respuesta :", rutinasResponse.data);
        setRutinas(rutinasResponse.data);
      }
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    } finally {
      setLoading(false);
    }
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
      <ScrollView className="">
        <CustomHeader />
        <Image source={logo} className="w-40 h-8 " resizeMode="contain" />
        <View className=" items-center mt-8">
          <Text className="text-lg font-bold mb-4">
            Acondicionamiento Físico
          </Text>
        </View>
        <View className="gap-4 flex-wrap flex-row justify-center p-4 ">
          <AFisicoItem title="Edad" value={perfilFitness?.edad} />
          <AFisicoItem title="Peso" value={evaluacion?.peso} />
          <AFisicoItem title="Estatura" value={perfilFitness?.estatura} />
          <AFisicoItem title="Fuma" value={perfilFitness?.fuma ? "Sí" : "No"} />
          <AFisicoItem title="Masa grasa" value={evaluacion?.grasa_visceral} />
          <AFisicoItem
            title="Grasa visceral"
            value={evaluacion?.grasa_visceral}
          />
          <AFisicoItem title="Masa muscular" value={evaluacion?.musculo} />
        </View>

        <View className="flex items-center justify-center mt-4">
          <Text className="text-lg font-bold mb-4">
            Rutina de entrenamiento
          </Text>
        </View>

        {/* Mostrar las rutinas */}
        {rutinas.map((rutina, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl p-4 shadow-lg mb-8 items-center mx-8"
          >
            <Text className="text-lg font-bold mb-4">{rutina.titulo}</Text>
            <View className="flex-wrap flex-row justify-center gap-4">
              {/* Ejercicio */}
              <View className="w-28 h-28 bg-blue-100 items-center justify-center rounded-lg shadow-sm">
                <MaterialIcons
                  name="fitness-center"
                  size={24}
                  color="#3b82f6"
                />
                <Text className="mt-2 text-sm font-medium text-center">
                  Ejercicio
                </Text>
                <Text className="mt-2 text-sm font-medium text-center">
                  {rutina.ejercicio}
                </Text>
              </View>

              {/* Peso */}
              <View className="w-28 h-28 bg-blue-100 items-center justify-center rounded-lg shadow-sm">
                <MaterialIcons name="scale" size={24} color="#3b82f6" />
                <Text className="mt-2 text-sm font-medium text-center">
                  Peso
                </Text>
                <Text className="mt-2 text-sm font-medium text-center">
                  {rutina.peso} kg
                </Text>
              </View>

              {/* Repeticiones */}
              <View className="w-28 h-28 bg-blue-100 items-center justify-center rounded-lg shadow-sm">
                <MaterialIcons name="repeat" size={24} color="#3b82f6" />
                <Text className="mt-2 text-sm font-medium text-center">
                  Repeticiones
                </Text>
                <Text className="mt-2 text-sm font-medium text-center">
                  {rutina.repeticiones}
                </Text>
              </View>

              {/* Series */}
              <View className="w-28 h-28 bg-blue-100 items-center justify-center rounded-lg shadow-sm">
                <MaterialIcons
                  name="format-list-numbered"
                  size={24}
                  color="#3b82f6"
                />
                <Text className="mt-2 text-sm font-medium text-center">
                  Series
                </Text>
                <Text className="mt-2 text-sm font-medium text-center">
                  {rutina.series}
                </Text>
              </View>

              {/* Tiempo de descanso */}
              <View className="w-28 h-28 bg-blue-100 items-center justify-center rounded-lg shadow-sm">
                <MaterialIcons name="timer" size={24} color="#3b82f6" />
                <Text className="mt-2 text-sm font-medium text-center">
                  Descanso
                </Text>
                <Text className="mt-2 text-sm font-medium text-center">
                  {rutina.descanso} min
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
