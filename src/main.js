import { ambilDataEvent, muat, simpan, perluPeringatan } from './data.js';
import { renderEventGrid, renderPendaftaran } from './ui.js';
import { bukaDetail, tutupDetail, tampilkanToast, tutupMenu } from './ui-pustaka.js';

const agenda = ambilDataEvent();
const state = { tampilan: 'event', pendaftaran: muat() };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const eventGrid = document.querySelector('#event-grid');
const form = document.querySelector('#form-rsvp');
const inputNama = document.querySelector('#nama');
const pilihEvent = document.querySelector('#pilihan-event');
let eventTerpilihDiModal = null;

renderEventGrid(agenda);
renderPendaftaran(state.pendaftaran, perluPeringatan());

eventGrid.addEventListener('click', (e) => {
  const tombol = e.target.closest('button[data-action="detail"]');
  if (!tombol) return;
  const ev = agenda.find(item => String(item.id) === tombol.dataset.id);
  if (!ev) return;
  eventTerpilihDiModal = String(ev.id);
  bukaDetail({ judul: ev.judul, meta: `${ev.tanggal} · ${ev.lokasi || 'Lokasi menyusul'}`, isi: ev.deskripsi }, tombol);
});

/* ---------- Animasi: masuk tampilan (transisi state) ---------- */
function animasiMasuk(el) {
  if (reduceMotion.matches) return;
  el.animate(
    [{ opacity: 0, transform: 'translateY(15px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 250, easing: 'ease-out' });
}

/* ---------- Animasi: getar saat isian salah (umpan balik aksi) ---------- */
function getar(el) {
  if (reduceMotion.matches) return;
  el.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' },
     { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
    { duration: 300, easing: 'ease-in-out' });
}

/* ---------- Navigasi antar-tampilan ---------- */
function pindahTampilan(nama) {
  if (nama === state.tampilan) { tutupMenu(); return; }
  state.tampilan = nama;
  document.querySelectorAll('#menu-tampilan [data-view]').forEach((b) => {
    const aktif = b.dataset.view === nama;
    b.classList.toggle('active', aktif);
    if (aktif) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.view-section').forEach((s) => {
    const aktif = s.id === nama;
    s.hidden = !aktif;
    s.classList.toggle('aktif', aktif);
    if (aktif) animasiMasuk(s);
  });
  tutupMenu();
  window.scrollTo({ top: 0 });
}

document.querySelectorAll('[data-view]').forEach((el) => {
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
  if (pertamaSalah) { getar(pertamaSalah); pertamaSalah.focus(); return; }

  state.pendaftaran.push({ nama, eventId, event: ev.judul, timestamp: new Date().toISOString() });
  const permanen = simpan(state.pendaftaran);
  renderPendaftaran(state.pendaftaran, perluPeringatan());
  tampilkanToast(permanen
    ? `Terima kasih, ${nama}! Pendaftaran untuk ${ev.judul} tersimpan di perangkat ini.`
    : `Terima kasih, ${nama}! Pendaftaran untuk ${ev.judul} tercatat sementara.`);
  form.reset();
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
  wrapper.replaceChildren(info);
}
document.querySelectorAll('img.media-img').forEach((img) => {
  img.addEventListener('error', () => tanganiGambarGagal(img), { once: true });
  if (img.complete && img.naturalWidth === 0) tanganiGambarGagal(img); // error terlanjur terjadi sebelum listener dipasang
});

const audio = document.querySelector('#audio-jingle');
const audioPesan = document.querySelector('#audio-pesan');
const tampilkanGagalAudio = () => { audioPesan.hidden = false; };
audio.addEventListener('error', tampilkanGagalAudio);
audio.querySelector('source:last-of-type')?.addEventListener('error', tampilkanGagalAudio);
audio.addEventListener('loadeddata', () => { audioPesan.hidden = true; });
if (audio.error || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) tampilkanGagalAudio();
