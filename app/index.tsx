import { router } from "expo-router";
import { useMemo } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

const useResponsive = () => {
  const { width, height } = Dimensions.get("window");
  const isTablet = width >= 768;

  return useMemo(
    () => ({
      isTablet,
      width,
      height,
      paddingHorizontal: isTablet ? 48 : 24,
      paddingVertical: isTablet ? 24 : 16,
      titleSize: isTablet ? 40 : 32,
      subtitleSize: isTablet ? 18 : 16,
      textSize: isTablet ? 16 : 14,
      imageHeight: isTablet ? 400 : 280,
      buttonPadding: isTablet ? 16 : 14,
    }),
    [width, isTablet],
  );
};

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
  responsive: ReturnType<typeof useResponsive>;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  icon,
  title,
  description,
  responsive,
}) => (
  <View
    style={{
      backgroundColor: "#f9f9f9",
      borderLeftWidth: 4,
      borderLeftColor: "#1a5c1a",
      padding: responsive.paddingVertical,
      borderRadius: 8,
      marginBottom: responsive.paddingVertical,
    }}
  >
    <Text
      style={{
        fontSize: responsive.subtitleSize,
        fontWeight: "700",
        color: "#0f3d0f",
        marginBottom: 8,
      }}
    >
      {icon} {title}
    </Text>
    <Text
      style={{
        fontSize: responsive.textSize,
        color: "#444",
        lineHeight: responsive.isTablet ? 24 : 20,
      }}
    >
      {description}
    </Text>
  </View>
);

