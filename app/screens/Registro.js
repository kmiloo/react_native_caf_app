import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { AuthContext } from "../context/_authContext";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorApellido, setErrorApellido] = useState("");
  const router = useRouter();
  const { register } = useContext(AuthContext);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = () => {
    //console.log("Registro exitoso", nombre, apellido, email, password);

    let isValid = true;

    if (!email) {
      setErrorEmail("El correo electrónico es requerido");
      isValid = false;
    } else if (!validateEmail(email)) {
      setErrorEmail("El correo electrónico no es válido");
      isValid = false;
    }

    if (!password || password.length < 8 || !/\d/.test(password)) {
      setErrorPassword(
        "La contraseña debe tener al menos 8 caracteres y contener números",
      );
      isValid = false;
    }
    if (!nombre) {
      setErrorNombre("El nombre es requerida");
      isValid = false;
    }
    if (!apellido) {
      setErrorApellido("El apellido es requerida");
      isValid = false;
    }
    if (isValid) {
      console.log("Registro exitoso", nombre, apellido, email, password);
      register(nombre, apellido, email, password);
      // Mostrar alerta y redirigir después de que el usuario presione "Aceptar"
      Alert.alert(
        "Registro exitoso",
        "Puede iniciar sesión",
        [
          {
            text: "Aceptar",
            onPress: () => router.push("/"), // Redirigir a la página de inicio
          },
        ],
        { cancelable: false },
      );

      // Limpiar los campos del formulario
      setNombre("");
      setApellido("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <View className="flex items-center h-full bg-[#003da6]">
      <View className="w-full h-44 justify-center items-center mb-12 bg-white">
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
      <View className="justify-center items-center bg-white p-11 rounded-3xl mt-12">
        <Text className="font-extrabold text-3xl mb-8">Registrarse</Text>
        <TextInput
          className="border-b-2 border-gray-400 w-64 py-2 mb-4"
          placeholder="Nombre"
          value={nombre}
          onChangeText={(text) => {
            setNombre(text);
            setErrorNombre("");
          }}
        />
        {errorNombre ? (
          <Text className="text-red-500 text-sm w-64 mb-3">{errorNombre}</Text>
        ) : null}
        <TextInput
          className="border-b-2 border-gray-400 w-64 py-2 mb-4"
          placeholder="Apellido"
          value={apellido}
          onChangeText={(text) => {
            setApellido(text);
            setErrorApellido("");
          }}
        />
        {errorApellido ? (
          <Text className="text-red-500 text-sm w-64 mb-3">
            {errorApellido}
          </Text>
        ) : null}
        {/* Campo de correo electrónico */}
        <TextInput
          className="border-b-2 border-gray-400 w-64 py-2 mb-1"
          placeholder="Correo electrónico"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorEmail("");
          }}
        />
        {errorEmail ? (
          <Text className="text-red-500 text-sm w-64 mb-3">{errorEmail}</Text>
        ) : null}
        <TextInput
          className="border-b-2 border-gray-400 w-64 py-2 mb-4"
          placeholder="Contraseña"
          secureTextEntry
          value={password}
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

        <TouchableOpacity
          className="bg-blue-500 w-64 py-2 mb-4 rounded-full"
          onPress={handleRegister}
        >
          <Text className="text-white text-center font-bold">Registrarse</Text>
        </TouchableOpacity>
        <View className="flex-row">
          <Text className="">¿Ya tienes una cuenta? </Text>
          <Link href="/" className="text-blue-500 hover:underline">
            Iniciar Sesión
          </Link>
        </View>
      </View>
    </View>
  );
}
