// Startseite: Weltkarte mit besuchten/geplanten Ländern, Statistik, Vollbild-Zoom.
const MapView = {
  svgText: null,

  async loadSvg() {
    if (MapView.svgText) return MapView.svgText;
    const res = await fetch('assets/world.svg');
    MapView.svgText = await res.text();
    return MapView.svgText;
  },

  colorSvg(svg, status) {
    App.qsa('[data-country]', svg).forEach((el) => {
      const st = status[el.getAttribute('data-country')];
      if (st === 'visited') el.style.fill = 'var(--visited)';
      else if (st === 'planned') el.style.fill = 'var(--planned)';
      else el.style.fill = 'var(--map-default)';
    });
  },

  // Linear equirectangular-ähnliche Projektion, anhand bekannter Länder-
  // Mittelpunkte an diese (leicht kompakte) Kartenvorlage kalibriert.
  latLngToXY(lat, lng) {
    return { x: 7.103 * lng + 1277.14, y: -8.6064 * lat + 774.9 };
  },

  // Stecknadel-Icon (Material "place"), Spitze bei (0,24) in einem 24x24-Raster.
  PIN_PATH: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z',

  removePins(svg) {
    App.qsa('.spot-pin', svg).forEach((el) => el.remove());
  },

  // Nutzt präzise KI-/manuelle Koordinaten, wenn vorhanden, sonst automatisch
  // die Koordinaten des zugeordneten Landes (mit stabilem kleinen Versatz,
  // damit mehrere Ideen im selben Land nicht exakt übereinander liegen).
  effectiveCoords(spot) {
    if (typeof spot.lat === 'number' && typeof spot.lng === 'number') return { lat: spot.lat, lng: spot.lng };
    if (!spot.country) return null;
    const base = Countries.latLng(spot.country);
    if (!base) return null;
    let hash = 0;
    for (let i = 0; i < spot.id.length; i++) hash = (hash * 31 + spot.id.charCodeAt(i)) >>> 0;
    const angle = (hash % 360) * Math.PI / 180;
    const dist = 0.15 + (hash % 100) / 100 * 0.25;
    return { lat: base.lat + Math.sin(angle) * dist, lng: base.lng + Math.cos(angle) * dist };
  },

  renderPins(svg, spots) {
    MapView.removePins(svg);
    const svgNS = 'http://www.w3.org/2000/svg';
    const scale = 1.3;
    spots.forEach((s) => {
      const coords = MapView.effectiveCoords(s);
      if (!coords) return;
      const { x, y } = MapView.latLngToXY(coords.lat, coords.lng);
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', 'spot-pin');
      g.setAttribute('data-spot-id', s.id);

      const hit = document.createElementNS(svgNS, 'circle');
      hit.setAttribute('cx', x);
      hit.setAttribute('cy', y - 12 * scale);
      hit.setAttribute('r', 13 * scale);
      hit.setAttribute('fill', 'transparent');
      g.appendChild(hit);

      const icon = document.createElementNS(svgNS, 'path');
      icon.setAttribute('class', 'spot-pin-icon');
      icon.setAttribute('d', MapView.PIN_PATH);
      icon.setAttribute('fill-rule', 'evenodd');
      icon.setAttribute('transform', 'translate(' + (x - 12 * scale) + ',' + (y - 24 * scale) + ') scale(' + scale + ')');
      g.appendChild(icon);

      svg.appendChild(g);
    });
  },
};

