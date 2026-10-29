const express = require('express');
const router = express.Router();
const db = require('../../db');
const protegerRota = require('../middlewares/auth');

async function inicializarTrilha(id_usuario) {
    try {
        const [existing] = await db.query('SELECT * FROM progresso_trilha WHERE id_usuario = ?', [id_usuario]);
        if (existing.length === 0) {
            const materias = ['historia', 'geografia', 'sociologia', 'filosofia'];
            for (const materia of materias) {
                await db.query(
                    'INSERT INTO progresso_trilha (id_usuario, materia, progresso, status) VALUES (?, ?, ?, ?)',
                    [id_usuario, materia, 0, 'pendente']
                );
            }
        }
    } catch (error) {
        await criarTabelaTrilha();
        // Tenta novamente se a tabela tiver sido criada agora
        const materias = ['historia', 'geografia', 'sociologia', 'filosofia'];
        for (const materia of materias) {
            await db.query(
                'INSERT IGNORE INTO progresso_trilha (id_usuario, materia, progresso, status) VALUES (?, ?, ?, ?)',
                [id_usuario, materia, 0, 'pendente']
            );
        }
    }
}

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
    } catch (error) { console.error('Erro ao criar tabela:', error); }
}

router.get('/', protegerRota, async (req, res) => {
    const id_usuario = req.session.usuario.id;
    try {
        await criarTabelaTrilha();
        await inicializarTrilha(id_usuario);

        const [rows] = await db.query('SELECT materia, progresso, status FROM progresso_trilha WHERE id_usuario = ?', [id_usuario]);
        
        const progresso = { historia: 0, geografia: 0, sociologia: 0, filosofia: 0 };
        const status = { historia: 'pendente', geografia: 'pendente', sociologia: 'pendente', filosofia: 'pendente' };

        rows.forEach(row => {
            progresso[row.materia] = row.progresso || 0;
            status[row.materia] = row.status || 'pendente';
        });

        const valores = Object.values(progresso);
        const total = valores.reduce((a, b) => a + b, 0);
        const geral = Math.round(total / valores.length);

        res.json({ geral, progresso, status });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao carregar trilha' });
    }
});

router.post('/atualizar', protegerRota, async (req, res) => {
    const id_usuario = req.session.usuario.id;
    const { materia, progresso } = req.body;
    if (!materia || progresso === undefined) return res.status(400).json({ erro: 'Dados incompletos' });

    try {
        await criarTabelaTrilha();
        let status = 'pendente';
        if (progresso >= 100) status = 'concluido';
        else if (progresso > 0) status = 'em_andamento';

        await db.query(
            `INSERT INTO progresso_trilha (id_usuario, materia, progresso, status) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE progresso = VALUES(progresso), status = VALUES(status)`,
            [id_usuario, materia, progresso, status]
        );
        res.json({ sucesso: true });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar trilha' });
    }
});

router.post('/concluir', protegerRota, async (req, res) => {
    const id_usuario = req.session.usuario.id;
    const { materia } = req.body;
    if (!materia) return res.status(400).json({ erro: 'Matéria não informada' });

    try {
        await criarTabelaTrilha();
        await db.query(
            `INSERT INTO progresso_trilha (id_usuario, materia, progresso, status) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE progresso = 100, status = 'concluido'`,
            [id_usuario, materia, 100, 'concluido']
        );
        res.json({ sucesso: true });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao concluir matéria' });
    }
});

module.exports = router;