// Prototipe Terpadu Aplikasi MMB Media & Event Hub
// Tugas 4 Praktikum Pemrograman Visual (TB033109)

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    tampilanAktif: 'event',
    pendaftaran: []
  };

  // Pengecekan preferensi prefers-reduced-motion
  const prefersReducedMotion = () => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. NAVIGASI TAMPILAN (SPA VIEW SWITCHER)
  const buttons = document.querySelectorAll('.nav-tab button');
  const sections = document.querySelectorAll('.view-section');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      if (targetView === state.tampilanAktif) return;

      const currentSec = document.getElementById(state.tampilanAktif);
      const targetSec = document.getElementById(targetView);

      state.tampilanAktif = targetView;

      // Update atribut aria-current pada navigasi
      buttons.forEach((b) => b.removeAttribute('aria-current'));
      btn.setAttribute('aria-current', 'page');

      // Transisi perpindahan tampilan
      if (currentSec) {
        currentSec.classList.remove('aktif');
        currentSec.hidden = true;
      }

      if (targetSec) {
        targetSec.hidden = false;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            targetSec.classList.add('aktif');
          });
        });

        // Animasi A-01: Transisi State Tampilan Baru Masuk
        if (!prefersReducedMotion()) {
          targetSec.animate(
            [
              { opacity: 0, transform: 'translateY(15px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ],
            { duration: 250, easing: 'ease-out' }
          );
        }
      }
    });
  });

  // 2. VALIDASI FORM & ANIMASI UMPAN BALIK (ANIMASI A-02)
  const formRsvp = document.querySelector('#form-rsvp');
  const inputNama = document.querySelector('#nama');
  const selectEvent = document.querySelector('#pilihan-event');
  const pesanForm = document.querySelector('#pesan-form');

  // Animasi Shake untuk umpan balik input salah (A-02)
  function animasikanShake(element) {
    if (prefersReducedMotion()) return;
    element.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: 300, easing: 'ease-in-out' }
    );
  }

  formRsvp.addEventListener('submit', (e) => {
    e.preventDefault();

    const namaVal = inputNama.value.trim();
    const eventVal = selectEvent.value;

    if (namaVal.length < 3) {
      pesanForm.textContent = 'Nama lengkap wajib diisi (minimal 3 karakter).';
      pesanForm.className = 'pesan-status error';
      inputNama.setAttribute('aria-invalid', 'true');
      animasikanShake(inputNama);
      inputNama.focus();
      return;
    }

    if (!eventVal) {
      pesanForm.textContent = 'Silakan pilih event yang ingin Anda ikuti.';
      pesanForm.className = 'pesan-status error';
      selectEvent.setAttribute('aria-invalid', 'true');
      animasikanShake(selectEvent);
      selectEvent.focus();
      return;
    }

    // Isian valid
    inputNama.removeAttribute('aria-invalid');
    selectEvent.removeAttribute('aria-invalid');
    pesanForm.textContent = `Berhasil mendaftar ${eventVal} atas nama ${namaVal}!`;
    pesanForm.className = 'pesan-status sukses';

    // Tambah data pendaftaran
    state.pendaftaran.push({ nama: namaVal, event: eventVal, timestamp: new Date() });

    // Reset form
    formRsvp.reset();
  });

  // 3. HANDLER FALLBACK GAMBAR JIKA GAGAL DIMUAT (ERROR HANDLING)
  const mediaImages = document.querySelectorAll('.media-img');
  mediaImages.forEach((img) => {
    img.addEventListener('error', () => {
      const wrapper = img.parentElement;
      if (wrapper) {
        wrapper.innerHTML = `
          <div class="img-fallback">
            ⚠️ Gambar "${img.alt}" tidak dapat dimuat.
          </div>
        `;
      }
    });
  });
});
