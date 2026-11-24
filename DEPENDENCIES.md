# DEPENDENCIES

## Pustaka
| Nama | Versi | Sumber | Dipakai untuk |
|------|-------|--------|---------------|
| Bootstrap (CSS) | 5.3.3 | Salinan lokal di `vendor/` dari jsDelivr: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css` | gaya komponen, grid, formulir |
| Bootstrap (JS bundle, termasuk Popper) | 5.3.3 | Salinan lokal di `vendor/` dari jsDelivr: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js` | perilaku navbar-collapse, modal, toast |

| Bricolage Grotesque (variabel, subset latin) | 5.3.0 | Salinan lokal `vendor/fonts/bricolage-grotesque-latin-wdth-normal.woff2` dari paket npm `@fontsource-variable/bricolage-grotesque` (lisensi SIL OFL 1.1) | font judul (sumbu bobot dan lebar) |
| Instrument Sans (variabel, subset latin) | 5.3.0 | Salinan lokal `vendor/fonts/instrument-sans-latin-wght-normal.woff2` dari paket npm `@fontsource-variable/instrument-sans` (lisensi SIL OFL 1.1) | font isi teks |

Versi dikunci pada nomor pasti (`@5.3.3`, `5.3.0`), tidak memakai `@latest`. Kedua font disajikan dari `vendor/fonts/` (bukan Google Fonts), jadi aplikasi tetap berjalan tanpa internet. Teks cadangan: `Segoe UI`/`system-ui`.

## Ukuran transfer
Ukuran berkas lokal di Sprint 4 (tanpa kompresi HTTP):

| Berkas | Ukuran asli |
|--------|-------------|
| `bootstrap.min.css` | 232.803 B |
| `bootstrap.bundle.min.js` | 80.721 B |
| `bricolage-grotesque-latin-wdth-normal.woff2` | 78.156 B |
| `instrument-sans-latin-wght-normal.woff2` | 30.092 B |

## Komponen yang dipakai
| Komponen | Letak | Fungsi di aplikasi |
|----------|-------|--------------------|
| Navbar + Collapse | `index.html`, bagian atas | navigasi 3 tampilan; menu menyusut di layar ±400 px |
| Card | formulir pendaftaran, agenda, galeri, profil | wadah konten |
| Modal | `#modalDetail` | detail event dan tombol "Daftar event ini" |
| Toast | `#toastInfo` | konfirmasi pendaftaran |

Utilitas pendukung: `form-control`, `form-select`, `btn`, `badge`, `alert`. Tata letak grid agenda, galeri, dan profil memakai CSS Grid buatan sendiri di `src/style.css`.

Tanpa pustaka tambahan: animasi (CSS, Web Animations API, IntersectionObserver), efek suara (Web Audio API), dan ikon (SVG sebaris) ditulis dengan vanilla JavaScript/CSS.

## Cara pustaka dipanggil
Semua panggilan API JavaScript Bootstrap (`bootstrap.Modal`, `bootstrap.Toast`, `bootstrap.Collapse`) hanya ada di `src/ui-pustaka.js`. `src/main.js` memanggil fungsi pembungkusnya: `bukaDetail`, `tutupDetail`, `tampilkanToast`, `tutupMenu`.

Tema: warna merek diubah lewat variabel CSS Bootstrap (`--bs-primary`, `--bs-btn-*`, `--bs-navbar-*`) di `src/style.css`, yang dimuat sesudah `bootstrap.min.css`. Modul `efek.js`, `suara.js`, dan `pemutar.js` tidak memanggil API Bootstrap.

## Empat pertanyaan sebelum memasang pustaka
1. **Masalah apa yang diselesaikan pustaka ini?** Modal, toast, dan navbar responsif yang aksesibel (fokus, tombol Esc, atribut ARIA) tanpa menulis dari nol.
2. **Berapa biayanya?** Sekitar 314 kB untuk CSS dan JS tanpa kompresi; tidak perlu koneksi ke CDN saat aplikasi berjalan.
3. **Apakah dipelihara dan aman dipakai?** Bootstrap aktif dipelihara, berlisensi MIT, dan dokumentasi tiap versi tersedia di getbootstrap.com/docs/5.3.
4. **Bagaimana kalau suatu hari diganti?** Panggilan JavaScript terkumpul di satu berkas (`src/ui-pustaka.js`), jadi penggantian hanya menyentuh berkas itu dan markup komponen.

## Empat pertanyaan untuk font lokal
1. **Masalah apa yang diselesaikan?** Judul yang ekspresif dan konsisten di semua perangkat; font sistem tidak bisa memberi karakter visual yang sama.
2. **Berapa biayanya?** Sekitar 108 kB untuk dua berkas woff2 (tanpa kompresi HTTP), dimuat dengan `font-display: swap`; judul memakai `preload`.
3. **Apakah aman dipakai?** Keduanya berlisensi SIL OFL 1.1 (teks lisensi ada di `vendor/`), versi dikunci, dan disajikan lokal tanpa CDN.
4. **Bagaimana kalau diganti?** Cukup ubah dua blok `@font-face` dan dua variabel `--font-judul`/`--font-isi` di `src/style.css`.
