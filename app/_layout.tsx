import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a5c1a",//cor da barra principal
        },
        headerTintColor: "#fff",//cor do texto da barra principal
        drawerStyle: {
          backgroundColor: "#1a5c1a", 
          width: 250, 
        },
        drawerActiveTintColor: "#ffc107",//cor do texto da pagina q ta selecionada na barra do lado
        drawerActiveBackgroundColor: "#0f3d0f",//cor da pagina q ta selecionada na barra do lado
        drawerInactiveTintColor: "#ffff",
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Início" }} />
      <Drawer.Screen name="OndeEstamos" options={{ title: "Onde Estamos" }} />
      <Drawer.Screen name="promocoes" options={{ title: "Promoções" }} />
    </Drawer>
  );
}