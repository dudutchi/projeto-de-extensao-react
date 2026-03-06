import { router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function OndeEstamos() {
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
        Onde Nos Encontrar
      </Text>

      <View
        style={{
          height: 3,
          width: 80,
          backgroundColor: "#1a5c1a",
          marginBottom: 24,
          borderRadius: 2,
        }}
      />

      <View
        style={{
          width: "100%",
          height: 280,
          marginBottom: 28,
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
          source={require("../assets/images/endereco.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "cover",
          }}
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
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 15, color: "#0f3d0f", marginBottom: 10, fontWeight: "600" }}>
          🔎 Pontos de referência próximos:
        </Text>
        <Text style={{ fontSize: 14, color: "#333", lineHeight: 20, opacity: 0.8 }}>
          A poucos minutos da Rua Dias da Cruz, Centro Universitário Carioca
          (UNICARIOCA), Praça Agripino Grieco e Estação do Méier.
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          backgroundColor: "#fafafa",
          padding: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e8e8e8",
          marginBottom: 28,
        }}
      >
        <Text style={{ fontSize: 15, color: "#0f3d0f", marginBottom: 10, fontWeight: "600" }}>
          🗺️ Como chegar:
        </Text>
        <Text style={{ fontSize: 14, color: "#333", lineHeight: 20, opacity: 0.8 }}>
          Basta buscar por: "Pizzaria CarioK – Rua Venceslau 318, Méier".
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/promocoes")}
        style={({ pressed }) => ({
          width: "100%",
          paddingVertical: 14,
          backgroundColor: pressed ? "#0a2a0a" : "#0f3d0f",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#0f3d0f",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 3,
        })}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff", letterSpacing: 0.3 }}>
          🎉 Promoções
        </Text>
      </Pressable>
    </ScrollView>
  );
}