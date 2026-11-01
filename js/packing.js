// Packliste pro Trip, mit wiederverwendbaren Vorlagen.
const Packing = {
  async listForTrip(tripId) {
    const rows = await DB.getAllByIndex('packingItems', 'tripId', tripId);
    return rows.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async addItem(tripId, text) {
    const rows = await Packing.listForTrip(tripId);
    const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder || 0), 0);
    const item = { id: DB.uid(), tripId, text, checked: false, sortOrder: maxOrder + 1 };
    await DB.put('packingItems', item);
    return item;
  },

  async toggle(item) {
    item.checked = !item.checked;
    await DB.put('packingItems', item);
  },

  async removeItem(id) {
    await DB.remove('packingItems', id);
  },

  async templates() {
    return DB.getAll('packingTemplates');
  },

  async saveAsTemplate(name, items) {
    const tpl = { id: DB.uid(), name, items: items.map((i) => ({ id: DB.uid(), text: i.text })) };
    await DB.put('packingTemplates', tpl);
    return tpl;
  },

  async deleteTemplate(id) {
    await DB.remove('packingTemplates', id);
  },

  async applyTemplate(tripId, template) {
    const existing = await Packing.listForTrip(tripId);
    const existingTexts = new Set(existing.map((i) => i.text.toLowerCase()));
    let order = existing.reduce((m, r) => Math.max(m, r.sortOrder || 0), 0);
    for (const it of template.items) {
      if (existingTexts.has(it.text.toLowerCase())) continue;
      order += 1;
      await DB.put('packingItems', { id: DB.uid(), tripId, text: it.text, checked: false, sortOrder: order });
    }
  },

  async render(trip, container) {
    const items = await Packing.listForTrip(trip.id);
    const checkedCount = items.filter((i) => i.checked).length;

    container.innerHTML =
      '<div class="card">' +
      '<div class="field-row" style="margin-bottom:0">' +
      '<div class="field" style="margin-bottom:0"><input id="p-new" type="text" placeholder="Neuer Gegenstand…"></div>' +
      '<button class="btn primary" id="p-add" style="width:auto;flex:none;padding:0 16px">+</button>' +
      '</div></div>' +
      '<div class="btn-row" style="margin-top:0;margin-bottom:14px">' +
      '<button class="btn" id="p-template-apply">Vorlage anwenden</button>' +
      '<button class="btn" id="p-template-save">Als Vorlage speichern</button>' +
      '</div>' +
      '<p class="muted" style="margin-top:-6px">' + checkedCount + ' von ' + items.length + ' gepackt</p>' +
      '<div class="card" id="p-list">' + (items.length === 0 ? '<p class="muted mt-0">Noch keine Gegenstände.</p>' : items.map(row).join('')) + '</div>';

    function row(i) {
      return '<div class="checkrow' + (i.checked ? ' checked' : '') + '" data-id="' + i.id + '">' +
        '<input type="checkbox" ' + (i.checked ? 'checked' : '') + '>' +
        '<span class="text">' + App.escapeHtml(i.text) + '</span>' +
        '<button class="del" data-del="' + i.id + '">✕</button></div>';
    }

    App.qs('#p-add', container).addEventListener('click', addFromInput);
    App.qs('#p-new', container).addEventListener('keydown', (e) => { if (e.key === 'Enter') addFromInput(); });
    async function addFromInput() {
      const input = App.qs('#p-new', container);
      const text = input.value.trim();
      if (!text) return;
      await Packing.addItem(trip.id, text);
      input.value = '';
      Packing.render(trip, container);
    }

    App.qsa('.checkrow input[type="checkbox"]', container).forEach((cb) => {
      cb.addEventListener('change', async () => {
        const id = cb.closest('.checkrow').dataset.id;
        const item = items.find((i) => i.id === id);
        await Packing.toggle(item);
        Packing.render(trip, container);
      });
    });
    App.qsa('[data-del]', container).forEach((btn) => {
      btn.addEventListener('click', async () => {
        await Packing.removeItem(btn.dataset.del);
        Packing.render(trip, container);
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
          '<div class="sub">' + t.items.length + ' Gegenstände</div></div>' +
          '<button class="del" data-tpl-del="' + t.id + '">✕</button></button>'
        ).join('');
        App.qsa('[data-id]', body).forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            if (e.target.closest('[data-tpl-del]')) return;
            const tpl = templates.find((t) => t.id === btn.dataset.id);
            await Packing.applyTemplate(trip.id, tpl);
            App.closeSheet();
            App.toast('Vorlage angewendet');
            Packing.render(trip, container);
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
          await Packing.saveAsTemplate(name, items);
          App.closeSheet();
          App.toast('Vorlage gespeichert');
        });
      });
    });
  },
};
