/* Brasilidades — Minha conta
   Autenticação local apenas para demonstração (localStorage).
   Em produção, substitua por uma API com sessão segura. */
BR.ready(function () {
  const { $, $$, auth, money, esc, icon, validate, fieldError, productImg, catalog, cart } = BR;
  const host = $('[data-account]');
  const next = BR.param('next');

  /* ======================= Visitante ======================= */
  function renderGuest(tab = 'login') {
    $('[data-account-title]').textContent = 'Entre ou cadastre-se';
    host.innerHTML = `<div class="auth-grid">
      <div class="panel">
        <div class="tabs-auth" role="tablist">
          <button type="button" role="tab" data-auth-tab="login" aria-selected="${tab === 'login'}">Entrar</button>
          <button type="button" role="tab" data-auth-tab="register" aria-selected="${tab === 'register'}">Criar conta</button>
        </div>
        ${tab === 'login' ? `
        <form data-login novalidate>
          <div class="field"><label for="lg-email">E-mail</label><input id="lg-email" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="lg-pass">Senha</label><div class="pass-wrap"><input id="lg-pass" name="pass" type="password" autocomplete="current-password" required><button class="pass-toggle" type="button" data-pass-toggle>Mostrar</button></div></div>
          <p style="text-align:right;margin-top:-8px"><button class="link" type="button" data-forgot>Esqueci minha senha</button></p>
          <button class="btn btn--primary btn--block" type="submit">Entrar</button>
        </form>` : `
        <form data-register novalidate>
          <div class="field"><label for="rg-name">Nome completo</label><input id="rg-name" name="name" autocomplete="name" required></div>
          <div class="field"><label for="rg-email">E-mail</label><input id="rg-email" name="email" type="email" autocomplete="email" required></div>
          <div class="form-row form-row--2">
            <div class="field"><label for="rg-cpf">CPF</label><input id="rg-cpf" name="cpf" data-mask="cpf" inputmode="numeric" required></div>
            <div class="field"><label for="rg-phone">Celular</label><input id="rg-phone" name="phone" data-mask="phone" inputmode="tel" required></div>
          </div>
          <div class="field"><label for="rg-pass">Senha</label><div class="pass-wrap"><input id="rg-pass" name="pass" type="password" autocomplete="new-password" minlength="8" required><button class="pass-toggle" type="button" data-pass-toggle>Mostrar</button></div><small>Mínimo de 8 caracteres, com letras e números.</small></div>
          <label class="check"><input type="checkbox" name="news" checked><span>Quero receber novidades e ofertas exclusivas.</span></label>
          <label class="check"><input type="checkbox" name="terms" required><span>Li e aceito os <a class="link" href="politicas.html#termos">Termos</a> e a <a class="link" href="politicas.html#privacidade">Política de Privacidade</a>.</span></label>
          <button class="btn btn--primary btn--block" type="submit">Criar conta</button>
        </form>`}
      </div>
      <div class="panel panel--cream">
        <h2 class="panel__title">${icon('gift')} Vantagens do Clube Brasilidades</h2>
        <div class="benefits">
          <div class="benefit">${icon('gift')}<p><strong>10% OFF na primeira compra</strong>Use o cupom PRIMEIRACOMPRA.</p></div>
          <div class="benefit">${icon('truck')}<p><strong>Acompanhe seus pedidos</strong>Status de entrega em tempo real.</p></div>
          <div class="benefit">${icon('heart')}<p><strong>Lista de favoritos</strong>Salve produtos e compre quando quiser.</p></div>
          <div class="benefit">${icon('star')}<p><strong>Presente de aniversário</strong>Um mimo especial no mês do seu aniversário.</p></div>
          <div class="benefit">${icon('pin')}<p><strong>Checkout mais rápido</strong>Seus endereços salvos com segurança.</p></div>
        </div>
      </div>
    </div>`;
    BR.bindMasks(host);
  }

  host.addEventListener('click', (e) => {
    const t = e.target.closest('[data-auth-tab]'); if (t) renderGuest(t.dataset.authTab);
    const pt = e.target.closest('[data-pass-toggle]');
    if (pt) { const i = pt.previousElementSibling; const show = i.type === 'password'; i.type = show ? 'text' : 'password'; pt.textContent = show ? 'Ocultar' : 'Mostrar'; }
    if (e.target.closest('[data-forgot]')) {
      const m = BR.openModal(`<h3 class="modal__title">Recuperar senha</h3><p class="modal__text">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
        <form data-forgot-form novalidate><div class="field"><label for="fg-email">E-mail</label><input id="fg-email" name="email" type="email"></div><button class="btn btn--primary btn--block">Enviar link</button></form>`);
      $('[data-forgot-form]', m.el).addEventListener('submit', (ev) => {
        ev.preventDefault();
        const i = ev.target.elements.namedItem('email');
        if (!fieldError(i, validate.email(i.value) ? '' : 'E-mail inválido.')) return;
        m.close(); BR.toast('Se houver uma conta com este e-mail, você receberá o link em instantes.', 'info');
      });
    }
  });

  host.addEventListener('submit', (e) => {
    const f = e.target, el = (n) => f.elements.namedItem(n);
    if (f.matches('[data-login]')) {
      e.preventDefault();
      let ok = fieldError(el('email'), validate.email(el('email').value) ? '' : 'Informe um e-mail válido.');
      ok = fieldError(el('pass'), el('pass').value ? '' : 'Informe sua senha.') && ok;
      if (!ok) return;
      const r = auth.login(el('email').value, el('pass').value);
      if (!r.ok) { fieldError(el('pass'), r.msg); return; }
      BR.toast('Bem-vindo(a) de volta!');
      if (next) location.href = next; else route();
    }
    if (f.matches('[data-register]')) {
      e.preventDefault();
      let ok = true;
      ok = fieldError(el('name'), el('name').value.trim().split(/\s+/).length >= 2 ? '' : 'Informe nome e sobrenome.') && ok;
      ok = fieldError(el('email'), validate.email(el('email').value) ? '' : 'Informe um e-mail válido.') && ok;
      ok = fieldError(el('cpf'), validate.cpf(el('cpf').value) ? '' : 'CPF inválido.') && ok;
      ok = fieldError(el('phone'), validate.phone(el('phone').value) ? '' : 'Celular inválido.') && ok;
      ok = fieldError(el('pass'), /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(el('pass').value) ? '' : 'A senha precisa de 8+ caracteres com letras e números.') && ok;
      if (!el('terms').checked) { BR.toast('Aceite os termos para continuar.', 'error'); ok = false; }
      if (!ok) return;
      const r = auth.register({ name: el('name').value.trim(), email: el('email').value, pass: el('pass').value, cpf: el('cpf').value, phone: el('phone').value });
      if (!r.ok) { fieldError(el('email'), r.msg); return; }
      BR.toast('Conta criada com sucesso!');
      if (next) location.href = next; else route();
    }
  });

  /* ======================= Logado ======================= */
  const SECTIONS = [
    ['inicio', 'Visão geral', 'user'], ['pedidos', 'Meus pedidos', 'box'], ['dados', 'Meus dados', 'card'], ['enderecos', 'Endereços', 'pin']
  ];

  function renderAccount(section) {
    const u = auth.current();
    $('[data-account-title]').textContent = 'Minha conta';
    if (!SECTIONS.some((s) => s[0] === section)) section = 'inicio';
    host.innerHTML = `<div class="account">
      <nav class="account-nav" role="tablist" aria-label="Seções da conta">
        ${SECTIONS.map(([id, label, ic]) => `<button type="button" role="tab" aria-selected="${id === section}" data-section="${id}">${icon(ic)}${label}</button>`).join('')}
        <a href="favoritos.html">${icon('heart')}Favoritos</a>
        <button type="button" data-logout>${icon('logout')}Sair</button>
      </nav>
      <div>
        <div class="account-hello"><span class="avatar">${esc(u.name.charAt(0).toUpperCase())}</span><div><h2>Olá, ${esc(u.name.split(' ')[0])}!</h2><p>Cliente desde ${new Date(u.created).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p></div></div>
        <div data-section-body></div>
      </div>
    </div>`;
    const body = $('[data-section-body]');
    const orders = BR.orders.mine();
    if (section === 'inicio') {
      const last = orders[0];
      body.innerHTML = `
        <div class="panel"><h2 class="panel__title">${icon('box')} Último pedido</h2>${last ? orderCard(last) : `<p class="muted">Você ainda não fez pedidos. <a class="link" href="produtos.html">Comece a comprar</a></p>`}</div>
        <div class="address-grid" style="margin-top:16px">
          <a class="panel" href="#pedidos" data-section-link="pedidos"><strong>${orders.length}</strong> pedido(s)<p class="muted" style="margin:0;font-size:13px">Ver histórico completo</p></a>
          <a class="panel" href="favoritos.html"><strong>${BR.wishlist.items().length}</strong> favorito(s)<p class="muted" style="margin:0;font-size:13px">Sua lista de desejos</p></a>
        </div>
        <div class="panel panel--cream" style="margin-top:16px"><h2 class="panel__title">${icon('gift')} Seu cupom de boas-vindas</h2><p class="muted">Use na sua primeira compra:</p><button class="promo-float__code" type="button" data-copy="PRIMEIRACOMPRA">PRIMEIRACOMPRA ${icon('copy')}</button></div>`;
    }
    if (section === 'pedidos') {
      body.innerHTML = `<div class="panel"><h2 class="panel__title">${icon('box')} Meus pedidos</h2>${orders.length ? orders.map(orderCard).join('') : `<div class="empty-state empty-state--sm">${icon('box', 'empty-state__icon')}<p>Você ainda não fez nenhum pedido.</p><a class="btn btn--primary" href="produtos.html">Ver produtos</a></div>`}</div>`;
    }
    if (section === 'dados') {
      body.innerHTML = `<form class="panel" data-profile novalidate>
        <h2 class="panel__title">${icon('card')} Meus dados</h2>
        <div class="field"><label for="pf-name">Nome completo</label><input id="pf-name" name="name" value="${esc(u.name)}"></div>
        <div class="field"><label for="pf-email">E-mail</label><input id="pf-email" value="${esc(u.email)}" disabled></div>
        <div class="form-row form-row--3">
          <div class="field"><label for="pf-cpf">CPF</label><input id="pf-cpf" name="cpf" data-mask="cpf" value="${esc(u.cpf)}"></div>
          <div class="field"><label for="pf-phone">Celular</label><input id="pf-phone" name="phone" data-mask="phone" value="${esc(u.phone)}"></div>
          <div class="field"><label for="pf-birth">Nascimento</label><input id="pf-birth" name="birth" type="date" value="${esc(u.birth || '')}"></div>
        </div>
        <button class="btn btn--primary" type="submit">Salvar alterações</button>
      </form>
      <form class="panel" data-password novalidate>
        <h2 class="panel__title">${icon('lock')} Alterar senha</h2>
        <div class="form-row form-row--2">
          <div class="field"><label for="pw-cur">Senha atual</label><input id="pw-cur" name="cur" type="password" autocomplete="current-password"></div>
          <div class="field"><label for="pw-new">Nova senha</label><input id="pw-new" name="nw" type="password" autocomplete="new-password"></div>
        </div>
        <button class="btn btn--outline" type="submit">Alterar senha</button>
      </form>`;
    }
    if (section === 'enderecos') {
      const addrs = u.addresses || [];
      body.innerHTML = `<div class="panel"><h2 class="panel__title">${icon('pin')} Meus endereços</h2>
        <div class="address-grid">${addrs.map((a, i) => `<div class="address-card"><strong>${esc(a.recipient || u.name)}</strong><p>${esc(a.street)}, ${esc(a.number)}${a.comp ? ' — ' + esc(a.comp) : ''}<br>${esc(a.district)} · ${esc(a.city)}/${esc(a.uf)}<br>CEP ${esc(a.cep)}</p><button class="icon-btn" type="button" data-del-address="${i}" aria-label="Excluir endereço">${icon('trash')}</button></div>`).join('') || '<p class="muted">Nenhum endereço cadastrado.</p>'}</div></div>
        <form class="panel" data-address novalidate>
          <h2 class="panel__title">${icon('plus')} Novo endereço</h2>
          <div class="form-row form-row--cep">
            <div class="field"><label for="ad-cep">CEP</label><input id="ad-cep" name="cep" data-mask="cep" inputmode="numeric"></div>
            <div class="field"><label for="ad-street">Endereço</label><input id="ad-street" name="street"></div>
          </div>
          <div class="form-row form-row--3">
            <div class="field"><label for="ad-number">Número</label><input id="ad-number" name="number"></div>
            <div class="field"><label for="ad-comp">Complemento</label><input id="ad-comp" name="comp"></div>
            <div class="field"><label for="ad-district">Bairro</label><input id="ad-district" name="district"></div>
          </div>
          <div class="form-row form-row--3">
            <div class="field"><label for="ad-city">Cidade</label><input id="ad-city" name="city"></div>
            <div class="field"><label for="ad-uf">UF</label><input id="ad-uf" name="uf" maxlength="2"></div>
            <div class="field"><label for="ad-rec">Destinatário</label><input id="ad-rec" name="recipient" value="${esc(u.name)}"></div>
          </div>
          <button class="btn btn--primary" type="submit">Salvar endereço</button>
        </form>`;
      const cep = $('#ad-cep');
      cep.addEventListener('input', async () => {
        if (BR.onlyDigits(cep.value).length !== 8) return;
        const a = await BR.lookupCEP(cep.value);
        if (!a) return;
        $('#ad-street').value = a.logradouro || ''; $('#ad-district').value = a.bairro || ''; $('#ad-city').value = a.localidade || ''; $('#ad-uf').value = a.uf || '';
        $('#ad-number').focus();
      });
    }
    BR.bindMasks(host);
  }

  function orderCard(o) {
    const ok = o.payment.method === 'card';
    return `<div class="order-card">
      <div class="order-card__head"><div><strong>#${esc(o.id)}</strong><br><small class="muted">${new Date(o.date).toLocaleDateString('pt-BR')} · ${o.items.reduce((s, i) => s + i.qty, 0)} item(s)</small></div><span class="status ${ok ? 'status--ok' : ''}">${esc(o.status)}</span></div>
      <div class="order-card__imgs">${o.items.slice(0, 6).map((i) => { const p = catalog.get(i.id); return p ? `<img src="${productImg(p)}" alt="${esc(i.name)}" title="${esc(i.name)}">` : ''; }).join('')}</div>
      <div class="order-card__foot"><span>Total: <strong>${money(o.totals.total)}</strong></span><span class="hero__ctas"><a class="btn btn--outline btn--sm" href="pedido-confirmado.html?id=${o.id}">Detalhes</a><button class="btn btn--primary btn--sm" type="button" data-rebuy="${o.id}">Comprar novamente</button></span></div>
    </div>`;
  }

  host.addEventListener('click', async (e) => {
    const s = e.target.closest('[data-section],[data-section-link]');
    if (s) { e.preventDefault(); location.hash = s.dataset.section || s.dataset.sectionLink; return; }
    if (e.target.closest('[data-logout]')) {
      if (await BR.confirm({ title: 'Sair da conta?', ok: 'Sair' })) { auth.logout(); location.hash = ''; route(); BR.toast('Você saiu da sua conta.', 'info'); }
      return;
    }
    const rb = e.target.closest('[data-rebuy]');
    if (rb) { const o = BR.orders.get(rb.dataset.rebuy); o.items.forEach((i) => { if (catalog.get(i.id)) cart.add(i.id, i.size, i.qty); }); BR.toast('Itens adicionados à sacola.'); BR.openDrawer('minicart'); return; }
    const da = e.target.closest('[data-del-address]');
    if (da && await BR.confirm({ title: 'Excluir endereço?', ok: 'Excluir' })) {
      const u = auth.current(); const addrs = (u.addresses || []).filter((_, i) => i !== +da.dataset.delAddress);
      auth.update({ addresses: addrs }); renderAccount('enderecos'); BR.toast('Endereço excluído.', 'info');
    }
  });

  host.addEventListener('submit', (e) => {
    const f = e.target, el = (n) => f.elements.namedItem(n);
    if (f.matches('[data-profile]')) {
      e.preventDefault();
      let ok = fieldError(el('name'), el('name').value.trim().length >= 3 ? '' : 'Informe seu nome.');
      if (el('cpf').value) ok = fieldError(el('cpf'), validate.cpf(el('cpf').value) ? '' : 'CPF inválido.') && ok;
      if (el('phone').value) ok = fieldError(el('phone'), validate.phone(el('phone').value) ? '' : 'Celular inválido.') && ok;
      if (!ok) return;
      auth.update({ name: el('name').value.trim(), cpf: el('cpf').value, phone: el('phone').value, birth: el('birth').value });
      BR.toast('Dados atualizados.');
    }
    if (f.matches('[data-password]')) {
      e.preventDefault();
      if (!fieldError(el('nw'), /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(el('nw').value) ? '' : 'Mínimo de 8 caracteres com letras e números.')) return;
      const r = auth.changePassword(el('cur').value, el('nw').value);
      if (!fieldError(el('cur'), r.ok ? '' : r.msg)) return;
      f.reset(); BR.toast('Senha alterada com sucesso.');
    }
    if (f.matches('[data-address]')) {
      e.preventDefault();
      let ok = fieldError(el('cep'), validate.cep(el('cep').value) ? '' : 'CEP inválido.');
      ['street', 'number', 'district', 'city', 'uf'].forEach((k) => { ok = fieldError(el(k), el(k).value.trim() ? '' : 'Obrigatório.') && ok; });
      if (!ok) return;
      const u = auth.current();
      const a = {}; ['cep', 'street', 'number', 'comp', 'district', 'city', 'uf', 'recipient'].forEach((k) => { a[k] = el(k).value.trim(); });
      a.uf = a.uf.toUpperCase();
      auth.update({ addresses: [...(u.addresses || []), a] });
      renderAccount('enderecos'); BR.toast('Endereço salvo.');
    }
  });

  function route() {
    if (auth.current()) renderAccount(location.hash.replace('#', '') || 'inicio');
    else renderGuest(location.hash === '#cadastro' ? 'register' : 'login');
  }
  window.addEventListener('hashchange', route);
  route();
});
