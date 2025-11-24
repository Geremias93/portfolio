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

// Datos de proyectos (aquí metes tus capturas/vídeos)
const PROJECTS = {
  parkfinder: {
    title: "ParkFinder — Publicar y reservar plazas",
    desc: "App móvil con mapa interactivo, reservas en tiempo real, publicación de plazas y sistema de usuarios.",
    images: [
      "assets/parkfinder1.png",
      "assets/parkfinder2.png",
      "assets/parkfinder3.png"
    ],
    // puedes poner video mp4 local o un iframe de youtube
    video: {
      type: "mp4",
      src: "assets/parkfinder-demo.mp4"
      // type: "youtube", src:"https://www.youtube.com/embed/XXXXX"
    }
  },
  plantadvisor: {
    title: "PlantAdvisor — Recomendador inteligente de plantas",
    desc: "App Android con cuestionario, recomendaciones, filtrado y favoritos.",
    images: [
      "assets/plantadvisor1.png",
      "assets/plantadvisor2.png"
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
    if(data.video.type === "mp4"){
      const v = document.createElement("video");
      v.src = data.video.src;
      v.controls = true;
      v.playsInline = true;
      modalVideoWrap.appendChild(v);
    } else if(data.video.type === "youtube"){
      const iframe = document.createElement("iframe");
      iframe.src = data.video.src;
      iframe.title = data.title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
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
