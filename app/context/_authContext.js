import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext(); // Exporta el contexto

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null); // Nuevo estado para errores de registro

  const login = async (correo, contrasena) => {
    setLoginError(null);
    try {
      const response = await axios.post("http://192.168.1.11:8080/login", {
        correo,
        contrasena,
      });

      if (response.data.success) {
        const token = response.data.token;
        setUserToken(token);
        setIsLoading(false);
        await AsyncStorage.setItem("userToken", token);
      } else {
        setLoginError("Credenciales inválidas");
      }
    } catch (error) {
      //console.error("El eror es: ", error.status);
      if (error.status === 401) {
        setLoginError("Credenciales inválidas");
        return;
      }
      setLoginError("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  const register = async (nombre, apellido, rut, correo, contrasena_hash) => {
    setRegisterError(null); // Limpiar el error de registro
    try {
      const response = await axios.post("http://192.168.1.11:8080/register", {
        nombre,
        apellido,
        rut,
        correo,
        contrasena_hash,
      });

      if (response.data.success) {
        // Registro exitoso
        console.log("Registro exitoso:", response.data);
      } else {
        // Error en el registro
        setRegisterError("Error al registrarse. Inténtalo de nuevo.");
      }
    } catch (error) {
      //console.error("Error en el registro:", error);
      setRegisterError("Error al registrarse. Inténtalo de nuevo.");
    }
  };

  const logout = () => {
    setUserToken(null);
    setIsLoading(false);
    AsyncStorage.removeItem("userToken");
  };

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
        registerError, // Pasar el error de registro al contexto
        clearLoginError: () => setLoginError(null),
        clearRegisterError: () => setRegisterError(null), // Limpiar el error de registro
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
