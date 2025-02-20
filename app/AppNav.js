import React, { useContext } from "react";
import { AuthContext } from "./context/_authContext";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import Iniciar from "./screens/Iniciar";

export default function AppNav() {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (userToken) {
    return <Redirect href="/(tabs)/Inicio" />;
  }

  return <Iniciar />;
}
