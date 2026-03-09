import { router } from "expo-router";
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


export default function pedido() {
  return (
    <View style={{ justifyContent:"center", alignItems:"center"}}>
      <Text
          style={{
            fontSize: 35,
            fontWeight: "700",
            color: "#0f3d0f",
            textAlign: "center",
            letterSpacing: -0.5,
            marginTop: 10,
          }}
        >
          Faça seu Pedido!
        </Text>
    </View>
  );
}