// Espera o DOM (a página) carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Encontra os elementos na página
    const btnOuvir = document.getElementById('btn-ouvir-noticia');
    const tituloEl = document.getElementById('noticia-titulo');
    const corpoEl = document.getElementById('noticia-corpo');

    // 2. Verifica se o navegador suporta a API de Fala
    // Se não suportar, esconde o botão e para o script.
    if (!('speechSynthesis' in window)) {
        console.error('Navegador não suporta a Web Speech API.');
        if (btnOuvir) btnOuvir.style.display = 'none'; 
        return; 
    }
    
    // 3. Garante que a fala pare se o usuário sair da página (boa prática)
    window.addEventListener('beforeunload', () => {
        window.speechSynthesis.cancel();
    });

    // 4. Adiciona o evento de clique ao botão
    // (só adiciona se o botão realmente existir na página)
    if (btnOuvir) {
        btnOuvir.addEventListener('click', () => {
            
            // 4a. Se já estiver falando, para a leitura
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel(); // Para a fala imediatamente
                btnOuvir.textContent = 'Ouvir Notícia';
                return;
            }

            // 4b. Se não estiver falando, começa a leitura
            // Verifica se encontrou o título e o corpo
            if (tituloEl && corpoEl) {
                // Pega os textos de dentro das tags HTML
                const titulo = tituloEl.textContent.trim();
                const corpo = corpoEl.textContent.trim();
                const textoCompleto = titulo + ". " + corpo; // Junta os dois

                // Cria o objeto de fala (o "recado")
                const utterance = new SpeechSynthesisUtterance(textoCompleto);
                
                // Configura o idioma para português do Brasil
                utterance.lang = 'pt-BR';

                // 4c. O que fazer quando a fala terminar
                utterance.onend = () => {
                    btnOuvir.textContent = 'Ouvir Notícia';
                };
                
                // 4d. O que fazer se der um erro
                utterance.onerror = (event) => {
                    console.error('Erro no SpeechSynthesis:', event.error);
                    btnOuvir.textContent = 'Ouvir Notícia'; // Reseta o botão
                };

                // 4e. Manda o navegador falar!
                window.speechSynthesis.speak(utterance);
                btnOuvir.textContent = 'Parar Leitura'; // Muda o texto do botão
            }
        });
    }
});