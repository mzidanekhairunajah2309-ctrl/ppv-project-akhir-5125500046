// src/main.js — Pusat Pengendali Utama ES Modules (Project Akhir MMB Hub)

import { ambilDataEvent } from './data.js';
import { renderEventGrid } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("MMB Project Akhir Berhasil Dimuat via ES Modules!");

  // 1. Muat dan render data awal ke halaman
  const events = ambilDataEvent();
  renderEventGrid(events);

  // 2. Logika Navigasi Antar Menu (Event & Agenda | Galeri Karya | Tentang Pembuat)
  const tombolMenu = document.querySelectorAll('[data-view]');
  const semuaSection = document.querySelectorAll('.view-section');

  tombolMenu.forEach(tombol => {
    tombol.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = tombol.getAttribute('data-view');

      // Ubah status aktif tombol navigasi
      tombolMenu.forEach(t => t.classList.remove('active'));
      tombol.classList.add('active');

      // Tampilkan section yang dipilih, sembunyikan yang lain
      semuaSection.forEach(section => {
        if (section.id === targetView) {
          section.removeAttribute('hidden');
          section.classList.add('aktif');
        } else {
          section.setAttribute('hidden', 'true');
          section.classList.remove('aktif');
        }
      });
    });
  });

  // 3. Tangani event submit form pendaftaran (RSVP)
  const formRsvp = document.getElementById('form-rsvp');
  if (formRsvp) {
    formRsvp.addEventListener('submit', (e) => {
      e.preventDefault();
      const namaInput = document.getElementById('nama');
      const pilihanEvent = document.getElementById('pilihan-event');

      if (!namaInput.value.trim()) {
        namaInput.classList.add('is-invalid');
        return;
      }
      namaInput.classList.remove('is-invalid');

      alert(`Terima kasih ${namaInput.value}, Anda berhasil mendaftar ke event: ${pilihanEvent.value}`);
      formRsvp.reset();
    });
  }

  // 4. Delegasi event klik untuk tombol detail event
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'detail') {
      const allEvents = ambilDataEvent();
      const selected = allEvents.find(ev => ev.id == id);
      if (selected) {
        alert(`Detail Event:\n\nJudul: ${selected.judul}\nTanggal: ${selected.tanggal}\nLokasi: ${selected.lokasi}\nDeskripsi: ${selected.deskripsi}`);
      }
    }
  });
});