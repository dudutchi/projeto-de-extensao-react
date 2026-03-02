import { View, Text, Button } from "react-native";
import { router } from "expo-router";


export default function Index() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Bem-vindos à Pizzaria CarioK!</Text>

      <Button
        title="Ver Cardápio 🍕"
        onPress={() => router.push("/cardapio")}
      />
    
    </View>
  );
}
