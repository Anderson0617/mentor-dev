const APP_NAME = "Mentor.Dev - Gerador";
const VERSION = "1.0.0";


const estado = {
  historico: [], 
  tema: "claro", 
  tiposValidos: [ 
    "motivacional",
    "linkedin",
    "github",
    "curriculo",
    "personalizado",
    "projeto",
    "post-instagram",
    "email-assinatura",
  ],
};


const dom = {
  form: null,           
  tipoInput: null,      
  nomeInput: null,      
  infoInput: null,      
  output: null,         
  copiarBtn: null,      
  limparBtn: null,      
  salvarBtn: null,      
  historicoLista: null, 
  contadorChars: null,  
  contadorWords: null,  
  temaToggle: null,     
  mensagemErro: null,   
};


document.addEventListener("DOMContentLoaded", init);


function init() {
  cacheDom();        
  bindEventos();     
  atualizarContadores(); 
  carregarTema();    
  logInfo(`App iniciado: ${APP_NAME} v${VERSION}`); 
}


function cacheDom() {
  dom.form = document.getElementById("textForm");
  dom.tipoInput = document.getElementById("tipo");
  dom.nomeInput = document.getElementById("nome");
  dom.infoInput = document.getElementById("info");
  dom.output = document.getElementById("textoGerado");
  dom.copiarBtn = document.getElementById("copiarTexto");
  dom.limparBtn = document.getElementById("limparTexto");
  dom.salvarBtn = document.getElementById("salvarTexto");
  dom.historicoLista = document.getElementById("historico");
  dom.contadorChars = document.getElementById("contadorChars");
  dom.contadorWords = document.getElementById("contadorWords");
  dom.temaToggle = document.getElementById("temaToggle");
  dom.mensagemErro = document.getElementById("mensagemErro");
}


function bindEventos() {
  if (dom.form) dom.form.addEventListener("submit", onFormSubmit);           
  if (dom.copiarBtn) dom.copiarBtn.addEventListener("click", onCopiarTexto); 
  if (dom.limparBtn) dom.limparBtn.addEventListener("click", onLimparCampos);
  if (dom.salvarBtn) dom.salvarBtn.addEventListener("click", onSalvarTexto);
  if (dom.infoInput) dom.infoInput.addEventListener("input", atualizarContadores); 
  if (dom.temaToggle) dom.temaToggle.addEventListener("click", toggleTema); 
}


function limitarTexto(texto, limite) {
  if (!texto) return "";
  texto = texto.trim();
  if (texto.length <= limite) return texto;
  let cortado = texto.slice(0, limite);
  const ultimoEspaco = cortado.lastIndexOf(" ");
  if (ultimoEspaco > Math.floor(limite * 0.5)) { 
    cortado = cortado.slice(0, ultimoEspaco);
  }
  return cortado.trim() + "…"; 
}


