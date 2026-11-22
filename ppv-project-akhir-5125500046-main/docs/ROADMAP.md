# Roadmap Sprint P10–P14 — MMB Media & Event Hub

Diperbarui setiap minggu. Fitur merujuk ke [CHARTER](CHARTER.md): F1 agenda · F2 pendaftaran · F3 detail modal · F4 galeri · F5 audio.

| Sprint | Fokus | Fitur MVP | Deliverable | Bukti |
|--------|-------|-----------|-------------|-------|
| **P09** (selesai) | Charter, repositori, pustaka UI | F1–F5 tampil dengan Bootstrap | CHARTER.md, ROADMAP.md, README, struktur folder, Bootstrap 5.3.3 (navbar, card, modal, toast), `src/ui-pustaka.js`, DEPENDENCIES.md | `git log --oneline`, tangkapan layar ±400 px dan laptop, DEPENDENCIES.md |
| **P10** | Debug dan cabang | F2, F3 | Temukan dan perbaiki ≥ 2 bug nyata pada alur pendaftaran/modal; satu cabang per bug, lalu merge | Tabel bug (gejala → penyebab berkas:baris → perbaikan), riwayat cabang `fix/...` di `git log --graph` |
| **P11** | Modularisasi | F1, F3 | Kode dipecah ≥ 3 modul ES: `src/data.js`, `src/ui.js`, `src/main.js` (+ `ui-pustaka.js` tetap satu-satunya pemanggil pustaka) | Struktur folder, `type="module"` jalan tanpa error Console |
| **P12** | Komponen dan penyimpanan | F2 | Komponen reusable `KartuEvent`; penyimpanan pendaftaran berversi di localStorage (tahan data rusak); README + CHANGELOG; tag `v0.4.0` | Data bertahan setelah muat ulang, CHANGELOG.md, tag di GitHub |
| **P13** | Konsep produk (Tugas 7) | F4, F5 | Rumuskan konsep produk dari Project Akhir; rapikan F4 (galeri) dan kerjakan F5 jika waktu ada | Dokumen Tugas 7, tangkapan layar galeri |
| **P14** | Demo Akhir | F1–F4 (F5 bila selesai) | Demo alur utama; uji 3 pengguna sasaran terhadap kriteria sukses | Waktu penyelesaian tiap penguji, skor Lighthouse, tag rilis akhir |
