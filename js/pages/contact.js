/* Brasilidades — Fale conosco e FAQ */
BR.ready(function () {
  const { $, icon, esc, validate, fieldError, norm, money } = BR;

  $('.faq-search').insertAdjacentHTML('afterbegin', icon('search'));
  $('[data-channels]').innerHTML = [
    ['phone', 'Central de atendimento', '0800 000 2026<br>Seg. a Sex. das 9h às 17h, exceto feriados.'],
    ['whatsapp', 'WhatsApp', '(11) 90000-2026<br>Seg. a Sáb. das 8h às 20h.'],
    ['chat', 'E-mail', 'atendimento@brasilidades.example<br>Resposta em até 1 dia útil.'],
    ['store', 'Nas lojas', 'Atendimento presencial em todo o Brasil.<br><a class="link" href="lojas.html">Encontre uma loja</a>']
  ].map(([ic, t, d]) => `<div class="channel">${icon(ic)}<div><strong>${t}</strong><p>${d}</p></div></div>`).join('');

  /* ---------- Formulário ---------- */
  const f = $('[data-contact]'), el = (n) => f.elements.namedItem(n);
  const subjectParam = BR.param('assunto');
  if (subjectParam) el('subject').value = subjectParam;
  const lojaParam = BR_DATA.stores.find((s) => String(s.id) === BR.param('loja'));
  if (lojaParam) el('msg').value = `Gostaria de agendar um Ritual de Pele na loja ${lojaParam.name}.\nDatas e horários de preferência: `;
  const u = BR.auth.current();
  if (u) { el('name').value = u.name; el('email').value = u.email; el('phone').value = u.phone || ''; }
  const syncOrder = () => { $('[data-order-field]').hidden = !['pedido', 'troca'].includes(el('subject').value); };
  el('subject').addEventListener('change', syncOrder); syncOrder();
  el('msg').addEventListener('input', () => { $('[data-msg-count]').textContent = `${el('msg').value.length}/1500`; });

  f.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    ok = fieldError(el('name'), el('name').value.trim().length >= 2 ? '' : 'Informe seu nome.') && ok;
    ok = fieldError(el('email'), validate.email(el('email').value) ? '' : 'Informe um e-mail válido.') && ok;
    if (el('phone').value) ok = fieldError(el('phone'), validate.phone(el('phone').value) ? '' : 'Telefone inválido.') && ok;
    ok = fieldError(el('subject'), el('subject').value ? '' : 'Selecione um assunto.') && ok;
    ok = fieldError(el('msg'), el('msg').value.trim().length >= 10 ? '' : 'Escreva sua mensagem (mín. 10 caracteres).') && ok;
    if (!el('lgpd').checked) { BR.toast('Autorize o uso dos dados para enviarmos o retorno.', 'error'); ok = false; }
    if (!ok) return;
    const protocol = 'ATD' + Date.now().toString().slice(-7);
    const list = BR.store.get('contacts', []);
    list.push({ protocol, name: el('name').value, email: el('email').value, subject: el('subject').value, msg: el('msg').value, date: new Date().toISOString() });
    BR.store.set('contacts', list);
    f.innerHTML = `<div class="empty-state">${icon('check', 'empty-state__icon')}<h2>Mensagem enviada!</h2><p>Seu protocolo é <strong>${protocol}</strong>. Responderemos em até 1 dia útil no e-mail informado.</p><a class="btn btn--outline" href="index.html">Voltar à loja</a></div>`;
  });

  /* ---------- FAQ ---------- */
  const FAQ = [
    ['Qual o prazo de entrega?', 'O prazo varia conforme a região e a modalidade escolhida: a entrega econômica leva de 2 a 12 dias úteis e a expressa, de 1 a 6 dias úteis. Você pode simular o prazo na página do produto ou na sacola.'],
    ['Como funciona o frete grátis?', `Compras acima de ${money(BR.FREE_SHIPPING)} (após descontos) têm frete grátis na entrega econômica para todo o Brasil. A retirada em loja é sempre gratuita.`],
    ['Quais as formas de pagamento?', `Aceitamos cartões de crédito Visa, Mastercard, Elo, Amex e Hipercard em até ${BR.MAX_INSTALLMENTS}x sem juros (parcela mínima de R$ 30), Pix com 5% de desconto e boleto bancário.`],
    ['Como uso um cupom de desconto?', 'Digite o código no campo "Cupom de desconto" na sacola, no minicarrinho ou no resumo do checkout. É permitido um cupom por pedido.'],
    ['Posso trocar ou devolver um produto?', 'Sim. Você tem até 7 dias após o recebimento para desistência e até 30 dias para troca de produtos sem uso. Produtos com defeito podem ser trocados em até 90 dias. Veja a política completa em Trocas e Devoluções.'],
    ['Como escolho minhas amostras grátis?', 'Na página da sacola, selecione até 3 amostras. Elas serão enviadas junto com o seu pedido, sem custo.'],
    ['Os produtos são testados em animais?', 'Não. Todas as nossas fórmulas são veganas e não testadas em animais em nenhuma etapa do desenvolvimento.'],
    ['Como funciona o programa de reciclagem?', 'Leve suas embalagens vazias de cosméticos (de qualquer marca) a uma de nossas lojas. A cada 5 embalagens você ganha um cupom de 10% OFF.'],
    ['Como acompanho meu pedido?', 'Acesse Minha Conta > Meus pedidos. Você também recebe atualizações por e-mail a cada mudança de status.'],
    ['Posso enviar o pedido como presente?', `Sim! Na sacola, marque a opção de embalagem para presente (${money(BR.GIFT_WRAP_PRICE)}) e escreva uma mensagem para o cartão. A nota fiscal não acompanha o pacote.`]
  ];
  const faqBox = $('[data-faq]');
  const renderFAQ = (q = '') => {
    const t = norm(q);
    const list = FAQ.filter(([p, r]) => !t || norm(p + ' ' + r).includes(t));
    faqBox.innerHTML = list.length ? list.map(([p, r]) => `<details><summary>${esc(p)}${icon('plus')}</summary><div class="accordion__body"><p>${esc(r)}</p></div></details>`).join('')
      : `<p class="muted text-center" style="padding:24px 0">Nenhuma pergunta encontrada. Envie sua dúvida pelo formulário acima.</p>`;
  };
  $('[data-faq-q]').addEventListener('input', BR.debounce((e) => renderFAQ(e.target.value), 150));
  renderFAQ();
});
