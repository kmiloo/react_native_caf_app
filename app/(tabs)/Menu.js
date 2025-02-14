import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { CustomHeader } from "../../components/CustomHeader";
import { useRouter, Link } from "expo-router";

export default function MenuScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  return (
    <View className="h-full ">
      <CustomHeader />
      <ScrollView className="p-4">
        <Text className="text-lg font-bold mb-4">Menú</Text>
        {/* Configuraciones */}
        <View className="bg-white rounded-xl shadow p-4 mb-4">
          <Text className="text-md font-semibold text-gray-700 mb-2">
            Configuraciones
          </Text>

          <Link href="/Perfil" asChild>
            <TouchableOpacity className="flex-row items-center py-2">
              <FontAwesome
                name="user"
                size={20}
                className="mr-3 text-gray-600"
              />
              <Text className="text-gray-800">Mi Perfil</Text>
            </TouchableOpacity>
          </Link>

          {/*<View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <FontAwesome
                name="moon-o"
                size={20}
                className="mr-3 text-gray-600"
              />
              <Text className="text-gray-800">Modo oscuro</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={() => setDarkMode(!darkMode)}
            />
          </View>*/}

          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={() => console.log("Sugerencias clicked")}
          >
            <FontAwesome
              name="comment"
              size={20}
              className="mr-3 text-gray-600"
            />
            <Text className="text-gray-800">Sugerencias</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={() => console.log("Reportar problema clicked")}
          >
            <FontAwesome
              name="exclamation-circle"
              size={20}
              className="mr-3 text-gray-600"
            />
            <Text className="text-gray-800">Reportar problema</Text>
          </TouchableOpacity>
        </View>
        {/* Redes sociales */}
        <View className="bg-white rounded-xl shadow p-4">
          <Text className="text-md font-semibold text-gray-700 mb-2">
            Redes sociales
          </Text>

          <TouchableOpacity className="flex-row items-center py-2">
            <FontAwesome
              name="instagram"
              size={20}
              className="mr-3 text-gray-600"
            />
            <Text className="text-gray-800">Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-2">
            <FontAwesome
              name="facebook"
              size={20}
              className="mr-3 text-gray-600"
            />
            <Text className="text-gray-800">Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-2">
            <FontAwesome
              name="twitter"
              size={20}
              className="mr-3 text-gray-600"
            />
            <Text className="text-gray-800">Twitter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
