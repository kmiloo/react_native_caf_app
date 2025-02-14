import React from "react";
import { View, Image } from "react-native";
import { UserIcon } from "./Icons";

export const CustomHeader = () => {
  return (
    <View className="">
      {/* separacion */}
      <View className="bg-[#003da6] h-5"></View>

      {/* Logo */}
      <Image
        source={require("../assets/logo_caf.png")}
        className="w-full h-28"
      />

      {/* Ícono de perfil */}
    </View>
  );
};
