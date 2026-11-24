# Peta Modul — MMB Hub (Sprint 4 / P12, redesain visual)

```text
index.html → src/main.js
main.js    → data.js, ui.js, ui-pustaka.js, efek.js, suara.js, pemutar.js
ui.js      → komponen.js
pemutar.js → suara.js
```

| Modul | Tanggung jawab |
|---|---|
| `main.js` | Inisialisasi agenda/RSVP, state navigasi (transisi keluar-tukar-masuk antar-tampilan), validasi form, delegasi klik detail, kontrol tombol suara, dan koordinasi render. |
| `data.js` | Baca katalog dan simpan/muat RSVP; tidak menyentuh DOM. |
| `ui.js` | Render grid, dropdown, riwayat RSVP, dan banner. |
| `komponen.js` | Membuat elemen kartu event (spine tanggal berwarna per kategori), tiket riwayat, dan ikon SVG dari parameter; tidak membaca penyimpanan. |
| `ui-pustaka.js` | Satu-satunya modul yang memanggil modal, toast, dan collapse dari Bootstrap. |
| `efek.js` | Efek visual vanilla: scroll reveal, parallax pointer hero, sorotan kartu, indikator navigasi, bayangan navbar. Menghormati `prefers-reduced-motion`. |
| `suara.js` | Efek suara antarmuka yang disintesis dengan Web Audio API (tanpa berkas audio tambahan). Mati secara bawaan, satu suara per waktu, dibisukan selama jingle diputar. |
| `pemutar.js` | Pemutar jingle MMB FEST: tombol putar/jeda, scrubber waveform dari audio asli, dan waktu. Satu elemen `<audio>` jadi satu-satunya sumber suara; tidak pernah diputar otomatis. |

Alur RSVP: **form → validasi → state → `simpan()` → riwayat, banner, dan toast**. Tidak ada impor melingkar.
