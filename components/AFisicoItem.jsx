import React from "react";
import { View, Text } from "react-native";

export const AFisicoItem = ({ value, title }) => {
  return (
    <View className="border-2 border-blue-600 rounded-xl items-center justify-center w-1/3 h-32">
      {/* Asegúrate de que el título sea un string */}
      <Text className="pt-1 font-bold">{title || "N/A"}</Text>

      {/* Asegúrate de que el valor sea un string */}
      <Text>
        {value !== undefined && value !== null ? value.toString() : "N/A"}
      </Text>
    </View>
  );
};
