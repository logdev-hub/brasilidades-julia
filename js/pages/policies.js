/* Brasilidades — Políticas: destaca a seção visível no menu lateral */
BR.ready(function () {
  const { $$ } = BR;
  const links = $$('.policy-nav a');
  const setActive = (id) => links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.policy-section').forEach((s) => io.observe(s));
  }
  setActive((location.hash || '#termos').slice(1));
});
