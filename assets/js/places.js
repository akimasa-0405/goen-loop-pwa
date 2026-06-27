async function getPlaces(){
  try{
    const res = await fetch('./data/places.json', { cache: 'no-store' });
    if(!res.ok) throw new Error(`places.json ${res.status}`);
    return await res.json();
  }catch(error){
    console.error('Failed to load places:', error);
    const list = document.getElementById('places-list');
    if(list){
      list.innerHTML = `<p class="places-error">Places could not be loaded. Please refresh the page.</p>`;
    }
    return [];
  }
}

function lang(){
  return localStorage.getItem('goenLang') || (navigator.language?.startsWith('ja') ? 'ja' : 'en');
}

function label(place,key){
  const l = lang();
  return place[`${key}_${l}`] || place[`${key}_en`] || '';
}

function walkText(place){
  return lang() === 'ja'
    ? `MAME TO CHAから徒歩${place.walk}分`
    : `${place.walk} min walk from MAME TO CHA`;
}

function mapsUrl(place){
  return place.google_maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name_ja + ' 鎌倉')}`;
}

async function renderList(filter='all'){
  const list = document.getElementById('places-list');
  document.querySelector('.places-section')?.classList.add('show');
  if(!list) return;

  list.innerHTML = '<p class="places-loading">Loading places...</p>';
  const places = await getPlaces();
  list.innerHTML = '';

  const filtered = places.filter(p => filter === 'all' || p.type === filter);

  if(filtered.length === 0){
    list.innerHTML = '<p class="places-error">No places found.</p>';
    return;
  }

  filtered.forEach(p => {
    const a = document.createElement('a');
    a.className = 'place-card';
    a.href = `place.html?id=${p.id}`;
    a.innerHTML = `
      <div>
        <h3>${label(p,'name')}</h3>
        <div class="meta">${walkText(p)} ・ ${label(p,'theme')}</div>
        <p>${label(p,'description')}</p>
      </div>
      <div class="arrow">→</div>
    `;
    list.appendChild(a);
  });
}

async function renderDetail(){
  const title = document.getElementById('place-title');
  if(!title) return;

  const id = new URLSearchParams(location.search).get('id');
  const places = await getPlaces();
  const p = places.find(x => x.id === id) || places[0];
  if(!p) return;

  document.title = `${label(p,'name')} | GOEN LOOP`;

  const type = document.getElementById('place-type');
  if (type) type.textContent = p.type;

  title.textContent = label(p,'name');

  const japanese = document.getElementById('place-japanese');
  if (japanese) japanese.textContent = p.name_ja;

  const walk = document.getElementById('place-walk');
  if (walk) walk.textContent = walkText(p);

  const description = document.getElementById('place-description');
  if (description) description.textContent = label(p,'description');

  const theme = document.getElementById('place-theme');
  if (theme) theme.textContent = label(p,'theme');

  const link = document.getElementById('place-map');
  if (link) {
    link.href = mapsUrl(p);
    link.textContent = lang() === 'ja' ? 'Google Mapsで開く' : 'Open in Google Maps';
  }
}

document.querySelectorAll('.filter-tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderList(btn.dataset.filter);
  });
});

window.addEventListener('languagechange', () => {
  renderList(document.querySelector('.filter-tabs button.active')?.dataset.filter || 'all');
  renderDetail();
});

renderList();
renderDetail();
