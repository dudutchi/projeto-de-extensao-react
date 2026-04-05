import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
  useWindowDimensions,
} from "react-native";

// --- TIPAGENS ---
type PizzaCategory = "tradicional" | "especial" | "doce";
type PedidoTipo = "inteira" | "meia";
type PizzaSize = "25cm" | "35cm" | "45cm";

interface Flavor {
  id: string;
  name: string;
  category: PizzaCategory;
  description?: string;
}

interface ItemPrice {
  name: string;
  price: number;
}

interface Address {
  nome: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
}

interface OrderPayload {
  tipoPedido: "inteira" | "meio a meio";
  tamanho: PizzaSize;
  sabores: string[];
  borda: {
    temBorda: boolean;
    tipo: string | null;
  };
  bebidas: {
    nome: string;
    quantidade: number;
    preco: number;
  }[];
  pagamento: "Cartão" | "Pix" | "Pagar na Entrega";
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
  };
  valorTotal: number;
  dataPedido: string;
}

interface CartState {
  tipo: PedidoTipo | null;
  sabores: Flavor[];
  tamanho: PizzaSize | null;
  borda: ItemPrice | null;
  bebidas: (ItemPrice & { quantity: number })[];
  pagamento: string | null;
  endereco: Address;
}

// --- DADOS E LÓGICA DE PREÇOS ---
const PIZZA_PRICES = {
  tradicional: { "25cm": 35.9, "35cm": 55.9, "45cm": 68.9 },
  especial: { "25cm": 45.9, "35cm": 65.9, "45cm": 78.9 },
  doce: { "25cm": 39.9, "35cm": 59.9, "45cm": 72.9 },
};

const FLAVORS: Flavor[] = [
  {
    id: "t1",
    name: "Mussarela",
    category: "tradicional",
    description: "Molho de tomate, mussarela e orégano",
  },
  {
    id: "t2",
    name: "Calabresa",
    category: "tradicional",
    description: "Molho de tomate, calabresa, cebola e orégano",
  },
  {
    id: "t3",
    name: "Portuguesa",
    category: "tradicional",
    description: "Mussarela, presunto, cebola, ovo e azeitona",
  },
  {
    id: "e1",
    name: "Quatro Queijos",
    category: "especial",
    description: "Mussarela, parmesão, gorgonzola e provolone",
  },
  {
    id: "e2",
    name: "Pepperoni",
    category: "especial",
    description: "Molho de tomate, mussarela e pepperoni",
  },
  {
    id: "e3",
    name: "Bacon com Ovos",
    category: "especial",
    description: "Molho de tomate, mussarela, bacon e ovos",
  },
  { id: "d1", name: "Chocolate com Morango", category: "doce" },
  { id: "d2", name: "Banana com Canela", category: "doce" },
];

const SIZE_OPTIONS: { value: PizzaSize; label: string }[] = [
  { value: "25cm", label: "Broto" },
  { value: "35cm", label: "Média" },
  { value: "45cm", label: "Família" },
];

const CRUSTS: ItemPrice[] = [
  { name: "Sem Borda", price: 0 },
  { name: "Catupiry ou Cheddar", price: 15.0 },
  { name: "Cream Cheese", price: 17.0 },
  { name: "Chocolate", price: 20.0 },
];

const DRINKS: ItemPrice[] = [
  { name: "Refrigerante Lata", price: 6.0 },
  { name: "Refrigerante 2L", price: 12.0 },
  { name: "Suco Natural", price: 8.0 },
  { name: "Água Mineral", price: 4.0 },
];

const PAYMENT_METHODS = ["Cartão de Crédito/Débito", "PIX", "Pagar na Entrega"];
const ORDER_STORAGE_KEY = "cariok:pedidos";

const INITIAL_ADDRESS: Address = {
  nome: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
};

const INITIAL_CART: CartState = {
  tipo: null,
  sabores: [],
  tamanho: null,
  borda: null,
  bebidas: [],
  pagamento: null,
  endereco: INITIAL_ADDRESS,
};

