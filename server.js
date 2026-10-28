require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./db');

const app = express();
const PORT = 3000;

// ==================== MIDDLEWARES ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('.'));

// Sessão
app.use(session({
    secret: 'saphius_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
}));

// ==================== FUNÇÕES AUXILIARES ====================

async function garantirColunasPerfil() {
    try {
        await db.query('SELECT ano_escolar, objetivo_estudo FROM usuarios LIMIT 1');
    } catch (error) {
        try {
            await db.query('ALTER TABLE usuarios ADD COLUMN ano_escolar VARCHAR(50) NULL DEFAULT NULL');
        } catch (e) {}
        try {
            await db.query('ALTER TABLE usuarios ADD COLUMN objetivo_estudo VARCHAR(255) NULL DEFAULT NULL');
        } catch (e) {}
    }
}

function protegerRota(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
}

// ==================== ROTAS PÚBLICAS ====================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/comecar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

// ==================== CADASTRO ====================

app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.redirect('/cadastro?erro=campos_vazios');
    }

    try {
        await garantirColunasPerfil();

        const [existing] = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.redirect('/cadastro?erro=email_existente');
        }

        await db.query(
            'INSERT INTO usuarios (nome, email, senha, ano_escolar, objetivo_estudo) VALUES (?, ?, ?, ?, ?)',
            [nome.trim(), email.trim(), senha, null, null]
        );

        res.redirect('/login?cadastro=sucesso');

    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.redirect('/cadastro?erro=erro_geral');
    }
});

// ==================== LOGIN ====================

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
            [email, senha]
        );

        if (rows.length === 0) {
            // CORREÇÃO AQUI: Redireciona com o parâmetro de erro, em vez de enviar HTML puro
            return res.redirect('/login?erro=senha_incorreta');
        }

        const usuario = rows[0];

        req.session.usuario = {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email
        };

        req.session.save((erro) => {
            if (erro) {
                console.error('Erro ao salvar sessão:', erro);
                return res.send('Erro ao iniciar sessão. Tente novamente.');
            }
            res.redirect('/dashboard');
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.send('Erro ao fazer login! Tente novamente.');
    }
});

// ==================== PÁGINAS DO SISTEMA ====================

app.get('/dashboard', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/conteudos', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos.html'));
});

app.get('/trilha', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'trilha.html'));
});

app.get('/bemestar', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'bemestar.html'));
});

app.get('/perfil', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfil.html'));
});

app.get('/configuracoes', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'configuracoes.html'));
});

app.get('/ajuda', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ajuda.html'));
});

app.get('/sair', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// ==================== MATÉRIAS ====================

app.get('/historia', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'historia.html'));
});

app.get('/geografia', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'geografia.html'));
});

app.get('/sociologia', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'sociologia.html'));
});

app.get('/filosofia', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'filosofia.html'));
});

// ==================== TÓPICOS DE HISTÓRIA ====================

app.get('/historia/brasil-republica', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'historia', 'brasil-republica.html'));
});

app.get('/historia/era-vargas', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'historia', 'era-vargas.html'));
});

app.get('/historia/periodo-democratico', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'historia', 'periodo-democratico.html'));
});

app.get('/historia/ditadura-militar', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'historia', 'ditadura-militar.html'));
});

app.get('/historia/redemocratizacao', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'historia', 'redemocratizacao.html'));
});

// ==================== TÓPICOS DE GEOGRAFIA ====================

app.get('/geografia/geografia-fisica', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'geografia', 'geografia-fisica.html'));
});

app.get('/geografia/geopolitica-brasileira', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'geografia', 'geopolitica-brasileira.html'));
});

app.get('/geografia/geopolitica-mundial', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'geografia', 'geopolitica-mundial.html'));
});

app.get('/geografia/meio-ambiente', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'geografia', 'meio-ambiente.html'));
});

app.get('/geografia/atualidades', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'geografia', 'atualidades.html'));
});

app.get('/geografia/agropecuaria', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'geografia', 'agropecuaria.html'));
});

// ==================== TÓPICOS DE FILOSOFIA ====================

app.get('/filosofia/etica', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'filosofia', 'etica.html'));
});

app.get('/filosofia/politica', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'filosofia', 'politica.html'));
});

app.get('/filosofia/classica', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'filosofia', 'classica.html'));
});

app.get('/filosofia/modernos', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'filosofia', 'modernos.html'));
});

app.get('/filosofia/contemporanea', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'filosofia', 'contemporanea.html'));
});

app.get('/filosofia/enem', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'filosofia', 'enem.html'));
});

// ==================== TÓPICOS DE SOCIOLOGIA ====================

