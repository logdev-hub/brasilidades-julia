/* Brasilidades — Confirmação de pedido */
BR.ready(function () {
  const { $, money, esc, icon, catalog, productImg } = BR;
  const host = $('[data-order]');
  const o = BR.orders.get(BR.param('id'));

  if (!o) {
    host.innerHTML = `<div class="notfound"><strong>Ops!</strong><h1>Pedido não encontrado</h1><p class="muted">Confira seus pedidos na sua conta.</p><a class="btn btn--primary" href="conta.html#pedidos">Meus pedidos</a></div>`;
    return;
  }

  /** QR Code ilustrativo (não é um Pix real) */
  function fakeQR(seedStr) {
    const N = 25; let seed = [...seedStr].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 233280, 7);
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#231819"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#231819"/>`;
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
    let cells = '';
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inFinder(x, y) && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    return `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" role="img" aria-label="QR Code Pix"><rect width="${N}" height="${N}" fill="#fff"/><g fill="#231819">${cells}</g>${finder(0, 0)}${finder(N - 7, 0)}${finder(0, N - 7)}</svg>`;
  }

  const pixCode = `00020126580014BR.GOV.BCB.PIX0136brasilidades-demo-${o.id.toLowerCase()}5204000053039865406${o.totals.total.toFixed(2)}5802BR5912BRASILIDADES6009SAO PAULO62070503***6304ABCD`;
  const boleto = `23793.38128 6${o.id.slice(-4)}0.000003 ${o.id.slice(-5)}.123456 1 ${Math.round(o.totals.total * 100).toString().padStart(10, '0')}`;
  const paid = o.payment.method === 'card';
  const d = o.delivery;
  const storeObj = d.mode === 'loja' ? BR_DATA.stores.find((s) => String(s.id) === String(d.store)) : null;

  let payBox = '';
  if (o.payment.method === 'pix') {
    payBox = `<div class="panel"><h2 class="panel__title">Pague com Pix</h2><div class="pix-box">${fakeQR(o.id)}
      <p><strong>${money(o.totals.total)}</strong> · expira em <strong data-countdown>30:00</strong></p>
      <p class="muted" style="font-size:13px">Abra o app do seu banco, escolha pagar com Pix e escaneie o QR Code ou use o código copia e cola.</p>
      <div class="pix-code"><input value="${esc(pixCode)}" readonly aria-label="Código Pix copia e cola"><button class="btn btn--primary btn--sm" type="button" data-copy="${esc(pixCode)}">${icon('copy')} Copiar</button></div>
      <p class="muted" style="font-size:11px;margin-top:12px">Loja demonstrativa: este QR Code é ilustrativo e não realiza cobranças.</p></div></div>`;
  } else if (o.payment.method === 'boleto') {
    payBox = `<div class="panel"><h2 class="panel__title">Boleto bancário</h2><p class="muted" style="font-size:14px">Vencimento em 3 dias úteis. Linha digitável:</p>
      <div class="pix-code"><input value="${esc(boleto)}" readonly aria-label="Linha digitável"><button class="btn btn--primary btn--sm" type="button" data-copy="${esc(boleto)}">${icon('copy')} Copiar</button></div>
      <button class="btn btn--outline" style="margin-top:12px" type="button" onclick="window.print()">Imprimir</button></div>`;
  }

  const steps = ['Pedido recebido', 'Pagamento aprovado', d.mode === 'loja' ? 'Pronto para retirada' : 'Em transporte', d.mode === 'loja' ? 'Retirado' : 'Entregue'];

  host.innerHTML = `
    <div class="confirm-hero">
      <div class="confirm-hero__icon">${icon('check')}</div>
      <h1>Pedido confirmado, ${esc(o.customer.name.split(' ')[0])}!</h1>
      <p class="muted">Pedido <strong>#${esc(o.id)}</strong> realizado em ${new Date(o.date).toLocaleString('pt-BR')}.<br>Enviamos a confirmação para <strong>${esc(o.customer.email)}</strong>.</p>
      <span class="status ${paid ? 'status--ok' : ''}">${esc(o.status)}</span>
    </div>

    <div class="timeline">${steps.map((s, i) => `<div class="timeline__step ${i === 0 || (i === 1 && paid) ? 'is-done' : ''}">${s}</div>`).join('')}</div>

    ${payBox}

    <div class="panel">
      <h2 class="panel__title">Itens do pedido</h2>
      ${o.items.map((i) => { const p = catalog.get(i.id); return `<div class="summary-item">${p ? `<img src="${productImg(p)}" alt="">` : ''}<span class="summary-item__name">${esc(i.name)}<small>${esc(i.size)} · Qtd: ${i.qty}</small></span><strong>${money(i.price * i.qty)}</strong></div>`; }).join('')}
      ${o.samples && o.samples.length ? `<p class="muted" style="font-size:13px;margin-top:12px">${icon('sample')} + ${o.samples.length} amostra(s) grátis</p>` : ''}
      <dl class="summary-lines" style="margin-top:16px">
        <div><dt>Subtotal</dt><dd>${money(o.totals.subtotal)}</dd></div>
        ${o.totals.discount ? `<div class="is-discount"><dt>Cupom ${esc(o.totals.coupon)}</dt><dd>− ${money(o.totals.discount)}</dd></div>` : ''}
        <div><dt>Frete</dt><dd>${o.totals.shipping ? money(o.totals.shipping) : 'Grátis'}</dd></div>
        ${o.totals.gift ? `<div><dt>Embalagem presente</dt><dd>${money(o.totals.gift)}</dd></div>` : ''}
        ${o.totals.pixDiscount ? `<div class="is-discount"><dt>Desconto Pix</dt><dd>− ${money(o.totals.pixDiscount)}</dd></div>` : ''}
        <div class="is-total"><dt>Total</dt><dd>${money(o.totals.total)}</dd></div>
      </dl>
    </div>

    <div class="panel">
      <div class="review-block"><div><h4>${d.mode === 'loja' ? 'Retirada' : 'Entrega'}</h4><p>${storeObj ? `${esc(storeObj.name)}<br>${esc(storeObj.address)} — ${esc(storeObj.city)}/${storeObj.uf}<br>${esc(storeObj.hours)}` : `${esc(d.recipient)}<br>${esc(d.street)}, ${esc(d.number)}${d.comp ? ' — ' + esc(d.comp) : ''}<br>${esc(d.district)} · ${esc(d.city)}/${esc(d.uf)} · CEP ${esc(d.cep)}`}</p></div></div>
      <div class="review-block"><div><h4>Pagamento</h4><p>${o.payment.method === 'card' ? `${esc(o.payment.brand)} final ${esc(o.payment.last4)} · ${o.payment.installments}x de ${money(o.totals.total / o.payment.installments)}` : o.payment.method === 'pix' ? 'Pix' : 'Boleto bancário'}</p></div></div>
    </div>

    <div class="hero__ctas" style="justify-content:center;margin-top:24px">
      <a class="btn btn--primary" href="conta.html#pedidos">Acompanhar meus pedidos</a>
      <a class="btn btn--outline" href="produtos.html">Continuar comprando</a>
    </div>`;

  // Contagem regressiva do Pix
  const cd = $('[data-countdown]');
  if (cd) {
    const end = new Date(o.date).getTime() + 30 * 60 * 1000;
    const tick = () => {
      const s = Math.max(0, Math.round((end - Date.now()) / 1000));
      cd.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
      if (!s) { cd.textContent = 'expirado'; clearInterval(iv); }
    };
    const iv = setInterval(tick, 1000); tick();
  }
});
