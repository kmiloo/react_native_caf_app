import React from "react";
import { View, Text } from "react-native";

export const AFisicoItem = ({ value, title }) => {
  return (
    <View className="border-2 border-blue-600 rounded-xl w-1/3 h-32 items-center justify-center ">
      {/*  el título sea un string */}
      <Text className="pt-1 font-bold text-justify">{title || "N/A"}</Text>

      {/* el valor sea un string */}
      <Text className="pt-1">
        {value !== undefined && value !== null ? value.toString() : "N/A"}
      </Text>
    </View>
  );
};
