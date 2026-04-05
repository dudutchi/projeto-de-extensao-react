# 📋 Funcionalidade: Persistência de Pedidos em JSON

## 📝 Resumo

A novo recurso captura automaticamente **todos os dados preenchidos no formulário de pedido** e os persiste em um arquivo `pedidos.json` estruturado, que você pode abrir no VS Code.

## 🎯 Como Funciona

### 1️⃣ **Salvamento Local (Mobile)**

- Quando um pedido é finalizado, os dados são salvos em um arquivo JSON local usando `expo-file-system`
- Arquivo: `DocumentDirectory/pedido-[timestamp].json`
- Logs aparecem no console do Expo

### 2️⃣ **Sincronização com PC (Dev Server)**

- Opcionalmente, o app envia os pedidos para um servidor local em `localhost:3000`
- O servidor salva tudo em um arquivo `pedidos.json` único na raiz do projeto
- **Você pode abrir esse arquivo no VS Code e ver todos os pedidos de uma vez!**

### 3️⃣ **Download automático (Web)**

- Se estiver rodando em web, o JSON é automaticamente baixado como arquivo

---

## 🚀 Como Usar

### **Passo 1:** Inicie o servidor de desenvolvimento

```bash
node dev-server.js
```

Você verá:

```
╔════════════════════════════════════════════════════════╗
║  Servidor de Desenvolvimento - Persistência de Pedidos  ║
╠════════════════════════════════════════════════════════╣
║  🚀 Rodando em: http://localhost:3000                   ║
║  📁 Arquivo: pedidos.json                              ║
╚════════════════════════════════════════════════════════╝
```

### **Passo 2:** Inicie o app Expo em outro terminal

```bash
npm start
```

Depois escolha:

- `w` para web
- `a` para Android
- `i` para iOS

### **Passo 3:** Preencha um pedido no app

Quando você finalizar um pedido, o app automaticamente:

1. ✅ Salva em `AsyncStorage` (como antes)
2. ✅ Salva em arquivo JSON local
3. ✅ Envia para o servidor local (que salva em `pedidos.json`)

### **Passo 4:** Abra `pedidos.json` no VS Code

```bash
code pedidos.json
```

Você verá algo assim:

```json
[
  {
    "tipoPedido": "inteira",
    "tamanho": "35cm",
    "sabores": ["Mussarela", "Calabresa"],
    "borda": {
      "temBorda": true,
      "tipo": "Catupiry ou Cheddar"
    },
    "bebidas": [
      {
        "nome": "Refrigerante Lata",
        "quantidade": 2,
        "preco": 6
      }
    ],
    "pagamento": "Pix",
    "endereco": {
      "rua": "Av. Principal",
      "numero": "123",
      "bairro": "Centro",
      "cidade": "São Paulo"
    },
    "valorTotal": 65.9,
    "dataPedido": "2026-04-05T14:30:00.000Z"
  }
]
```

---

## 📂 Estrutura de Dados

Cada pedido é um objeto com:

```typescript
{
  tipoPedido: "inteira" | "meio a meio",
  tamanho: "25cm" | "35cm" | "45cm",
  sabores: string[], // Ex: ["Mussarela", "Calabresa"]
  borda: {
    temBorda: boolean,
    tipo: string | null // Ex: "Catupiry ou Cheddar" ou null
  },
  bebidas: [
    {
      nome: string,
      quantidade: number,
      preco: number
    }
  ],
  pagamento: "Cartão" | "Pix" | "Pagar na Entrega",
  endereco: {
    rua: string,
    numero: string,
    bairro: string,
    cidade: string
  },
  valorTotal: number,
  dataPedido: string // ISO 8601
}
```

---

## 🔧 Debugging

Se o servidor não estiver rodando, o app **não quebrará**. Apenas ignorará o erro e continuará funcionando normalmente com o salvamento local.

### Logs úteis:

```bash
# Ver status do servidor
curl http://localhost:3000/health

# Listar todos os pedidos
curl http://localhost:3000/api/pedidos

# Ver arquivo diretamente
cat pedidos.json
```

---

## 💡 Recursos Adicionais

### 📱 Arquivos Individuais (Mobile)

Se quiser os arquivos individuais (um por pedido), eles estão em:

**Android:**

```
/data/data/com.seu.app/files/DocumentDirectory/pedido-[timestamp].json
```

**iOS:**

```
/var/mobile/Containers/Data/Documents/pedido-[timestamp].json
```

Você pode acessá-los via Expo Go ou XCode device logs.

### 🌐 Web

Se rodar em web, os JSONs são automaticamente baixados na pasta Downloads.

---

## ✅ Checklist

- [x] App salva em `AsyncStorage` (funcionalidade original mantida)
- [x] App salva em arquivo local (`expo-file-system`)
- [x] App envia para servidor de desenvolvimento
- [x] Servidor cria/persiste `pedidos.json`
- [x] Logs informativos no console
- [x] Sem quebra da lógica central
- [x] Totalmente complementar

---

## 🛠️ Integração Futura

Quando você quiser integrar com um backend real:

1. Substitua `http://localhost:3000` por sua API real em `sincronizarComDevAPI()`
2. Ajuste o endpoint e o formato de resposta
3. O resto do código continua igual

---

**Desenvolvido para máxima produtividade e debugging! 🚀**
