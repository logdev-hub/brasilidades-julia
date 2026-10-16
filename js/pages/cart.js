/* Brasilidades — Sacola completa */
BR.ready(function () {
  const { $, $$, cart, money, esc, icon, lineItemHTML, carouselHTML, initCarousels, catalog, productImg } = BR;
  const host = $('[data-cart]');

  /** Bloco de resumo reaproveitado (sacola) */
  function summaryHTML(t) {
    const sh = cart.shipping();
    const opts = sh ? BR.shippingOptions(sh.cep, t.subtotal) : [];
    const inst = BR.installments(t.total);
    return `
      <div class="panel summary">
        <h2 class="panel__title">Resumo do pedido</h2>

        <p class="label" style="margin-bottom:8px">Calcular frete</p>
        <form class="input-group" data-cep-form style="margin-bottom:12px">
          <label class="sr-only" for="cart-cep">CEP</label>
          <input id="cart-cep" name="cep" placeholder="00000-000" data-mask="cep" inputmode="numeric" value="${esc(sh ? sh.cep : '')}">
          <button class="btn btn--dark btn--sm" type="submit">OK</button>
        </form>
        ${opts.length ? `<div class="option-list" style="margin-bottom:16px">${opts.map((o) => `
          <label class="option"><input type="radio" name="ship" value="${o.id}" ${sh.option === o.id ? 'checked' : ''} data-ship-opt>
            <span class="option__body"><strong>${esc(o.name)}</strong><small>${esc(o.days)}</small></span>
            <span class="option__price ${o.price ? '' : 'free'}">${o.price ? money(o.price) : 'Grátis'}</span></label>`).join('')}</div>` : ''}

        <p class="label" style="margin-bottom:8px">Cupom de desconto</p>
        <form class="coupon-form" data-coupon-form style="margin-bottom:20px">
          ${t.couponCode ? `<div class="coupon-applied">${icon('check')} Cupom <strong>${esc(t.couponCode)}</strong> aplicado <button type="button" class="link" data-remove-coupon>Remover</button></div>`
            : `<label class="sr-only" for="cart-coupon">Código promocional</label><input id="cart-coupon" name="code" placeholder="Digite seu cupom"><button class="btn btn--outline btn--sm" type="submit">Aplicar</button>`}
        </form>

        <dl class="summary-lines">
          <div><dt>Subtotal (${cart.count()} ${cart.count() > 1 ? 'itens' : 'item'})</dt><dd>${money(t.subtotal)}</dd></div>
          ${t.discount ? `<div class="is-discount"><dt>Desconto (${esc(t.couponCode)})</dt><dd>− ${money(t.discount)}</dd></div>` : ''}
          <div><dt>Frete</dt><dd>${t.shippingKnown ? (t.shipping ? money(t.shipping) : 'Grátis') : '<small>Calcule acima</small>'}</dd></div>
          ${t.gift ? `<div><dt>Embalagem para presente</dt><dd>${money(t.gift)}</dd></div>` : ''}
          <div class="is-total"><dt>Total</dt><dd>${money(t.total)}<small>${inst.n > 1 ? `ou ${inst.n}x de ${money(inst.value)} sem juros` : ''}</small><small style="color:var(--c-success)">${money(t.total * (1 - BR.PIX_DISCOUNT))} no Pix</small></dd></div>
        </dl>
        <a class="btn btn--primary btn--block btn--lg" href="checkout.html">Finalizar compra</a>
        <a class="btn btn--outline btn--block" href="produtos.html">Continuar comprando</a>
        <p class="summary__secure">${icon('lock')} Compra 100% segura</p>
      </div>`;
  }

  function render() {
    const t = cart.totals();
    const n = cart.count();
    $('[data-cart-sub]').textContent = n ? `${n} ${n > 1 ? 'itens' : 'item'} na sua sacola` : '';
    if (!t.items.length) {
      host.innerHTML = `<div class="panel empty-state" style="margin-bottom:64px">${icon('bag', 'empty-state__icon')}<h2>Sua sacola está vazia</h2><p>Que tal adicionar algo especial? Explore nossos best-sellers ou encontre o presente perfeito.</p><div class="empty-state__links"><a class="chip" href="produtos.html?cat=fragrancias">Fragrâncias</a><a class="chip" href="produtos.html?tag=best-seller">Best-Sellers</a><a class="chip" href="produtos.html?cat=corpo-banho">Cuidado Corporal</a><a class="chip" href="produtos.html?cat=presentes">Presentes</a></div><a class="btn btn--primary" href="produtos.html">Começar a comprar</a></div>`;
      return;
    }
    const gift = cart.gift();
    const chosen = cart.samples();
    const pct = Math.min(100, ((t.subtotal - t.discount) / BR.FREE_SHIPPING) * 100);
    host.innerHTML = `<div class="cart-layout">
      <div>
        <div class="panel">
          <div class="ship-progress ${t.freeLeft <= 0 ? 'is-done' : ''}">
            <p>${t.freeLeft > 0 ? `Faltam <strong>${money(t.freeLeft)}</strong> para você ganhar <strong>frete grátis</strong>!` : `${icon('check')} Parabéns! Você ganhou <strong>frete grátis</strong> na entrega econômica.`}</p>
            <div class="ship-progress__bar"><span style="width:${pct}%"></span></div>
          </div>
          <ul class="mini-items">${t.items.map((i) => lineItemHTML(i, true)).join('')}</ul>
        </div>

        <div class="panel">
          <h2 class="panel__title">${icon('sample')} Escolha 3 amostras grátis</h2>
          <p class="muted" style="font-size:14px">Selecionadas: <strong data-sample-count>${chosen.length}</strong>/3</p>
          <div class="samples">${BR_DATA.samples.map((s) => {
            const pr = BR_DATA.products.find((p) => p.line === s.line) || BR_DATA.products[0];
            const on = chosen.includes(s.id);
            return `<label class="sample ${!on && chosen.length >= 3 ? 'is-disabled' : ''}"><input type="checkbox" value="${s.id}" ${on ? 'checked' : ''} data-sample><img src="${productImg(pr, true)}" alt=""><span>${esc(s.name)}</span></label>`;
          }).join('')}</div>
        </div>

        <div class="panel">
          <h2 class="panel__title">${icon('gift')} É para presente?</h2>
          <label class="check"><input type="checkbox" data-gift ${gift.on ? 'checked' : ''}><span>Adicionar embalagem para presente com laço e cartão (${money(BR.GIFT_WRAP_PRICE)})</span></label>
          <div class="field" ${gift.on ? '' : 'hidden'} data-gift-msg-wrap>
            <label for="gift-msg">Mensagem do cartão <small>(opcional, até 200 caracteres)</small></label>
            <textarea id="gift-msg" maxlength="200" data-gift-msg placeholder="Escreva sua mensagem…">${esc(gift.msg)}</textarea>
          </div>
        </div>
      </div>
      <aside>${summaryHTML(t)}</aside>
    </div>`;
    BR.bindMasks(host);
  }

  host.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-cep-form]')) return;
    e.preventDefault();
    const input = e.target.elements.namedItem('cep');
    if (!BR.validate.cep(input.value)) { BR.fieldError(input, 'CEP inválido.'); return; }
    cart.setShipping({ cep: input.value, option: (cart.shipping() || {}).option || 'economica' });
  });
  host.addEventListener('change', (e) => {
    if (e.target.matches('[data-ship-opt]')) cart.setShipping({ ...cart.shipping(), option: e.target.value });
    if (e.target.matches('[data-gift]')) cart.setGift({ ...cart.gift(), on: e.target.checked });
    if (e.target.matches('[data-sample]')) {
      const sel = $$('[data-sample]:checked', host).map((i) => i.value);
      cart.setSamples(sel);
      $('[data-sample-count]').textContent = Math.min(3, sel.length);
      $$('.sample', host).forEach((l) => { const i = $('input', l); l.classList.toggle('is-disabled', !i.checked && sel.length >= 3); });
    }
  });
  host.addEventListener('input', BR.debounce((e) => {
    if (e.target.matches('[data-gift-msg]')) BR.store.set('gift', { ...cart.gift(), msg: e.target.value });
  }, 300));

  document.addEventListener('cart:change', render);
  render();

  // Sugestões
  const inCart = cart.items().map((i) => i.id);
  const sug = catalog.all().filter((p) => !inCart.includes(p.id)).sort((a, b) => b.sold - a.sold).slice(0, 10);
  $('[data-suggestions]').innerHTML = carouselHTML(sug, { label: 'Sugestões' });
  initCarousels();
});
