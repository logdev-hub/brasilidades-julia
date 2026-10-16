/* Brasilidades — Catálogo (listagem, filtros, ordenação e busca) */
BR.ready(function () {
  const { $, $$, catalog, productCard, icon, esc, norm, money } = BR;
  const PAGE = 12;
  const all = catalog.all();

  const TAGS = {
    promocao: { label: 'Promoções', test: (p) => catalog.onSale(p) },
    'best-seller': { label: 'Best-Sellers', test: (p) => p.tags.some((t) => t.includes('BEST-SELLER')) },
    novidade: { label: 'Novidades', test: (p) => p.tags.includes('NOVIDADE') },
    'edicao-limitada': { label: 'Edição Limitada', test: (p) => p.tags.includes('EDIÇÃO LIMITADA') },
    'travel-size': { label: 'Travel Size', test: (p) => p.tags.includes('TRAVEL SIZE') },
    presente: { label: 'Presente Favorito', test: (p) => p.tags.includes('PRESENTE FAVORITO') }
  };
  const PRICES = {
    'ate-100': { label: 'Até R$ 100', test: (v) => v <= 100 },
    '100-200': { label: 'R$ 100 a R$ 200', test: (v) => v > 100 && v <= 200 },
    '200-300': { label: 'R$ 200 a R$ 300', test: (v) => v > 200 && v <= 300 },
    'acima-300': { label: 'Acima de R$ 300', test: (v) => v > 300 }
  };
  const list = (k) => { const v = BR.param(k); return v ? v.split(',').filter(Boolean) : []; };

  const state = {
    q: BR.param('q') || '',
    cat: list('cat'), sub: list('sub'), linha: list('linha'), family: list('familia'),
    tag: list('tag'), price: list('preco'), rating: BR.param('nota') === '4' ? ['4'] : [],
    sort: BR.param('sort') || 'relevancia', shown: PAGE
  };

  /* ---------- Cabeçalho da listagem ---------- */
  function renderHero() {
    const hero = $('[data-plp-hero]');
    const cat = state.cat.length === 1 ? catalog.cat(state.cat[0]) : null;
    const line = state.linha.length === 1 ? catalog.line(state.linha[0]) : null;
    const tag = state.tag.length === 1 ? TAGS[state.tag[0]] : null;
    let title = 'Todos os produtos', desc = 'Cosmética natural com ingredientes da biodiversidade brasileira.', color = '#FBF9F6', fg = '#231819', accent = '#FFB175';
    if (state.q) { title = `Resultados para “${state.q}”`; desc = ''; }
    else if (line && !cat) { title = line.name; desc = line.story; color = BR.mix(line.color, .8); accent = line.color; }
    else if (cat) {
      title = state.sub.length === 1 ? state.sub[0] : cat.name;
      desc = `Descubra nossa seleção de ${cat.name.toLowerCase()} feita com ingredientes brasileiros.`;
      color = BR.mix(cat.color, .82); accent = cat.color;
      if (line) title += ` · ${line.name}`;
    } else if (tag) { title = tag.label; desc = state.tag[0] === 'promocao' ? 'Ofertas especiais por tempo limitado. Aproveite!' : desc; if (state.tag[0] === 'promocao') { color = '#91241E'; fg = '#fff'; accent = '#F25071'; } }
    hero.style.setProperty('--bg', color); hero.style.setProperty('--fg', fg);
    $('[data-plp-title]').textContent = title;
    $('[data-plp-desc]').textContent = desc;
    $('[data-plp-deco]').innerHTML = `<svg viewBox="0 0 200 200"><circle cx="120" cy="80" r="80" fill="${accent}" opacity=".45"/><circle cx="40" cy="150" r="24" fill="${accent}" opacity=".35"/></svg>`;
    document.title = `${title} | Brasilidades`;
    const crumbs = [['Início', 'index.html']];
    if (cat) crumbs.push([cat.name, `produtos.html?cat=${cat.id}`]);
    if (state.sub.length === 1 && cat) crumbs.push([state.sub[0], '']);
    else if (!cat) crumbs.push([title, '']);
    $('[data-breadcrumb]').innerHTML = crumbs.map(([t, h], i) => `<li>${h && i < crumbs.length - 1 ? `<a href="${h}">${esc(t)}</a>` : esc(t)}</li>`).join('');
    // Atalhos de subcategoria
    $('[data-plp-subnav]').innerHTML = cat ? cat.subs.map((s) => `<a class="chip ${state.sub.includes(s) ? 'is-active' : ''}" href="produtos.html?cat=${cat.id}&sub=${encodeURIComponent(s)}">${esc(s)}</a>`).join('') : '';
  }

  /* ---------- Filtragem ---------- */
  const priceOf = (p) => p.sizes[0].price;
  function base() { return state.q ? catalog.search(state.q) : all; }
  function apply(products, skip) {
    return products.filter((p) =>
      (skip === 'cat' || !state.cat.length || state.cat.includes(p.cat)) &&
      (skip === 'sub' || !state.sub.length || state.sub.includes(p.sub)) &&
      (skip === 'linha' || !state.linha.length || state.linha.includes(p.line)) &&
      (skip === 'family' || !state.family.length || state.family.includes(p.family)) &&
      (skip === 'tag' || !state.tag.length || state.tag.every((t) => TAGS[t] && TAGS[t].test(p))) &&
      (skip === 'price' || !state.price.length || state.price.some((r) => PRICES[r] && PRICES[r].test(priceOf(p)))) &&
      (skip === 'rating' || !state.rating.length || p.rating >= 4.5)
    );
  }
  const SORTS = {
    relevancia: (a, b) => (b.sold * b.rating) - (a.sold * a.rating),
    'mais-vendidos': (a, b) => b.sold - a.sold,
    novidades: (a, b) => b.date.localeCompare(a.date),
    'menor-preco': (a, b) => priceOf(a) - priceOf(b),
    'maior-preco': (a, b) => priceOf(b) - priceOf(a),
    desconto: (a, b) => catalog.discount(b.sizes[0]) - catalog.discount(a.sizes[0]),
    avaliacao: (a, b) => b.rating - a.rating || b.reviews - a.reviews
  };

  /* ---------- Painel de filtros ---------- */
  function group(key, title, options, open = true) {
    if (!options.length) return '';
    return `<details class="filter-group" ${open ? 'open' : ''}><summary>${title}${icon('chevronDown')}</summary><div class="filter-group__body">
      ${options.map((o) => `<label class="check"><input type="checkbox" data-filter="${key}" value="${esc(o.value)}" ${state[key].includes(o.value) ? 'checked' : ''}><span>${o.dot ? `<i class="dot" style="--c:${o.dot}"></i>` : ''}${esc(o.label)}</span><small>${o.count}</small></label>`).join('')}
    </div></details>`;
  }
  function counts(key, values, fn) {
    const pool = apply(base(), key);
    return values.map((v) => ({ ...v, count: pool.filter((p) => fn(p, v.value)).length })).filter((o) => o.count > 0 || state[key].includes(o.value));
  }
  function renderFilters() {
    const cats = counts('cat', BR_DATA.categories.map((c) => ({ value: c.id, label: c.name })), (p, v) => p.cat === v);
    const subsSrc = (state.cat.length ? BR_DATA.categories.filter((c) => state.cat.includes(c.id)) : []).flatMap((c) => c.subs);
    const subs = counts('sub', subsSrc.map((s) => ({ value: s, label: s })), (p, v) => p.sub === v);
    const lines = counts('linha', BR_DATA.lines.map((l) => ({ value: l.id, label: l.name, dot: l.color })), (p, v) => p.line === v);
    const fams = counts('family', [...new Set(all.map((p) => p.family).filter(Boolean))].map((f) => ({ value: f, label: f })), (p, v) => p.family === v);
    const tags = counts('tag', Object.entries(TAGS).map(([k, t]) => ({ value: k, label: t.label })), (p, v) => TAGS[v].test(p));
    const prices = counts('price', Object.entries(PRICES).map(([k, t]) => ({ value: k, label: t.label })), (p, v) => PRICES[v].test(priceOf(p)));
    const rating = counts('rating', [{ value: '4', label: '★ 4,5 ou mais' }], (p) => p.rating >= 4.5);
    $('[data-filters]').innerHTML =
      group('cat', 'Categoria', cats) + group('sub', 'Tipo de produto', subs) + group('linha', 'Linha', lines, !state.cat.length || state.linha.length > 0) +
      group('family', 'Família olfativa', fams, state.family.length > 0 || state.cat.includes('fragrancias')) +
      group('tag', 'Destaques', tags) + group('price', 'Faixa de preço', prices) + group('rating', 'Avaliação', rating, false);
  }

  function renderActive() {
    const chips = [];
    const add = (key, value, label) => chips.push(`<button class="chip" type="button" data-unfilter="${key}" data-value="${esc(value)}">${esc(label)} ${icon('close')}</button>`);
    if (state.q) chips.push(`<button class="chip" type="button" data-unfilter="q">Busca: ${esc(state.q)} ${icon('close')}</button>`);
    state.cat.forEach((v) => add('cat', v, catalog.cat(v) ? catalog.cat(v).name : v));
    state.sub.forEach((v) => add('sub', v, v));
    state.linha.forEach((v) => add('linha', v, catalog.line(v).name));
    state.family.forEach((v) => add('family', v, v));
    state.tag.forEach((v) => add('tag', v, TAGS[v] ? TAGS[v].label : v));
    state.price.forEach((v) => add('price', v, PRICES[v] ? PRICES[v].label : v));
    state.rating.forEach((v) => add('rating', v, 'Nota 4,5+'));
    if (chips.length > 1) chips.push(`<button class="chip" type="button" data-clear-filters>Limpar tudo</button>`);
    $('[data-active-filters]').innerHTML = chips.join('');
  }

  function render() {
    const result = apply(base()).sort(SORTS[state.sort] || SORTS.relevancia);
    const shown = result.slice(0, state.shown);
    $('[data-count]').textContent = `${result.length} produto${result.length !== 1 ? 's' : ''}`;
    $('[data-grid]').innerHTML = shown.length ? shown.map(productCard).join('') : '';
    if (!result.length) {
      $('[data-grid]').innerHTML = `<div class="empty-state" style="grid-column:1/-1">${icon('search', 'empty-state__icon')}<h2>Nenhum produto encontrado</h2><p>Tente remover alguns filtros ou buscar por outro termo.</p><div class="empty-state__links">${BR_DATA.popularSearches.slice(0, 5).map((s) => `<a class="chip" href="produtos.html?q=${encodeURIComponent(s)}">${esc(s)}</a>`).join('')}</div><button class="btn btn--outline" data-clear-filters>Limpar filtros</button></div>`;
    }
    const lm = $('[data-load-more]');
    lm.innerHTML = result.length > shown.length
      ? `<span>Você viu ${shown.length} de ${result.length} produtos</span><div class="load-more__bar"><span style="width:${(shown.length / result.length) * 100}%"></span></div><button class="btn btn--outline" type="button" data-more>Carregar mais</button>`
      : (result.length > PAGE ? `<span>Você viu todos os ${result.length} produtos</span>` : '');
    $('[data-sort]').value = state.sort;
    renderHero(); renderFilters(); renderActive(); syncURL();
  }

  function syncURL() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    [['cat', 'cat'], ['sub', 'sub'], ['linha', 'linha'], ['family', 'familia'], ['tag', 'tag'], ['price', 'preco']].forEach(([k, n]) => { if (state[k].length) p.set(n, state[k].join(',')); });
    if (state.rating.length) p.set('nota', '4');
    if (state.sort !== 'relevancia') p.set('sort', state.sort);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  /* ---------- Eventos ---------- */
  document.addEventListener('change', (e) => {
    const f = e.target.closest('[data-filter]');
    if (f) {
      const k = f.dataset.filter;
      state[k] = f.checked ? [...state[k], f.value] : state[k].filter((v) => v !== f.value);
      if (k === 'cat' && !f.checked) state.sub = [];
      state.shown = PAGE; render();
    }
    if (e.target.matches('[data-sort]')) { state.sort = e.target.value; state.shown = PAGE; render(); }
  });
  document.addEventListener('click', (e) => {
    const un = e.target.closest('[data-unfilter]');
    if (un) {
      const k = un.dataset.unfilter;
      if (k === 'q') state.q = ''; else state[k] = state[k].filter((v) => v !== un.dataset.value);
      state.shown = PAGE; render(); return;
    }
    if (e.target.closest('[data-clear-filters]')) {
      Object.assign(state, { q: '', cat: [], sub: [], linha: [], family: [], tag: [], price: [], rating: [], shown: PAGE });
      render(); return;
    }
    if (e.target.closest('[data-more]')) { state.shown += PAGE; render(); return; }
    if (e.target.closest('[data-open-filters]')) { $('#filters').classList.add('is-open'); BR.lockScroll(true); return; }
    if (e.target.closest('[data-close-filters]') || e.target === $('#filters')) {
      if ($('#filters').classList.contains('is-open')) { $('#filters').classList.remove('is-open'); BR.lockScroll(false); }
    }
  });
  $$('[data-close-filters]').forEach((b) => { if (!b.textContent.trim()) b.innerHTML = icon('close'); });
  const hq = $('#hdr-q'); if (hq && state.q) hq.value = state.q;

  render();
});
