import { Tabs } from "expo-router";
import "../../global.css";
import { View } from "react-native";
import { useContext } from "react";
import {
  AfisicoIcon,
  HomeIcon,
  MenuIcon,
  NotificationIcon,
} from "../../components/Icons";
import { AuthContext } from "../context/_authContext";
import Iniciar from "../screens/Iniciar";

export default function TabsLayout() {
  const { isLoading, userToken } = useContext(AuthContext);
  if (!userToken) {
    return <Iniciar />;
  }
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Inicio"
        options={{
          title: "Inicio",
          tabBarIcon: ({}) => <HomeIcon />,
        }}
      />
      <Tabs.Screen
        name="AFisico"
        options={{
          title: "AFisico",
          tabBarIcon: ({}) => <AfisicoIcon />,
        }}
      />
      <Tabs.Screen
        name="Notificaciones"
        options={{
          title: "Notificaciones",
          tabBarIcon: ({}) => <NotificationIcon />,
        }}
      />
      <Tabs.Screen
        name="Menu"
        options={{
          title: "Menu",
          tabBarIcon: ({}) => <MenuIcon />,
        }}
      />
      <Tabs.Screen
        name="Perfil"
        options={{
          href: null, // Esto excluye la ruta de las tabs
        }}
      />
    </Tabs>
  );
}
