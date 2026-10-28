# 📚 Guia de Git e Fluxo de Trabalho da Equipe

Bem-vindos ao guia de versionamento do nosso projeto! Para mantermos o código organizado, evitarmos conflitos e garantirmos que o trabalho de todos se junte de forma segura, seguimos um fluxo padrão baseado em **Branches** e **Pull Requests**.

---

## 🧠 Entendendo os Conceitos Básicos (A Metáfora do Castelo)
* **`main` (O Castelo Principal):** É a versão oficial e estável do nosso projeto. Ninguém deve programar ou alterar arquivos diretamente nela para não quebrar o sistema da equipe.
* **Branch (A Cópia Segura):** É uma ramificação isolada do projeto. Você cria uma cópia para trabalhar na sua tarefa sem afetar o código dos outros.
* **Pull Request / PR (O Pedido de Revisão):** É a vitrine onde você apresenta o seu código pronto para a equipe revisar e aprovar antes de juntá-lo na `main`.

---

## 🛠️ O que cada comando faz?

| Comando | O que significa / Para que serve |
| :--- | :--- |
| `git checkout main` | Alterna para a branch principal (`main`). |
| `git switch branch` | Faz a mesma coisa que o git checkout main. |
| `git pull origin main` | Baixa da nuvem as atualizações mais recentes que os colegas fizeram[cite: 1]. |
| `git checkout -b <nome>` | Cria uma nova branch e já entra nela automaticamente[cite: 1]. |
| `git add .` | Prepara (separa) **todos** os arquivos modificados na sua máquina para serem salvos[cite: 1]. |
| `git commit -m "mensagem"` | Tira uma "foto" do seu progresso atual, acompanhada de uma mensagem explicando o que você fez[cite: 1]. |
| `git push` | Envia as suas alterações locais para o repositório no GitHub[cite: 1]. |
---
# Letrinhas

| -b | Significa branch, é usado para criar um nova branch e mudar para ela ao mesmo tempo.
| -c | Siginifca create, é usado para criar a branch, sem necessariamente trocar para a branch criada.
| -u | Upstream, é usado na primeira que ver ao dar push para o main.

---

## 🚀 Passo a Passo: Como trabalhar no dia a dia

### 1. No início do dia (Atualizar e criar sua branch)
Antes de começar a escrever qualquer código, garanta que você está atualizado e crie a sua branch de trabalho (substitua pelo nome da sua tarefa, ex: `feature/tela-login` ou `feature/ranking`)[cite: 1]:

```bash
git checkout main (verificar se o main)
git pull origin main (puxar o main)
git checkout -b feature/nome-da-sua-tarefa (criar sua branch, não esquece de criar)
git push -u origin feature/nome-da-tarefa (quando tu terminar de fazer suas coisas)
`