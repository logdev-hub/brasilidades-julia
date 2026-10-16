/* Brasilidades — Checkout em etapas
   Observação: esta é uma loja demonstrativa. Nenhum dado de cartão
   é enviado ou armazenado (apenas bandeira e 4 últimos dígitos).
   Em produção, integre um gateway de pagamento (ex.: tokenização no front). */
BR.ready(function () {
  const { $, $$, cart, money, esc, icon, validate, fieldError, productImg, store, auth } = BR;
  const host = $('[data-checkout]');

  if (!cart.items().length) {
    host.innerHTML = `<div class="panel empty-state" style="margin-bottom:64px">${icon('bag', 'empty-state__icon')}<h2>Sua sacola está vazia</h2><p>Adicione produtos para finalizar a compra.</p><a class="btn btn--primary" href="produtos.html">Ver produtos</a></div>`;
    return;
  }

  const user = auth.current();
  const saved = store.get('checkout', {});
  const data = {
    customer: saved.customer || { email: user ? user.email : '', name: user ? user.name : '', cpf: user ? user.cpf : '', phone: user ? user.phone : '', news: true },
    delivery: saved.delivery || { mode: 'casa', cep: (cart.shipping() || {}).cep || '', street: '', number: '', comp: '', district: '', city: '', uf: '', recipient: '', option: (cart.shipping() || {}).option === 'expressa' ? 'expressa' : 'economica', store: '' },
    payment: { method: 'card', installments: 1 }
  };
  let step = 1;
  const persist = () => store.set('checkout', { customer: data.customer, delivery: data.delivery });

  host.innerHTML = `<div class="cart-layout">
    <div>
      <ol class="steps" aria-label="Etapas">
        <li class="step" data-step-ind="1">Identificação</li><li class="step" data-step-ind="2">Entrega</li>
        <li class="step" data-step-ind="3">Pagamento</li><li class="step" data-step-ind="4">Revisão</li>
      </ol>

      <!-- 1. Identificação -->
      <form class="panel checkout-step" data-step="1" novalidate>
        <h2 class="panel__title">${icon('user')} Identificação</h2>
        ${user ? `<div class="login-hint">${icon('check')} Você está comprando como <strong>${esc(user.name)}</strong>.</div>`
          : `<div class="login-hint">${icon('user')} Já tem cadastro? <a class="link" href="conta.html?next=checkout.html">Entre na sua conta</a> para agilizar.</div>`}
        <div class="field"><label for="ck-email">E-mail</label><input id="ck-email" name="email" type="email" autocomplete="email" value="${esc(data.customer.email)}" required></div>
        <div class="field"><label for="ck-name">Nome completo</label><input id="ck-name" name="name" autocomplete="name" value="${esc(data.customer.name)}" required></div>
        <div class="form-row form-row--2">
          <div class="field"><label for="ck-cpf">CPF</label><input id="ck-cpf" name="cpf" data-mask="cpf" inputmode="numeric" value="${esc(data.customer.cpf)}" required></div>
          <div class="field"><label for="ck-phone">Celular</label><input id="ck-phone" name="phone" data-mask="phone" inputmode="tel" autocomplete="tel" value="${esc(data.customer.phone)}" required></div>
        </div>
        <label class="check"><input type="checkbox" name="news" ${data.customer.news ? 'checked' : ''}><span>Quero receber novidades e ofertas exclusivas por e-mail e WhatsApp.</span></label>
        <div class="checkout-actions"><a class="btn btn--outline" href="carrinho.html">Voltar à sacola</a><button class="btn btn--primary" type="submit">Continuar</button></div>
      </form>

      <!-- 2. Entrega -->
      <form class="panel checkout-step" data-step="2" novalidate>
        <h2 class="panel__title">${icon('truck')} Entrega</h2>
        <div class="option-list" style="margin-bottom:20px">
          <label class="option"><input type="radio" name="mode" value="casa" ${data.delivery.mode === 'casa' ? 'checked' : ''}>${icon('truck')}<span class="option__body"><strong>Receber em casa</strong><small>Entrega econômica ou expressa</small></span></label>
          <label class="option"><input type="radio" name="mode" value="loja" ${data.delivery.mode === 'loja' ? 'checked' : ''}>${icon('store')}<span class="option__body"><strong>Retirar grátis em uma loja</strong><small>Pronto em até 2 dias úteis</small></span><span class="option__price free">Grátis</span></label>
        </div>

        <div data-mode="casa">
          ${user && user.addresses && user.addresses.length ? `<div class="field"><label for="ck-saved">Endereços salvos</label><select id="ck-saved" data-saved-address><option value="">Usar novo endereço</option>${user.addresses.map((a, i) => `<option value="${i}">${esc(a.street)}, ${esc(a.number)} — ${esc(a.city)}/${esc(a.uf)}</option>`).join('')}</select></div>` : ''}
          <div class="form-row form-row--cep">
            <div class="field"><label for="ck-cep">CEP</label><input id="ck-cep" name="cep" data-mask="cep" inputmode="numeric" autocomplete="postal-code" value="${esc(data.delivery.cep)}"></div>
            <div class="field"><label for="ck-street">Endereço</label><input id="ck-street" name="street" autocomplete="address-line1" value="${esc(data.delivery.street)}"></div>
          </div>
          <div class="form-row form-row--3">
            <div class="field"><label for="ck-number">Número</label><input id="ck-number" name="number" value="${esc(data.delivery.number)}"></div>
            <div class="field"><label for="ck-comp">Complemento</label><input id="ck-comp" name="comp" placeholder="Opcional" value="${esc(data.delivery.comp)}"></div>
            <div class="field"><label for="ck-district">Bairro</label><input id="ck-district" name="district" value="${esc(data.delivery.district)}"></div>
          </div>
          <div class="form-row form-row--2">
            <div class="field"><label for="ck-city">Cidade</label><input id="ck-city" name="city" autocomplete="address-level2" value="${esc(data.delivery.city)}"></div>
            <div class="field"><label for="ck-uf">Estado</label><select id="ck-uf" name="uf"><option value="">Selecione</option>${'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ').map((u) => `<option ${data.delivery.uf === u ? 'selected' : ''}>${u}</option>`).join('')}</select></div>
          </div>
          <div class="field"><label for="ck-recipient">Nome do destinatário</label><input id="ck-recipient" name="recipient" value="${esc(data.delivery.recipient || data.customer.name)}"></div>
          <p class="label" style="margin-bottom:8px">Forma de envio</p>
          <div class="option-list" data-ship-options><p class="muted" style="font-size:14px">Informe o CEP para ver as opções de entrega.</p></div>
        </div>

        <div data-mode="loja" hidden>
          <div class="field"><label for="ck-store">Escolha a loja</label><select id="ck-store" name="store"><option value="">Selecione uma loja</option>${BR_DATA.stores.map((s) => `<option value="${s.id}" ${String(data.delivery.store) === String(s.id) ? 'selected' : ''}>${esc(s.name)} — ${esc(s.city)}/${s.uf}</option>`).join('')}</select></div>
          <p class="muted" style="font-size:13px">Você receberá um e-mail quando o pedido estiver pronto para retirada. Apresente um documento com foto.</p>
        </div>

        <div class="checkout-actions"><button class="btn btn--outline" type="button" data-back>Voltar</button><button class="btn btn--primary" type="submit">Continuar</button></div>
      </form>

      <!-- 3. Pagamento -->
      <form class="panel checkout-step" data-step="3" novalidate>
        <h2 class="panel__title">${icon('card')} Pagamento</h2>
        <div class="pay-tabs" role="tablist">
          <button class="pay-tab" type="button" role="tab" data-pay="card" aria-selected="true">${icon('card')}Cartão<small>até ${BR.MAX_INSTALLMENTS}x sem juros</small></button>
          <button class="pay-tab" type="button" role="tab" data-pay="pix" aria-selected="false"><svg class="icon" viewBox="0 0 24 24"><path d="M12 2 2 12l10 10 10-10z"/><path d="m7 12 5-5 5 5-5 5z"/></svg>Pix<small>5% OFF</small></button>
          <button class="pay-tab" type="button" role="tab" data-pay="boleto" aria-selected="false"><svg class="icon" viewBox="0 0 24 24"><path d="M4 5v14M7 5v14M10 5v14M14 5v14M16 5v14M20 5v14"/></svg>Boleto<small>&nbsp;</small></button>
        </div>
        <div class="pay-panel is-active" data-pay-panel="card">
          <div class="card-preview" aria-hidden="true">
            <span class="card-preview__brand" data-cp-brand></span>
            <span class="card-preview__num" data-cp-num>•••• •••• •••• ••••</span>
            <div class="card-preview__row"><span data-cp-name>NOME IMPRESSO</span><span data-cp-exp>MM/AA</span></div>
          </div>
          <div class="field"><label for="cc-num">Número do cartão</label><input id="cc-num" name="ccnum" data-mask="card" inputmode="numeric" autocomplete="cc-number"></div>
          <div class="field"><label for="cc-name">Nome impresso no cartão</label><input id="cc-name" name="ccname" autocomplete="cc-name"></div>
          <div class="form-row form-row--2">
            <div class="field"><label for="cc-exp">Validade</label><input id="cc-exp" name="ccexp" data-mask="exp" placeholder="MM/AA" inputmode="numeric" autocomplete="cc-exp"></div>
            <div class="field"><label for="cc-cvv">CVV</label><input id="cc-cvv" name="cccvv" data-mask="cvv" inputmode="numeric" autocomplete="cc-csc"></div>
          </div>
          <div class="field"><label for="cc-inst">Parcelamento</label><select id="cc-inst" name="installments" data-installments></select></div>
        </div>
        <div class="pay-panel" data-pay-panel="pix">
          <div class="pix-box"><p><strong>Pague com Pix e ganhe 5% de desconto!</strong></p><p class="muted" style="font-size:14px">O QR Code será exibido após a finalização do pedido. A aprovação é imediata e o código expira em 30 minutos.</p></div>
        </div>
        <div class="pay-panel" data-pay-panel="boleto">
          <div class="pix-box"><p><strong>Boleto bancário</strong></p><p class="muted" style="font-size:14px">O boleto vence em 3 dias úteis. A confirmação do pagamento pode levar até 2 dias úteis após a quitação.</p></div>
        </div>
        <div class="checkout-actions"><button class="btn btn--outline" type="button" data-back>Voltar</button><button class="btn btn--primary" type="submit">Revisar pedido</button></div>
      </form>

      <!-- 4. Revisão -->
      <form class="panel checkout-step" data-step="4" novalidate>
        <h2 class="panel__title">${icon('check')} Revise seu pedido</h2>
        <div data-review></div>
        <label class="check" style="margin-top:16px"><input type="checkbox" name="terms" required><span>Li e concordo com os <a class="link" href="politicas.html#termos" target="_blank">Termos e Condições</a> e a <a class="link" href="politicas.html#privacidade" target="_blank">Política de Privacidade</a>.</span></label>
        <div class="checkout-actions"><button class="btn btn--outline" type="button" data-back>Voltar</button><button class="btn btn--primary btn--lg" type="submit" data-place>${icon('lock')} Finalizar pedido</button></div>
      </form>
    </div>
    <aside data-summary></aside>
  </div>`;

  BR.bindMasks(host);
  const form = (n) => $(`[data-step="${n}"]`, host);
  const el = (n, name) => form(n).elements.namedItem(name);

  /* ---------- Navegação entre etapas ---------- */
  function goStep(n) {
    step = n;
    $$('.checkout-step', host).forEach((f) => f.classList.toggle('is-active', +f.dataset.step === n));
    $$('[data-step-ind]', host).forEach((s) => {
      const k = +s.dataset.stepInd;
      s.classList.toggle('is-active', k === n); s.classList.toggle('is-done', k < n);
      if (k === n) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
    });
    if (n === 4) renderReview();
    renderSummary();
    window.scrollTo({ top: host.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
  }
  host.addEventListener('click', (e) => {
    if (e.target.closest('[data-back]')) goStep(Math.max(1, step - 1));
    const ed = e.target.closest('[data-edit]'); if (ed) goStep(+ed.dataset.edit);
    const pt = e.target.closest('[data-pay]');
    if (pt) {
      data.payment.method = pt.dataset.pay;
      $$('[data-pay]', host).forEach((b) => b.setAttribute('aria-selected', b === pt));
      $$('[data-pay-panel]', host).forEach((p) => p.classList.toggle('is-active', p.dataset.payPanel === pt.dataset.pay));
      renderSummary(); renderInstallments();
    }
  });

  /* ---------- Etapa 1 ---------- */
  form(1).addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    ok = fieldError(el(1, 'email'), validate.email(el(1, 'email').value) ? '' : 'Informe um e-mail válido.') && ok;
    ok = fieldError(el(1, 'name'), el(1, 'name').value.trim().split(/\s+/).length >= 2 ? '' : 'Informe nome e sobrenome.') && ok;
    ok = fieldError(el(1, 'cpf'), validate.cpf(el(1, 'cpf').value) ? '' : 'CPF inválido.') && ok;
    ok = fieldError(el(1, 'phone'), validate.phone(el(1, 'phone').value) ? '' : 'Celular inválido.') && ok;
    if (!ok) { const inv = $('[aria-invalid=true]', form(1)); inv && inv.focus(); return; }
    Object.assign(data.customer, { email: el(1, 'email').value.trim(), name: el(1, 'name').value.trim(), cpf: el(1, 'cpf').value, phone: el(1, 'phone').value, news: el(1, 'news').checked });
    if (!el(2, 'recipient').value) el(2, 'recipient').value = data.customer.name;
    persist(); goStep(2);
  });

  /* ---------- Etapa 2 ---------- */
  const syncMode = () => {
    const mode = form(2).querySelector('[name=mode]:checked').value;
    data.delivery.mode = mode;
    $$('[data-mode]', form(2)).forEach((b) => { b.hidden = b.dataset.mode !== mode; });
    renderShipOptions(); renderSummary();
  };
  function renderShipOptions() {
    const box = $('[data-ship-options]', host);
    const opts = BR.shippingOptions(el(2, 'cep').value, cart.subtotal()).filter((o) => o.id !== 'retira');
    if (!opts.length) { box.innerHTML = '<p class="muted" style="font-size:14px">Informe o CEP para ver as opções de entrega.</p>'; return; }
    if (!opts.some((o) => o.id === data.delivery.option)) data.delivery.option = 'economica';
    box.innerHTML = opts.map((o) => `<label class="option"><input type="radio" name="option" value="${o.id}" ${data.delivery.option === o.id ? 'checked' : ''}><span class="option__body"><strong>${esc(o.name)}</strong><small>${esc(o.days)}</small></span><span class="option__price ${o.price ? '' : 'free'}">${o.price ? money(o.price) : 'Grátis'}</span></label>`).join('');
  }
  async function fillCEP() {
    const cep = el(2, 'cep');
    if (!validate.cep(cep.value)) return;
    fieldError(cep, '');
    data.delivery.cep = cep.value;
    renderShipOptions(); syncCartShipping(); renderSummary();
    const a = await BR.lookupCEP(cep.value);
    if (a) {
      if (a.logradouro) el(2, 'street').value = a.logradouro;
      if (a.bairro) el(2, 'district').value = a.bairro;
      el(2, 'city').value = a.localidade || ''; el(2, 'uf').value = a.uf || '';
      el(2, 'number').focus();
    }
  }
  const syncCartShipping = () => {
    if (data.delivery.mode === 'loja') cart.setShipping({ cep: data.delivery.cep || '01000-000', option: 'retira' });
    else if (validate.cep(data.delivery.cep)) cart.setShipping({ cep: data.delivery.cep, option: data.delivery.option });
    else cart.setShipping(null);
  };
  form(2).addEventListener('change', (e) => {
    if (e.target.name === 'mode') { syncMode(); syncCartShipping(); }
    if (e.target.name === 'option') { data.delivery.option = e.target.value; syncCartShipping(); renderSummary(); }
    if (e.target.matches('[data-saved-address]') && e.target.value !== '') {
      const a = user.addresses[+e.target.value];
      ['cep', 'street', 'number', 'comp', 'district', 'city', 'uf', 'recipient'].forEach((k) => { if (el(2, k)) el(2, k).value = a[k] || ''; });
      fillCEP();
    }
  });
  el(2, 'cep').addEventListener('input', () => { if (BR.onlyDigits(el(2, 'cep').value).length === 8) fillCEP(); });
  form(2).addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    if (data.delivery.mode === 'casa') {
      ok = fieldError(el(2, 'cep'), validate.cep(el(2, 'cep').value) ? '' : 'CEP inválido.') && ok;
      ['street', 'number', 'district', 'city', 'recipient'].forEach((k) => { ok = fieldError(el(2, k), el(2, k).value.trim() ? '' : 'Campo obrigatório.') && ok; });
      ok = fieldError(el(2, 'uf'), el(2, 'uf').value ? '' : 'Selecione o estado.') && ok;
      ['cep', 'street', 'number', 'comp', 'district', 'city', 'uf', 'recipient'].forEach((k) => { data.delivery[k] = el(2, k).value.trim(); });
    } else {
      ok = fieldError(el(2, 'store'), el(2, 'store').value ? '' : 'Selecione uma loja.') && ok;
      data.delivery.store = el(2, 'store').value;
    }
    if (!ok) { const inv = $('[aria-invalid=true]', form(2)); inv && inv.focus(); return; }
    syncCartShipping(); persist(); goStep(3);
  });

  /* ---------- Etapa 3 ---------- */
  function renderInstallments() {
    const total = cart.totals('card').total;
    const max = BR.installments(total).n;
    const sel = $('[data-installments]', host);
    sel.innerHTML = Array.from({ length: max }, (_, i) => `<option value="${i + 1}">${i + 1}x de ${money(total / (i + 1))} sem juros${i === 0 ? ' (à vista)' : ''}</option>`).join('');
    sel.value = Math.min(data.payment.installments, max);
  }
  const updatePreview = () => {
    const num = el(3, 'ccnum').value;
    const mask = '•••• •••• •••• ••••';
    $('[data-cp-num]', host).textContent = num + mask.slice(num.length);
    $('[data-cp-brand]', host).textContent = BR.cardBrand(num);
    $('[data-cp-name]', host).textContent = el(3, 'ccname').value.toUpperCase() || 'NOME IMPRESSO';
    $('[data-cp-exp]', host).textContent = el(3, 'ccexp').value || 'MM/AA';
  };
  ['ccnum', 'ccname', 'ccexp'].forEach((n) => el(3, n).addEventListener('input', updatePreview));
  form(3).addEventListener('submit', (e) => {
    e.preventDefault();
    if (data.payment.method === 'card') {
      let ok = true;
      ok = fieldError(el(3, 'ccnum'), validate.luhn(el(3, 'ccnum').value) ? '' : 'Número de cartão inválido.') && ok;
      ok = fieldError(el(3, 'ccname'), el(3, 'ccname').value.trim().length >= 3 ? '' : 'Informe o nome impresso.') && ok;
      ok = fieldError(el(3, 'ccexp'), validate.exp(el(3, 'ccexp').value) ? '' : 'Validade inválida.') && ok;
      ok = fieldError(el(3, 'cccvv'), BR.onlyDigits(el(3, 'cccvv').value).length >= 3 ? '' : 'CVV inválido.') && ok;
      if (!ok) { const inv = $('[aria-invalid=true]', form(3)); inv && inv.focus(); return; }
      const d = BR.onlyDigits(el(3, 'ccnum').value);
      data.payment.brand = BR.cardBrand(d) || 'Cartão';
      data.payment.last4 = d.slice(-4);
      data.payment.installments = +el(3, 'installments').value || 1;
    }
    goStep(4);
  });

  /* ---------- Etapa 4 ---------- */
  function deliveryText() {
    const d = data.delivery;
    if (d.mode === 'loja') { const s = BR_DATA.stores.find((x) => String(x.id) === String(d.store)); return s ? `Retirada em <strong>${esc(s.name)}</strong><br>${esc(s.address)} — ${esc(s.city)}/${s.uf}` : ''; }
    const opt = BR.shippingOptions(d.cep, cart.subtotal()).find((o) => o.id === d.option);
    return `${esc(d.recipient)}<br>${esc(d.street)}, ${esc(d.number)}${d.comp ? ' — ' + esc(d.comp) : ''}<br>${esc(d.district)} · ${esc(d.city)}/${esc(d.uf)} · CEP ${esc(d.cep)}${opt ? `<br><strong>${esc(opt.name)}</strong> · ${esc(opt.days)}` : ''}`;
  }
  function paymentText() {
    const p = data.payment, t = cart.totals(p.method);
    if (p.method === 'pix') return `Pix · ${money(t.total)} (5% OFF aplicado)`;
    if (p.method === 'boleto') return `Boleto bancário · ${money(t.total)}`;
    return `${esc(p.brand)} final ${esc(p.last4)} · ${p.installments}x de ${money(t.total / p.installments)}`;
  }
  function renderReview() {
    const c = data.customer;
    $('[data-review]', host).innerHTML = `
      <div class="review-block"><div><h4>Identificação</h4><p>${esc(c.name)}<br>${esc(c.email)} · ${esc(c.phone)}</p></div><button class="link" type="button" data-edit="1">Editar</button></div>
      <div class="review-block"><div><h4>Entrega</h4><p>${deliveryText()}</p></div><button class="link" type="button" data-edit="2">Editar</button></div>
      <div class="review-block"><div><h4>Pagamento</h4><p>${paymentText()}</p></div><button class="link" type="button" data-edit="3">Editar</button></div>
      ${cart.samples().length ? `<div class="review-block"><div><h4>Amostras grátis</h4><p>${cart.samples().map((id) => esc((BR_DATA.samples.find((s) => s.id === id) || {}).name)).join('<br>')}</p></div><a class="link" href="carrinho.html">Alterar</a></div>` : ''}
      ${cart.gift().on ? `<div class="review-block"><div><h4>Embalagem para presente</h4><p>${esc(cart.gift().msg || 'Sem mensagem')}</p></div><a class="link" href="carrinho.html">Alterar</a></div>` : ''}`;
  }
  form(4).addEventListener('submit', (e) => {
    e.preventDefault();
    const terms = el(4, 'terms');
    if (!terms.checked) { BR.toast('Aceite os termos para continuar.', 'error'); terms.focus(); return; }
    const btn = $('[data-place]', host); btn.classList.add('is-loading'); btn.innerHTML = 'Processando…';
    setTimeout(() => {
      const t = cart.totals(data.payment.method);
      const order = BR.orders.create({
        customer: { ...data.customer },
        delivery: { ...data.delivery },
        payment: { ...data.payment },
        items: t.items.map((i) => ({ id: i.id, name: i.product.name, size: i.size, qty: i.qty, price: i.price })),
        totals: { subtotal: t.subtotal, discount: t.discount, coupon: t.couponCode, shipping: t.shipping, gift: t.gift, pixDiscount: t.pixDiscount, total: t.total },
        samples: cart.samples(), gift: cart.gift(),
        status: data.payment.method === 'card' ? 'Pagamento aprovado' : 'Aguardando pagamento'
      });
      // Salva endereço na conta
      if (user && data.delivery.mode === 'casa') {
        const addrs = user.addresses || [];
        const key = (a) => [a.cep, a.number].join('|');
        if (!addrs.some((a) => key(a) === key(data.delivery))) {
          const { cep, street, number, comp, district, city, uf, recipient } = data.delivery;
          auth.update({ addresses: [...addrs, { cep, street, number, comp, district, city, uf, recipient }] });
        }
      }
      cart.clear(); store.remove('checkout');
      location.href = `pedido-confirmado.html?id=${order.id}`;
    }, 1200);
  });

  /* ---------- Resumo lateral ---------- */
  function renderSummary() {
    const t = cart.totals(step >= 3 ? data.payment.method : null);
    const inst = BR.installments(t.total);
    $('[data-summary]', host).innerHTML = `<div class="panel summary">
      <h2 class="panel__title">Resumo</h2>
      <div class="summary-items">${t.items.map((i) => `<div class="summary-item"><img src="${productImg(i.product)}" alt=""><span class="summary-item__name">${esc(i.product.name)}<small>${esc(i.size)} · Qtd: ${i.qty}</small></span><strong>${money(i.total)}</strong></div>`).join('')}</div>
      <dl class="summary-lines">
        <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
        ${t.discount ? `<div class="is-discount"><dt>Cupom ${esc(t.couponCode)}</dt><dd>− ${money(t.discount)}</dd></div>` : ''}
        <div><dt>Frete</dt><dd>${t.shippingKnown ? (t.shipping ? money(t.shipping) : 'Grátis') : '<small>A calcular</small>'}</dd></div>
        ${t.gift ? `<div><dt>Embalagem presente</dt><dd>${money(t.gift)}</dd></div>` : ''}
        ${t.pixDiscount ? `<div class="is-discount"><dt>Desconto Pix (5%)</dt><dd>− ${money(t.pixDiscount)}</dd></div>` : ''}
        <div class="is-total"><dt>Total</dt><dd>${money(t.total)}${data.payment.method === 'card' && inst.n > 1 ? `<small>em até ${inst.n}x de ${money(inst.value)}</small>` : ''}</dd></div>
      </dl>
      ${!t.couponCode ? `<form class="coupon-form" data-coupon-form style="margin-top:16px"><label class="sr-only" for="ck-coupon">Cupom</label><input id="ck-coupon" name="code" placeholder="Cupom de desconto"><button class="btn btn--outline btn--sm" type="submit">Aplicar</button></form>` : `<div class="coupon-applied" style="margin-top:16px">${icon('check')} Cupom <strong>${esc(t.couponCode)}</strong> <button type="button" class="link" data-remove-coupon>Remover</button></div>`}
      <p class="summary__secure">${icon('lock')} Pagamento seguro e criptografado</p>
    </div>`;
  }
  document.addEventListener('cart:change', () => { renderSummary(); if (step === 3) renderInstallments(); if (step === 4) renderReview(); });

  syncMode();
  renderInstallments();
  if (data.delivery.cep && validate.cep(data.delivery.cep)) renderShipOptions();
  goStep(1);
});
