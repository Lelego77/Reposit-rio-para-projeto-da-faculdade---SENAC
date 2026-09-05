# CondoShare – Projeto Integrador SENAC

Sistema desenvolvido para permitir o **compartilhamento de itens entre moradores de um condomínio**, facilitando o empréstimo e a reserva de objetos de uso ocasional, como ferramentas, eletrodomésticos, equipamentos eletrônicos e itens esportivos.

O projeto foi desenvolvido como parte da disciplina de Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas do Centro Universitário Senac.

---

## 🌐 Landing Page

A Landing Page do CondoShare está publicada no GitHub Pages:

https://lelego77.github.io/Reposit-rio-para-projeto-da-faculdade---SENAC/

---

## 🎥 Vídeo de Demonstração

O vídeo apresenta uma demonstração do funcionamento do Proof of Concept do CondoShare, incluindo as principais funcionalidades desenvolvidas.

**Vídeo:**  
https://drive.google.com/file/d/1nnoN92NTaJX83F1xuli-Akes5nE5IO4o/view?usp=sharing

---

## Integrantes do Projeto

* Eduardo Bruno do Nascimento Cruz
* Fernando Quintanilha Namur
* Flaviano Lacerda de Araujo
* Julia Soares Santos
* Letícia Silva Ferreira
* Vinicius Alves Mangueira

---

## Descrição do Projeto

O **CondoShare** é uma plataforma web criada para facilitar o compartilhamento de objetos entre moradores de um mesmo condomínio.

A proposta surgiu da necessidade de permitir que itens que são utilizados com pouca frequência possam ser compartilhados entre vizinhos, evitando compras desnecessárias e facilitando o acesso a objetos que já estão disponíveis dentro da comunidade.

A aplicação permite que moradores cadastrem itens, consultem objetos disponíveis, pesquisem por itens específicos, filtrem resultados por categoria e solicitem empréstimos informando o período desejado.

Quando uma solicitação de empréstimo é realizada, o sistema registra a solicitação no banco de dados e gera automaticamente uma notificação para o proprietário do item.

O projeto foi desenvolvido como um **Proof of Concept (PoC)**, com foco na demonstração do funcionamento integrado entre interface, backend e banco de dados.

---

## Objetivo

O principal objetivo do CondoShare é criar uma solução digital simples para facilitar o compartilhamento de objetos entre moradores de um condomínio.

O sistema busca:

* Facilitar o acesso a itens de uso ocasional;
* Incentivar o compartilhamento entre moradores;
* Evitar a compra de objetos que são utilizados poucas vezes;
* Organizar as solicitações de empréstimos;
* Permitir a consulta de itens disponíveis;
* Registrar as informações dos empréstimos;
* Notificar o proprietário quando seu item for solicitado.

---

## Personas

### Carlos Oliveira

**Idade:** 42 anos  
**Profissão:** Engenheiro civil

Carlos é morador de um condomínio e possui ferramentas e outros objetos que utiliza ocasionalmente.

Ele deseja compartilhar esses itens com outros moradores, mas precisa ter maior controle sobre as solicitações de empréstimo e sobre quem está utilizando seus objetos.

### Mariana Souza

**Idade:** 28 anos  
**Profissão:** Designer freelancer

Mariana mora em um condomínio e costuma utilizar dispositivos móveis para resolver suas necessidades do dia a dia.

Ela procura uma forma prática de encontrar objetos que precisa utilizar ocasionalmente sem precisar comprá-los.

Para ela, é importante conseguir pesquisar itens, utilizar categorias e realizar uma solicitação de empréstimo de forma simples.

---

## Principais Funcionalidades

### Cadastro de usuários

O sistema permite cadastrar moradores para que eles possam participar do compartilhamento de itens.

Funcionalidades:

* Cadastro de nome;
* Cadastro de e-mail;
* Cadastro de senha;
* Definição do tipo de usuário;
* Listagem dos usuários cadastrados.

---

### Cadastro de itens

Os moradores podem cadastrar objetos que desejam disponibilizar para compartilhamento.

Cada item possui:

* Nome;
* Descrição;
* Categoria;
* Proprietário;
* Informação de disponibilidade;
* Campo destinado à foto do item.

---

### Consulta de itens

A plataforma apresenta os itens disponíveis para empréstimo.

Os itens são exibidos em formato de cards contendo suas principais informações.

A listagem também apresenta o proprietário e a categoria de cada item.

---

### Busca e filtros

Para facilitar a localização dos objetos, o sistema possui:

* Busca pelo nome do item;
* Busca pela descrição;
* Filtro por categoria.

Dessa forma, o morador consegue encontrar mais rapidamente o objeto que deseja solicitar.

---

### Solicitação de empréstimo

O morador pode selecionar um item e solicitar seu empréstimo.

Durante a solicitação são informados:

* Item desejado;
* Morador solicitante;
* Data de início do empréstimo;
* Data prevista para devolução.

O sistema realiza validações para evitar que a data de devolução seja anterior à data de início.

A solicitação é registrada inicialmente com o status:

`pendente`

---

### Notificações

Após uma solicitação de empréstimo, o sistema cria automaticamente uma notificação para o proprietário do item.

