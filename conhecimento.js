// conhecimento.js
const fs = require('fs');
const path = require('path');

// Carregar os conteúdos do arquivo
const conteudosPath = path.join(__dirname, 'conteudos.txt');
const conteudosCompletos = fs.readFileSync(conteudosPath, 'utf-8');

// Função para buscar conteúdo relevante
function buscarConteudoRelevante(pergunta) {
    const texto = pergunta.toLowerCase();
    let resultados = [];
    
    // Seções e palavras-chave
    const secoes = {
        'história': ['história', 'historia', 'brasil república', 'era vargas', 'ditadura militar', 'redemocratização'],
        'geografia': ['geografia', 'geopolítica', 'meio ambiente', 'biomas', 'clima', 'amazônia', 'agropecuária'],
        'sociologia': ['sociologia', 'cidadania', 'cultura', 'trabalho', 'movimentos sociais', 'desigualdade'],
        'filosofia': ['filosofia', 'ética', 'política', 'platão', 'aristóteles', 'sócrates', 'kant', 'descartes']
    };
    
    // Determinar qual seção é relevante
    let secaoRelevante = null;
    for (const [secao, palavras] of Object.entries(secoes)) {
        if (palavras.some(p => texto.includes(p))) {
            secaoRelevante = secao;
            break;
        }
    }
    
    if (secaoRelevante) {
        // Extrair a seção relevante do conteúdo completo
        const linhas = conteudosCompletos.split('\n');
        let capturando = false;
        let conteudoSecao = '';
        let contador = 0;
        const limite = 50; // Número máximo de linhas para capturar
        
        for (const linha of linhas) {
            // Iniciar captura quando encontrar a seção
            if (linha.toLowerCase().includes(`# ${secaoRelevante}`)) {
                capturando = true;
                conteudoSecao += linha + '\n';
                continue;
            }
            
            // Parar ao encontrar outra seção
            if (capturando && linha.startsWith('#') && !linha.toLowerCase().includes(secaoRelevante)) {
                break;
            }
            
            if (capturando) {
                conteudoSecao += linha + '\n';
                contador++;
                if (contador > limite) break;
            }
        }
        
        if (conteudoSecao.trim()) {
            resultados.push(conteudoSecao.trim());
        }
    }
    
    // Se não encontrou seção, retornar uma mensagem
    if (resultados.length === 0) {
        return "Não encontrei informações específicas sobre isso nos conteúdos da plataforma. Mas posso tentar ajudar com o que sei!";
    }
    
    return resultados.join('\n\n');
}

// Função para obter o contexto completo
function obterContextoCompleto(pergunta) {
    const conteudo = buscarConteudoRelevante(pergunta);
    
    // Se o conteúdo for muito grande, limitar
    if (conteudo.length > 4000) {
        return conteudo.substring(0, 4000) + '\n... (conteúdo resumido)';
    }
    
    return conteudo;
}

module.exports = { buscarConteudoRelevante, obterContextoCompleto };