const { GoogleGenAI } = require("@google/genai");
const { pipeline } = require("@xenova/transformers");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let knowledgeBase = [];
let extractor = null;

async function getExtractor() {
  if (!extractor) {
    console.log('Carregando modelo de embeddings...');
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log('Modelo carregado!');
  }
  return extractor;
}

async function ingestContent() {
  const conteudoDir = path.join(__dirname, "conteudo");
  if (!fs.existsSync(conteudoDir)) {
    fs.mkdirSync(conteudoDir);
    return;
  }
  const files = fs.readdirSync(conteudoDir);
  const chunks = [];
  const extractor = await getExtractor();

  for (const file of files) {
    if (!file.endsWith(".txt") && !file.endsWith(".md")) continue;
    const content = fs.readFileSync(path.join(conteudoDir, file), "utf-8");
    const chunkSize = 400;
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      if (chunk.trim().length > 50) {
        chunks.push({ texto: chunk.trim(), arquivo: file });
      }
    }
  }

  for (const chunk of chunks) {
    const embedding = await extractor(chunk.texto, { pooling: "mean", normalize: true });
    chunk.embedding = Array.from(embedding.data);
  }

  knowledgeBase = chunks;
  console.log(` ${chunks.length} chunks carregados.`);
}

function findRelevantChunks(questionEmbedding, topK = 2) {
  const similarities = knowledgeBase.map((chunk) => {
    let dot = 0;
    for (let i = 0; i < questionEmbedding.length; i++) {
      dot += questionEmbedding[i] * chunk.embedding[i];
    }
    return { ...chunk, score: dot };
  });
  similarities.sort((a, b) => b.score - a.score);
  return similarities.slice(0, topK);
}

async function responderComContexto(pergunta) {
  if (knowledgeBase.length === 0) {
    await ingestContent();
  }

  const extractor = await getExtractor();
  const questionEmbedding = await extractor(pergunta, { pooling: "mean", normalize: true });
  const qEmbeddingArray = Array.from(questionEmbedding.data);

  const relevantChunks = findRelevantChunks(qEmbeddingArray);
  
  const contexto = relevantChunks.length > 0 
    ? relevantChunks.map(c => c.texto).join("\n\n").slice(0, 1500) 
    : "Nenhum conteúdo específico encontrado.";

  // PROMPT REFORÇADO E RÍGIDO
  const prompt = `
Você é a assistente virtual da plataforma Saphius.

REGRAS DE OURO:
1. Se o usuário fizer uma pergunta sobre MATÉRIA (História, Geografia, Sociologia, Filosofia), responda DIRETAMENTE com o conteúdo abaixo. NÃO adicione mensagens de apoio emocional, NÃO pergunte como ele está se sentindo, NÃO diga "espero ter ajudado". Apenas responda a dúvida.
2. Se o usuário disser que está TRISTE, CANSADO, ANSIOSO ou DESMOTIVADO, dê uma resposta de conforto. NÃO fale sobre matérias.
3. NUNCA use asteriscos (*), cerquilhas (#), ou qualquer tipo de formatação. Use apenas texto corrido.
4. NUNCA invente informações. Se não estiver no conteúdo, diga: "Essa informação não está nos materiais da plataforma Saphius."

--- CONTEÚDO DA PLATAFORMA ---
${contexto}
--- FIM DO CONTEÚDO ---

Pergunta do aluno: "${pergunta}"

Resposta (apenas texto puro, sem asteriscos):
`;

      try {
    const response = await ai.interactions.create({
      model: "gemini-2.5-flash", // <-- Modelo ATUAL e estável
      input: prompt,
    });

    return response.output_text;
  } catch (error) {
    console.error('Erro na API Gemini:', error.message);
    try {
        // Se o 2.5 falhar (raro), tenta o 3.5-flash-lite (mais leve)
        const fallback = await ai.interactions.create({
            model: "gemini-3.5-flash-lite", 
            input: prompt,
        });
        return fallback.output_text;
    } catch (e) {
        console.error('Erro na API Gemini (Fallback):', e.message);
        return 'Desculpe, estou com dificuldades técnicas. Tente novamente! 💚';
    }
  }
}

module.exports = { responderComContexto, ingestContent };