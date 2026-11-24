import { KartuEvent, KartuPendaftaran } from './komponen.js';

export function renderEventGrid(data) {
  const container = document.querySelector('#event-grid');
  const select = document.querySelector('#pilihan-event');
  const daftar = document.createDocumentFragment();
  const pilihan = document.createDocumentFragment();
  pilihan.append(new Option('-- Pilih Event --', ''));
  data.forEach((event, indeks) => {
    // Agenda pertama tampil sebagai kartu sorotan selebar grid.
    daftar.append(KartuEvent(event, { indeks, sorot: indeks === 0 }));
    pilihan.append(new Option(event.judul, String(event.id)));
  });
  if (!data.length) {
    const pesan = document.createElement('p');
    pesan.className = 'text-body-secondary mb-0';
    pesan.textContent = 'Belum ada agenda event.';
    daftar.append(pesan);
  }
  container.replaceChildren(daftar);
  select.replaceChildren(pilihan);
  select.disabled = !data.length;
  document.querySelector('#form-rsvp button[type="submit"]').disabled = !data.length;
}

export function renderPendaftaran(data, bermasalah, { sorotTerbaru = false } = {}) {
  const daftar = document.createDocumentFragment();
  for (const item of [...data].reverse()) daftar.append(KartuPendaftaran(item));
  if (sorotTerbaru && daftar.firstElementChild) daftar.firstElementChild.classList.add('tiket--baru');
  document.querySelector('#daftar-rsvp').replaceChildren(daftar);
  document.querySelector('#rsvp-kosong').hidden = data.length > 0;

  const banner = document.querySelector('#peringatan-storage');
  banner.hidden = !bermasalah;
  banner.textContent = bermasalah
    ? 'Penyimpanan lokal tidak tersedia atau penuh. Perubahan pendaftaran yang belum tersimpan hanya ada di memori halaman ini dan dapat hilang saat halaman dimuat ulang.'
    : '';
}
