// src/data.js — Modul Data dan State Proyek Akhir MMB Hub

let daftarEvent = [
  {
    id: 1,
    judul: "MMB FEST 2026",
    kategori: "Festival",
    tanggal: "25 Oktober 2026",
    lokasi: "Gedung Teater PENS",
    deskripsi: "Pameran karya multimedia, musik indie, dan pasar kreatif MMB."
  },
  {
    id: 2,
    judul: "Workshop Motion Graphics",
    kategori: "Workshop",
    tanggal: "12 November 2026",
    lokasi: "Lab Komputer MMB",
    deskripsi: "Pelatihan asesmen skrip dan animasi 3D menggunakan After Effects & Lottie."
  }
];

// Ambil data dari localStorage jika ada, atau gunakan default
export function ambilDataEvent() {
  const dataSimpan = localStorage.getItem('mmb-project-event');
  if (dataSimpan) {
    try {
      daftarEvent = JSON.parse(dataSimpan);
    } catch (e) {
      console.error("Gagal parse data:", e);
    }
  }
  return daftarEvent;
}

export function tambahEventBaru(eventBaru) {
  daftarEvent.push(eventBaru);
  localStorage.setItem('mmb-project-event', JSON.stringify(daftarEvent));
}