function gerarTexto(tipo, nome, info) {
  
  const templates = {
    motivacional: [
      `Nem sempre o caminho é fácil, mas sigo firme. Me chamo ${nome} e cada linha de código representa um passo de superação. ${info} Acreditar no processo, manter a consistência e aprender com cada erro são atitudes que me guiam diariamente. O futuro se constrói com dedicação. Programar exige paciência, prática constante e paixão genuína por resolver problemas reais. Nada substitui o esforço diário para alcançar um objetivo maior.`,
      `Olá, sou ${nome}. Venho construindo minha jornada com coragem e muita resiliência. ${info} A tecnologia é meu meio de transformação pessoal e profissional. Aprendo com os desafios, compartilho o que descubro e sigo determinado a evoluir mais a cada dia. Cada dia representa uma oportunidade de fazer melhor, evoluir minhas ideias e ampliar meus horizontes com determinação e propósito claro.`,
    ],
    linkedin: [
      `Sou ${nome}, atuo na área de tecnologia com foco em desenvolvimento web. ${info} Acredito no poder da colaboração, no aprendizado contínuo e em transformar ideias em soluções reais. Estou em constante evolução, buscando contribuir com projetos que gerem impacto e crescimento mútuo. Busco sempre fazer parte de times que valorizam a troca de conhecimento, a criatividade e a inovação na resolução de problemas reais.`,
      `${nome} aqui! Construo minha trajetória profissional com base em valores como ética, foco e paixão por tecnologia. ${info} No LinkedIn, compartilho conquistas, aprendizados e também me conecto com pessoas que acreditam em inovação e propósito. Acredito que o trabalho com propósito é o que move os profissionais mais engajados. Sigo em busca de oportunidades que conectem propósito e ação.`,
    ],
    github: [
      `👋 Me chamo ${nome}, sou apaixonado por desenvolvimento e por construir soluções que resolvem problemas reais. ${info} Meu GitHub reflete essa caminhada — projetos com propósito, código limpo e foco em boas práticas. Sinta-se à vontade para explorar, colaborar e trocar ideias! Cada repositório é um passo do meu aprendizado constante e um reflexo da minha evolução como desenvolvedor comprometido e curioso.`,
      `${nome} na área! Este perfil reúne experiências em desenvolvimento web com projetos feitos com HTML, CSS, JS e automações. ${info} Aqui busco aprender, testar, documentar e evoluir junto da comunidade. Cada push é mais do que código: é uma história de aprendizado, superação e construção de algo que impacta positivamente o mundo digital.`,
    ],
    curriculo: [
      `${nome}\nResumo: Profissional dedicado à área de tecnologia, focado em desenvolvimento front-end com experiência prática em projetos pessoais e colaborativos. ${info} Possui habilidades sólidas em HTML, CSS, JavaScript e está sempre aberto ao aprendizado e à resolução de desafios reais. Facilidade em trabalhar em equipe, proatividade e foco em entregar resultados com qualidade e consistência técnica.`,
      `Nome: ${nome}\nResumo: ${info} Em transição de carreira para tecnologia, trago comigo disciplina, criatividade e senso de responsabilidade. Busco aplicar meus conhecimentos em ambientes colaborativos e contribuir com soluções eficientes. Estou sempre aprendendo novas ferramentas, praticando lógica de programação e criando interfaces que agreguem valor e usabilidade.`,
    ],
    personalizado: [
      `Olá ${nome}, aqui vai um texto pensado com carinho: ${info} O conhecimento não cresce sozinho — ele floresce quando é compartilhado. Continue plantando boas ideias, conectando pessoas e criando impacto através da tecnologia. Você está no caminho certo. Cada novo desafio vencido fortalece sua jornada e comprova que o esforço diário faz toda diferença na construção dos seus sonhos.`,
      `${nome}, seu foco e determinação são perceptíveis. ${info} Este é um lembrete de que cada etapa importa. Seja com pequenas ações diárias ou grandes entregas, tudo faz parte da jornada. Siga em frente com coragem. Confie no seu processo, valorize suas conquistas e inspire outras pessoas com sua persistência e dedicação diária.`,
    ],
    projeto: [
      `${nome} desenvolveu este projeto com o objetivo de aplicar conceitos de front-end na prática. ${info} Utilizando HTML5, CSS3 e JavaScript, o projeto entrega uma interface funcional, adaptável e com visual atraente, demonstrando domínio técnico e atenção à experiência do usuário. Foi pensado para resolver uma dor real e aplicar boas práticas de código limpo, responsividade e usabilidade.`,
      `Este projeto foi idealizado por ${nome} para solucionar uma necessidade específica do público. ${info} Com estrutura clara e uso de tecnologias modernas, ele serve como vitrine de conhecimento técnico e criatividade aplicada ao desenvolvimento. Além disso, demonstra organização, atenção ao design e capacidade de transformar ideias em soluções de impacto.`,
    ],
    "post-instagram": [
      `${nome} compartilha hoje: ${info} ✨ Dê valor às suas conquistas, mesmo que pareçam pequenas. Cada esforço conta e cada passo te aproxima do seu objetivo. #foco #desenvolvimento #tecnologia. O caminho da evolução exige consistência, paciência e uma vontade real de se superar todos os dias.`,
      `💡 Dica do dia por ${nome}: ${info} As maiores mudanças vêm da consistência, não da perfeição. Continue testando, aprendendo e se adaptando. O crescimento vem com o tempo. #devlife #aprendizado. Cada falha traz uma lição valiosa. Confie na sua jornada e siga em frente com determinação.`,
    ],
  };

  
  const tipoNormalizado = tipo.toLowerCase();

  
  const lista = templates[tipoNormalizado];

  
  if (!lista) {
    return `Tipo "${tipo}" não reconhecido. Opções válidas: ${estado.tiposValidos.join(", ")}.`;
  }

  
  const idx = Math.floor(Math.random() * lista.length);
  return lista[idx];
}


