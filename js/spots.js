// Spot-Sammlung: Reiseideen aus TikTok & Co. speichern, offline erfassen,
// online anreichern (oEmbed, OCR, KI-Vorschlag), bestätigen, auf der Karte zeigen.
const Spots = {
  async all() {
    const rows = await DB.getAll('spots');
    return rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  },

  async get(id) {
    return DB.get('spots', id);
  },

  async save(data) {
    const now = new Date().toISOString();
    if (data.id) {
      const existing = await DB.get('spots', data.id);
      const updated = Object.assign({}, existing, data, { updatedAt: now });
      await DB.put('spots', updated);
      return updated;
    }
    const row = Object.assign({
      status: 'unbearbeitet', sourceType: 'manual', url: null, title: '', note: '',
      previewImage: null, ocrText: null, country: null, region: null,
      lat: null, lng: null, confidence: null, tripId: null, folderId: null, enrichAttempted: false,
    }, data, { id: DB.uid(), createdAt: now, updatedAt: now });
    await DB.put('spots', row);
    return row;
  },

  async remove(id) {
    await DB.remove('spots', id);
  },

  async folders() {
    const rows = await DB.getAll('spotFolders');
    return rows.sort((a, b) => a.name.localeCompare(b.name, 'de'));
  },

  async createFolder(name) {
    const folder = { id: DB.uid(), name, createdAt: new Date().toISOString() };
    await DB.put('spotFolders', folder);
    return folder;
  },

  async deleteFolder(id) {
    const affected = (await Spots.all()).filter((s) => s.folderId === id);
    for (const s of affected) await Spots.save({ id: s.id, folderId: null });
    await DB.remove('spotFolders', id);
  },

  detectSourceType(url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, '');
      if (host.includes('tiktok.com')) return 'tiktok';
      return 'link';
    } catch (e) {
      return 'link';
    }
  },

  async createFromUrl(url) {
    const sourceType = Spots.detectSourceType(url);
    return Spots.save({ sourceType, url, title: url });
  },

  async createFromFile(file) {
    const isVideo = file.type.startsWith('video/');
    let previewImage;
    if (isVideo) {
      previewImage = await App.extractVideoFrame(file, 900);
    } else {
      const raw = await App.fileToDataUrl(file);
      previewImage = await App.downscaleImage(raw, 900, 0.82);
    }
    return Spots.save({
      sourceType: isVideo ? 'video' : 'image',
      title: file.name.replace(/\.[a-z0-9]+$/i, ''),
      previewImage,
    });
  },

  // --- Anreicherung (braucht Internet) ---------------------------------

  async fetchTikTokOEmbed(url) {
    const res = await fetch('https://www.tiktok.com/oembed?url=' + encodeURIComponent(url));
    if (!res.ok) throw new Error('oEmbed-Anfrage fehlgeschlagen (' + res.status + ')');
    const data = await res.json();
    return { title: data.title || '', authorName: data.author_name || '', thumbnailUrl: data.thumbnail_url || null };
  },

  async downloadImageAsDataUrl(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Bild-Download fehlgeschlagen (' + res.status + ')');
    const blob = await res.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    return App.downscaleImage(dataUrl, 900, 0.82);
  },

  tesseractLoading: null,
  loadTesseract() {
    if (window.Tesseract) return Promise.resolve();
    if (Spots.tesseractLoading) return Spots.tesseractLoading;
    Spots.tesseractLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Tesseract.js konnte nicht geladen werden'));
      document.head.appendChild(script);
    });
    return Spots.tesseractLoading;
  },

  async runOCR(dataUrl) {
    await Spots.loadTesseract();
    const result = await Tesseract.recognize(dataUrl, 'eng');
    return (result && result.data && result.data.text || '').trim();
  },

  async getSetting(key) {
    const row = await DB.get('settings', key);
    return row ? row.value : null;
  },

  async suggestWithAI(spot) {
    const apiKey = await Spots.getSetting('claudeApiKey');
    if (!apiKey) return null;

    const promptParts = [
      'Du hilfst dabei, gespeicherte Reiseideen ("Spots") zu kategorisieren.',
      'Antworte AUSSCHLIESSLICH mit einem JSON-Objekt, ohne Markdown-Codeblock und ohne zusätzlichen Text, in genau diesem Format:',
      '{"ort": string, "land_iso2": string (ISO-3166-1-alpha-2, z.B. "MA"), "region": string, "lat": number|null, "lng": number|null, "beschreibung": string (max 160 Zeichen, Deutsch), "sicherheit": "hoch"|"mittel"|"niedrig"}',
      'Wenn du dir unsicher bist, gib deine beste Einschätzung ab und setze "sicherheit" niedriger.',
      '',
      'Titel/Beschreibung der Quelle: ' + (spot.title || '(keine)'),
      'Erkannter Text im Bild (OCR, kann fehlerhaft sein): ' + (spot.ocrText || '(keiner)'),
      'Link: ' + (spot.url || '(keiner)'),
    ];

    const content = [{ type: 'text', text: promptParts.join('\n') }];
    if (spot.previewImage && spot.previewImage.startsWith('data:image')) {
      const [, mime, b64] = spot.previewImage.match(/^data:([^;]+);base64,(.*)$/) || [];
      if (b64) content.push({ type: 'image', source: { type: 'base64', media_type: mime, data: b64 } });
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{ role: 'user', content }],
      }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error('Claude API Fehler (' + res.status + '): ' + errBody.slice(0, 200));
    }
    const data = await res.json();
    const text = (data.content || []).map((b) => b.text || '').join('').trim();
    const jsonStr = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const parsed = JSON.parse(jsonStr);
    return parsed;
  },

  async enrich(spot) {
    let updated = Object.assign({}, spot);
    if (updated.sourceType === 'tiktok' && updated.url) {
      try {
        const oembed = await Spots.fetchTikTokOEmbed(updated.url);
        if (oembed.title) updated.title = oembed.title;
        if (oembed.thumbnailUrl && !updated.previewImage) {
          try { updated.previewImage = await Spots.downloadImageAsDataUrl(oembed.thumbnailUrl); }
          catch (e) { /* Vorschaubild-Download ohne CORS-Freigabe nicht möglich - Link bleibt erhalten */ }
        }
      } catch (e) { /* oEmbed nicht erreichbar - Link & manuelle Eingabe bleiben als Fallback */ }
    }
    if (updated.previewImage && !updated.ocrText) {
      try { updated.ocrText = await Spots.runOCR(updated.previewImage); }
      catch (e) { /* OCR optional, bei Fehler einfach auslassen */ }
    }
    try {
      const ai = await Spots.suggestWithAI(updated);
      if (ai) {
        if (ai.ort && (updated.sourceType !== 'tiktok' || !updated.title)) updated.title = ai.ort;
        if (ai.land_iso2 && Countries.all[ai.land_iso2]) updated.country = ai.land_iso2;
        if (ai.region) updated.region = ai.region;
        if (typeof ai.lat === 'number') updated.lat = ai.lat;
        if (typeof ai.lng === 'number') updated.lng = ai.lng;
        if (ai.beschreibung && !updated.note) updated.note = ai.beschreibung;
        if (ai.sicherheit) updated.confidence = ai.sicherheit;
      }
    } catch (e) { /* KI optional - ohne Schlüssel oder bei Fehler überspringen */ }

    updated.enrichAttempted = true;
    updated = await Spots.save(updated);
    return updated;
  },

  // --- UI ---------------------------------------------------------------

  async openEditSheet(spot, opts) {
    opts = opts || {};
    const [trips, folders] = await Promise.all([Trips.all(), Spots.folders()]);

    function folderOptions(selectedId) {
      return '<option value="">Kein Ordner</option>' +
        folders.map((f) => '<option value="' + f.id + '"' + (f.id === selectedId ? ' selected' : '') + '>' + App.escapeHtml(f.name) + '</option>').join('') +
        '<option value="__new__">➕ Neuer Ordner…</option>';
    }

    App.openSheet(opts.isNew ? 'Neue Reiseidee' : 'Spot bearbeiten', (body) => {
      const img = spot.previewImage ? '<img src="' + spot.previewImage + '" style="width:100%;border-radius:var(--radius);margin-bottom:12px;display:block">' : '';
      body.innerHTML = img +
        '<div class="field"><label>Name</label><input id="sp-title" type="text" value="' + App.escapeHtml(spot.title || '') + '" placeholder="z. B. Dachterrasse mit Meerblick"></div>' +
        '<div class="field-row">' +
        '<div class="field"><label>Land</label><button type="button" class="field-select-btn" id="sp-country-btn"></button></div>' +
        '<div class="field"><label>Region/Ort</label><input id="sp-region" type="text" value="' + App.escapeHtml(spot.region || '') + '"></div>' +
        '</div>' +
        '<div class="field"><label>Notiz</label><textarea id="sp-note">' + App.escapeHtml(spot.note || '') + '</textarea></div>' +
        '<div class="field"><label>Ordner (z. B. „Mögliche zukünftige Trips")</label><select id="sp-folder">' + folderOptions(spot.folderId) + '</select>' +
        '<div id="sp-folder-new-row" style="display:none;margin-top:8px;gap:8px" class="field-row">' +
        '<input id="sp-folder-new-name" type="text" placeholder="Name des Ordners" style="flex:1;min-height:var(--tap);padding:10px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-elevated);color:var(--text)">' +
        '<button class="btn small" id="sp-folder-new-save">Anlegen</button>' +
        '</div></div>' +
        '<div class="field"><label>Trip zuordnen (optional)</label><select id="sp-trip"><option value="">Keinem Trip zugeordnet</option>' + trips.map((t) => '<option value="' + t.id + '"' + (t.id === spot.tripId ? ' selected' : '') + '>' + App.escapeHtml(t.name) + '</option>').join('') + '</select>' +
        (trips.length === 0 ? '<p class="field-hint">Noch keine Trips angelegt.</p>' : '') + '</div>' +
        (spot.url ? '<div class="field"><label>Link</label><a href="' + App.escapeHtml(spot.url) + '" target="_blank" rel="noopener" style="word-break:break-all">' + App.escapeHtml(spot.url) + '</a></div>' : '') +
        (spot.confidence ? '<p class="muted">KI-Sicherheit: ' + SPOT_CONFIDENCE_LABELS[spot.confidence] + '</p>' : '') +
        '<div class="btn-row" style="margin-bottom:10px">' +
        '<button class="btn" id="sp-enrich">' + (navigator.onLine ? 'Automatisch anreichern' : 'Offline – kein Anreichern möglich') + '</button>' +
        '</div>' +
        '<button class="btn danger" id="sp-delete" style="margin-bottom:10px">Spot löschen</button>' +
        '<div class="btn-row"><button class="btn ghost" id="sp-cancel">Abbrechen</button><button class="btn primary" id="sp-save">Bestätigen</button></div>';

      App.qs('#sp-cancel', body).addEventListener('click', () => App.closeSheet());

      let selectedCountry = spot.country || null;
      const countryBtn = App.qs('#sp-country-btn', body);
      function updateCountryBtn() {
        countryBtn.innerHTML = selectedCountry
          ? '<span>' + Countries.flagEmoji(selectedCountry) + ' ' + App.escapeHtml(Countries.name(selectedCountry)) + '</span><span class="chev">›</span>'
          : '<span class="muted">Kein Land ausgewählt</span><span class="chev">›</span>';
      }
      updateCountryBtn();
      countryBtn.addEventListener('click', () => {
        Countries.openPickerSheet({
          title: 'Land auswählen', selected: selectedCountry,
          onSelect: (code) => { selectedCountry = code; updateCountryBtn(); },
        });
      });

      const folderSelect = App.qs('#sp-folder', body);
      const folderNewRow = App.qs('#sp-folder-new-row', body);
      folderSelect.addEventListener('change', () => {
        folderNewRow.style.display = folderSelect.value === '__new__' ? 'flex' : 'none';
      });
      App.qs('#sp-folder-new-save', body).addEventListener('click', async () => {
        const name = App.qs('#sp-folder-new-name', body).value.trim();
        if (!name) { App.toast('Bitte einen Namen eingeben'); return; }
        const folder = await Spots.createFolder(name);
        folders.push(folder);
        folderSelect.innerHTML = folderOptions(folder.id);
        folderNewRow.style.display = 'none';
      });

      const enrichBtn = App.qs('#sp-enrich', body);
      enrichBtn.disabled = !navigator.onLine;
      enrichBtn.addEventListener('click', async () => {
        enrichBtn.disabled = true;
        enrichBtn.textContent = 'Lädt…';
        try {
          const updated = await Spots.enrich(spot);
          App.closeSheet();
          App.toast('Vorschlag aktualisiert');
          Spots.openEditSheet(updated, opts);
        } catch (err) {
          App.toast('Anreicherung fehlgeschlagen');
          enrichBtn.disabled = false;
          enrichBtn.textContent = 'Automatisch anreichern';
        }
      });

      App.qs('#sp-delete', body).addEventListener('click', async () => {
        if (!confirm('Diese Reiseidee wirklich löschen?')) return;
        await Spots.remove(spot.id);
        App.closeSheet();
        App.toast('Spot gelöscht');
        if (opts.onChange) opts.onChange();
      });

      App.qs('#sp-save', body).addEventListener('click', async () => {
        const folderVal = App.qs('#sp-folder', body).value;
        if (folderVal === '__new__') { App.toast('Bitte den neuen Ordner erst anlegen'); return; }
        const saved = await Spots.save({
          id: spot.id,
          title: App.qs('#sp-title', body).value.trim() || 'Unbenannter Spot',
          country: selectedCountry,
          region: App.qs('#sp-region', body).value.trim() || null,
          note: App.qs('#sp-note', body).value.trim(),
          folderId: folderVal || null,
          tripId: App.qs('#sp-trip', body).value || null,
          status: 'bestaetigt',
        });
        App.closeSheet();
        App.toast('Gespeichert');
        if (opts.onChange) opts.onChange();
        return saved;
      });
    });
  },

  openAddSheet(onChange) {
    App.openSheet('Reiseidee hinzufügen', (body) => {
      body.innerHTML =
        '<div class="tabline" id="sp-add-tabs"><button data-t="link" class="active">Link</button><button data-t="file">Bild/Video</button></div>' +
        '<div id="sp-add-link">' +
        '<div class="field"><label>Link (z. B. TikTok)</label><input id="sp-add-url" type="url" placeholder="https://..."></div>' +
        '<button class="btn primary" id="sp-add-url-save">Speichern</button>' +
        '</div>' +
        '<div id="sp-add-file" hidden>' +
        '<div class="field"><input id="sp-add-file-input" type="file" accept="image/*,video/*"></div>' +
        '<button class="btn primary" id="sp-add-file-save">Speichern</button>' +
        '</div>';

      App.qsa('#sp-add-tabs button', body).forEach((btn) => {
        btn.addEventListener('click', () => {
          App.qsa('#sp-add-tabs button', body).forEach((b) => b.classList.toggle('active', b === btn));
          App.qs('#sp-add-link', body).hidden = btn.dataset.t !== 'link';
          App.qs('#sp-add-file', body).hidden = btn.dataset.t !== 'file';
        });
      });

      App.qs('#sp-add-url-save', body).addEventListener('click', async () => {
        const url = App.qs('#sp-add-url', body).value.trim();
        if (!url) { App.toast('Bitte einen Link eingeben'); return; }
        const spot = await Spots.createFromUrl(url);
        App.closeSheet();
        App.toast('Gespeichert – wird bei Internet automatisch angereichert');
        if (onChange) onChange();
        if (navigator.onLine) {
          Spots.enrich(spot).then((updated) => Spots.openEditSheet(updated, { onChange, isNew: true })).catch(() => {});
        }
      });

      App.qs('#sp-add-file-save', body).addEventListener('click', async () => {
        const input = App.qs('#sp-add-file-input', body);
        const file = input.files[0];
        if (!file) { App.toast('Bitte eine Datei auswählen'); return; }
        const btn = App.qs('#sp-add-file-save', body);
        btn.disabled = true; btn.textContent = 'Verarbeite…';
        try {
          const spot = await Spots.createFromFile(file);
          App.closeSheet();
          App.toast('Gespeichert');
          if (onChange) onChange();
          Spots.openEditSheet(spot, { onChange, isNew: true });
        } catch (err) {
          App.toast('Datei konnte nicht verarbeitet werden');
          btn.disabled = false; btn.textContent = 'Speichern';
        }
      });
    });
  },

  async render(container, state) {
    state = state || { status: 'alle', country: 'alle', folder: 'alle' };
    const [spots, trips, folders] = await Promise.all([Spots.all(), Trips.all(), Spots.folders()]);
    const countries = Array.from(new Set(spots.map((s) => s.country).filter(Boolean))).sort((a, b) => Countries.name(a).localeCompare(Countries.name(b), 'de'));
    const hasUnfiled = spots.some((s) => !s.folderId);

    let filtered = spots;
    if (state.status !== 'alle') filtered = filtered.filter((s) => s.status === state.status);
    if (state.country !== 'alle') filtered = filtered.filter((s) => s.country === state.country);
    if (state.folder === 'none') filtered = filtered.filter((s) => !s.folderId);
    else if (state.folder !== 'alle') filtered = filtered.filter((s) => s.folderId === state.folder);

    const pending = spots.filter((s) => !s.enrichAttempted);
    const bulkHtml = (pending.length > 0 && navigator.onLine)
      ? '<button class="btn" id="spots-bulk-enrich" style="margin-bottom:14px">' + pending.length + ' neue Idee' + (pending.length === 1 ? '' : 'n') + ' automatisch anreichern</button>'
      : '';

    const filterHtml =
      '<div class="chip-select" style="margin-bottom:10px">' +
      ['alle', 'unbearbeitet', 'bestaetigt'].map((k) =>
        '<span class="chip' + (state.status === k ? ' selected' : '') + '" data-status="' + k + '">' + (k === 'alle' ? 'Alle' : SPOT_STATUS_LABELS[k]) + '</span>'
      ).join('') + '</div>' +
      (countries.length > 0 ?
        '<div class="chip-select" style="margin-bottom:10px">' +
        '<span class="chip' + (state.country === 'alle' ? ' selected' : '') + '" data-country="alle">Alle Länder</span>' +
        countries.map((c) => '<span class="chip' + (state.country === c ? ' selected' : '') + '" data-country="' + c + '">' + Countries.flagEmoji(c) + ' ' + App.escapeHtml(Countries.name(c)) + '</span>').join('') +
        '</div>' : '') +
      (folders.length > 0 ?
        '<div class="chip-select" style="margin-bottom:14px">' +
        '<span class="chip' + (state.folder === 'alle' ? ' selected' : '') + '" data-folder="alle">Alle Ordner</span>' +
        folders.map((f) => '<span class="chip' + (state.folder === f.id ? ' selected' : '') + '" data-folder="' + f.id + '">📁 ' + App.escapeHtml(f.name) + '</span>').join('') +
        (hasUnfiled ? '<span class="chip' + (state.folder === 'none' ? ' selected' : '') + '" data-folder="none">Ohne Ordner</span>' : '') +
        '</div>' : '');

    let bodyHtml;
    if (filtered.length === 0) {
      bodyHtml = '<div class="empty-state"><div class="big">💡</div>Noch keine Reiseideen.<br>Tippe auf + oder teile einen Link aus TikTok.</div>';
    } else if (state.folder !== 'alle') {
      bodyHtml = filtered.map((s) => spotCard(s)).join('');
    } else {
      const groups = folders.map((f) => ({ key: f.id, label: '📁 ' + f.name, items: filtered.filter((s) => s.folderId === f.id) })).filter((g) => g.items.length);
      const unfiled = filtered.filter((s) => !s.folderId);
      if (unfiled.length) groups.push({ key: 'none', label: 'Ohne Ordner', items: unfiled });
      bodyHtml = groups.map((g) => '<div class="section-title">' + App.escapeHtml(g.label) + '</div>' + g.items.map((s) => spotCard(s)).join('')).join('');
    }

    container.innerHTML = bulkHtml + filterHtml + '<div id="spots-list">' + bodyHtml + '</div>';

    function spotCard(s) {
      const trip = trips.find((t) => t.id === s.tripId);
      let thumb;
      if (s.previewImage) {
        thumb = '<div class="spot-thumb"><img src="' + s.previewImage + '">' +
          (s.country ? '<span class="spot-flag-badge">' + Countries.flagEmoji(s.country) + '</span>' : '') + '</div>';
      } else if (s.country) {
        thumb = '<div class="spot-thumb" style="font-size:28px">' + Countries.flagEmoji(s.country) + '</div>';
      } else {
        thumb = '<div class="spot-thumb">💡</div>';
      }
      return '<button class="list-item" data-id="' + s.id + '" style="align-items:flex-start">' +
        thumb +
        '<div class="main"><div class="title">' + App.escapeHtml(s.title || 'Unbenannt') + '</div>' +
        '<div class="sub">' + (s.country ? App.escapeHtml(Countries.name(s.country)) + (s.region ? ' · ' + App.escapeHtml(s.region) : '') : SPOT_SOURCE_LABELS[s.sourceType]) +
        (trip ? ' · ' + App.escapeHtml(trip.name) : '') + '</div>' +
        '<span class="badge ' + SPOT_STATUS_BADGE[s.status] + '" style="margin-top:6px">' + SPOT_STATUS_LABELS[s.status] + '</span>' +
        '</div></button>';
    }

    App.qsa('[data-status]', container).forEach((chip) => {
      chip.addEventListener('click', () => Spots.render(container, Object.assign({}, state, { status: chip.dataset.status })));
    });
    App.qsa('[data-country]', container).forEach((chip) => {
      chip.addEventListener('click', () => Spots.render(container, Object.assign({}, state, { country: chip.dataset.country })));
    });
    App.qsa('[data-folder]', container).forEach((chip) => {
      chip.addEventListener('click', () => Spots.render(container, Object.assign({}, state, { folder: chip.dataset.folder })));
    });
    App.qsa('#spots-list [data-id]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const spot = filtered.find((s) => s.id === btn.dataset.id);
        Spots.openEditSheet(spot, { onChange: () => Spots.render(container, state) });
      });
    });

    const bulkBtn = App.qs('#spots-bulk-enrich', container);
    if (bulkBtn) {
      bulkBtn.addEventListener('click', async () => {
        bulkBtn.disabled = true;
        for (let i = 0; i < pending.length; i++) {
          bulkBtn.textContent = 'Verarbeite ' + (i + 1) + ' von ' + pending.length + '…';
          try { await Spots.enrich(pending[i]); } catch (e) { /* einzelner Fehler stoppt den Rest nicht */ }
        }
        App.toast('Fertig');
        Spots.render(container, state);
      });
    }
  },
};

Views.spots = async function (container) {
  App.setTitle('Ideen');
  App.setBack(null);
  App.setTripTabs(null);
  App.setFab(() => Spots.openAddSheet(() => Views.spots(container)), 'Idee hinzufügen');
  await Spots.render(container);
};
