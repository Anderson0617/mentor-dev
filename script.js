
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("textForm").addEventListener("submit", function (e) {
    e.preventDefault();

    console.clear(); // Limpa o console para facilitar leitura
    console.log("🎯 Submit clicado!");

    const tipo = document.getElementById("tipo").value;
    const nome = document.getElementById("nome").value.trim();
    const info = document.getElementById("info").value.trim();
    const output = document.getElementById("textoGerado");
    const botao = document.querySelector("button[type='submit']");

    let textoLocal = "";

    // Geração local para fallback
    switch (tipo) {
      case "linkedin":
        textoLocal = `Sou ${nome}, com trajetória marcada por determinação e vontade de aprender. ${info}  
Atualmente foco em desenvolvimento web com HTML, CSS e JavaScript. Estou construindo minha presença no LinkedIn e aprendendo com cada passo da jornada.`;
        break;

      case "github":
        textoLocal = `Olá! Eu sou ${nome}. ${info}  
Este GitHub reflete minha evolução como dev, com projetos práticos, código limpo e aprendizado constante.`;
        break;

      case "projeto":
        textoLocal = `Projeto desenvolvido por ${nome}. ${info}  
Tecnologias utilizadas: HTML5, CSS3, JavaScript. O objetivo foi aplicar conhecimento técnico com propósito real.`;
        break;

      case "motivacional":
        textoLocal = `Nem sempre é fácil, mas eu continuo. Me chamo ${nome} e venho de uma trajetória onde cada linha de código representa uma superação. ${info}  
Persistência, paciência e paixão por aprender — é isso que me move.`;
        break;

      default:
        textoLocal = "Selecione um tipo de texto válido.";
    }

    // Desativa o botão e mostra mensagem de carregamento
    botao.disabled = true;
    output.textContent = "Gerando texto com IA...";

    const dadosParaEnviar = { tipo, nome, info };
    console.log("📤 Enviando para n8n:", dadosParaEnviar);

    // Envia os dados ao webhook do n8n
    fetch("https://anderson-oliveira.app.n8n.cloud/webhook/gerador-texto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // força requisição nova
      body: JSON.stringify(dadosParaEnviar),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Erro na resposta do servidor");
        }
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.warn("⚠️ Resposta não era JSON válido:", text);
          return { textoGerado: null };
        }
      })
      .then((data) => {
        // Tenta encontrar o texto em diferentes formatos
        const textoIA =
          data.textoGerado ||
          data.message ||
          data.text ||
          data.result?.[0]?.message?.content;

        if (textoIA) {
          output.textContent = textoIA;
        } else {
          console.log("⚠️ Usando fallback local");
          output.textContent = textoLocal;
        }
      })
      .catch((error) => {
        console.error("❌ Erro ao chamar o webhook:", error);
        output.textContent = textoLocal;
      })
      .finally(() => {
        botao.disabled = false;
      });
  });
});
