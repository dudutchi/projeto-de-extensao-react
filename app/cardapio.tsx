import { View, Text } from "react-native";

export const options = {
  title: "Cardápio",
};

export default function Cardapio() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>🍕 Aqui está o cardápio!</Text>
    </View>
  );
}