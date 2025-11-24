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

// Datos de proyectos con TUS nombres reales
const PROJECTS = {
  parkfinder: {
    title: "ParkFinder — Publicar y reservar plazas",
    desc: "App móvil con mapa interactivo, reservas en tiempo real, publicación de plazas y sistema de usuarios.",
    images: [
      "assets/parkfinder1.jpg",
      "assets/parkfinder2.jpg",
      "assets/parkfinder3.jpg",
      "assets/parkfinder4.jpg"
    ],
    video: {
      type: "youtube",
      // YouTube Shorts embebido (forma correcta)
      src: "https://www.youtube.com/embed/lF0HVb0M7-M"
    }
  },

  plantadvisor: {
    title: "PlantAdvisor — Recomendador inteligente de plantas",
    desc: "App Android con cuestionario, recomendaciones, filtrado y sistema de favoritos.",
    images: [
      "assets/plantadvisor1.png",
      "assets/plantadvisor2.png",
      "assets/plantadvisor3.png"
    ],
    video: null
  }
};

function normalize(s){ return s.toLowerCase().trim(); }

function updateResults(){
  const q = normalize(input.value);
  let visible = 0;

  cards.forEach(card => {
    const tags = normalize(card.dataset.tags || "");
    const text = normalize(card.innerText);
    const match = q === "" || tags.includes(q) || text.includes(q);

    card.style.display = match ? "block" : "none";
    if(match) visible++;
  });

  empty.style.display = visible === 0 ? "block" : "none";
  count.textContent = `Aproximadamente ${visible} resultados`;
}

function openModal(projectId){
  const data = PROJECTS[projectId];
  if(!data) return;

  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;

  // Render gallery
  modalGallery.innerHTML = "";
  (data.images || []).forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = data.title;
    modalGallery.appendChild(img);
  });

  // Render video if any
  modalVideoWrap.innerHTML = "";
  if(data.video){
    if(data.video.type === "youtube"){
      const iframe = document.createElement("iframe");
      iframe.src = data.video.src;
      iframe.title = data.title;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      modalVideoWrap.appendChild(iframe);
    }
  }

  modalBackdrop.style.display = "flex";
  modalBackdrop.setAttribute("aria-hidden", "false");
}

function closeModal(){
  modalBackdrop.style.display = "none";
  modalBackdrop.setAttribute("aria-hidden", "true");
}

// Events
input.addEventListener("input", updateResults);
btnSearch.addEventListener("click", updateResults);

btnLucky.addEventListener("click", () => {
  const firstVisible = cards.find(c => c.style.display !== "none");
  if(firstVisible){
    openModal(firstVisible.dataset.id);
  }
});

cards.forEach(card => {
  card.addEventListener("click", () => openModal(card.dataset.id));
  card.addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " ") openModal(card.dataset.id);
  });
});

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if(e.target === modalBackdrop) closeModal();
});

window.addEventListener("load", updateResults);
