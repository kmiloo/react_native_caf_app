import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/_authContext";
import Iniciar from "../screens/Iniciar";

export default function PerfilUsuario() {
  const router = useRouter(); // Obtén el objeto router
  const { logout } = useContext(AuthContext); // Accede al contexto

  const handleLogout = () => {
    logout(); // Llama a la función logout
    // return <Iniciar />; // Redirige a la pantalla de inicio de sesión

    //router.push("screens/Iniciar"); // Redirige a la pantalla de inicio de sesión
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Botón de volver */}
      <Link href="/Menu" asChild>
        <TouchableOpacity>
          <FontAwesome5 name="arrow-left" size={20} className="mb-4" />
        </TouchableOpacity>
      </Link>

      {/* Contenedor principal */}
      <View className="flex-1 items-center justify-center">
        {/* Imagen de perfil */}
        <View className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
          <FontAwesome5 name="user" size={50} color="black" />
        </View>

        {/* Nombre del usuario */}
        <Text className="text-lg font-semibold text-black">
          Nombre Apellido
        </Text>

        {/* Fecha de creación */}
        <Text className="text-gray-500 mt-1">Cuenta creada mayo 2025</Text>

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
