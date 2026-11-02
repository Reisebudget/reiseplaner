// Trips: Verwaltung, Liste, Übersicht mit Budget-Aggregation.
const Trips = {
  async all() {
    const trips = await DB.getAll('trips');
    return trips.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  },

  async get(id) {
    return DB.get('trips', id);
  },

  async save(data) {
    const now = new Date().toISOString();
    if (data.id) {
      const existing = await DB.get('trips', data.id);
      const updated = Object.assign({}, existing, data, { updatedAt: now });
      await DB.put('trips', updated);
      return updated;
    }
    const trip = Object.assign({}, data, { id: DB.uid(), createdAt: now, updatedAt: now });
    await DB.put('trips', trip);
    return trip;
  },

  async remove(id) {
    const [bookings, expenses, packingItems] = await Promise.all([
      DB.getAllByIndex('bookings', 'tripId', id),
      DB.getAllByIndex('expenses', 'tripId', id),
      DB.getAllByIndex('packingItems', 'tripId', id),
    ]);
    await Promise.all([
      ...bookings.map((b) => DB.remove('bookings', b.id)),
      ...expenses.map((e) => DB.remove('expenses', e.id)),
      ...packingItems.map((p) => DB.remove('packingItems', p.id)),
      DB.remove('trips', id),
    ]);
  },

  isPast(trip) {
    return trip.endDate < App.today();
  },

  countryStatusMap(trips, manualVisited) {
    const map = {};
    const today = App.today();
    trips.forEach((t) => {
      const past = t.endDate < today;
      (t.countries || []).forEach((c) => {
        if (past) map[c] = 'visited';
        else if (map[c] !== 'visited') map[c] = 'planned';
      });
    });
    (manualVisited || []).forEach((c) => { map[c] = 'visited'; });
    return map;
  },

  tripsForCountry(trips, code) {
    return trips.filter((t) => (t.countries || []).includes(code))
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  },

  async getManualVisited() {
    const row = await DB.get('settings', 'manualVisited');
    return (row && row.value) || [];
  },

  async toggleManualVisited(code) {
    const list = await Trips.getManualVisited();
    const idx = list.indexOf(code);
    if (idx === -1) list.push(code); else list.splice(idx, 1);
    await DB.put('settings', { key: 'manualVisited', value: list });
    return list;
  },

  renderList(trips) {
    const today = App.today();
    const upcoming = trips.filter((t) => t.endDate >= today).sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
    const past = trips.filter((t) => t.endDate < today);
    let html = '';
    if (upcoming.length) {
      html += '<div class="section-title">Geplant & aktuell</div>' + upcoming.map(tripItem).join('');
    }
    if (past.length) {
      html += '<div class="section-title">Vergangen</div>' + past.map(tripItem).join('');
    }
    return html;

    function tripItem(t) {
      const countries = (t.countries || []).map((c) => Countries.name(c)).join(', ');
      return '<div class="row-with-delete">' +
        '<button class="list-item" data-id="' + t.id + '">' +
        '<div class="main"><div class="title">' + App.escapeHtml(t.name) + '</div>' +
        '<div class="sub">' + App.formatDateRange(t.startDate, t.endDate) + (countries ? ' · ' + App.escapeHtml(countries) : '') + '</div></div>' +
        '<span class="chev">›</span></button>' +
        '<button class="row-delete-btn" data-del-trip="' + t.id + '" aria-label="Trip löschen">🗑</button>' +
        '</div>';
    }
  },

  wireList(container) {
    App.qsa('[data-id]', container).forEach((btn) => {
      btn.addEventListener('click', () => App.navigate('#/trip/' + btn.dataset.id + '/overview'));
    });
    App.qsa('[data-del-trip]', container).forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.delTrip;
        const trip = await Trips.get(id);
        if (!confirm('"' + (trip ? trip.name : 'Trip') + '" inkl. aller Buchungen, Ausgaben und Packliste wirklich löschen?')) return;
        await Trips.remove(id);
        App.toast('Trip gelöscht');
        if (App.refresh) App.refresh();
      });
    });
  },

  async computeOverview(tripId) {
    const [trip, bookings, expenses, ratesMap] = await Promise.all([
      Trips.get(tripId), DB.getAllByIndex('bookings', 'tripId', tripId),
      DB.getAllByIndex('expenses', 'tripId', tripId), App.ratesMap(),
    ]);
    const perCountry = {};
    (trip.countries || []).forEach((code) => {
      perCountry[code] = {};
      CATEGORY_KEYS.forEach((k) => { perCountry[code][k] = { gebucht: 0, ausgegeben: 0 }; });
    });
    let summeGebucht = 0;
    let barVorOrtFaellig = 0;
    bookings.forEach((b) => {
      const eur = App.toEUR(b.price, b.currency, ratesMap);
      summeGebucht += eur;
      if (b.status === 'vor_ort') barVorOrtFaellig += eur;
      const cat = BOOKING_TYPE_TO_CATEGORY[b.type] || 'sonstiges';
      if (perCountry[b.country]) perCountry[b.country][cat].gebucht += eur;
    });
    let summeAusgegeben = 0;
    expenses.forEach((e) => {
      const eur = e.amountEUR != null ? e.amountEUR : App.toEUR(e.amount, e.currency, ratesMap);
      summeAusgegeben += eur;
      if (perCountry[e.country]) perCountry[e.country][e.category].ausgegeben += eur;
    });
    const flights = bookings.filter((b) => b.type === 'flug').sort((a, b) => (a.dateStart || '').localeCompare(b.dateStart || ''));
    return {
      trip, summeGebucht, summeAusgegeben, barVorOrtFaellig,
      restbudget: (trip.budget || 0) - summeGebucht - summeAusgegeben,
      perCountry, flights,
    };
  },

  async renderOverview(tripId, container) {
    const o = await Trips.computeOverview(tripId);
    const spent = o.summeGebucht + o.summeAusgegeben;
    const pct = o.trip.budget > 0 ? Math.min(100, Math.round((spent / o.trip.budget) * 100)) : 0;
    const over = spent > (o.trip.budget || 0);

    let html = '<div class="card">' +
      '<div class="card-row"><span class="label">Budget</span><span class="value">' + App.formatMoney(o.trip.budget, 'EUR') + '</span></div>' +
      '<div class="card-row"><span class="label">Restbudget</span><span class="value">' + App.formatMoney(o.restbudget, 'EUR') + '</span></div>' +
      '<div class="progress-bar' + (over ? ' over' : '') + '"><span style="width:' + pct + '%"></span></div>' +
      '<div class="card-row"><span class="label">Summe gebucht</span><span class="value">' + App.formatMoney(o.summeGebucht, 'EUR') + '</span></div>' +
      '<div class="card-row"><span class="label">Unterwegs ausgegeben</span><span class="value">' + App.formatMoney(o.summeAusgegeben, 'EUR') + '</span></div>' +
      '<div class="card-row"><span class="label">Bar vor Ort fällig</span><span class="value">' + App.formatMoney(o.barVorOrtFaellig, 'EUR') + '</span></div>' +
      '<p class="field-hint" style="padding:0 2px">Summe aller Buchungen mit Status „Vor Ort zahlen" (nicht aus Ausgaben) – wird unter „Buchungen" beim Anlegen/Bearbeiten gesetzt.</p>' +
      '</div>';

    html += '<div class="section-title">Flüge &amp; Anreise</div><div class="card">';
    if (o.flights.length === 0) {
      html += '<p class="muted mt-0">Keine Flüge erfasst.</p>';
    } else {
      html += o.flights.map((f) =>
        '<div class="card-row"><span class="label">' + App.escapeHtml((f.from || '') + ' → ' + (f.to || '')) +
        '<br><span class="muted">' + App.formatDate(f.dateStart) + (f.timeStart ? ', ' + f.timeStart : '') + '</span></span>' +
        '<span class="value">' + App.formatMoney(f.price, f.currency) + '<br><span class="badge ' + BOOKING_STATUS_BADGE[f.status] + '">' + BOOKING_STATUS_LABELS[f.status] + '</span></span></div>'
      ).join('');
    }
    html += '</div>';

    (o.trip.countries || []).forEach((code) => {
      const cat = o.perCountry[code];
      let gTotal = 0, aTotal = 0;
      let rows = CATEGORY_KEYS.map((k) => {
        gTotal += cat[k].gebucht; aTotal += cat[k].ausgegeben;
        return '<tr><td>' + CATEGORY_LABELS[k] + '</td><td>' + App.formatMoney(cat[k].gebucht, 'EUR') + '</td><td>' + App.formatMoney(cat[k].ausgegeben, 'EUR') + '</td></tr>';
      }).join('');
      html += '<div class="section-title">' + App.escapeHtml(Countries.name(code)) + '</div>' +
        '<div class="card"><table class="cat-table"><thead><tr><th>Kategorie</th><th>Gebucht</th><th>Ausgegeben</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '<tfoot><tr><td>Gesamt</td><td>' + App.formatMoney(gTotal, 'EUR') + '</td><td>' + App.formatMoney(aTotal, 'EUR') + '</td></tr></tfoot>' +
        '</table></div>';
    });

    container.innerHTML = html;
  },

  openEditSheet(trip, prefillCountry) {
    const isNew = !trip;
    const data = trip || { name: '', startDate: App.today(), endDate: App.today(), countries: prefillCountry ? [prefillCountry] : [], budget: 0 };
    let selected = (data.countries || []).slice();

    App.openSheet(isNew ? 'Neuer Trip' : 'Trip bearbeiten', (body) => {
      body.innerHTML =
        '<div class="field"><label>Name</label><input id="f-name" type="text" value="' + App.escapeHtml(data.name) + '" placeholder="z. B. Westafrika"></div>' +
        '<div class="field-row">' +
        '<div class="field"><label>Start</label><input id="f-start" type="date" value="' + data.startDate + '"></div>' +
        '<div class="field"><label>Ende</label><input id="f-end" type="date" value="' + data.endDate + '"></div>' +
        '</div>' +
        '<div class="field"><label>Budget (EUR)</label><input id="f-budget" type="text" inputmode="decimal" value="' + (data.budget || 0).toString().replace('.', ',') + '"></div>' +
        '<div class="field"><label>Länder</label>' +
        '<input id="f-country-search" class="search-input" type="text" placeholder="Land suchen…">' +
        '<div id="f-country-chips" class="chip-select" style="margin-bottom:8px"></div>' +
        '<div id="f-country-list" class="chip-select chip-scroll"></div>' +
        '</div>' +
        (isNew ? '' : '<button class="btn danger" id="f-delete" style="margin-bottom:10px">Trip löschen</button>') +
        '<div class="btn-row"><button class="btn ghost" id="f-cancel">Abbrechen</button><button class="btn primary" id="f-save">Speichern</button></div>';

      const chipsBox = App.qs('#f-country-chips', body);
      const listBox = App.qs('#f-country-list', body);

      function renderChips() {
        chipsBox.innerHTML = selected.map((c) =>
          '<span class="chip selected" data-code="' + c + '">' + Countries.flagEmoji(c) + ' ' + App.escapeHtml(Countries.name(c)) + '<span class="x">✕</span></span>'
        ).join('');
        App.qsa('.chip', chipsBox).forEach((chip) => {
          chip.addEventListener('click', () => {
            selected = selected.filter((c) => c !== chip.dataset.code);
            renderChips(); renderList(App.qs('#f-country-search', body).value);
          });
        });
      }

      function renderList(filter) {
        const f = (filter || '').trim().toLowerCase();
        const codes = Countries.sortedCodes().filter((c) => !selected.includes(c) && (!f || Countries.name(c).toLowerCase().includes(f)));
        const shown = f ? codes : codes.slice(0, 30);
        listBox.innerHTML = shown.map((c) =>
          '<span class="chip" data-code="' + c + '">' + Countries.flagEmoji(c) + ' ' + App.escapeHtml(Countries.name(c)) + '</span>'
        ).join('') + (!f && codes.length > shown.length ? '<span class="chip" style="opacity:.6" id="f-more">… tippen zum Suchen</span>' : '');
        App.qsa('.chip', listBox).forEach((chip) => {
          if (chip.id === 'f-more') return;
          chip.addEventListener('click', () => {
            selected.push(chip.dataset.code);
            renderChips(); renderList(App.qs('#f-country-search', body).value);
          });
        });
      }

      renderChips(); renderList('');
      App.qs('#f-country-search', body).addEventListener('input', (e) => renderList(e.target.value));

      App.qs('#f-cancel', body).addEventListener('click', () => App.closeSheet());
      if (!isNew) {
        App.qs('#f-delete', body).addEventListener('click', async () => {
          if (!confirm('Diesen Trip inkl. aller Buchungen, Ausgaben und Packliste wirklich löschen?')) return;
          await Trips.remove(data.id);
          App.closeSheet();
          App.navigate('#/trips');
          App.toast('Trip gelöscht');
        });
      }
      App.qs('#f-save', body).addEventListener('click', async () => {
        const name = App.qs('#f-name', body).value.trim();
        const startDate = App.qs('#f-start', body).value;
        const endDate = App.qs('#f-end', body).value;
        const budget = App.parseDecimal(App.qs('#f-budget', body).value);
        if (!name) { App.toast('Bitte einen Namen eingeben'); return; }
        if (!startDate || !endDate) { App.toast('Bitte Start- und Enddatum wählen'); return; }
        const saved = await Trips.save({ id: data.id, name, startDate, endDate, budget, countries: selected });
        App.closeSheet();
        App.toast('Gespeichert');
        if (App.refresh) App.refresh();
        if (isNew) App.navigate('#/trip/' + saved.id + '/overview');
      });
    });
  },
};

