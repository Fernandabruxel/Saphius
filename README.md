#  Saphius

## Plataforma de Ensino em Ciências Humanas com Apoio Pedagógico e Emocional

---

##  Sobre o Projeto

**Saphius** é uma plataforma web desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso Técnico de Informática da Escola Técnica Estadual Monteiro Lobato. A plataforma foi criada para auxiliar estudantes na preparação para o ENEM, oferecendo conteúdos de Ciências Humanas (História, Geografia, Sociologia e Filosofia) com trilhas personalizadas e uma Inteligência Artificial de apoio.

###  Objetivo Geral

Desenvolver uma plataforma gratuita e personalizada para Ciências Humanas e suas Tecnologias, com organização de conteúdos, trilhas de aprendizagem e suporte emocional por meio de Inteligência Artificial (RAG).

###  Diferenciais

- **100% Gratuito:** Acesso livre para todos os estudantes.
- **Foco no ENEM:** Conteúdo direcionado para a prova.
- **Humanidades:** Especializado em Ciências Humanas.
- **Trilhas Adaptativas:** Organização personalizada dos estudos.
- **IA com Contexto (RAG):** Chat que responde apenas com o conteúdo da plataforma, evitando "alucinações" da IA.

---

##  Tecnologias Utilizadas

### Frontend

| Tecnologia | Descrição |
|            |           |
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilização e design responsivo |
| **JavaScript** | Interatividade e dinamismo |

### Backend

| Tecnologia | Descrição |
|            |           |
| **Node.js** | Ambiente de execução JavaScript |
| **Express.js** | Framework web para Node.js |
| **MySQL** | Banco de dados relacional |
| **express-session** | Gerenciamento de sessões de usuário |

### Inteligência Artificial (Diferencial do TCC)

| Tecnologia | Descrição |
|            |           |
| **Google Gemini API** | Modelo de Linguagem (LLM) utilizado para gerar as respostas. |
| **@xenova/transformers** | Biblioteca para gerar embeddings localmente (Busca Semântica). |
| **RAG (Retrieval-Augmented Generation)** | Técnica de busca que divide o conteúdo do site em pedaços e os envia para a IA responder com base em fatos. |

---

##  Arquitetura do Sistema

O Saphius foi construído seguindo o modelo **Cliente-Servidor**:

1. **Cliente (Frontend):** O usuário acessa a interface, envia mensagens e navega pelos conteúdos.
2. **Servidor (Backend):** O Express.js processa as requisições, gerencia as sessões de login e valida os dados.
3. **Inteligência Artificial:** Quando o usuário envia uma mensagem no chat, o servidor:
   - Transforma a pergunta em um *embedding* (vetor numérico).
   - Busca os trechos mais relevantes dentro da pasta `conteudo/materias.txt`.
   - Envia o contexto encontrado junto com a pergunta para a API do Gemini.
   - A IA gera a resposta com base **apenas** naquele conteúdo.
4. **Banco de Dados (MySQL):** Armazena usuários, histórico de conversas e progresso nas trilhas.

---

##  Funcionalidades

###  Autenticação

- Cadastro de novos usuários com validação de email.
- Login com email e senha.
- Gerenciamento de sessão (usuário logado).
- Logout seguro.

###  Conteúdos

- **História:** Brasil República, Era Vargas, Período Democrático, Ditadura Militar, Redemocratização.
- **Geografia:** Geografia Física, Geopolítica, Meio Ambiente, Atualidades, Agropecuária.
- **Sociologia:** Cidadania, Cultura, Trabalho, Movimentos Sociais, Desigualdade Social.
- **Filosofia:** Ética, Política, Filosofia Clássica, Pensadores Modernos, Contemporânea.

###  Trilha de Estudos

- Progresso individual por matéria.
- Etapas para cada conteúdo.
- Barra de progresso geral.
- Salvamento automático no banco de dados.

###  Apoio ao Estudante (Chat IA)

- Assistente para apoio emocional e pedagógico.
- Reconhecimento de sentimentos (ansiedade, cansaço, desmotivação).
- **Respostas contextualizadas:** O sistema busca no arquivo de conhecimento para responder dúvidas de História, Geografia, etc.
- Sugestões rápidas de conversa.
- Dicas de organização e foco.

###  Perfil

- Visualização de dados pessoais.
- Edição de ano escolar.
- Edição de meta de estudo.

---

##  Banco de Dados

### Modelo Relacional (MySQL)

| Tabela | Descrição |
|        |           |
| `usuarios` | Armazena dados dos usuários cadastrados (id, nome, email, senha, ano escolar, objetivo). |
| `conversas_ia` | Histórico de conversas com a assistente (id, usuário, mensagem, resposta, data). |
| `progresso_trilha` | Progresso do usuário na trilha de estudos (id, usuário, matéria, progresso, status). |

---

##  Como Executar o Projeto

### Pré-requisitos

- Node.js instalado (versão 18+)
- MySQL instalado e rodando
- Uma chave de API do Google Gemini (AI Studio)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Fernandabruxel/saphius.git
   cd saphius

 
### Instale as dependências:

- npm install

### Configure o banco de dados:

mysql -u root -p
CREATE DATABASE saphius_db;
USE saphius_db;

###  Configure as variáveis de ambiente:

Crie um arquivo .env na raiz do projeto e adicione:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=saphius_db
GEMINI_API_KEY=sua_chave_aqui

###  Inicie o servidor:

node server.js

###  Acesse no navegador:

http://localhost:3000

###  Estrutura do Projeto:

saphius/
├── public/
│   └── script.js
├── views/
│   ├── conteudos/
│   │   ├── historia/
│   │   ├── geografia/
│   │   ├── sociologia/
│   │   └── filosofia/
│   ├── login.html
│   ├── cadastro.html
│   ├── dashboard.html
│   ├── conteudos.html
│   ├── trilha.html
│   ├── bemestar.html
│   ├── perfil.html
│   ├── configuracoes.html
│   └── ajuda.html
├── img/
│   ├── icone-logo-removebg-preview.png
│   └── logo-removebg-preview.png
├── conteudo/           <- Pasta com os arquivos .txt para a IA
│   └── materias.txt
├── server.js
├── gemini.js           <- Lógica da Inteligência Artificial
├── db.js               <- Conexão com o banco de dados
├── index.html
├── style.css
├── package.json
├── .env                <- Variáveis de ambiente (não versionar)
└── README.md


## Como Testar

- Usuário de Teste
Campo	 Valor
Email	usuario@teste.com
Senha	User123

### Testando a IA (Sugestões)

"O que foi a Era Vargas?" (Deve responder com base no conteúdo de História).

"Estou ansioso para a prova." (Deve dar uma resposta de apoio emocional).

"Quanto é 2 + 2?" (Deve recusar educadamente e focar nas Ciências Humanas).

 ## Autora

Fernanda Eduarda de Oliveira Bruxel

Email: nandabruxelbruxel@gmail.com
Email: fernanda-ebruxel@estudante.rs.gov
Curso: Técnico em Informática
Instituição: Escola Técnica Estadual Monteiro Lobato - Taquara/RS

## Agradecimentos

Candido Luciano de Farias - Orientador do TCC

Escola Técnica Estadual Monteiro Lobato - Estrutura e apoio

Professores e colegas - Contribuições e incentivo

 ## Links Úteis

Contato: nandabruxelbruxel@gmail.com
Instagram: @projeto_saphius