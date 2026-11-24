// efek.js — efek visual ringan (vanilla JS): scroll reveal, parallax pointer, indikator navigasi, bayangan navbar.
// Tidak memanggil Bootstrap dan tidak menyentuh data pendaftaran.

export const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointerHalus = window.matchMedia('(hover: hover) and (pointer: fine)');

/* ---------- Scroll reveal ---------- */
// Elemen ber-atribut data-reveal muncul saat masuk viewport. Setelah selesai, atribut dilepas
// supaya transisi hover milik elemen itu sendiri tidak terganggu.
let pengamat;

function lepasReveal(el) {
  el.removeAttribute('data-reveal');
  el.classList.remove('is-in');
  el.style.removeProperty('--i');
}

function tampilkan(el) {
  el.classList.add('is-in');
  if (kurangiGerak.matches) { lepasReveal(el); return; }
  el.addEventListener('transitionend', (e) => {
    if (e.target === el && e.propertyName === 'opacity') lepasReveal(el);
  });
  setTimeout(() => lepasReveal(el), 2000); // jaring pengaman bila transitionend tidak terpicu
}

export function amatiReveal(akar = document) {
  const daftar = [...akar.querySelectorAll('[data-reveal]:not([data-diamati])')];
  if (!daftar.length) return;
  if (kurangiGerak.matches || !('IntersectionObserver' in window)) { daftar.forEach(tampilkan); return; }
  pengamat ??= new IntersectionObserver((entri) => {
    for (const e of entri) {
      if (!e.isIntersecting) continue;
      pengamat.unobserve(e.target);
      tampilkan(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  for (const el of daftar) { el.dataset.diamati = ''; pengamat.observe(el); }
}

/* ---------- Parallax pointer pada hero ---------- */
// Mengisi --px dan --py (-1..1); CSS yang menerjemahkannya menjadi pergeseran kecil.
export function pasangParalaks(hero) {
  if (!hero || !pointerHalus.matches) return;
  let bingkai = 0; let x = 0; let y = 0;
  const terapkan = () => {
    bingkai = 0;
    hero.style.setProperty('--px', x.toFixed(3));
    hero.style.setProperty('--py', y.toFixed(3));
  };
  hero.addEventListener('pointermove', (e) => {
    if (kurangiGerak.matches) return;
    const r = hero.getBoundingClientRect();
    x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!bingkai) bingkai = requestAnimationFrame(terapkan);
  });
  hero.addEventListener('pointerleave', () => {
    x = 0; y = 0;
    if (!bingkai) bingkai = requestAnimationFrame(terapkan);
  });
}

/* ---------- Sorotan cahaya yang mengikuti pointer pada kartu event ---------- */
export function pasangSorotKartu(grid) {
  if (!grid || !pointerHalus.matches) return;
  grid.addEventListener('pointermove', (e) => {
    const kartu = e.target.closest('.kartu-event');
    if (!kartu) return;
    const r = kartu.getBoundingClientRect();
    kartu.style.setProperty('--mx', `${e.clientX - r.left}px`);
    kartu.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

/* ---------- Indikator navigasi yang bergeser ---------- */
export function pasangIndikatorNav(wadah) {
  const indikator = wadah.querySelector('.nav-indikator');
  let pertama = true;

  function perbarui() {
    const aktif = wadah.querySelector('.nav-link.active');
    if (!indikator || !aktif || getComputedStyle(indikator).display === 'none') return;
    const a = aktif.getBoundingClientRect();
    const w = wadah.getBoundingClientRect();
    if (pertama) indikator.style.transition = 'none'; // penempatan awal tanpa meluncur dari nol
    indikator.style.setProperty('--x', `${a.left - w.left}px`);
    indikator.style.setProperty('--w', `${a.width}px`);
    if (pertama) {
      void indikator.offsetWidth;
      indikator.style.transition = '';
      pertama = false;
    }
    wadah.classList.add('siap');
  }

  if ('ResizeObserver' in window) new ResizeObserver(perbarui).observe(wadah);
  window.addEventListener('resize', perbarui);
  document.fonts?.ready.then(perbarui);
  perbarui();
  return { perbarui };
}

/* ---------- Bayangan navbar saat halaman digulir ---------- */
export function pasangBayanganNav(nav) {
  const ubah = () => nav.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', ubah, { passive: true });
  ubah();
}
