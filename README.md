# 🚀 TechQuiz — Inteligência Artificial & Conceitos de TI

> Projeto desenvolvido para as disciplinas do curso de **Análise e Desenvolvimento de Sistemas** do **Centro Universitário Braz Cubas**.

> [Sobre o Projeto](#-sobre-o-projeto) | [Informações Acadêmicas](#-informações-acadêmicas) | [Links](#-links-do-projeto) | [Funcionalidades](#-funcionalidades) | [ Integrantes e Divisão de Tarefas](#-integrantes-e-divisão-de-tarefas) | [Como Executar](#-como-executar)
---

## 📌 Sobre o Projeto

O **TechQuiz** é uma aplicação web interativa de perguntas sobre o tema de **Inteligência Artificial & Conceitos de TI**. O projeto foi construído com HTML5 semântico, CSS3 e JavaScript puro, priorizando boas práticas de **Design Profissional**, **Desenvolvimento Front-End** e **Acessibilidade Web (WCAG)**.

---

## 🎓 Informações Acadêmicas
* **Instituição:** Centro Universitário Braz Cubas
* **Curso:** Análise e Desenvolvimento de Sistemas (ADS)
* **Professores Responsáveis:** 
  * Prof. Davi de Oliveira Cruz  -  Desenvolvimento Front-End para Web
  * Profª. Isabella Luiza dos Santos Souza - Design Profissional
* **Entrega:** CP1 (Checkpoint 1) - Outubro de 2026
---



## 🔗 Links do Projeto
* **Repositório oficial:** [TechQuiz](https://github.com/Nathan-GN-Santos/ads-dfew-techquiz)
* **Site Publicado (Hospedado via GitHub Pages):** [Acesse o TechQuiz Online](https://nathan-gn-santos.github.io/ads-dfew-techquiz/)

---



## ✨ Funcionalidades

- Página inicial com identidade visual própria e explicação de como jogar.
- Seis questões em `perguntas.json`, com alternativas, resposta correta, explicação e fonte.
- Feedback imediato, progresso, pontuação e reinício.
- Layout responsivo, navegação por teclado, foco visível e anúncios de feedback para tecnologias assistivas.
- Sem dependências externas, contas, coleta de dados ou serviços pagos.

---

## 👥 Integrantes e Divisão de Tarefas

| Integrante | Usuário GitHub | Responsabilidade Principal |
| :--- | :--- | :--- |
| **Carlos Henrique Nunes Ferreira Barbosa** | [@carlos](https://github.com/) | A decidir |
| **José Kailon Teixeira da Silva** | [@kailon](https://github.com/) | Armazenamento |
| **Nathan G.N. Santos** | [@Nathan-GN-Santos](https://github.com/Nathan-GN-Santos) | Qualidade, UX e Versionamento (Git Workflow) |
| **Samuel Bispo Gama** | [@samuelsamuka716](http://github.com/samuelsamuka716) | Armazenamento e Design/CSS |

---

## 💻 Como Executar

Como o projeto realiza a leitura do arquivo `perguntas.json` via `fetch()`, é necessário executá-lo através de um servidor local para evitar bloqueios de CORS do navegador.

### Opção 1: VS Code (Recomendado)
1. Abra a pasta do projeto no **VS Code**.
2. Instale a extensão **Live Server**.
3. Clique com o botão direito no arquivo `index.html` e selecione **Open with Live Server**.

### Opção 2: Servidor Python
No terminal, dentro da pasta raiz do projeto, execute:
 ```sh
python -m http.server 8000
```


