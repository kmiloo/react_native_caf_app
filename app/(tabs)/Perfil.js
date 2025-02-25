import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../context/_authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";

export default function PerfilUsuario() {
  const { logout } = useContext(AuthContext); // Accede al contexto
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [creadoEn, setCreadoEn] = useState("");
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const router = useRouter(); // Obtén la instancia del router

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          console.log("Token decodificado:", decodedToken);
          setNombre(decodedToken.nombre || "");
          setApellido(decodedToken.apellido || "");
          setCreadoEn(decodedToken.creado_en || "");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    cargarDatosUsuario();
  }, []);

  const handleLogout = () => {
    logout(); // Llama a la función logout
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white p-6 items-center justify-center">
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 ">
      {/* Botón de volver */}
      <View className="bg-[#003da6] h-7"></View>
      <View className="bg-gray-100 h-24 w-full flex-row px-8 items-center justify-between">
        <Link href="/" asChild>
          <TouchableOpacity className="justify-center items-center h-12 w-12 rounded-full bg-gray-200">
            <FontAwesome5 name="arrow-left" size={20} className="" />
          </TouchableOpacity>
        </Link>
        <Text className="text-3xl font-semibold">Perfil</Text>
        <View className="w-12"></View>
      </View>
      <View className="bg-gray-300 h-[1px]"></View>

      {/* Contenedor principal */}
      <View className="flex-1 items-center justify-center">
        {/* Imagen de perfil */}
        <View className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
          <FontAwesome5 name="user" size={50} color="black" />
        </View>

        {/* Nombre del usuario */}
        <Text className="text-lg font-semibold text-black">
          {nombre} {apellido}
        </Text>

        {/* Fecha de creación */}
        <Text className="text-gray-500 mt-1">
          Cuenta creada en {new Date(creadoEn).toLocaleDateString()}
        </Text>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-8 bg-red-500 py-2 px-6 rounded-full"
        >
          <Text className="text-white font-bold">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
