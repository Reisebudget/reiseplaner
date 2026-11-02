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
      '<div class="field"><label>Währung</label><button type="button" class="field-select-btn" id="e-currency-btn"></button></div>' +
      '</div>' +
      '<div class="field-row">' +
      '<div class="field"><label>Kategorie</label><select id="e-category">' + CATEGORY_KEYS.map((k) => '<option value="' + k + '">' + CATEGORY_LABELS[k] + '</option>').join('') + '</select></div>' +
      '<div class="field"><label>Land</label><button type="button" class="field-select-btn" id="e-country-btn"></button></div>' +
      '</div>' +
      '<div class="field"><label>Datum</label><input id="e-date" type="date" value="' + App.today() + '"></div>' +
      '<div class="field"><label>Notiz</label><input id="e-note" type="text" placeholder="optional"></div>' +
      (trip.people && trip.people.length ? '<div class="field"><label>Mit wem noch teilen? (du bist automatisch dabei)</label><div id="e-people-chips" class="chip-select" style="margin-bottom:0"></div></div>' : '') +
      '<button class="btn primary" id="e-save">Ausgabe speichern</button>' +
      '</div>' +
      '<div class="card-row" style="margin-bottom:10px"><span class="label">Gesamt ausgegeben</span><span class="value">' + App.formatMoney(total, 'EUR') + '</span></div>' +
      '<div id="e-list">' + (rows.length === 0 ? '<div class="empty-state"><div class="big">💳</div>Noch keine Ausgaben erfasst.</div>' : rows.map(row).join('')) + '</div>';

    function row(r) {
      const split = r.splitWith && r.splitWith.length >= 1
        ? '<br><span class="muted">Aufgeteilt auf ' + (r.splitWith.length + 1) + ' Personen (inkl. dir) · ' + App.formatMoney(r.amount / (r.splitWith.length + 1), r.currency) + ' pro Person</span>' : '';
      return '<button class="list-item" data-id="' + r.id + '" style="align-items:flex-start">' +
        '<div class="main"><div class="title">' + CATEGORY_LABELS[r.category] + ' · ' + App.escapeHtml(Countries.name(r.country)) + '</div>' +
        '<div class="sub">' + App.formatDate(r.date) + (r.note ? ' · ' + App.escapeHtml(r.note) : '') + split + '</div></div>' +
        '<div class="trailing">' + App.formatMoney(r.amount, r.currency) +
        (r.currency !== 'EUR' ? '<br><span class="muted">' + App.formatMoney(r.amountEUR, 'EUR') + '</span>' : '') + '</div></button>';
    }

    const countryBtn = App.qs('#e-country-btn', container);
    const currencyBtn = App.qs('#e-currency-btn', container);
    let selectedCountry = defaultCountry;
    let selectedCurrency = Countries.currency(defaultCountry);

    function updateCountryBtn() {
      countryBtn.innerHTML = '<span>' + Countries.flagEmoji(selectedCountry) + ' ' + App.escapeHtml(Countries.name(selectedCountry)) + '</span><span class="chev">›</span>';
    }
    function updateCurrencyBtn() {
      currencyBtn.innerHTML = '<span>' + selectedCurrency + '</span><span class="chev">›</span>';
    }
    updateCountryBtn();
    updateCurrencyBtn();

    countryBtn.addEventListener('click', () => {
      Countries.openPickerSheet({
        title: 'Land auswählen', selected: selectedCountry, codes: trip.countries,
        onSelect: (code) => { selectedCountry = code; selectedCurrency = Countries.currency(code); updateCountryBtn(); updateCurrencyBtn(); },
      });
    });
    currencyBtn.addEventListener('click', () => {
      App.openCurrencyPickerSheet({
        title: 'Währung wählen', selected: selectedCurrency,
        onSelect: (code) => { selectedCurrency = code; updateCurrencyBtn(); },
      });
    });

    let selectedPeople = [];
    const peopleChipsBox = App.qs('#e-people-chips', container);
    function renderPeopleChips() {
      if (!peopleChipsBox) return;
      peopleChipsBox.innerHTML = trip.people.map((p) =>
        '<span class="chip' + (selectedPeople.includes(p) ? ' selected' : '') + '" data-person="' + App.escapeHtml(p) + '">' + App.escapeHtml(p) + '</span>'
      ).join('');
      App.qsa('[data-person]', peopleChipsBox).forEach((chip) => {
        chip.addEventListener('click', () => {
          const name = chip.dataset.person;
          const idx = selectedPeople.indexOf(name);
          if (idx === -1) selectedPeople.push(name); else selectedPeople.splice(idx, 1);
          renderPeopleChips();
        });
      });
    }
    renderPeopleChips();

    App.qs('#e-save', container).addEventListener('click', async () => {
      const amount = App.parseDecimal(App.qs('#e-amount', container).value);
      if (!amount) { App.toast('Bitte einen Betrag eingeben'); return; }
      await Expenses.save({
        tripId: trip.id, amount, currency: selectedCurrency,
        category: App.qs('#e-category', container).value, country: selectedCountry,
        date: App.qs('#e-date', container).value || App.today(),
        note: App.qs('#e-note', container).value.trim(),
        splitWith: selectedPeople,
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
        '<div class="field"><label>Währung</label><button type="button" class="field-select-btn" id="x-currency-btn"></button></div>' +
        '</div>' +
        '<div class="field-row">' +
        '<div class="field"><label>Kategorie</label><select id="x-category">' + CATEGORY_KEYS.map((k) => '<option value="' + k + '"' + (k === expense.category ? ' selected' : '') + '>' + CATEGORY_LABELS[k] + '</option>').join('') + '</select></div>' +
        '<div class="field"><label>Land</label><button type="button" class="field-select-btn" id="x-country-btn"></button></div>' +
        '</div>' +
        '<div class="field"><label>Datum</label><input id="x-date" type="date" value="' + expense.date + '"></div>' +
        '<div class="field"><label>Notiz</label><input id="x-note" type="text" value="' + App.escapeHtml(expense.note || '') + '"></div>' +
        (trip.people && trip.people.length ? '<div class="field"><label>Mit wem noch teilen? (du bist automatisch dabei)</label><div id="x-people-chips" class="chip-select" style="margin-bottom:8px"></div></div>' : '') +
        '<button class="btn danger" id="x-delete" style="margin-bottom:10px">Ausgabe löschen</button>' +
        '<div class="btn-row"><button class="btn ghost" id="x-cancel">Abbrechen</button><button class="btn primary" id="x-save">Speichern</button></div>';

      let selectedCountry = expense.country;
      let selectedCurrency = expense.currency;
      const countryBtn = App.qs('#x-country-btn', body);
      const currencyBtn = App.qs('#x-currency-btn', body);
      function updateCountryBtn() {
        countryBtn.innerHTML = '<span>' + Countries.flagEmoji(selectedCountry) + ' ' + App.escapeHtml(Countries.name(selectedCountry)) + '</span><span class="chev">›</span>';
      }
      function updateCurrencyBtn() {
        currencyBtn.innerHTML = '<span>' + selectedCurrency + '</span><span class="chev">›</span>';
      }
      updateCountryBtn();
      updateCurrencyBtn();
      countryBtn.addEventListener('click', () => {
        Countries.openPickerSheet({
          title: 'Land auswählen', selected: selectedCountry, codes: trip.countries,
          onSelect: (code) => { selectedCountry = code; updateCountryBtn(); },
        });
      });
      currencyBtn.addEventListener('click', () => {
        App.openCurrencyPickerSheet({
          title: 'Währung wählen', selected: selectedCurrency,
          onSelect: (code) => { selectedCurrency = code; updateCurrencyBtn(); },
        });
      });

      let selectedPeople = (expense.splitWith || []).slice();
      const peopleChipsBox = App.qs('#x-people-chips', body);
      function renderPeopleChips() {
        if (!peopleChipsBox) return;
        peopleChipsBox.innerHTML = trip.people.map((p) =>
          '<span class="chip' + (selectedPeople.includes(p) ? ' selected' : '') + '" data-person="' + App.escapeHtml(p) + '">' + App.escapeHtml(p) + '</span>'
        ).join('');
        App.qsa('[data-person]', peopleChipsBox).forEach((chip) => {
          chip.addEventListener('click', () => {
            const name = chip.dataset.person;
            const idx = selectedPeople.indexOf(name);
            if (idx === -1) selectedPeople.push(name); else selectedPeople.splice(idx, 1);
            renderPeopleChips();
          });
        });
      }
      renderPeopleChips();

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
          id: expense.id, tripId: trip.id, amount, currency: selectedCurrency,
          category: App.qs('#x-category', body).value, country: selectedCountry,
          date: App.qs('#x-date', body).value, note: App.qs('#x-note', body).value.trim(),
          splitWith: selectedPeople,
        });
        App.closeSheet();
        App.toast('Gespeichert');
        Expenses.render(trip, container);
      });
    });
  },
};
