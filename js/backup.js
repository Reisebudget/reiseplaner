// Backup: Export/Import aller Daten als JSON-Datei.
const Backup = {
  async exportPayload() {
    const data = {};
    for (const store of DB.ALL_STORES) {
      data[store] = await DB.getAll(store);
    }
    return { app: 'reiseplaner', version: 1, exportedAt: new Date().toISOString(), data };
  },

  async downloadExport() {
    const payload = await Backup.exportPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = 'reiseplaner-backup-' + stamp + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },

  async importFromFile(file) {
    const text = await file.text();
    const payload = JSON.parse(text);
    if (!payload || !payload.data || payload.app !== 'reiseplaner') {
      throw new Error('Diese Datei sieht nicht nach einem Reiseplaner-Backup aus.');
    }
    for (const store of DB.ALL_STORES) {
      await DB.clear(store);
      const rows = payload.data[store] || [];
      for (const row of rows) await DB.put(store, row);
    }
  },
};
