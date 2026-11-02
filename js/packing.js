// Packliste pro Trip: Abschnitte, Notizen, Tags, Vorlagen, Datei-Im-/Export.
const Packing = {
  async listForTrip(tripId) {
    const rows = await DB.getAllByIndex('packingItems', 'tripId', tripId);
    return rows.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async sectionsForTrip(tripId) {
    const rows = await DB.getAllByIndex('packingSections', 'tripId', tripId);
    return rows.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  },

  async addItem(tripId, sectionId, text) {
    const rows = await Packing.listForTrip(tripId);
    const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder || 0), 0);
    const item = { id: DB.uid(), tripId, sectionId: sectionId || null, text, note: '', tags: [], checked: false, sortOrder: maxOrder + 1 };
    await DB.put('packingItems', item);
    return item;
  },

  async saveItem(data) {
    const existing = await DB.get('packingItems', data.id);
    const updated = Object.assign({}, existing, data);
    await DB.put('packingItems', updated);
    return updated;
  },

  async toggle(item) {
    item.checked = !item.checked;
    await DB.put('packingItems', item);
  },

  async removeItem(id) {
    await DB.remove('packingItems', id);
  },

  async createSection(tripId, name, hint) {
    const sections = await Packing.sectionsForTrip(tripId);
    const maxOrder = sections.reduce((m, s) => Math.max(m, s.sortOrder || 0), 0);
    const section = { id: DB.uid(), tripId, name, hint: hint || '', sortOrder: maxOrder + 1, collapsed: false };
    await DB.put('packingSections', section);
    return section;
  },

  async updateSection(id, data) {
    const existing = await DB.get('packingSections', id);
    const updated = Object.assign({}, existing, data);
    await DB.put('packingSections', updated);
    return updated;
  },

  async toggleSectionCollapsed(id) {
    const section = await DB.get('packingSections', id);
    section.collapsed = !section.collapsed;
    await DB.put('packingSections', section);
  },

  // Löscht einen Abschnitt, Gegenstände bleiben erhalten und werden "Ohne Abschnitt".
  async deleteSection(id) {
    const section = await DB.get('packingSections', id);
    if (!section) return;
    const items = await DB.getAllByIndex('packingItems', 'tripId', section.tripId);
    const affected = items.filter((i) => i.sectionId === id);
    for (const i of affected) await DB.put('packingItems', Object.assign({}, i, { sectionId: null }));
    await DB.remove('packingSections', id);
  },

  // --- Textformat: # Titel / ## Abschnitt / > Hinweis / Gegenstand | Notiz #tag ---

  // Liest eine Datei robust als Text, erkennt UTF-16-BOMs (sonst produziert
  // file.text() bei solchen Dateien nur wirre Zeichen) und entfernt eine
  // eventuelle UTF-8-BOM.
  async readFileAsText(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) {
      return new TextDecoder('utf-16le').decode(buffer);
    }
    if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) {
      return new TextDecoder('utf-16be').decode(buffer);
    }
    let text = new TextDecoder('utf-8').decode(buffer);
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    return text;
  },

  // Grobe Erkennung, ob eine Datei kein brauchbarer Text ist (z. B. aus
  // Versehen ein Bild/PDF gewählt) - dann lieber einen klaren Hinweis zeigen
  // statt eine Vorschau voller wirrer Zeichen.
  looksLikeGarbage(text) {
    if (!text) return false;
    const sample = text.slice(0, 3000);
    if (!sample.trim()) return false;
    const bad = (sample.match(/[�\x00-\x08\x0B\x0C\x0E-\x1F]/g) || []).length;
    return bad / sample.length > 0.03;
  },

  parseItemLine(rawLine) {
    let line = rawLine.trim().replace(/^(?:[-*•●○]|\[\s?[xX]?\s?\]|☐|☑|\d+[.)])\s*/, '');
    const tags = [];
    line = line.replace(/#([^\s#]+)/g, (m, tag) => { tags.push(tag); return ''; }).replace(/\s+/g, ' ').trim();
    const parts = line.split(' | ');
    const text = (parts[0] || '').trim();
    const note = parts.slice(1).join(' | ').trim();
    return { text, note, tags };
  },

  parseImportText(text) {
    const lines = (text || '').split('\n');
    let title = null;
    const sections = [];
    let current = { name: null, hint: null, items: [] };
    let afterHeading = false;
    let sawAnything = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) { afterHeading = false; continue; }
      if (!sawAnything && line.startsWith('# ')) {
        title = line.slice(2).trim();
        sawAnything = true;
        continue;
      }
      if (line.startsWith('## ')) {
        if (current.name !== null || current.items.length) sections.push(current);
        current = { name: line.slice(3).trim(), hint: null, items: [] };
        afterHeading = true;
        sawAnything = true;
        continue;
      }
      if (afterHeading && line.startsWith('> ')) {
        current.hint = line.slice(2).trim();
        afterHeading = false;
        continue;
      }
      afterHeading = false;
      sawAnything = true;
      const item = Packing.parseItemLine(line);
      if (item.text) current.items.push(item);
    }
    if (current.name !== null || current.items.length) sections.push(current);
    return { title, sections };
  },

  formatTagsSuffix(tags) {
    return (tags && tags.length) ? ' ' + tags.map((t) => '#' + t).join(' ') : '';
  },

  serializeExport(tripName, sections) {
    let out = '# ' + tripName + '\n\n';
    sections.forEach((s) => {
      if (s.name) {
        out += '## ' + s.name + '\n';
        if (s.hint) out += '> ' + s.hint + '\n';
      }
      s.items.forEach((i) => {
        let line = i.text;
        if (i.note) line += ' | ' + i.note;
        line += Packing.formatTagsSuffix(i.tags);
        out += line + '\n';
      });
      out += '\n';
    });
    return out.trim() + '\n';
  },

  // Baut das Export-/Vorlagen-Modell [{ name, hint, items:[{text,note,tags}] }] aus den Live-Daten.
  async buildExportModel(tripId) {
    const [items, sections] = await Promise.all([Packing.listForTrip(tripId), Packing.sectionsForTrip(tripId)]);
    const simplify = (i) => ({ text: i.text, note: i.note || '', tags: i.tags || [] });
    const bySection = {};
    const unsectioned = [];
    items.forEach((i) => {
      if (i.sectionId && sections.some((s) => s.id === i.sectionId)) {
        (bySection[i.sectionId] = bySection[i.sectionId] || []).push(i);
      } else {
        unsectioned.push(i);
      }
    });
    const result = [];
    if (unsectioned.length) result.push({ name: null, hint: null, items: unsectioned.map(simplify) });
    sections.forEach((s) => {
      const its = bySection[s.id] || [];
      if (its.length) result.push({ name: s.name, hint: s.hint, items: its.map(simplify) });
    });
    return result;
  },

  // Übernimmt ein geparstes Sections-Modell (Import, Vorlage) in einen Trip.
  async applyParsedSections(tripId, sections, mode) {
    if (mode === 'replace') {
      const [items, existingSections] = await Promise.all([Packing.listForTrip(tripId), Packing.sectionsForTrip(tripId)]);
      for (const i of items) await DB.remove('packingItems', i.id);
      for (const s of existingSections) await DB.remove('packingSections', s.id);
    }
    const existingItems = mode === 'replace' ? [] : await Packing.listForTrip(tripId);
    const existingSectionsNow = mode === 'replace' ? [] : await Packing.sectionsForTrip(tripId);
    const existingTexts = new Set(existingItems.map((i) => i.text.toLowerCase()));
    let sectionOrder = existingSectionsNow.reduce((m, s) => Math.max(m, s.sortOrder || 0), 0);
    let itemOrder = existingItems.reduce((m, i) => Math.max(m, i.sortOrder || 0), 0);
    let addedItems = 0, addedSections = 0;

    for (const sec of sections) {
      let sectionId = null;
      if (sec.name) {
        let match = existingSectionsNow.find((s) => s.name.toLowerCase() === sec.name.toLowerCase());
        if (!match) {
          sectionOrder += 1;
          match = { id: DB.uid(), tripId, name: sec.name, hint: sec.hint || '', sortOrder: sectionOrder, collapsed: false };
          await DB.put('packingSections', match);
          existingSectionsNow.push(match);
          addedSections++;
        } else if (sec.hint && !match.hint) {
          match.hint = sec.hint;
          await DB.put('packingSections', match);
        }
        sectionId = match.id;
      }
      for (const it of sec.items) {
        if (!it.text || existingTexts.has(it.text.toLowerCase())) continue;
        existingTexts.add(it.text.toLowerCase());
        itemOrder += 1;
        await DB.put('packingItems', { id: DB.uid(), tripId, sectionId, text: it.text, note: it.note || '', tags: it.tags || [], checked: false, sortOrder: itemOrder });
        addedItems++;
      }
    }
    return { addedItems, addedSections };
  },

  // --- Vorlagen ------------------------------------------------------------

  async templates() {
    return DB.getAll('packingTemplates');
  },

  async saveAsTemplate(tripId, name) {
    const sections = await Packing.buildExportModel(tripId);
    const tpl = { id: DB.uid(), name, sections };
    await DB.put('packingTemplates', tpl);
    return tpl;
  },

  async deleteTemplate(id) {
    await DB.remove('packingTemplates', id);
  },

  templateItemCount(t) {
    return (t.sections || [{ items: t.items || [] }]).reduce((s, sec) => s + sec.items.length, 0);
  },

  templateSections(t) {
    return t.sections || [{ name: null, hint: null, items: t.items || [] }];
  },

  // --- UI -------------------------------------------------------------------

  async render(trip, container, state) {
    state = state || { tagFilter: [] };
    const [items, sections] = await Promise.all([Packing.listForTrip(trip.id), Packing.sectionsForTrip(trip.id)]);
    const checkedCount = items.filter((i) => i.checked).length;
    const pct = items.length ? Math.round((checkedCount / items.length) * 100) : 0;

    const allTags = Array.from(new Set(items.flatMap((i) => i.tags || []))).sort((a, b) => a.localeCompare(b, 'de'));
    let visibleItems = items;
    if (state.tagFilter.length) {
      visibleItems = items.filter((i) => (i.tags || []).some((t) => state.tagFilter.includes(t)));
    }

    const sectionOptions = sections.map((s) => '<option value="' + s.id + '">' + App.escapeHtml(s.name) + '</option>').join('');

    function itemRow(i) {
      const tagsHtml = (i.tags && i.tags.length) ? '<span class="item-tags">' + i.tags.map((t) => '<span class="item-tag">' + App.escapeHtml(t) + '</span>').join('') + '</span>' : '';
      return '<div class="checkrow' + (i.checked ? ' checked' : '') + '" data-id="' + i.id + '">' +
        '<input type="checkbox" ' + (i.checked ? 'checked' : '') + '>' +
        '<div class="checkrow-body" data-edit="' + i.id + '">' +
        '<span class="text">' + App.escapeHtml(i.text) + '</span>' + tagsHtml +
        (i.note ? '<div class="item-note">' + App.escapeHtml(i.note) + '</div>' : '') +
        '</div>' +
        '<button class="del" data-del="' + i.id + '">✕</button></div>';
    }

    function sectionBlockHtml(section, secItems, label) {
      const id = section ? section.id : 'none';
      const collapsed = section ? !!section.collapsed : false;
      const checkedHere = secItems.filter((i) => i.checked).length;
      let html = '<div class="section-block">';
      if (label) {
        html += '<div class="section-header-row">' +
          '<button class="section-header" data-toggle-section="' + id + '">' +
          '<span class="chev">' + (collapsed ? '▸' : '▾') + '</span>' +
          '<span class="title">' + App.escapeHtml(label) + '</span>' +
          '<span class="muted">' + checkedHere + '/' + secItems.length + '</span>' +
          '</button>' +
          (section ? '<button class="section-edit" data-edit-section="' + id + '">✎</button>' : '') +
          '</div>';
        if (section && section.hint && !collapsed) {
          html += '<p class="section-hint">' + App.escapeHtml(section.hint) + '</p>';
        }
      }
      if (!collapsed) {
        html += '<div class="card" style="margin-top:6px">' + secItems.map(itemRow).join('') + '</div>';
      }
      html += '</div>';
      return html;
    }

    let bodyHtml = '';
    const unsectionedItems = visibleItems.filter((i) => !i.sectionId || !sections.some((s) => s.id === i.sectionId));
    if (unsectionedItems.length) {
      bodyHtml += sectionBlockHtml(null, unsectionedItems, sections.length > 0 ? 'Ohne Abschnitt' : null);
    }
    sections.forEach((s) => {
      const secItems = visibleItems.filter((i) => i.sectionId === s.id);
      if (state.tagFilter.length && secItems.length === 0) return;
      bodyHtml += sectionBlockHtml(s, secItems, s.name);
    });
    if (!bodyHtml) bodyHtml = '<p class="muted mt-0" style="padding:12px 4px">Noch keine Gegenstände.</p>';

    const tagFilterHtml = allTags.length
      ? '<div class="chip-select" id="p-tag-filter" style="margin-bottom:10px">' +
        allTags.map((t) => '<span class="chip' + (state.tagFilter.includes(t) ? ' selected' : '') + '" data-tag="' + App.escapeHtml(t) + '">' + App.escapeHtml(t) + '</span>').join('') +
        '</div>' : '';

    container.innerHTML =
      '<div class="card">' +
      '<div class="field-row" style="margin-bottom:0">' +
      '<div class="field" style="margin-bottom:0"><input id="p-new" type="text" placeholder="Neuer Gegenstand…"></div>' +
      (sections.length ? '<div class="field" style="margin-bottom:0;flex:none;width:130px"><select id="p-new-section"><option value="">Kein Abschnitt</option>' + sectionOptions + '</select></div>' : '') +
      '<button class="btn primary" id="p-add" style="width:auto;flex:none;padding:0 16px">+</button>' +
      '</div></div>' +
      '<div class="btn-row" style="margin-top:0">' +
      '<button class="btn" id="p-new-section-btn">+ Abschnitt</button>' +
      '<button class="btn" id="p-template-apply">Vorlage anwenden</button>' +
      '<button class="btn" id="p-template-save">Als Vorlage speichern</button>' +
      '</div>' +
      '<div class="btn-row" style="margin-top:0">' +
      '<button class="btn" id="p-bulk-add">Liste einfügen</button>' +
      '<button class="btn" id="p-file-import">Aus Datei importieren</button>' +
      '<button class="btn" id="p-export">Als Datei exportieren</button>' +
      '</div>' +
      (items.length ? '<div class="btn-row" style="margin-top:0;margin-bottom:14px"><button class="btn danger" id="p-clear-all">Packliste leeren</button></div>' : '<div style="margin-bottom:14px"></div>') +
      '<input id="p-file-input" type="file" hidden>' +
      '<p class="muted" style="margin-top:-6px">' + checkedCount + ' von ' + items.length + ' gepackt</p>' +
      '<div class="progress-bar" style="margin-bottom:14px"><span style="width:' + pct + '%"></span></div>' +
      tagFilterHtml +
      '<div id="p-list">' + bodyHtml + '</div>';

    App.qs('#p-add', container).addEventListener('click', addFromInput);
    App.qs('#p-new', container).addEventListener('keydown', (e) => { if (e.key === 'Enter') addFromInput(); });
    async function addFromInput() {
      const input = App.qs('#p-new', container);
      const text = input.value.trim();
      if (!text) return;
      const sectionSelect = App.qs('#p-new-section', container);
      await Packing.addItem(trip.id, sectionSelect ? sectionSelect.value || null : null, text);
      input.value = '';
      Packing.render(trip, container, state);
    }

    App.qsa('.checkrow input[type="checkbox"]', container).forEach((cb) => {
      cb.addEventListener('change', async () => {
        const id = cb.closest('.checkrow').dataset.id;
        const item = items.find((i) => i.id === id);
        await Packing.toggle(item);
        Packing.render(trip, container, state);
      });
    });
    App.qsa('[data-del]', container).forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await Packing.removeItem(btn.dataset.del);
        Packing.render(trip, container, state);
      });
    });
    App.qsa('[data-edit]', container).forEach((el) => {
      el.addEventListener('click', () => {
        const item = items.find((i) => i.id === el.dataset.edit);
        Packing.openItemEditSheet(trip, item, sections, container, state);
      });
    });
    App.qsa('[data-toggle-section]', container).forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.toggleSection;
        if (id !== 'none') await Packing.toggleSectionCollapsed(id);
        Packing.render(trip, container, state);
      });
    });
    App.qsa('[data-edit-section]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const section = sections.find((s) => s.id === btn.dataset.editSection);
        Packing.openSectionEditSheet(trip, section, container, state);
      });
    });
    const tagFilterBox = App.qs('#p-tag-filter', container);
    if (tagFilterBox) {
      App.qsa('[data-tag]', tagFilterBox).forEach((chip) => {
        chip.addEventListener('click', () => {
          const tag = chip.dataset.tag;
          const idx = state.tagFilter.indexOf(tag);
          const newFilter = idx === -1 ? state.tagFilter.concat([tag]) : state.tagFilter.filter((t) => t !== tag);
          Packing.render(trip, container, { tagFilter: newFilter });
        });
      });
    }

    App.qs('#p-new-section-btn', container).addEventListener('click', () => {
      App.openSheet('Neuer Abschnitt', (body) => {
        body.innerHTML =
          '<div class="field"><label>Name</label><input id="ps-new-name" type="text" placeholder="z. B. Dokumente &amp; Geld"></div>' +
          '<div class="field"><label>Hinweistext (optional)</label><input id="ps-new-hint" type="text" placeholder="z. B. Vor Abflug nochmal prüfen"></div>' +
          '<div class="btn-row"><button class="btn ghost" id="ps-new-cancel">Abbrechen</button><button class="btn primary" id="ps-new-save">Anlegen</button></div>';
        App.qs('#ps-new-cancel', body).addEventListener('click', () => App.closeSheet());
        App.qs('#ps-new-save', body).addEventListener('click', async () => {
          const name = App.qs('#ps-new-name', body).value.trim();
          if (!name) { App.toast('Bitte einen Namen eingeben'); return; }
          await Packing.createSection(trip.id, name, App.qs('#ps-new-hint', body).value.trim());
          App.closeSheet();
          Packing.render(trip, container, state);
        });
      });
    });

    App.qs('#p-template-apply', container).addEventListener('click', async () => {
      const templates = await Packing.templates();
      App.openSheet('Vorlage anwenden', (body) => {
        if (templates.length === 0) {
          body.innerHTML = '<p class="muted">Noch keine Vorlagen gespeichert.</p>';
          return;
        }
        body.innerHTML = templates.map((t) =>
          '<button class="list-item" data-id="' + t.id + '"><div class="main"><div class="title">' + App.escapeHtml(t.name) + '</div>' +
          '<div class="sub">' + Packing.templateItemCount(t) + ' Gegenstände</div></div>' +
          '<button class="del" data-tpl-del="' + t.id + '">✕</button></button>'
        ).join('');
        App.qsa('[data-id]', body).forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            if (e.target.closest('[data-tpl-del]')) return;
            const tpl = templates.find((t) => t.id === btn.dataset.id);
            App.closeSheet();
            const result = await Packing.applyParsedSections(trip.id, Packing.templateSections(tpl), 'add');
            App.toast(result.addedItems + ' Gegenstände übernommen');
            Packing.render(trip, container, state);
          });
        });
        App.qsa('[data-tpl-del]', body).forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!confirm('Vorlage löschen?')) return;
            await Packing.deleteTemplate(btn.dataset.tplDel);
            App.closeSheet();
            App.qs('#p-template-apply', container).click();
          });
        });
      });
    });

    App.qs('#p-template-save', container).addEventListener('click', () => {
      if (items.length === 0) { App.toast('Packliste ist leer'); return; }
      App.openSheet('Als Vorlage speichern', (body) => {
        body.innerHTML = '<div class="field"><label>Name der Vorlage</label><input id="t-name" type="text" placeholder="z. B. Strandurlaub"></div>' +
          '<div class="btn-row"><button class="btn ghost" id="t-cancel">Abbrechen</button><button class="btn primary" id="t-save">Speichern</button></div>';
        App.qs('#t-cancel', body).addEventListener('click', () => App.closeSheet());
        App.qs('#t-save', body).addEventListener('click', async () => {
          const name = App.qs('#t-name', body).value.trim();
          if (!name) { App.toast('Bitte einen Namen eingeben'); return; }
          await Packing.saveAsTemplate(trip.id, name);
          App.closeSheet();
          App.toast('Vorlage gespeichert');
        });
      });
    });

    App.qs('#p-bulk-add', container).addEventListener('click', () => {
      App.openSheet('Liste einfügen', (body) => {
        body.innerHTML =
          '<p class="field-hint mt-0">Eine Zeile pro Gegenstand. "## Name" für einen Abschnitt, "&gt; Text" direkt danach als Hinweis, " | " trennt eine Notiz ab, #Tag für Tags. Aufzählungszeichen werden automatisch entfernt.</p>' +
          '<div class="field"><textarea id="p-bulk-text" style="min-height:220px" placeholder="## Dokumente&#10;Reisepass | griffbereit halten #wichtig&#10;Ladekabel"></textarea></div>' +
          '<div class="btn-row"><button class="btn ghost" id="p-bulk-cancel">Abbrechen</button><button class="btn primary" id="p-bulk-next">Weiter</button></div>';
        App.qs('#p-bulk-cancel', body).addEventListener('click', () => App.closeSheet());
        App.qs('#p-bulk-next', body).addEventListener('click', () => {
          const text = App.qs('#p-bulk-text', body).value;
          if (!text.trim()) { App.toast('Bitte Text einfügen'); return; }
          App.closeSheet();
          Packing.openImportPreview(trip, container, text, { title: 'Vorschau', state });
        });
      });
    });

    App.qs('#p-file-import', container).addEventListener('click', () => App.qs('#p-file-input', container).click());
    App.qs('#p-file-input', container).addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await Packing.readFileAsText(file);
      e.target.value = '';
      Packing.openImportPreview(trip, container, text, { title: 'Datei-Import-Vorschau', state });
    });

    App.qs('#p-export', container).addEventListener('click', async () => {
      const model = await Packing.buildExportModel(trip.id);
      if (model.every((s) => s.items.length === 0)) { App.toast('Packliste ist leer'); return; }
      const text = Packing.serializeExport(trip.name, model);
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = 'packliste-' + trip.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-') + '-' + stamp + '.md';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });

    const clearBtn = App.qs('#p-clear-all', container);
    if (clearBtn) {
      clearBtn.addEventListener('click', async () => {
        if (!confirm('Die komplette Packliste (alle Gegenstände und Abschnitte) wirklich löschen? Das kann nicht rückgängig gemacht werden.')) return;
        await Packing.applyParsedSections(trip.id, [], 'replace');
        App.toast('Packliste geleert');
        Packing.render(trip, container, { tagFilter: [] });
      });
    }
  },

  openItemEditSheet(trip, item, sections, container, state) {
    App.openSheet('Gegenstand bearbeiten', (body) => {
      const sectionOpts = '<option value="">Kein Abschnitt</option>' + sections.map((s) =>
        '<option value="' + s.id + '"' + (s.id === item.sectionId ? ' selected' : '') + '>' + App.escapeHtml(s.name) + '</option>'
      ).join('');
      body.innerHTML =
        '<div class="field"><label>Name</label><input id="pi-text" type="text" value="' + App.escapeHtml(item.text) + '"></div>' +
        (sections.length ? '<div class="field"><label>Abschnitt</label><select id="pi-section">' + sectionOpts + '</select></div>' : '') +
        '<div class="field"><label>Notiz</label><input id="pi-note" type="text" value="' + App.escapeHtml(item.note || '') + '"></div>' +
        '<div class="field"><label>Tags (durch Komma oder Leerzeichen getrennt)</label><input id="pi-tags" type="text" value="' + App.escapeHtml((item.tags || []).join(', ')) + '"></div>' +
        '<button class="btn danger" id="pi-delete" style="margin-bottom:10px">Löschen</button>' +
        '<div class="btn-row"><button class="btn ghost" id="pi-cancel">Abbrechen</button><button class="btn primary" id="pi-save">Speichern</button></div>';
      App.qs('#pi-cancel', body).addEventListener('click', () => App.closeSheet());
      App.qs('#pi-delete', body).addEventListener('click', async () => {
        if (!confirm('Diesen Gegenstand wirklich löschen?')) return;
        await Packing.removeItem(item.id);
        App.closeSheet();
        Packing.render(trip, container, state);
      });
      App.qs('#pi-save', body).addEventListener('click', async () => {
        const text = App.qs('#pi-text', body).value.trim();
        if (!text) { App.toast('Bitte einen Namen eingeben'); return; }
        const tags = App.qs('#pi-tags', body).value.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean);
        const sectionSelect = App.qs('#pi-section', body);
        await Packing.saveItem({
          id: item.id, text, note: App.qs('#pi-note', body).value.trim(), tags,
          sectionId: sectionSelect ? (sectionSelect.value || null) : item.sectionId,
        });
        App.closeSheet();
        Packing.render(trip, container, state);
      });
    });
  },

  openSectionEditSheet(trip, section, container, state) {
    App.openSheet('Abschnitt bearbeiten', (body) => {
      body.innerHTML =
        '<div class="field"><label>Name</label><input id="ps-name" type="text" value="' + App.escapeHtml(section.name) + '"></div>' +
        '<div class="field"><label>Hinweistext (optional)</label><input id="ps-hint" type="text" value="' + App.escapeHtml(section.hint || '') + '"></div>' +
        '<button class="btn danger" id="ps-delete" style="margin-bottom:10px">Abschnitt löschen (Gegenstände bleiben erhalten)</button>' +
        '<div class="btn-row"><button class="btn ghost" id="ps-cancel">Abbrechen</button><button class="btn primary" id="ps-save">Speichern</button></div>';
      App.qs('#ps-cancel', body).addEventListener('click', () => App.closeSheet());
      App.qs('#ps-delete', body).addEventListener('click', async () => {
        if (!confirm('Abschnitt "' + section.name + '" löschen? Die Gegenstände bleiben erhalten und werden zu "Ohne Abschnitt".')) return;
        await Packing.deleteSection(section.id);
        App.closeSheet();
        Packing.render(trip, container, state);
      });
      App.qs('#ps-save', body).addEventListener('click', async () => {
        const name = App.qs('#ps-name', body).value.trim();
        if (!name) { App.toast('Bitte einen Namen eingeben'); return; }
        await Packing.updateSection(section.id, { name, hint: App.qs('#ps-hint', body).value.trim() });
        App.closeSheet();
        Packing.render(trip, container, state);
      });
    });
  },

  // Gemeinsame Vorschau für Datei-Import und "Liste einfügen".
  openImportPreview(trip, container, text, opts) {
    opts = opts || {};
    const isGarbage = Packing.looksLikeGarbage(text);
    const parsed = isGarbage ? { title: null, sections: [] } : Packing.parseImportText(text);
    const totalItems = parsed.sections.reduce((s, sec) => s + sec.items.length, 0);
    const namedSections = parsed.sections.filter((s) => s.name).length;

    App.openSheet(opts.title || 'Import-Vorschau', (body) => {
      if (isGarbage) {
        body.innerHTML = '<p class="muted">Diese Datei sieht nicht nach lesbarem Text aus (z. B. ein Bild, PDF oder Word-Dokument statt .txt/.md). Bitte eine reine Textdatei wählen.</p>' +
          '<div class="btn-row"><button class="btn ghost" id="pi-close">Schließen</button></div>';
        App.qs('#pi-close', body).addEventListener('click', () => App.closeSheet());
        return;
      }
      if (totalItems === 0) {
        body.innerHTML = '<p class="muted">Keine Gegenstände erkannt.</p><div class="btn-row"><button class="btn ghost" id="pi-close">Schließen</button></div>';
        App.qs('#pi-close', body).addEventListener('click', () => App.closeSheet());
        return;
      }

      const previewHtml = parsed.sections.map((sec) =>
        (sec.name ? '<div class="section-title" style="margin-top:10px">' + App.escapeHtml(sec.name) +
          (sec.hint ? ' <span class="muted" style="font-weight:400">– ' + App.escapeHtml(sec.hint) + '</span>' : '') + '</div>' : '') +
        sec.items.map((it) =>
          '<div class="muted" style="padding:2px 4px">• ' + App.escapeHtml(it.text) +
          (it.note ? ' — ' + App.escapeHtml(it.note) : '') +
          (it.tags.length ? ' ' + it.tags.map((t) => '#' + t).join(' ') : '') + '</div>'
        ).join('')
      ).join('');

      body.innerHTML =
        '<p class="field-hint mt-0">' + totalItems + ' Gegenstände' + (namedSections ? ' in ' + namedSections + ' Abschnitt(en)' : '') + ' erkannt:</p>' +
        '<div style="max-height:180px;overflow-y:auto;margin-bottom:12px">' + previewHtml + '</div>' +
        '<div class="field"><label>Modus</label><div class="tabline" id="pi-mode"><button data-v="add" class="active">Hinzufügen</button><button data-v="replace">Liste ersetzen</button></div></div>' +
        '<div class="field" style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="pi-save-tpl" style="width:auto;min-height:0"><label for="pi-save-tpl" style="margin:0">Auch als Vorlage speichern</label></div>' +
        '<div class="field" id="pi-tpl-name-field" hidden><label>Vorlagenname</label><input id="pi-tpl-name" type="text" value="' + App.escapeHtml(parsed.title || '') + '"></div>' +
        '<div class="btn-row"><button class="btn ghost" id="pi-cancel">Abbrechen</button><button class="btn primary" id="pi-confirm">Übernehmen</button></div>';

      let mode = 'add';
      App.qsa('#pi-mode button', body).forEach((btn) => {
        btn.addEventListener('click', () => {
          mode = btn.dataset.v;
          App.qsa('#pi-mode button', body).forEach((b) => b.classList.toggle('active', b === btn));
        });
      });
      App.qs('#pi-save-tpl', body).addEventListener('change', (e) => {
        App.qs('#pi-tpl-name-field', body).hidden = !e.target.checked;
      });
      App.qs('#pi-cancel', body).addEventListener('click', () => App.closeSheet());
      App.qs('#pi-confirm', body).addEventListener('click', async () => {
        if (mode === 'replace' && !confirm('Die aktuelle Packliste wird komplett ersetzt. Fortfahren?')) return;
        const result = await Packing.applyParsedSections(trip.id, parsed.sections, mode);
        if (App.qs('#pi-save-tpl', body).checked) {
          const tplName = App.qs('#pi-tpl-name', body).value.trim() || 'Unbenannte Vorlage';
          await Packing.saveAsTemplate(trip.id, tplName);
        }
        App.closeSheet();
        App.toast(result.addedItems + ' Gegenstände übernommen');
        Packing.render(trip, container, opts.state);
      });
    });
  },
};
