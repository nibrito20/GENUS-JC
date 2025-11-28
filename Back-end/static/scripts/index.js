const controls = document.querySelectorAll(".control");
const items = document.querySelectorAll(".item");
const maxItems = items.length;
let currentItem = 0;

controls.forEach((control) => {
  control.addEventListener("click", (e) => {
    const isLeft = e.target.classList.contains("arrow-left");

    currentItem = isLeft ? currentItem - 1 : currentItem + 1;

    if (currentItem >= maxItems) currentItem = 0;
    if (currentItem < 0) currentItem = maxItems - 1;

    // Atualiza todos os itens e overlays
    items.forEach((item, index) => {
      const overlay = item.querySelector(".overlay-img");

      const isActive = index === currentItem;

      item.classList.toggle("current-item", isActive);
      overlay.classList.toggle("active", isActive);
    });

    // Faz o item correto rolar até o centro
    items[currentItem].scrollIntoView({
      behavior: "smooth",
      inline: "center"
    });
  });
});
