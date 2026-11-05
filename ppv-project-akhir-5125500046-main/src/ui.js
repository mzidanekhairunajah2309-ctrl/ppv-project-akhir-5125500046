// src/ui.js — Modul Tampilan / Render DOM

export function renderEventGrid(data) {
  const container = document.getElementById('event-grid');
  const selectDropdown = document.getElementById('pilihan-event');
  
  if (!container) return;

  container.innerHTML = '';
  if (selectDropdown) selectDropdown.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p class="text-muted">Belum ada agenda event.</p>';
    return;
  }

  data.forEach(ev => {
    // Render kartu event
    const cardHTML = `
      <div class="col-12 col-md-6 mb-3">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <span class="badge bg-secondary mb-2">${ev.kategori || 'Event'}</span>
            <h5 class="card-title">${ev.judul}</h5>
            <p class="text-muted small mb-1"><i class="bi bi-calendar"></i> ${ev.tanggal} | ${ev.lokasi || ''}</p>
            <p class="card-text">${ev.deskripsi}</p>
            <button type="button" class="btn btn-outline-primary btn-sm" data-action="detail" data-id="${ev.id}">Lihat Detail</button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHTML;

    // Render pilihan ke select dropdown form RSVP
    if (selectDropdown) {
      const option = document.createElement('option');
      option.value = ev.judul;
      option.textContent = ev.judul;
      selectDropdown.appendChild(option);
    }
  });
}