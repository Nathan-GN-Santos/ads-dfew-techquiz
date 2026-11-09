'use strict';
const el = (id) => document.getElementById(id);
let perguntas = [], indice = 0, acertos = 0, respondeu = false;

function mostrar(tela) {
  ['inicio', 'como-jogar', 'jogo', 'resultado'].forEach(id => {
    el(id).hidden = id !== tela && !(tela === 'inicio' && id === 'como-jogar');
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderizar() {
  respondeu = false;
  const item = perguntas[indice];
  el('contador').textContent = `Pergunta ${indice + 1} de ${perguntas.length}`;
  el('progresso').max = perguntas.length;
  el('progresso').value = indice;
  el('categoria').textContent = item.categoria;
  el('pergunta').textContent = item.pergunta;
  el('alternativas').replaceChildren();
  el('feedback').hidden = true;
  el('proxima').hidden = true;
  item.alternativas.forEach((texto, i) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'answer';
    const letra = document.createElement('span');
    letra.className = 'letter';
    letra.textContent = String.fromCharCode(65 + i);
    letra.setAttribute('aria-hidden', 'true');
    const resposta = document.createElement('span');
    resposta.textContent = texto;
    botao.append(letra, resposta);
    botao.addEventListener('click', () => responder(i));
    el('alternativas').append(botao);
  });
  el('pergunta').focus();
}

// Acrescenta um rótulo de texto (além da cor) dentro do botão de resposta
function marcarResposta(botao, texto) {
  const marca = document.createElement('span');
  marca.className = 'marca';
  marca.textContent = texto;
  botao.children[1].append(marca);
}

function responder(escolha) {
  if (respondeu) return;
  respondeu = true;
  const item = perguntas[indice];
  const correta = escolha === item.resposta;
  if (correta) acertos++;
  [...el('alternativas').children].forEach((botao, i) => {
    botao.disabled = true;
    if (i === item.resposta) { botao.classList.add('correct'); marcarResposta(botao, '✓ Resposta correta'); }
    else if (i === escolha) { botao.classList.add('wrong'); marcarResposta(botao, '✗ Resposta incorreta'); }
  });
  el('feedback-titulo').textContent = correta ? '✓ Resposta correta!' : `✗ Incorreta — a resposta certa era ${String.fromCharCode(65 + item.resposta)}.`;
  el('explicacao').textContent = `${correta ? '' : `Resposta correta: ${item.alternativas[item.resposta]}. `}${item.explicacao}`;
  el('fonte').href = item.fonte;
  el('feedback').classList.toggle('incorrect', !correta);
  el('feedback').hidden = false;
  el('feedback-titulo').focus();
  el('progresso').value = indice + 1;
  el('proxima').textContent = indice === perguntas.length - 1 ? 'Ver resultado →' : 'Próxima pergunta →';
  el('proxima').hidden = false;
}

async function iniciar() {
  el('erro').hidden = true;
  el('iniciar').disabled = true;
  try {
    if (!perguntas.length) {
      const resposta = await fetch('perguntas.json');
      if (!resposta.ok) throw new Error('Falha ao carregar perguntas');
      const dados = await resposta.json();
      if (!Array.isArray(dados) || !dados.length || dados.some(q => !q.pergunta || !Array.isArray(q.alternativas) || q.alternativas.length < 2 || !Number.isInteger(q.resposta) || q.resposta < 0 || q.resposta >= q.alternativas.length || !q.explicacao || !/^https:\/\//.test(q.fonte))) throw new Error('Dados inválidos');
      perguntas = dados;
    }
    indice = 0; acertos = 0;
    mostrar('jogo'); renderizar();
  } catch {
    el('erro').textContent = 'Não foi possível carregar as perguntas. Abra o site por um servidor local (veja o README) ou pelo link publicado e tente novamente.';
    el('erro').hidden = false;
  } finally { el('iniciar').disabled = false; }
}

el('iniciar').addEventListener('click', () => { if (definirJogador()) iniciar(); });
el('reiniciar').addEventListener('click', iniciar);
['voltar', 'inicio-resultado'].forEach(id => el(id).addEventListener('click', () => { mostrar('inicio'); el('iniciar').focus(); }));
document.querySelector('.nav-link').addEventListener('click', () => mostrar('inicio'));
el('proxima').addEventListener('click', () => {
  if (!respondeu) return;
  if (++indice < perguntas.length) renderizar();
  else {
    el('placar').textContent = `${acertos} / ${perguntas.length}`;
    el('mensagem').textContent = `${Math.round(acertos / perguntas.length * 100)}% de acertos. ${acertos === perguntas.length ? 'Todas as conexões feitas! Excelente resultado.' : 'Continue explorando as explicações e tente novamente para fortalecer seus conhecimentos.'}`;
    registrarPartida();
    renderizarRanking();
    mostrar('resultado'); el('resultado-titulo').focus();
  }
});


// Botão de alternar tema claro/escuro

const themeToggleButton = document.getElementById('botao-tema');
const htmlElement = document.documentElement;

// 1. Verifica se já existe um tema salvo no navegador ao carregar a página
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  htmlElement.setAttribute('data-theme', savedTheme);
}

// Mantém o aria-checked do switch sincronizado com o tema (true = escuro, false = claro).
// A animação visual NÃO depende do JS: ela vem do atributo data-theme + CSS.
function atualizarSwitchTema() {
  themeToggleButton.setAttribute('aria-checked', htmlElement.getAttribute('data-theme') === 'light' ? 'false' : 'true');
}
atualizarSwitchTema(); // estado correto já ao carregar a página

// 2. EventListener do botão
themeToggleButton.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  
  if (currentTheme === 'light') {
    htmlElement.removeAttribute('data-theme'); // Volta para o escuro (padrão)
    localStorage.setItem('theme', 'dark');
  } else {
    htmlElement.setAttribute('data-theme', 'light'); // Muda para o claro
    localStorage.setItem('theme', 'light');
  }

  atualizarSwitchTema(); // atualiza aria-checked após trocar
});


// ===== Nome do jogador, histórico e ranking (sessionStorage) =====

const CHAVE_RANKING = 'ranking';   
let jogador = '';                 
let partidaAtual = null;           

// Lê o histórico salvo. Se não existir ou estiver corrompido, devolve lista vazia.
function lerRanking() {
  try {
    const dados = JSON.parse(sessionStorage.getItem(CHAVE_RANKING));
    if (!Array.isArray(dados)) return [];
    return dados.filter(r => r && typeof r.nome === 'string' && Number.isFinite(r.acertos) && Number.isFinite(r.total) && r.total > 0);
  } catch {
    return [];
  }
}

// Grava o histórico como texto JSON.
function salvarRanking(ranking) {
  try {
    sessionStorage.setItem(CHAVE_RANKING, JSON.stringify(ranking));
  } catch {
    // sessionStorage indisponível: o quiz continua funcionando, apenas sem histórico
  }
}

// Nomes únicos do histórico (ignora maiúsculas/minúsculas, mantém a 1ª grafia usada).
function nomesSalvos() {
  const unicos = new Map();
  lerRanking().forEach(r => {
    const chave = r.nome.toLowerCase();
    if (!unicos.has(chave)) unicos.set(chave, r.nome);
  });
  return [...unicos.values()];
}

// Mostra (ou esconde, com texto vazio) o erro do campo de nome.
function mostrarErroNome(mensagem) {
  const campo = el('nome-jogador');
  const aviso = el('erro-nome');
  if (mensagem) {
    aviso.textContent = '⚠ ' + mensagem;
    aviso.hidden = false;
    campo.setAttribute('aria-invalid', 'true');
  } else {
    aviso.hidden = true;
    campo.removeAttribute('aria-invalid');
  }
}

// Captura e valida o nome digitado. Devolve true se o quiz pode começar.
function definirJogador() {
  const digitado = el('nome-jogador').value.trim().replace(/\s+/g, ' ');
  if (digitado.length < 2) {
    mostrarErroNome('Digite seu nome (mínimo de 2 caracteres) para iniciar o desafio.');
    el('nome-jogador').focus();
    return false;
  }
  // Se o nome já existe no histórico, reaproveita a grafia original
  const existente = nomesSalvos().find(n => n.toLowerCase() === digitado.toLowerCase());
  jogador = existente || digitado;
  el('nome-jogador').value = jogador;
  mostrarErroNome('');
  return true;
}

// Cria os chips com os nomes do histórico na tela inicial.
function renderizarJogadoresSalvos() {
  const nomes = nomesSalvos();
  const lista = el('jogadores-lista');
  lista.replaceChildren();
  el('jogadores-salvos').hidden = nomes.length === 0;
  nomes.forEach(nome => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = nome;
    chip.addEventListener('click', () => {
      el('nome-jogador').value = nome;
      mostrarErroNome('');
      sincronizarChips();
      el('iniciar').focus();
    });
    lista.append(chip);
  });
  sincronizarChips();
}