function adicionarAoHistorico(tipo, nome, info, texto) {
  const registro = {
    id: Date.now(), 
    tipo,
    nome,
    info,
    texto,
  };

  estado.historico.push(registro); 
  renderizarHistorico();            
}


function renderizarHistorico() {
  if (!dom.historicoLista) return;

  
  dom.historicoLista.innerHTML = "";

  
  estado.historico
    .slice()
    .reverse()
    .forEach((item) => {
      const li = document.createElement("li");
      li.className = "historico-item";

      
      li.title = `Tipo: ${item.tipo}\nNome: ${item.nome}\nInfo: ${item.info}`;

      
      li.textContent = item.texto.slice(0, 70) + "...";

      
      li.addEventListener("click", () => {
        if (dom.output) dom.output.textContent = item.texto;
      });

      
      dom.historicoLista.appendChild(li);
    });
}


function onCopiarTexto() {
  const texto = dom.output?.textContent || "";

  if (!texto) {
    alert("Nenhum texto para copiar.");
    return;
  }

  
  navigator.clipboard.writeText(texto).then(() => {
    alert("Texto copiado para área de transferência!");
  });
}


function onLimparCampos() {
  if (dom.nomeInput) dom.nomeInput.value = "";
  if (dom.infoInput) dom.infoInput.value = "";
  if (dom.tipoInput) dom.tipoInput.selectedIndex = 0;
  if (dom.output) dom.output.textContent = "";
  limparMensagemErro();
  atualizarContadores();
}


function onSalvarTexto() {
  const texto = dom.output?.textContent || "";

  if (!texto) {
    alert("Nenhum texto para salvar.");
    return;
  }

  
  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.download = `texto_gerado_${Date.now()}.txt`;
  link.href = URL.createObjectURL(blob);
  link.click();
}


function atualizarContadores() {
  const texto = dom.infoInput?.value || "";
  const chars = texto.length;
  const words = texto.trim() === "" ? 0 : texto.trim().split(/\s+/).length;
  if (dom.contadorChars) dom.contadorChars.textContent = `Caracteres: ${chars}`;
  if (dom.contadorWords) dom.contadorWords.textContent = `Palavras: ${words}`;
}


function toggleTema() {
  if (estado.tema === "claro") {
    document.documentElement.setAttribute("data-tema", "escuro");
    estado.tema = "escuro";
  } else {
    document.documentElement.setAttribute("data-tema", "claro");
    estado.tema = "claro";
  }
  logInfo(`Tema alterado para: ${estado.tema}`);
}


function carregarTema() {
  document.documentElement.setAttribute("data-tema", estado.tema);
}


function validarCampos(tipo, nome, info) {
  if (!tipo) {
    mostrarMensagemErro("❗ Por favor, selecione o tipo de texto.");
    dom.tipoInput?.focus?.();
    return false;
  }
  if (!nome) {
    mostrarMensagemErro("❗ Por favor, preencha seu nome.");
    dom.nomeInput?.focus?.();
    return false;
  }
  if (!info) {
    mostrarMensagemErro("❗ Por favor, conte um pouco sobre você.");
    dom.infoInput?.focus?.();
    return false;
  }
  if (!estado.tiposValidos.includes(tipo)) {
    mostrarMensagemErro("❗ Tipo de texto inválido.");
    dom.tipoInput?.focus?.();
    return false;
  }
  return true;
}