A notificação informa que existe uma nova solicitação relacionada ao seu objeto.

---

## Fluxo Principal do Sistema

O fluxo principal implementado no Proof of Concept funciona da seguinte maneira:

1. O morador acessa a plataforma;
2. Visualiza os itens disponíveis;
3. Pesquisa ou filtra um item;
4. Seleciona o objeto desejado;
5. Informa o morador que realizará o empréstimo;
6. Define a data de início;
7. Define a data de devolução;
8. Envia a solicitação;
9. O frontend envia os dados para a API;
10. O backend valida as informações;
11. O empréstimo é registrado no banco de dados;
12. Uma notificação é criada para o proprietário do item.

---

## Tecnologias Utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript

O frontend é responsável pela interface visual da aplicação, interação com o usuário, apresentação dos itens, formulários, filtros e envio das solicitações para o backend.

### Backend

* Node.js
* Express
* CORS
* pg (PostgreSQL)

O backend é responsável por disponibilizar a API, receber as requisições do frontend, realizar validações e executar operações no banco de dados.

### Banco de Dados

* PostgreSQL
* Supabase

O banco de dados armazena usuários, categorias, itens, empréstimos e notificações.

### Versionamento

* Git
* GitHub

### Hospedagem

* Render – Backend

---

## Integração e Hospedagem

O CondoShare é composto por três partes principais:

* **Frontend:** interface da aplicação desenvolvida em HTML, CSS e JavaScript.
* **Backend:** API desenvolvida em Node.js e Express, responsável pelo processamento das requisições.
* **Banco de dados:** PostgreSQL hospedado no Supabase, responsável pelo armazenamento das informações do sistema.

Durante a execução, o frontend se comunica com o backend por meio da API. O backend, por sua vez, realiza as consultas e alterações necessárias no banco de dados.

### Serviços utilizados

* **GitHub:** armazenamento do código-fonte e controle de versão do projeto.
* **Render:** hospedagem do backend e da API.
* **Supabase:** hospedagem do banco de dados PostgreSQL.
* **GitHub Pages:** previsto para a publicação da Landing Page do projeto.

A arquitetura utilizada pode ser resumida da seguinte forma:

**Frontend → API/Backend → Banco de Dados**

O frontend é acessado pelo usuário, o backend processa as solicitações e o Supabase armazena os dados da aplicação.

---

## Banco de Dados

O sistema utiliza um banco de dados relacional PostgreSQL hospedado no Supabase.

O banco de dados foi desenvolvido a partir do modelo físico definido para o projeto.

### Tabelas

#### `usuario`

Armazena os dados dos moradores cadastrados.

Principais campos:

* `id_usuario` – identificador do usuário;
* `nome` – nome do morador;
* `email` – e-mail do usuário;
* `senha` – senha cadastrada;
* `tipo_usuario` – tipo do usuário.

---

#### `categoria`

Armazena as categorias utilizadas para organizar os itens.

Principais campos:

* `id_categoria` – identificador da categoria;
* `nome` – nome da categoria.

Categorias utilizadas no projeto incluem:

* Ferramentas;
* Cozinha;
* Eletrônicos;
* Esportes.

---

#### `item`

Armazena os objetos disponibilizados pelos moradores.

Principais campos:

* `id_item` – identificador do item;
* `nome` – nome do objeto;
* `descricao` – descrição;
* `foto` – referência para foto do item;
* `disponivel` – indica se o item está disponível;
* `id_categoria` – categoria do item;
* `id_usuario` – proprietário do item.

---

#### `emprestimo`

Registra as solicitações de empréstimos realizadas pelos moradores.

Principais campos:

* `id_emprestimo` – identificador do empréstimo;
* `id_item` – item solicitado;
* `id_usuario` – usuário que realizou a solicitação;
* `data_solicitacao` – data da solicitação;
* `data_inicio` – início do empréstimo;
* `data_devolucao` – data prevista para devolução;
* `status` – situação da solicitação.

---

#### `notificacao`

Armazena as notificações enviadas aos moradores.

Principais campos:

* `id_notificacao` – identificador da notificação;
* `id_usuario` – usuário que recebe a notificação;
* `mensagem` – conteúdo da notificação;
* `data_envio` – data e hora do envio;
* `lida` – indica se a notificação foi visualizada.

---

## Relacionamentos do Banco de Dados

O banco de dados possui relacionamentos entre usuários, itens, categorias, empréstimos e notificações.

Um usuário pode possuir vários itens.

Cada item pertence a uma categoria e possui um proprietário.

Os empréstimos estão relacionados aos itens e aos usuários que realizam as solicitações.

As notificações estão relacionadas aos usuários que devem recebê-las.

O script de criação das tabelas, chaves primárias e relacionamentos está disponível no arquivo:

`database/schema.sql`

---

## API / Backend

O backend disponibiliza uma API REST para comunicação entre o frontend e o banco de dados.

### Usuários

#### GET `/users`

Retorna a lista de usuários cadastrados.

#### POST `/users`

Realiza o cadastro de um novo usuário.

Exemplo de dados enviados:

```json
{
  "name": "Mariana Souza",
  "email": "mariana@condoshare.com",
  "password": "senha"
}
