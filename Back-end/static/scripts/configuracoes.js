// Aguarda o documento HTML ser totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
    
    // Pega os elementos do botão e dos checkboxes
    const saveButton = document.getElementById('save-prefs-button');
    const checkboxes = document.querySelectorAll('.genre-checkbox');

    // Função para verificar o estado dos checkboxes e atualizar o botão
    function updateButtonState() {
        // Conta quantos checkboxes estão marcados
        const checkedCount = document.querySelectorAll('.genre-checkbox:checked').length;
        
        // Se a contagem for 0, desabilita o botão. Caso contrário, habilita.
        if (checkedCount === 0) {
            saveButton.disabled = true;
        } else {
            saveButton.disabled = false;
        }
    }

    // Adiciona um "ouvinte" de clique (mudança) a cada checkbox
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', updateButtonState);
    });

    // Se o botão de salvar existir na página,
    // chama a função uma vez para definir o estado inicial correto.
    if (saveButton) {
        updateButtonState();
    }
});