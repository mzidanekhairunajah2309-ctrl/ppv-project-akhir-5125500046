# Changelog

Semua perubahan penting MMB Hub dicatat di sini. Format mengikuti [Keep a Changelog 1.1.0](https://keepachangelog.com/id/1.1.0/) dan penomoran mengikuti [Semantic Versioning](https://semver.org/lang/id/); awalan `v` digunakan untuk tag.

## [Unreleased]

### Added
- Redesain visual total bergaya editorial/creative agency dengan konsep "suhu warna": biru daylight (poster MMB FEST) berpadu amber tungsten (Kopi Tjangkir). Tiap tampilan punya atmosfer gradien sendiri (Event, Galeri, Tentang).
- Hero baru dengan poster interaktif yang memutar jingle, cincin sinyal beranimasi, dan parallax pointer.
- Kartu event bergaya slate dengan spine tanggal berwarna per kategori dan kartu sorotan; riwayat pendaftaran berbentuk tiket.
- Pemutar jingle terintegrasi dengan scrubber waveform yang dibaca dari audio asli, tersedia di hero dan galeri.
- Efek suara antarmuka opsional (disintesis Web Audio API, mati secara bawaan, tombol "Suara" di navbar, dibisukan saat jingle diputar).
- Modul `efek.js`, `suara.js`, dan `pemutar.js`; font lokal Bricolage Grotesque dan Instrument Sans di `vendor/fonts/` beserta lisensinya.
- Navbar kaca dengan indikator aktif yang bergeser, transisi keluar-masuk antar-tampilan, scroll reveal, dan dukungan `prefers-reduced-motion`.

### Changed
- `KartuEvent(event, opsi?)` kini mengembalikan `<article>` kartu (bukan kolom grid) dan menerima `{ indeks, sorot }` opsional.
- `bukaDetail` menerima `kategori`, `tanggal`, `lokasi`, dan `nada` terpisah; `tampilkanToast(pesan, jenis?)` mendukung `'peringatan'`; `renderPendaftaran` menerima `{ sorotTerbaru }` opsional.
- Susunan tampilan Event: hero, agenda, lalu pendaftaran dan riwayat berdampingan.

### Fixed
- Teks, data event, aset, kunci `localStorage`, validasi, modal, dan toast tidak berubah.

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
