// Seleciona os elementos
const btnCategorias = document.getElementById("btn-categorias");
const menuCategorias = document.getElementById("menu-categorias");
const fecharCategorias = document.getElementById("fechar-categorias");

// Abrir o menu
btnCategorias.addEventListener("click", () => {
    menuCategorias.classList.add("aberto");
});

// Fechar o menu
fecharCategorias.addEventListener("click", () => {
    menuCategorias.classList.remove("aberto");
});

// Fechar clicando fora
document.addEventListener("click", function (e) {
    if (!menuCategorias.contains(e.target) && !btnCategorias.contains(e.target)) {
        menuCategorias.classList.remove("aberto");
    }
});

