import { ambilDataEvent, muat, simpan, perluPeringatan } from './data.js';
import { renderEventGrid, renderPendaftaran } from './ui.js';
import { bukaDetail, tutupDetail, tampilkanToast, tutupMenu } from './ui-pustaka.js';
import { kurangiGerak, amatiReveal, pasangParalaks, pasangSorotKartu, pasangIndikatorNav, pasangBayanganNav } from './efek.js';
import { suaraDidukung, suaraAktif, aturSuara, bunyi, pasangSuaraAntarmuka } from './suara.js';
import { pasangPemutar } from './pemutar.js';

const agenda = ambilDataEvent();
const state = { tampilan: 'event', pendaftaran: muat() };
const reduceMotion = kurangiGerak;

const eventGrid = document.querySelector('#event-grid');
const form = document.querySelector('#form-rsvp');
const inputNama = document.querySelector('#nama');
const pilihEvent = document.querySelector('#pilihan-event');
const tombolKirim = form.querySelector('button[type="submit"]');
let eventTerpilihDiModal = null;

renderEventGrid(agenda);
renderPendaftaran(state.pendaftaran, perluPeringatan());

eventGrid.addEventListener('click', (e) => {
  const tombol = e.target.closest('button[data-action="detail"]');
  if (!tombol) return;
  const ev = agenda.find(item => String(item.id) === tombol.dataset.id);
  if (!ev) return;
  eventTerpilihDiModal = String(ev.id);
  bukaDetail({
    judul: ev.judul,
    kategori: ev.kategori || 'Event',
    tanggal: ev.tanggal,
    lokasi: ev.lokasi || 'Lokasi menyusul',
    isi: ev.deskripsi,
    nada: tombol.closest('.kartu-event')?.dataset.nada,
  }, tombol);
});

/* ---------- Audio: pemutar jingle (tidak pernah otomatis) ---------- */
const pemutar = pasangPemutar({
  audio: document.querySelector('#audio-jingle'),
  pesan: document.querySelector('#audio-pesan'),
  wadah: document.querySelector('#pemutar'),
});

/* ---------- Audio: efek suara antarmuka (mati sampai dinyalakan pengguna) ---------- */
const tombolSuara = document.querySelector('#tombol-suara');
const statusSuara = document.querySelector('#status-suara');
const pengumumanSuara = document.querySelector('#pengumuman-suara');
if (!suaraDidukung) {
  tombolSuara.hidden = true;
} else {
  pasangSuaraAntarmuka();
  tombolSuara.addEventListener('click', () => {
    const nyala = aturSuara(!suaraAktif());
    tombolSuara.setAttribute('aria-pressed', String(nyala));
    statusSuara.textContent = nyala ? 'hidup' : 'mati';
    pengumumanSuara.textContent = nyala ? 'Suara antarmuka hidup.' : 'Suara antarmuka mati.';
  });
}

/* ---------- Efek visual ---------- */
pasangParalaks(document.querySelector('#hero'));
pasangSorotKartu(eventGrid);
pasangBayanganNav(document.querySelector('.app-navbar'));
const indikatorNav = pasangIndikatorNav(document.querySelector('#menuUtama'));
amatiReveal(document.querySelector('#event'));

/* ---------- Animasi: getar saat isian salah (umpan balik aksi) ---------- */
function getar(el) {
  if (reduceMotion.matches) return;
  el.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' },
     { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
    { duration: 300, easing: 'ease-in-out' });
}

/* ---------- Navigasi antar-tampilan (keluar, tukar, masuk) ---------- */
const semuaSeksi = [...document.querySelectorAll('.view-section')];
let tokenPindah = 0;

