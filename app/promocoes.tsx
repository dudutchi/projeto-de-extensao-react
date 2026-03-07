import React, { useMemo } from "react";
import {
    Image,
    ImageSourcePropType,
    Linking,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
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
      imageHeight: isTablet ? 280 : 200,
      buttonPadding: isTablet ? 16 : 14,
    }),
    [width, isTablet],
  );
};

interface PromoCardProps {
  image: ImageSourcePropType;
  onPress: () => void;
  imageHeight: number;
  name?: string;
  description?: string;
  textSize?: number;
}

const PromoCard: React.FC<PromoCardProps> = ({
  image,
  onPress,
  imageHeight,
  name,
  description,
  textSize = 14,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      opacity: pressed ? 0.7 : 1,
      marginBottom: 16,
    })}
  >
    <View style={styles.imageContainer}>
      <Image
        source={image}
        style={[styles.promoImage, { height: imageHeight }]}
      />
    </View>
    {name && (
      <Text
        style={{
          fontSize: textSize,
          fontWeight: "700",
          color: "#0f3d0f",
          marginTop: 10,
          textAlign: "center",
        }}
      >
        {name}
      </Text>
    )}
    {description && (
      <Text
        style={{
          fontSize: textSize - 2,
          color: "#1a5c1a",
          marginTop: 4,
          textAlign: "center",
          lineHeight: 16,
        }}
      >
        {description}
      </Text>
    )}
  </Pressable>
);

export default function Promocoes() {
  const responsive = useResponsive();

  const openWhatsApp = () => {
    const whatsappUrl =
      "https://chat.whatsapp.com/ErixSqBX1qYJoTUzCR8EV7?mode=hqrt2";
    Linking.openURL(whatsappUrl);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={[
          styles.container,
          {
            paddingHorizontal: responsive.paddingHorizontal,
            paddingTop: responsive.paddingVertical,
            paddingBottom: 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.mainTitle,
            {
              fontSize: responsive.titleSize,
              color: "#0f3d0f",
              marginBottom: 8,
            },
          ]}
        >
          Nossas Promoções
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
          Aproveite nossas ofertas especiais e economize na sua pizza favorita!
        </Text>

        {/* Primeira linha: 2 promoções */}
        <View style={styles.promosRow}>
          <View style={styles.promosColumn}>
            <PromoCard
              image={require("../assets/images/combo familia promo.png")}
              onPress={() => {}}
              imageHeight={responsive.imageHeight}
              name="Combo Família"
              description="Para 4 pessoas"
              textSize={responsive.textSize}
            />
          </View>
          <View style={styles.promosColumn}>
            <PromoCard
              image={require("../assets/images/promo 80 300.png")}
              onPress={() => {}}
              imageHeight={responsive.imageHeight}
              name="80% de Desconto"
              description="Em bebidas"
              textSize={responsive.textSize}
            />
          </View>
        </View>

        {/* Segunda linha: 2 promoções */}
        <View style={styles.promosRow}>
          <View style={styles.promosColumn}>
            <PromoCard
              image={require("../assets/images/aniversario 300.png")}
              onPress={() => {}}
              imageHeight={responsive.imageHeight}
              name="Promoção Aniversário"
              description="Ganhe brindes especiais"
              textSize={responsive.textSize}
            />
          </View>
          <View style={styles.promosColumn}>
            <PromoCard
              image={require("../assets/images/cupom 300.png")}
              onPress={() => {}}
              imageHeight={responsive.imageHeight}
              name="Cupom Desconto"
              description="Até R$ 30 de economia"
              textSize={responsive.textSize}
            />
          </View>
        </View>

        {/* Seção de Benefícios */}
        <View
          style={{
            backgroundColor: "#f9f9f9",
            borderLeftWidth: 4,
            borderLeftColor: "#12a049",
            padding: responsive.paddingVertical,
            borderRadius: 8,
            marginBottom: responsive.paddingVertical * 1.75,
          }}
        >
          <Text
            style={{
              fontSize: responsive.textSize + 2,
              fontWeight: "700",
              color: "#0f3d0f",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            ✅ Por que aproveitar nossas promoções?
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#333",
              lineHeight: 20,
              marginBottom: 8,
            }}
          >
            • <Text style={{ fontWeight: "600" }}>Economize:</Text> Até 30% de
            desconto em nossas melhores pizzas
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#333",
              lineHeight: 20,
              marginBottom: 8,
            }}
          >
            • <Text style={{ fontWeight: "600" }}>Combos especiais:</Text>{" "}
            Pizzas + bebidas com preços incríveis
          </Text>
          <Text
            style={{
              fontSize: responsive.textSize,
              color: "#333",
              lineHeight: 20,
            }}
          >
            • <Text style={{ fontWeight: "600" }}>Fidelidade:</Text> Quanto mais
            pede, mais cupons você ganha!
          </Text>
        </View>

        {/* Seção de informações */}
        <View
          style={[
            styles.infoSection,
            { marginTop: responsive.paddingVertical * 0.75 },
          ]}
        >
          <Text
            style={[
              styles.sloganText,
              {
                fontSize: responsive.subtitleSize,
                marginBottom: responsive.paddingVertical,
              },
            ]}
          >
            Pizzaria CarioK — Sabor que conquista!
          </Text>

          <Pressable
            onPress={openWhatsApp}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#0a2a0a" : "#0f3d0f",
              paddingVertical: responsive.buttonPadding,
              borderRadius: 8,
              alignItems: "center",
              marginVertical: responsive.paddingVertical,
              width: "100%",
            })}
          >
            <Text
              style={[
                styles.contactButtonText,
                { fontSize: responsive.subtitleSize },
              ]}
            >
              💬 Fale Conosco via WhatsApp
            </Text>
          </Pressable>

          <Text
            style={[styles.copyright, { fontSize: responsive.textSize - 2 }]}
          >
            © 2025 Pizzaria CarioK
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  mainTitle: {
    fontWeight: "700",
    color: "#0f3d0f",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  promosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  promosColumn: {
    flex: 1,
    marginHorizontal: 6,
  },
  promosRowSingle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promoImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  infoSection: {
    marginTop: 28,
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 4,
    borderLeftColor: "#1a5c1a",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  sloganText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f3d0f",
    textAlign: "center",
    marginBottom: 12,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  copyright: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});
