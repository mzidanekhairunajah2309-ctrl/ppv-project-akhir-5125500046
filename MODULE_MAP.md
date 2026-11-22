# Peta Modul — MMB Hub (Sprint 4 / P12)

```text
index.html → src/main.js
main.js    → data.js, ui.js, ui-pustaka.js
ui.js      → komponen.js
```

| Modul | Tanggung jawab |
|---|---|
| `main.js` | Inisialisasi agenda/RSVP, state navigasi, validasi form, delegasi klik detail, dan koordinasi render. |
| `data.js` | Baca katalog dan simpan/muat RSVP; tidak menyentuh DOM. |
| `ui.js` | Render grid, dropdown, riwayat RSVP, dan banner. |
| `komponen.js` | Membuat elemen kartu baru dari parameter; tidak membaca penyimpanan. |
| `ui-pustaka.js` | Satu-satunya modul yang memanggil modal, toast, dan collapse dari Bootstrap. |

Alur RSVP: **form → validasi → state → `simpan()` → riwayat, banner, dan toast**. Tidak ada impor melingkar.
