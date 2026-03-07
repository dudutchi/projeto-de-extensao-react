import { useMemo } from "react";
import {
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return useMemo(
    () => ({
      isTablet,
      paddingHorizontal: isTablet ? 48 : 24,
      paddingVertical: isTablet ? 24 : 16,
      titleSize: isTablet ? 40 : 32,
      subtitleSize: isTablet ? 16 : 15,
      textSize: isTablet ? 16 : 14,
      imageHeight: isTablet ? 400 : 280,
      buttonPadding: isTablet ? 16 : 14,
    }),
    [width, isTablet],
  );
};

export default function OndeEstamos() {
  const responsive = useResponsive();

  const openWhatsApp = () => {
    const whatsappUrl =
      "https://chat.whatsapp.com/ErixSqBX1qYJoTUzCR8EV7?mode=hqrt2";
    Linking.openURL(whatsappUrl);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: responsive.paddingHorizontal,
          paddingTop: responsive.paddingVertical * 2,
          paddingBottom: responsive.paddingVertical * 2.5,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: responsive.titleSize,
            fontWeight: "700",
            color: "#0f3d0f",
            textAlign: "center",
            letterSpacing: -0.5,
            marginBottom: 8,
          }}
        >
          Onde Nos Encontrar
        </Text>
        <Text
          style={{
            fontSize: responsive.textSize,
            color: "#1a5c1a",
            textAlign: "center",
            lineHeight: responsive.isTablet ? 22 : 18,
            marginBottom: responsive.paddingVertical * 2,
          }}
        >
          Visite-nos na região do Méier e aproveite as melhores pizzas da
          cidade!
        </Text>

        <View
          style={{
            width: "100%",
            height: responsive.imageHeight,
            marginBottom: responsive.paddingVertical * 1.75,
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
            padding: responsive.paddingVertical,
            borderRadius: 8,
            marginBottom: responsive.paddingVertical * 1.25,
          }}
        >
          <Text
            style={{
              fontSize: responsive.subtitleSize,
              color: "#0f3d0f",
              marginBottom: responsive.paddingVertical,
              fontWeight: "600",
            }}
          >
            🔎 Pontos de referência próximos:
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#333",
              lineHeight: responsive.isTablet ? 24 : 20,
              opacity: 0.8,
            }}
          >
            A poucos minutos da Rua Dias da Cruz, Centro Universitário Carioca
            (UNICARIOCA), Praça Agripino Grieco e Estação do Méier.
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            backgroundColor: "#fafafa",
            padding: responsive.paddingVertical,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#e8e8e8",
            marginBottom: responsive.paddingVertical * 1.75,
          }}
        >
          <Text
            style={{
              fontSize: responsive.subtitleSize,
              color: "#0f3d0f",
              marginBottom: responsive.paddingVertical,
              fontWeight: "600",
            }}
          >
            🗺️ Como chegar:
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#333",
              lineHeight: responsive.isTablet ? 24 : 20,
              opacity: 0.8,
            }}
          >
            Basta buscar por: "Pizzaria CarioK – Rua Venceslau 318, Méier".
          </Text>
        </View>

        {/* WhatsApp Button */}
        <Pressable
          onPress={openWhatsApp}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#0f3d0f" : "#0e3e0e",
            paddingVertical: responsive.buttonPadding + 4,
            paddingHorizontal: responsive.paddingHorizontal,
            borderRadius: 8,
            width: "100%",
            alignItems: "center",
            marginBottom: responsive.paddingVertical * 1.75,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          })}
        >
          <Text
            style={{
              fontSize: responsive.subtitleSize,
              fontWeight: "700",
              color: "#fff",
              letterSpacing: 0.5,
            }}
          >
            💬 Converse Conosco no WhatsApp
          </Text>
        </Pressable>

        {/* Horários de Funcionamento */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#fff8f0",
            borderLeftWidth: 4,
            borderLeftColor: "#ffc107",
            padding: responsive.paddingVertical,
            borderRadius: 8,
            marginBottom: responsive.paddingVertical * 1.5,
          }}
        >
          <Text
            style={{
              fontSize: responsive.subtitleSize,
              color: "#ffc107",
              marginBottom: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            ⏰ Horários de Funcionamento
          </Text>
          <View style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontSize: responsive.textSize,
                fontWeight: "600",
                color: "#0f3d0f",
                marginBottom: 2,
              }}
            >
              Segunda a Quinta:
            </Text>
            <Text style={{ fontSize: responsive.textSize, color: "#333" }}>
              18:00 às 23:00
            </Text>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontSize: responsive.textSize,
                fontWeight: "600",
                color: "#0f3d0f",
                marginBottom: 2,
              }}
            >
              Sexta a Domingo:
            </Text>
            <Text style={{ fontSize: responsive.textSize, color: "#333" }}>
              18:00 à 00:00
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: responsive.textSize,
                fontWeight: "600",
                color: "#0f3d0f",
                marginBottom: 2,
              }}
            >
              Feriados:
            </Text>
            <Text style={{ fontSize: responsive.textSize, color: "#333" }}>
              19:00 à 00:00
            </Text>
          </View>
        </View>

        {/* Seção de Contato */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#0f3d0f",
            padding: responsive.paddingVertical,
            borderRadius: 8,
            marginBottom: responsive.paddingVertical * 1.5,
          }}
        >
          <Text
            style={{
              fontSize: responsive.subtitleSize,
              color: "#fff",
              marginBottom: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            📞 Entre em Contato
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#f0f0f0",
              marginBottom: 6,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Endereço:</Text> Rua Venceslau,
            318 - Méier
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#f0f0f0",
              marginBottom: 6,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Bairro:</Text> Méier, Rio de
            Janeiro - RJ
          </Text>
          <Text style={{ fontSize: responsive.textSize, color: "#f0f0f0" }}>
            <Text style={{ fontWeight: "600" }}>WhatsApp:</Text> Clique no botão
            acima para conversar!
          </Text>
        </View>

        {/* Informações Úteis */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#fafafa",
            borderLeftWidth: 4,
            borderLeftColor: "#1a5c1a",
            padding: responsive.paddingVertical,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: responsive.subtitleSize,
              color: "#0f3d0f",
              marginBottom: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            ℹ️ Informações Úteis
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#333",
              lineHeight: 20,
              marginBottom: 8,
            }}
          >
            • <Text style={{ fontWeight: "600" }}>Entrega:</Text> Realizamos
            entregas em toda região do Méier e adjacências
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#333",
              lineHeight: 20,
              marginBottom: 8,
            }}
          >
            • <Text style={{ fontWeight: "600" }}>Retirada:</Text> 10% de
            desconto se retirar no local
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#333",
              lineHeight: 20,
              marginBottom: 8,
            }}
          >
            • <Text style={{ fontWeight: "600" }}>Pedidos Online:</Text>{" "}
            Acompanhe seu pedido em tempo real
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#333",
              lineHeight: 20,
            }}
          >
            • <Text style={{ fontWeight: "600" }}>Pagamento:</Text> Dinheiro,
            cartão, PIX e WhatsApp Pay
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
