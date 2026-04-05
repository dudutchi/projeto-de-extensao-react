/**
 * Servidor de desenvolvimento para persistir pedidos em arquivo JSON
 *
 * Uso: node dev-server.js
 *
 * O app Expo enviará os pedidos para http://localhost:3000/api/pedidos
 * e serão salvos em pedidos.json na raiz do projeto
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PEDIDOS_FILE = path.join(__dirname, "pedidos.json");

// Inicializar arquivo de pedidos se não existir
function inicializarArquivoPedidos() {
  if (!fs.existsSync(PEDIDOS_FILE)) {
    fs.writeFileSync(PEDIDOS_FILE, JSON.stringify([], null, 2));
    console.log(`✅ Arquivo criado: ${PEDIDOS_FILE}`);
  }
}

// Ler pedidos do arquivo
function lerPedidos() {
  try {
    const dados = fs.readFileSync(PEDIDOS_FILE, "utf-8");
    return JSON.parse(dados);
  } catch {
    return [];
  }
}

// Salvar pedidos no arquivo
function salvarPedidos(pedidos) {
  fs.writeFileSync(PEDIDOS_FILE, JSON.stringify(pedidos, null, 2));
}

// Criar servidor HTTP
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // POST: receber novo pedido
  if (req.method === "POST" && req.url === "/api/pedidos") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const novoPedido = JSON.parse(body);
        const pedidos = lerPedidos();

        // Adicionar timestamp se não tiver
        if (!novoPedido.dataPedido) {
          novoPedido.dataPedido = new Date().toISOString();
        }

        pedidos.push(novoPedido);
        salvarPedidos(pedidos);

        console.log(
          `✅ Pedido #${pedidos.length} recebido e salvo em ${PEDIDOS_FILE}`,
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: true, totalPedidos: pedidos.length }),
        );
      } catch (error) {
        console.error("❌ Erro ao processar pedido:", error.message);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
    return;
  }

  // GET: listar todas os pedidos
  if (req.method === "GET" && req.url === "/api/pedidos") {
    const pedidos = lerPedidos();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(pedidos, null, 2));
    return;
  }

  // Health check
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", time: new Date().toISOString() }));
    return;
  }

  // 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Rota não encontrada" }));
});

// Iniciar servidor
inicializarArquivoPedidos();

server.listen(PORT, "localhost", () => {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║  Servidor de Desenvolvimento - Persistência de Pedidos  ║");
  console.log("╠════════════════════════════════════════════════════════╣");
  console.log(`║  🚀 Rodando em: http://localhost:${PORT}                   ║`);
  console.log(`║  📁 Arquivo: pedidos.json                              ║`);
  console.log("║                                                        ║");
  console.log("║  Endpoints:                                            ║");
  console.log("║  • POST http://localhost:3000/api/pedidos              ║");
  console.log("║    (receber novo pedido)                               ║");
  console.log("║                                                        ║");
  console.log("║  • GET http://localhost:3000/api/pedidos               ║");
  console.log("║    (listar todos os pedidos)                           ║");
  console.log("║                                                        ║");
  console.log("║  • GET http://localhost:3000/health                    ║");
  console.log("║    (verificar status)                                  ║");
  console.log("║                                                        ║");
  console.log("║  Pressione Ctrl+C para parar                           ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log("\n");
});

process.on("SIGINT", () => {
  console.log("\n\n📛 Servidor encerrado.");
  process.exit(0);
});