function pindahTampilan(nama) {
  if (nama === state.tampilan) { tutupMenu(); return; }
  state.tampilan = nama;
  document.querySelectorAll('#menu-tampilan [data-view]').forEach((b) => {
    const aktif = b.dataset.view === nama;
    b.classList.toggle('active', aktif);
    if (aktif) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  tutupMenu();
  pemutar.jeda(); // jingle tidak terus berbunyi di halaman lain
  indikatorNav.perbarui();

  const dari = semuaSeksi.find(s => !s.hidden);
  const ke = document.getElementById(nama);
  const token = ++tokenPindah;
  if (dari === ke) { ke.getAnimations().forEach(a => a.cancel()); return; } // kembali ke halaman asal saat transisi berjalan

  const tukar = () => {
    if (token !== tokenPindah) return;
    semuaSeksi.forEach((s) => {
      const aktif = s === ke;
      s.hidden = !aktif;
      s.classList.toggle('aktif', aktif);
    });
    document.body.dataset.tampilan = nama;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (nama === 'galeri') pemutar.muatGelombang();
    amatiReveal(ke);
    if (!reduceMotion.matches) {
      ke.animate(
        [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 450, easing: 'cubic-bezier(.22,.8,.24,1)' });
    }
  };

  if (!dari || reduceMotion.matches) { tukar(); return; }
  const keluar = dari.animate(
    [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-10px)' }],
    { duration: 170, easing: 'ease-in', fill: 'forwards' });
  keluar.finished.then(() => { keluar.cancel(); tukar(); }, tukar);
}

document.querySelectorAll('a[data-view], button[data-view]').forEach((el) => {
  el.addEventListener('click', (e) => { e.preventDefault(); pindahTampilan(el.dataset.view); });
});

/* ---------- Validasi & pendaftaran ---------- */
function setError(input, errEl, pesan) {
  input.classList.toggle('is-invalid', Boolean(pesan));
  if (pesan) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  errEl.textContent = pesan || '';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nama = inputNama.value.trim();
  const eventId = pilihEvent.value;
  const errNama = nama.length < 3 ? 'Tulis nama lengkap, minimal 3 huruf.' : '';
  const ev = agenda.find(item => String(item.id) === eventId);
  const errEvent = ev ? '' : 'Pilih salah satu event dulu.';
  setError(inputNama, document.querySelector('#err-nama'), errNama);
  setError(pilihEvent, document.querySelector('#err-event'), errEvent);

  const pertamaSalah = errNama ? inputNama : (errEvent ? pilihEvent : null);
  if (pertamaSalah) { getar(pertamaSalah); bunyi('galat'); pertamaSalah.focus(); return; }

  state.pendaftaran.push({ nama, eventId, event: ev.judul, timestamp: new Date().toISOString() });
  const permanen = simpan(state.pendaftaran);
  renderPendaftaran(state.pendaftaran, perluPeringatan(), { sorotTerbaru: true });
  tampilkanToast(permanen
    ? `Terima kasih, ${nama}! Pendaftaran untuk ${ev.judul} tersimpan di perangkat ini.`
    : `Terima kasih, ${nama}! Pendaftaran untuk ${ev.judul} tercatat sementara.`,
  permanen ? 'sukses' : 'peringatan');
  bunyi('sukses');
  form.reset();

  // Umpan balik visual pada tombol kirim
  tombolKirim.classList.remove('berhasil');
  void tombolKirim.offsetWidth;
  tombolKirim.classList.add('berhasil');
  setTimeout(() => tombolKirim.classList.remove('berhasil'), 1100);
});

[inputNama, pilihEvent].forEach((el) => el.addEventListener('input', () => {
  if (el.classList.contains('is-invalid')) setError(el, document.querySelector(el === inputNama ? '#err-nama' : '#err-event'), '');
}));

/* Tombol "Daftar event ini" di modal: pilih event, tutup modal, fokus ke nama */
document.querySelector('#tombol-daftar-modal').addEventListener('click', () => {
  if (eventTerpilihDiModal) pilihEvent.value = eventTerpilihDiModal;
  setError(pilihEvent, document.querySelector('#err-event'), '');
  tutupDetail(() => inputNama.focus());
});

/* ---------- Penanganan media gagal dimuat ---------- */
function tanganiGambarGagal(img) {
  const wrapper = img.parentElement;
  if (!wrapper) return;
  const info = document.createElement('div');
  info.className = 'img-fallback';
  info.textContent = `⚠️ Gambar "${img.alt}" tidak dapat dimuat.`;
  wrapper.classList.add('is-loaded');
  wrapper.replaceChildren(info);
}
document.querySelectorAll('img.media-img').forEach((img) => {
  const siap = () => img.parentElement?.classList.add('is-loaded'); // mematikan animasi skeleton
  img.addEventListener('load', siap, { once: true });
  img.addEventListener('error', () => tanganiGambarGagal(img), { once: true });
  if (img.complete) { // sudah selesai sebelum listener dipasang
    if (img.naturalWidth === 0) tanganiGambarGagal(img); else siap();
  }
});
