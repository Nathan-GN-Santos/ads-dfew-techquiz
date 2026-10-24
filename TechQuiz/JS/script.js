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

function responder(escolha) {
  if (respondeu) return;
  respondeu = true;
  const item = perguntas[indice];
  const correta = escolha === item.resposta;
  if (correta) acertos++;
  [...el('alternativas').children].forEach((botao, i) => {
    botao.disabled = true;
    if (i === item.resposta) botao.classList.add('correct');
    else if (i === escolha) botao.classList.add('wrong');
  });
  el('feedback-titulo').textContent = correta ? '✓ Resposta correta!' : 'Vamos aprender com essa!';
  el('explicacao').textContent = `${correta ? '' : `Resposta correta: ${item.alternativas[item.resposta]}. `}${item.explicacao}`;
  el('fonte').href = item.fonte;
  el('feedback').classList.toggle('incorrect', !correta);
  el('feedback').hidden = false;
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

el('iniciar').addEventListener('click', iniciar);
el('reiniciar').addEventListener('click', iniciar);
['voltar', 'inicio-resultado'].forEach(id => el(id).addEventListener('click', () => { mostrar('inicio'); el('iniciar').focus(); }));
document.querySelector('.nav-link').addEventListener('click', () => mostrar('inicio'));
el('proxima').addEventListener('click', () => {
  if (!respondeu) return;
  if (++indice < perguntas.length) renderizar();
  else {
    el('placar').textContent = `${acertos} / ${perguntas.length}`;
    el('mensagem').textContent = `${Math.round(acertos / perguntas.length * 100)}% de acertos. ${acertos === perguntas.length ? 'Todas as conexões feitas! Excelente resultado.' : 'Continue explorando as explicações e tente novamente para fortalecer seus conhecimentos.'}`;
    mostrar('resultado'); el('resultado-titulo').focus();
  }
});
