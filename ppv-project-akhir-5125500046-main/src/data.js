// src/data.js — Gudang Data dan State Proyek Akhir MMB Hub

export const daftarEvent = [
  {
    id: "mmb-fest-2026",
    judul: "MMB FEST 2026",
    kategori: "Festival",
    tanggal: "20 Oktober 2026",
    lokasi: "Gedung Teater PENS",
    deskripsi: "Semua ruhunan pameran karya multimedia, musik indie, dan pasar kreatif MMB.",
    status: "Tersedia"
  },
  {
    id: "workshop-motion",
    judul: "Workshop Motion Graphics",
    kategori: "Workshop",
    tanggal: "5 November 2026",
    lokasi: "Lab Komputer MMB",
    deskripsi: "Pelatihan asesmen skrip dan animasi 3D menggunakan After Effects & Lottie.",
    status: "Tersedia"
  },
  {
    id: "screening-film",
    judul: "Screening Film Pendek Kampus",
    kategori: "Screening",
    tanggal: "18 November 2026",
    lokasi: "Aula Pascasarjana PENS",
    deskripsi: "Pemutaran film pendek, karya mahasiswa kampus.",
    status: "Tersedia"
  }
];

// Fungsi untuk mengambil data event
export function ambilSemuaEvent() {
  return daftarEvent;
}