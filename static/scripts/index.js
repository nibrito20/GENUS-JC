const controls = document.querySelectorAll(".control");
let currentItem = 0;
const items = document.querySelectorAll(".item");
const maxItems = items.length;

//test
const overlays = document.querySelectorAll(".overlay-img")
//endtest

controls.forEach((control) => {
  control.addEventListener("click", (e) => {
    isLeft = e.target.classList.contains("arrow-left");

    if (isLeft) {
      currentItem -= 1;
    } else {
      currentItem += 1;
    }

    if (currentItem >= maxItems) {
      currentItem = 0;
    }

    if (currentItem < 0) {
      currentItem = maxItems - 1;
    }

    items.forEach((item) => item.classList.remove("current-item"));

    //test
    overlays.forEach((overlay) => overlay.classList.remove("active"));
    //endtest

    items[currentItem].scrollIntoView({
      behavior: "smooth",
      inline: "center"
    });

    //test
    overlays[currentItem].scrollIntoView({
      behavior: "smooth",
      inline: "center"
    });
    //endtest

    items[currentItem].classList.add("current-item");

    //test
    overlays[currentItem].classList.add("active");
    //endtest
  });
});
