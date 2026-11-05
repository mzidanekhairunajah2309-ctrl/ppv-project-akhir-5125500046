// src/main.js — Titik Masuk Utama ES Modules

import { ambilSemuaEvent } from './data.js';
import { renderGaleriEvent } from './ui.js';

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  console.log("MMB Hub Berhasil Dimuat via ES Modules!");
  
  // Ambil data dan tampilkan ke UI
  const data = ambilSemuaEvent();
  renderGaleriEvent(data);
});

// Contoh delegasi event global (pengganti onclick)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === 'detail') {
    alert(`Melihat detail untuk event ID: ${id}`);
  }
});