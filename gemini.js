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
    console.log('Carregando modelo de embeddings... (pode demorar na primeira vez)');
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log('Modelo de embeddings carregado!');
  }
  return extractor;
}

async function ingestContent() {
  const conteudoDir = path.join(__dirname, "conteudo");
  if (!fs.existsSync(conteudoDir)) {
    fs.mkdirSync(conteudoDir);
    console.log("Pasta 'conteudo' criada. Adicione seus arquivos .txt nela.");
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
  
  // Se não achar nada, ainda pode ser um desabafo emocional, então não bloqueia
  const contexto = relevantChunks.length > 0 
    ? relevantChunks.map(c => c.texto).join("\n\n").slice(0, 1500) 
    : "Nenhum conteúdo específico encontrado.";

  // PROMPT REFORÇADO
  const prompt = `
Você é a assistente educacional e de bem-estar da plataforma "Saphius".

REGRAS DE COMPORTAMENTO:
1. Se o aluno estiver perguntando sobre MATÉRIA (História, Geografia, Sociologia, Filosofia), responda APENAS com base no conteúdo abaixo.
2. Se o aluno estiver expressando SENTIMENTOS (cansado, ansioso, triste, desmotivado), NÃO fale sobre matérias. Apenas dê uma mensagem de conforto, apoio e diga para ele respirar e fazer pausas.
3. Se ele misturar os dois (ex: "Estou cansado e quero saber da Era Vargas"), responda primeiro sobre a Era Vargas de forma direta, e no final coloque uma frase curta de conforto.

REGRAS DE FORMATAÇÃO (MUITO IMPORTANTE):
- NUNCA use asteriscos (**), cerquilhas (#) ou colchetes ([]).
- NUNCA use listas com marcadores (como * ou -).
- Escreva em parágrafos contínuos, como uma conversa normal de chat.
- Não use negrito.

--- CONTEÚDO DISPONÍVEL ---
${contexto}
--- FIM DO CONTEÚDO ---

Pergunta do aluno: "${pergunta}"

Sua resposta em texto puro:
`;

  try {
    const response = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: prompt,
    });

    return response.output_text;
  } catch (error) {
    console.error('Erro na API Gemini:', error.message);
    try {
        const fallback = await ai.interactions.create({
            model: "gemini-2.5-flash",
            input: prompt,
        });
        return fallback.output_text;
    } catch (e) {
        return 'Desculpe, estou com dificuldades técnicas. Tente novamente! 💚';
    }
  }
}

module.exports = { responderComContexto, ingestContent };