const SVG_NS = 'http://www.w3.org/2000/svg';

// Isi ikon statis (bukan data pengguna), digambar dengan garis 1.8px pada kanvas 24x24.
const IKON = {
  lokasi: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  kalender: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  panah: '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
  centang: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
};

function elemen(tag, kelas, teks) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks !== undefined) el.textContent = teks;
  return el;
}

export function ikon(nama, kelas = 'ikon') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', kelas);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = IKON[nama] || '';
  return svg;
}

// Nada warna per kategori: Festival = biru daylight, Workshop = ungu, Screening = amber tungsten.
// Kategori lain (mis. dari katalog lama) bergilir mengikuti urutan agar tetap berwarna.
const NADA = { festival: 1, workshop: 2, screening: 3 };
function nadaKategori(kategori, indeks) {
  const kunci = String(kategori || '').trim().toLowerCase();
  return NADA[kunci] ?? (indeks % 3) + 1;
}

// "25 Oktober 2026" tampil sebagai hari besar + bulan + tahun. Teks lain ("Jadwal menyusul") tampil apa adanya.
const POLA_TANGGAL = /^(\d{1,2})\s+(\p{L}+)\s+(\d{4})$/u;
function Tanggal(teks) {
  const el = elemen('div', 'tanggal');
  const cocok = POLA_TANGGAL.exec(String(teks).trim());
  if (cocok) {
    const bawah = elemen('div', 'tanggal__bawah');
    bawah.append(elemen('span', 'tanggal__bulan', cocok[2]), elemen('span', 'tanggal__tahun', cocok[3]));
    el.append(elemen('span', 'tanggal__hari', cocok[1]), bawah);
  } else {
    el.classList.add('tanggal--belum');
    el.append(ikon('kalender', 'ikon tanggal__ikon'), elemen('span', 'tanggal__teks', teks));
  }
  return el;
}

export function KartuEvent(event, { indeks = 0, sorot = false } = {}) {
  const nada = nadaKategori(event.kategori, indeks);
  const kartu = elemen('article', `card kartu-event nada-${nada}${sorot ? ' kartu-event--sorot' : ''}`);
  kartu.dataset.nada = String(nada);
  kartu.dataset.reveal = '';
  kartu.style.setProperty('--i', String(Math.min(indeks, 6)));

  const badan = elemen('div', 'kartu-event__badan text-break');
  const lokasi = elemen('p', 'lokasi');
  lokasi.append(ikon('lokasi'), elemen('span', '', event.lokasi || 'Lokasi menyusul'));

  const tombol = elemen('button', 'btn-detail', 'Lihat Detail');
  tombol.type = 'button';
  tombol.dataset.action = 'detail';
  tombol.dataset.id = String(event.id);
  tombol.setAttribute('aria-label', `Lihat Detail ${event.judul}`);
  tombol.append(ikon('panah'));

  badan.append(
    elemen('span', 'badge badge-kategori', event.kategori || 'Event'),
    elemen('h3', 'card-title', event.judul),
    lokasi,
    elemen('p', 'card-text', event.deskripsi),
    tombol,
  );
  kartu.append(Tanggal(event.tanggal), badan);
  return kartu;
}

export function KartuPendaftaran(item) {
  const kartu = elemen('li', 'tiket text-break');
  const bidang = elemen('div', 'tiket__bidang');
  const isi = elemen('div', 'tiket__isi');
  const tanggal = elemen('time', 'tiket__waktu', new Date(item.timestamp).toLocaleString('id-ID'));
  tanggal.dateTime = item.timestamp;
  isi.append(elemen('strong', 'd-block tiket__nama', item.nama), elemen('span', 'd-block tiket__event', item.event), tanggal);
  const stub = elemen('div', 'tiket__stub');
  stub.setAttribute('aria-hidden', 'true');
  stub.append(ikon('centang'));
  bidang.append(isi, stub);
  kartu.append(bidang);
  return kartu;
}
