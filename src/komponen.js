function elemen(tag, kelas, teks) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks !== undefined) el.textContent = teks;
  return el;
}

export function KartuEvent(event) {
  const kolom = elemen('div', 'col-12 col-md-6');
  const kartu = elemen('article', 'card h-100 shadow-sm');
  const isi = elemen('div', 'card-body text-break');
  const tombol = elemen('button', 'btn btn-outline-primary btn-sm', 'Lihat Detail');
  tombol.type = 'button';
  tombol.dataset.action = 'detail';
  tombol.dataset.id = String(event.id);
  isi.append(
    elemen('span', 'badge badge-kategori mb-2', event.kategori || 'Event'),
    elemen('h3', 'h5 card-title', event.judul),
    elemen('p', 'text-body-secondary small mb-1', `${event.tanggal} · ${event.lokasi || 'Lokasi menyusul'}`),
    elemen('p', 'card-text', event.deskripsi),
    tombol,
  );
  kartu.append(isi);
  kolom.append(kartu);
  return kolom;
}

export function KartuPendaftaran(item) {
  const kartu = elemen('li', 'list-group-item text-break');
  const tanggal = elemen('time', 'small text-body-secondary', new Date(item.timestamp).toLocaleString('id-ID'));
  tanggal.dateTime = item.timestamp;
  kartu.append(elemen('strong', 'd-block', item.nama), elemen('span', 'd-block', item.event), tanggal);
  return kartu;
}
