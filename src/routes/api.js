const express = require('express');
const router = express.Router();
const db = require('../../db');
const { responderComContexto } = require('../../gemini');

// Colunas do Perfil (Helper)
async function garantirColunasPerfil() {
    try { await db.query('SELECT ano_escolar, objetivo_estudo FROM usuarios LIMIT 1'); } 
    catch (e) {
        try { await db.query('ALTER TABLE usuarios ADD COLUMN ano_escolar VARCHAR(50)'); } catch (err) {}
        try { await db.query('ALTER TABLE usuarios ADD COLUMN objetivo_estudo VARCHAR(255)'); } catch (err) {}
    }
}

// API do Usuário
router.get('/usuario', async (req, res) => {
    if (!req.session.usuario) return res.status(401).json({ erro: 'Não autenticado' });
    try {
        const [rows] = await db.query('SELECT id_usuario, nome, email FROM usuarios WHERE id_usuario = ?', [req.session.usuario.id]);
        if (rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json({ nome: rows[0].nome, email: rows[0].email });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao carregar usuário' });
    }
});

// API do Perfil
router.get('/perfil', async (req, res) => {
    if (!req.session.usuario) return res.status(401).json({ erro: 'Não autenticado' });
    try {
        await garantirColunasPerfil();
        const [rows] = await db.query('SELECT id_usuario, nome, email, ano_escolar, objetivo_estudo, data_cadastro FROM usuarios WHERE id_usuario = ?', [req.session.usuario.id]);
        if (rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
        const usuario = rows[0];
        res.json({
            nome: usuario.nome || 'Não definido',
            email: usuario.email || 'Não definido',
            ano_escolar: usuario.ano_escolar || null,
            objetivo_estudo: usuario.objetivo_estudo || null,
            data_cadastro: usuario.data_cadastro || null
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao carregar perfil' });
    }
});

router.post('/perfil', async (req, res) => {
    if (!req.session.usuario) return res.status(401).json({ erro: 'Não autenticado' });
    const { campo, valor } = req.body;
    if (!['ano_escolar', 'objetivo_estudo'].includes(campo)) return res.status(400).json({ erro: 'Campo não permitido' });
    if (!valor || !valor.trim()) return res.status(400).json({ erro: 'O campo não pode ficar vazio' });

    try {
        await garantirColunasPerfil();
        await db.query(`UPDATE usuarios SET ${campo} = ? WHERE id_usuario = ?`, [valor.trim(), req.session.usuario.id]);
        res.json({ sucesso: true, campo, valor: valor.trim() });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar perfil' });
    }
});

// API da IA (RAG)
router.post('/ia-apoio', async (req, res) => {
    const { mensagem } = req.body;
    if (!mensagem || mensagem.trim() === '') return res.status(400).json({ erro: 'Digite uma mensagem' });

    try {
        const resposta = await responderComContexto(mensagem);
        
        // Limpeza dos asteriscos
        const respostaLimpa = resposta.replace(/[*#_]/g, '').replace(/\s+/g, ' ').trim();

        if (req.session.usuario) {
            try {
                await db.query(
                    'INSERT INTO conversas_ia (id_usuario, mensagem_usuario, resposta_ia, sentimento) VALUES (?, ?, ?, ?)',
                    [req.session.usuario.id, mensagem, respostaLimpa, 'educacional']
                );
            } catch (error) { console.error('Erro ao salvar conversa:', error); }
        }
        res.json({ resposta: respostaLimpa });
    } catch (error) {
        console.error('Erro na IA Gemini:', error);
        res.json({ resposta: 'Desculpe, estou com dificuldades técnicas. Tente novamente! 💚' });
    }
});

module.exports = router;