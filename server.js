require('dotenv').config();

const { Agent, setGlobalDispatcher } = require('undici');
setGlobalDispatcher(new Agent({
    headersTimeout: 330_000, 
    bodyTimeout: 660_000,    
}));

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 

// MIDDLEWARES 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.use(session({
    secret: 'saphius_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
}));

// ROTAS MODULARIZADAS 
const authRoutes = require('./src/routes/auth');
const paginaRoutes = require('./src/routes/paginas');
const apiRoutes = require('./src/routes/api');
const trilhaRoutes = require('./src/routes/trilha');

app.use('/', authRoutes);       // Login, Cadastro, Sair
app.use('/', paginaRoutes);     // Dashboard, Conteúdos, etc.
app.use('/api', apiRoutes);     // Perfil, IA
app.use('/api/trilha', trilhaRoutes); // Progresso

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(` Saphius rodando em http://localhost:${PORT}`);
    console.log(' Conectado ao banco saphius_db');
    console.log('  IA Gemini com RAG ativada!');
});