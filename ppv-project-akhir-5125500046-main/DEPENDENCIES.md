# DEPENDENCIES

## Pustaka
| Nama | Versi | Sumber | Dipakai untuk |
|------|-------|--------|---------------|
| Bootstrap (CSS) | 5.3.3 | CDN jsDelivr: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css` | gaya komponen, grid, formulir |
| Bootstrap (JS bundle, termasuk Popper) | 5.3.3 | CDN jsDelivr: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js` | perilaku navbar-collapse, modal, toast |

Versi dikunci pada nomor pasti (`@5.3.3`), tidak memakai `@latest`.

## Ukuran transfer
Diukur dari tab Network (Disable cache dicentang, muat ulang halaman):

| Berkas | Ukuran transfer (Network) | Ukuran asli | Catatan |
|--------|---------------------------|-------------|---------|
| bootstrap.min.css | **[ISI dari kolom Size di Network] kB** | 232.803 B | gzip -9 paket npm: 30.777 B (± 31 kB), sebagai pembanding |
| bootstrap.bundle.min.js | **[ISI dari kolom Size di Network] kB** | 80.721 B | gzip -9 paket npm: 23.700 B (± 24 kB), sebagai pembanding |

## Komponen yang dipakai
| Komponen | Letak | Fungsi di aplikasi |
|----------|-------|--------------------|
| Navbar + Collapse | `index.html`, bagian atas | navigasi 3 tampilan; menu menyusut di layar ±400 px |
| Card | formulir pendaftaran, agenda, galeri, profil | wadah konten |
| Modal | `#modalDetail` | detail event dan tombol "Daftar event ini" |
| Toast | `#toastInfo` | konfirmasi pendaftaran |

Utilitas pendukung: grid (`row`, `col-*`), `form-control`, `form-select`, `btn`, `badge`.

## Cara pustaka dipanggil
Semua panggilan API JavaScript Bootstrap (`bootstrap.Modal`, `bootstrap.Toast`, `bootstrap.Collapse`) hanya ada di `src/ui-pustaka.js`. `src/main.js` memanggil fungsi pembungkusnya: `bukaDetail`, `tutupDetail`, `tampilkanToast`, `tutupMenu`.

Tema: warna merek diubah lewat variabel CSS Bootstrap (`--bs-primary`, `--bs-btn-*`, `--bs-navbar-*`) di `src/style.css`, yang dimuat sesudah `bootstrap.min.css`.

## Empat pertanyaan sebelum memasang pustaka
1. **Masalah apa yang diselesaikan pustaka ini?** Modal, toast, dan navbar responsif yang aksesibel (fokus, tombol Esc, atribut ARIA) tanpa menulis dari nol.
2. **Berapa biayanya?** Sekitar 55 kB transfer (CSS + JS, gzip) dan satu ketergantungan pada CDN; cukup untuk aplikasi kecil ini.
3. **Apakah dipelihara dan aman dipakai?** Bootstrap aktif dipelihara, berlisensi MIT, dan dokumentasi tiap versi tersedia di getbootstrap.com/docs/5.3.
4. **Bagaimana kalau suatu hari diganti?** Panggilan JavaScript terkumpul di satu berkas (`src/ui-pustaka.js`), jadi penggantian hanya menyentuh berkas itu dan markup komponen.