app.get('/sociologia/cidadania', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'sociologia', 'cidadania.html'));
});

app.get('/sociologia/cultura-brasileira', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'sociologia', 'cultura-brasileira.html'));
});

app.get('/sociologia/trabalho', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'sociologia', 'trabalho.html'));
});

app.get('/sociologia/movimentos-sociais', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'sociologia', 'movimentos-sociais.html'));
});

app.get('/sociologia/desigualdade-social', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'sociologia', 'desigualdade-social.html'));
});

app.get('/sociologia/violencia-seguranca', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'conteudos', 'sociologia', 'violencia-seguranca.html'));
});

// ==================== APIS ====================

app.get('/api/usuario', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ erro: 'Não autenticado' });
    }

    try {
        const [rows] = await db.query(
            'SELECT id_usuario, nome, email FROM usuarios WHERE id_usuario = ?',
            [req.session.usuario.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        const usuario = rows[0];
        req.session.usuario = {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email
        };

        res.json({
            nome: usuario.nome,
            email: usuario.email
        });

    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        res.status(500).json({ erro: 'Erro ao carregar usuário' });
    }
});

app.get('/api/perfil', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ erro: 'Não autenticado' });
    }

    try {
        await garantirColunasPerfil();

        const [rows] = await db.query(
            'SELECT id_usuario, nome, email, ano_escolar, objetivo_estudo, data_cadastro FROM usuarios WHERE id_usuario = ?',
            [req.session.usuario.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        const usuario = rows[0];

        req.session.usuario = {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email
        };

        res.json({
            nome: usuario.nome || 'Não definido',
            email: usuario.email || 'Não definido',
            ano_escolar: usuario.ano_escolar || null,
            objetivo_estudo: usuario.objetivo_estudo || null,
            data_cadastro: usuario.data_cadastro || null
        });

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        res.status(500).json({ erro: 'Erro ao carregar perfil' });
    }
});

app.post('/api/perfil', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ erro: 'Não autenticado' });
    }

    const { campo, valor } = req.body;

    if (!['ano_escolar', 'objetivo_estudo'].includes(campo)) {
        return res.status(400).json({ erro: 'Campo não permitido' });
    }

    if (!valor || !valor.trim()) {
        return res.status(400).json({ erro: 'O campo não pode ficar vazio' });
    }

    try {
        await garantirColunasPerfil();

        const sql = `UPDATE usuarios SET ${campo} = ? WHERE id_usuario = ?`;
        await db.query(sql, [valor.trim(), req.session.usuario.id]);

        res.json({
            sucesso: true,
            campo: campo,
            valor: valor.trim()
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ erro: 'Erro ao atualizar perfil' });
    }
});

// ==================== RESPOSTAS SEM IA (BASEADO EM SENTIMENTOS) ====================

