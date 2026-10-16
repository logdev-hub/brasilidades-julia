/* Brasilidades — Localizador de lojas */
BR.ready(function () {
  const { $, esc, icon, norm } = BR;
  const stores = BR_DATA.stores;
  const ufSel = $('[data-store-uf]');
  [...new Set(stores.map((s) => s.uf))].sort().forEach((uf) => ufSel.insertAdjacentHTML('beforeend', `<option>${uf}</option>`));

  // Coordenadas aproximadas das capitais para ordenar por proximidade
  const COORDS = { SP: [-23.55, -46.63], RJ: [-22.91, -43.17], MG: [-19.92, -43.94], PR: [-25.43, -49.27], RS: [-30.03, -51.23], PE: [-8.05, -34.88], BA: [-12.97, -38.5], DF: [-15.79, -47.88], PA: [-1.45, -48.5] };
  let origin = null;
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  function render() {
    const q = norm($('[data-store-q]').value);
    const uf = ufSel.value;
    const spa = $('[data-store-spa]').checked;
    let list = stores.filter((s) => (!uf || s.uf === uf) && (!spa || s.spa) && (!q || norm(`${s.name} ${s.city} ${s.address} ${s.uf}`).includes(q)));
    if (origin) list = list.slice().sort((a, b) => dist(COORDS[a.uf] || [0, 0], origin) - dist(COORDS[b.uf] || [0, 0], origin));
    $('[data-store-count]').textContent = `${list.length} loja${list.length !== 1 ? 's' : ''} encontrada${list.length !== 1 ? 's' : ''}`;
    $('[data-store-list]').innerHTML = list.length ? list.map((s) => `
      <article class="store-card">
        <h3>${esc(s.name)}</h3>
        ${s.spa ? '<span class="tag tag--new" style="align-self:flex-start">Ritual de Pele</span>' : ''}
        <p>${icon('pin')}<span>${esc(s.address)}<br>${esc(s.city)} — ${s.uf}</span></p>
        <p>${icon('phone')}<a href="tel:${s.phone.replace(/\D/g, '')}">${esc(s.phone)}</a></p>
        <p>${icon('store')}<span>${esc(s.hours)}</span></p>
        <div class="store-card__actions">
          <a class="btn btn--primary btn--sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.address}, ${s.city} - ${s.uf}`)}">Como chegar</a>
          ${s.spa ? `<a class="btn btn--outline btn--sm" href="contato.html?assunto=ritual&loja=${s.id}">Agendar ritual</a>` : ''}
        </div>
      </article>`).join('')
      : `<div class="empty-state" style="grid-column:1/-1">${icon('pin', 'empty-state__icon')}<p>Nenhuma loja encontrada com esses filtros. Que tal comprar online e receber em casa?</p><a class="btn btn--primary" href="produtos.html">Comprar online</a></div>`;
  }

  $('[data-store-q]').addEventListener('input', BR.debounce(render, 150));
  ufSel.addEventListener('change', render);
  $('[data-store-spa]').addEventListener('change', render);
  $('[data-store-geo]').addEventListener('click', () => {
    const msg = $('[data-store-geo-msg]');
    if (!navigator.geolocation) { msg.textContent = 'Geolocalização não suportada neste navegador.'; return; }
    msg.textContent = 'Buscando sua localização…';
    navigator.geolocation.getCurrentPosition(
      (pos) => { origin = [pos.coords.latitude, pos.coords.longitude]; msg.textContent = 'Lojas ordenadas pela proximidade.'; render(); },
      () => { msg.textContent = 'Não foi possível obter sua localização.'; },
      { timeout: 8000 }
    );
  });
  render();
});
