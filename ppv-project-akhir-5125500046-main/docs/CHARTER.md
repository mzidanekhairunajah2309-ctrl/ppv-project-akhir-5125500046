# Project Charter — MMB Media & Event Hub

**Pembuat:** Muhammad Zidane Khairu Najah (5125500046) · 3 D3 MM B · Sprint 1 (P09)

## Masalah
Info event, jadwal, dan karya mahasiswa MMB tersebar di story Instagram, grup WhatsApp, dan poster, sehingga mahasiswa baru sering ketinggalan jadwal atau tidak tahu cara mendaftar, dan panitia sulit mendata siapa yang berminat.

## Pengguna sasaran
**Naya, 19 tahun, mahasiswa semester 1 D3 MMB.** Kuliah dan praktikum sampai sore, tinggal di kos, dan mengandalkan ponsel (layar ±400 px) untuk semua info kampus. Kesehariannya: membuka grup WhatsApp angkatan yang chat-nya ratusan per hari dan story Instagram himpunan. Masalahnya: info pendaftaran event terselip di antara chat lain, ia baru sadar event sudah lewat, dan ia ragu apakah sudah terdaftar atau belum.

## Fitur MVP (MoSCoW)
| # | Fitur | Prioritas | Alasan |
|---|-------|-----------|--------|
| F1 | Daftar agenda event (nama, tempat, tanggal) | **Must** | Inti masalah: orang harus bisa melihat event yang ada |
| F2 | Pendaftaran event dengan validasi dan konfirmasi | **Must** | Inti masalah: tahu pasti sudah terdaftar |
| F3 | Detail event di modal, bisa langsung daftar dari detail | **Should** | Mempercepat alur, tapi F1+F2 sudah cukup tanpa ini |
| F4 | Galeri karya (gambar) dengan cadangan bila gagal dimuat | **Should** | Menarik minat, bukan syarat mendaftar |
| F5 | Audio highlight theme song event | **Could** | Pemanis; dikerjakan jika waktu tersisa |
| — | Login/akun pengguna dan pembayaran tiket | **Won't** | Belum menguji nilai utama (menemukan dan mendaftar event); butuh server |
| — | Dasbor rekap untuk panitia | **Won't** | Butuh penyimpanan terpusat; di luar lingkup sprint P09–P14 |

## Kriteria sukses (terukur)
1. Pengguna baru menyelesaikan alur *buka aplikasi → pilih event → daftar* **≤ 60 detik tanpa bantuan**, pada 3 dari 3 penguji.
2. **0 gulir mendatar** di lebar ±400 px dan di laptop (dicek lewat Responsive Design Mode).
3. Skor **Lighthouse Accessibility ≥ 90** pada halaman utama.

## Risiko dan antisipasi
| Risiko | Antisipasi |
|--------|-----------|
| Data pendaftaran hilang saat halaman dimuat ulang (belum ada penyimpanan) | Penyimpanan berversi di localStorage dengan try/catch pada Sprint P12 |
| CDN Bootstrap gagal dimuat saat demo (internet kampus lambat) | Versi terkunci 5.3.3; siapkan salinan lokal di `vendor/` sebelum Demo Akhir |
| Lingkup melebar karena tugas mata kuliah lain menumpuk | Kerjakan urut MoSCoW; F5 (Could) dikerjakan paling akhir atau dibuang |
| Aset media (poster, jingle) tidak ada atau terlalu besar | Cadangan gambar/audio saat gagal dimuat; kompres aset sebelum commit |
