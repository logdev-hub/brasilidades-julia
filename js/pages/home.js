/* Brasilidades — Página inicial */
BR.ready(function () {
  const { $, $$, catalog, carouselHTML, initCarousels, productImg, icon, esc } = BR;
  const all = catalog.all();
  const bySold = (a, b) => b.sold - a.sold;

  /* ---------- Banner rotativo ---------- */
  const hero = $('[data-hero]');
  if (hero) {
    const track = $('.hero__track', hero);
    const slides = $$('.hero__slide', hero);
    const dotsBox = $('.hero__dots', hero);
    const toggle = $('[data-hero-toggle]', hero);
    $('[data-hero-prev]', hero).innerHTML = icon('chevronLeft');
    $('[data-hero-next]', hero).innerHTML = icon('chevronRight');
    let i = 0, timer = null;
    let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    dotsBox.innerHTML = slides.map((_, n) => `<button class="hero__dot" role="tab" type="button" aria-label="Ir para o slide ${n + 1}"></button>`).join('');
    const dots = $$('.hero__dot', dotsBox);

    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      slides.forEach((s, k) => { s.setAttribute('aria-hidden', k !== i); s.querySelectorAll('a,button').forEach((a) => { a.tabIndex = k === i ? 0 : -1; }); });
      dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', k === i); });
    };
    const setPlay = (on) => {
      playing = on; clearInterval(timer);
      if (on) timer = setInterval(() => go(i + 1), 6000);
      toggle.innerHTML = icon(on ? 'pause' : 'play');
      toggle.setAttribute('aria-label', on ? 'Pausar' : 'Reproduzir');
    };
    dots.forEach((d, k) => d.addEventListener('click', () => { go(k); setPlay(playing); }));
    $('[data-hero-prev]', hero).addEventListener('click', () => { go(i - 1); setPlay(playing); });
    $('[data-hero-next]', hero).addEventListener('click', () => { go(i + 1); setPlay(playing); });
    toggle.addEventListener('click', () => setPlay(!playing));

    // Swipe no mobile
    let x0 = null;
    hero.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) { go(i + (dx < 0 ? 1 : -1)); setPlay(playing); }
      x0 = null;
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) clearInterval(timer); else setPlay(playing); });
    go(0); setPlay(playing);
  }

  /* ---------- Abas "O melhor do Brasil" ---------- */
  const tabFilters = {
    best: { list: () => all.filter((p) => p.tags.some((t) => t.includes('BEST-SELLER'))).sort(bySold), link: 'produtos.html?tag=best-seller' },
    sale: { list: () => all.filter(catalog.onSale), link: 'produtos.html?tag=promocao' },
    rosto: { list: () => all.filter((p) => p.cat === 'rosto').sort(bySold), link: 'produtos.html?cat=rosto' },
    cabelos: { list: () => all.filter((p) => p.cat === 'cabelos').sort(bySold), link: 'produtos.html?cat=cabelos' },
    'corpo-banho': { list: () => all.filter((p) => p.cat === 'corpo-banho').sort(bySold), link: 'produtos.html?cat=corpo-banho' },
    fragrancias: { list: () => all.filter((p) => p.cat === 'fragrancias').sort(bySold), link: 'produtos.html?cat=fragrancias' },
    refil: { list: () => all.filter((p) => p.cat === 'refil').sort(bySold), link: 'produtos.html?cat=refil' }
  };
  const panel = $('[data-home-tabpanel]');
  const tabLink = $('[data-tab-link]');
  const showTab = (key) => {
    $$('[data-home-tabs] .tab').forEach((t) => t.setAttribute('aria-selected', t.dataset.tab === key));
    const f = tabFilters[key];
    panel.innerHTML = carouselHTML(f.list().slice(0, 12), { label: 'Produtos em destaque' });
    tabLink.href = f.link;
    initCarousels(panel);
  };
  $$('[data-home-tabs] .tab').forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));
  showTab('best');

  /* ---------- Categorias ---------- */
  const catGrid = $('[data-cat-grid]');
  catGrid.innerHTML = BR_DATA.categories.map((c) => {
    const top = all.filter((p) => p.cat === c.id).sort(bySold)[0];
    return `<a class="cat-item" href="produtos.html?cat=${c.id}">
      <span class="cat-item__img" style="--c:${c.color}">${top ? `<img src="${productImg(top)}" alt="" loading="lazy">` : ''}</span>
      <span class="cat-item__name">${esc(c.short)}</span>
    </a>`;
  }).join('') + `<a class="cat-item" href="produtos.html?tag=best-seller"><span class="cat-item__img" style="--c:#F8AD3F"><img src="${productImg(catalog.get('BR040'))}" alt="" loading="lazy"></span><span class="cat-item__name">Best-Sellers</span></a>`;

  /* ---------- Novidades ---------- */
  const news = all.filter(catalog.isNew).sort((a, b) => b.date.localeCompare(a.date));
  $('[data-new-carousel]').innerHTML = carouselHTML(news, { label: 'Novidades' });

  /* ---------- Ingredientes ---------- */
  $('[data-ingredients]').innerHTML = BR_DATA.lines.slice(0, 12).map((l) => `
    <a class="ingredient" href="produtos.html?linha=${l.id}" style="--bg:${BR.mix(l.color, .82)}; --c:${l.color}">
      <span>${esc(l.origin)}</span><strong>${esc(l.name)}</strong>
    </a>`).join('');

  /* ---------- Vistos recentemente ---------- */
  const rec = BR.recent.list();
  if (rec.length) {
    $('[data-recent-section]').hidden = false;
    $('[data-recent-carousel]').innerHTML = carouselHTML(rec, { label: 'Vistos recentemente' });
  }
});