app.post('/api/ia-apoio', (req, res) => {
    const { mensagem } = req.body;

    if (!mensagem || mensagem.trim() === '') {
        return res.status(400).json({ erro: 'Digite uma mensagem' });
    }

    let resposta = '';

    // Transforma a mensagem em minúsculas para facilitar a leitura
    const texto = mensagem.toLowerCase();

    // 1. DETECÇÃO DE SENTIMENTOS E MATÉRIAS
    const estaAnsioso = texto.includes('ansioso') || texto.includes('ansiosa') || texto.includes('preocupado') || texto.includes('preocupada') || texto.includes('medo') || texto.includes('nervoso') || texto.includes('nervosa');
    const estaSobPressao = texto.includes('pressão') || texto.includes('pressao') || texto.includes('cobrança') || texto.includes('cobranca') || texto.includes('prova') || texto.includes('teste') || texto.includes('nota');
    const estaCansado = texto.includes('cansado') || texto.includes('cansada') || texto.includes('cansaço') || texto.includes('exausto') || texto.includes('exausta') || texto.includes('dormir');
    const estaDesmotivado = texto.includes('desmotivado') || texto.includes('desmotivada') || texto.includes('motivação') || texto.includes('motivacao') || texto.includes('vontade') || texto.includes('desânimo') || texto.includes('desanimo');

    // Verifica se perguntou sobre alguma matéria
    const perguntouHistoria = texto.includes('história') || texto.includes('historia');
    const perguntouGeografia = texto.includes('geografia');
    const perguntouFilosofia = texto.includes('filosofia');
    const perguntouSociologia = texto.includes('sociologia');

    // 2. LÓGICA DE RESPOSTAS
    if (estaAnsioso || estaSobPressao) {
        resposta = "Entendo como a pressão dos estudos pode ser pesada.  Lembre-se: o mais importante é o seu bem-estar. Faça pausas curtas, respire fundo e divida seus estudos em pequenas partes. Você é capaz, e o seu esforço já está valendo a pena! Estou aqui para te apoiar.";
    } 
    else if (estaCansado) {
        resposta = "Cansar é humano e faz parte da jornada.  Que tal dar uma pausa de 15 minutos? Pegue um copo d'água, mexa um pouco o corpo ou apenas feche os olhos. Descansar agora vai te fazer render muito mais depois. Cuide de você, ok?";
    }
    else if (estaDesmotivado) {
        resposta = "Todo mundo passa por momentos de desânimo.  Não se cobre tanto hoje. Que tal começar assistindo a um vídeo bem curto sobre o que você gosta, ou ler um resumo simples? A motivação muitas vezes vem depois que a gente começa, com calma. Eu acredito no seu potencial!";
    }
    else if (perguntouHistoria) {
        resposta = "História é fascinante porque conta a trajetória da humanidade!  Se você estiver revisando, que tal focar em entender o contexto e as causas dos eventos, em vez de decorar datas? Entender o 'porquê' faz toda a diferença. Se quiser, me pergunte sobre um período específico que vou te dar uma dica!";
    }
    else if (perguntouGeografia) {
        resposta = "Geografia explica o mundo onde vivemos!  Lembre-se de interligar os temas, como relevo, clima e população. Isso ajuda muito no ENEM. Se tiver alguma dúvida sobre um tópico específico, como urbanização ou globalização, é só falar!";
    }
    else if (perguntouFilosofia) {
        resposta = "Filosofia é o convite para pensar e questionar!  Cada filósofo traz uma perspectiva única. Uma boa dica é relacionar os conceitos com situações do nosso dia a dia. Se quiser, me chame para desenrolar um pensamento filosófico com você!";
    }
    else if (perguntouSociologia) {
        resposta = "Sociologia nos ajuda a entender a sociedade em que vivemos!  Sempre tente ligar as teorias sociais (como as de Durkheim, Marx ou Weber) com as atualidades. Viu uma notícia no jornal? Pense como a sociologia explicaria aquilo. Quer treinar essa reflexão? Me pergunte!";
    }
    else {
        // Resposta geral caso não se encaixe em nenhuma das opções acima
        resposta = "Olá!  Eu sou o assistente da Saphius. Aqui estamos para cuidar do seu bem-estar e dos seus estudos. Se você estiver se sentindo pressionado(a), ansioso(a) ou quiser uma dica sobre História, Geografia, Filosofia ou Sociologia, pode me falar! Estou aqui para te ouvir e ajudar.";
    }

    // 3. SALVAR NO BANCO
    if (req.session.usuario) {
        try {
            db.query(
                'INSERT INTO conversas_ia (id_usuario, mensagem_usuario, resposta_ia, sentimento) VALUES (?, ?, ?, ?)',
                [req.session.usuario.id, mensagem, resposta, 'educacional']
            );
        } catch (error) {
            console.error('Erro ao salvar conversa:', error);
        }
    }

    // 4. ENVIAR A RESPOSTA PARA O SITE
    res.json({ resposta });
});


// ==================== TRILHA DE ESTUDOS (SALVA NO LOCALSTORAGE DO NAVEGADOR) ====================

app.get('/api/trilha', protegerRota, (req, res) => {
    // O progresso é salvo no localStorage do navegador
    // A API apenas confirma que o usuário está logado
    res.json({
        geral: 0,
        progresso: {
            historia: 0,
            geografia: 0,
            sociologia: 0,
            filosofia: 0
        },
        status: {
            historia: 'pendente',
            geografia: 'pendente',
            sociologia: 'pendente',
            filosofia: 'pendente'
        }
    });
});

app.post('/api/trilha/atualizar', protegerRota, (req, res) => {
    // Apenas confirma que a requisição foi recebida
    // O progresso real é salvo no localStorage
    res.json({ sucesso: true });
});

app.post('/api/trilha/concluir', protegerRota, (req, res) => {
    res.json({ sucesso: true });
});

// ==================== TRILHA DE ESTUDOS ====================

