# MMB Media & Event Hub

Aplikasi web untuk melihat agenda event MMB, mendaftar, dan menjelajahi galeri karya.
Project Akhir Praktikum Pemrograman Visual (TB033109), 3 D3 MM B, PENS. Dikembangkan dari Tugas 4.

**Masalah dalam satu kalimat:** info event dan karya mahasiswa MMB tersebar di banyak kanal, sehingga mahasiswa baru sering ketinggalan dan panitia sulit mendata peminat.

## Cara menjalankan
1. Clone repositori ini, atau unduh sebagai ZIP lalu ekstrak.
2. Buka `index.html` di Chrome atau Firefox (klik dua kali sudah cukup).
3. Butuh koneksi internet: Bootstrap 5.3.3 dimuat dari CDN jsDelivr.

## Dokumen
- [Project charter](docs/CHARTER.md)
- [Roadmap P10–P14](docs/ROADMAP.md)
- [Dependensi](DEPENDENCIES.md)

## Struktur folder
```
index.html          halaman utama (3 tampilan)
src/style.css       gaya sendiri, dimuat sesudah Bootstrap
src/ui-pustaka.js   satu-satunya berkas yang memanggil API JavaScript Bootstrap
src/main.js         logika aplikasi
assets/             gambar dan audio
docs/               charter dan roadmap
```
