import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function NotificationItem({
  image,
  title,
  text,
  status = "",
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-full p-4 bg-gray-300 border-b-8 border-gray-200 flex-row items-center">
        {image && (
          <Image
            source={image}
            className="w-16 h-16 mr-4"
            resizeMode="contain"
          />
        )}
        <View className="flex-1">
          <Text className="font-bold text-lg">{title}</Text>
          <Text className="text-gray-700">{text}</Text>
        </View>
        <View
          className={`w-4 h-4 rounded-full ${
            status === 1 ? "bg-gray-400" : "bg-blue-500"
          }`}
        ></View>
      </View>
    </TouchableOpacity>
  );
}
