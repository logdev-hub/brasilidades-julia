/* Brasilidades — Nossa história */
BR.ready(function () {
  const { $, esc, icon, mix } = BR;

  $('[data-ingredients]').innerHTML = BR_DATA.lines.map((l) => `
    <a class="ingredient" href="produtos.html?linha=${l.id}" style="--bg:${mix(l.color, .82)}; --c:${l.color}">
      <span>${esc(l.origin)}</span><strong>${esc(l.ingredient)}</strong>
    </a>`).join('');

  $('[data-values]').innerHTML = [
    ['leaf', '#64CE65', 'Natureza em primeiro lugar', 'Até 95% de ingredientes de origem natural e fórmulas 100% veganas.'],
    ['heart', '#F25071', 'Respeito às pessoas', 'Comércio justo e relações de longo prazo com comunidades extrativistas.'],
    ['box', '#FFB175', 'Menos é mais', 'Embalagens recicláveis, refis e programa de logística reversa nas lojas.'],
    ['star', '#91241E', 'Eficácia comprovada', 'Testes dermatológicos e clínicos em laboratórios independentes.']
  ].map(([ic, c, t, d]) => `<div class="value" style="--c:${c}" data-reveal>${icon(ic)}<h3>${t}</h3><p>${d}</p></div>`).join('');
});
