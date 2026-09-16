"use strict";


/* AÑO */
const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* ANIMACIONES AL HACER SCROLL */
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }

    });

  },
  {
    threshold: 0.12
  }
);

revealElements.forEach((element) => {
  observer.observe(element);
});


/* REPRODUCTOR LOCAL DE REFLEXIONES */
const reflectionVideo = document.getElementById("reflectionVideo");
const reflectionTitle = document.getElementById("reflectionTitle");
const reflectionStatus = document.getElementById("reflectionStatus");
const reflectionButtons = Array.from(document.querySelectorAll(".reflection-item"));
const previousReflection = document.getElementById("previousReflection");
const nextReflection = document.getElementById("nextReflection");
let reflectionIndex = 0;
let reflectionRequest = 0;

function updateReflectionButtons() {
  reflectionButtons.forEach((button, index) => {
    const selected = index === reflectionIndex;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  previousReflection.disabled = reflectionIndex === 0;
  nextReflection.disabled = reflectionIndex === reflectionButtons.length - 1;
}

async function selectReflection(index, play = true) {
  if (!reflectionVideo || !reflectionButtons[index]) return;
  const request = ++reflectionRequest;
  const item = reflectionButtons[index];
  reflectionVideo.pause();
  reflectionIndex = index;
  reflectionTitle.textContent = item.dataset.title;
  reflectionVideo.setAttribute("aria-label", item.dataset.title);
  reflectionVideo.poster = item.dataset.poster;
  reflectionVideo.src = item.dataset.src;
  reflectionVideo.load();
  reflectionStatus.textContent = "";
  updateReflectionButtons();
  if (play) {
    try {
      await reflectionVideo.play();
    } catch (error) {
      if (request === reflectionRequest && error.name !== "AbortError") {
        reflectionStatus.textContent = "Pulsa reproducir en el video para comenzar.";
      }
    }
  }
}

if (reflectionVideo && reflectionButtons.length) {
  reflectionButtons.forEach((button, index) => {
    button.addEventListener("click", () => selectReflection(index));
  });
  previousReflection.addEventListener("click", () => selectReflection(reflectionIndex - 1));
  nextReflection.addEventListener("click", () => selectReflection(reflectionIndex + 1));
  reflectionVideo.addEventListener("playing", () => {
    reflectionStatus.textContent = "";
  });
  reflectionVideo.addEventListener("error", () => {
    reflectionStatus.textContent = "No se pudo cargar el video. Comprueba que la carpeta assets/videos esté junto a la página.";
  });
  updateReflectionButtons();
}


/* LIGHTBOX DE GALERÍA */
const lightbox =
  document.getElementById("lightbox");

const lightboxImage =
  document.getElementById("lightboxImage");

const lightboxClose =
  document.getElementById("lightboxClose");

const galleryCards =
  document.querySelectorAll(".gallery-card");


galleryCards.forEach((card) => {

  card.addEventListener("click", () => {

    const image =
      card.dataset.image;

    if (!image) {
      return;
    }

    lightboxImage.src = image;

    lightbox.classList.add("active");

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

  });

});


function closeLightbox() {

  lightbox.classList.remove("active");

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  lightboxImage.src = "";

  document.body.style.overflow =
    "";

}


lightboxClose.addEventListener(
  "click",
  closeLightbox
);


lightbox.addEventListener(
  "click",
  (event) => {

    if (event.target === lightbox) {
      closeLightbox();
    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      lightbox.classList.contains("active")
    ) {
      closeLightbox();
    }

  }
);
