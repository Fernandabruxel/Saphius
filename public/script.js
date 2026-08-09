// Função para a IA de apoio emocional
document.addEventListener('DOMContentLoaded', function() {
    const enviarBtn = document.getElementById('enviarBtn');
    
    if (enviarBtn) {
        enviarBtn.addEventListener('click', async function() {
            const mensagem = document.getElementById('mensagem').value;
            const respostaDiv = document.getElementById('resposta');
            const respostaTexto = document.getElementById('respostaTexto');
            
            if (!mensagem.trim()) {
                alert('Digite como você está se sentindo');
                return;
            }
            
            enviarBtn.disabled = true;
            enviarBtn.textContent = 'Enviando...';
            
            try {
                const response = await fetch('/api/ia-apoio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mensagem: mensagem })
                });
                
                const data = await response.json();
                respostaTexto.textContent = data.resposta;
                respostaDiv.style.display = 'block';
            } catch (error) {
                alert('Erro ao conectar com a IA');
            } finally {
                enviarBtn.disabled = false;
                enviarBtn.textContent = 'Enviar para IA';
            }
        });
    }
});