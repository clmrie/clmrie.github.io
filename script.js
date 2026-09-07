document.getElementById('year').textContent = new Date().getFullYear();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && Element.prototype.animate) {
  const pending = new Set();
  const running = new Map();
  const sections = [...document.querySelectorAll('.section')];
  sections.forEach((section, index) => {
    section.dataset.revealFrom = index % 2 === 0 ? 'left' : 'right';
    section.querySelectorAll('.section-title, .research-copy, .entry, .project, .education-list article').forEach((element, itemIndex) => {
      // Heading and content enter from opposite sides; subsequent entries alternate.
      element.dataset.revealFrom = (index + itemIndex) % 2 === 0 ? 'left' : 'right';
    });
  });
  const reveal = (element, delay = 0) => {
    pending.delete(element);
    observer.unobserve(element);
    element.classList.remove('reveal-pending');
    if (reducedMotion.matches) return;
    const heading = element.classList.contains('section-title');
    element.closest('.section')?.classList.add('section-arrived');
    const fromLeft = element.dataset.revealFrom === 'left';
    const rect = element.getBoundingClientRect();
    // Keep the entire animation inside the viewport, even on narrow phones.
    const room = fromLeft ? rect.left : document.documentElement.clientWidth - rect.right;
    const travel = Math.max(0, Math.min(heading ? 20 : 28, room - 4));
    const offset = fromLeft ? -travel : travel;
    const animation = element.animate([
      { opacity: 0, transform: `translateX(${offset}px)` },
      { opacity: 1, transform: 'translate(0)' }
    ], { duration: heading ? 1000 : 1200, delay, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'backwards' });
    running.set(element, animation);
    animation.onfinish = animation.oncancel = () => running.delete(element);
  };
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting)
      .sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)
      .forEach((entry,index) => reveal(entry.target, Math.min(index * 70, 140)));
  }, { threshold: 0, rootMargin: '0px 0px -48px 0px' });
  document.querySelectorAll('.section-title, .research-copy, .entry, .project, .education-list article').forEach(element => {
    if (element.getBoundingClientRect().top < innerHeight) return;
    observer.observe(element);
    pending.add(element);
    // Keep all pre-rendered content visible to readers and search engines.
  });
  const showAll = () => {
    for (const element of pending) element.classList.remove('reveal-pending');
    pending.clear();
    observer.disconnect();
    for (const animation of running.values()) animation.cancel();
  };
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) showAll(); });
  document.addEventListener('focusin', event => {
    for (const element of pending) if (element.contains(event.target)) {
      element.classList.remove('reveal-pending'); pending.delete(element); observer.unobserve(element);
    }
    for (const [element,animation] of running) if (element.contains(event.target)) animation.finish();
  });
  window.addEventListener('beforeprint', showAll);
  window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
  // Find-in-page should expose all text immediately rather than depend on scrolling.
  document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') showAll(); });
}
