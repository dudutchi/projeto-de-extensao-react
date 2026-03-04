import { router } from "expo-router";
import { push } from "expo-router/build/global-state/routing";
import { View, Text, Image, Button  } from "react-native";

export default function OndeEstamos() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style= {{top:10,}}>
        ONDE NOS ENCONTRAR!📍</Text>

      <Image
      source={require("../assets/images/endereco.png")}
      style= {{
        width: 700,
          height: 300,
          marginTop: 20,
          borderRadius: 20,
          
      }}
      />
      <Text style={{textAlign: "justify", marginTop: 10,}}>
        🔎 Pontos de referência próximos:{"\n"}
                A poucos minutos da Rua Dias da Cruz, Centro Universitário Carioca (UNICARIOCA), 
                Praça Agripino Grieco e Estação do Méier.       
      </Text>

      <Text style= {{marginTop: 20,}}>
        🗺️ Como chegar:{"\n"} 
        Basta buscar por: “Pizzaria CarioK – Rua Venceslau 318, Méier”.
      </Text>

      <Button 
      title="Voltar"
      onPress={() => router.push("/")}
      />

      <Button
      title="Promoções"
      onPress={() => router.push("/")}
      />
    </View>
  );
}