// Buchungen: Flüge, Unterkünfte, Transport, Touren, Gebühren.
const Bookings = {
  async listForTrip(tripId) {
    const rows = await DB.getAllByIndex('bookings', 'tripId', tripId);
    return rows.sort((a, b) => ((a.dateStart || '') + (a.timeStart || '')).localeCompare((b.dateStart || '') + (b.timeStart || '')));
  },

  async save(data) {
    const now = new Date().toISOString();
    if (data.id) {
      const existing = await DB.get('bookings', data.id);
      const updated = Object.assign({}, existing, data, { updatedAt: now });
      await DB.put('bookings', updated);
      return updated;
    }
    const row = Object.assign({}, data, { id: DB.uid(), createdAt: now, updatedAt: now });
    await DB.put('bookings', row);
    return row;
  },

  async remove(id) {
    await DB.remove('bookings', id);
  },

  async render(trip, container) {
    const rows = await Bookings.listForTrip(trip.id);
    if (rows.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="big">🎫</div>Noch keine Buchungen.<br>Tippe auf + zum Anlegen.</div>';
      return;
    }
    container.innerHTML = rows.map((b) => {
      const route = (b.from || b.to) ? App.escapeHtml((b.from || '') + ' → ' + (b.to || '')) : '';
      return '<button class="list-item" data-id="' + b.id + '">' +
        '<div class="main"><div class="title">' + App.escapeHtml(b.title || BOOKING_TYPE_LABELS[b.type]) + '</div>' +
        '<div class="sub">' + BOOKING_TYPE_LABELS[b.type] + ' · ' + App.escapeHtml(Countries.name(b.country)) + (route ? ' · ' + route : '') + '<br>' +
        App.formatDate(b.dateStart) + (b.timeStart ? ', ' + b.timeStart : '') + '</div></div>' +
        '<div class="trailing">' + App.formatMoney(b.price, b.currency) + '<br><span class="badge ' + BOOKING_STATUS_BADGE[b.status] + '">' + BOOKING_STATUS_LABELS[b.status] + '</span></div>' +
        '</button>';
    }).join('');
    App.qsa('[data-id]', container).forEach((btn) => {
      btn.addEventListener('click', async () => {
        const row = rows.find((r) => r.id === btn.dataset.id);
        Bookings.openEditSheet(trip, row);
      });
    });
  },

  openEditSheet(trip, booking) {
    const isNew = !booking;
    const data = booking || {
      title: '', type: 'flug', country: trip.countries[0] || '', from: '', to: '',
      dateStart: App.today(), timeStart: '', dateEnd: '', timeEnd: '',
      price: 0, currency: Countries.currency(trip.countries[0] || 'EUR'), status: 'offen', refNumber: '', note: '',
    };
    const currencyOptions = App.currencyCodesSorted();

    App.openSheet(isNew ? 'Neue Buchung' : 'Buchung bearbeiten', (body) => {
      body.innerHTML =
        '<div class="field"><label>Titel</label><input id="f-title" type="text" value="' + App.escapeHtml(data.title) + '" placeholder="z. B. Flug Berlin–Casablanca"></div>' +
        '<div class="field-row">' +
        '<div class="field"><label>Art</label><select id="f-type">' + BOOKING_TYPE_KEYS.map((k) => '<option value="' + k + '"' + (k === data.type ? ' selected' : '') + '>' + BOOKING_TYPE_LABELS[k] + '</option>').join('') + '</select></div>' +
        '<div class="field"><label>Land</label><button type="button" class="field-select-btn" id="f-country-btn"></button></div>' +
        '</div>' +
        '<div class="field-row">' +
        '<div class="field"><label>Von</label><input id="f-from" type="text" value="' + App.escapeHtml(data.from) + '" placeholder="Ort/Flughafen"></div>' +
        '<div class="field"><label>Nach</label><input id="f-to" type="text" value="' + App.escapeHtml(data.to) + '" placeholder="Ort/Flughafen"></div>' +
        '</div>' +
        '<div class="field-row">' +
        '<div class="field"><label>Datum Start</label><input id="f-date-start" type="date" value="' + data.dateStart + '"></div>' +
        '<div class="field"><label>Uhrzeit Start</label><input id="f-time-start" type="time" value="' + (data.timeStart || '') + '"></div>' +
        '</div>' +
        '<div class="field-row">' +
        '<div class="field"><label>Datum Ende</label><input id="f-date-end" type="date" value="' + (data.dateEnd || '') + '"></div>' +
        '<div class="field"><label>Uhrzeit Ende</label><input id="f-time-end" type="time" value="' + (data.timeEnd || '') + '"></div>' +
        '</div>' +
        '<div class="field-row">' +
        '<div class="field"><label>Preis</label><input id="f-price" type="text" inputmode="decimal" value="' + (data.price || 0).toString().replace('.', ',') + '"></div>' +
        '<div class="field"><label>Währung</label><select id="f-currency">' + currencyOptions.map((c) => '<option value="' + c + '"' + (c === data.currency ? ' selected' : '') + '>' + c + '</option>').join('') + '</select></div>' +
        '</div>' +
        '<div class="field"><label>Status</label><select id="f-status">' + BOOKING_STATUS_KEYS.map((k) => '<option value="' + k + '"' + (k === data.status ? ' selected' : '') + '>' + BOOKING_STATUS_LABELS[k] + '</option>').join('') + '</select></div>' +
        '<div class="field"><label>Buchungs-/Flugnummer</label><input id="f-ref" type="text" value="' + App.escapeHtml(data.refNumber) + '"></div>' +
        '<div class="field"><label>Notiz</label><textarea id="f-note">' + App.escapeHtml(data.note) + '</textarea></div>' +
        (isNew ? '' : '<button class="btn danger" id="f-delete" style="margin-bottom:10px">Buchung löschen</button>') +
        '<div class="btn-row"><button class="btn ghost" id="f-cancel">Abbrechen</button><button class="btn primary" id="f-save">Speichern</button></div>';

      let selectedCountry = data.country;
      const countryBtn = App.qs('#f-country-btn', body);
      function updateCountryBtn() {
        countryBtn.innerHTML = '<span>' + Countries.flagEmoji(selectedCountry) + ' ' + App.escapeHtml(Countries.name(selectedCountry)) + '</span><span class="chev">›</span>';
      }
      updateCountryBtn();
      countryBtn.addEventListener('click', () => {
        Countries.openPickerSheet({
          title: 'Land auswählen', selected: selectedCountry, codes: trip.countries,
          onSelect: (code) => {
            selectedCountry = code;
            updateCountryBtn();
            App.qs('#f-currency', body).value = Countries.currency(code);
          },
        });
      });

      App.qs('#f-cancel', body).addEventListener('click', () => App.closeSheet());
      if (!isNew) {
        App.qs('#f-delete', body).addEventListener('click', async () => {
          if (!confirm('Diese Buchung wirklich löschen?')) return;
          await Bookings.remove(data.id);
          App.closeSheet();
          App.toast('Buchung gelöscht');
          if (App.refresh) App.refresh();
        });
      }
      App.qs('#f-save', body).addEventListener('click', async () => {
        const title = App.qs('#f-title', body).value.trim();
        const dateStart = App.qs('#f-date-start', body).value;
        if (!dateStart) { App.toast('Bitte ein Startdatum wählen'); return; }
        await Bookings.save({
          id: data.id, tripId: trip.id,
          title, type: App.qs('#f-type', body).value, country: selectedCountry,
          from: App.qs('#f-from', body).value.trim(), to: App.qs('#f-to', body).value.trim(),
          dateStart, timeStart: App.qs('#f-time-start', body).value,
          dateEnd: App.qs('#f-date-end', body).value, timeEnd: App.qs('#f-time-end', body).value,
          price: App.parseDecimal(App.qs('#f-price', body).value), currency: App.qs('#f-currency', body).value,
          status: App.qs('#f-status', body).value, refNumber: App.qs('#f-ref', body).value.trim(),
          note: App.qs('#f-note', body).value.trim(),
        });
        App.closeSheet();
        App.toast('Gespeichert');
        if (App.refresh) App.refresh();
      });
    });
  },
};
