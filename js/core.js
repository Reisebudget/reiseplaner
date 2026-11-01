// Gemeinsame Helfer: Routing, Sheets/Modals, Toasts, Formatierung.
const Views = {};

const CATEGORY_KEYS = ['flug', 'hotel', 'taxi', 'aktivitaeten', 'essen', 'sonstiges'];
const CATEGORY_LABELS = {
  flug: 'Flug', hotel: 'Hotel', taxi: 'Uber/Taxi',
  aktivitaeten: 'Aktivitäten', essen: 'Essen', sonstiges: 'Sonstiges',
};
const BOOKING_TYPE_KEYS = ['flug', 'unterkunft', 'transport', 'tour', 'gebuehr'];
const BOOKING_TYPE_LABELS = {
  flug: 'Flug', unterkunft: 'Unterkunft', transport: 'Transport', tour: 'Tour', gebuehr: 'Gebühr',
};
const BOOKING_TYPE_TO_CATEGORY = {
  flug: 'flug', unterkunft: 'hotel', transport: 'taxi', tour: 'aktivitaeten', gebuehr: 'sonstiges',
};
const BOOKING_STATUS_KEYS = ['bezahlt', 'vor_ort', 'offen'];
const BOOKING_STATUS_LABELS = { bezahlt: 'Bezahlt', vor_ort: 'Vor Ort zahlen', offen: 'Offen' };
const BOOKING_STATUS_BADGE = { bezahlt: 'paid', vor_ort: 'local', offen: 'open' };

const SPOT_STATUS_LABELS = { unbearbeitet: 'Unbearbeitet', bestaetigt: 'Bestätigt' };
const SPOT_STATUS_BADGE = { unbearbeitet: 'local', bestaetigt: 'paid' };
const SPOT_SOURCE_LABELS = { tiktok: 'TikTok', link: 'Link', image: 'Bild', video: 'Video', manual: 'Manuell' };
const SPOT_CONFIDENCE_LABELS = { hoch: 'Hoch', mittel: 'Mittel', niedrig: 'Niedrig' };

const App = {
  fabHandler: null,

  qs(sel, root) { return (root || document).querySelector(sel); },
  qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); },

  escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  },

  parseDecimal(str) {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    let s = String(str).trim().replace(/\s/g, '');
    if (s.includes(',') && s.includes('.')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (s.includes(',')) {
      s = s.replace(',', '.');
    }
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  },

  formatMoney(amount, currency) {
    const code = currency || 'EUR';
    const n = Number(amount) || 0;
    try {
      return n.toLocaleString('de-DE', { style: 'currency', currency: code, maximumFractionDigits: 2 });
    } catch (e) {
      return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + code;
    }
  },

  formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  formatDateShort(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  },

  formatDateRange(startIso, endIso) {
    return App.formatDate(startIso) + ' – ' + App.formatDate(endIso);
  },

  today() {
    return new Date().toISOString().slice(0, 10);
  },

  navigate(hash) {
    location.hash = hash;
  },

  toast(message, ms) {
    const root = document.getElementById('toast-root');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    root.appendChild(el);
    setTimeout(() => el.remove(), ms || 2200);
  },

  openSheet(title, buildFn) {
    App.closeSheet();
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'active-sheet';
    const sheet = document.createElement('div');
    sheet.className = 'modal-sheet';
    sheet.innerHTML = '<div class="modal-handle"></div>' + (title ? '<h2>' + App.escapeHtml(title) + '</h2>' : '') + '<div class="sheet-body"></div>';
    backdrop.appendChild(sheet);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) App.closeSheet(); });
    document.getElementById('modal-root').appendChild(backdrop);
    const body = sheet.querySelector('.sheet-body');
    if (buildFn) buildFn(body);
    return body;
  },

  closeSheet() {
    const el = document.getElementById('active-sheet');
    if (el) el.remove();
  },

  setFab(handler, label, icon) {
    const fab = document.getElementById('fab');
    App.fabHandler = handler;
    fab.onclick = handler;
    if (handler) {
      fab.hidden = false;
      fab.textContent = icon || '+';
      fab.setAttribute('aria-label', label || 'Neu');
    } else {
      fab.hidden = true;
    }
  },

  setTitle(title) {
    document.getElementById('page-title').textContent = title;
  },

  setBack(hash) {
    const btn = document.getElementById('btn-back');
    if (hash) {
      btn.hidden = false;
      btn.onclick = () => App.navigate(hash);
    } else {
      btn.hidden = true;
      btn.onclick = null;
    }
  },

  setTripTabs(items, activeKey) {
    const nav = document.getElementById('trip-tabs');
    if (!items) {
      nav.hidden = true;
      nav.innerHTML = '';
      return;
    }
    nav.hidden = false;
    nav.innerHTML = items.map((it) =>
      '<button data-key="' + it.key + '" class="' + (it.key === activeKey ? 'active' : '') + '">' + App.escapeHtml(it.label) + '</button>'
    ).join('');
    App.qsa('button', nav).forEach((btn) => {
      btn.addEventListener('click', () => App.navigate(it_hash(btn.dataset.key)));
    });
    function it_hash(key) {
      const match = items.find((i) => i.key === key);
      return match.hash;
    }
  },

  async ratesMap() {
    const rows = await Rates.getAll();
    const map = Object.assign({}, DEFAULT_RATES);
    rows.forEach((r) => { map[r.code] = r.rate; });
    return map;
  },

  toEUR(amount, currency, ratesMap) {
    const n = Number(amount) || 0;
    if (!currency || currency === 'EUR') return n;
    const rate = (ratesMap && ratesMap[currency]) || DEFAULT_RATES[currency] || 1;
    return n / rate;
  },

  fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  },

  downscaleImage(dataUrl, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const max = maxDim || 900;
        if (width > max || height > max) {
          if (width > height) { height = Math.round(height * (max / width)); width = max; }
          else { width = Math.round(width * (max / height)); height = max; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality || 0.82));
      };
      img.onerror = () => reject(new Error('Bild konnte nicht geladen werden'));
      img.src = dataUrl;
    });
  },

  extractVideoFrame(file, maxDim) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.src = url;
      const cleanup = () => URL.revokeObjectURL(url);
      video.onloadedmetadata = () => {
        video.currentTime = Math.min(video.duration / 2, Math.max(0, video.duration - 0.1));
      };
      video.onseeked = () => {
        try {
          let width = video.videoWidth, height = video.videoHeight;
          const max = maxDim || 900;
          if (width > max || height > max) {
            if (width > height) { height = Math.round(height * (max / width)); width = max; }
            else { width = Math.round(width * (max / height)); height = max; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(video, 0, 0, width, height);
          cleanup();
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } catch (err) {
          cleanup();
          reject(err);
        }
      };
      video.onerror = () => { cleanup(); reject(new Error('Video konnte nicht gelesen werden')); };
    });
  },
};