// --- HOOK DE RESPONSIVIDADE ---
const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return useMemo(
    () => ({
      isTablet,
      paddingHorizontal: isTablet ? 48 : 24,
      paddingVertical: isTablet ? 24 : 16,
      titleSize: isTablet ? 32 : 24,
      textSize: isTablet ? 16 : 14,
      sectionTitleSize: isTablet ? 20 : 16,
      itemNameSize: isTablet ? 18 : 16,
      descriptionSize: isTablet ? 14 : 13,
      priceSize: isTablet ? 17 : 15,
      itemMargin: isTablet ? 16 : 12,
    }),
    [isTablet],
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function PedidoWizard() {
  const router = useRouter();
  const responsive = useResponsive();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartState>(INITIAL_CART);
  const [expandedFlavorId, setExpandedFlavorId] = useState<string | null>(null);
  const [activeHalfFlavorIndex, setActiveHalfFlavorIndex] = useState<0 | 1>(0);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // --- FUNÇÕES DE CÁLCULO E FORMATAÇÃO ---
  const formatMoney = (value: number) =>
    `R$ ${value.toFixed(2).replace(".", ",")}`;

  const getPizzaPrice = () => {
    if (!cart.tamanho || cart.sabores.length === 0) return 0;
    if (cart.tipo === "inteira") {
      return PIZZA_PRICES[cart.sabores[0].category][cart.tamanho];
    }
    if (cart.tipo === "meia" && cart.sabores.length === 2) {
      const price1 = PIZZA_PRICES[cart.sabores[0].category][cart.tamanho];
      const price2 = PIZZA_PRICES[cart.sabores[1].category][cart.tamanho];
      return Math.max(price1, price2); // Regra: Cobra o valor da mais cara
    }
    return 0;
  };

  const getTotal = () => {
    const pizzaTotal = getPizzaPrice();
    const bordaTotal = cart.borda ? cart.borda.price : 0;
    const bebidasTotal = cart.bebidas.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    return pizzaTotal + bordaTotal + bebidasTotal;
  };

  const getPronome = (field: keyof Address) => {
    const feminino = ["rua", "cidade"];
    return feminino.includes(field) ? "sua" : "seu";
  };

  const getAddressLabel = (field: keyof Address) => {
    return field;
  };

  const getSizeLabel = (size: PizzaSize) => {
    return (
      SIZE_OPTIONS.find((sizeOption) => sizeOption.value === size)?.label ??
      size
    );
  };

  const normalizePaymentMethod = (
    paymentMethod: string,
  ): OrderPayload["pagamento"] => {
    if (paymentMethod === "Cartão de Crédito/Débito") return "Cartão";
    if (paymentMethod === "PIX") return "Pix";
    return "Pagar na Entrega";
  };

  const animateFlavorAccordion = () => {
    if (Platform.OS !== "web") {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  };

  const getRequiredFlavorCount = () => {
    if (!cart.tipo) return 0;
    return cart.tipo === "inteira" ? 1 : 2;
  };

  const getRequiredAddressFields = (): (keyof Address)[] => [
    "nome",
    "rua",
    "numero",
    "bairro",
    "cidade",
  ];

  const getMissingOrderFields = () => {
    const missingFields: string[] = [];

    if (!cart.tipo) missingFields.push("tipo do pedido");
    if (!cart.tamanho) missingFields.push("tamanho da pizza");
    if (cart.sabores.length !== getRequiredFlavorCount()) {
      missingFields.push(
        cart.tipo === "meia" ? "os 2 sabores da pizza" : "o sabor da pizza",
      );
    }
    if (!cart.pagamento) missingFields.push("forma de pagamento");

    const addressLabels: Record<keyof Address, string> = {
      nome: "nome",
      rua: "rua",
      numero: "número",
      bairro: "bairro",
      cidade: "cidade",
    };

    getRequiredAddressFields().forEach((field) => {
      if (!cart.endereco[field].trim()) {
        missingFields.push(addressLabels[field]);
      }
    });

    return missingFields;
  };

  // Monta o JSON do pedido com a estrutura pronta para futura integração.
  const buildOrderPayload = (): OrderPayload | null => {
    if (!cart.tipo || !cart.tamanho || !cart.pagamento) {
      return null;
    }

    const hasCrust = Boolean(cart.borda && cart.borda.name !== "Sem Borda");

    return {
      tipoPedido: cart.tipo === "inteira" ? "inteira" : "meio a meio",
      tamanho: cart.tamanho,
      sabores: cart.sabores.map((flavor) => flavor.name),
      borda: {
        temBorda: hasCrust,
        tipo: hasCrust ? (cart.borda?.name ?? null) : null,
      },
      bebidas: cart.bebidas.map((drink) => ({
        nome: drink.name,
        quantidade: drink.quantity,
        preco: Number(drink.price.toFixed(2)),
      })),
      pagamento: normalizePaymentMethod(cart.pagamento),
      endereco: {
        rua: cart.endereco.rua.trim(),
        numero: cart.endereco.numero.trim(),
        bairro: cart.endereco.bairro.trim(),
        cidade: cart.endereco.cidade.trim(),
      },
      valorTotal: Number(getTotal().toFixed(2)),
      dataPedido: new Date().toISOString(),
    };
  };

  // Persiste o histórico dos pedidos em JSON no storage adequado da plataforma.
  const saveOrderToStorage = async (order: OrderPayload) => {
    if (Platform.OS === "web") {
      const existingOrders =
        globalThis.localStorage?.getItem(ORDER_STORAGE_KEY);
      const parsedOrders = existingOrders
        ? (JSON.parse(existingOrders) as OrderPayload[])
        : [];

      globalThis.localStorage?.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify([order, ...parsedOrders]),
      );
      return;
    }

    const existingOrders = await AsyncStorage.getItem(ORDER_STORAGE_KEY);
    const parsedOrders = existingOrders
      ? (JSON.parse(existingOrders) as OrderPayload[])
      : [];

    await AsyncStorage.setItem(
      ORDER_STORAGE_KEY,
      JSON.stringify([order, ...parsedOrders]),
    );
  };

  // Função complementar: Exporta o pedido para arquivo JSON local
  const exportarPedidoParaArquivo = async (order: OrderPayload) => {
    try {
      // Funcionalidade complementar: envia os dados para o dev-server,
      // que persiste no arquivo fixo pedidos.json na raiz do projeto.
      await sincronizarComDevAPI(order);
    } catch (error) {
      console.error("❌ Erro ao exportar pedido:", error);
    }
  };

  // Função complementar: Envia o pedido para uma API de desenvolvimento
  const sincronizarComDevAPI = async (order: OrderPayload) => {
    try {
      // Tenta enviar para um backend local (localhost:3000)
      // Esta é uma funcionalidade OPCIONAL para sincronizar com seu PC
      const devServerUrl = "http://localhost:3000/api/pedidos";

      const response = await fetch(devServerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        console.log("✅ Pedido sincronizado com servidor de desenvolvimento");
      }
    } catch (error) {
      // Silenciosamente falha se o servidor não estiver disponível
      console.log(
        "ℹ️  Dev API indisponível (esperado se o servidor local não está rodando)",
      );
    }
  };

  const getFlavorBasePrice = (flavor: Flavor, size: PizzaSize) => {
    return PIZZA_PRICES[flavor.category][size];
  };

  const getHalfFlavorPrompt = () => {
    if (!cart.tamanho) {
      return "Primeiro escolha o tamanho para liberar os sabores.";
    }

    if (!cart.sabores[0]) {
      return "Agora escolha o 1º sabor.";
    }

    if (!cart.sabores[1]) {
      return "Agora escolha o 2º sabor.";
    }

    return "Toque no 1º ou 2º sabor acima para trocar sua combinação.";
  };

  const handleSingleFlavorPress = (flavor: Flavor) => {
    if (cart.tipo !== "inteira") return;

    animateFlavorAccordion();

    setCart({ ...cart, sabores: [flavor] });
    setExpandedFlavorId(flavor.id);
  };

  const handleHalfFlavorSlotPress = (slotIndex: 0 | 1) => {
    if (!cart.tamanho) return;
    setActiveHalfFlavorIndex(slotIndex);
  };

  const handleHalfFlavorPress = (flavor: Flavor) => {
    if (cart.tipo !== "meia" || !cart.tamanho) return;

    const otherFlavorIndex = activeHalfFlavorIndex === 0 ? 1 : 0;
    const otherFlavor = cart.sabores[otherFlavorIndex];

    if (otherFlavor?.id === flavor.id) {
      return;
    }

    const nextSabores: (Flavor | undefined)[] = [
      cart.sabores[0],
      cart.sabores[1],
    ];
    nextSabores[activeHalfFlavorIndex] = flavor;

    const updatedSabores = nextSabores.filter(
      (selectedFlavor): selectedFlavor is Flavor => Boolean(selectedFlavor),
    );

    setCart({ ...cart, sabores: updatedSabores });
    setExpandedFlavorId(null);

    if (activeHalfFlavorIndex === 0 && !nextSabores[1]) {
      setActiveHalfFlavorIndex(1);
    }
  };

  const handleSizeSelect = (size: PizzaSize) => {
    setCart({ ...cart, tamanho: size });
  };

  const renderFlavorSizes = (flavor: Flavor) => (
    <View style={styles.sizeAccordion}>
      <Text style={[styles.sizeHint, { fontSize: responsive.descriptionSize }]}>
        Escolha o tamanho dessa pizza para continuar.
      </Text>

      {SIZE_OPTIONS.map((sizeOption) => {
        const isSelected = cart.tamanho === sizeOption.value;
        const price = getFlavorBasePrice(flavor, sizeOption.value);

        return (
          <TouchableOpacity
            key={sizeOption.value}
            style={[styles.sizeOption, isSelected && styles.sizeOptionSelected]}
            onPress={() => handleSizeSelect(sizeOption.value)}
          >
            <View>
              <Text
                style={[
                  styles.sizeOptionTitle,
                  isSelected && styles.sizeOptionTitleSelected,
                ]}
              >
                {sizeOption.value} ({sizeOption.label})
              </Text>
              <Text
                style={[
                  styles.sizeOptionPrice,
                  isSelected && styles.sizeOptionPriceSelected,
                ]}
              >
                {formatMoney(price)}
              </Text>
            </View>

            {isSelected && <Text style={styles.sizeOptionCheck}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // --- NAVEGAÇÃO DO WIZARD ---
  const handleNext = () => setStep((prev) => Math.min(prev + 1, 6));

  const resetOrderState = () => {
    setExpandedFlavorId(null);
    setActiveHalfFlavorIndex(0);
    setCart(INITIAL_CART);
    setStep(1);
  };

  const resetOrderAndGoHome = () => {
    setIsCancelModalVisible(false);
    resetOrderState();
    router.navigate("/");
  };

  const closeCancelModal = () => setIsCancelModalVisible(false);

  const closeSuccessModal = () => {
    setIsSuccessModalVisible(false);
    resetOrderState();
    router.navigate("/");
  };

  const handleBack = () => {
    // Regra: Ao voltar, limpar os dados da etapa atual
    if (step === 2) setCart({ ...cart, borda: null });
    if (step === 3) setCart({ ...cart, bebidas: [] });
    if (step === 4) setCart({ ...cart, pagamento: null });
    if (step === 5) setCart({ ...cart, endereco: INITIAL_ADDRESS });

    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCancel = () => setIsCancelModalVisible(true);

  const handleFinishOrder = async () => {
    const missingFields = getMissingOrderFields();

    if (missingFields.length > 0) {
      Alert.alert(
        "Pedido incompleto",
        `Preencha os seguintes campos antes de finalizar: ${missingFields.join(", ")}.`,
      );
      return;
    }

    const orderPayload = buildOrderPayload();

    if (!orderPayload) {
      Alert.alert(
        "Erro ao finalizar",
        "Não foi possível montar o pedido. Revise os dados e tente novamente.",
      );
      return;
    }

    try {
      setIsSubmittingOrder(true);
      await saveOrderToStorage(orderPayload);
      // Função complementar: exporta para arquivo JSON
      await exportarPedidoParaArquivo(orderPayload);
      setIsSuccessModalVisible(true);
    } catch {
      Alert.alert(
        "Erro ao salvar pedido",
        "Não foi possível salvar seu pedido agora. Tente novamente em instantes.",
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // --- VALIDAÇÕES DE ETAPA ---
  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          cart.tipo &&
          cart.tamanho &&
          cart.sabores.length === (cart.tipo === "inteira" ? 1 : 2)
        );
      case 2:
        return cart.borda !== null;
      case 3:
        return true; // Bebidas são opcionais
      case 4:
        return cart.pagamento !== null;
      case 5:
        return getRequiredAddressFields().every(
          (field) => cart.endereco[field].trim() !== "",
        );
      default:
        return true;
    }
  };

  // --- RENDERIZADORES DE ETAPAS ---

  const renderSingleFlavorSelection = () => (
    <View>
      <Text style={[styles.sectionSubtitle, { fontSize: responsive.textSize }]}>
        Selecione 1 sabor:
      </Text>
      <Text style={[styles.sizeInstruction, { fontSize: responsive.textSize }]}>
        Toque em um sabor para abrir os tamanhos e ver os preços.
      </Text>
      {FLAVORS.map((flavor) => {
        const isSelected = cart.sabores.some(
          (selectedFlavor) => selectedFlavor.id === flavor.id,
        );
        const isExpanded = expandedFlavorId === flavor.id;

        return (
          <View key={flavor.id}>
            <TouchableOpacity
              style={[
                styles.listItem,
                isSelected && styles.listItemSelected,
                isExpanded && styles.listItemExpanded,
                { marginBottom: isExpanded ? 0 : 10 },
              ]}
              onPress={() => handleSingleFlavorPress(flavor)}
            >
              <View>
                <Text
                  style={[
                    styles.itemName,
                    { fontSize: responsive.itemNameSize },
                    isSelected && { color: "#fff" },
                  ]}
                >
                  {flavor.name}
                </Text>
                <Text
                  style={[
                    styles.itemDesc,
                    { fontSize: responsive.descriptionSize },
                    isSelected && { color: "#e0f2e0" },
                  ]}
                >
                  {flavor.category.toUpperCase()}
                </Text>
              </View>

              <View style={styles.flavorActionArea}>
                {isSelected && cart.tamanho && (
                  <Text style={styles.selectedSizeChip}>
                    {cart.tamanho} • {getSizeLabel(cart.tamanho)}
                  </Text>
                )}
                <Text
                  style={[
                    styles.flavorActionText,
                    isSelected && styles.flavorActionTextSelected,
                  ]}
                >
                  {isExpanded ? "Ocultar" : "Ver tamanhos"}
                </Text>
              </View>
            </TouchableOpacity>

            {isExpanded && renderFlavorSizes(flavor)}
          </View>
        );
      })}
    </View>
  );

  const renderHalfAndHalfSizeSelection = () => (
    <View style={styles.halfFlowBlock}>
      <Text style={[styles.sectionSubtitle, { fontSize: responsive.textSize }]}>
        1. Escolha o tamanho
      </Text>
      <Text style={[styles.sizeInstruction, { fontSize: responsive.textSize }]}>
        No meio a meio, o valor final será calculado pelo sabor mais caro.
      </Text>

      <View style={styles.halfSizeGrid}>
        {SIZE_OPTIONS.map((sizeOption) => {
          const isSelected = cart.tamanho === sizeOption.value;

          return (
            <TouchableOpacity
              key={sizeOption.value}
              style={[
                styles.card,
                styles.halfSizeCard,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => handleSizeSelect(sizeOption.value)}
            >
              <Text
                style={[
                  styles.halfSizeTitle,
                  isSelected && styles.cardTextSelected,
                ]}
              >
                {sizeOption.value}
              </Text>
              <Text
                style={[
                  styles.halfSizeLabel,
                  isSelected && styles.halfSizeLabelSelected,
                ]}
              >
                {sizeOption.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderHalfAndHalfFlavorSelection = () => (
    <View>
      <Text style={[styles.sectionSubtitle, { fontSize: responsive.textSize }]}>
        2. Escolha os sabores
      </Text>
      <Text style={[styles.sizeInstruction, { fontSize: responsive.textSize }]}>
        {getHalfFlavorPrompt()}
      </Text>

      <View style={styles.halfSelectionPanel}>
        <View style={styles.halfSelectionSummary}>
          <Text style={styles.halfSelectionLabel}>Tamanho selecionado</Text>
          <Text style={styles.halfSelectionValue}>
            {cart.tamanho
              ? `${cart.tamanho} (${getSizeLabel(cart.tamanho)})`
              : "Escolha o tamanho para continuar"}
          </Text>
        </View>

        <View style={styles.halfFlavorSlots}>
          {([0, 1] as const).map((slotIndex) => {
            const selectedFlavor = cart.sabores[slotIndex];
            const isActive =
              cart.tamanho !== null && activeHalfFlavorIndex === slotIndex;

            return (
              <TouchableOpacity
                key={slotIndex}
                disabled={!cart.tamanho}
                style={[
                  styles.halfFlavorSlot,
                  isActive && styles.halfFlavorSlotActive,
                  !cart.tamanho && styles.halfFlavorSlotDisabled,
                ]}
                onPress={() => handleHalfFlavorSlotPress(slotIndex)}
              >
                <Text
                  style={[
                    styles.halfFlavorSlotLabel,
                    isActive && styles.halfFlavorSlotLabelActive,
                  ]}
                >
                  {slotIndex + 1}º sabor
                </Text>
                <Text
                  style={[
                    styles.halfFlavorSlotValue,
                    isActive && styles.halfFlavorSlotValueActive,
                    !selectedFlavor && styles.halfFlavorSlotPlaceholder,
                  ]}
                >
                  {selectedFlavor?.name ?? "Toque em um sabor abaixo"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {FLAVORS.map((flavor) => {
        const selectedFlavorIndex = cart.sabores.findIndex(
          (selectedFlavor) => selectedFlavor.id === flavor.id,
        );
        const isSelected = selectedFlavorIndex !== -1;
        const isDisabled =
          !cart.tamanho ||
          (isSelected && selectedFlavorIndex !== activeHalfFlavorIndex);

        return (
          <TouchableOpacity
            key={flavor.id}
            disabled={isDisabled}
            style={[
              styles.listItem,
              isSelected && styles.listItemSelected,
              isDisabled && !isSelected && styles.listItemDisabled,
            ]}
            onPress={() => handleHalfFlavorPress(flavor)}
          >
            <View>
              <Text
                style={[
                  styles.itemName,
                  { fontSize: responsive.itemNameSize },
                  isSelected && { color: "#fff" },
                  isDisabled && !isSelected && styles.itemNameDisabled,
                ]}
              >
                {flavor.name}
              </Text>
              <Text
                style={[
                  styles.itemDesc,
                  { fontSize: responsive.descriptionSize },
                  isSelected && { color: "#e0f2e0" },
                  isDisabled && !isSelected && styles.itemDescDisabled,
                ]}
              >
                {flavor.category.toUpperCase()}
              </Text>
            </View>

            <View style={styles.flavorActionArea}>
              {isSelected && (
                <Text style={styles.selectedFlavorChip}>
                  {selectedFlavorIndex + 1}º sabor
                </Text>
              )}
              <Text
                style={[
                  styles.flavorActionText,
                  isSelected && styles.flavorActionTextSelected,
                  isDisabled && !isSelected && styles.flavorActionTextDisabled,
                ]}
              >
                {!cart.tamanho
                  ? "Escolha o tamanho"
                  : isSelected
                    ? "Selecionado"
                    : `Selecionar ${activeHalfFlavorIndex + 1}º sabor`}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text
        style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}
      >
        1. Escolha sua Pizza
      </Text>

      {/* Tipo de Pizza */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        {(["inteira", "meia"] as PedidoTipo[]).map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.card,
              cart.tipo === tipo && styles.cardSelected,
              { flex: 1, alignItems: "center" },
            ]}
            onPress={() => {
              animateFlavorAccordion();
              setExpandedFlavorId(null);
              setActiveHalfFlavorIndex(0);
              setCart({ ...cart, tipo, sabores: [], tamanho: null });
            }}
          >
            <Text
              style={[
                styles.cardText,
                cart.tipo === tipo && styles.cardTextSelected,
              ]}
            >
              {tipo === "inteira"
                ? "Inteira (1 Sabor)"
                : "Meio a Meio (2 Sabores)"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pizza inteira mantém o tamanho dentro do sabor selecionado. */}
      {cart.tipo === "inteira" && renderSingleFlavorSelection()}

      {/* Meio a meio inverte o fluxo: primeiro o tamanho, depois os 2 sabores. */}
      {cart.tipo === "meia" && renderHalfAndHalfSizeSelection()}
      {cart.tipo === "meia" && renderHalfAndHalfFlavorSelection()}

      {cart.tamanho && cart.sabores.length === getRequiredFlavorCount() && (
        <Text
          style={[styles.selectionSummary, { fontSize: responsive.textSize }]}
        >
          {cart.tipo === "inteira"
            ? `Tamanho selecionado: ${cart.tamanho}. Agora você já pode avançar.`
            : `Pizza meio a meio pronta: ${cart.tamanho} (${getSizeLabel(cart.tamanho)}) com ${cart.sabores[0].name} e ${cart.sabores[1].name}.`}
        </Text>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text
        style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}
      >
        2. Bordas Recheadas
      </Text>
      {CRUSTS.map((crust) => (
        <TouchableOpacity
          key={crust.name}
          style={[
            styles.listItem,
            cart.borda?.name === crust.name && styles.listItemSelected,
          ]}
          onPress={() => setCart({ ...cart, borda: crust })}
        >
          <Text
            style={[
              styles.itemName,
              { fontSize: responsive.itemNameSize },
              cart.borda?.name === crust.name && { color: "#fff" },
            ]}
          >
            {crust.name}
          </Text>
          <Text
            style={[
              styles.priceText,
              cart.borda?.name === crust.name && { color: "#fff" },
            ]}
          >
            {crust.price > 0 ? `+ ${formatMoney(crust.price)}` : "Grátis"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text
        style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}
      >
        3. Bebidas (Opcional)
      </Text>
      {DRINKS.map((drink) => {
        const cartDrink = cart.bebidas.find((b) => b.name === drink.name);
        const qty = cartDrink ? cartDrink.quantity : 0;

        return (
          <View
            key={drink.name}
            style={[
              styles.listItem,
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
          >
            <View>
              <Text
                style={[styles.itemName, { fontSize: responsive.itemNameSize }]}
              >
                {drink.name}
              </Text>
              <Text style={styles.priceText}>{formatMoney(drink.price)}</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <TouchableOpacity
                style={styles.btnQty}
                onPress={() => {
                  if (qty > 0) {
                    const updated = cart.bebidas
                      .map((b) =>
                        b.name === drink.name
                          ? { ...b, quantity: b.quantity - 1 }
                          : b,
                      )
                      .filter((b) => b.quantity > 0);
                    setCart({ ...cart, bebidas: updated });
                  }
                }}
              >
                <Text style={styles.btnQtyText}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{qty}</Text>
              <TouchableOpacity
                style={styles.btnQty}
                onPress={() => {
                  if (qty === 0) {
                    setCart({
                      ...cart,
                      bebidas: [...cart.bebidas, { ...drink, quantity: 1 }],
                    });
                  } else {
                    const updated = cart.bebidas.map((b) =>
                      b.name === drink.name
                        ? { ...b, quantity: b.quantity + 1 }
                        : b,
                    );
                    setCart({ ...cart, bebidas: updated });
                  }
                }}
              >
                <Text style={styles.btnQtyText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text
        style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}
      >
        4. Forma de Pagamento
      </Text>
      {PAYMENT_METHODS.map((method) => (
        <TouchableOpacity
          key={method}
          style={[
            styles.listItem,
            cart.pagamento === method && styles.listItemSelected,
          ]}
          onPress={() => setCart({ ...cart, pagamento: method })}
        >
          <Text
            style={[
              styles.itemName,
              { fontSize: responsive.itemNameSize },
              cart.pagamento === method && { color: "#fff" },
            ]}
          >
            {method}
          </Text>
          {cart.pagamento === method && (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep5 = () => (
    <View>
      <Text
        style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}
      >
        5. Endereço de Entrega
      </Text>

      {(Object.keys(INITIAL_ADDRESS) as (keyof Address)[]).map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={`Digite ${getPronome(field)} ${getAddressLabel(field)}`}
          value={cart.endereco[field]}
          keyboardType={field === "numero" ? "number-pad" : "default"}
          onChangeText={(text: string) =>
            setCart({
              ...cart,
              endereco: { ...cart.endereco, [field]: text },
            })
          }
        />
      ))}
    </View>
  );

  const renderStep6 = () => (
    <View>
      <Text
        style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}
      >
        6. Resumo do Pedido
      </Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>
          Pizza ({cart.tamanho}) -{" "}
          {cart.tipo === "inteira" ? "Inteira" : "Meio a Meio"}
        </Text>
        {cart.sabores.map((s, i) => (
          <Text key={i} style={styles.summaryItem}>
            • {s.name} ({s.category})
          </Text>
        ))}
        <Text style={styles.summaryPrice}>{formatMoney(getPizzaPrice())}</Text>

        <View style={styles.divider} />

        <Text style={styles.summaryTitle}>Borda</Text>
        <Text style={styles.summaryItem}>• {cart.borda?.name}</Text>
        <Text style={styles.summaryPrice}>
          {formatMoney(cart.borda?.price || 0)}
        </Text>

        {cart.bebidas.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.summaryTitle}>Bebidas</Text>
            {cart.bebidas.map((b, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.summaryItem}>
                  • {b.quantity}x {b.name}
                </Text>
                <Text style={styles.summaryPrice}>
                  {formatMoney(b.price * b.quantity)}
                </Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.divider} />

        <Text style={styles.summaryTitle}>Pagamento & Entrega</Text>
        <Text style={styles.summaryItem}>Forma: {cart.pagamento}</Text>
        <Text style={styles.summaryItem}>
          {cart.endereco.rua}, {cart.endereco.numero} - {cart.endereco.bairro}
        </Text>
        <Text style={styles.summaryItem}>{cart.endereco.cidade}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Modal
        animationType="fade"
        transparent
        visible={isCancelModalVisible}
        onRequestClose={closeCancelModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cancelar pedido?</Text>
            <Text style={styles.modalDescription}>
              Se você confirmar, o pedido atual será apagado e você voltará para
              a tela inicial.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={closeCancelModal}
              >
                <Text style={styles.modalSecondaryButtonText}>
                  Continuar pedido
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDangerButton}
                onPress={resetOrderAndGoHome}
              >
                <Text style={styles.modalDangerButtonText}>Sim, cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isSuccessModalVisible}
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.successTitle}>Pedido confirmado</Text>
            <Text style={styles.modalDescription}>
              ✅ Seu pedido está sendo preparado!{"\n"}
              Em breve iremos notificar você quando sair para entrega.
            </Text>

            <TouchableOpacity
              style={styles.modalSuccessButton}
              onPress={closeSuccessModal}
            >
              <Text style={styles.modalSuccessButtonText}>
                Voltar para o início
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header Fixo */}
      <View
        style={{
          padding: 20,
          backgroundColor: "#0f3d0f",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
          Etapa {step} de 6
        </Text>
        <View style={{ flexDirection: "row", marginTop: 10, gap: 5 }}>
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <View
              key={s}
              style={{
                height: 4,
                width: 30,
                backgroundColor: s <= step ? "#ffc107" : "#1a5c1a",
                borderRadius: 2,
              }}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, padding: responsive.paddingHorizontal }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingBottom: 100, paddingTop: 20 }}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
        </View>
      </ScrollView>

      {/* Sacola / Bottom Bar Fixa */}
      <View style={styles.bottomBar}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <Text style={{ fontSize: 16, color: "#fff" }}>Total da Sacola:</Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#ffc107" }}>
            {formatMoney(getTotal())}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {step > 1 && (
            <TouchableOpacity style={styles.btnSecondary} onPress={handleBack}>
              <Text style={styles.btnSecondaryText}>Voltar</Text>
            </TouchableOpacity>
          )}

          {step < 6 ? (
            <TouchableOpacity
              style={[styles.btnPrimary, !isStepValid() && { opacity: 0.5 }]}
              onPress={handleNext}
              disabled={!isStepValid()}
            >
              <Text style={styles.btnPrimaryText}>Avançar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.btnSuccess,
                isSubmittingOrder && styles.buttonDisabled,
              ]}
              onPress={handleFinishOrder}
              disabled={isSubmittingOrder}
            >
              <Text style={styles.btnSuccessText}>
                {isSubmittingOrder ? "Finalizando..." : "Finalizar Pedido"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={{ marginTop: 15, alignItems: "center" }}
          onPress={handleCancel}
        >
          <Text style={{ color: "#ff6b6b", fontWeight: "600" }}>
            Cancelar Pedido
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS REUTILIZÁVEIS MANTENDO O PADRÃO ---
const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "700",
    color: "#0f3d0f",
    marginBottom: 20,
    textTransform: "uppercase",
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
    paddingLeft: 10,
  },
  sectionSubtitle: {
    color: "#1a5c1a",
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardSelected: {
    backgroundColor: "#1a5c1a",
    borderColor: "#0f3d0f",
  },
  cardText: {
    color: "#0f3d0f",
    fontWeight: "600",
  },
  cardTextSelected: {
    color: "#fff",
  },
  listItem: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#1a5c1a",
  },
  listItemSelected: {
    backgroundColor: "#1a5c1a",
    borderLeftColor: "#ffc107",
  },
  listItemDisabled: {
    opacity: 0.55,
  },
  listItemExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  itemName: {
    fontWeight: "600",
    color: "#0f3d0f",
  },
  itemDesc: {
    color: "#666",
    marginTop: 4,
  },
  priceText: {
    fontWeight: "700",
    color: "#1a5c1a",
  },
  halfFlowBlock: {
    marginBottom: 20,
  },
  halfSizeGrid: {
    flexDirection: "row",
    gap: 10,
  },
  halfSizeCard: {
    flex: 1,
    alignItems: "center",
  },
  halfSizeTitle: {
    color: "#0f3d0f",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  halfSizeLabel: {
    color: "#1a5c1a",
    fontSize: 13,
    fontWeight: "600",
  },
  halfSizeLabelSelected: {
    color: "#e0f2e0",
  },
  sizeInstruction: {
    color: "#666",
    marginBottom: 12,
  },
  halfSelectionPanel: {
    backgroundColor: "#f4f8f4",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#d8e4d8",
  },
  halfSelectionSummary: {
    marginBottom: 12,
  },
  halfSelectionLabel: {
    color: "#1a5c1a",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  halfSelectionValue: {
    color: "#0f3d0f",
    fontSize: 16,
    fontWeight: "600",
  },
  halfFlavorSlots: {
    gap: 10,
  },
  halfFlavorSlot: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8e4d8",
    padding: 12,
  },
  halfFlavorSlotActive: {
    backgroundColor: "#1a5c1a",
    borderColor: "#0f3d0f",
  },
  halfFlavorSlotDisabled: {
    opacity: 0.65,
  },
  halfFlavorSlotLabel: {
    color: "#1a5c1a",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  halfFlavorSlotLabelActive: {
    color: "#ffc107",
  },
  halfFlavorSlotValue: {
    color: "#0f3d0f",
    fontSize: 15,
    fontWeight: "600",
  },
  halfFlavorSlotValueActive: {
    color: "#fff",
  },
  halfFlavorSlotPlaceholder: {
    color: "#6d6d6d",
  },
  flavorActionArea: {
    alignItems: "flex-end",
    gap: 8,
  },
  flavorActionText: {
    color: "#1a5c1a",
    fontWeight: "600",
  },
  flavorActionTextSelected: {
    color: "#fff",
  },
  flavorActionTextDisabled: {
    color: "#7b7b7b",
  },
  itemNameDisabled: {
    color: "#5f5f5f",
  },
  itemDescDisabled: {
    color: "#7b7b7b",
  },
  selectedSizeChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  selectedFlavorChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  sizeAccordion: {
    backgroundColor: "#f4f8f4",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#d8e4d8",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  sizeHint: {
    color: "#4d4d4d",
    marginBottom: 12,
  },
  sizeOption: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d8e4d8",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sizeOptionSelected: {
    backgroundColor: "#1a5c1a",
    borderColor: "#0f3d0f",
  },
  sizeOptionTitle: {
    color: "#0f3d0f",
    fontWeight: "700",
    marginBottom: 4,
  },
  sizeOptionTitleSelected: {
    color: "#fff",
  },
  sizeOptionPrice: {
    color: "#1a5c1a",
    fontWeight: "600",
  },
  sizeOptionPriceSelected: {
    color: "#e7f7e7",
  },
  sizeOptionCheck: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  selectionSummary: {
    color: "#1a5c1a",
    fontWeight: "600",
    marginTop: 6,
  },
  btnQty: {
    backgroundColor: "#e0e0e0",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnQtyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f3d0f",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: "#0f3d0f",
  },
  summaryBox: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#1a5c1a",
  },
  summaryTitle: {
    fontWeight: "bold",
    color: "#0f3d0f",
    fontSize: 16,
    marginBottom: 5,
  },
  summaryItem: {
    color: "#666",
    marginBottom: 2,
  },
  summaryPrice: {
    fontWeight: "bold",
    color: "#1a5c1a",
    textAlign: "right",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  bottomBar: {
    backgroundColor: "#0f3d0f",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  btnPrimary: {
    backgroundColor: "#ffc107",
    padding: 15,
    borderRadius: 8,
    flex: 2,
    alignItems: "center",
  },
  btnSuccess: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    flex: 2,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  btnSecondary: {
    backgroundColor: "#1a5c1a",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#0f3d0f",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnSuccessText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnSecondaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 61, 15, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f3d0f",
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f3d0f",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4d4d4d",
    marginBottom: 20,
  },
  modalActions: {
    gap: 12,
  },
  modalSecondaryButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d8d8d8",
  },
  modalSecondaryButtonText: {
    color: "#0f3d0f",
    fontSize: 15,
    fontWeight: "600",
  },
  modalDangerButton: {
    backgroundColor: "#c62828",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  modalDangerButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  modalSuccessButton: {
    backgroundColor: "#1a5c1a",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  modalSuccessButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