function mostrarMensagemErro(msg) {
  if (dom.mensagemErro) {
    dom.mensagemErro.textContent = msg;
    dom.mensagemErro.style.display = "block";
  } else {
    alert(msg);
  }
}


function limparMensagemErro() {
  if (dom.mensagemErro) {
    dom.mensagemErro.textContent = "";
    dom.mensagemErro.style.display = "none";
  }
}


function logInfo(msg, obj) {
  if (obj !== undefined) {
    console.log(`[INFO] ${msg}`, obj);
  } else {
    console.log(`[INFO] ${msg}`);
  }
}


function logErro(msg, obj) {
  if (obj !== undefined) {
    console.error(`[ERRO] ${msg}`, obj);
  } else {
    console.error(`[ERRO] ${msg}`);
  }
}



function exportarHistorico() {
  if (estado.historico.length === 0) {
    alert("Nenhum texto no histórico para exportar.");
    return;
  }
  const jsonStr = JSON.stringify(estado.historico, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
  const link = document.createElement("a");
  link.download = `historico_textos_${Date.now()}.json`;
  link.href = URL.createObjectURL(blob);
  link.click();
}


function enriquecerTextoSimples(textoBase) {
  const frasesInspiradoras = [
    "Acredite no seu potencial e vá além!",
    "Cada passo é um avanço rumo ao sucesso.",
    "Persistência é o caminho para a vitória.",
    "Aprender é um processo contínuo e fascinante.",
    "O futuro pertence aos que se preparam hoje.",
    "Seja a mudança que você quer ver no mundo.",
  ];
  const aleatorio = frasesInspiradoras[Math.floor(Math.random() * frasesInspiradoras.length)];
  return textoBase + " " + aleatorio;
}


const container = document.querySelector('.bubbles');
if (container) {
  container.innerHTML = '';
  for (let i = 0; i < 900; i++) {
    const span = document.createElement('span');
    span.style.setProperty('--i', i);
    span.style.setProperty('--r', Math.floor(Math.random() * 10));
    span.style.setProperty('--rx', Math.floor(Math.random() * 11));
    container.appendChild(span);
  }
}
async function enviarParaN8n(tipo, nome, info, texto) {
  const webhookUrl = "https://anderson-oliveira.app.n8n.cloud/webhook/gerador-texto";
  const payload = { 
    tipo, 
    nome, 
    info, 
    texto, 
    origem: APP_NAME, 
    timestamp: new Date().toISOString() 
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Erro HTTP ao enviar para n8n: ${res.status}`);
    }

    
    let json;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    return json;

  } catch (err) {
    throw new Error(`Falha ao enviar para n8n: ${err.message}`);
  }
}

async function onFormSubmit(event) {
  event.preventDefault();
  limparMensagemErro();

  const tipo = dom.tipoInput?.value || "";
  const nome = dom.nomeInput?.value.trim() || "";
  const info = dom.infoInput?.value.trim() || "";

  if (!validarCampos(tipo, nome, info)) return;

  logInfo("Submit clicado", { tipo, nome, info });

  
  const textoGerado = gerarTexto(tipo, nome, info);
  dom.output.innerHTML = textoGerado.replace(/\n/g, "<br>");

  try {
    
    const resposta = await enviarParaN8n(tipo, nome, info, textoGerado);

    console.log("Resposta completa do n8n:", resposta);

    
    if (resposta?.output && typeof resposta.output === "string" && resposta.output.trim().length > 0) {
      const textoN8n = resposta.output;
      dom.output.innerHTML = textoN8n.replace(/\n/g, "<br>");
      logInfo("Texto do n8n exibido com sucesso!");
      adicionarAoHistorico(tipo, nome, info, textoN8n);
    } else {
      
      logInfo("Resposta do n8n sem texto. Usando texto local.");
      adicionarAoHistorico(tipo, nome, info, textoGerado);
    }

  } catch (erro) {
    
    logErro("Erro ao enviar para n8n. Usando fallback local.", erro);
    adicionarAoHistorico(tipo, nome, info, textoGerado);

    alert("Falha no envio ao servidor, texto salvo localmente.");
  }

  atualizarContadores();
  logInfo("Fluxo finalizado!");
}
