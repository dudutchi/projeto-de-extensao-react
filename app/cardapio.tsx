import React, { useMemo } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

interface MenuItemProps {
  name: string;
  description?: string;
  price: string;
}

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
      sectionTitleSize: isTablet ? 22 : 18,
      itemNameSize: isTablet ? 18 : 16,
      descriptionSize: isTablet ? 14 : 13,
      priceSize: isTablet ? 17 : 15,
      sectionPadding: isTablet ? 24 : 16,
      itemMargin: isTablet ? 18 : 14,
    }),
    [width, isTablet],
  );
};

// Componente auxiliar para os itens da lista
const MenuItem: React.FC<
  MenuItemProps & { responsive: ReturnType<typeof useResponsive> }
> = ({ name, description, price, responsive }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: responsive.itemMargin,
      paddingBottom: responsive.itemMargin - 2,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    }}
  >
    <View style={{ flex: 1, marginRight: 12 }}>
      <Text
        style={{
          fontSize: responsive.itemNameSize,
          fontWeight: "600",
          color: "#0f3d0f",
        }}
      >
        {name}
      </Text>
      {description && (
        <Text
          style={{
            fontSize: responsive.descriptionSize,
            color: "#666",
            fontStyle: "italic",
            marginTop: 4,
          }}
        >
          {description}
        </Text>
      )}
    </View>
    <Text
      style={{
        fontSize: responsive.priceSize,
        fontWeight: "700",
        color: "#1a5c1a",
      }}
    >
      {price}
    </Text>
  </View>
);

