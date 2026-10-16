/* =========================================================
   Brasilidades — Núcleo da loja
   Utilitários, armazenamento, carrinho, favoritos, conta,
   frete, cupons, header/footer, minicart, busca e componentes.
   Depende de js/data.js
   ========================================================= */
(function () {
  'use strict';

  const D = window.BR_DATA;
  const FREE_SHIPPING = 199;
  const GIFT_WRAP_PRICE = 12.9;
  const PIX_DISCOUNT = 0.05;
  const MAX_INSTALLMENTS = 6;
  const MIN_INSTALLMENT = 30;

  /* ---------------------------------------------------------
     Utilitários
     --------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const param = (k) => new URLSearchParams(location.search).get(k);
  const debounce = (fn, ms = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const onlyDigits = (s) => String(s || '').replace(/\D/g, '');

  const store = {
    get(k, def) { try { const v = localStorage.getItem('brz_' + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem('brz_' + k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ } },
    remove(k) { try { localStorage.removeItem('brz_' + k); } catch (e) { /* noop */ } }
  };

  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

  /* ---------------------------------------------------------
     Ícones (SVG inline)
     --------------------------------------------------------- */
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    heart: '<path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4.5 7.2 4.5c2 0 3.4 1.1 4.8 2.9 1.4-1.8 2.8-2.9 4.8-2.9 3.3 0 5.6 3.1 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z"/>',
    bag: '<path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    chevronLeft: '<path d="m15 6-6 6 6 6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    truck: '<path d="M2 6h12v10H2zM14 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    store: '<path d="M3 9 5 4h14l2 5M3 9v11h18V9M3 9h18M9 20v-6h6v6"/>',
    gift: '<path d="M3 9h18v4H3zM5 13h14v8H5zM12 9v12"/><path d="M12 9S10.5 4 8 4a2.5 2.5 0 0 0 0 5M12 9s1.5-5 4-5a2.5 2.5 0 0 1 0 5"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    pause: '<path d="M7 4h3v16H7zM14 4h3v16h-3z"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
    leaf: '<path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15"/><path d="M5 19 14 10"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    sample: '<path d="M9 3h6M10 3v5L5 18a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3L14 8V3"/><path d="M7.5 14h9"/>',
    chat: '<path d="M4 5h16v11H8l-4 4z"/>',
    logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.3 4.4 5 4.6"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.8z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1 0-2.5-1.5-2.5-2.5l1-1-1-2z"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>'
  };
  const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[name] || ''}</svg>`;

  /* ---------------------------------------------------------
     Catálogo
     --------------------------------------------------------- */
  const catalog = {
    all: () => D.products,
    get: (id) => D.products.find((p) => p.id === id),
    line: (id) => D.lines.find((l) => l.id === id) || { name: '', color: '#91241E', color2: '#3F2B2E' },
    cat: (id) => D.categories.find((c) => c.id === id),
    variant(p, size) { return (p.sizes.find((s) => s.label === size) || p.sizes[0]); },
    discount(v) { return v.old && v.old > v.price ? Math.round((1 - v.price / v.old) * 100) : 0; },
    isNew: (p) => p.tags.includes('NOVIDADE'),
    onSale: (p) => p.sizes.some((s) => s.old > s.price),
    search(q) {
      const t = norm(q).trim();
      if (!t) return [];
      const words = t.split(/\s+/);
      return D.products.filter((p) => {
        const hay = norm([p.name, catalog.line(p.line).name, catalog.cat(p.cat).name, p.sub, p.family, p.desc, p.tags.join(' ')].join(' '));
        return words.every((w) => hay.includes(w));
      });
    }
  };

  function installments(total) {
    const n = Math.max(1, Math.min(MAX_INSTALLMENTS, Math.floor(total / MIN_INSTALLMENT)));
    return { n, value: total / n };
  }

  /* ---------------------------------------------------------
     Ilustrações dos produtos (SVG gerado, sem dependências)
     --------------------------------------------------------- */
  function mix(hex, t, base = '#ffffff') {
    const h = (x) => parseInt(x, 16);
    const a = hex.replace('#', ''), b = base.replace('#', '');
    const c = [0, 2, 4].map((i) => Math.round(h(a.substr(i, 2)) * (1 - t) + h(b.substr(i, 2)) * t));
    return '#' + c.map((x) => x.toString(16).padStart(2, '0')).join('');
  }
  const leaf = (x, y, r, s, fill, op) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0C30-40 90-40 120 0 90 40 30 40 0 0Z" fill="${fill}" opacity="${op}"/><path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0H118" stroke="#fff" stroke-width="2" opacity="${op * 0.8}"/>`;

  function shapeFor(type, c, c2) {
    const dark = mix(c2, 0.1, '#000000');
    const label = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#fff" opacity=".92"/><rect x="${x + 8}" y="${y + h / 2 - 1}" width="${w - 16}" height="2" fill="${c}" opacity=".5"/><text x="${x + w / 2}" y="${y + h / 2 - 9}" font-family="Georgia,serif" font-size="12" text-anchor="middle" fill="${dark}">B</text><text x="${x + w / 2}" y="${y + h / 2 + 16}" font-family="Arial,sans-serif" font-size="7" letter-spacing="1.5" text-anchor="middle" fill="${dark}">BRASILIDADES</text>`;
    switch (type) {
      case 'tubo': return `<path d="M135 88h130l-28 214h-74z" fill="url(#g)"/><rect x="135" y="80" width="130" height="14" rx="2" fill="${mix(c, .25, '#000')}"/><rect x="168" y="300" width="64" height="42" rx="8" fill="${dark}"/>${label(158, 150, 84, 80)}`;
      case 'bisnaga': return `<g transform="rotate(-18 200 220)"><path d="M150 110h100l-22 180h-56z" fill="url(#g)"/><rect x="150" y="102" width="100" height="12" rx="2" fill="${mix(c, .25, '#000')}"/><rect x="174" y="288" width="52" height="36" rx="7" fill="${dark}"/>${label(166, 160, 68, 70)}</g>`;
      case 'pote': return `<rect x="122" y="168" width="156" height="44" rx="10" fill="${dark}"/><rect x="128" y="206" width="144" height="134" rx="20" fill="url(#g)"/>${label(150, 232, 100, 80)}`;
      case 'perfume': return `<rect x="165" y="88" width="70" height="60" rx="8" fill="${dark}"/><rect x="186" y="146" width="28" height="26" fill="${mix(c, .4, '#fff')}"/><rect x="132" y="168" width="136" height="174" rx="16" fill="${c}" opacity=".35"/><rect x="142" y="196" width="116" height="138" rx="10" fill="url(#g)" opacity=".9"/><rect x="146" y="176" width="16" height="150" rx="8" fill="#fff" opacity=".35"/>${label(162, 222, 76, 78)}`;
      case 'oleo': return `<ellipse cx="200" cy="112" rx="20" ry="30" fill="${dark}"/><rect x="176" y="136" width="48" height="40" rx="6" fill="${mix(c2, .2, '#000')}"/><rect x="150" y="172" width="100" height="170" rx="22" fill="url(#g)"/><rect x="160" y="182" width="12" height="140" rx="6" fill="#fff" opacity=".3"/>${label(164, 218, 72, 84)}`;
      case 'spray': return `<rect x="168" y="86" width="64" height="62" rx="12" fill="${dark}"/><rect x="190" y="144" width="20" height="16" fill="${mix(c, .4, '#fff')}"/><rect x="156" y="156" width="88" height="186" rx="16" fill="url(#g)"/><rect x="164" y="166" width="10" height="160" rx="5" fill="#fff" opacity=".3"/>${label(166, 210, 68, 84)}`;
      case 'sabonete': return `<rect x="108" y="226" width="184" height="96" rx="46" fill="url(#g)"/><ellipse cx="200" cy="262" rx="62" ry="22" fill="#fff" opacity=".3"/><text x="200" y="272" font-family="Georgia,serif" font-size="22" text-anchor="middle" fill="${dark}" opacity=".6">B</text>`;
      case 'vela': return `<path d="M200 118c14 18 12 34 0 40-12-6-14-22 0-40Z" fill="#F8AD3F"/><path d="M200 132c6 9 5 17 0 20-5-3-6-11 0-20Z" fill="#FFDF93"/><rect x="198" y="156" width="4" height="22" fill="#231819"/><rect x="128" y="176" width="144" height="166" rx="14" fill="url(#g)"/><ellipse cx="200" cy="180" rx="70" ry="10" fill="#fff" opacity=".45"/>${label(152, 228, 96, 84)}`;
      case 'kit': return `<rect x="104" y="180" width="192" height="162" rx="6" fill="url(#g)"/><rect x="94" y="156" width="212" height="40" rx="6" fill="${mix(c, .15, '#000')}"/><rect x="190" y="156" width="20" height="186" fill="${mix(c2, .1, '#fff')}"/><ellipse cx="178" cy="148" rx="26" ry="14" fill="none" stroke="${mix(c2, .1, '#fff')}" stroke-width="10"/><ellipse cx="222" cy="148" rx="26" ry="14" fill="none" stroke="${mix(c2, .1, '#fff')}" stroke-width="10"/>`;
      case 'refil': return `<rect x="184" y="98" width="32" height="36" rx="5" fill="${dark}"/><path d="M138 342V176c0-26 18-44 44-44h36c26 0 44 18 44 44v166z" fill="url(#g)"/><path d="M148 330V180c0-18 12-34 32-36" stroke="#fff" stroke-width="6" fill="none" opacity=".3" stroke-linecap="round"/>${label(160, 220, 80, 84)}`;
      case 'difusor': return `<g stroke="${dark}" stroke-width="4" stroke-linecap="round"><path d="M200 230 160 70M200 230 186 60M200 230 214 62M200 230 244 76"/></g><rect x="184" y="196" width="32" height="30" fill="${dark}"/><rect x="140" y="222" width="120" height="120" rx="26" fill="url(#g)" opacity=".92"/>${label(162, 246, 76, 74)}`;
      default: return `<rect x="170" y="98" width="60" height="22" rx="6" fill="${dark}"/><rect x="222" y="102" width="44" height="12" rx="4" fill="${dark}"/><rect x="182" y="118" width="36" height="36" fill="${mix(c2, .2, '#000')}"/><rect x="146" y="150" width="108" height="192" rx="20" fill="url(#g)"/><rect x="156" y="162" width="12" height="164" rx="6" fill="#fff" opacity=".3"/>${label(160, 214, 80, 88)}`;
    }
  }

  function productSVG(p, variant = 'main') {
    const L = catalog.line(p.line);
    const c = L.color, c2 = L.color2;
    const bg = variant === 'main' ? mix(c, 0.86) : mix(c2, 0.82);
    let inner;
    if (variant === 'main') {
      inner = leaf(70, 300, -50, 1.3, c2, .18) + leaf(330, 290, -130, 1.2, c, .25) + leaf(300, 120, -150, .8, c2, .12) +
        `<ellipse cx="200" cy="346" rx="110" ry="12" fill="#000" opacity=".08"/>` + shapeFor(p.type, c, c2);
    } else {
      inner = leaf(120, 200, -140, 1.6, '#64CE65', .55) + leaf(280, 200, -40, 1.6, '#92BE25', .5) + leaf(200, 120, -90, 1.1, '#64CE65', .5) +
        `<circle cx="200" cy="225" r="92" fill="${c}"/><circle cx="200" cy="225" r="92" fill="url(#g)" opacity=".6"/>` +
        `<circle cx="170" cy="195" r="22" fill="#fff" opacity=".35"/><circle cx="235" cy="250" r="5" fill="${c2}" opacity=".6"/><circle cx="215" cy="268" r="4" fill="${c2}" opacity=".6"/><circle cx="245" cy="228" r="3" fill="${c2}" opacity=".6"/>` +
        `<text x="200" y="368" font-family="Arial,sans-serif" font-size="13" letter-spacing="3" text-anchor="middle" fill="${mix(c2, .1, '#000')}">${esc(L.ingredient || '').toUpperCase()}</text>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(c, .15)}"/><stop offset="1" stop-color="${mix(c, .15, '#000')}"/></linearGradient></defs><rect width="400" height="400" fill="${bg}"/>${inner}</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  /* Fotos dos produtos em img/produtos/{ID}.jpg (principal), {ID}-detalhe.jpg (rótulo)
     e {ID}-foto.jpg (foto completa). Se a foto não existir, cai na ilustração SVG. */
  const PHOTO_DIR = 'img/produtos/';
  const productImg = (p, alt = false) => (alt ? (p.image2 || `${PHOTO_DIR}${p.id}-detalhe.jpg`) : (p.image || `${PHOTO_DIR}${p.id}.jpg`));
  const productPhoto = (p) => p.image3 || `${PHOTO_DIR}${p.id}-foto.jpg`;
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.fallback) return;
    const m = /img\/produtos\/(BR\d+)(-detalhe)?/.exec(img.getAttribute('src') || '');
    const p = m && catalog.get(m[1]);
    if (!p) return;
    img.dataset.fallback = '1';
    img.src = productSVG(p, m[2] ? 'alt' : 'main');
  }, true);

  /** Cena decorativa (banners): círculos, folhas e, opcionalmente, um produto */
  let sceneId = 0;
  function scene({ bg = '#FBF9F6', c1 = '#FFB175', c2 = '#F25071', leafColor = '#64CE65', product = null, alt = false, align = 'right' } = {}) {
    const id = 'sc' + (++sceneId);
    const cx = align === 'center' ? 300 : 360;
    const leaves = [
      leaf(cx - 230, 420, -60, 1.6, leafColor, .9), leaf(cx - 170, 450, -95, 1.3, mix(leafColor, .25, '#000'), .8),
      leaf(cx + 150, 120, -150, 1.2, leafColor, .75), leaf(cx + 120, 470, -20, 1.1, mix(leafColor, .3), .7)
    ].join('');
    const img = product ? `<clipPath id="${id}"><circle cx="${cx}" cy="260" r="165"/></clipPath><image href="${productImg(product, alt)}" x="${cx - 170}" y="90" width="340" height="340" clip-path="url(#${id})" preserveAspectRatio="xMidYMid slice"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="600" height="500" fill="${bg}"/>
      <circle cx="${cx + 20}" cy="250" r="215" fill="${c1}" opacity=".85"/>
      <circle cx="${cx + 170}" cy="80" r="70" fill="${c2}" opacity=".85"/>
      <circle cx="${cx - 190}" cy="110" r="26" fill="${c2}" opacity=".6"/>
      ${leaves}
      <circle cx="${cx}" cy="260" r="178" fill="#fff" opacity=".35"/>
      ${img}
      <g fill="#fff" opacity=".7"><circle cx="${cx + 210}" cy="300" r="5"/><circle cx="${cx + 230}" cy="330" r="3"/><circle cx="${cx - 220}" cy="230" r="4"/></g>
    </svg>`;
  }

  /* ---------------------------------------------------------
     Carrinho
     --------------------------------------------------------- */
  const cart = {
    items: () => store.get('cart', []),
    save(items) { store.set('cart', items); emit('cart:change'); },
    key: (id, size) => id + '|' + size,
    add(id, size, qty = 1) {
      const p = catalog.get(id); if (!p) return;
      size = size || p.sizes[0].label;
      const items = cart.items();
      const found = items.find((i) => i.id === id && i.size === size);
      if (found) found.qty = Math.min(10, found.qty + qty); else items.push({ id, size, qty: Math.min(10, qty) });
      cart.save(items);
    },
    setQty(id, size, qty) {
      let items = cart.items();
      if (qty <= 0) items = items.filter((i) => !(i.id === id && i.size === size));
      else items.forEach((i) => { if (i.id === id && i.size === size) i.qty = Math.min(10, qty); });
      cart.save(items);
    },
    remove(id, size) { cart.setQty(id, size, 0); },
    clear() { cart.save([]); store.remove('coupon'); store.remove('shipping'); store.remove('gift'); store.remove('samples'); },
    count: () => cart.items().reduce((s, i) => s + i.qty, 0),
    detailed() {
      return cart.items().map((i) => {
        const p = catalog.get(i.id); if (!p) return null;
        const v = catalog.variant(p, i.size);
        return { ...i, product: p, price: v.price, old: v.old, total: v.price * i.qty };
      }).filter(Boolean);
    },
    subtotal: () => cart.detailed().reduce((s, i) => s + i.total, 0),

    coupon: () => store.get('coupon', null),
    applyCoupon(code) {
      code = String(code || '').trim().toUpperCase();
      const c = D.coupons[code];
      if (!c) return { ok: false, msg: 'Cupom inválido ou expirado.' };
      const sub = cart.subtotal();
      if (c.min && sub < c.min) return { ok: false, msg: `Este cupom é válido para compras acima de ${money(c.min)}.` };
      if (c.onlyCat && !cart.detailed().some((i) => i.product.cat === c.onlyCat)) return { ok: false, msg: 'Nenhum produto elegível para este cupom na sacola.' };
      store.set('coupon', code); emit('cart:change');
      return { ok: true, msg: `Cupom ${code} aplicado: ${c.label}.` };
    },
    removeCoupon() { store.remove('coupon'); emit('cart:change'); },

    shipping: () => store.get('shipping', null),
    setShipping(s) { store.set('shipping', s); emit('cart:change'); },
    gift: () => store.get('gift', { on: false, msg: '' }),
    setGift(g) { store.set('gift', g); emit('cart:change'); },
    samples: () => store.get('samples', []),
    setSamples(s) { store.set('samples', s.slice(0, 3)); },

    totals(payMethod) {
      const items = cart.detailed();
      const subtotal = items.reduce((s, i) => s + i.total, 0);
      let discount = 0, couponCode = cart.coupon(), couponFreeShip = false;
      const c = couponCode && D.coupons[couponCode];
      if (c) {
        const valid = (!c.min || subtotal >= c.min);
        if (!valid) { couponCode = null; }
        else if (c.type === 'pct') {
          const base = c.onlyCat ? items.filter((i) => i.product.cat === c.onlyCat).reduce((s, i) => s + i.total, 0) : subtotal;
          discount = base * c.value / 100;
        } else if (c.type === 'ship') couponFreeShip = true;
      }
      const sh = cart.shipping();
      let shipping = 0, shippingKnown = false;
      if (sh && items.length) {
        const opt = shippingOptions(sh.cep, subtotal).find((o) => o.id === sh.option);
        if (opt) { shipping = opt.price; shippingKnown = true; }
      }
      if (couponFreeShip) shipping = 0;
      const gift = cart.gift().on && items.length ? GIFT_WRAP_PRICE : 0;
      let total = Math.max(0, subtotal - discount) + shipping + gift;
      let pixDiscount = 0;
      if (payMethod === 'pix') { pixDiscount = total * PIX_DISCOUNT; total -= pixDiscount; }
      return { items, subtotal, discount, couponCode, shipping, shippingKnown, gift, pixDiscount, total, freeLeft: Math.max(0, FREE_SHIPPING - (subtotal - discount)) };
    }
  };

  /* ---------------------------------------------------------
     Frete (simulação por região do CEP)
     --------------------------------------------------------- */
  const REGIONS = {
    0: { base: 14.9, d: [2, 4], name: 'São Paulo (capital/grande SP)' }, 1: { base: 16.9, d: [2, 5], name: 'São Paulo (interior/litoral)' },
    2: { base: 18.9, d: [3, 5], name: 'RJ/ES' }, 3: { base: 19.9, d: [3, 6], name: 'MG' }, 4: { base: 24.9, d: [5, 8], name: 'BA/SE' },
    5: { base: 27.9, d: [6, 9], name: 'PE/AL/PB/RN' }, 6: { base: 34.9, d: [7, 12], name: 'Norte/Nordeste' }, 7: { base: 26.9, d: [5, 9], name: 'Centro-Oeste' },
    8: { base: 19.9, d: [3, 6], name: 'PR/SC' }, 9: { base: 21.9, d: [4, 7], name: 'RS' }
  };
  function shippingOptions(cep, subtotal) {
    const d = onlyDigits(cep);
    if (d.length !== 8) return [];
    const r = REGIONS[d[0]];
    return [
      { id: 'economica', name: 'Entrega Econômica', price: subtotal >= FREE_SHIPPING ? 0 : r.base, days: `${r.d[0]} a ${r.d[1]} dias úteis` },
      { id: 'expressa', name: 'Entrega Expressa', price: +(r.base * 1.8).toFixed(2), days: `${Math.max(1, r.d[0] - 1)} a ${Math.ceil(r.d[1] / 2)} dias úteis` },
      { id: 'retira', name: 'Retire Grátis em uma Loja', price: 0, days: 'Pronto em até 2 dias úteis' }
    ];
  }
  async function lookupCEP(cep) {
    const d = onlyDigits(cep);
    if (d.length !== 8) return null;
    try {
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 5000);
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`, { signal: ctrl.signal });
      clearTimeout(t);
      const j = await r.json();
      return j.erro ? null : j;
    } catch (e) { return null; }
  }

  /* ---------------------------------------------------------
     Favoritos
     --------------------------------------------------------- */
  const wishlist = {
    items: () => store.get('wish', []),
    has: (id) => wishlist.items().includes(id),
    toggle(id) {
      let w = wishlist.items();
      const on = !w.includes(id);
      w = on ? [...w, id] : w.filter((x) => x !== id);
      store.set('wish', w); emit('wish:change', { id, on });
      return on;
    }
  };

  /* ---------------------------------------------------------
     Conta (demonstração local — em produção use um backend)
     --------------------------------------------------------- */
  function hash(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return 'h' + h.toString(36); }
  const auth = {
    users: () => store.get('users', {}),
    current() { const e = store.get('session', null); return e ? auth.users()[e] || null : null; },
    register({ name, email, pass, cpf, phone }) {
      email = String(email).trim().toLowerCase();
      const users = auth.users();
      if (users[email]) return { ok: false, msg: 'Já existe uma conta com este e-mail.' };
      users[email] = { name, email, cpf: cpf || '', phone: phone || '', pass: hash(pass), addresses: [], created: new Date().toISOString() };
      store.set('users', users); store.set('session', email); emit('auth:change');
      return { ok: true };
    },
    login(email, pass) {
      email = String(email).trim().toLowerCase();
      const u = auth.users()[email];
      if (!u || u.pass !== hash(pass)) return { ok: false, msg: 'E-mail ou senha incorretos.' };
      store.set('session', email); emit('auth:change');
      return { ok: true };
    },
    logout() { store.remove('session'); emit('auth:change'); },
    changePassword(current, next) {
      const u = auth.current(); if (!u) return { ok: false, msg: 'Sessão expirada.' };
      if (u.pass !== hash(current)) return { ok: false, msg: 'Senha atual incorreta.' };
      auth.update({ pass: hash(next) });
      return { ok: true };
    },
    update(data) {
      const u = auth.current(); if (!u) return;
      const users = auth.users();
      users[u.email] = { ...users[u.email], ...data };
      store.set('users', users); emit('auth:change');
    }
  };

  const orders = {
    all: () => store.get('orders', []),
    get: (id) => orders.all().find((o) => o.id === id),
    mine() { const u = auth.current(); return u ? orders.all().filter((o) => o.customer.email === u.email) : []; },
    create(o) {
      const list = orders.all();
      o.id = 'BRZ' + Date.now().toString().slice(-8);
      o.date = new Date().toISOString();
      list.unshift(o); store.set('orders', list);
      return o;
    }
  };

  /* ---------------------------------------------------------
     Máscaras e validações
     --------------------------------------------------------- */
  const masks = {
    cep: (v) => onlyDigits(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2'),
    cpf: (v) => onlyDigits(v).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
    phone: (v) => { const d = onlyDigits(v).slice(0, 11); return d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3') : d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/[-\s(]+$/, ''); },
    card: (v) => onlyDigits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
    exp: (v) => onlyDigits(v).slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2'),
    cvv: (v) => onlyDigits(v).slice(0, 4),
    digits: (v) => onlyDigits(v)
  };
  function bindMasks(root = document) {
    $$('[data-mask]', root).forEach((el) => {
      if (el._masked) return; el._masked = true;
      el.addEventListener('input', () => { el.value = masks[el.dataset.mask](el.value); });
    });
  }
  const validate = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()),
    cpf(v) {
      const d = onlyDigits(v);
      if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
      const calc = (n) => { let s = 0; for (let i = 0; i < n; i++) s += +d[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
      return calc(9) === +d[9] && calc(10) === +d[10];
    },
    phone: (v) => onlyDigits(v).length >= 10,
    cep: (v) => onlyDigits(v).length === 8,
    luhn(v) {
      const d = onlyDigits(v); if (d.length < 13) return false;
      let s = 0, alt = false;
      for (let i = d.length - 1; i >= 0; i--) { let n = +d[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } s += n; alt = !alt; }
      return s % 10 === 0;
    },
    exp(v) {
      const m = /^(\d{2})\/(\d{2})$/.exec(v); if (!m) return false;
      const mo = +m[1], yr = 2000 + +m[2]; if (mo < 1 || mo > 12) return false;
      const now = new Date(); return yr > now.getFullYear() || (yr === now.getFullYear() && mo >= now.getMonth() + 1);
    }
  };
  function cardBrand(num) {
    const d = onlyDigits(num);
    if (/^4/.test(d)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
    if (/^3[47]/.test(d)) return 'Amex';
    if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(d)) return 'Elo';
    if (/^(606282|3841)/.test(d)) return 'Hipercard';
    return '';
  }
  /** Marca o campo como inválido/válido e exibe mensagem */
  function fieldError(input, msg) {
    const wrap = input.closest('.field') || input.parentElement;
    let el = wrap.querySelector('.field__error');
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (!el) { el = document.createElement('span'); el.className = 'field__error'; wrap.appendChild(el); }
      el.textContent = msg;
    } else {
      input.removeAttribute('aria-invalid');
      if (el) el.remove();
    }
    return !msg;
  }

  /* ---------------------------------------------------------
     Componentes visuais
     --------------------------------------------------------- */
  function stars(rating, count) {
    const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
    return `<span class="rating" title="${rating.toFixed(1)} de 5"><span class="rating__stars" style="--pct:${pct}%" aria-hidden="true">★★★★★</span><span class="sr-only">Nota ${rating.toFixed(1)} de 5</span>${count != null ? `<span class="rating__count">(${count})</span>` : ''}</span>`;
  }

  function tagsHTML(p, v) {
    const out = [];
    const disc = catalog.discount(v || p.sizes[0]);
    if (disc) out.push(`<span class="tag tag--discount">${disc}% OFF</span>`);
    p.tags.slice(0, disc ? 1 : 2).forEach((t) => {
      const cls = t === 'NOVIDADE' ? 'tag--new' : t.includes('LIMITADA') ? 'tag--limited' : t.includes('PRESENTE') ? 'tag--gift' : '';
      out.push(`<span class="tag ${cls}">${esc(t)}</span>`);
    });
    return out.join('');
  }

  function priceHTML(v, big = false) {
    const disc = catalog.discount(v);
    return `<div class="price ${big ? 'price--lg' : ''} ${disc ? 'price--sale' : ''}">
      <span class="price__sales">${money(v.price)}</span>
      ${disc ? `<del class="price__list"><span class="sr-only">De </span>${money(v.old)}</del>` : ''}
    </div>`;
  }

  function productCard(p) {
    const v = p.sizes[0];
    const L = catalog.line(p.line);
    const inst = installments(v.price);
    const wished = wishlist.has(p.id);
    const url = `produto.html?id=${p.id}`;
    return `<article class="product-card" data-id="${p.id}">
      <div class="product-card__tags">${tagsHTML(p, v)}</div>
      <button class="wish-btn ${wished ? 'is-active' : ''}" type="button" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remover dos' : 'Adicionar aos'} favoritos">${icon('heart')}</button>
      <a class="product-card__media" href="${url}" tabindex="-1" aria-hidden="true">
        <img class="product-card__img" src="${productImg(p)}" alt="" loading="lazy" width="400" height="400">
        <img class="product-card__img product-card__img--alt" src="${productImg(p, true)}" alt="" loading="lazy" width="400" height="400">
      </a>
      <div class="product-card__body">
        <span class="product-card__line" style="--line:${L.color}">${esc(L.name)}</span>
        <h3 class="product-card__name"><a href="${url}">${esc(p.name)}</a></h3>
        ${stars(p.rating, p.reviews)}
        <div class="product-card__meta">
          <span class="product-card__size">${esc(v.label)}${p.sizes.length > 1 ? ` <small>+${p.sizes.length - 1}</small>` : ''}</span>
          ${priceHTML(v)}
        </div>
        <span class="product-card__inst">${inst.n > 1 ? `ou ${inst.n}x de ${money(inst.value)} sem juros` : '&nbsp;'}</span>
      </div>
      <button class="btn btn--primary btn--block btn--sm product-card__cta" type="button" data-add="${p.id}" data-size="${esc(v.label)}">${icon('bag')} Adicionar</button>
    </article>`;
  }

  function carouselHTML(products, opts = {}) {
    return `<div class="carousel" data-carousel>
      <div class="carousel__track" tabindex="0" aria-label="${esc(opts.label || 'Produtos')}">
        ${products.map((p) => `<div class="carousel__slide">${productCard(p)}</div>`).join('')}
      </div>
      <div class="carousel__controls">
        <div class="carousel__progress"><span class="carousel__bar"></span></div>
        <div class="carousel__arrows">
          <button class="icon-btn icon-btn--round" type="button" data-prev aria-label="Anterior">${icon('chevronLeft')}</button>
          <button class="icon-btn icon-btn--round" type="button" data-next aria-label="Próximo">${icon('chevronRight')}</button>
        </div>
      </div>
    </div>`;
  }

  function initCarousels(root = document) {
    $$('[data-carousel]', root).forEach((c) => {
      if (c._init) return; c._init = true;
      const track = $('.carousel__track', c), bar = $('.carousel__bar', c);
      const prev = $('[data-prev]', c), next = $('[data-next]', c);
      const step = () => { const s = $('.carousel__slide', track); return s ? s.getBoundingClientRect().width * Math.max(1, Math.floor(track.clientWidth / s.getBoundingClientRect().width)) : track.clientWidth; };
      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        const visible = track.clientWidth / track.scrollWidth;
        if (bar) { bar.style.width = Math.max(10, visible * 100) + '%'; bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * ((1 - visible) / visible) * 100 : 0}%)`; }
        if (prev) prev.disabled = track.scrollLeft <= 2;
        if (next) next.disabled = track.scrollLeft >= max - 2;
        c.classList.toggle('carousel--static', max <= 2);
      };
      prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', debounce(update, 100));
      update();
    });
  }

  /* Toast */
  function toast(msg, type = 'success') {
    let wrap = $('#toasts');
    if (!wrap) { wrap = document.createElement('div'); wrap.id = 'toasts'; wrap.className = 'toasts'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.innerHTML = `${icon(type === 'error' ? 'close' : 'check')}<span>${esc(msg)}</span>`;
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-in'));
    setTimeout(() => { t.classList.remove('is-in'); setTimeout(() => t.remove(), 300); }, 3200);
  }

  /* Modal de confirmação */
  function confirmDialog({ title = 'Tem certeza?', text = '', ok = 'Sim', cancel = 'Cancelar' } = {}) {
    return new Promise((resolve) => {
      const m = document.createElement('div');
      m.className = 'modal is-open';
      m.innerHTML = `<div class="modal__backdrop" data-close></div>
        <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="mdl-t">
          <button class="icon-btn modal__close" data-close aria-label="Fechar">${icon('close')}</button>
          <h3 id="mdl-t" class="modal__title">${esc(title)}</h3>
          ${text ? `<p class="modal__text">${text}</p>` : ''}
          <div class="modal__actions"><button class="btn btn--outline" data-close>${esc(cancel)}</button><button class="btn btn--primary" data-ok>${esc(ok)}</button></div>
        </div>`;
      document.body.appendChild(m); lockScroll(true);
      const done = (v) => { m.remove(); lockScroll(false); document.removeEventListener('keydown', onKey); resolve(v); };
      const onKey = (e) => { if (e.key === 'Escape') done(false); };
      document.addEventListener('keydown', onKey);
      m.addEventListener('click', (e) => { if (e.target.closest('[data-ok]')) done(true); else if (e.target.closest('[data-close]')) done(false); });
      $('[data-ok]', m).focus();
    });
  }

  /* Modal genérico com conteúdo */
  function openModal(html, cls = '') {
    const m = document.createElement('div');
    m.className = `modal is-open ${cls}`;
    m.innerHTML = `<div class="modal__backdrop" data-close></div><div class="modal__box" role="dialog" aria-modal="true"><button class="icon-btn modal__close" data-close aria-label="Fechar">${icon('close')}</button>${html}</div>`;
    document.body.appendChild(m); lockScroll(true);
    const close = () => { m.remove(); lockScroll(false); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    m.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    return { el: m, close };
  }

  let scrollLocks = 0;
  function lockScroll(on) {
    scrollLocks = Math.max(0, scrollLocks + (on ? 1 : -1));
    document.documentElement.classList.toggle('no-scroll', scrollLocks > 0);
  }

  /* ---------------------------------------------------------
     Header
     --------------------------------------------------------- */
  const NAV = [
    { label: 'Promoções', href: 'produtos.html?tag=promocao', highlight: true },
    { label: 'Best-Sellers', href: 'produtos.html?tag=best-seller' },
    { label: 'Novidades', href: 'produtos.html?tag=novidade' },
    ...['corpo-banho', 'fragrancias', 'rosto', 'cabelos', 'maos', 'casa', 'homem', 'presentes', 'refil'].map((id) => ({ cat: id })),
    { label: 'Linhas', lines: true }
  ];

  function megaFor(item) {
    if (item.lines) {
      return `<div class="mega"><div class="container mega__inner">
        <div class="mega__col mega__col--wide"><p class="mega__title">Conheça todas as linhas</p>
          <ul class="mega__lines">${D.lines.map((l) => `<li><a href="produtos.html?linha=${l.id}"><span class="dot" style="--c:${l.color}"></span>${esc(l.name)}<small>${esc(l.origin)}</small></a></li>`).join('')}</ul>
        </div>
        <a class="mega__feature" href="sobre.html#ingredientes" style="--c:#FFB175"><img src="${productImg(catalog.get('BR001'), true)}" alt=""><span><strong>Ingredientes da biodiversidade</strong>Descubra a origem de cada ativo</span></a>
      </div></div>`;
    }
    if (!item.cat) return '';
    const cat = catalog.cat(item.cat);
    const prods = D.products.filter((p) => p.cat === cat.id);
    const lineIds = [...new Set(prods.map((p) => p.line))];
    const feat = prods.slice().sort((a, b) => b.sold - a.sold)[0];
    return `<div class="mega"><div class="container mega__inner">
      <div class="mega__col"><p class="mega__title">Tipos de Produtos</p><ul>
        <li><a href="produtos.html?cat=${cat.id}"><strong>Ver tudo em ${esc(cat.name)}</strong></a></li>
        ${cat.subs.map((s) => `<li><a href="produtos.html?cat=${cat.id}&sub=${encodeURIComponent(s)}">${esc(s)}</a></li>`).join('')}
      </ul></div>
      <div class="mega__col"><p class="mega__title">Linhas</p><ul>
        ${lineIds.map((l) => `<li><a href="produtos.html?cat=${cat.id}&linha=${l}"><span class="dot" style="--c:${catalog.line(l).color}"></span>${esc(catalog.line(l).name)}</a></li>`).join('')}
      </ul></div>
      <div class="mega__col"><p class="mega__title">Descubra</p><ul>
        <li><a href="produtos.html?cat=${cat.id}&tag=best-seller">Mais vendidos</a></li>
        <li><a href="produtos.html?cat=${cat.id}&tag=novidade">Novidades</a></li>
        <li><a href="produtos.html?cat=${cat.id}&tag=promocao">Promoções</a></li>
      </ul></div>
      ${feat ? `<a class="mega__feature" href="produto.html?id=${feat.id}"><img src="${productImg(feat)}" alt=""><span><strong>${esc(feat.name)}</strong>O favorito de ${esc(cat.name)}</span></a>` : ''}
    </div></div>`;
  }

  function navLabel(item) { return item.label || catalog.cat(item.cat).short; }
  function navHref(item) { return item.href || (item.cat ? `produtos.html?cat=${item.cat}` : 'produtos.html'); }

  function renderHeader() {
    const host = $('#app-header'); if (!host) return;
    const currentCat = param('cat');
    host.outerHTML = `
    <a class="skip-link" href="#main">Pular para o conteúdo</a>
    <div class="topbar" role="region" aria-label="Avisos">
      <div class="topbar__track">
        <p class="topbar__msg is-active">${icon('truck')} <strong>Frete grátis</strong> acima de ${money(FREE_SHIPPING)}</p>
        <p class="topbar__msg">${icon('gift')} 10% OFF na primeira compra: <strong>PRIMEIRACOMPRA</strong></p>
        <p class="topbar__msg">${icon('sample')} Leve <strong>3 amostras grátis</strong> em todos os pedidos</p>
        <p class="topbar__msg">${icon('card')} Até <strong>${MAX_INSTALLMENTS}x sem juros</strong> · 5% OFF no Pix</p>
      </div>
    </div>
    <header class="site-header" id="site-header">
      <div class="container header-main">
        <button class="icon-btn header-main__menu" type="button" data-open-menu aria-label="Abrir menu">${icon('menu')}</button>
        <form class="header-search" action="produtos.html" role="search" data-search-form>
          <label class="sr-only" for="hdr-q">Buscar produtos</label>
          <input id="hdr-q" name="q" type="search" placeholder="O que você procura?" autocomplete="off" data-open-search>
          <button type="submit" class="header-search__btn" aria-label="Buscar">${icon('search')}</button>
        </form>
        <a class="logo" href="index.html" aria-label="Brasilidades — página inicial">
          <svg class="logo__mark" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#91241E"/><path d="M14 31c0-9 5-15 20-16-1 10-7 16-16 16" fill="#FFB175"/><path d="M14 31 26 21" stroke="#91241E" stroke-width="1.6"/><circle cx="31" cy="30" r="4" fill="#F8AD3F"/></svg>
          <span class="logo__text">Brasilidades<small>cosmética natural brasileira</small></span>
        </a>
        <div class="header-actions">
          <a class="header-action hide-md" href="lojas.html">${icon('pin')}<span>Lojas</span></a>
          <a class="header-action" href="conta.html" data-account-link>${icon('user')}<span data-account-label>Entrar</span></a>
          <a class="header-action hide-sm" href="favoritos.html" aria-label="Favoritos">${icon('heart')}<span>Favoritos</span><b class="badge" data-wish-count hidden>0</b></a>
          <button class="header-action" type="button" data-open-cart aria-label="Abrir sacola">${icon('bag')}<span>Sacola</span><b class="badge" data-cart-count hidden>0</b></button>
        </div>
      </div>
      <nav class="main-nav" aria-label="Categorias">
        <ul class="container main-nav__list">
          ${NAV.map((item) => `<li class="main-nav__item ${item.cat || item.lines ? 'has-mega' : ''}">
            <a class="main-nav__link ${item.highlight ? 'is-highlight' : ''} ${item.cat && item.cat === currentCat ? 'is-current' : ''}" href="${navHref(item)}">${esc(navLabel(item))}</a>
            ${megaFor(item)}
          </li>`).join('')}
        </ul>
      </nav>
    </header>

    <!-- Menu mobile -->
    <div class="drawer drawer--left" id="mobile-menu" aria-hidden="true">
      <div class="drawer__backdrop" data-close-drawer></div>
      <aside class="drawer__panel" role="dialog" aria-label="Menu">
        <div class="drawer__head"><a class="logo logo--sm" href="index.html"><span class="logo__text">Brasilidades</span></a><button class="icon-btn" data-close-drawer aria-label="Fechar menu">${icon('close')}</button></div>
        <div class="drawer__body">
          <a class="mobile-account" href="conta.html">${icon('user')}<span data-account-mobile>Entre ou cadastre-se</span></a>
          <ul class="mobile-nav">
            ${NAV.map((item) => {
              if (item.cat) {
                const cat = catalog.cat(item.cat);
                return `<li><details><summary>${esc(cat.name)}${icon('chevronDown')}</summary><ul>
                  <li><a href="produtos.html?cat=${cat.id}"><strong>Ver tudo</strong></a></li>
                  ${cat.subs.map((s) => `<li><a href="produtos.html?cat=${cat.id}&sub=${encodeURIComponent(s)}">${esc(s)}</a></li>`).join('')}
                </ul></details></li>`;
              }
              if (item.lines) return `<li><details><summary>Linhas${icon('chevronDown')}</summary><ul>${D.lines.map((l) => `<li><a href="produtos.html?linha=${l.id}"><span class="dot" style="--c:${l.color}"></span>${esc(l.name)}</a></li>`).join('')}</ul></details></li>`;
              return `<li><a class="${item.highlight ? 'is-highlight' : ''}" href="${item.href}">${esc(item.label)}</a></li>`;
            }).join('')}
          </ul>
          <ul class="mobile-links">
            <li><a href="favoritos.html">${icon('heart')} Favoritos</a></li>
            <li><a href="lojas.html">${icon('pin')} Encontre uma loja</a></li>
            <li><a href="sobre.html">${icon('leaf')} Nossa história</a></li>
            <li><a href="contato.html">${icon('chat')} Fale conosco</a></li>
          </ul>
        </div>
      </aside>
    </div>

    <!-- Minicart -->
    <div class="drawer drawer--right" id="minicart" aria-hidden="true">
      <div class="drawer__backdrop" data-close-drawer></div>
      <aside class="drawer__panel" role="dialog" aria-labelledby="minicart-title">
        <div class="drawer__head"><h2 class="drawer__title" id="minicart-title">Sua sacola <span data-cart-count-text></span></h2><button class="icon-btn" data-close-drawer aria-label="Fechar sacola">${icon('close')}</button></div>
        <div class="drawer__body" data-minicart-body></div>
        <div class="drawer__foot" data-minicart-foot></div>
      </aside>
    </div>

    <!-- Busca -->
    <div class="search-overlay" id="search-overlay" aria-hidden="true">
      <div class="search-overlay__panel" role="dialog" aria-label="Busca">
        <div class="container">
          <form class="search-overlay__form" action="produtos.html" role="search">
            ${icon('search')}
            <label class="sr-only" for="ovl-q">Buscar</label>
            <input id="ovl-q" name="q" type="search" placeholder="Busque por produtos, linhas ou ingredientes" autocomplete="off">
            <button type="button" class="icon-btn" data-close-search aria-label="Fechar busca">${icon('close')}</button>
          </form>
          <div class="search-overlay__content">
            <div class="search-overlay__popular"><p class="eyebrow">Pesquisas populares</p><div class="chips">${D.popularSearches.map((s) => `<a class="chip" href="produtos.html?q=${encodeURIComponent(s)}">${esc(s)}</a>`).join('')}</div></div>
            <div class="search-overlay__results" data-search-results></div>
          </div>
        </div>
      </div>
      <div class="search-overlay__backdrop" data-close-search></div>
    </div>`;
  }

  /* ---------------------------------------------------------
     Footer
     --------------------------------------------------------- */
  function renderFooter() {
    const host = $('#app-footer'); if (!host) return;
    const reassurance = [
      ['truck', `Frete grátis acima de ${money(FREE_SHIPPING)}`, 'Receba os seus produtos no conforto da sua casa.'],
      ['phone', 'Fale conosco', '0800 000 2026 — Seg. a Sex. das 9h às 17h, exceto feriados.'],
      ['store', 'Retire grátis em uma loja', 'Compre online e retire na loja mais próxima.'],
      ['sample', 'Leve 3 amostras*', 'E conheça nossos produtos.'],
      ['lock', 'Pagamento seguro', 'Ambiente protegido e criptografado. Pix, cartão e boleto.'],
      ['pin', 'Localize uma loja', 'Encontre a loja mais próxima e viva uma experiência única.']
    ];
    const cols = [
      ['Sobre nós', [['Nossa História', 'sobre.html'], ['Ingredientes', 'sobre.html#ingredientes'], ['Compromissos', 'sobre.html#compromissos'], ['Encontre uma Loja', 'lojas.html'], ['Trabalhe Conosco', 'contato.html']]],
      ['Benefícios', [['Clube Brasilidades', 'conta.html'], ['Programa de Reciclagem', 'sobre.html#compromissos'], ['Retirada em Loja', 'lojas.html'], ['Cupons e Promoções', 'produtos.html?tag=promocao']]],
      ['Atendimento', [['Fale Conosco', 'contato.html'], ['Perguntas Frequentes', 'contato.html#faq'], ['Trocas e Devoluções', 'politicas.html#trocas'], ['Prazos de Entrega', 'politicas.html#entrega'], ['Meus Pedidos', 'conta.html#pedidos']]],
      ['Seja um parceiro', [['Seja um Franqueado', 'contato.html'], ['Vendas Corporativas', 'contato.html'], ['Fornecedores', 'contato.html']]]
    ];
    host.outerHTML = `
    <section class="newsletter" aria-labelledby="nl-title">
      <div class="container newsletter__inner">
        <div class="newsletter__text">
          <h2 id="nl-title" class="newsletter__title">Quer receber novidades e ofertas exclusivas?</h2>
          <p>Cadastre-se e aproveite um cupom de <strong>10% OFF</strong> na sua primeira compra!</p>
        </div>
        <form class="newsletter__form" data-newsletter novalidate>
          <div class="field"><label class="sr-only" for="nl-name">Nome</label><input id="nl-name" name="name" placeholder="Nome" required></div>
          <div class="field"><label class="sr-only" for="nl-email">E-mail</label><input id="nl-email" name="email" type="email" placeholder="E-mail" required></div>
          <div class="field"><label class="sr-only" for="nl-phone">Celular</label><input id="nl-phone" name="phone" placeholder="Celular" data-mask="phone" inputmode="tel"></div>
          <button class="btn btn--light" type="submit">Registrar</button>
          <p class="newsletter__legal">Ao se cadastrar, você concorda em receber comunicações de acordo com nossa <a href="politicas.html#privacidade">política de privacidade</a> e <a href="politicas.html#termos">termos de uso</a>.</p>
        </form>
      </div>
    </section>

    <section class="reassurance" aria-label="Vantagens">
      <div class="container reassurance__grid">
        ${reassurance.map(([ic, t, d]) => `<div class="reassurance__item"><span class="reassurance__icon">${icon(ic)}</span><div><p class="reassurance__title">${t}</p><p class="reassurance__desc">${d}</p></div></div>`).join('')}
      </div>
    </section>

    <footer class="site-footer">
      <div class="container site-footer__grid">
        ${cols.map(([t, links]) => `<details class="footer-col" data-footer-col><summary class="footer-col__title">${t}${icon('chevronDown')}</summary><ul>${links.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></details>`).join('')}
        <div class="footer-col footer-col--social">
          <p class="footer-col__title">Mídias sociais</p>
          <div class="social">
            <a href="#" aria-label="Instagram">${icon('instagram')}</a><a href="#" aria-label="Facebook">${icon('facebook')}</a>
            <a href="#" aria-label="YouTube">${icon('youtube')}</a><a href="#" aria-label="TikTok">${icon('tiktok')}</a>
          </div>
          <p class="footer-col__title">Formas de pagamento</p>
          <div class="payments"><span>Visa</span><span>Master</span><span>Elo</span><span>Amex</span><span>Pix</span><span>Boleto</span></div>
        </div>
      </div>
      <div class="container site-footer__bottom">
        <ul class="footer-links"><li><a href="politicas.html#termos">Termos e Condições</a></li><li><a href="politicas.html#privacidade">Política de Privacidade</a></li><li><a href="lojas.html">Encontre uma loja</a></li><li><a href="#" data-cookie-settings>Preferências de cookies</a></li></ul>
        <p class="copyright">Brasilidades Cosméticos © ${new Date().getFullYear()} · CNPJ 00.000.000/0001-00 · Loja demonstrativa</p>
        <p class="seo-text">A Brasilidades nasceu do encontro entre a biodiversidade brasileira e o cuidado de si. Nossos produtos são ricos em ativos naturais como manteiga de cupuaçu, óleo de buriti, açaí e castanha-do-pará, obtidos de forma sustentável junto a comunidades extrativistas de norte a sul do país.</p>
      </div>
    </footer>

    <div class="promo-float" id="promo-float" hidden>
      <p>Aplique o código <button type="button" class="promo-float__code" data-copy="PRIMEIRACOMPRA" title="Copiar">PRIMEIRACOMPRA ${icon('copy')}</button> e ganhe <strong>10% OFF</strong></p>
      <button class="icon-btn" type="button" data-close-promo aria-label="Fechar">${icon('close')}</button>
    </div>
    <button class="back-to-top" type="button" aria-label="Voltar ao topo" data-top>${icon('arrowUp')}</button>
    <div class="cookie-bar" id="cookie-bar" hidden role="region" aria-label="Cookies">
      <p>Usamos cookies para melhorar sua experiência, personalizar conteúdo e analisar o tráfego. Saiba mais na nossa <a href="politicas.html#privacidade">Política de Privacidade</a>.</p>
      <div class="cookie-bar__actions"><button class="btn btn--outline btn--sm" data-cookie="essential">Somente essenciais</button><button class="btn btn--primary btn--sm" data-cookie="all">Aceitar todos</button></div>
    </div>`;
  }

  /* ---------------------------------------------------------
     Gavetas (drawers), busca e menu
     --------------------------------------------------------- */
  function openDrawer(id) {
    const d = document.getElementById(id); if (!d) return;
    d.classList.add('is-open'); d.setAttribute('aria-hidden', 'false'); lockScroll(true);
    const f = d.querySelector('button, a, input'); f && setTimeout(() => f.focus(), 50);
  }
  function closeDrawer(d) {
    if (!d || !d.classList.contains('is-open')) return;
    d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true'); lockScroll(false);
  }

  function renderMinicart() {
    const body = $('[data-minicart-body]'), foot = $('[data-minicart-foot]');
    if (!body) return;
    const t = cart.totals();
    const count = cart.count();
    $$('[data-cart-count-text]').forEach((el) => { el.textContent = count ? `(${count})` : ''; });
    if (!t.items.length) {
      body.innerHTML = `<div class="empty-state empty-state--sm">${icon('bag', 'empty-state__icon')}<p><strong>Sua sacola está vazia.</strong><br>Que tal adicionar algo especial?</p>
        <div class="empty-state__links"><a class="chip" href="produtos.html?cat=fragrancias">Fragrâncias</a><a class="chip" href="produtos.html?tag=best-seller">Best-Sellers</a><a class="chip" href="produtos.html?cat=corpo-banho">Cuidado Corporal</a></div>
        <button class="btn btn--outline" data-close-drawer>Continuar comprando</button></div>`;
      foot.innerHTML = '';
      return;
    }
    const pct = Math.min(100, ((t.subtotal - t.discount) / FREE_SHIPPING) * 100);
    body.innerHTML = `
      <div class="ship-progress ${t.freeLeft <= 0 ? 'is-done' : ''}">
        <p>${t.freeLeft > 0 ? `Faltam <strong>${money(t.freeLeft)}</strong> para você ganhar <strong>frete grátis</strong>!` : `${icon('check')} Parabéns! Você ganhou <strong>frete grátis</strong>.`}</p>
        <div class="ship-progress__bar"><span style="width:${pct}%"></span></div>
      </div>
      <ul class="mini-items">${t.items.map(lineItemHTML).join('')}</ul>`;
    const c = t.couponCode;
    foot.innerHTML = `
      <form class="coupon-form" data-coupon-form>
        ${c ? `<div class="coupon-applied">${icon('check')} Cupom <strong>${c}</strong> aplicado <button type="button" class="link" data-remove-coupon>Remover</button></div>`
          : `<label class="sr-only" for="mc-coupon">Código promocional</label><input id="mc-coupon" name="code" placeholder="Código promocional"><button class="btn btn--outline btn--sm" type="submit">Aplicar</button>`}
      </form>
      <dl class="summary-lines">
        <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
        ${t.discount ? `<div class="is-discount"><dt>Desconto</dt><dd>− ${money(t.discount)}</dd></div>` : ''}
        <div class="is-total"><dt>Total estimado</dt><dd>${money(t.subtotal - t.discount)}</dd></div>
      </dl>
      <a class="btn btn--primary btn--block" href="checkout.html">Finalizar compra</a>
      <a class="btn btn--outline btn--block" href="carrinho.html">Ver sacola completa</a>`;
  }

  function lineItemHTML(i, big = false) {
    const p = i.product, L = catalog.line(p.line);
    return `<li class="line-item ${big === true ? 'line-item--lg' : ''}" data-key="${esc(cart.key(i.id, i.size))}">
      <a class="line-item__img" href="produto.html?id=${p.id}"><img src="${productImg(p)}" alt="${esc(p.name)}"></a>
      <div class="line-item__info">
        <span class="line-item__line">${esc(L.name)}</span>
        <a class="line-item__name" href="produto.html?id=${p.id}">${esc(p.name)}</a>
        <span class="line-item__size">${esc(i.size)}</span>
        <div class="line-item__row">
          <div class="qty" data-qty data-id="${p.id}" data-size="${esc(i.size)}">
            <button type="button" data-qty-minus aria-label="Diminuir quantidade">${icon('minus')}</button>
            <input type="number" min="1" max="10" value="${i.qty}" aria-label="Quantidade" data-qty-input>
            <button type="button" data-qty-plus aria-label="Aumentar quantidade">${icon('plus')}</button>
          </div>
          <div class="line-item__price">${i.old > i.price ? `<del>${money(i.old * i.qty)}</del>` : ''}<strong>${money(i.total)}</strong></div>
        </div>
        ${big === true ? `<div class="line-item__actions"><button class="link" type="button" data-move-wish="${p.id}" data-size="${esc(i.size)}">${icon('heart')} Mover para favoritos</button></div>` : ''}
      </div>
      <button class="icon-btn line-item__remove" type="button" data-remove="${p.id}" data-size="${esc(i.size)}" aria-label="Remover ${esc(p.name)}">${icon('trash')}</button>
    </li>`;
  }

  function updateBadges() {
    const n = cart.count(), w = wishlist.items().length;
    $$('[data-cart-count]').forEach((b) => { b.textContent = n; b.hidden = !n; });
    $$('[data-wish-count]').forEach((b) => { b.textContent = w; b.hidden = !w; });
    const u = auth.current();
    $$('[data-account-label]').forEach((el) => { el.textContent = u ? 'Olá, ' + u.name.split(' ')[0] : 'Entrar'; });
    $$('[data-account-mobile]').forEach((el) => { el.textContent = u ? `Olá, ${u.name.split(' ')[0]} · Minha conta` : 'Entre ou cadastre-se'; });
  }

  function syncWishButtons() {
    $$('[data-wish]').forEach((b) => {
      const on = wishlist.has(b.dataset.wish);
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', `${on ? 'Remover dos' : 'Adicionar aos'} favoritos`);
    });
  }

  function openSearch() {
    const o = $('#search-overlay'); if (!o) return;
    o.classList.add('is-open'); o.setAttribute('aria-hidden', 'false'); lockScroll(true);
    const inp = $('#ovl-q'); const hdr = $('#hdr-q');
    if (hdr && hdr.value) inp.value = hdr.value;
    setTimeout(() => inp.focus(), 60);
    renderSearchResults(inp.value);
  }
  function closeSearch() {
    const o = $('#search-overlay'); if (!o || !o.classList.contains('is-open')) return;
    o.classList.remove('is-open'); o.setAttribute('aria-hidden', 'true'); lockScroll(false);
  }
  function renderSearchResults(q) {
    const box = $('[data-search-results]'); if (!box) return;
    if (!q || q.trim().length < 2) {
      const top = D.products.slice().sort((a, b) => b.sold - a.sold).slice(0, 4);
      box.innerHTML = `<p class="eyebrow">Mais procurados</p><div class="search-grid">${top.map(searchItem).join('')}</div>`;
      return;
    }
    const res = catalog.search(q);
    box.innerHTML = res.length
      ? `<p class="eyebrow">${res.length} produto${res.length > 1 ? 's' : ''} encontrado${res.length > 1 ? 's' : ''}</p><div class="search-grid">${res.slice(0, 8).map(searchItem).join('')}</div>
         <a class="btn btn--outline" href="produtos.html?q=${encodeURIComponent(q)}">Ver todos os resultados</a>`
      : `<p class="search-empty">Nenhum resultado para “${esc(q)}”. Tente outro termo ou navegue pelas categorias.</p>`;
  }
  const searchItem = (p) => `<a class="search-item" href="produto.html?id=${p.id}"><img src="${productImg(p)}" alt=""><span><small>${esc(catalog.line(p.line).name)}</small>${esc(p.name)}<strong>${money(p.sizes[0].price)}</strong></span></a>`;

  /* ---------------------------------------------------------
     Eventos globais (delegação)
     --------------------------------------------------------- */
  function addToCart(id, size, qty = 1, openMini = true) {
    const p = catalog.get(id); if (!p) return;
    cart.add(id, size, qty);
    toast(`${p.name} foi adicionado à sacola.`);
    if (openMini) openDrawer('minicart');
  }

  function bindGlobal() {
    document.addEventListener('click', async (e) => {
      const t = e.target;
      const add = t.closest('[data-add]');
      if (add) { e.preventDefault(); addToCart(add.dataset.add, add.dataset.size); return; }

      const w = t.closest('[data-wish]');
      if (w) {
        e.preventDefault();
        const on = wishlist.toggle(w.dataset.wish);
        toast(on ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.', on ? 'success' : 'info');
        return;
      }
      if (t.closest('[data-open-cart]')) { e.preventDefault(); openDrawer('minicart'); return; }
      if (t.closest('[data-open-menu]')) { e.preventDefault(); openDrawer('mobile-menu'); return; }
      if (t.closest('[data-close-drawer]')) { closeDrawer(t.closest('.drawer')); return; }
      if (t.closest('[data-close-search]')) { closeSearch(); return; }

      const rm = t.closest('[data-remove]');
      if (rm) {
        const p = catalog.get(rm.dataset.remove);
        const ok = await confirmDialog({ title: 'Remover produto?', text: `Tem certeza de que deseja remover <strong>${esc(p.name)}</strong> da sacola?`, ok: 'Sim, remover' });
        if (ok) { cart.remove(rm.dataset.remove, rm.dataset.size); toast('Produto removido da sacola.', 'info'); }
        return;
      }
      const mv = t.closest('[data-move-wish]');
      if (mv) {
        if (!wishlist.has(mv.dataset.moveWish)) wishlist.toggle(mv.dataset.moveWish);
        cart.remove(mv.dataset.moveWish, mv.dataset.size);
        toast('Produto movido para os favoritos.');
        return;
      }
      const qb = t.closest('[data-qty-minus],[data-qty-plus]');
      if (qb) {
        const q = qb.closest('[data-qty]'); const input = $('[data-qty-input]', q);
        let v = (+input.value || 1) + (qb.hasAttribute('data-qty-plus') ? 1 : -1);
        v = Math.max(q.dataset.id ? 0 : 1, Math.min(10, v));
        if (q.dataset.id) {
          if (v === 0) { const rmBtn = q.closest('.line-item').querySelector('[data-remove]'); rmBtn && rmBtn.click(); return; }
          cart.setQty(q.dataset.id, q.dataset.size, v);
        } else { input.value = v; input.dispatchEvent(new Event('change', { bubbles: true })); }
        return;
      }
      if (t.closest('[data-remove-coupon]')) { cart.removeCoupon(); toast('Cupom removido.', 'info'); return; }
      const cp = t.closest('[data-copy]');
      if (cp) {
        const txt = cp.dataset.copy;
        try { await navigator.clipboard.writeText(txt); } catch (err) { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (x) { /* noop */ } ta.remove(); }
        toast('Código copiado!');
        return;
      }
      if (t.closest('[data-close-promo]')) { $('#promo-float').hidden = true; store.set('promoClosed', true); return; }
      if (t.closest('[data-top]')) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const ck = t.closest('[data-cookie]');
      if (ck) { store.set('cookies', ck.dataset.cookie); $('#cookie-bar').hidden = true; showPromo(); return; }
      if (t.closest('[data-cookie-settings]')) { e.preventDefault(); store.remove('cookies'); $('#cookie-bar').hidden = false; return; }
    });

    document.addEventListener('change', (e) => {
      const inp = e.target.closest('[data-qty-input]');
      if (inp) {
        const q = inp.closest('[data-qty]');
        let v = Math.max(1, Math.min(10, parseInt(inp.value, 10) || 1));
        inp.value = v;
        if (q.dataset.id) cart.setQty(q.dataset.id, q.dataset.size, v);
      }
    });

    document.addEventListener('submit', (e) => {
      const f = e.target;
      if (f.matches('[data-coupon-form]')) {
        e.preventDefault();
        const code = f.code && f.code.value;
        if (!code) return;
        const r = cart.applyCoupon(code);
        toast(r.msg, r.ok ? 'success' : 'error');
      }
      if (f.matches('[data-newsletter]')) {
        e.preventDefault();
        const name = f.elements.namedItem('name'), email = f.elements.namedItem('email'), phone = f.elements.namedItem('phone');
        let ok = true;
        ok = fieldError(name, name.value.trim().length < 2 ? 'Informe seu nome.' : '') && ok;
        ok = fieldError(email, !validate.email(email.value) ? 'Informe um e-mail válido.' : '') && ok;
        if (phone.value) ok = fieldError(phone, !validate.phone(phone.value) ? 'Celular inválido.' : '') && ok;
        if (!ok) return;
        const list = store.get('newsletter', []);
        list.push({ name: name.value, email: email.value, phone: phone.value, date: new Date().toISOString() });
        store.set('newsletter', list);
        f.innerHTML = `<div class="newsletter__success">${icon('check')}<p><strong>Seu cadastro foi realizado com sucesso!</strong><br>Use o cupom <button type="button" class="promo-float__code" data-copy="PRIMEIRACOMPRA">PRIMEIRACOMPRA ${icon('copy')}</button> na sua primeira compra.</p></div>`;
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { $$('.drawer.is-open').forEach(closeDrawer); closeSearch(); }
    });

    // Busca
    const hdrQ = $('#hdr-q');
    if (hdrQ) {
      hdrQ.addEventListener('focus', () => { if (window.matchMedia('(min-width: 1024px)').matches) openSearch(); });
      hdrQ.addEventListener('click', openSearch);
    }
    const ovlQ = $('#ovl-q');
    if (ovlQ) ovlQ.addEventListener('input', debounce(() => renderSearchResults(ovlQ.value), 180));

    document.addEventListener('cart:change', () => { updateBadges(); renderMinicart(); });
    document.addEventListener('wish:change', () => { updateBadges(); syncWishButtons(); });
    document.addEventListener('auth:change', updateBadges);
    window.addEventListener('storage', () => { updateBadges(); renderMinicart(); syncWishButtons(); });

    // Header sticky / back to top
    const header = $('#site-header'), top = $('[data-top]');
    const onScroll = () => {
      const y = window.scrollY;
      header && header.classList.toggle('is-scrolled', y > 40);
      top && top.classList.toggle('is-visible', y > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // Barra de avisos rotativa
    const msgs = $$('.topbar__msg');
    if (msgs.length > 1) {
      let i = 0;
      setInterval(() => { msgs[i].classList.remove('is-active'); i = (i + 1) % msgs.length; msgs[i].classList.add('is-active'); }, 4500);
    }

    // Footer: colunas abertas no desktop, acordeão no mobile
    const mq = window.matchMedia('(min-width: 768px)');
    const syncFooter = () => $$('[data-footer-col]').forEach((d) => { d.open = mq.matches; });
    mq.addEventListener ? mq.addEventListener('change', syncFooter) : mq.addListener(syncFooter);
    syncFooter();

    // Cookies primeiro; a promo flutuante só aparece depois (evita sobreposição)
    const cb = $('#cookie-bar');
    if (cb && !store.get('cookies', null)) cb.hidden = false; else showPromo();
  }

  function showPromo() {
    const promo = $('#promo-float');
    if (promo && !store.get('promoClosed', false)) setTimeout(() => { promo.hidden = false; }, 2500);
  }

  /* Revela elementos ao rolar */
  function initReveal(root = document) {
    const els = $$('[data-reveal]', root);
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /* Vistos recentemente */
  const recent = {
    add(id) { const r = store.get('recent', []).filter((x) => x !== id); r.unshift(id); store.set('recent', r.slice(0, 12)); },
    list: (exclude) => store.get('recent', []).filter((x) => x !== exclude).map(catalog.get).filter(Boolean)
  };

  /* ---------------------------------------------------------
     Inicialização
     --------------------------------------------------------- */
  /** Renderiza cenas declaradas em HTML: data-scene='{"bg":"#..","product":"BR001"}' */
  function renderScenes(root = document) {
    $$('[data-scene]', root).forEach((el) => {
      let cfg = {};
      try { cfg = JSON.parse(el.dataset.scene); } catch (e) { return; }
      const target = el.hasAttribute('data-scene-target') ? el : el.querySelector('[data-scene-target]');
      if (!target || target.dataset.rendered) return;
      if (cfg.product) cfg.product = catalog.get(cfg.product);
      target.innerHTML = scene(cfg);
      target.dataset.rendered = '1';
    });
  }

  let ready = false;
  const readyQueue = [];
  /** Executa fn depois que header/footer e eventos globais estiverem prontos */
  function onReady(fn) { if (ready) fn(); else readyQueue.push(fn); }

  function init() {
    renderHeader();
    renderFooter();
    bindGlobal();
    updateBadges();
    renderMinicart();
    ready = true;
    readyQueue.splice(0).forEach((fn) => fn());
    renderScenes();
    bindMasks();
    initCarousels();
    initReveal();
  }

  window.BR = {
    ready: onReady, $, $$, money, esc, param, debounce, norm, onlyDigits, store, icon, emit,
    catalog, installments, productImg, productPhoto, productSVG, mix, scene, renderScenes,
    cart, wishlist, auth, orders, recent, shippingOptions, lookupCEP,
    masks, bindMasks, validate, cardBrand, fieldError,
    stars, tagsHTML, priceHTML, productCard, carouselHTML, initCarousels, initReveal, lineItemHTML,
    toast, confirm: confirmDialog, openModal, openDrawer, closeDrawer, addToCart, lockScroll,
    FREE_SHIPPING, GIFT_WRAP_PRICE, PIX_DISCOUNT, MAX_INSTALLMENTS
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
