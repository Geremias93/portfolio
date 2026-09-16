const input = document.getElementById("searchInput");
const cards = Array.from(document.querySelectorAll(".result-card"));
const empty = document.getElementById("emptyState");
const count = document.getElementById("resultsCount");

const btnSearch = document.getElementById("btnSearch");
const btnLucky = document.getElementById("btnLucky");

// Modal elements
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalGallery = document.getElementById("modalGallery");
const modalVideoWrap = document.getElementById("modalVideoWrap");
const modalProjectLogo = document.getElementById("modalProjectLogo");

// Datos de proyectos
const PROJECTS = {

  parkfinder: {
    title: "ParkFinder — Publicar y reservar plazas",

    desc:
      "App móvil con mapa interactivo, reservas en tiempo real, publicación de plazas y sistema de usuarios.",

    // Logo de ParkFinder
    logo: "assets/logo_fondo_correcto (1).jpg",

    // Capturas en orden 7 → 1
    images: [
      "assets/parkfinder8.jpg"
      "assets/parkfinder7.jpg",
      "assets/parkfinder6.jpg",
      "assets/parkfinder5.jpg",
      "assets/parkfinder4.jpg",
      "assets/parkfinder3.jpg",
      "assets/parkfinder2.jpg",
      "assets/parkfinder1.jpg",
      "assets/parkfinder0.png"
    ],

    video: {
      type: "youtube",
      src: "https://www.youtube.com/embed/lF0HVb0M7-M"
    }
  },

  plantadvisor: {
    title: "PlantAdvisor — Recomendador inteligente de plantas",

    desc:
      "App Android con cuestionario, recomendaciones, filtrado y sistema de favoritos.",

    logo: null,

    images: [
      "assets/plantadvisor1.png",
      "assets/plantadvisor2.png",
      "assets/plantadvisor3.png"
    ],

    video: null
  },

  sobremi: {
    title: "Sobre mí — Desarrollador Junior Multiplataforma",

    desc:
      "Soy un desarrollador junior multiplataforma con base sólida en Java y experiencia creando apps completas. " +
      "También he trabajado con Python, C en Unity, JavaScript, HTML y CSS. " +
      "Busco mi primera oportunidad profesional y me motivan los proyectos con impacto real. " +
      "Vivo en Madrid pero puedo desplazarme y trabajar presencial, híbrido o remoto. " +
      "Inglés: entiendo bien documentación técnica, aunque hablo poco.",

    logo: null,

    images: [],

    video: null
  }
};


function normalize(s) {
  return (s || "").toLowerCase().trim();
}


function updateResults() {

  const q = normalize(input.value);

  let visible = 0;

  cards.forEach(card => {

    const tags = normalize(card.dataset.tags);
    const text = normalize(card.innerText);

    const match =
      q === "" ||
      tags.includes(q) ||
      text.includes(q);

    card.style.display = match ? "block" : "none";

    if (match) {
      visible++;
    }
  });

  empty.style.display =
    visible === 0 ? "block" : "none";

  count.textContent =
    `Aproximadamente ${visible} resultados`;
}


function openModal(projectId) {

  const data = PROJECTS[projectId];

  if (!data) return;


  // TÍTULO Y DESCRIPCIÓN
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;


  // =========================
  // LOGO DEL PROYECTO
  // =========================

  if (modalProjectLogo) {

    modalProjectLogo.innerHTML = "";

    if (data.logo) {

      const logo = document.createElement("img");

      logo.src = data.logo;
      logo.alt = `Logo de ${data.title}`;
      logo.classList.add("project-logo-img");

      modalProjectLogo.appendChild(logo);
    }
  }


  // =========================
  // VIDEO
  // =========================

  modalVideoWrap.innerHTML = "";

  if (
    data.video &&
    data.video.type === "youtube"
  ) {

    const iframe =
      document.createElement("iframe");

    iframe.src = data.video.src;
    iframe.title = data.title;

    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

    iframe.allowFullscreen = true;

    modalVideoWrap.appendChild(iframe);
  }


  // =========================
  // GALERÍA
  // =========================

  modalGallery.innerHTML = "";

  (data.images || []).forEach((src, index) => {

    const img =
      document.createElement("img");

    img.src = src;

    img.alt =
      `${data.title} - captura ${index + 1}`;

    img.loading = "lazy";

    modalGallery.appendChild(img);
  });


  // =========================
  // ABRIR MODAL
  // =========================

  modalBackdrop.style.display = "flex";

  modalBackdrop.setAttribute(
    "aria-hidden",
    "false"
  );


  // Volver arriba del modal
  const modalBox =
    modalBackdrop.querySelector(".modal");

  if (modalBox) {
    modalBox.scrollTop = 0;
  }
}


function closeModal() {

  modalBackdrop.style.display = "none";

  modalBackdrop.setAttribute(
    "aria-hidden",
    "true"
  );

  // Detiene el vídeo al cerrar
  modalVideoWrap.innerHTML = "";
}


// =========================
// EVENTOS
// =========================

input.addEventListener(
  "input",
  updateResults
);


btnSearch.addEventListener(
  "click",
  updateResults
);


btnLucky.addEventListener(
  "click",
  () => {

    const firstVisible =
      cards.find(
        card =>
          card.style.display !== "none"
      );

    if (firstVisible) {

      openModal(
        firstVisible.dataset.id
      );
    }
  }
);


cards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      openModal(
        card.dataset.id
      );
    }
  );


  card.addEventListener(
    "keydown",
    (e) => {

      if (
        e.key === "Enter" ||
        e.key === " "
      ) {

        e.preventDefault();

        openModal(
          card.dataset.id
        );
      }
    }
  );
});


modalClose.addEventListener(
  "click",
  closeModal
);


modalBackdrop.addEventListener(
  "click",
  (e) => {

    if (
      e.target === modalBackdrop
    ) {

      closeModal();
    }
  }
);


// ESC para cerrar
document.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Escape" &&
      modalBackdrop.style.display === "flex"
    ) {

      closeModal();
    }
  }
);


// Inicializar resultados
window.addEventListener(
  "load",
  updateResults
);
