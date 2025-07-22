const container = document.getElementById('pokemon-container');
const searchInput = document.getElementById('search-input');
const searchCloseIcon = document.getElementById('search-close-icon');
const popup = document.getElementById('popup');
const popupDetails = document.getElementById('popup-details');
const closeBtn = document.getElementById('close-btn');
const notFoundMsg = document.getElementById('not-found-message');

let allPokemon = [];

async function fetchPokemon(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  return res.json();
}

async function loadPokemons() {
  for (let i = 1; i <= 100; i++) {
    const pokemon = await fetchPokemon(i);
    allPokemon.push(pokemon);
  }
  renderPokemon(allPokemon);
}

function renderPokemon(data) {
  container.innerHTML = "";
  if (data.length === 0) {
    notFoundMsg.style.display = "block";
    return;
  }
  notFoundMsg.style.display = "none";
  data.forEach(poke => {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
      <img src="${poke.sprites.front_default}" alt="${poke.name}" />
      <h3>#${poke.id.toString().padStart(3, '0')} ${poke.name}</h3>
    `;
    card.addEventListener('click', () => showPopup(poke));
    container.appendChild(card);
  });
}

function showPopup(poke) {
  popupDetails.innerHTML = `
    <h2>#${poke.id.toString().padStart(3, '0')} ${poke.name}</h2>
    <img src="${poke.sprites.front_default}" alt="${poke.name}" />
    <p><strong>Type:</strong> ${poke.types.map(t => t.type.name).join(', ')}</p>
    <p><strong>Height:</strong> ${poke.height}</p>
    <p><strong>Weight:</strong> ${poke.weight}</p>
  `;
  popup.style.display = 'flex';
}

closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

searchCloseIcon.addEventListener('click', () => {
  searchInput.value = '';
  renderPokemon(allPokemon);
});

searchInput.addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = allPokemon.filter(p => p.name.includes(value));
  renderPokemon(filtered);
});

document.querySelectorAll('input[name="sort"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const sortBy = document.querySelector('input[name="sort"]:checked').value;
    const sorted = [...allPokemon].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.id - b.id;
    });
    renderPokemon(sorted);
  });
});

loadPokemons();