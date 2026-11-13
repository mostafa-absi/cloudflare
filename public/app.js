// Jibe-Man landing — small progressive enhancements (no framework, no build step).
(function () {
  // smooth in-page anchors for browsers without CSS scroll-behavior
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id || id === 'download') return;
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    var y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', '#' + id);
  });

  // pause the phone animation while the hero is off-screen (saves battery)
  var stack = document.querySelector('.phone-stack');
  if (stack && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var state = entry.isIntersecting ? 'running' : 'paused';
        stack.querySelectorAll('.phone-float, .screen img, .captions span, .dots i')
          .forEach(function (el) { el.style.animationPlayState = state; });
      });
    }, { threshold: 0.05 }).observe(stack);
  }
})();
