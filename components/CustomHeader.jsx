import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { UserIcon } from "./Icons";
import { Link } from "expo-router";

export const CustomHeader = ({ profileRoute }) => {
  return (
    <View className="">
      {/* Separación */}
      <View className="bg-[#003da6] h-5"></View>

      {/* Logo */}
      <Image
        source={require("../assets/logo_caf.png")}
        className="w-full h-28"
      />

      {/* Ícono de perfil */}
      <Link href={profileRoute} asChild>
        <TouchableOpacity className="flex-row items-center justify-center absolute right-4 top-12 bg-[#d9d9d9] rounded-full w-14 h-14">
          <UserIcon />
        </TouchableOpacity>
      </Link>
      <View className="bg-gray-400 h-[1px] mt-[1px]"></View>
    </View>
  );
};
