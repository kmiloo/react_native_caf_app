import { Main } from "../../components/Main";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { Link } from "expo-router";
import React, { use, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import CustomCalendar from "./../../components/CustomCalendar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomHeader } from "./../../components/CustomHeader";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function Inicio() {
  const insets = useSafeAreaInsets();
  const [actividades, setActividades] = useState([]);
  const [proximaActividad, setProximaActividad] = useState(null);
  const [markedDates, setMarkedDates] = useState({}); // Estado para las fechas marcadas
  const [ultimaActividadPasada, setUltimaActividadPasada] = useState(null);
  const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Si la cadena está vacía, devuelve una cadena vacía
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const decodedToken = jwtDecode(token);
      const rut = decodedToken.rut;
      let rutLimpio = rut.replace(/\./g, "").replace(/-/g, "");
      console.log("Rut limpio:", decodedToken);
      if (!token) {
        console.log("No hay token disponible.");
        return;
      }
      const res = await axios.get(
        `http://192.168.1.11:8080/actividadbloque?rut=${rutLimpio}`,
      );
      console.log("respuresta:", res.data);
      setActividades(res.data);

      // Encontrar la próxima actividad
      if (res.data.length > 0) {
        const ahora = new Date();
        const actividadesFuturas = res.data.filter(
          (actividad) => new Date(actividad.fecha_hora_inicio) > ahora,
        );
        if (actividadesFuturas.length > 0) {
          const proxima = actividadesFuturas.reduce((prev, curr) =>
            new Date(prev.fecha_hora_inicio) < new Date(curr.fecha_hora_inicio)
              ? prev
              : curr,
          );
          setProximaActividad(proxima);
        }

        // Encontrar la última actividad pasada con asistido = 1
        const actividadesPasadas = res.data.filter(
          (actividad) =>
            new Date(actividad.fecha_hora_inicio) <= ahora &&
            actividad.asistido === 1,
        );
        if (actividadesPasadas.length > 0) {
          const ultimaActividadPasada = actividadesPasadas.reduce(
            (prev, curr) =>
              new Date(prev.fecha_hora_inicio) >
              new Date(curr.fecha_hora_inicio)
                ? prev
                : curr,
          );
          setUltimaActividadPasada(ultimaActividadPasada); // Nuevo estado para la última actividad pasada
        }

        // Crear objeto markedDates
        const dates = {};
        const ahoraISO = ahora.toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD
        res.data.forEach((actividad) => {
          const fecha = new Date(actividad.fecha_hora_inicio)
            .toISOString()
            .split("T")[0]; // Formato YYYY-MM-DD

          // Determinar si la fecha es pasada
          const esFechaPasada = fecha < ahoraISO;

          // Asignar estilo según si es pasada o futura
          dates[fecha] = {
            //marked: true,
            //dotColor: esFechaPasada ? "orange" : "blue", // Naranja para fechas pasadas, azul para futuras
            selected: esFechaPasada ? true : true, // Seleccionar la fecha si es pasada
            selectedColor: esFechaPasada ? "orange" : "blue", // Naranja para fechas pasadas, azul para futuras
          };
        });
        console.log("Fechas marcadas:", dates);
        setMarkedDates(dates);
      }
    } catch (error) {
      console.error("Error obteniendo actividad:", error);
    }
  };

  return (
    <ScrollView
      className="h-full"
      contentContainerStyle={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      showsVerticalScrollIndicator={false}
    >
      <CustomHeader profileRoute="/Perfil" />

      <View className="flex-col items-center ">
        <Image
          source={require("../../assets/ulagos.png")}
          className="w-1/2 h-11 mb-12 mt-8"
        />

        <View className="w-3/4 h-32 border-2 border-green-600 rounded-xl bg-white">
          <Text className="pl-4 pt-3 font-bold">Próxima clase/sesión:</Text>

          {proximaActividad ? (
            <>
              <View className="flex-row items-center pl-4 pt-1 ">
                <Text className="text-lg pl-3">•</Text>
                <Text className="pl-2">
                  {new Date(
                    proximaActividad.fecha_hora_inicio,
                  ).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(
                    proximaActividad.fecha_hora_inicio,
                  ).toLocaleTimeString("es-CL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <View className="flex-row items-center pl-4 pt-3 ">
                <Text className="pl-6 text-gray-500">
                  Instalacion:{" "}
                  {capitalizeFirstLetter(proximaActividad.instalacion)}
                </Text>
              </View>
            </>
          ) : (
            <Text className="pl-4 pt-4 text-gray-500">
              No hay actividades programadas
            </Text>
          )}
        </View>

        {/* Pasar markedDates como prop al calendario */}
        <CustomCalendar markedDates={markedDates} />

        {/* Mostrar la última actividad pasada */}
        <View className="w-3/4 h-32 border-2 border-yellow-600 rounded-xl bg-white mt-2">
          <Text className="pl-4 pt-3 font-bold">
            Última clase/sesión pasada:
          </Text>

          {ultimaActividadPasada ? (
            <>
              <View className="flex-row items-center pl-4 pt-3 ">
                <Text className="text-lg">•</Text>
                <Text className="pl-2">
                  {new Date(
                    ultimaActividadPasada.fecha_hora_inicio,
                  ).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(
                    ultimaActividadPasada.fecha_hora_inicio,
                  ).toLocaleTimeString("es-CL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <View className="flex-row items-center pl-4 pt-4 ">
                <Text className="pl-2 text-gray-500">
                  Instalacion:{" "}
                  {capitalizeFirstLetter(ultimaActividadPasada.instalacion)}
                </Text>
              </View>
            </>
          ) : (
            <Text className="pl-4 pt-4 text-gray-500">
              No hay actividades pasadas registradas
            </Text>
          )}
        </View>

        <Text className="bg-green-600 mt-96">
          p App.js to start working on your app! adasda
        </Text>
        <StatusBar style="light" />
      </View>
    </ScrollView>
  );
}
