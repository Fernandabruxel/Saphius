const express = require('express');
const router = express.Router();
const db = require('../../db');

async function garantirColunasPerfil() {
    try {
        await db.query('SELECT ano_escolar, objetivo_estudo FROM usuarios LIMIT 1');
    } catch (error) {
        try { await db.query('ALTER TABLE usuarios ADD COLUMN ano_escolar VARCHAR(50) NULL DEFAULT NULL'); } catch (e) {}
        try { await db.query('ALTER TABLE usuarios ADD COLUMN objetivo_estudo VARCHAR(255) NULL DEFAULT NULL'); } catch (e) {}
    }
}

router.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.redirect('/cadastro?erro=campos_vazios');

    try {
        await garantirColunasPerfil();
        const [existing] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) return res.redirect('/cadastro?erro=email_existente');

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

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
        if (rows.length === 0) return res.redirect('/login?erro=senha_incorreta');

        const usuario = rows[0];
        req.session.usuario = { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email };

        req.session.save((erro) => {
            if (erro) return res.send('Erro ao iniciar sessão.');
            res.redirect('/dashboard');
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.send('Erro ao fazer login!');
    }
});

router.get('/sair', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

module.exports = router;