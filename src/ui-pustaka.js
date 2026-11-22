// ui-pustaka.js — SATU-SATUNYA berkas yang memanggil API JavaScript Bootstrap (objek `bootstrap`).
// Berkas lain (main.js) hanya memanggil fungsi di bawah ini. Bila pustaka diganti, cukup berkas ini yang diubah.

export function bukaDetail({ judul, meta, isi }, pemicu) {
  const el = document.querySelector('#modalDetail');
  el.querySelector('[data-judul]').textContent = judul;
  el.querySelector('[data-meta]').textContent = meta;
  el.querySelector('[data-isi]').textContent = isi;
  el.addEventListener('hidden.bs.modal', () => { pemicu?.focus(); }, { once: true });
  bootstrap.Modal.getOrCreateInstance(el).show(pemicu);
}

export function tutupDetail(setelahTutup) {
  const el = document.querySelector('#modalDetail');
  if (setelahTutup) el.addEventListener('hidden.bs.modal', setelahTutup, { once: true });
  bootstrap.Modal.getOrCreateInstance(el).hide();
}

export function tampilkanToast(pesan) {
  const el = document.querySelector('#toastInfo');
  el.querySelector('[data-pesan]').textContent = pesan;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 4000 }).show();
}

// Menutup menu navbar setelah pindah tampilan di layar sempit
export function tutupMenu() {
  const el = document.querySelector('#menuUtama');
  if (el.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(el).hide();
}
