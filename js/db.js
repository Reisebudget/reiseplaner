// IndexedDB-Wrapper. Alle Daten bleiben lokal auf dem Gerät.
const DB = (() => {
  const NAME = 'reiseapp-db';
  const VERSION = 5;
  let dbPromise = null;
  let changeListener = null;

  function setChangeListener(fn) {
    changeListener = fn;
  }

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('trips')) {
          db.createObjectStore('trips', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('bookings')) {
          const s = db.createObjectStore('bookings', { keyPath: 'id' });
          s.createIndex('tripId', 'tripId', { unique: false });
        }
        if (!db.objectStoreNames.contains('packingTemplates')) {
          db.createObjectStore('packingTemplates', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('packingItems')) {
          const s = db.createObjectStore('packingItems', { keyPath: 'id' });
          s.createIndex('tripId', 'tripId', { unique: false });
        }
        if (!db.objectStoreNames.contains('expenses')) {
          const s = db.createObjectStore('expenses', { keyPath: 'id' });
          s.createIndex('tripId', 'tripId', { unique: false });
        }
        if (!db.objectStoreNames.contains('rates')) {
          db.createObjectStore('rates', { keyPath: 'code' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('spots')) {
          const s = db.createObjectStore('spots', { keyPath: 'id' });
          s.createIndex('tripId', 'tripId', { unique: false });
          s.createIndex('country', 'country', { unique: false });
          s.createIndex('status', 'status', { unique: false });
        }
        if (!db.objectStoreNames.contains('spotFolders')) {
          db.createObjectStore('spotFolders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('emergencyItems')) {
          db.createObjectStore('emergencyItems', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('packingSections')) {
          const s = db.createObjectStore('packingSections', { keyPath: 'id' });
          s.createIndex('tripId', 'tripId', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function tx(storeName, mode) {
    const db = await open();
    return db.transaction(storeName, mode).objectStore(storeName);
  }

  function wrap(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function put(storeName, value) {
    const store = await tx(storeName, 'readwrite');
    const result = await wrap(store.put(value));
    if (changeListener) changeListener(storeName);
    return result;
  }

  async function get(storeName, key) {
    const store = await tx(storeName, 'readonly');
    return wrap(store.get(key));
  }

  async function getAll(storeName) {
    const store = await tx(storeName, 'readonly');
    return wrap(store.getAll());
  }

  async function getAllByIndex(storeName, indexName, value) {
    const store = await tx(storeName, 'readonly');
    return wrap(store.index(indexName).getAll(value));
  }

  async function remove(storeName, key) {
    const store = await tx(storeName, 'readwrite');
    const result = await wrap(store.delete(key));
    if (changeListener) changeListener(storeName);
    return result;
  }

  async function clear(storeName) {
    const store = await tx(storeName, 'readwrite');
    return wrap(store.clear());
  }

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  const ALL_STORES = ['trips', 'bookings', 'packingTemplates', 'packingItems', 'expenses', 'rates', 'settings', 'spots', 'spotFolders', 'emergencyItems', 'packingSections'];

  return { open, put, get, getAll, getAllByIndex, remove, clear, uid, ALL_STORES, setChangeListener };
})();
