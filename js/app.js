// Router, Theme, Einstellungen, App-Initialisierung.
Views.settings = async function (container) {
  App.setTitle('Einstellungen');
  App.setBack(null);
  App.setTripTabs(null);
  App.setFab(null);

  const themeRow = await DB.get('settings', 'theme');
  const theme = (themeRow && themeRow.value) || 'system';
  const trips = await Trips.all();
  const relevantCurrencies = Array.from(new Set(['EUR', ...trips.flatMap((t) => (t.countries || []).map((c) => Countries.currency(c)))]));
  const rateRows = await Rates.getAll();
  const rateMap = {};
  rateRows.forEach((r) => { rateMap[r.code] = r; });

  const appUrl = (await DB.get('settings', 'appUrl'));
  const apiKeyRow = await DB.get('settings', 'claudeApiKey');
  const extraPinned = await App.extraPinnedCurrencies();

  container.innerHTML =
    '<div class="section-title">Darstellung</div>' +
    '<div class="card"><div class="tabline" id="s-theme">' +
    '<button data-v="light">Hell</button><button data-v="dark">Dunkel</button><button data-v="system">System</button>' +
    '</div></div>' +

    '<div class="section-title">Bedienungshilfen</div>' +
    '<div class="card">' +
    '<p class="muted mt-0">EUR ist immer angepinnt und steht überall zuoberst. Weitere Währungen, die du oft brauchst, kannst du hier zusätzlich anpinnen.</p>' +
    '<div class="chip-select" id="s-pinned-currencies" style="margin-bottom:10px"></div>' +
    '<button class="btn" id="s-pin-currency">+ Währung anpinnen</button>' +
    '</div>' +

    '<div class="section-title">Spot-Sammlung</div>' +
    '<div class="card">' +
    '<div class="field"><label>App-Adresse (für Teilen aus TikTok &amp; Co.)</label>' +
    '<input id="s-app-url" type="url" placeholder="https://dein-name.github.io/reise-app/" value="' + App.escapeHtml((appUrl && appUrl.value) || '') + '"></div>' +
    '<p class="field-hint mt-0">Trag hier die Adresse ein, unter der die App später auf GitHub Pages erreichbar ist (inkl. <code>index.html</code>, falls nötig).</p>' +
    '<div class="field"><label>Claude API-Schlüssel (optional, für KI-Vorschläge)</label>' +
    '<input id="s-claude-key" type="password" placeholder="sk-ant-…" value="' + App.escapeHtml((apiKeyRow && apiKeyRow.value) || '') + '" autocomplete="off"></div>' +
    '<p class="field-hint mt-0">Bleibt ausschließlich auf diesem Gerät gespeichert. Ohne Schlüssel funktionieren Link-Speichern, oEmbed und Texterkennung trotzdem.</p>' +
    '<button class="btn" id="s-save-spot-settings" style="margin-top:6px">Speichern</button>' +
    '</div>' +

    '<div class="section-title">iOS-Kurzbefehl einrichten</div>' +
    '<div class="card" id="s-shortcut-guide"></div>' +

    '<div class="section-title">Wechselkurse</div>' +
    '<div class="card">' +
    '<p class="muted mt-0">Einheiten Fremdwährung pro 1 EUR. Beim Erfassen einer Ausgabe wird der aktuelle Kurs automatisch gespeichert.</p>' +
    '<button class="btn primary" id="s-rates-update" style="margin-bottom:12px">Kurse online aktualisieren</button>' +
    '<div id="s-rates-list"></div>' +
    '<input id="s-rates-search" class="search-input" type="text" placeholder="Weitere Währung suchen (z. B. USD)…" style="margin-top:10px">' +
    '<div id="s-rates-search-results"></div>' +
    '</div>' +

    '<div class="section-title">Backup</div>' +
    '<div class="card">' +
    '<p class="muted mt-0">Sichere alle Daten als Datei oder spiele ein Backup zurück.</p>' +
    '<div class="btn-row" style="margin-top:0">' +
    '<button class="btn" id="s-export">Exportieren</button>' +
    '<button class="btn" id="s-import">Importieren</button>' +
    '</div>' +
    '<input id="s-import-file" type="file" accept="application/json" hidden>' +
    '</div>' +

    '<p class="muted center" style="margin-top:24px">Alle Daten bleiben ausschließlich auf diesem Gerät.</p>';

  App.qsa('#s-theme button', container).forEach((btn) => {
    if (btn.dataset.v === theme) btn.classList.add('active');
    btn.addEventListener('click', async () => {
      await DB.put('settings', { key: 'theme', value: btn.dataset.v });
      App.applyTheme(btn.dataset.v);
      App.qsa('#s-theme button', container).forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  function renderPinnedCurrencies() {
    const box = App.qs('#s-pinned-currencies', container);
    box.innerHTML = '<span class="chip selected">📌 EUR</span>' +
      extraPinned.map((c) => '<span class="chip selected" data-unpin="' + c + '">📌 ' + c + '<span class="x">✕</span></span>').join('');
    App.qsa('[data-unpin]', box).forEach((chip) => {
      chip.addEventListener('click', async () => {
        const list = await App.toggleExtraPinnedCurrency(chip.dataset.unpin);
        extraPinned.length = 0; extraPinned.push(...list);
        renderPinnedCurrencies();
      });
    });
  }
  renderPinnedCurrencies();
  App.qs('#s-pin-currency', container).addEventListener('click', () => {
    App.openCurrencyPickerSheet({
      title: 'Währung anpinnen',
      onSelect: async (code) => {
        const list = await App.toggleExtraPinnedCurrency(code);
        extraPinned.length = 0; extraPinned.push(...list);
        renderPinnedCurrencies();
      },
    });
  });

  function renderShortcutGuide() {
    const url = App.qs('#s-app-url', container).value.trim().replace(/\/$/, '');
    const base = url || 'https://dein-name.github.io/reise-app';
    App.qs('#s-shortcut-guide', container).innerHTML =
      '<ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.7">' +
      '<li>Öffne die <b>Kurzbefehle</b>-App → tippe oben rechts auf <b>+</b> für einen neuen Kurzbefehl.</li>' +
      '<li>Benenne ihn <b>„In Reisekasse speichern"</b> (oben auf den Namen tippen).</li>' +
      '<li>Tippe auf das <b>(i)</b>-Symbol, aktiviere <b>„Im Teilen-Sheet anzeigen"</b> und wähle bei „Akzeptiert" <b>URLs</b> und <b>Text</b> aus.</li>' +
      '<li>Füge die Aktion <b>„URL codieren"</b> hinzu. Als Eingabe die <b>Kurzbefehl-Eingabe</b> wählen.</li>' +
      '<li>Füge die Aktion <b>„Text"</b> hinzu, tippe hinein:<br>' +
      '<code style="display:block;background:var(--bg-sunken);padding:8px 10px;border-radius:8px;margin:4px 0;word-break:break-all">' + App.escapeHtml(base + '?spot=') + '</code>' +
      'und füge direkt danach (Cursor ans Ende) die Variable <b>„Codierte URL"</b> aus Schritt 4 ein.</li>' +
      '<li>Füge zuletzt die Aktion <b>„URLs öffnen"</b> hinzu, Eingabe = der Text aus Schritt 5.</li>' +
      '<li>Fertig. Zum Testen: In TikTok bei einem Video auf <b>Teilen</b> → <b>Mehr</b> → <b>„In Reisekasse speichern"</b> aktivieren.</li>' +
      '</ol>' +
      (url ? '' : '<p class="field-hint" style="margin-top:10px">Trag oben zuerst deine App-Adresse ein, dann zeigt Schritt 5 genau den richtigen Text.</p>');
  }
  renderShortcutGuide();
  App.qs('#s-app-url', container).addEventListener('input', renderShortcutGuide);

  App.qs('#s-save-spot-settings', container).addEventListener('click', async () => {
    const url = App.qs('#s-app-url', container).value.trim();
    const key = App.qs('#s-claude-key', container).value.trim();
    await DB.put('settings', { key: 'appUrl', value: url });
    await DB.put('settings', { key: 'claudeApiKey', value: key });
    App.toast('Gespeichert');
  });

  function renderRateRow(code) {
    const rec = rateMap[code] || { rate: DEFAULT_RATES[code] || 1, source: 'default' };
    return '<div class="field-row" data-rate-row="' + code + '" style="align-items:flex-end">' +
      '<div class="field" style="margin-bottom:10px;flex:none;width:70px"><label>' + code + '</label>' +
      '<input disabled value="' + code + '" style="text-align:center;padding:10px 4px"></div>' +
      '<div class="field" style="margin-bottom:10px"><input type="text" inputmode="decimal" class="rate-input" data-code="' + code + '" value="' + Number(rec.rate).toString().replace('.', ',') + '"></div>' +
      '</div>';
  }

  const ratesList = App.qs('#s-rates-list', container);
  ratesList.innerHTML = relevantCurrencies.map(renderRateRow).join('');
  wireRateInputs(ratesList);

  function wireRateInputs(scope) {
    App.qsa('.rate-input', scope).forEach((input) => {
      input.addEventListener('change', async () => {
        const value = App.parseDecimal(input.value);
        if (!value) { App.toast('Ungültiger Kurs'); return; }
        await Rates.setManual(input.dataset.code, value);
        App.toast('Kurs für ' + input.dataset.code + ' gespeichert');
      });
    });
  }

  App.qs('#s-rates-update', container).addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = 'Aktualisiere…';
    try {
      const result = await Rates.fetchFromApi();
      App.toast(result.count + ' Kurse aktualisiert');
      Views.settings(container);
    } catch (err) {
      App.toast('Keine Verbindung – Kurse unverändert');
      btn.disabled = false;
      btn.textContent = 'Kurse online aktualisieren';
    }
  });

  const searchResults = App.qs('#s-rates-search-results', container);
  App.qs('#s-rates-search', container).addEventListener('input', (e) => {
    const f = e.target.value.trim().toUpperCase();
    if (!f) { searchResults.innerHTML = ''; return; }
    const matches = Object.keys(DEFAULT_RATES).filter((c) => c.includes(f) && !relevantCurrencies.includes(c)).slice(0, 8);
    searchResults.innerHTML = matches.map(renderRateRow).join('');
    wireRateInputs(searchResults);
  });

  App.qs('#s-export', container).addEventListener('click', async () => {
    await Backup.downloadExport();
    App.toast('Export gestartet');
  });
  App.qs('#s-import', container).addEventListener('click', () => App.qs('#s-import-file', container).click());
  App.qs('#s-import-file', container).addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!confirm('Import ersetzt ALLE aktuell gespeicherten Daten. Fortfahren?')) { e.target.value = ''; return; }
    try {
      await Backup.importFromFile(file);
      App.toast('Import erfolgreich');
      App.navigate('#/map');
      App.refresh();
    } catch (err) {
      App.toast('Import fehlgeschlagen: ' + err.message);
    }
    e.target.value = '';
  });
};

