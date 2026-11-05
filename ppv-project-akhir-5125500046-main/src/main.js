// MMB Hub — logika aplikasi. Tidak memanggil objek `bootstrap` langsung:
// semua panggilan pustaka lewat src/ui-pustaka.js (bukaDetail, tutupDetail, tampilkanToast, tutupMenu).

const DATA_EVENT = [
  { id: 'mmb-fest', nama: 'MMB FEST 2026', kategori: 'Festival', tempat: 'Gedung PENS', tanggal: '24 Oktober 2026',
    ringkas: 'Festival tahunan pameran karya multimedia, musik indie, dan pasar kreatif MMB.',
    detail: 'Festival tahunan MMB: pameran karya multimedia, panggung musik indie, dan pasar kreatif. Terbuka untuk mahasiswa dan umum.' },
  { id: 'workshop-mograph', nama: 'Workshop Motion Graphics', kategori: 'Workshop', tempat: 'Lab Studio MMB', tanggal: '02 November 2026',
    ringkas: 'Pelatihan animasi antarmuka dan aset visual 2D menggunakan After Effects & Lottie.',
    detail: 'Pelatihan animasi antarmuka dan aset visual 2D memakai After Effects dan Lottie, dari dasar sampai ekspor untuk web.' },
  { id: 'screening', nama: 'Screening Film Pendek Kampus', kategori: 'Screening', tempat: 'Lokasi menyusul', tanggal: 'Jadwal menyusul',
    ringkas: 'Pemutaran film pendek karya mahasiswa kampus.',
    detail: 'Pemutaran film pendek karya mahasiswa. Lokasi dan jadwal akan diumumkan oleh panitia.' },
];

const state = { tampilan: 'event', pendaftaran: [] };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const eventGrid = document.querySelector('#event-grid');
const form = document.querySelector('#form-rsvp');
const inputNama = document.querySelector('#nama');
const pilihEvent = document.querySelector('#pilihan-event');
let eventTerpilihDiModal = null;

/* ---------- Render agenda & pilihan event dari satu sumber data ---------- */
function kartuEvent(ev) {
  const kolom = document.createElement('div');
  kolom.className = 'col-12 col-md-6';
  kolom.innerHTML = `
    <article class="card h-100 shadow-sm">
      <div class="card-body d-flex flex-column">
        <span class="badge badge-kategori align-self-start mb-2"></span>
        <h3 class="h5 card-title"></h3>
        <p class="text-body-secondary small mb-2" data-meta></p>
        <p class="card-text" data-ringkas></p>
        <button type="button" class="btn btn-outline-primary btn-sm mt-auto align-self-start">Lihat detail</button>
      </div>
    </article>`;
  kolom.querySelector('.badge').textContent = ev.kategori;
  kolom.querySelector('.card-title').textContent = ev.nama;
  kolom.querySelector('[data-meta]').textContent = `📍 ${ev.tempat} | 📅 ${ev.tanggal}`;
  kolom.querySelector('[data-ringkas]').textContent = ev.ringkas;
  kolom.querySelector('button').addEventListener('click', () => {
    eventTerpilihDiModal = ev.id;
    bukaDetail({ judul: ev.nama, meta: `${ev.tempat} · ${ev.tanggal}`, isi: ev.detail });
  });
  return kolom;
}

function isiPilihan() {
  const opsiKosong = new Option('-- Pilih Event --', '');
  pilihEvent.replaceChildren(opsiKosong, ...DATA_EVENT.map((ev) => new Option(ev.nama, ev.id)));
}

eventGrid.replaceChildren(...DATA_EVENT.map(kartuEvent));
isiPilihan();

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
  const errEvent = eventId === '' ? 'Pilih salah satu event dulu.' : '';
  setError(inputNama, document.querySelector('#err-nama'), errNama);
  setError(pilihEvent, document.querySelector('#err-event'), errEvent);

  const pertamaSalah = errNama ? inputNama : (errEvent ? pilihEvent : null);
  if (pertamaSalah) { getar(pertamaSalah); pertamaSalah.focus(); return; }

  const ev = DATA_EVENT.find((x) => x.id === eventId);
  state.pendaftaran.push({ nama, event: ev.nama, timestamp: new Date() }); // disimpan permanen di Sprint P12
  tampilkanToast(`Terima kasih, ${nama}! Kamu terdaftar di ${ev.nama}.`);
  form.reset();
});

[inputNama, pilihEvent].forEach((el) => el.addEventListener('input', () => {
  if (el.classList.contains('is-invalid')) setError(el, document.querySelector(el === inputNama ? '#err-nama' : '#err-event'), '');
}));

/* Tombol "Daftar event ini" di modal: pilih event, tutup modal, fokus ke nama */
document.querySelector('#tombol-daftar-modal').addEventListener('click', () => {
  if (eventTerpilihDiModal) pilihEvent.value = eventTerpilihDiModal;
  tutupDetail();
  inputNama.focus();
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
audio.querySelectorAll('source').forEach((s) => s.addEventListener('error', () => {
  // Pesan muncul hanya bila SEMUA sumber gagal
  if (audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) audioPesan.hidden = false;
}));
