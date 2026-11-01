// Ausgaben: schnelle Erfassung unterwegs, Umrechnung in Euro beim Eintragen.
const Expenses = {
  async listForTrip(tripId) {
    const rows = await DB.getAllByIndex('expenses', 'tripId', tripId);
    return rows.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || ''));
  },

  async save(data) {
    const ratesMap = await App.ratesMap();
    const rate = data.currency === 'EUR' ? 1 : (ratesMap[data.currency] || 1);
    const amountEUR = App.toEUR(data.amount, data.currency, ratesMap);
    const now = new Date().toISOString();
    if (data.id) {
      const existing = await DB.get('expenses', data.id);
      const updated = Object.assign({}, existing, data, { rate, amountEUR, updatedAt: now });
      await DB.put('expenses', updated);
      return updated;
    }
    const row = Object.assign({}, data, { id: DB.uid(), createdAt: now, rate, amountEUR });
    await DB.put('expenses', row);
    return row;
  },

  async remove(id) {
    await DB.remove('expenses', id);
  },

  async render(trip, container) {
    const rows = await Expenses.listForTrip(trip.id);
    const total = rows.reduce((s, r) => s + (r.amountEUR || 0), 0);
    const defaultCountry = trip.countries[0] || '';

    container.innerHTML =
      '<div class="card" id="e-form">' +
      '<div class="field-row">' +
      '<div class="field"><label>Betrag</label><input id="e-amount" type="text" inputmode="decimal" placeholder="0,00"></div>' +
      '<div class="field"><label>Währung</label><select id="e-currency">' + Object.keys(DEFAULT_RATES).sort().map((c) => '<option value="' + c + '">' + c + '</option>').join('') + '</select></div>' +
      '</div>' +
      '<div class="field-row">' +
      '<div class="field"><label>Kategorie</label><select id="e-category">' + CATEGORY_KEYS.map((k) => '<option value="' + k + '">' + CATEGORY_LABELS[k] + '</option>').join('') + '</select></div>' +
      '<div class="field"><label>Land</label><select id="e-country">' + trip.countries.map((c) => '<option value="' + c + '">' + App.escapeHtml(Countries.name(c)) + '</option>').join('') + '</select></div>' +
      '</div>' +
      '<div class="field"><label>Datum</label><input id="e-date" type="date" value="' + App.today() + '"></div>' +
      '<div class="field"><label>Notiz</label><input id="e-note" type="text" placeholder="optional"></div>' +
      '<button class="btn primary" id="e-save">Ausgabe speichern</button>' +
      '</div>' +
      '<div class="card-row" style="margin-bottom:10px"><span class="label">Gesamt ausgegeben</span><span class="value">' + App.formatMoney(total, 'EUR') + '</span></div>' +
      '<div id="e-list">' + (rows.length === 0 ? '<div class="empty-state"><div class="big">💳</div>Noch keine Ausgaben erfasst.</div>' : rows.map(row).join('')) + '</div>';

    function row(r) {
      return '<button class="list-item" data-id="' + r.id + '">' +
        '<div class="main"><div class="title">' + CATEGORY_LABELS[r.category] + ' · ' + App.escapeHtml(Countries.name(r.country)) + '</div>' +
        '<div class="sub">' + App.formatDate(r.date) + (r.note ? ' · ' + App.escapeHtml(r.note) : '') + '</div></div>' +
        '<div class="trailing">' + App.formatMoney(r.amount, r.currency) +
        (r.currency !== 'EUR' ? '<br><span class="muted">' + App.formatMoney(r.amountEUR, 'EUR') + '</span>' : '') + '</div></button>';
    }

    const countrySel = App.qs('#e-country', container);
    const currencySel = App.qs('#e-currency', container);
    function syncCurrency() { currencySel.value = Countries.currency(countrySel.value); }
    countrySel.value = defaultCountry;
    syncCurrency();
    countrySel.addEventListener('change', syncCurrency);

    App.qs('#e-save', container).addEventListener('click', async () => {
      const amount = App.parseDecimal(App.qs('#e-amount', container).value);
      if (!amount) { App.toast('Bitte einen Betrag eingeben'); return; }
      await Expenses.save({
        tripId: trip.id, amount, currency: currencySel.value,
        category: App.qs('#e-category', container).value, country: countrySel.value,
        date: App.qs('#e-date', container).value || App.today(),
        note: App.qs('#e-note', container).value.trim(),
      });
      App.toast('Ausgabe gespeichert');
      Expenses.render(trip, container);
    });

    App.qsa('[data-id]', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = rows.find((r) => r.id === btn.dataset.id);
        Expenses.openEditSheet(trip, row, container);
      });
    });
  },

  openEditSheet(trip, expense, container) {
    App.openSheet('Ausgabe bearbeiten', (body) => {
      body.innerHTML =
        '<div class="field-row">' +
        '<div class="field"><label>Betrag</label><input id="x-amount" type="text" inputmode="decimal" value="' + expense.amount.toString().replace('.', ',') + '"></div>' +
        '<div class="field"><label>Währung</label><select id="x-currency">' + Object.keys(DEFAULT_RATES).sort().map((c) => '<option value="' + c + '"' + (c === expense.currency ? ' selected' : '') + '>' + c + '</option>').join('') + '</select></div>' +
        '</div>' +
        '<div class="field-row">' +
        '<div class="field"><label>Kategorie</label><select id="x-category">' + CATEGORY_KEYS.map((k) => '<option value="' + k + '"' + (k === expense.category ? ' selected' : '') + '>' + CATEGORY_LABELS[k] + '</option>').join('') + '</select></div>' +
        '<div class="field"><label>Land</label><select id="x-country">' + trip.countries.map((c) => '<option value="' + c + '"' + (c === expense.country ? ' selected' : '') + '>' + App.escapeHtml(Countries.name(c)) + '</option>').join('') + '</select></div>' +
        '</div>' +
        '<div class="field"><label>Datum</label><input id="x-date" type="date" value="' + expense.date + '"></div>' +
        '<div class="field"><label>Notiz</label><input id="x-note" type="text" value="' + App.escapeHtml(expense.note || '') + '"></div>' +
        '<button class="btn danger" id="x-delete" style="margin-bottom:10px">Ausgabe löschen</button>' +
        '<div class="btn-row"><button class="btn ghost" id="x-cancel">Abbrechen</button><button class="btn primary" id="x-save">Speichern</button></div>';

      App.qs('#x-cancel', body).addEventListener('click', () => App.closeSheet());
      App.qs('#x-delete', body).addEventListener('click', async () => {
        if (!confirm('Diese Ausgabe wirklich löschen?')) return;
        await Expenses.remove(expense.id);
        App.closeSheet();
        App.toast('Ausgabe gelöscht');
        Expenses.render(trip, container);
      });
      App.qs('#x-save', body).addEventListener('click', async () => {
        const amount = App.parseDecimal(App.qs('#x-amount', body).value);
        if (!amount) { App.toast('Bitte einen Betrag eingeben'); return; }
        await Expenses.save({
          id: expense.id, tripId: trip.id, amount, currency: App.qs('#x-currency', body).value,
          category: App.qs('#x-category', body).value, country: App.qs('#x-country', body).value,
          date: App.qs('#x-date', body).value, note: App.qs('#x-note', body).value.trim(),
        });
        App.closeSheet();
        App.toast('Gespeichert');
        Expenses.render(trip, container);
      });
    });
  },
};
