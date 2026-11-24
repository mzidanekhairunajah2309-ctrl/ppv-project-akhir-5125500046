// suara.js — efek suara antarmuka yang disintesis langsung dengan Web Audio API (tanpa berkas audio tambahan).
// Aturan: mati secara bawaan, hanya aktif setelah pengguna menyalakannya, satu suara pada satu waktu,
// dan dibisukan selama jingle diputar. AudioContext baru dibuat saat tombol suara diklik (gerakan pengguna).

const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
export const suaraDidukung = Boolean(AC);

let konteks = null;
let aktif = false;
let dibisukan = false;
let suaraKini = null;
let hoverTerakhir = 0;

// Setiap bunyi adalah frasa pendek: daftar nada { f1, f2, dur, vol, jenis, mulai } dengan volume rendah.
const BUNYI = {
  klik: [{ f1: 1100, f2: 520, dur: 0.05, vol: 0.04, jenis: 'triangle' }],
  hover: [{ f1: 760, f2: 840, dur: 0.035, vol: 0.012 }],
  transisi: [{ f1: 320, f2: 640, dur: 0.16, vol: 0.03 }, { f1: 640, f2: 960, dur: 0.12, vol: 0.018, mulai: 0.05 }],
  sukses: [{ f1: 660, dur: 0.12, vol: 0.04 }, { f1: 880, dur: 0.16, vol: 0.04, mulai: 0.09 }, { f1: 1320, dur: 0.22, vol: 0.03, mulai: 0.18 }],
  galat: [{ f1: 200, f2: 150, dur: 0.14, vol: 0.05, jenis: 'triangle' }],
  nyala: [{ f1: 520, dur: 0.09, vol: 0.04 }, { f1: 780, dur: 0.14, vol: 0.04, mulai: 0.07 }],
  mati: [{ f1: 700, f2: 420, dur: 0.1, vol: 0.035 }],
};

export function suaraAktif() { return aktif; }

export function bisukan(nilai) {
  dibisukan = Boolean(nilai);
  if (dibisukan) hentikan();
}

function hentikan() {
  if (!suaraKini || !konteks) return;
  const { induk, osilator } = suaraKini;
  const t = konteks.currentTime;
  try {
    induk.gain.cancelScheduledValues(t);
    induk.gain.setTargetAtTime(0.0001, t, 0.01);
    osilator.forEach((o) => o.stop(t + 0.06));
  } catch { /* osilator sudah berhenti */ }
  suaraKini = null;
}

export function bunyi(nama) {
  if (!aktif || dibisukan || !konteks || konteks.state !== 'running') return;
  const frasa = BUNYI[nama];
  if (!frasa) return;
  if (nama === 'hover') { // batasi laju agar hover lembut, bukan berisik
    const sekarang = performance.now();
    if (sekarang - hoverTerakhir < 140) return;
    hoverTerakhir = sekarang;
  }
  hentikan(); // satu suara pada satu waktu
  const t0 = konteks.currentTime + 0.005;
  const induk = konteks.createGain();
  induk.connect(konteks.destination);
  const osilator = frasa.map(({ f1, f2 = f1, dur = 0.08, vol = 0.035, jenis = 'sine', mulai = 0 }) => {
    const osc = konteks.createOscillator();
    const g = konteks.createGain();
    const t = t0 + mulai;
    osc.type = jenis;
    osc.frequency.setValueAtTime(f1, t);
    if (f2 !== f1) osc.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(induk);
    osc.start(t);
    osc.stop(t + dur + 0.03);
    return osc;
  });
  const sekarangSuara = { induk, osilator };
  suaraKini = sekarangSuara;
  osilator[osilator.length - 1].onended = () => {
    if (suaraKini === sekarangSuara) suaraKini = null;
    try { induk.disconnect(); } catch { /* sudah terlepas */ }
  };
}

// Menyalakan/mematikan suara. Mengembalikan status akhir (true = menyala).
export function aturSuara(nyala) {
  if (nyala) {
    if (!AC) return false;
    try { konteks ??= new AC(); } catch { return false; }
    aktif = true;
    Promise.resolve(konteks.resume()).then(() => bunyi('nyala')).catch(() => {});
    return true;
  }
  bunyi('mati');
  aktif = false;
  return false;
}

// Pendengar delegasi: klik pada kontrol interaktif dan hover lembut pada tombol (hanya mouse).
export function pasangSuaraAntarmuka() {
  document.addEventListener('click', (e) => {
    if (!aktif) return;
    const el = e.target.closest('button, a[href], [data-sfx]');
    if (!el || el.disabled || el.dataset.sfx === 'diam') return;
    bunyi(el.dataset.sfx || 'klik');
  });
  document.addEventListener('pointerover', (e) => {
    if (!aktif || e.pointerType !== 'mouse') return;
    const el = e.target.closest('.nav-link, .btn, .btn-detail, .tombol-suara');
    if (!el || el.disabled || el.contains(e.relatedTarget)) return;
    bunyi('hover');
  });
}