// Inicializar progresso da trilha para um novo usuário
async function inicializarTrilha(id_usuario) {
    try {
        // Verificar se já existe progresso
        const [existing] = await db.query(
            'SELECT * FROM progresso_trilha WHERE id_usuario = ?',
            [id_usuario]
        );
        
        if (existing.length === 0) {
            // Criar progresso inicial para todas as matérias
            const materias = ['historia', 'geografia', 'sociologia', 'filosofia'];
            for (const materia of materias) {
                await db.query(
                    'INSERT INTO progresso_trilha (id_usuario, materia, progresso, status) VALUES (?, ?, ?, ?)',
                    [id_usuario, materia, 0, 'pendente']
                );
            }
        }
    } catch (error) {
        console.error('Erro ao inicializar trilha:', error);
        // Se a tabela não existir, criar
        await criarTabelaTrilha();
        // Tentar novamente
        const materias = ['historia', 'geografia', 'sociologia', 'filosofia'];
        for (const materia of materias) {
            await db.query(
                'INSERT INTO progresso_trilha (id_usuario, materia, progresso, status) VALUES (?, ?, ?, ?)',
                [id_usuario, materia, 0, 'pendente']
            );
        }
    }
}

// Criar tabela de progresso da trilha se não existir
async function criarTabelaTrilha() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS progresso_trilha (
                id_progresso INT PRIMARY KEY AUTO_INCREMENT,
                id_usuario INT NOT NULL,
                materia VARCHAR(50) NOT NULL,
                progresso INT DEFAULT 0,
                status ENUM('pendente', 'em_andamento', 'concluido') DEFAULT 'pendente',
                data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
                UNIQUE KEY unique_usuario_materia (id_usuario, materia)
            )
        `);
        console.log(' Tabela progresso_trilha criada/verificada');
    } catch (error) {
        console.error('Erro ao criar tabela progresso_trilha:', error);
    }
}

// API para obter progresso da trilha
app.get('/api/trilha', protegerRota, async (req, res) => {
    const id_usuario = req.session.usuario.id;

    try {
        // Garantir que a tabela existe
        await criarTabelaTrilha();
        
        // Garantir que o usuário tem registros de progresso
        await inicializarTrilha(id_usuario);

        // Buscar progresso do usuário
        const [rows] = await db.query(
            'SELECT materia, progresso, status FROM progresso_trilha WHERE id_usuario = ?',
            [id_usuario]
        );

        // Mapear resultados
        const progresso = {
            historia: 0,
            geografia: 0,
            sociologia: 0,
            filosofia: 0
        };
        const status = {
            historia: 'pendente',
            geografia: 'pendente',
            sociologia: 'pendente',
            filosofia: 'pendente'
        };

        rows.forEach(row => {
            progresso[row.materia] = row.progresso || 0;
            status[row.materia] = row.status || 'pendente';
        });

        // Calcular progresso geral
        const valores = Object.values(progresso);
        const total = valores.reduce((a, b) => a + b, 0);
        const geral = Math.round(total / valores.length);

        res.json({
            geral: geral,
            progresso: progresso,
            status: status
        });

    } catch (error) {
        console.error('Erro ao buscar trilha:', error);
        res.status(500).json({ erro: 'Erro ao carregar trilha' });
    }
});

// API para atualizar progresso da trilha
app.post('/api/trilha/atualizar', protegerRota, async (req, res) => {
    const id_usuario = req.session.usuario.id;
    const { materia, progresso } = req.body;

    if (!materia || progresso === undefined) {
        return res.status(400).json({ erro: 'Dados incompletos' });
    }

    try {
        await criarTabelaTrilha();

        // Determinar status baseado no progresso
        let status = 'pendente';
        if (progresso >= 100) {
            status = 'concluido';
        } else if (progresso > 0) {
            status = 'em_andamento';
        }

        // Atualizar ou inserir
        await db.query(
            `INSERT INTO progresso_trilha (id_usuario, materia, progresso, status) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             progresso = VALUES(progresso), 
             status = VALUES(status)`,
            [id_usuario, materia, progresso, status]
        );

        res.json({ sucesso: true });

    } catch (error) {
        console.error('Erro ao atualizar trilha:', error);
        res.status(500).json({ erro: 'Erro ao atualizar trilha' });
    }
});

// API para marcar matéria como concluída
app.post('/api/trilha/concluir', protegerRota, async (req, res) => {
    const id_usuario = req.session.usuario.id;
    const { materia } = req.body;

    if (!materia) {
        return res.status(400).json({ erro: 'Matéria não informada' });
    }

    try {
        await criarTabelaTrilha();

        await db.query(
            `INSERT INTO progresso_trilha (id_usuario, materia, progresso, status) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             progresso = 100, 
             status = 'concluido'`,
            [id_usuario, materia, 100, 'concluido']
        );

        res.json({ sucesso: true });

    } catch (error) {
        console.error('Erro ao concluir matéria:', error);
        res.status(500).json({ erro: 'Erro ao concluir matéria' });
    }
});
// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
    console.log(` Saphius rodando em http://localhost:${PORT}`);
    console.log(' Conectado ao banco saphius_db');
    console.log(' Modo de respostas offline ativado!');
});