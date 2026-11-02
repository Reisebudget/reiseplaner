// Cloud-Sync: der komplette Datenbestand als ein JSON-Paket pro Konto
// (wiederverwendet Backup.exportPayload/die Import-Logik aus backup.js).
const Sync = {
  pushTimer: null,

  async pushNow() {
    if (!Auth.isLoggedIn()) return;
    const user = Auth.currentUser();
    const payload = await Backup.exportPayload();
    const { error } = await Auth.client.from('user_data').upsert({
      id: user.id,
      payload,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  },

  async pullNow() {
    const user = Auth.currentUser();
    const { data, error } = await Auth.client.from('user_data').select('payload').eq('id', user.id).single();
    if (error) throw error;
    await Sync.applyPayload(data.payload);
  },

  // Gleiche Store-Clear-und-Put-Logik wie Backup.importFromFile, nur die Quelle ist die Cloud-Antwort.
  async applyPayload(payload) {
    if (!payload || !payload.data) return;
    DB.setChangeListener(null); // kein Rück-Push beim Einspielen fremder Daten auslösen
    for (const store of DB.ALL_STORES) {
      await DB.clear(store);
      const rows = payload.data[store] || [];
      for (const row of rows) await DB.put(store, row);
    }
    Sync.registerChangeListener();
  },

  scheduleDebouncedPush() {
    if (!Auth.isLoggedIn() || !navigator.onLine) return;
    clearTimeout(Sync.pushTimer);
    Sync.pushTimer = setTimeout(() => {
      Sync.pushNow().catch(() => { /* nächste Änderung stößt automatisch erneut an */ });
    }, 2000);
  },

  registerChangeListener() {
    DB.setChangeListener(() => Sync.scheduleDebouncedPush());
  },
};
