const searchButton = document.getElementById("div-pesquisa");
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");

function openSearch() {
    if (searchButton.style.display === "none" || searchButton.style.display === "") {
        searchButton.style.display = "flex";
    } else {
        searchButton.style.display = "none";
    }
}

function openMenu() {
    menu.classList.add("active");
    overlay.classList.add("active");
}

function closeMenu() {
    menu.classList.remove("active");
    overlay.classList.remove("active");
}

overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        closeMenu();
    }
});
