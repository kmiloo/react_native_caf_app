import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext(); // Exporta el contexto

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const login = async (correo, contrasena) => {
    setLoginError(null);
    try {
      const response = await axios.post("http://192.168.1.11:8080/login", {
        correo,
        contrasena,
      });
      console.log("Respuesta del backend:", response.data);

      if (response.data.success) {
        const token = response.data.token;
        setUserToken(token);
        setIsLoading(false);
        await AsyncStorage.setItem("userToken", token); // Guarda el token en AsyncStorage
        //console.log("Token guardado:", token);
      } else {
        setLoginError("Credenciales inválidas");
        //console.log("Credenciales inválidas");
      }
    } catch (error) {
      //console.error("Error en el login:", error);
      setLoginError("Error al iniciar sesion. Inténtalo de nuevo.");
    }
  };

  const register = async (nombre, apellido, correo, contrasena_hash) => {
    try {
      const response = await axios.post("http://192.168.1.11:8080/register", {
        nombre,
        apellido,
        correo,
        contrasena_hash,
      });
      //console.log("Respuesta del backend:", response.data);

      if (response.data.success) {
        /*const token = response.data.token;
        setUserToken(token);
        setIsLoading(false);
        await AsyncStorage.setItem("userToken", token); // Guarda el token en AsyncStorage
        console.log("Token guardado:", token);*/
      } else {
        console.log("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  const logout = () => {
    setUserToken(null);
    setIsLoading(false);
    AsyncStorage.removeItem("userToken"); // Elimina el token de AsyncStorage
  };

  // Verifica si el usuario ya tiene un token al cargar la aplicación
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        setUserToken(token);
      }
      setIsLoading(false);
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        login,
        logout,
        register,
        loginError,
        clearLoginError: () => setLoginError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
