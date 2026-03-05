import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Início" }}
      />
      <Stack.Screen
      name="OndeEstamos"
      options={{ title: "Onde Estamos" }}
      />
      <Stack.Screen
      name="promocoes"
      options={{title: "Promoções"}}
      />
    </Stack>
  );
}
