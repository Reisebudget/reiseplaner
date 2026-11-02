// Notfall: Dokumente (Fotos), Nummern und Kontakte offline speichern.
const Emergency = {
  async all() {
    const rows = await DB.getAll('emergencyItems');
    return rows.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  },

  async save(data) {
    const now = new Date().toISOString();
    if (data.id) {
      const existing = await DB.get('emergencyItems', data.id);
      const updated = Object.assign({}, existing, data, { updatedAt: now });
      await DB.put('emergencyItems', updated);
      return updated;
    }
    const row = Object.assign({}, data, { id: DB.uid(), createdAt: now });
    await DB.put('emergencyItems', row);
    return row;
  },

  async remove(id) {
    await DB.remove('emergencyItems', id);
  },

  async render(container) {
    const items = await Emergency.all();
    container.innerHTML = items.length === 0
      ? '<div class="empty-state"><div class="big">🚨</div>Noch keine Notfall-Infos gespeichert.<br>Tippe auf + für Dokumente, Nummern oder Kontakte.</div>'
      : items.map(row).join('');

    function row(i) {
      const thumb = i.image
        ? '<div class="spot-thumb"><img src="' + i.image + '"></div>'
        : '<div class="spot-thumb">' + (i.type === 'contact' ? '📞' : '📄') + '</div>';
      return '<button class="list-item" data-id="' + i.id + '" style="align-items:flex-start">' + thumb +
        '<div class="main"><div class="title">' + App.escapeHtml(i.title) + '</div>' +
        '<div class="sub">' + (i.phone ? App.escapeHtml(i.phone) : '') + (i.note ? (i.phone ? ' · ' : '') + App.escapeHtml(i.note) : '') + '</div></div></button>';
    }

    App.qsa('[data-id]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = items.find((i) => i.id === btn.dataset.id);
        Emergency.openEditSheet(item, () => Emergency.render(container));
      });
    });
  },

  openAddSheet(onChange) {
    App.openSheet('Notfall-Info hinzufügen', (body) => {
      body.innerHTML =
        '<div class="tabline" id="em-add-tabs"><button data-t="document" class="active">Dokument</button><button data-t="contact">Kontakt/Nummer</button></div>' +
        '<div class="field"><label>Titel</label><input id="em-title" type="text" placeholder="z. B. Reisepass, Deutsche Botschaft, Versicherung"></div>' +
        '<div id="em-document-fields">' +
        '<div class="field"><label>Foto (optional)</label><input id="em-file" type="file" accept="image/*"></div>' +
        '</div>' +
        '<div id="em-contact-fields" hidden>' +
        '<div class="field"><label>Telefonnummer</label><input id="em-phone" type="tel" placeholder="+49 …"></div>' +
        '</div>' +
        '<div class="field"><label>Notiz</label><textarea id="em-note" placeholder="z. B. Versicherungsnummer, Adresse…"></textarea></div>' +
        '<div class="btn-row"><button class="btn ghost" id="em-cancel">Abbrechen</button><button class="btn primary" id="em-save">Speichern</button></div>';

      let activeTab = 'document';
      App.qsa('#em-add-tabs button', body).forEach((btn) => {
        btn.addEventListener('click', () => {
          activeTab = btn.dataset.t;
          App.qsa('#em-add-tabs button', body).forEach((b) => b.classList.toggle('active', b === btn));
          App.qs('#em-document-fields', body).hidden = activeTab !== 'document';
          App.qs('#em-contact-fields', body).hidden = activeTab !== 'contact';
        });
      });

      App.qs('#em-cancel', body).addEventListener('click', () => App.closeSheet());
      App.qs('#em-save', body).addEventListener('click', async () => {
        const title = App.qs('#em-title', body).value.trim();
        if (!title) { App.toast('Bitte einen Titel eingeben'); return; }
        let image = null;
        if (activeTab === 'document') {
          const file = App.qs('#em-file', body).files[0];
          if (file) {
            const raw = await App.fileToDataUrl(file);
            image = await App.downscaleImage(raw, 1200, 0.85);
          }
        }
        await Emergency.save({
          type: activeTab, title, image,
          phone: activeTab === 'contact' ? App.qs('#em-phone', body).value.trim() : null,
          note: App.qs('#em-note', body).value.trim(),
        });
        App.closeSheet();
        App.toast('Gespeichert');
        if (onChange) onChange();
      });
    });
  },

  openEditSheet(item, onChange) {
    App.openSheet(item.type === 'contact' ? 'Kontakt bearbeiten' : 'Dokument bearbeiten', (body) => {
      const img = item.image ? '<img src="' + item.image + '" style="width:100%;border-radius:var(--radius);margin-bottom:12px;display:block">' : '';
      body.innerHTML = img +
        '<div class="field"><label>Titel</label><input id="em-title" type="text" value="' + App.escapeHtml(item.title) + '"></div>' +
        (item.type === 'contact'
          ? '<div class="field"><label>Telefonnummer</label><input id="em-phone" type="tel" value="' + App.escapeHtml(item.phone || '') + '"></div>'
          : '<div class="field"><label>Neues Foto (ersetzt vorhandenes)</label><input id="em-file" type="file" accept="image/*"></div>') +
        '<div class="field"><label>Notiz</label><textarea id="em-note">' + App.escapeHtml(item.note || '') + '</textarea></div>' +
        '<button class="btn danger" id="em-delete" style="margin-bottom:10px">Löschen</button>' +
        '<div class="btn-row"><button class="btn ghost" id="em-cancel">Abbrechen</button><button class="btn primary" id="em-save">Speichern</button></div>';

      App.qs('#em-cancel', body).addEventListener('click', () => App.closeSheet());
      App.qs('#em-delete', body).addEventListener('click', async () => {
        if (!confirm('Diesen Eintrag wirklich löschen?')) return;
        await Emergency.remove(item.id);
        App.closeSheet();
        App.toast('Gelöscht');
        if (onChange) onChange();
      });
      App.qs('#em-save', body).addEventListener('click', async () => {
        const title = App.qs('#em-title', body).value.trim();
        if (!title) { App.toast('Bitte einen Titel eingeben'); return; }
        let image = item.image;
        if (item.type === 'document') {
          const fileInput = App.qs('#em-file', body);
          const file = fileInput && fileInput.files[0];
          if (file) {
            const raw = await App.fileToDataUrl(file);
            image = await App.downscaleImage(raw, 1200, 0.85);
          }
        }
        await Emergency.save({
          id: item.id, type: item.type, title, image,
          phone: item.type === 'contact' ? App.qs('#em-phone', body).value.trim() : null,
          note: App.qs('#em-note', body).value.trim(),
        });
        App.closeSheet();
        App.toast('Gespeichert');
        if (onChange) onChange();
      });
    });
  },
};
