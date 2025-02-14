import React from "react";
import { View, Image, Text } from "react-native";
import { Stack } from "expo-router";
import { UserIcon } from "../components/Icons";
import { AuthProvider } from "./context/_authContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Ocultar encabezado
        }}
      />
    </AuthProvider>
  );
}
