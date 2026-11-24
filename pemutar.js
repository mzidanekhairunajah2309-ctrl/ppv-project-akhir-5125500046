// pemutar.js — pemutar jingle MMB FEST yang terintegrasi dengan desain: tombol putar/jeda (di hero dan galeri),
// scrubber berbentuk waveform dari audio aslinya, dan waktu. Satu elemen <audio> menjadi satu-satunya sumber suara;
// semua kontrol hanya mencerminkan statusnya. Audio TIDAK pernah diputar otomatis.
import { bisukan } from './suara.js';

const JUMLAH_BATANG = 56;
const TITIK_SUHU = [[36, 87, 230], [122, 75, 214], [255, 122, 89], [255, 174, 77]]; // daylight -> tungsten

function format(detik) {
  if (!Number.isFinite(detik)) return '0:00';
  const s = Math.max(0, Math.floor(detik));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function warnaSuhu(t) {
  const seg = t * (TITIK_SUHU.length - 1);
  const i = Math.min(Math.floor(seg), TITIK_SUHU.length - 2);
  const f = seg - i;
  const a = TITIK_SUHU[i];
  const b = TITIK_SUHU[i + 1];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`;
}

function bentukSementara() {
  return Array.from({ length: JUMLAH_BATANG }, (_, i) => 0.22 + 0.78 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)));
}

// Membaca puncak amplitudo dari berkas audio asli. OfflineAudioContext dipakai agar tidak perlu gerakan pengguna.
async function ambilPuncak(sumber) {
  const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  if (!OAC || !sumber) return null;
  const res = await fetch(sumber);
  if (!res.ok) return null;
  const data = (await new OAC(1, 1, 44100).decodeAudioData(await res.arrayBuffer())).getChannelData(0);
  const blok = Math.floor(data.length / JUMLAH_BATANG);
  if (!blok) return null;
  const puncak = [];
  for (let i = 0; i < JUMLAH_BATANG; i += 1) {
    let m = 0;
    for (let j = i * blok; j < (i + 1) * blok; j += 4) m = Math.max(m, Math.abs(data[j]));
    puncak.push(m);
  }
  const maks = Math.max(...puncak) || 1;
  return puncak.map((p) => 0.14 + 0.86 * Math.sqrt(p / maks));
}

export function pasangPemutar({ audio, pesan, wadah }) {
  const tombol = [...document.querySelectorAll('[data-jingle="toggle"]')];
  const kustom = wadah.querySelector('.pemutar__kustom');
  const asli = wadah.querySelector('.pemutar__asli');
  const gelombang = wadah.querySelector('#gelombang');
  const geser = wadah.querySelector('#geser-audio');
  const waktuKini = wadah.querySelector('#waktu-kini');
  const waktuTotal = wadah.querySelector('#waktu-total');
  let menggeser = false;
  let bingkai = 0;
  let gelombangDimuat = false;

  /* ---- Tampilkan pemutar kustom, sembunyikan pemutar bawaan ---- */
  audio.controls = false;
  asli.hidden = true;
  kustom.hidden = false;

  /* ---- Waveform ---- */
  function bangunBatang(tinggi) {
    for (const lapis of [gelombang.querySelector('.gelombang__dasar'), gelombang.querySelector('.gelombang__isi')]) {
      const frag = document.createDocumentFragment();
      tinggi.forEach((h, i) => {
        const b = document.createElement('span');
        b.className = 'batang';
        b.style.setProperty('--h', h.toFixed(3));
        if (lapis.classList.contains('gelombang__isi')) b.style.setProperty('--w', warnaSuhu(i / (tinggi.length - 1)));
        frag.append(b);
      });
      lapis.replaceChildren(frag);
    }
  }
  bangunBatang(bentukSementara());

  // Bentuk asli dimuat sekali, saat galeri pertama kali dibuka (hemat unduhan di tampilan lain).
  function muatGelombang() {
    if (gelombangDimuat) return;
    gelombangDimuat = true;
    const sumber = audio.querySelector('source[type="audio/mpeg"]')?.src;
    ambilPuncak(sumber).then((puncak) => { if (puncak) bangunBatang(puncak); }).catch(() => { /* tetap pakai bentuk sementara */ });
  }

  /* ---- Status dan progres ---- */
  function perbaruiProgres() {
    const total = audio.duration;
    const persen = Number.isFinite(total) && total > 0 ? Math.min(1, audio.currentTime / total) : 0;
    gelombang.style.setProperty('--p', `${(persen * 100).toFixed(2)}%`);
    waktuKini.textContent = format(audio.currentTime);
    if (!menggeser) geser.value = String(Math.round(persen * 1000));
    geser.setAttribute('aria-valuetext', `${format(audio.currentTime)} dari ${format(total)}`);
  }

  function putaran() {
    perbaruiProgres();
    bingkai = audio.paused ? 0 : requestAnimationFrame(putaran);
  }

  function perbaruiStatus() {
    const main = !audio.paused && !audio.ended;
    document.body.classList.toggle('jingle-main', main);
    tombol.forEach((b) => b.setAttribute('aria-pressed', String(main)));
    bisukan(main); // efek suara antarmuka diam selama jingle berbunyi
    if (main && !bingkai) bingkai = requestAnimationFrame(putaran);
  }

  ['play', 'pause'].forEach((nama) => audio.addEventListener(nama, () => { perbaruiStatus(); perbaruiProgres(); }));
  audio.addEventListener('ended', () => { audio.currentTime = 0; perbaruiStatus(); perbaruiProgres(); });
  audio.addEventListener('timeupdate', () => { if (audio.paused) perbaruiProgres(); });
  ['loadedmetadata', 'durationchange'].forEach((nama) => audio.addEventListener(nama, () => {
    waktuTotal.textContent = format(audio.duration);
    perbaruiProgres();
  }));

  /* ---- Kontrol ---- */
  tombol.forEach((b) => b.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => { /* kegagalan dilaporkan lewat event error */ });
    else audio.pause();
  }));

  geser.addEventListener('pointerdown', () => { menggeser = true; });
  ['pointerup', 'pointercancel', 'blur'].forEach((nama) => geser.addEventListener(nama, () => { menggeser = false; }));
  geser.addEventListener('input', () => {
    if (Number.isFinite(audio.duration)) audio.currentTime = (Number(geser.value) / 1000) * audio.duration;
    perbaruiProgres();
  });

  /* ---- Penanganan audio gagal dimuat ---- */
  const tampilkanGagal = () => {
    pesan.hidden = false;
    wadah.classList.add('pemutar--gagal');
    tombol.forEach((b) => { b.disabled = true; });
    geser.disabled = true;
  };
  const pulih = () => {
    pesan.hidden = true;
    wadah.classList.remove('pemutar--gagal');
    tombol.forEach((b) => { b.disabled = false; });
    geser.disabled = false;
  };
  audio.addEventListener('error', tampilkanGagal);
  audio.querySelector('source:last-of-type')?.addEventListener('error', tampilkanGagal);
  ['loadeddata', 'loadedmetadata'].forEach((nama) => audio.addEventListener(nama, pulih));
  if (audio.error || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) tampilkanGagal();
  if (audio.readyState >= 1) { waktuTotal.textContent = format(audio.duration); }

  return {
    muatGelombang,
    jeda() { if (!audio.paused) audio.pause(); },
  };
}
