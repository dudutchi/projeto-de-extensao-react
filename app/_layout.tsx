import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a5c1a", // Cor da barra principal
        },
        headerTintColor: "#fff", // Cor do texto da barra principal
        drawerStyle: {
          backgroundColor: "#1a5c1a",
          width: 250,
        },
        drawerActiveTintColor: "#ffc107", // Cor do texto da página selecionada
        drawerActiveBackgroundColor: "#0f3d0f", // Cor de fundo da página selecionada
        drawerInactiveTintColor: "#ffffff",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Início",
        }}
      />

      <Drawer.Screen
        name="cardapio"
        options={{
          title: "Cardápio",
        }}
      />

      <Drawer.Screen
        name="fazer-pedido"
        options={{
          title: "Fazer Pedido",
        }}
      />

      <Drawer.Screen
        name="OndeEstamos"
        options={{
          title: "Onde Estamos",
        }}
      />

      <Drawer.Screen
        name="promocoes"
        options={{
          title: "Promoções",
        }}
      />
    </Drawer>
  );
}