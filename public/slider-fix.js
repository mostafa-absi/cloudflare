(() => {
  const stack = document.querySelector('.phone-stack');
  if (!stack) return;
  const screen = stack.querySelector('.screen');
  const images = [...screen.querySelectorAll('img')];
  const captions = [...stack.querySelectorAll('.captions span')];
  const dots = [...stack.querySelectorAll('.dots i')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const ready = new Set();
  let current = -1, timer, cleanup, visible = true, failed = 0;
  const status = document.createElement('span');
  status.className = 'slide-status';
  status.setAttribute('role', 'status');
  status.textContent = 'در حال آماده‌سازی پیش‌نمایش…';
  screen.append(status);
  stack.classList.add('slides-managed');

  function display(index) {
    clearTimeout(cleanup);
    const previous = current;
    images.forEach((image, i) => {
      image.classList.toggle('is-current', i === index);
      image.classList.toggle('is-previous', i === previous && i !== index);
      image.setAttribute('aria-hidden', String(i !== index));
    });
    captions.forEach((caption, i) => {
      caption.classList.toggle('is-current', i === index);
      caption.setAttribute('aria-hidden', String(i !== index));
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-current', i === index));
    current = index;
    status.hidden = true;
    cleanup = setTimeout(() => images.forEach(image => image.classList.remove('is-previous')), 800);
  }
  function schedule() {
    clearTimeout(timer);
    if (motion.matches || document.hidden || !visible || ready.size < 2) return;
    timer = setTimeout(() => {
      for (let offset = 1; offset < images.length; offset++) {
        const index = (current + offset) % images.length;
        if (ready.has(index)) { display(index); break; }
      }
      schedule();
    }, 6000);
  }
  function decoded(image) {
    return new Promise((resolve, reject) => {
      const loaded = () => {
        if (!image.naturalWidth) { reject(); return; }
        if (image.decode) image.decode().then(resolve, reject);
        else resolve();
      };
      if (image.complete) loaded();
      else {
        image.addEventListener('load', loaded, { once: true });
        image.addEventListener('error', reject, { once: true });
      }
    });
  }
  images.forEach((image, index) => {
    decoded(image).then(() => {
      ready.add(index);
      // Keep a successfully loaded screen visible even if other requests fail.
      if (current < 0) display(index);
      schedule();
    }).catch(() => {
      failed++;
      if (failed === images.length) status.textContent = 'تصاویر بارگذاری نشدند؛ صفحه را دوباره بارگذاری کنید.';
    });
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', schedule);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, { threshold: .05 }).observe(stack);
})();
