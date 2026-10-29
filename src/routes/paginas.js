const express = require('express');
const router = express.Router();
const path = require('path');
const protegerRota = require('../middlewares/auth');

// Rota para pegar a raiz do projeto (já que estamos em src/routes)
const rootDir = path.join(__dirname, '..', '..');

// Páginas Públicas
router.get('/', (req, res) => res.sendFile(path.join(rootDir, 'index.html')));
router.get('/login', (req, res) => res.sendFile(path.join(rootDir, 'views', 'login.html')));
router.get('/cadastro', (req, res) => res.sendFile(path.join(rootDir, 'views', 'cadastro.html')));
router.get('/comecar', (req, res) => res.sendFile(path.join(rootDir, 'views', 'login.html')));

// Páginas Protegidas
router.get('/dashboard', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'dashboard.html')));
router.get('/conteudos', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos.html')));
router.get('/trilha', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'trilha.html')));
router.get('/bemestar', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'bemestar.html')));
router.get('/perfil', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'perfil.html')));
router.get('/configuracoes', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'configuracoes.html')));
router.get('/ajuda', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'ajuda.html')));

// Matérias
router.get('/historia', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'historia.html')));
router.get('/geografia', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'geografia.html')));
router.get('/sociologia', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'sociologia.html')));
router.get('/filosofia', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'filosofia.html')));

// Tópicos de História
router.get('/historia/brasil-republica', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'historia', 'brasil-republica.html')));
router.get('/historia/era-vargas', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'historia', 'era-vargas.html')));
router.get('/historia/periodo-democratico', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'historia', 'periodo-democratico.html')));
router.get('/historia/ditadura-militar', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'historia', 'ditadura-militar.html')));
router.get('/historia/redemocratizacao', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'historia', 'redemocratizacao.html')));

// Tópicos de Geografia
router.get('/geografia/geografia-fisica', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'geografia', 'geografia-fisica.html')));
router.get('/geografia/geopolitica-brasileira', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'geografia', 'geopolitica-brasileira.html')));
router.get('/geografia/geopolitica-mundial', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'geografia', 'geopolitica-mundial.html')));
router.get('/geografia/meio-ambiente', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'geografia', 'meio-ambiente.html')));
router.get('/geografia/atualidades', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'geografia', 'atualidades.html')));
router.get('/geografia/agropecuaria', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'geografia', 'agropecuaria.html')));

// Tópicos de Filosofia
router.get('/filosofia/etica', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'filosofia', 'etica.html')));
router.get('/filosofia/politica', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'filosofia', 'politica.html')));
router.get('/filosofia/classica', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'filosofia', 'classica.html')));
router.get('/filosofia/modernos', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'filosofia', 'modernos.html')));
router.get('/filosofia/contemporanea', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'filosofia', 'contemporanea.html')));
router.get('/filosofia/enem', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'filosofia', 'enem.html')));

// Tópicos de Sociologia
router.get('/sociologia/cidadania', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'sociologia', 'cidadania.html')));
router.get('/sociologia/cultura-brasileira', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'sociologia', 'cultura-brasileira.html')));
router.get('/sociologia/trabalho', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'sociologia', 'trabalho.html')));
router.get('/sociologia/movimentos-sociais', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'sociologia', 'movimentos-sociais.html')));
router.get('/sociologia/desigualdade-social', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'sociologia', 'desigualdade-social.html')));
router.get('/sociologia/violencia-seguranca', protegerRota, (req, res) => res.sendFile(path.join(rootDir, 'views', 'conteudos', 'sociologia', 'violencia-seguranca.html')));

module.exports = router;