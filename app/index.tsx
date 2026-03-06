import { router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function Index() {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        alignItems: "center",
      }}
      showsVerticalScrollIndicator={false}
    >
      
      <Text
        style={{
          fontSize: 32,
          fontWeight: "700",
          color: "#0f3d0f",
          marginBottom: 8,
          textAlign: "center",
          letterSpacing: -0.5,
        }}
      >
        Pizzaria CarioK
      </Text>

      <View
        style={{
          height: 3,
          width: 80,
          backgroundColor: "#1a5c1a",
          marginBottom: 16,
          borderRadius: 2,
        }}
      />

      <Text
        style={{
          fontSize: 14,
          color: "#1a5c1a",
          marginBottom: 32,
          textAlign: "center",
          fontWeight: "600",
          letterSpacing: 1,
        }}
      >
        A MELHOR PIZZA DO RIO DE JANEIRO
      </Text>

      <View
        style={{
          width: "100%",
          height: 280,
          marginBottom: 32,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Image
          source={require("../assets/images/melhor-pizza2.0.png")}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        />
      </View>

      <View
        style={{
          width: "100%",
          backgroundColor: "#f9f9f9",
          borderLeftWidth: 4,
          borderLeftColor: "#0f3d0f",
          padding: 16,
          borderRadius: 8,
          marginBottom: 28,
        }}
      >
        <Text style={{ fontSize: 15, color: "#0f3d0f", marginBottom: 10, fontWeight: "600" }}>
          🚚 Entregamos nos seguintes bairros:
        </Text>
        <Text style={{ fontSize: 14, color: "#333", lineHeight: 20, opacity: 0.8 }}>
          Engenho de Dentro, Cachambi, Lins de Vasconcelos, Grajaú, Todos os
          Santos, Del Castilho, Maria da Graça, Piedade, Abolição.
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/OndeEstamos")}
        style={({ pressed }) => ({
          width: "100%",
          paddingVertical: 14,
          backgroundColor: pressed ? "#0a2a0a" : "#0f3d0f",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
          elevation: 3,
        })}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
          📍 Onde Estamos
        </Text>
      </Pressable>

      <View
        style={{
          width: "100%",
          backgroundColor: "#fafafa",
          padding: 20,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e8e8e8",
        }}
      >
        <Text style={{ fontSize: 14, color: "#333", lineHeight: 24, textAlign: "justify", marginBottom: 12 }}>
          A Pizzaria CarioK foi fundada em 30 de novembro de 2025 com a missão
          de conquistar o coração do nosso público através de pizzas sempre
          quentinhas e irresistíveis.
        </Text>

        <Text style={{ fontSize: 14, color: "#333", lineHeight: 24, textAlign: "justify", marginBottom: 12 }}>
          Aqui, fazemos tudo pensando em você: oferecemos promoções especiais ao
          longo da semana, preços acessíveis e, acima de tudo, pratos preparados
          com carinho e dedicação.
        </Text>

        <Text style={{ fontSize: 15, color: "#0f3d0f", textAlign: "center", fontWeight: "600", fontStyle: "italic" }}>
          "Sabor de verdade é feito com amor."
        </Text>
      </View>
    </ScrollView>
  );
}