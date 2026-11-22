# Changelog

Semua perubahan penting MMB Hub dicatat di sini. Format mengikuti [Keep a Changelog 1.1.0](https://keepachangelog.com/id/1.1.0/) dan penomoran mengikuti [Semantic Versioning](https://semver.org/lang/id/); awalan `v` digunakan untuk tag.

## [Unreleased]

## [0.4.0] - 2026-11-18

### Added
- Komponen DOM reusable `KartuEvent` dan `KartuPendaftaran` yang merender teks dinamis dengan `textContent`.
- Riwayat RSVP lokal dengan kunci berversi `mmb-hub:v1`, validasi dan filter data rusak, cadangan memori, serta peringatan bila penyimpanan tidak tersedia.
- Kontrak modul, atribusi bantuan AI, dan pembaruan roadmap Sprint 4.

### Changed
- Akar repositori menjadi lokasi utama versi modular; tidak perlu membuka salinan proyek bertingkat.
- Bootstrap 5.3.3 disajikan dari `vendor/` agar demo bisa dilakukan tanpa CDN.

### Fixed
- Membuka kembali rincian dalam modal Bootstrap, memilih event dari modal, dan mengembalikan fokus setelah modal ditutup.
- Aplikasi tetap berjalan jika penyimpanan berisi JSON rusak atau tidak bisa diakses.

## [0.3.0] - 2026-11-05

### Changed
- Refactor P11: memecah logika proyek menjadi ES Modules `main.js`, `ui.js`, dan `data.js`.

## [0.2.0] - 2026-10-30

### Added
- Bootstrap 5.3.3 untuk navbar, card, modal, dan toast, serta pembungkus `ui-pustaka.js`.

### Fixed
- Gambar galeri lebih responsif dan menu seluler menutup setelah navigasi.

## [0.1.0] - 2026-10-25

### Added
- Basis aplikasi Tugas 4, project charter, dan struktur awal proyek.
