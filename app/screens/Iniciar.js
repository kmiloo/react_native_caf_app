import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { AuthContext } from "../context/_authContext";

export default function Iniciar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const router = useRouter();
  const [test, setTest] = useState([]);
  const { login, loginError, clearLoginError } = useContext(AuthContext); // Obtener loginError y clearLoginError del contexto

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = () => {
    setErrorEmail("");
    setErrorPassword("");
    clearLoginError(); // Limpiar el error de login antes de intentar

    let isValid = true;

    if (!email) {
      setErrorEmail("El correo electrónico es requerido");
      isValid = false;
    } else if (!validateEmail(email)) {
      setErrorEmail("El correo electrónico no es válido");
      isValid = false;
    }

    if (!password) {
      setErrorPassword("La contraseña es requerida");
      isValid = false;
    }

    if (isValid) {
      login(email, password);
    }
  };

  return (
    <View className="flex items-center h-full bg-[#003da6]">
      <View className="w-full h-36 justify-center items-center mb-12 bg-white">
        <Image
          source={require("../../assets/logocaf.png")}
          className="h-28"
          resizeMode="contain"
        />
      </View>

      <Image
        source={require("../../assets/ulagos.png")}
        className="h-14"
        resizeMode="contain"
      />
      {/*<Text>{JSON.stringify(test, null, 2)}</Text>*/}

      <View className="justify-center items-center bg-white p-11 rounded-3xl mt-12">
        <Text className="font-extrabold text-3xl mb-8">Iniciar Sesión</Text>

        {/* Campo de correo electrónico */}
        <TextInput
          className="border-b-2 border-gray-400 w-64 py-2 mb-3"
          placeholder="Correo electrónico"
          value={email}
          maxLength={50}
          onChangeText={(text) => {
            setEmail(text);
            setErrorEmail("");
          }}
        />
        {errorEmail ? (
          <Text className="text-red-500 text-sm w-64 mb-3">{errorEmail}</Text>
        ) : null}

        {/* Campo de contraseña */}
        <TextInput
          className="border-b-2 border-gray-400 w-64 py-2 mb-3"
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          maxLength={50}
          onChangeText={(text) => {
            setPassword(text);
            setErrorPassword("");
          }}
        />
        {errorPassword ? (
          <Text className="text-red-500 text-sm w-64 mb-3">
            {errorPassword}
          </Text>
        ) : null}

        {/* Mostrar mensaje de error del login */}
        {loginError ? (
          <Text className="text-red-500 text-sm w-64 mb-3">{loginError}</Text>
        ) : null}

        {/* Botón de inicio de sesión */}
        <TouchableOpacity
          className="bg-blue-500 w-64 py-2 mb-4 rounded-full"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-bold">
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        {/* Enlace a registro */}
        <View className="flex-row">
          <Text className="">¿Aun no tienes una cuenta? </Text>
          <Link
            href="screens/Registro"
            className="text-blue-500 hover:underline"
          >
            Registrarse
          </Link>
        </View>
      </View>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
    </View>
  );
}
