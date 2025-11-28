document.addEventListener('DOMContentLoaded', function() {
    const btnToggleFavorito = document.getElementById('btn-toggle-favorito');

    if (!btnToggleFavorito) {
        return;
    }

    btnToggleFavorito.addEventListener('click', function() {
        const noticiaId = this.dataset.noticiaId;
        const url = this.dataset.toggleUrl;
        
        // Pega o token CSRF do cookie (forma padrão do Django)
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        const csrftoken = getCookie('csrftoken');

        // Envia a requisição "por baixo dos panos"
        fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'noticia_id': noticiaId
            })
        })
        .then(response => response.json())
        .then(data => {
            // 4. Atualiza o botão baseado na resposta do servidor
            if (data.status === 'added') {
                this.textContent = 'Remover dos Favoritos';
                this.classList.add('favorito-ativo');
            } else if (data.status === 'removed') {
                this.textContent = 'Adicionar aos Favoritos';
                this.classList.remove('favorito-ativo');
            }
        })
        .catch(error => console.error('Erro:', error));
    });
});