App.applyTheme = function (mode) {
  if (mode === 'light' || mode === 'dark') {
    document.documentElement.setAttribute('data-theme', mode);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

async function renderTripDetail(trip, sub, view) {
  App.setBack('#/trips');
  App.setTitle(trip.name);
  const tabs = [
    { key: 'overview', label: 'Übersicht', hash: '#/trip/' + trip.id + '/overview' },
    { key: 'bookings', label: 'Buchungen', hash: '#/trip/' + trip.id + '/bookings' },
    { key: 'packing', label: 'Packliste', hash: '#/trip/' + trip.id + '/packing' },
    { key: 'expenses', label: 'Ausgaben', hash: '#/trip/' + trip.id + '/expenses' },
  ];
  App.setTripTabs(tabs, sub);

  if (sub === 'bookings') {
    App.setFab(() => Bookings.openEditSheet(trip, null), 'Neue Buchung', '+');
    await Bookings.render(trip, view);
  } else if (sub === 'packing') {
    App.setFab(null);
    await Packing.render(trip, view);
  } else if (sub === 'expenses') {
    App.setFab(null);
    await Expenses.render(trip, view);
  } else {
    App.setFab(() => Trips.openEditSheet(trip), 'Trip bearbeiten', '✎');
    await Trips.renderOverview(trip.id, view);
  }
}

function updateBottomNav(key) {
  const activeKey = key === 'trip' ? 'trips' : key;
  App.qsa('.bottom-nav a').forEach((a) => a.classList.toggle('active', a.dataset.route === activeKey));
}

async function route() {
  App.closeAllSheets();
  const hash = location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);
  const view = document.getElementById('view');
  view.scrollTop = 0;
  window.scrollTo(0, 0);
  updateBottomNav(parts[0] || 'map');

  if (parts[0] === 'trip' && parts[1]) {
    const trip = await Trips.get(parts[1]);
    if (!trip) { App.navigate('#/trips'); return; }
    await renderTripDetail(trip, parts[2] || 'overview', view);
    return;
  }

  App.setTripTabs(null);
  if (parts[0] === 'trips') await Views.trips(view);
  else if (parts[0] === 'spots') await Views.spots(view);
  else if (parts[0] === 'settings') await Views.settings(view);
  else await Views.map(view);
}
App.refresh = route;

(async function init() {
  await Promise.all([Rates.ensureSeeded()]);
  await Seed.run();

  const themeRow = await DB.get('settings', 'theme');
  App.applyTheme((themeRow && themeRow.value) || 'system');

  document.getElementById('btn-theme').addEventListener('click', async () => {
    const row = await DB.get('settings', 'theme');
    const current = (row && row.value) || 'system';
    const next = { system: 'light', light: 'dark', dark: 'system' }[current];
    await DB.put('settings', { key: 'theme', value: next });
    App.applyTheme(next);
    if (location.hash.startsWith('#/settings')) App.refresh();
  });

  const sharedUrl = new URLSearchParams(location.search).get('spot');
  let newSpot = null;
  if (sharedUrl) {
    history.replaceState(null, '', location.pathname + location.hash);
    newSpot = await Spots.createFromUrl(sharedUrl);
    location.hash = '#/spots';
  } else if (!location.hash) {
    location.hash = '#/map';
  }

  await route();
  window.addEventListener('hashchange', route);

  if (newSpot) {
    if (navigator.onLine) {
      App.toast('Spot gespeichert – wird angereichert…');
      try {
        const updated = await Spots.enrich(newSpot);
        Spots.openEditSheet(updated, { onChange: App.refresh, isNew: true });
      } catch (e) {
        App.toast('Spot gespeichert (Anreicherung fehlgeschlagen)');
        Spots.openEditSheet(newSpot, { onChange: App.refresh, isNew: true });
      }
    } else {
      App.toast('Spot offline gespeichert – wird später angereichert');
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