Views.map = async function (container) {
  App.setTitle('Reiseplaner');
  App.setBack(null);
  App.setTripTabs(null);
  App.setFab(() => Trips.openEditSheet(null), 'Neuer Trip');

  container.innerHTML =
    '<div class="map-wrap">' +
    '<div id="map-svg-holder"></div>' +
    '<button class="map-expand-btn" id="map-expand" aria-label="Karte vollständig anzeigen">⤢</button>' +
    '<div class="map-legend">' +
    '<span><span class="dot" style="background:var(--visited)"></span>Besucht</span>' +
    '<span><span class="dot" style="background:var(--planned)"></span>Geplant</span>' +
    '<span><span class="dot" style="background:var(--map-default)"></span>Noch nicht</span>' +
    '</div></div>' +
    '<div id="map-country-info"></div>' +
    '<div class="stat-row" id="map-stats"></div>' +
    '<div class="section-title">Nach Kontinent</div>' +
    '<div class="continent-grid" id="map-continents"></div>' +
    '<div class="section-title">Alle Trips</div>' +
    '<div id="map-trip-list"></div>';

  const [svgText, trips, manualVisited, spots] = await Promise.all([MapView.loadSvg(), Trips.all(), Trips.getManualVisited(), Spots.all()]);

  const holder = App.qs('#map-svg-holder', container);
  holder.innerHTML = svgText;
  const svg = holder.querySelector('svg');
  let status = Trips.countryStatusMap(trips, manualVisited);
  MapView.colorSvg(svg, status);

  const infoBox = App.qs('#map-country-info', container);

  function refreshAll() {
    status = Trips.countryStatusMap(trips, manualVisited);
    MapView.colorSvg(svg, status);
    renderStats();
    renderContinents();
  }

  function showSpotInfo(spotId) {
    const spot = spots.find((s) => s.id === spotId);
    if (!spot) return;
    Spots.openEditSheet(spot, { trips, onChange: () => App.refresh() });
  }

  function renderStats() {
    const unCodes = Countries.unCodes();
    const total = unCodes.length;
    const visited = unCodes.filter((c) => status[c] === 'visited').length;
    const planned = unCodes.filter((c) => status[c] === 'planned').length;
    App.qs('#map-stats', container).innerHTML =
      '<div class="stat-tile visited"><div class="num">' + visited + '</div><div class="lbl">besucht von ' + total + '</div></div>' +
      '<div class="stat-tile planned"><div class="num">' + planned + '</div><div class="lbl">geplant von ' + total + '</div></div>';
  }

  function renderContinents() {
    App.qs('#map-continents', container).innerHTML = CONTINENTS.map((c) => {
      const codes = Countries.codesByContinent(c.key, true);
      const visited = codes.filter((code) => status[code] === 'visited').length;
      const pct = codes.length ? Math.round((visited / codes.length) * 100) : 0;
      return '<button class="continent-card" data-continent="' + c.key + '">' +
        '<div class="name">' + c.label + '</div>' +
        '<div class="frac">' + visited + ' von ' + codes.length + ' besucht</div>' +
        '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>' +
        '</button>';
    }).join('');
    App.qsa('[data-continent]', container).forEach((btn) => {
      btn.addEventListener('click', () => openContinentSheet(btn.dataset.continent));
    });
  }

  function openContinentSheet(key) {
    const label = CONTINENTS.find((c) => c.key === key).label;
    const codes = Countries.codesByContinent(key, true).sort((a, b) => Countries.name(a).localeCompare(Countries.name(b), 'de'));
    App.openSheet(label, (body) => {
      body.innerHTML = codes.map((code) => {
        const st = status[code];
        const soft = st === 'visited' ? 'var(--success-soft)' : st === 'planned' ? 'var(--accent-soft)' : 'var(--bg-sunken)';
        const label = st === 'visited' ? 'Besucht' : st === 'planned' ? 'Geplant' : 'Noch nicht besucht';
        return '<button class="list-item" data-code="' + code + '">' +
          '<div class="country-flag-box" style="background:' + soft + '">' + Countries.flagEmoji(code) + '</div>' +
          '<div class="main"><div class="title">' + App.escapeHtml(Countries.name(code)) + '</div><div class="sub">' + label + '</div></div>' +
          '<span class="chev">›</span></button>';
      }).join('');
      App.qsa('[data-code]', body).forEach((btn) => {
        btn.addEventListener('click', () => {
          App.closeSheet();
          showCountryInfo(btn.dataset.code);
        });
      });
    });
  }

  function showCountryInfo(code) {
    const name = Countries.name(code);
    const related = Trips.tripsForCountry(trips, code);
    const isManual = manualVisited.includes(code);
    const facts = Countries.facts(code);
    const emergency = Countries.emergency(code);
    const embassy = Countries.embassyDe(code);
    let html = '<div class="card"><h3>' + Countries.flagEmoji(code) + ' ' + App.escapeHtml(name) + '</h3>';
    if (facts) {
      html += '<div class="card-row"><span class="label">Hauptstadt</span><span class="value">' + App.escapeHtml(facts.capital) + '</span></div>' +
        '<div class="card-row"><span class="label">Einwohner</span><span class="value">' + Countries.formatPopulation(facts.population) + '</span></div>' +
        '<div class="card-row"><span class="label">Sprache</span><span class="value">' + App.escapeHtml(facts.language) + '</span></div>';
    }
    html += '<div class="card-row"><span class="label">Notruf</span><span class="value">' + (emergency ? App.escapeHtml(emergency) : 'Noch nicht hinterlegt') + '</span></div>';
    html += '<div class="section-title" style="margin:14px 0 6px">Deutsche Botschaft/Konsulat</div>';
    if (embassy) {
      html += '<p class="muted mt-0">' + App.escapeHtml(embassy.name) + '<br>' + App.escapeHtml(embassy.address) +
        (embassy.phone ? '<br>Tel. ' + App.escapeHtml(embassy.phone) : '') + (embassy.note ? '<br>' + App.escapeHtml(embassy.note) : '') + '</p>';
    } else {
      html += '<p class="muted mt-0">Noch nicht hinterlegt. Aktuelle Adresse/Nummer auf der Seite des <a href="https://www.auswaertiges-amt.de/de/aussenpolitik/laender" target="_blank" rel="noopener">Auswärtigen Amts</a> nachsehen.</p>';
    }
    if (related.length === 0) {
      html += '<p class="muted mt-0">Noch kein Trip für dieses Land angelegt.</p>' +
        '<button class="btn primary" id="map-add-trip">Trip anlegen</button>';
    } else {
      html += related.map((t) =>
        '<button class="list-item" data-id="' + t.id + '" style="margin-top:8px">' +
        '<div class="main"><div class="title">' + App.escapeHtml(t.name) + '</div>' +
        '<div class="sub">' + App.formatDateRange(t.startDate, t.endDate) + '</div></div>' +
        '<span class="chev">›</span></button>'
      ).join('');
    }
    html += '<button class="visited-toggle' + (isManual ? ' on' : '') + '" id="map-toggle-visited">' +
      (isManual ? '✓ Als bereist markiert' : '○ Als bereist markieren (ohne Trip)') + '</button>' +
      '</div>';
    infoBox.innerHTML = html;

    if (related.length === 0) {
      App.qs('#map-add-trip', infoBox).addEventListener('click', () => Trips.openEditSheet(null, code));
    } else {
      App.qsa('[data-id]', infoBox).forEach((btn) => {
        btn.addEventListener('click', () => App.navigate('#/trip/' + btn.dataset.id + '/overview'));
      });
    }
    App.qs('#map-toggle-visited', infoBox).addEventListener('click', async () => {
      const list = await Trips.toggleManualVisited(code);
      manualVisited.length = 0;
      manualVisited.push(...list);
      refreshAll();
      showCountryInfo(code);
    });
    infoBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  svg.addEventListener('click', (e) => {
    const pin = e.target.closest('[data-spot-id]');
    if (pin) { showSpotInfo(pin.getAttribute('data-spot-id')); return; }
    const el = e.target.closest('[data-country]');
    if (!el) return;
    showCountryInfo(el.getAttribute('data-country'));
  });

  renderStats();
  renderContinents();

  const listBox = App.qs('#map-trip-list', container);
  if (trips.length === 0) {
    listBox.innerHTML = '<div class="empty-state"><div class="big">🌍</div>Noch keine Trips angelegt.</div>';
  } else {
    listBox.innerHTML = Trips.renderList(trips);
    Trips.wireList(listBox);
  }

  App.qs('#map-expand', container).addEventListener('click', () => {
    openFullscreenMap(svgText, status, spots, (code) => {
      showCountryInfo(code);
    }, (spotId) => {
      showSpotInfo(spotId);
    });
  });
};

function openFullscreenMap(svgText, status, spots, onSelectCountry, onSelectSpot) {
  const overlay = document.createElement('div');
  overlay.className = 'map-fullscreen';
  overlay.innerHTML =
    '<div class="map-fullscreen-header">' +
    '<button class="icon-btn" id="mf-close" aria-label="Schließen">✕</button>' +
    '<h2>Weltkarte</h2>' +
    '<button class="icon-btn" id="mf-reset" aria-label="Zoom zurücksetzen">⟲</button>' +
    '</div>' +
    '<div class="map-fullscreen-stage" id="mf-stage">' +
    '<div class="zoom-layer" id="mf-layer"></div>' +
    '<div class="map-fullscreen-hint">Zum Zoomen zwei Finger nutzen · Doppeltipp setzt zurück · 📍 = Idee</div>' +
    '</div>' +
    '<div class="map-fullscreen-info" id="mf-info" hidden></div>';
  document.body.appendChild(overlay);

  const layer = overlay.querySelector('#mf-layer');
  layer.innerHTML = svgText;
  const svg = layer.querySelector('svg');
  MapView.colorSvg(svg, status);
  MapView.renderPins(svg, spots);

  const stage = overlay.querySelector('#mf-stage');
  const info = overlay.querySelector('#mf-info');
  const zoom = createZoomPan(stage, layer, (clientX, clientY) => {
    const el = document.elementFromPoint(clientX, clientY);
    const pinTarget = el && el.closest && el.closest('[data-spot-id]');
    if (pinTarget) {
      const spotId = pinTarget.getAttribute('data-spot-id');
      const spot = spots.find((s) => s.id === spotId);
      info.hidden = false;
      info.innerHTML = '<div class="card-row"><span class="label">💡 ' + App.escapeHtml(spot ? spot.title : 'Idee') + '</span>' +
        '<button class="btn small" id="mf-open">Details</button></div>';
      overlay.querySelector('#mf-open').addEventListener('click', () => {
        document.body.removeChild(overlay);
        onSelectSpot(spotId);
      });
      return;
    }
    const target = el && el.closest && el.closest('[data-country]');
    if (target) {
      info.hidden = false;
      const code = target.getAttribute('data-country');
      info.innerHTML = '<div class="card-row"><span class="label">' + App.escapeHtml(Countries.name(code)) + '</span>' +
        '<button class="btn small" id="mf-open">Details</button></div>';
      overlay.querySelector('#mf-open').addEventListener('click', () => {
        document.body.removeChild(overlay);
        onSelectCountry(code);
      });
    }
  });

  overlay.querySelector('#mf-close').addEventListener('click', () => document.body.removeChild(overlay));
  overlay.querySelector('#mf-reset').addEventListener('click', () => zoom.reset());
}

function createZoomPan(stage, layer, onTap) {
  let scale = 1, x = 0, y = 0;
  const pointers = new Map();
  let pinch = null;
  let pan = null;
  let lastTapTime = 0;
  let moved = 0;

  function apply() {
    layer.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
  }

  function clamp() {
    const rect = stage.getBoundingClientRect();
    const maxX = Math.max(0, (rect.width * (scale - 1)) / 2 + rect.width * 0.2);
    const maxY = Math.max(0, (rect.height * (scale - 1)) / 2 + rect.height * 0.2);
    x = Math.min(maxX, Math.max(-maxX, x));
    y = Math.min(maxY, Math.max(-maxY, y));
  }

  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  stage.addEventListener('pointerdown', (e) => {
    try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore: tracking still works via the pointers map */ }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = 0;
    if (pointers.size === 2) {
      const [p1, p2] = Array.from(pointers.values());
      pinch = { startDist: dist(p1, p2), startScale: scale };
      pan = null;
    } else if (pointers.size === 1) {
      pan = { lastX: e.clientX, lastY: e.clientY };
    }
  });

  stage.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinch) {
      const [p1, p2] = Array.from(pointers.values());
      const d = dist(p1, p2);
      scale = Math.min(6, Math.max(1, pinch.startScale * (d / pinch.startDist)));
      clamp();
      apply();
      moved += 10;
    } else if (pointers.size === 1 && pan) {
      const dx = e.clientX - pan.lastX;
      const dy = e.clientY - pan.lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (scale > 1) {
        x += dx; y += dy;
        clamp();
        apply();
      }
      pan.lastX = e.clientX; pan.lastY = e.clientY;
    }
  });

  function endPointer(e) {
    const wasSingle = pointers.size === 1;
    const p = pointers.get(e.pointerId);
    pointers.delete(e.pointerId);
    if (wasSingle && p && moved < 8) {
      const now = Date.now();
      if (now - lastTapTime < 320) {
        scale = 1; x = 0; y = 0; apply();
      } else {
        onTap(p.x, p.y);
      }
      lastTapTime = now;
    }
    if (pointers.size === 1) {
      const [rem] = Array.from(pointers.values());
      pan = { lastX: rem.x, lastY: rem.y };
      pinch = null;
    } else if (pointers.size === 0) {
      pan = null; pinch = null;
    }
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  return {
    reset() { scale = 1; x = 0; y = 0; apply(); },
  };
}
