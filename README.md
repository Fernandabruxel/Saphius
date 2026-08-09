#  Saphius

## Plataforma de Ensino em Ciências Humanas com Apoio Pedagógico e Emocional

---

##  Sobre o Projeto

**Saphius** é uma plataforma web desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso Técnico de Informática da Escola Técnica Estadual Monteiro Lobato. A plataforma foi criada para auxiliar estudantes na preparação para o ENEM, oferecendo conteúdos de Ciências Humanas (História, Geografia, Sociologia e Filosofia) com trilhas personalizadas.

###  Objetivo Geral

Desenvolver uma plataforma gratuita e personalizada para Ciências Humanas e suas Tecnologias, com organização de conteúdos, trilhas de aprendizagem e suporte para futura integração com IA de apoio pedagógico e emocional.

###  Diferenciais

-  **Gratuito** - Acesso livre para todos os estudantes
-  **Foco no ENEM** - Conteúdo direcionado para a prova
-  **Humanidades** - Especializado em Ciências Humanas
-  **Trilhas adaptativas** - Organização personalizada dos estudos

---

##  Tecnologias Utilizadas

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilização e design responsivo |
| **JavaScript** | Interatividade e dinamismo |

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** | Ambiente de execução JavaScript |
| **Express.js** | Framework web para Node.js |
| **MySQL** | Banco de dados relacional |
| **express-session** | Gerenciamento de sessões de usuário |

### Banco de Dados
| Tecnologia | Descrição |
|------------|-----------|
| **MySQL** | Armazenamento de usuários, conversas e progresso |
| **SQL** | Consultas e gerenciamento de dados |

---

##  Funcionalidades

###  Autenticação
- Cadastro de novos usuários
- Login com email e senha
- Gerenciamento de sessão
- Logout seguro

###  Conteúdos
- **História** - Brasil República, Era Vargas, Período Democrático, Ditadura Militar, Redemocratização
- **Geografia** - Geografia Física, Geopolítica, Meio Ambiente, Atualidades, Agropecuária
- **Sociologia** - Cidadania, Cultura, Trabalho, Movimentos Sociais, Desigualdade Social
- **Filosofia** - Ética, Política, Filosofia Clássica, Pensadores Modernos, Contemporânea

###  Trilha de Estudos
- Progresso por matéria
- Etapas para cada conteúdo
- Barra de progresso geral
- Salvamento automático do progresso

###  Apoio ao Estudante
- Chat com assistente para apoio emocional
- Reconhecimento de sentimentos (ansiedade, cansaço, desmotivação)
- Sugestões rápidas de conversa
- Dicas de organização e foco

###  Perfil
- Visualização de dados pessoais
- Edição de ano escolar
- Edição de meta de estudo

###  Configurações
- Preferências de resposta do assistente

###  Ajuda
- Informações sobre o projeto
- Contato (E-mail, Instagram)

---

##  Banco de Dados

### Modelo Relacional (MySQL)

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Armazena dados dos usuários cadastrados |
| `conversas_ia` | Histórico de conversas com a assistente |
| `progresso_trilha` | Progresso do usuário na trilha de estudos |

## Como Executar o Projeto

## Passo a Passo
1. Clone o repositório
git clone https://github.com/Fernandabruxel/saphius.git
cd saphius
2. Instale as dependências
npm install
3. Configure o banco de dados
mysql -u root -p
CREATE DATABASE saphius_db;
4. Execute o script de criação das tabelas

5. Inicie o servidor
node server.js
6. Acesse no navegador
http://localhost:3000
 
## Como Testar
- Usuário de Teste
Campo	Valor
Email	usuario@teste.com
Senha	User123


## Estrutura do Projeto
text
saphius/
├──  public/
│   └── script.js
├──  views/
│   ├──  conteudos/
│   │   ├──  historia/
│   │   │   ├── brasil-republica.html
│   │   │   ├── era-vargas.html
│   │   │   ├── periodo-democratico.html
│   │   │   ├── ditadura-militar.html
│   │   │   └── redemocratizacao.html
│   │   ├──  geografia/
│   │   │   ├── geografia-fisica.html
│   │   │   ├── geopolitica-brasileira.html
│   │   │   ├── geopolitica-mundial.html
│   │   │   ├── meio-ambiente.html
│   │   │   ├── atualidades.html
│   │   │   └── agropecuaria.html
│   │   ├──  sociologia/
│   │   │   ├── cidadania.html
│   │   │   ├── cultura-brasileira.html
│   │   │   ├── trabalho.html
│   │   │   ├── movimentos-sociais.html
│   │   │   ├── desigualdade-social.html
│   │   │   └── violencia-seguranca.html
│   │   ├──  filosofia/
│   │   │   ├── etica.html
│   │   │   ├── politica.html
│   │   │   ├── classica.html
│   │   │   ├── modernos.html
│   │   │   ├── contemporanea.html
│   │   │   └── enem.html
│   │   ├── historia.html
│   │   ├── geografia.html
│   │   ├── sociologia.html
│   │   └── filosofia.html
│   ├── login.html
│   ├── cadastro.html
│   ├── dashboard.html
│   ├── conteudos.html
│   ├── trilha.html
│   ├── bemestar.html
│   ├── perfil.html
│   ├── configuracoes.html
│   └── ajuda.html
├──  img/
│   ├── icone-logo-removebg-preview.png
│   └── logo-removebg-preview.png
├── server.js
├──conhecimentos.js  - Em desenvolvimento
├──conteudos.txt     - Em desenvolvimento
├──gemini.js         - Em desenvolvimento
├── db.js
├── index.html
├── style.css
├── package.json
└── README.md


### Autora
- Fernanda Eduarda de Oliveira Bruxel

Email: nandabruxelbruxel@gmail.com
Curso: Técnico em Informática
Instituição: Escola Técnica Estadual Monteiro Lobato - Taquara/RS

 Agradecimentos
Candido Luciano de Farias - Orientador do TCC
Escola Técnica Estadual Monteiro Lobato - Estrutura e apoio
Professores e colegas - Contribuições e incentivo

Links Úteis
Contato: nandabruxelbruxel@gmail.com
Instagram: @projeto_saphius

### Próximas Implementações
- Integração com IA para respostas mais avançadas
- Relatórios de desempenho e gráficos
- Sistema de notificações e lembretes

Projeto desenvolvido para auxiliar estudantes na preparação para o ENEM!