Views.trips = async function (container, mode) {
  App.setTitle('Trips');
  App.setBack(null);
  App.setTripTabs(null);
  App.setFab(() => Trips.openEditSheet(null), 'Neuer Trip');

  const trips = await Trips.all();
  if (trips.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="big">🧳</div>Noch keine Trips.<br>Tippe auf + für deinen ersten Trip.</div>';
    return;
  }

  mode = mode || 'list';
  const toggleHtml = '<div class="tabline" id="trips-mode"><button data-m="list"' + (mode === 'list' ? ' class="active"' : '') + '>Liste</button>' +
    '<button data-m="year"' + (mode === 'year' ? ' class="active"' : '') + '>Nach Jahr</button></div>';

  if (mode === 'year') {
    container.innerHTML = toggleHtml + '<div id="trips-body">Lädt…</div>';
    await Trips.renderYearOverview(trips, App.qs('#trips-body', container));
  } else {
    container.innerHTML = toggleHtml + '<div id="trips-body">' + Trips.renderList(trips) + '</div>';
    Trips.wireList(App.qs('#trips-body', container));
  }

  App.qsa('#trips-mode button', container).forEach((btn) => {
    btn.addEventListener('click', () => Views.trips(container, btn.dataset.m));
  });
};

Trips.renderYearOverview = async function (trips, container) {
  const groups = {};
  trips.forEach((t) => {
    const year = (t.startDate || '').slice(0, 4) || 'Unbekannt';
    (groups[year] = groups[year] || []).push(t);
  });
  const years = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const cards = await Promise.all(years.map(async (year) => {
    const overviews = await Promise.all(groups[year].map((t) => Trips.computeOverview(t.id)));
    const budget = overviews.reduce((s, o) => s + (o.trip.budget || 0), 0);
    const gebucht = overviews.reduce((s, o) => s + o.summeGebucht, 0);
    const ausgegeben = overviews.reduce((s, o) => s + o.summeAusgegeben, 0);
    const restbudget = budget - gebucht - ausgegeben;
    const tripRows = groups[year].map((t) =>
      '<button class="list-item" data-id="' + t.id + '" style="margin-top:8px">' +
      '<div class="main"><div class="title">' + App.escapeHtml(t.name) + '</div>' +
      '<div class="sub">' + App.formatDateRange(t.startDate, t.endDate) + '</div></div>' +
      '<span class="chev">›</span></button>'
    ).join('');
    return '<div class="section-title">' + App.escapeHtml(year) + ' · ' + groups[year].length + ' Trip' + (groups[year].length === 1 ? '' : 's') + '</div>' +
      '<div class="card">' +
      '<div class="card-row"><span class="label">Budget gesamt</span><span class="value">' + App.formatMoney(budget, 'EUR') + '</span></div>' +
      '<div class="card-row"><span class="label">Restbudget</span><span class="value">' + App.formatMoney(restbudget, 'EUR') + '</span></div>' +
      '<div class="card-row"><span class="label">Summe gebucht</span><span class="value">' + App.formatMoney(gebucht, 'EUR') + '</span></div>' +
      '<div class="card-row"><span class="label">Unterwegs ausgegeben</span><span class="value">' + App.formatMoney(ausgegeben, 'EUR') + '</span></div>' +
      tripRows +
      '</div>';
  }));

  container.innerHTML = cards.join('');
  Trips.wireList(container);
};

Views.tripOverviewEdit = function (trip) {
  Trips.openEditSheet(trip);
};
