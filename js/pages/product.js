/* Brasilidades — Página de produto */
BR.ready(function () {
  const { $, $$, catalog, money, esc, icon, stars, tagsHTML, priceHTML, installments, productImg, carouselHTML, initCarousels, store } = BR;
  const p = catalog.get(BR.param('id'));
  const host = $('[data-pdp]');

  if (!p) {
    host.innerHTML = `<div class="notfound"><strong>404</strong><h1>Produto não encontrado</h1><p class="muted">O produto que você procura pode ter saído de linha ou o link está incorreto.</p><a class="btn btn--primary" href="produtos.html">Ver todos os produtos</a></div>`;
    ['[data-story-section]', '[data-reviews-section]', '[data-related-section]'].forEach((s) => { $(s).hidden = true; });
    return;
  }

  BR.recent.add(p.id);
  const L = catalog.line(p.line);
  const C = catalog.cat(p.cat);
  let size = p.sizes[0].label;
  let qty = 1;
  document.title = `${p.name} | Brasilidades`;
  const metaDesc = document.querySelector('meta[name=description]'); if (metaDesc) metaDesc.content = p.desc;

  /* ---------- Breadcrumb ---------- */
  $('[data-breadcrumb]').innerHTML = `<li><a href="index.html">Início</a></li><li><a href="produtos.html?cat=${C.id}">${esc(C.name)}</a></li><li><a href="produtos.html?cat=${C.id}&sub=${encodeURIComponent(p.sub)}">${esc(p.sub)}</a></li><li>${esc(p.name)}</li>`;

  /* ---------- Conteúdo ---------- */
  const BENEFITS = {
    'corpo-banho': ['Hidratação prolongada', 'Pele macia e perfumada', 'Absorção rápida, sem sensação pegajosa'],
    fragrancias: ['Alta fixação na pele', 'Notas naturais e sofisticadas', 'Frasco reciclável'],
    rosto: ['Testado dermatologicamente', 'Para todos os tipos de pele', 'Resultados visíveis em 4 semanas'],
    cabelos: ['Fios mais fortes e brilhantes', 'Sem sulfatos agressivos', 'Livre de silicones não solúveis'],
    maos: ['Proteção contra o ressecamento', 'Não deixa as mãos oleosas', 'Perfume delicado e duradouro'],
    casa: ['Perfuma por semanas', 'Cera e óleos de origem vegetal', 'Ideal para presentear'],
    homem: ['Sensação de frescor imediato', 'Fórmula sem álcool', 'Perfume amadeirado-aromático'],
    presentes: ['Embalagem pronta para presente', 'Cartão personalizado gratuito', 'Seleção de best-sellers'],
    refil: ['Até 85% menos plástico', 'Mesma fórmula do original', 'Economia de até 15%']
  };
  const v = () => catalog.variant(p, size);
  const images = [productImg(p), productImg(p, true), BR.productPhoto(p)];

  host.innerHTML = `
  <div class="pdp">
    <div class="gallery">
      <div class="gallery__thumbs" role="tablist" aria-label="Imagens do produto">
        ${images.map((src, i) => `<button class="gallery__thumb ${i === 0 ? 'is-active' : ''}" type="button" data-thumb="${i}" aria-label="Imagem ${i + 1}"><img src="${src}" alt=""></button>`).join('')}
      </div>
      <div class="gallery__main" data-zoom>
        <div class="product-card__tags" data-pdp-tags>${tagsHTML(p, v())}</div>
        <img src="${images[0]}" alt="${esc(p.name)}" data-main-img>
      </div>
    </div>

    <div class="pdp-info">
      <a class="pdp-info__line" href="produtos.html?linha=${L.id}"><span class="dot" style="--c:${L.color}"></span>${esc(L.name)}</a>
      <h1>${esc(p.name)}</h1>
      <div class="pdp-info__rating">${stars(p.rating)} <strong>${p.rating.toFixed(1)}</strong> <a href="#avaliacoes">${p.reviews} avaliações</a> <span class="muted">· ${p.sold}+ vendidos</span></div>
      <p class="pdp-info__desc">${esc(p.desc)}</p>

      ${p.sizes.length > 1 ? `<div><p class="label" style="margin-bottom:8px">Tamanho</p><div class="sizes" role="radiogroup" aria-label="Tamanho">
        ${p.sizes.map((s) => `<button class="size-opt" type="button" role="radio" aria-checked="${s.label === size}" data-size-opt="${esc(s.label)}">${esc(s.label)}<small>${money(s.price)}</small></button>`).join('')}
      </div></div>` : `<p class="muted" style="margin:0">Tamanho: <strong>${esc(size)}</strong></p>`}

      <div data-price-box></div>

      <p class="stock-note ${p.sold % 7 === 0 ? 'stock-note--low' : ''}">${icon('check')} ${p.sold % 7 === 0 ? 'Últimas unidades em estoque!' : 'Em estoque · envio em até 24h'}</p>

      <div class="pdp-buy" data-buy>
        <div class="qty qty--lg" data-qty>
          <button type="button" data-qty-minus aria-label="Diminuir quantidade">${icon('minus')}</button>
          <input type="number" min="1" max="10" value="1" aria-label="Quantidade" data-qty-input data-pdp-qty>
          <button type="button" data-qty-plus aria-label="Aumentar quantidade">${icon('plus')}</button>
        </div>
        <button class="btn btn--primary btn--lg" type="button" data-pdp-add>${icon('bag')} Adicionar à sacola</button>
        <button class="wish-btn ${BR.wishlist.has(p.id) ? 'is-active' : ''}" type="button" data-wish="${p.id}" aria-pressed="${BR.wishlist.has(p.id)}" aria-label="Favoritar">${icon('heart')}</button>
      </div>

      <div class="pdp-ship">
        <p class="label" style="margin-bottom:8px">${icon('truck')} Calcule o frete e o prazo</p>
        <form data-pdp-ship>
          <label class="sr-only" for="pdp-cep">CEP</label>
          <input id="pdp-cep" name="cep" placeholder="00000-000" data-mask="cep" inputmode="numeric" value="${esc((store.get('shipping', {}) || {}).cep || '')}">
          <button class="btn btn--dark btn--sm" type="submit">Calcular</button>
        </form>
        <div class="pdp-ship__results" data-ship-results></div>
        <a class="link" style="font-size:12px;margin-top:8px" href="https://buscacepinter.correios.com.br/" target="_blank" rel="noopener">Não sei meu CEP</a>
      </div>

      <div class="pdp-perks">
        <div>${icon('truck')}Frete grátis acima de ${money(BR.FREE_SHIPPING)}</div>
        <div>${icon('sample')}3 amostras grátis em todo pedido</div>
        <div>${icon('box')}Troca grátis em até 30 dias</div>
      </div>

      <div class="accordion">
        <details open><summary>Descrição${icon('plus')}</summary><div class="accordion__body"><p>${esc(p.desc)}</p><p>${esc(L.story)}</p></div></details>
        <details><summary>Benefícios${icon('plus')}</summary><div class="accordion__body"><ul>${(BENEFITS[p.cat] || []).map((b) => `<li>${esc(b)}</li>`).join('')}<li>Com ${esc(L.ingredient)} de ${esc(L.origin)}</li></ul></div></details>
        <details><summary>Modo de uso${icon('plus')}</summary><div class="accordion__body"><p>${esc(p.use)}</p></div></details>
        <details><summary>Ingredientes${icon('plus')}</summary><div class="accordion__body"><p><strong>Ativo principal:</strong> ${esc(L.ingredient)} (${esc(L.origin)}).</p><p>Aqua, Glycerin, Caprylic/Capric Triglyceride, ${esc(L.ingredient)} Extract, Cetearyl Alcohol, Parfum, Tocopherol, Sodium Benzoate, Citric Acid. <em>Lista ilustrativa — consulte a embalagem.</em></p></div></details>
        <details><summary>Sustentabilidade${icon('plus')}</summary><div class="accordion__body"><ul><li>Fórmula vegana e não testada em animais</li><li>Embalagem reciclável${p.cat === 'refil' ? ' com 85% menos plástico' : ''}</li><li>Ingrediente de comércio justo com comunidades locais</li></ul></div></details>
      </div>
    </div>
  </div>`;

  /* ---------- Preço / variação ---------- */
  function renderPrice() {
    const cur = v();
    const inst = installments(cur.price);
    $('[data-price-box]').innerHTML = `${priceHTML(cur, true)}
      <div class="pdp-info__payments">
        ${inst.n > 1 ? `<span>ou <strong>${inst.n}x de ${money(inst.value)}</strong> sem juros no cartão</span>` : ''}
        <span class="pix">${money(cur.price * (1 - BR.PIX_DISCOUNT))} no Pix (5% de desconto)</span>
      </div>`;
    $('[data-pdp-tags]').innerHTML = tagsHTML(p, cur);
    renderSticky();
  }
  host.addEventListener('click', (e) => {
    const s = e.target.closest('[data-size-opt]');
    if (s) {
      size = s.dataset.sizeOpt;
      $$('[data-size-opt]').forEach((b) => b.setAttribute('aria-checked', b === s));
      renderPrice();
    }
    const t = e.target.closest('[data-thumb]');
    if (t) {
      $('[data-main-img]').src = images[+t.dataset.thumb];
      $$('[data-thumb]').forEach((b) => b.classList.toggle('is-active', b === t));
    }
    if (e.target.closest('[data-pdp-add]')) {
      qty = Math.max(1, Math.min(10, +$('[data-pdp-qty]').value || 1));
      BR.addToCart(p.id, size, qty);
    }
  });

  /* Zoom da imagem */
  const zoom = $('[data-zoom]');
  zoom.addEventListener('mousemove', (e) => {
    const r = zoom.getBoundingClientRect();
    zoom.style.setProperty('--zx', ((e.clientX - r.left) / r.width) * 100 + '%');
    zoom.style.setProperty('--zy', ((e.clientY - r.top) / r.height) * 100 + '%');
  });
  zoom.addEventListener('click', () => zoom.classList.toggle('is-zoom'));
  zoom.addEventListener('mouseleave', () => zoom.classList.remove('is-zoom'));

  /* Frete */
  $('[data-pdp-ship]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = e.target.elements.namedItem('cep');
    const box = $('[data-ship-results]');
    if (!BR.validate.cep(input.value)) { BR.fieldError(input, 'Informe um CEP válido.'); return; }
    BR.fieldError(input, '');
    box.innerHTML = '<p class="muted">Calculando…</p>';
    const addr = await BR.lookupCEP(input.value);
    const opts = BR.shippingOptions(input.value, v().price * (+$('[data-pdp-qty]').value || 1));
    box.innerHTML = (addr ? `<p class="muted" style="margin:0 0 4px">${esc(addr.logradouro || '')} ${addr.bairro ? '— ' + esc(addr.bairro) : ''}, ${esc(addr.localidade)}/${esc(addr.uf)}</p>` : '') +
      opts.map((o) => `<div class="ship-opt"><span>${esc(o.name)}<br><small class="muted">${esc(o.days)}</small></span><strong class="${o.price ? '' : 'free'}">${o.price ? money(o.price) : 'Grátis'}</strong></div>`).join('') +
      `<p class="muted" style="font-size:12px;margin:4px 0 0">Frete grátis na entrega econômica para compras acima de ${money(BR.FREE_SHIPPING)}.</p>`;
  });

  /* Barra fixa de compra (mobile/scroll) */
  const sticky = $('[data-sticky-buy]');
  function renderSticky() {
    sticky.innerHTML = `<img src="${images[0]}" alt=""><div class="sticky-buy__info"><strong>${esc(p.name)}</strong>${priceHTML(v())}</div><button class="btn btn--primary" type="button" data-add="${p.id}" data-size="${esc(size)}">${icon('bag')} Adicionar</button>`;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      const show = !en.isIntersecting && en.boundingClientRect.top < 0;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', !show);
    }).observe($('[data-buy]'));
  }
  renderPrice();

  /* ---------- História da linha ---------- */
  $('[data-story]').innerHTML = `<div class="line-story" style="--bg:${BR.mix(L.color, .85)}">
    <div class="line-story__art"><img src="${productImg(p, true)}" alt="${esc(L.ingredient)}"></div>
    <div class="line-story__body">
      <p class="eyebrow">A origem · ${esc(L.origin)}</p>
      <h2>${esc(L.ingredient)}</h2>
      <p class="muted">${esc(L.story)}</p>
      <a class="btn btn--outline" href="produtos.html?linha=${L.id}">Ver linha ${esc(L.name)}</a>
    </div>
  </div>`;

  /* ---------- Avaliações ---------- */
  const NAMES = ['Ana P.', 'Juliana M.', 'Carla S.', 'Mariana R.', 'Fernanda L.', 'Patrícia O.', 'Rafael T.', 'Beatriz C.', 'Luiza A.', 'Camila F.'];
  const TEXTS = [
    ['Simplesmente apaixonada', 'O perfume é maravilhoso e a textura é muito agradável. Já estou no segundo frasco!'],
    ['Superou as expectativas', 'Chegou rápido, bem embalado e com as amostras. A qualidade é excelente.'],
    ['Vale cada centavo', 'Rende bastante e o resultado aparece logo nos primeiros dias de uso.'],
    ['Comprei para presentear', 'A pessoa amou! Embalagem linda e produto de qualidade.'],
    ['Muito bom', 'Gostei bastante, só achei que poderia ter um tamanho maior disponível.'],
    ['Cheiro de Brasil', 'Me lembra a casa da minha avó no interior. Fixação muito boa.']
  ];
  let seed = [...p.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const seeded = Array.from({ length: 5 }, (_, i) => {
    const tx = TEXTS[Math.floor(rnd() * TEXTS.length)];
    const d = new Date(); d.setDate(d.getDate() - Math.floor(rnd() * 120) - i * 7);
    return { name: NAMES[Math.floor(rnd() * NAMES.length)], rating: rnd() > 0.2 ? 5 : 4, title: tx[0], text: tx[1], date: d.toISOString() };
  });
  const userReviews = () => store.get('reviews', {})[p.id] || [];

  function renderReviews() {
    const mine = userReviews();
    const list = [...mine, ...seeded];
    const total = p.reviews + mine.length;
    const avg = (p.rating * p.reviews + mine.reduce((s, r) => s + r.rating, 0)) / total;
    const share = [Math.round(avg >= 4.7 ? 82 : 70), 0, 0, 0, 0];
    share[1] = Math.round((100 - share[0]) * 0.65); share[2] = Math.round((100 - share[0]) * 0.2); share[3] = Math.round((100 - share[0]) * 0.1); share[4] = 100 - share[0] - share[1] - share[2] - share[3];
    $('[data-reviews]').innerHTML = `
      <div class="reviews__score">
        <strong>${avg.toFixed(1)}</strong>${stars(avg)}<p class="muted" style="margin:8px 0 0">${total} avaliações</p>
        <div class="dist">${share.map((s, i) => `<div class="dist__row"><span>${5 - i}★</span><div class="dist__bar"><span style="width:${s}%"></span></div><span>${s}%</span></div>`).join('')}</div>
        <p style="font-size:13px" class="muted">${Math.round((share[0] + share[1]))}% recomendam este produto</p>
        <button class="btn btn--outline btn--block" type="button" data-write-review>Escrever avaliação</button>
      </div>
      <div>${list.map((r) => `<article class="review">
        <div class="review__head"><span class="review__author">${esc(r.name)}<small>${icon('check')} Compra verificada</small></span><span class="review__date">${new Date(r.date).toLocaleDateString('pt-BR')}</span></div>
        ${stars(r.rating)}<p class="review__title">${esc(r.title)}</p><p>${esc(r.text)}</p>
      </article>`).join('')}</div>`;
  }
  renderReviews();

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-write-review]')) return;
    const u = BR.auth.current();
    const m = BR.openModal(`<h3 class="modal__title">Avaliar produto</h3><p class="modal__text">${esc(p.name)}</p>
      <form data-review-form novalidate>
        <p class="label">Sua nota</p>
        <div class="star-input" style="margin-bottom:16px">${[5, 4, 3, 2, 1].map((n) => `<input type="radio" name="rating" id="st${n}" value="${n}" ${n === 5 ? 'checked' : ''}><label for="st${n}" title="${n} estrela${n > 1 ? 's' : ''}">★</label>`).join('')}</div>
        <div class="field"><label for="rv-name">Nome</label><input id="rv-name" name="rname" value="${esc(u ? u.name : '')}" required></div>
        <div class="field"><label for="rv-title">Título</label><input id="rv-title" name="title" required maxlength="80"></div>
        <div class="field"><label for="rv-text">Comentário</label><textarea id="rv-text" name="text" required maxlength="800"></textarea></div>
        <button class="btn btn--primary btn--block" type="submit">Enviar avaliação</button>
      </form>`);
    $('[data-review-form]', m.el).addEventListener('submit', (ev) => {
      ev.preventDefault();
      const f = ev.target, el = (n) => f.elements.namedItem(n);
      let ok = true;
      ok = BR.fieldError(el('rname'), el('rname').value.trim().length < 2 ? 'Informe seu nome.' : '') && ok;
      ok = BR.fieldError(el('title'), el('title').value.trim().length < 3 ? 'Informe um título.' : '') && ok;
      ok = BR.fieldError(el('text'), el('text').value.trim().length < 10 ? 'Escreva pelo menos 10 caracteres.' : '') && ok;
      if (!ok) return;
      const all = store.get('reviews', {});
      all[p.id] = [{ name: el('rname').value.trim(), title: el('title').value.trim(), text: el('text').value.trim(), rating: +f.querySelector('[name=rating]:checked').value, date: new Date().toISOString() }, ...(all[p.id] || [])];
      store.set('reviews', all);
      m.close(); renderReviews(); BR.toast('Avaliação publicada. Agradecemos sua opinião!');
    });
  });

  /* ---------- Relacionados e recentes ---------- */
  const related = catalog.all().filter((x) => x.id !== p.id && (x.line === p.line || x.cat === p.cat))
    .sort((a, b) => (b.line === p.line) - (a.line === p.line) || b.sold - a.sold).slice(0, 10);
  $('[data-related]').innerHTML = carouselHTML(related, { label: 'Produtos relacionados' });
  const rec = BR.recent.list(p.id);
  if (rec.length) { $('[data-recent-section]').hidden = false; $('[data-recent]').innerHTML = carouselHTML(rec, { label: 'Vistos recentemente' }); }
  initCarousels();

  /* ---------- Dados estruturados (SEO) ---------- */
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.id, description: p.desc, brand: { '@type': 'Brand', name: 'Brasilidades' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews },
    offers: { '@type': 'Offer', priceCurrency: 'BRL', price: p.sizes[0].price, availability: 'https://schema.org/InStock' }
  });
  document.head.appendChild(ld);
});
