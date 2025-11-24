const input = document.getElementById("searchInput");
const cards = Array.from(document.querySelectorAll(".result-card"));
const empty = document.getElementById("emptyState");
const count = document.getElementById("resultsCount");

function normalize(s){
  return s.toLowerCase().trim();
}

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

input.addEventListener("input", updateResults);
window.addEventListener("load", updateResults);
