import { View, Text, Button, Image } from "react-native";
import { router } from "expo-router";


export default function Index() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Bem-vindos à Pizzaria CarioK!</Text>
      <Text style={{ textAlign: "center" }}>🚚 *Entregamos nos seguintes bairros:* {"\n"}
        Engenho de Dentro, Cachambi, Lins de Vasconcelos, Grajaú, Todos os Santos, Del Castilho, Maria da Graça,
        Piedade, Abolição.</Text>
        

      <Button
        title="Onde Estamos📍"
        onPress={() => router.push("/OndeEstamos")}
      />

      <Image

        source={require("../assets/images/melhor-pizza2.0.png")}
        style={{
          width: 300,
          height: 300,
          marginTop: 10,
          borderRadius: 20,
        }}
      />

    <Text style= {{
      textAlign: "center",
      marginTop: 20,
    }}>
         A Pizzaria CarioK foi fundada em 30 de novembro de 2025 com a missão de conquistar o coração do nosso
          público através de pizzas sempre quentinhas e irresistíveis. Aqui, fazemos tudo pensando em você: oferecemos
          promoções especiais ao longo da semana, preços acessíveis e, acima de tudo, pratos preparados com carinho e
          dedicação.

          Porque, para nós, sabor de verdade é feito com amor.

    </Text>
    </View>
  );
}
