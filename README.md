# MMB Hub — Agenda & Pendaftaran Event MMB

Prototipe web untuk melihat agenda MMB, membuka detail event, mencatat pendaftaran, dan menjelajahi galeri karya. Project Akhir Praktikum Pemrograman Visual (TB033109), D3 Multimedia Broadcasting, PENS, dikembangkan dari Tugas 4. Sprint 4 (P12) meneruskan refactor ES Modules P11 (`d57ccd3`).

**Batas prototipe:** pendaftaran dicatat di browser ini saja. Tidak ada server, sinkronisasi antarperangkat, pengiriman data ke panitia, akun, atau pembayaran. Gunakan nama fiktif saat demo.

## Menjalankan aplikasi

- **VS Code Live Server:** buka folder proyek, klik kanan `index.html` di akar, lalu pilih **Open with Live Server**.
- **Python:** dari akar repositori, jalankan `python -m http.server 8000`, lalu buka <http://localhost:8000/>.

Jangan menjalankan dengan klik ganda (`file://`); modul ES perlu dilayani lewat HTTP. Bootstrap dan aset tersedia lokal, jadi aplikasi tidak memerlukan CDN saat berjalan. Data `localStorage` terikat pada origin (termasuk port). Gunakan port yang sama untuk melihat riwayat lama.

## Fitur MVP

| ID | Fitur | Status Sprint 4 |
|---|---|---|
| F1 | Agenda, kategori, lokasi, dan tanggal | Selesai; agenda bawaan adalah data demo, bukan jadwal resmi terkini. |
| F2 | RSVP dengan validasi nama/event dan konfirmasi | Selesai untuk prototipe lokal; riwayat bertahan setelah muat ulang bila penyimpanan tersedia. Jika gagal, banner dan toast menjelaskan bahwa pendaftaran hanya sementara. |
| F3 | Detail dan tombol daftar dari modal | Selesai; pilihan event disalin ke form dan fokus pindah ke input nama setelah modal ditutup. |
| F4 | Galeri karya | Tersedia; ada pesan pengganti jika gambar gagal dimuat. |
| F5 | Audio highlight | Tersedia; pemutar native dengan sumber MP3/OGG dan pesan jika media gagal dimuat. |

## Struktur folder

```text
index.html            Tiga tampilan: agenda, galeri, dan tentang
src/main.js           Navigasi, validasi form, state tampilan, delegasi detail
src/data.js           Agenda dan kontrak penyimpanan pendaftaran
src/komponen.js       Komponen DOM yang dipakai ulang
src/ui.js             Render daftar agenda, opsi RSVP, riwayat, dan banner
src/ui-pustaka.js     Pembungkus API Bootstrap (modal, toast, collapse)
src/style.css         Tema dan gaya proyek
assets/               Poster, gambar karya, jingle, dan manifest
vendor/               Bootstrap 5.3.3 lokal, source maps, dan lisensi
docs/                 Charter dan roadmap
```

Pintu masuk modular sekarang ada di akar. Salinan subfolder dari P11 tidak diperlukan untuk menjalankan aplikasi. Lihat juga [peta modul](MODULE_MAP.md), [charter](docs/CHARTER.md), [roadmap](ROADMAP.md), dan [changelog](CHANGELOG.md).

## Kontrak komponen dan penyimpanan

- `KartuEvent(event)` menerima `{ id, judul, kategori?, tanggal, lokasi?, deskripsi }`, mengembalikan `HTMLElement` berisi kartu, dan dipakai untuk setiap item di agenda. Tombol detail diproses oleh satu listener pada `#event-grid`.
- `KartuPendaftaran(item)` menerima `{ nama, eventId, event, timestamp }`, mengembalikan `<li>` untuk setiap item riwayat. Teks dinamis, termasuk nama, ditulis memakai `textContent` baik di kartu maupun umpan balik form. Nilai seperti `<b>Nama</b>` tampil literal.
- `KUNCI = 'mmb-hub:v1'` berisi array RSVP. `muat()` membaca ulang `localStorage` dan mengembalikan array; JSON rusak/non-array menjadi daftar kosong, item tidak sah disaring. Item sah memiliki nama dan judul event yang tidak kosong, ID string tidak kosong atau bilangan bulat aman, serta timestamp string yang dapat diparse. Penulisan dari form memakai timestamp ISO.
- `simpan(data)` menyaring dan menulis JSON; mengembalikan `true` jika penulisan berhasil dan `false` jika hanya ada cadangan memori. `perluPeringatan()` memberi tahu UI saat akses penyimpanan gagal atau ada perubahan tertunda. Cadangan memori tidak bertahan saat refresh; operasi simpan berikutnya mencoba menulis kembali seluruh daftar.
- `ambilDataEvent()` tetap mendukung pembacaan katalog lama P11 (`mmb-project-event`) secara defensif. Jika tidak ada katalog, akses diblokir, atau isinya bukan array yang bisa dibaca, agenda bawaan tetap tersedia. Katalog lama bukan kumpulan RSVP dan tidak dimigrasikan ke kunci RSVP.

## Verifikasi cepat

1. Daftar dengan nama fiktif, pastikan toast dan riwayat tampil, lalu muat ulang pada origin yang sama. Entri harus tetap ada.
2. Di origin uji terpisah, set nilai `mmb-hub:v1` ke `{rusak` melalui tab **Application → Local Storage**, lalu muat ulang. Agenda harus tetap tampil dan form masih bisa dipakai.
3. Masukkan `<b>Nama Demo</b>` sebagai nama. Teks harus tampil apa adanya, bukan menjadi elemen HTML baru.
4. Buka detail event dan tekan **Daftar event ini**. Modal harus tertutup, event cocok dengan detail, dan fokus kembali ke form. Coba juga navigasi menu pada lebar layar sekitar 400 px.

## Kredit aset dan pustaka

- [Bootstrap 5.3.3](https://getbootstrap.com/docs/5.3/) dan Popper 2.11.8 (di dalam bundle): MIT, lihat [`vendor/`](vendor/) dan [DEPENDENCIES.md](DEPENDENCIES.md).
- Poster MMB FEST: desain mandiri / Tim MMB. Gambar Kopi Tjangkir: desain mandiri. Jingle: produksi internal MMB. Kredit dan hak penggunaan mengikuti [manifest aset](assets/manifest.json) dari repositori awal.

## Atribusi bantuan AI

Arena.ai Agent Mode membantu menyusun perubahan Sprint 4: komponen DOM, penyimpanan defensif, integrasi UI, dokumentasi, dan skenario pengujian browser. Kode dasar P11, desain, dan aset berasal dari repositori mahasiswa. Atribusi ini tidak menggantikan peninjauan mahasiswa: baca dan uji sendiri sebelum pengumpulan, pahami bagian yang dibantu AI, dan cantumkan pengungkapan ini sesuai aturan integritas mata kuliah.
