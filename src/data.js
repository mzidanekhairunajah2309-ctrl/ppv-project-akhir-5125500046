export const KUNCI = 'mmb-hub:v1';
const KUNCI_EVENT_LAMA = 'mmb-project-event';

const AGENDA_AWAL = [
  { id: 1, judul: 'MMB FEST 2026', kategori: 'Festival', tanggal: '25 Oktober 2026', lokasi: 'Gedung Teater PENS', deskripsi: 'Pameran karya multimedia, musik indie, dan pasar kreatif MMB.' },
  { id: 2, judul: 'Workshop Motion Graphics', kategori: 'Workshop', tanggal: '12 November 2026', lokasi: 'Lab Komputer MMB', deskripsi: 'Pelatihan asesmen skrip dan animasi 3D menggunakan After Effects & Lottie.' },
  { id: 'screening', judul: 'Screening Film Pendek Kampus', kategori: 'Screening', tanggal: 'Jadwal menyusul', lokasi: 'Lokasi menyusul', deskripsi: 'Pemutaran film pendek karya mahasiswa. Lokasi dan jadwal akan diumumkan oleh panitia.' },
];

let cadangan = [];
let terbaca = undefined;
let tertunda = false;
let bacaGagal = false;
let agendaGagal = false;

const teksSah = nilai => typeof nilai === 'string' && nilai.trim() !== '';
const idSah = nilai => teksSah(nilai) || Number.isSafeInteger(nilai);
const objek = nilai => nilai && typeof nilai === 'object' && !Array.isArray(nilai);

function arrayJSON(mentah) {
  try {
    const data = JSON.parse(mentah);
    return Array.isArray(data) ? data : null;
  } catch { return null; }
}

function pendaftaranSah(data) {
  return Array.isArray(data) ? data.filter(item => objek(item) &&
    teksSah(item.nama) && idSah(item.eventId) && teksSah(item.event) &&
    teksSah(item.timestamp) && Number.isFinite(Date.parse(item.timestamp))) : [];
}

export function ambilDataEvent() {
  try {
    const lama = arrayJSON(globalThis.localStorage.getItem(KUNCI_EVENT_LAMA));
    agendaGagal = false;
    return lama === null ? AGENDA_AWAL : lama.filter(ev => objek(ev) && idSah(ev.id) &&
      teksSah(ev.judul) && teksSah(ev.tanggal) && teksSah(ev.deskripsi) &&
      (ev.kategori == null || typeof ev.kategori === 'string') && (ev.lokasi == null || typeof ev.lokasi === 'string'));
  } catch {
    agendaGagal = true;
    return AGENDA_AWAL;
  }
}

export function muat() {
  try {
    const mentah = globalThis.localStorage.getItem(KUNCI);
    bacaGagal = false;
    if (tertunda && (terbaca === undefined || mentah === terbaca)) return cadangan;
    terbaca = mentah;
    tertunda = false;
    cadangan = pendaftaranSah(arrayJSON(mentah));
  } catch { bacaGagal = true; }
  return cadangan;
}

export function simpan(data) {
  cadangan = pendaftaranSah(data);
  try {
    const json = JSON.stringify(cadangan);
    globalThis.localStorage.setItem(KUNCI, json);
    terbaca = json;
    tertunda = false;
    bacaGagal = false;
    return true;
  } catch {
    tertunda = true;
    return false;
  }
}

export function perluPeringatan() {
  return tertunda || bacaGagal || agendaGagal;
}
