/* Brasilidades — Favoritos */
BR.ready(function () {
  const { $, wishlist, catalog, productCard, icon, carouselHTML, initCarousels } = BR;
  const host = $('[data-wishlist]');

  function render() {
    const items = wishlist.items().map(catalog.get).filter(Boolean);
    $('[data-wish-sub]').textContent = items.length ? `${items.length} produto${items.length > 1 ? 's' : ''} salvo${items.length > 1 ? 's' : ''}` : '';
    $('[data-wish-actions]').innerHTML = items.length
      ? `<button class="btn btn--primary btn--sm" type="button" data-add-all>${icon('bag')} Adicionar tudo à sacola</button><button class="btn btn--outline btn--sm" type="button" data-share>Compartilhar lista</button>`
      : '';
    if (!items.length) {
      const top = catalog.all().slice().sort((a, b) => b.sold - a.sold).slice(0, 10);
      host.innerHTML = `<div class="panel empty-state">${icon('heart', 'empty-state__icon')}<h2>Sua lista está vazia</h2><p>Toque no coração dos produtos para salvá-los aqui e comprar quando quiser.</p><a class="btn btn--primary" href="produtos.html">Explorar produtos</a></div>
        <div class="section"><div class="section-head"><h2 class="section-title">Mais amados</h2></div>${carouselHTML(top)}</div>`;
      initCarousels(host);
      return;
    }
    host.innerHTML = `<div class="product-grid product-grid--4">${items.map(productCard).join('')}</div>`;
  }

  document.addEventListener('click', async (e) => {
    if (e.target.closest('[data-add-all]')) {
      wishlist.items().forEach((id) => { if (catalog.get(id)) BR.cart.add(id); });
      BR.toast('Todos os favoritos foram adicionados à sacola.'); BR.openDrawer('minicart');
    }
    if (e.target.closest('[data-share]')) {
      const names = wishlist.items().map(catalog.get).filter(Boolean).map((p) => `• ${p.name}`).join('\n');
      const text = `Minha lista de desejos Brasilidades:\n${names}`;
      if (navigator.share) { try { await navigator.share({ title: 'Meus favoritos', text }); } catch (err) { /* cancelado */ } }
      else { try { await navigator.clipboard.writeText(text); BR.toast('Lista copiada para a área de transferência.'); } catch (err) { BR.toast('Não foi possível copiar.', 'error'); } }
    }
  });
  document.addEventListener('wish:change', render);
  render();
});
