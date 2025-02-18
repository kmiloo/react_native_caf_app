import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { AuthContext } from "../context/_authContext";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rut, setRut] = useState("");
  const [errorRut, setErrorRut] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorApellido, setErrorApellido] = useState("");
  const router = useRouter();
  const { register, registerError, clearRegisterError } =
    useContext(AuthContext);

  const formatRut = (text) => {
    text = text.replace(/[^0-9kK]/g, "");
    if (text.length > 9) {
      text = text.slice(0, 9);
    }
    if (text.length > 1) {
      text = text.replace(/(\d{1,2})(\d{3})(\d{3})([0-9kK])?/, "$1.$2.$3-$4");
    }
    return text;
  };

  const handleRutChange = (text) => {
    const formattedRut = formatRut(text);
    setRut(formattedRut);
    setErrorRut("");
  };

  const validateRut = (rut) => {
    if (rut.length !== 12) return false;
    const regex = /^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/;
    if (!regex.test(rut)) return false;

    rut = rut.replace(/\./g, "").replace(/-/g, "");
    const body = rut.slice(0, -1);
    let dv = rut.slice(-1).toLowerCase();

    let sum = 0,
      multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += body[i] * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    let calculatedDv = 11 - (sum % 11);
    if (calculatedDv === 11) calculatedDv = "0";
    if (calculatedDv === 10) calculatedDv = "k";

    return dv === calculatedDv.toString();
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = () => {
    let isValid = true;

    if (!rut || !validateRut(rut)) {
      setErrorRut("El RUT ingresado no es válido");
      isValid = false;
    }
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
    if (!confirmPassword) {
      setErrorConfirmPassword("La confirmación de la contraseña es requerida");
      isValid = false;
    } else if (password !== confirmPassword) {
      setErrorConfirmPassword("Las contraseñas no coinciden");
      isValid = false;
    }
    if (!nombre) {
      setErrorNombre("El nombre es requerido");
      isValid = false;
    }
    if (!apellido) {
      setErrorApellido("El apellido es requerido");
      isValid = false;
    }
    if (isValid) {
      if (register(nombre, apellido, rut, email, password)) {
        Alert.alert(
          "Registro exitoso",
          "Puede iniciar sesión",
          [{ text: "Aceptar", onPress: () => router.push("/") }],
          { cancelable: false },
        );
        setNombre("");
        setApellido("");
        setRut("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    }
  };

  React.useEffect(() => {
    if (registerError) {
      Alert.alert("Error", registerError, [
        { text: "Aceptar", onPress: () => clearRegisterError() },
      ]);
    }
  }, [registerError]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#003da6" }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
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
          <View className="justify-center items-center bg-white p-11 rounded-3xl mt-12">
            <Text className="font-extrabold text-3xl mb-8">Registrarse</Text>
            <TextInput
              className="border-b-2 border-gray-400 w-64 py-2 mb-3"
              placeholder="RUT (12.345.678-9)"
              value={rut}
              onChangeText={handleRutChange}
              maxLength={12}
            />
            {errorRut ? (
              <Text className="text-red-500 text-sm w-64 mb-3">{errorRut}</Text>
            ) : null}
            <TextInput
              className="border-b-2 border-gray-400 w-64 py-2 mb-3"
              placeholder="Nombre"
              value={nombre}
              maxLength={50}
              onChangeText={(text) => {
                setNombre(text);
                setErrorNombre("");
              }}
            />
            {errorNombre ? (
              <Text className="text-red-500 text-sm w-64 mb-3">
                {errorNombre}
              </Text>
            ) : null}
            <TextInput
              className="border-b-2 border-gray-400 w-64 py-2 mb-3"
              placeholder="Apellido"
              value={apellido}
              maxLength={50}
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
              <Text className="text-red-500 text-sm w-64 mb-3">
                {errorEmail}
              </Text>
            ) : null}
            <TextInput
              className="border-b-2 border-gray-400 w-64 py-2 mb-4"
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
            <TextInput
              className="border-b-2 border-gray-400 w-64 py-2 mb-4"
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              maxLength={50}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrorConfirmPassword("");
              }}
            />
            {errorConfirmPassword ? (
              <Text className="text-red-500 text-sm w-64 mb-3">
                {errorConfirmPassword}
              </Text>
            ) : null}
            <TouchableOpacity
              className="bg-blue-500 w-64 py-2 mb-4 rounded-full"
              onPress={handleRegister}
            >
              <Text className="text-white text-center font-bold">
                Registrarse
              </Text>
            </TouchableOpacity>
            <View className="flex-row">
              <Text>¿Ya tienes una cuenta? </Text>
              <Link href="/" className="text-blue-500 hover:underline">
                Iniciar Sesión
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
