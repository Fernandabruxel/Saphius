require('dotenv').config();
const { PredictionServiceClient } = require('@google-cloud/aiplatform');

// A chave AQ vai funcionar magicamente graças a essa biblioteca
const client = new PredictionServiceClient({
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  projectId: '1036855598187', // Seu ID do projeto que aparece no print
  location: 'us-central1'
});

console.log(' Gemini API Key carregada com sucesso!');

async function responderComContexto(mensagem) {
    const prompt = `Você é a IA educacional do Saphius. Responda de forma acolhedora: ${mensagem}`;

    try {
        const endpoint = `projects/1036855598187/locations/us-central1/publishers/google/models/gemini-1.5-flash-001`;

        const request = {
            endpoint: endpoint,
            instances: [{ 
                context: `Você é uma assistente educacional amigável chamada Saphius.`,
                messages: [{ author: "user", content: prompt }]
            }],
            parameters: {
                temperature: 0.7,
                maxOutputTokens: 1000,
                topP: 0.95
            }
        };

        const [response] = await client.predict(request);
        
        if (response.predictions && response.predictions[0]) {
            return response.predictions[0].candidates[0].content;
        } else {
            throw new Error('Resposta vazia');
        }

    } catch (error) {
        console.error('Erro no Gemini (Cloud):', error);
        return 'Desculpe, estou com dificuldades. Tente novamente! ';
    }
}

module.exports = { responderComContexto };