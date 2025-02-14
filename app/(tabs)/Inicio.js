import { Main } from "../../components/Main";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { Link } from "expo-router";
import React, { use, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import CustomCalendar from "./../../components/CustomCalendar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomHeader } from "./../../components/CustomHeader";

export default function Inicio() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="h-full"
      contentContainerStyle={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      showsVerticalScrollIndicator={false} // Oculta la barra de desplazamiento vertical
    >
      <CustomHeader />

      <View className="flex-col items-center ">
        <Image
          source={require("../../assets/ulagos.png")}
          className="w-1/2 h-11 mb-12 mt-8"
        />

        <View className="w-3/4 h-32 border-2 border-green-600 rounded-xl bg-white">
          <Text className="pl-4 pt-1 font-bold">Proxima clase/sesión</Text>

          <View className="flex-row items-center pl-4 pt-1 ">
            <Text className="text-lg">•</Text>
            <Text className="pl-2">05 de marzo</Text>
          </View>
          <View className="flex-row items-center pl-4 pt-4 ">
            <Text className="pl-2 text-gray-500">Plan piscina 1 x semana</Text>
          </View>
        </View>

        <CustomCalendar />

        <View className="w-3/4 h-32 border-2 border-yellow-600 rounded-xl bg-white mt-2">
          <Text className="pl-4 pt-1 font-bold">Clase/sesión pasadas</Text>

          <View className="flex-row items-center pl-4 pt-1 ">
            <Text className="text-lg">•</Text>
            <Text className="pl-2">Conectar info de la bdd</Text>
          </View>
        </View>

        <Text className="bg-green-600 mt-96">
          p App.js to start working on your app! adasda
        </Text>
        <StatusBar style="light" />
      </View>
    </ScrollView>
  );
}
