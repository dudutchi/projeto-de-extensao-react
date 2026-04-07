import React, { useMemo, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

// --- TIPAGENS ---
interface MenuItemProps {
  name: string;
  description?: string;
  price?: string;
}

type PizzaCategory = "tradicional" | "especial" | "doce";

interface PizzaMenuItemProps extends Omit<MenuItemProps, "price"> {
  category: PizzaCategory;
  responsive: ReturnType<typeof useResponsive>;
}

// --- LÓGICA DE PREÇOS CENTRALIZADA ---
// Única fonte da verdade para os preços por tamanho e categoria
const PIZZA_PRICES: Record<PizzaCategory, { size: string; price: string }[]> = {
  tradicional: [
    { size: "25cm (Broto)", price: "R$ 35,90" },
    { size: "35cm (Média)", price: "R$ 55,90" },
    { size: "45cm (Família)", price: "R$ 68,90" },
  ],
  especial: [
    { size: "25cm (Broto)", price: "R$ 45,90" },
    { size: "35cm (Média)", price: "R$ 65,90" },
    { size: "45cm (Família)", price: "R$ 78,90" },
  ],
  doce: [
    { size: "25cm (Broto)", price: "R$ 39,90" },
    { size: "35cm (Média)", price: "R$ 59,90" },
    { size: "45cm (Família)", price: "R$ 72,90" },
  ],
};

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
    [isTablet],
  );
};

// --- COMPONENTES AUXILIARES ---

// 1. Componente para itens normais com preço fixo (Bebidas, Bordas)
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
    {price && (
      <Text
        style={{
          fontSize: responsive.priceSize,
          fontWeight: "700",
          color: "#1a5c1a",
        }}
      >
        {price}
      </Text>
    )}
  </View>
);

// 2. Novo componente interativo para Pizzas (abre tabela de preços)
const PizzaMenuItem: React.FC<PizzaMenuItemProps> = ({
  name,
  description,
  category,
  responsive,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prices = PIZZA_PRICES[category];

  return (
    <View
      style={{
        marginBottom: responsive.itemMargin,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        paddingBottom: responsive.itemMargin - 2,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
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
        {/* Indicador visual discreto de interação */}
        <Text
          style={{
            fontSize: responsive.priceSize,
            color: "#1a5c1a",
            fontWeight: "600",
          }}
        >
          {isExpanded ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {/* Tabela de Preços Expandida */}
      {isExpanded && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: "#f4f9f4", // Fundo verde super claro para não quebrar o design
            borderRadius: 6,
            padding: 12,
          }}
        >
          {prices.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 4,
                borderBottomWidth: index === prices.length - 1 ? 0 : 1, // Remove borda do último item
                borderBottomColor: "#e0e0e0",
              }}
            >
              <Text
                style={{
                  fontSize: responsive.descriptionSize,
                  color: "#0f3d0f",
                }}
              >
                {item.size}
              </Text>
              <Text
                style={{
                  fontSize: responsive.descriptionSize,
                  fontWeight: "700",
                  color: "#1a5c1a",
                }}
              >
                {item.price}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// --- TELA PRINCIPAL ---
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
          <PizzaMenuItem
            responsive={responsive}
            name="Pizza da Casa"
            description="Mussarela, calabresa, cebola, pimentão e azeitona - Nossa favorita!"
            category="tradicional"
          />
          <PizzaMenuItem
            responsive={responsive}
            name="Especial CarioK"
            description="Mussarela, presunto, frango, milho e banana - Ousada e deliciosa!"
            category="especial"
          />
        </View>

        {/* SEÇÃO "TAMANHOS" FOI REMOVIDA CONFORME REGRA DE IMPLEMENTAÇÃO */}

        {/* Categoria: Bordas (Usa MenuItem normal pois o preço é fixo) */}
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
          <PizzaMenuItem
            responsive={responsive}
            name="Mussarela"
            description="Molho de tomate, mussarela e orégano"
            category="tradicional"
          />
          <PizzaMenuItem
            responsive={responsive}
            name="Calabresa"
            description="Molho de tomate, calabresa, cebola e orégano"
            category="tradicional"
          />
          <PizzaMenuItem
            responsive={responsive}
            name="Portuguesa"
            description="Mussarela, presunto, cebola, ovo e azeitona"
            category="tradicional"
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
          <PizzaMenuItem
            responsive={responsive}
            name="Quatro Queijos"
            description="Mussarela, parmesão, gorgonzola e provolone"
            category="especial"
          />
          <PizzaMenuItem
            responsive={responsive}
            name="Pepperoni"
            description="Molho de tomate, mussarela e pepperoni"
            category="especial"
          />
          <PizzaMenuItem
            responsive={responsive}
            name="Bacon com Ovos"
            description="Molho de tomate, mussarela, bacon e ovos"
            category="especial"
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
          <PizzaMenuItem
            responsive={responsive}
            name="Chocolate com Morango"
            category="doce"
          />
          <PizzaMenuItem
            responsive={responsive}
            name="Banana com Canela"
            category="doce"
          />
          <PizzaMenuItem
            responsive={responsive}
            name="Banana Nevada"
            description="Banana, leite condensado e chocolate branco"
            category="doce"
          />
        </View>

        {/* Categoria: Bebidas (Usa MenuItem normal pois o preço é fixo) */}
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
            description="Coca, Guaraná, Pepsi"
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
