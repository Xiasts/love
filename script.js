const startImage = document.querySelector("#startImage");
const endImage = document.querySelector("#endImage");
const questionText = document.querySelector("#questionText");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const modalBackdrop = document.querySelector("#modalBackdrop");
const bgm = document.querySelector("#bgm");

const noButtonSteps = ["shrink-1", "shrink-2", "shrink-3"];
const yesButtonSteps = ["grow-1", "grow-2", "grow-3", "grow-4"];
let noClicks = 0;
let hasAccepted = false;
let musicStarted = false;

function playMusic() {
  if (musicStarted) return Promise.resolve();

  return bgm.play().then(() => {
    musicStarted = true;
  }).catch(() => {
    musicStarted = false;
  });
}

function unlockMusicOnce() {
  playMusic().then(() => {
    if (!musicStarted) return;

    document.removeEventListener("pointerdown", unlockMusicOnce);
    document.removeEventListener("touchstart", unlockMusicOnce);
    document.removeEventListener("keydown", unlockMusicOnce);
  });
}

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
  yesButton.classList.remove(...yesButtonSteps);
  yesButton.classList.add(yesButtonSteps[Math.min(noClicks, 4) - 1]);

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

function switchToEndImage() {
  startImage.classList.remove("is-visible");
  endImage.classList.add("is-visible");
  window.setTimeout(openModal, 420);
}

function acceptMiss() {
  if (hasAccepted) return;
  hasAccepted = true;

  playMusic();
  switchToEndImage();

  questionText.textContent = "姜妤你想不想我՞˶> ᎑ <˶՞";
  hideNoButton(0);
  yesButton.textContent = "想了";
}

function closeModal() {
  modalBackdrop.classList.remove("is-open");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

function resetInteraction() {
  noClicks = 0;
  hasAccepted = false;
  startImage.classList.add("is-visible");
  endImage.classList.remove("is-visible");
  modalBackdrop.classList.remove("is-open");
  modalBackdrop.setAttribute("aria-hidden", "true");
  noButton.hidden = false;
  noButton.classList.remove(...noButtonSteps, "is-gone");
  noButton.removeAttribute("aria-hidden");
  noButton.tabIndex = 0;
  yesButton.classList.remove(...yesButtonSteps);
  yesButton.textContent = "想了";
}

noButton.addEventListener("click", shrinkNoButton);
yesButton.addEventListener("click", acceptMiss);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) resetInteraction();
});
document.addEventListener("pointerdown", unlockMusicOnce);
document.addEventListener("touchstart", unlockMusicOnce);
document.addEventListener("keydown", unlockMusicOnce);
playMusic();
