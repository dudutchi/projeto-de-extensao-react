import { View, Text, Button, Image } from "react-native";
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
    <Image
        source={require("../assets/images/logo.png")}
        style={{
          width: 200,
          height: 200,
          resizeMode: "contain",
        }}
      />

      <Image

        source={require("../assets/images/melhor-pizza2.0.png")}
        style={{
          width: 300,
          height: 300,
          borderRadius: 20,
        }}


      />

    </View>
  );
}