export default function Index() {
  const responsive = useResponsive();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: responsive.paddingHorizontal,
        paddingTop: responsive.paddingVertical * 2,
        paddingBottom: responsive.paddingVertical * 2.5,
        alignItems: "center",
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <Text
        style={{
          fontSize: responsive.titleSize,
          fontWeight: "700",
          color: "#0f3d0f",
          marginBottom: responsive.paddingVertical,
          textAlign: "center",
          letterSpacing: -0.5,
        }}
      >
        Pizzaria CarioK
      </Text>

      <View
        style={{
          height: 3,
          width: responsive.isTablet ? 120 : 80,
          backgroundColor: "#1a5c1a",
          marginBottom: responsive.paddingVertical,
          borderRadius: 2,
        }}
      />

      <Text
        style={{
          fontSize: responsive.subtitleSize,
          color: "#1a5c1a",
          marginBottom: responsive.paddingVertical * 2,
          textAlign: "center",
          fontWeight: "600",
          letterSpacing: 1,
        }}
      >
        A MELHOR PIZZA DO RIO DE JANEIRO
      </Text>

      {/* Imagem destaque */}
      <View
        style={{
          width: "100%",
          height: responsive.imageHeight,
          marginBottom: responsive.paddingVertical * 2,
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

      {/* Seção de destaque com promoções */}
      <View
        style={{
          width: "100%",
          backgroundColor: "#0f3d0f",
          padding: responsive.paddingVertical * 1.5,
          borderRadius: 12,
          marginBottom: responsive.paddingVertical * 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: responsive.subtitleSize,
            fontWeight: "700",
            color: "#fff",
            marginBottom: responsive.paddingVertical,
            textAlign: "center",
          }}
        >
          🎉 Promoções Imperdíveis!
        </Text>
        <Text
          style={{
            fontSize: responsive.textSize,
            color: "#f0f0f0",
            textAlign: "center",
            lineHeight: responsive.isTablet ? 24 : 20,
            marginBottom: responsive.paddingVertical,
          }}
        >
          Combo Família • Tá na Terça • Aniversariante • Cupom Desconto
        </Text>
        <Pressable
          onPress={() => router.push("/promocoes")}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#ffc107" : "#fff",
            paddingVertical: responsive.buttonPadding,
            borderRadius: 8,
            alignItems: "center",
            elevation: 2,
          })}
        >
          <Text
            style={{
              fontSize: responsive.subtitleSize,
              fontWeight: "700",
              color: "#0f3d0f",
            }}
          >
            Ver Todas as Promoções
          </Text>
        </Pressable>
      </View>

      {/* Seção de entrega */}
      <View
        style={{
          width: "100%",
          backgroundColor: "#f9f9f9",
          borderLeftWidth: 4,
          borderLeftColor: "#0f3d0f",
          padding: responsive.paddingVertical,
          borderRadius: 8,
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
          🚚 Entregamos nos seguintes bairros:
        </Text>
        <Text
          style={{
            fontSize: responsive.textSize,
            color: "#333",
            lineHeight: responsive.isTablet ? 24 : 20,
            opacity: 0.8,
          }}
        >
          Engenho de Dentro, Cachambi, Lins de Vasconcelos, Grajaú, Todos os
          Santos, Del Castilho, Maria da Graça, Piedade, Abolição.
        </Text>
      </View>

      {/* Botões de ação */}
      <View
        style={{
          width: "100%",
          gap: responsive.paddingVertical,
          marginBottom: responsive.paddingVertical * 1.75,
        }}
      >
        <Pressable
          onPress={() => router.push("/cardapio")}
          style={({ pressed }) => ({
            width: "100%",
            paddingVertical: responsive.buttonPadding,
            backgroundColor: pressed ? "#0a2a0a" : "#0f3d0f",
            borderRadius: 8,
            alignItems: "center",
            elevation: 3,
          })}
        >
          <Text
            style={{
              fontSize: responsive.subtitleSize,
              fontWeight: "600",
              color: "#fff",
            }}
          >
            📋 Nosso Cardápio
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/OndeEstamos")}
          style={({ pressed }) => ({
            width: "100%",
            paddingVertical: responsive.buttonPadding,
            backgroundColor: pressed ? "#0a2a0a" : "#1a5c1a",
            borderRadius: 8,
            alignItems: "center",
            elevation: 3,
          })}
        >
          <Text
            style={{
              fontSize: responsive.subtitleSize,
              fontWeight: "600",
              color: "#fff",
            }}
          >
            📍 Onde Estamos
          </Text>
        </Pressable>
      </View>

      {/* Seção de benefícios */}
      <View
        style={{
          width: "100%",
          marginBottom: responsive.paddingVertical * 1.75,
        }}
      >
        <Text
          style={{
            fontSize: responsive.subtitleSize,
            fontWeight: "700",
            color: "#0f3d0f",
            marginBottom: responsive.paddingVertical,
            textAlign: "center",
          }}
        >
          Por que escolher a CarioK?
        </Text>

        <BenefitCard
          icon="🍕"
          title="Ingredientes Frescos"
          description="Utilizamos apenas ingredientes de alta qualidade e sempre frescos para garantir o melhor sabor."
          responsive={responsive}
        />

        <BenefitCard
          icon="⚡"
          title="Entrega Rápida"
          description="Preparamos sua pizza com rapidez e entregamos quente, direto em seu endereço."
          responsive={responsive}
        />

        <BenefitCard
          icon="💚"
          title="Feito com Amor"
          description="Cada pizza é preparada com dedicação e carinho para tornar seu dia mais especial."
          responsive={responsive}
        />

        <BenefitCard
          icon="💰"
          title="Preços Acessíveis"
          description="Qualidade premium com preços que cabem no seu bolso. Ótimo custo-benefício!"
          responsive={responsive}
        />
      </View>

      {/* Seção sobre */}
      <View
        style={{
          width: "100%",
          backgroundColor: "#fafafa",
          padding: responsive.paddingVertical,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e8e8e8",
        }}
      >
        <Text
          style={{
            fontSize: responsive.subtitleSize,
            fontWeight: "700",
            color: "#0f3d0f",
            marginBottom: responsive.paddingVertical,
            textAlign: "center",
          }}
        >
          Nossa História
        </Text>

        <Text
          style={{
            fontSize: responsive.textSize,
            color: "#333",
            lineHeight: responsive.isTablet ? 26 : 24,
            textAlign: "justify",
            marginBottom: responsive.paddingVertical,
          }}
        >
          A Pizzaria CarioK foi fundada em 30 de novembro de 2025 com a missão
          de conquistar o coração do nosso público através de pizzas sempre
          quentinhas e irresistíveis.
        </Text>

        <Text
          style={{
            fontSize: responsive.textSize,
            color: "#333",
            lineHeight: responsive.isTablet ? 26 : 24,
            textAlign: "justify",
            marginBottom: responsive.paddingVertical,
          }}
        >
          Aqui, fazemos tudo pensando em você: oferecemos promoções especiais ao
          longo da semana, preços acessíveis e, acima de tudo, pratos preparados
          com carinho e dedicação.
        </Text>

        <Text
          style={{
            fontSize: responsive.textSize,
            color: "#0f3d0f",
            textAlign: "center",
            fontWeight: "600",
            fontStyle: "italic",
          }}
        >
          "Sabor de verdade é feito com amor."
        </Text>
      </View>
    </ScrollView>
  );
}
