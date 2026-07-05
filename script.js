const mainImage = document.querySelector("#mainImage");
const questionText = document.querySelector("#questionText");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const modalBackdrop = document.querySelector("#modalBackdrop");
const bgm = document.querySelector("#bgm");

const noButtonSteps = ["shrink-1", "shrink-2", "shrink-3"];
let noClicks = 0;
let hasAccepted = false;

function hideNoButton(delay = 180) {
  noButton.classList.add("is-gone");
  noButton.setAttribute("aria-hidden", "true");
  noButton.tabIndex = -1;
  window.setTimeout(() => {
    noButton.hidden = true;
  }, delay);
}

function shrinkNoButton() {
  if (hasAccepted) return;

  noClicks += 1;
  noButton.classList.remove(...noButtonSteps);

  if (noClicks >= 4) {
    hideNoButton();
    return;
  }

  noButton.classList.add(noButtonSteps[noClicks - 1]);
}

function openModal() {
  modalBackdrop.classList.add("is-open");
  modalBackdrop.setAttribute("aria-hidden", "false");
}

function acceptMiss() {
  if (hasAccepted) return;
  hasAccepted = true;

  bgm.play().catch(() => {
    // Some browsers block audio until they fully trust the user gesture.
  });

  mainImage.classList.add("is-changing");
  window.setTimeout(() => {
    mainImage.src = "assets/end.jpg";
    mainImage.classList.remove("is-changing");
  }, 190);

  questionText.textContent = "姜妤你想不想我՞˶> ᎑ <˶՞";
  hideNoButton(0);
  yesButton.textContent = "想了";

  window.setTimeout(openModal, 360);
}

function closeModal() {
  modalBackdrop.classList.remove("is-open");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

noButton.addEventListener("click", shrinkNoButton);
yesButton.addEventListener("click", acceptMiss);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});
