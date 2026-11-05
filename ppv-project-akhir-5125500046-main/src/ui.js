// src/ui.js — Mengurus Render Tampilan dan DOM

export function renderGaleriEvent(dataEvent) {
  const container = document.querySelector('#daftar-event') || document.querySelector('.grid') || document.body;
  // Jika kontainer tidak ditemukan spesifik, kita pastikan aman
  if (!container) return;

  // Render kartu event secara dinamis
  // Perhatikan: Menggunakan data-id dan data-action, TANPA onclick="..."
  let htmlContent = '';
  dataEvent.forEach(ev => {
    htmlContent += `
      <div class="col-md-4 mb-3">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <span class="badge bg-primary mb-2">${ev.kategori}</span>
            <h5 class="card-title">${ev.judul}</h5>
            <p class="card-text text-muted small"><i class="bi bi-calendar"></i> ${ev.tanggal}</p>
            <p class="card-text">${ev.deskripsi}</p>
            <button class="btn btn-outline-primary btn-sm" data-action="detail" data-id="${ev.id}">Lihat Detail</button>
          </div>
        </div>
      </div>
    `;
  });
  
  // Jika ada elemen penampung khusus grid event
  const targetGrid = document.getElementById('semua-event-grid');
  if (targetGrid) {
    targetGrid.innerHTML = htmlContent;
  }
}