// Marca como selecionado (aria-pressed) o chip igual ao nome digitado.
function sincronizarChips() {
  const atual = el('nome-jogador').value.trim().toLowerCase();
  [...el('jogadores-lista').children].forEach(chip => {
    chip.setAttribute('aria-pressed', String(chip.textContent.toLowerCase() === atual));
  });
}

// Salva a nota da partida associada ao nome do jogador.
function registrarPartida() {
  const ranking = lerRanking();
  partidaAtual = Date.now();
  ranking.push({ id: partidaAtual, nome: jogador, acertos, total: perguntas.length });
  salvarRanking(ranking);
  renderizarJogadoresSalvos();
}

// Monta a evolução do jogador e o ranking (top 10) na tela de resultado.
function renderizarRanking() {
  const ranking = lerRanking();
  const minhas = ranking.filter(r => r.nome === jogador);
  el('evolucao').textContent = minhas.length > 1
    ? `Evolução de ${jogador}: ${minhas.map(r => `${r.acertos}/${r.total}`).join(' → ')}`
    : `Primeira partida de ${jogador} nesta sessão. Jogue novamente para acompanhar sua evolução.`;

  const ordenado = [...ranking]
    .sort((a, b) => (b.acertos / b.total) - (a.acertos / a.total) || a.id - b.id)
    .slice(0, 10);

  const lista = el('ranking-lista');
  lista.replaceChildren();
  ordenado.forEach((r, i) => {
    const item = document.createElement('li');
    const eAtual = r.id === partidaAtual;
    if (eAtual) item.classList.add('atual');
    const nome = document.createElement('span');
    nome.textContent = `${i + 1}º — ${r.nome}${eAtual ? ' (esta partida)' : ''}`;
    const pontos = document.createElement('span');
    pontos.textContent = `${r.acertos}/${r.total}`;
    item.append(nome, pontos);
    lista.append(item);
  });
}

// Digitar no campo: limpa o erro e atualiza o chip selecionado
el('nome-jogador').addEventListener('input', () => {
  mostrarErroNome('');
  sincronizarChips();
});

// Enter no campo de nome inicia o desafio (navegação por teclado)
el('nome-jogador').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') el('iniciar').click();
});

// Botão "Outro jogador": limpa o jogador atual e volta à tela inicial para digitar ou escolher outro nome
el('outro-jogador').addEventListener('click', () => {
  jogador = '';
  el('nome-jogador').value = '';
  mostrarErroNome('');
  mostrar('inicio');
  sincronizarChips();
  el('nome-jogador').focus();
});

// Ao carregar a página, mostra os nomes que já estão no sessionStorage (ex.: depois de F5)
renderizarJogadoresSalvos();

//ANOTAÇÕES