export default function Cardapio() {
  const responsive = useResponsive();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: responsive.paddingHorizontal,
          paddingTop: responsive.paddingVertical,
          paddingBottom: 40,
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
          Nosso Cardápio
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
          Pizzas frescas, quentinhas e com ingredientes de alta qualidade
        </Text>

        {/* Destaques da Semana */}
        <View
          style={{
            backgroundColor: "#fff8f0",
            borderLeftWidth: 4,
            borderLeftColor: "#ffc107",
            padding: responsive.sectionPadding,
            borderRadius: 8,
            marginBottom: 28,
          }}
        >
          <Text
            style={{
              fontSize: responsive.sectionTitleSize,
              fontWeight: "700",
              color: "#ffc107",
              marginBottom: responsive.itemMargin,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            ⭐ Destaques da Semana
          </Text>
          <MenuItem
            responsive={responsive}
            name="Pizza da Casa"
            description="Mussarela, calabresa, cebola, pimentão e azeitona - Nossa favorita!"
            price="A partir de R$ 45,90"
          />
          <MenuItem
            responsive={responsive}
            name="Especial CarioK"
            description="Mussarela, presunto, frango, milho e banana - Ousada e deliciosa!"
            price="A partir de R$ 50,90"
          />
        </View>

        {/* Categoria: Tamanhos */}
        <View
          style={{
            marginBottom: 28,
            backgroundColor: "#f9f9f9",
            borderLeftWidth: 4,
            borderLeftColor: "#1a5c1a",
            padding: responsive.sectionPadding,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: responsive.sectionTitleSize,
              fontWeight: "700",
              color: "#0f3d0f",
              marginBottom: responsive.itemMargin,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            📏 Tamanhos
          </Text>
          <MenuItem responsive={responsive} name="25cm" price="R$ 35,90" />
          <MenuItem responsive={responsive} name="35cm" price="R$ 55,90" />
          <MenuItem responsive={responsive} name="45cm" price="R$ 68,90" />
        </View>

        {/* Categoria: Bordas */}
        <View
          style={{
            marginBottom: 28,
            backgroundColor: "#f9f9f9",
            borderLeftWidth: 4,
            borderLeftColor: "#1a5c1a",
            padding: responsive.sectionPadding,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: responsive.sectionTitleSize,
              fontWeight: "700",
              color: "#0f3d0f",
              marginBottom: responsive.itemMargin,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            🧀 Bordas Recheadas
          </Text>
          <MenuItem
            responsive={responsive}
            name="Catupiry ou Cheddar"
            price="R$ 15,00"
          />
          <MenuItem
            responsive={responsive}
            name="Cream Cheese"
            price="R$ 17,00"
          />
          <MenuItem
            responsive={responsive}
            name="Chocolate (Preto/Branco)"
            price="R$ 20,00"
          />
        </View>

        {/* Categoria: Tradicionais */}
        <View
          style={{
            marginBottom: 28,
            backgroundColor: "#f9f9f9",
            borderLeftWidth: 4,
            borderLeftColor: "#1a5c1a",
            padding: responsive.sectionPadding,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: responsive.sectionTitleSize,
              fontWeight: "700",
              color: "#0f3d0f",
              marginBottom: responsive.itemMargin,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            🍕 Pizzas Tradicionais
          </Text>
          <MenuItem
            responsive={responsive}
            name="Mussarela"
            description="Molho de tomate, mussarela e orégano"
            price="A partir de R$ 35,90"
          />
          <MenuItem
            responsive={responsive}
            name="Calabresa"
            description="Molho de tomate, calabresa, cebola e orégano"
            price="A partir de R$ 38,90"
          />
          <MenuItem
            responsive={responsive}
            name="Portuguesa"
            description="Mussarela, presunto, cebola, ovo e azeitona"
            price="A partir de R$ 42,90"
          />
        </View>

        {/* Categoria: Especiais */}
        <View
          style={{
            marginBottom: 28,
            backgroundColor: "#f9f9f9",
            borderLeftWidth: 4,
            borderLeftColor: "#1a5c1a",
            padding: responsive.sectionPadding,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: responsive.sectionTitleSize,
              fontWeight: "700",
              color: "#0f3d0f",
              marginBottom: responsive.itemMargin,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            ✨ Pizzas Especiais
          </Text>
          <MenuItem
            responsive={responsive}
            name="Quatro Queijos"
            description="Mussarela, parmesão, gorgonzola e provolone"
            price="A partir de R$ 45,90"
          />
          <MenuItem
            responsive={responsive}
            name="Pepperoni"
            description="Molho de tomate, mussarela e pepperoni"
            price="A partir de R$ 44,90"
          />
          <MenuItem
            responsive={responsive}
            name="Bacon com Ovos"
            description="Molho de tomate, mussarela, bacon e ovos"
            price="A partir de R$ 43,90"
          />
        </View>

        {/* Categoria: Doces */}
        <View
          style={{
            marginBottom: 28,
            backgroundColor: "#f9f9f9",
            borderLeftWidth: 4,
            borderLeftColor: "#1a5c1a",
            padding: responsive.sectionPadding,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: responsive.sectionTitleSize,
              fontWeight: "700",
              color: "#0f3d0f",
              marginBottom: responsive.itemMargin,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            🍫 Pizzas Doces
          </Text>
          <MenuItem
            responsive={responsive}
            name="Chocolate com Morango"
            price="A partir de R$ 39,90"
          />
          <MenuItem
            responsive={responsive}
            name="Banana com Canela"
            price="A partir de R$ 37,90"
          />
          <MenuItem
            responsive={responsive}
            name="Banana Nevada"
            description="Banana, leite condensado e chocolate branco"
            price="A partir de R$ 39,90"
          />
        </View>

        {/* Categoria: Bebidas */}
        <View
          style={{
            marginBottom: 50,
            backgroundColor: "#f9f9f9",
            borderLeftWidth: 4,
            borderLeftColor: "#1a5c1a",
            padding: responsive.sectionPadding,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: responsive.sectionTitleSize,
              fontWeight: "700",
              color: "#0f3d0f",
              marginBottom: responsive.itemMargin,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            🥤 Bebidas
          </Text>
          <MenuItem
            responsive={responsive}
            name="Refrigerante Lata"
            description="Coca, Guaraná, Pepsi"
            price="R$ 6,00"
          />
          <MenuItem
            responsive={responsive}
            name="Refrigerante 2L"
            price="R$ 12,00"
          />
          <MenuItem
            responsive={responsive}
            name="Suco Natural"
            description="Morango, Maracujá, Laranja"
            price="R$ 8,00"
          />
          <MenuItem
            responsive={responsive}
            name="Água Mineral"
            description="Com ou sem gás"
            price="R$ 4,00"
          />
        </View>

        {/* Dicas para sua Experiência */}
        <View
          style={{
            backgroundColor: "#0f3d0f",
            padding: responsive.sectionPadding,
            borderRadius: 12,
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontSize: responsive.sectionTitleSize,
              fontWeight: "700",
              color: "#fff",
              marginBottom: responsive.itemMargin,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            💡 Dicas para sua Experiência
          </Text>
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: responsive.textSize,
                color: "#12a049",
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              ✓ Personalize sua Pizza
            </Text>
            <Text
              style={{
                fontSize: responsive.textSize,
                color: "#f0f0f0",
                lineHeight: 18,
              }}
            >
              Combine ingredientes! Você pode criar sua própria pizza
              selecionando a massa, molho e até 8 ingredientes diferentes.
            </Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: responsive.textSize,
                color: "#12a049",
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              ✓ Bordas Especiais
            </Text>
            <Text
              style={{
                fontSize: responsive.textSize,
                color: "#f0f0f0",
                lineHeight: 18,
              }}
            >
              Nossas bordas recheadas elevam sua experiência! Teste Catupiry,
              Cream Cheese ou até Chocolate para as sobremesas.
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: responsive.textSize,
                color: "#12a049",
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              ✓ Combo Econômico
            </Text>
            <Text
              style={{
                fontSize: responsive.textSize,
                color: "#f0f0f0",
                lineHeight: 18,
              }}
            >
              Peça nossa pizza grande (45cm) com uma bebida 2L - ótimo
              custo-benefício para famílias!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
