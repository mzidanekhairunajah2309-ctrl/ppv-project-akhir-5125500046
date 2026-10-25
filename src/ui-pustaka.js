// ui-pustaka.js — SATU-SATUNYA berkas yang memanggil API JavaScript Bootstrap (objek `bootstrap`).
// Berkas lain (main.js) hanya memanggil fungsi di bawah ini. Bila pustaka diganti, cukup berkas ini yang diubah.

function bukaDetail({ judul, meta, isi }) {
  const el = document.querySelector('#modalDetail');
  el.querySelector('[data-judul]').textContent = judul;
  el.querySelector('[data-meta]').textContent = meta;
  el.querySelector('[data-isi]').textContent = isi;
  bootstrap.Modal.getOrCreateInstance(el).show();
}

function tutupDetail() {
  const el = document.querySelector('#modalDetail');
  bootstrap.Modal.getOrCreateInstance(el).hide();
}

function tampilkanToast(pesan) {
  const el = document.querySelector('#toastInfo');
  el.querySelector('[data-pesan]').textContent = pesan;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 4000 }).show();
}

// Menutup menu navbar setelah pindah tampilan di layar sempit
function tutupMenu() {
  const el = document.querySelector('#menuUtama');
  if (el.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(el).hide();
}
