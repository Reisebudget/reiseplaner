// Wechselkurse: Einheiten Fremdwährung pro 1 EUR. Offline-Startwerte,
// überschreibbar per Hand oder per Online-Abruf (open.er-api.com, kein Key).
const DEFAULT_RATES = {
  EUR: 1,
  USD: 1.09, GBP: 0.84, CHF: 0.94, JPY: 172, CNY: 7.85, INR: 91,
  AUD: 1.65, CAD: 1.49, NZD: 1.78, SEK: 11.3, NOK: 11.7, DKK: 7.46,
  PLN: 4.28, CZK: 25.2, HUF: 392, RON: 4.97, BGN: 1.9558, ISK: 142,
  RUB: 95, TRY: 39, ILS: 4.0, AED: 4.0, SAR: 4.09, QAR: 3.97,
  KWD: 0.335, BHD: 0.411, OMR: 0.42, JOD: 0.773, EGP: 53, MAD: 10.9,
  TND: 3.4, DZD: 146, LYD: 5.3, ZAR: 20.5, NGN: 1700, KES: 141,
  GHS: 16, XOF: 655.957, XAF: 655.957, XPF: 119.331, THB: 38.5,
  VND: 27500, IDR: 17200, MYR: 4.9, SGD: 1.46, PHP: 62, KRW: 1550,
  PKR: 305, BDT: 132, LKR: 325, NPR: 146, MMK: 2290, KHR: 4400,
  LAK: 23500, MNT: 3800, BRL: 6.0, ARS: 1550, CLP: 1030, COP: 4550,
  PEN: 4.1, MXN: 21.8, UYU: 45, PYG: 8500, BOB: 7.55, GTQ: 8.4,
  HNL: 27.5, NIO: 40, CRC: 555, PAB: 1.09, DOP: 65, JMD: 172,
  TTD: 7.4, BBD: 2.18, BSD: 1.09, BZD: 2.18, XCD: 2.94, HTG: 144,
  CUP: 26, GYD: 228, SRD: 39, VES: 65, AOA: 990, MZN: 69.6,
  ZMW: 29, MWK: 1890, TZS: 2850, UGX: 4000, RWF: 1520, BIF: 3200,
  ETB: 137, SDG: 655, SSP: 4500, SOS: 620, DJF: 194, ERN: 16.3,
  KMF: 491.9678, MGA: 5000, MUR: 50, SCR: 15.5, MVR: 16.8, BTN: 94,
  PGK: 4.4, FJD: 2.47, SBD: 9.2, VUV: 130, TOP: 2.63, WST: 3.0,
  GEL: 3.0, AMD: 425, AZN: 1.85, KZT: 580, UZS: 14000, TJS: 11.9,
  TMT: 3.82, KGS: 95, MDL: 19.7, UAH: 45, BYN: 3.9, ALL: 103,
  MKD: 61.5, RSD: 117.2, BAM: 1.9558, GIP: 0.84, FKP: 0.84, SHP: 0.84,
  ANG: 1.95, AWG: 1.96, KYD: 0.91, BMD: 1.09, BND: 1.46, STN: 24.5,
  CVE: 110.265, GMD: 76, GNF: 9400, SLE: 24.9, LRD: 218, MRU: 43.3,
  ZWL: 30, KPW: 150, IRR: 45000, IQD: 1430, LBP: 97500, SYP: 13500,
  YER: 270,
};

const Rates = {
  async ensureSeeded() {
    const existing = await DB.getAll('rates');
    if (existing.length > 0) return;
    const now = new Date().toISOString();
    for (const code of Object.keys(DEFAULT_RATES)) {
      await DB.put('rates', { code, rate: DEFAULT_RATES[code], updatedAt: now, source: 'default' });
    }
  },

  async getAll() {
    return DB.getAll('rates');
  },

  async get(code) {
    const rec = await DB.get('rates', code);
    if (rec) return rec;
    return { code, rate: DEFAULT_RATES[code] || 1, updatedAt: null, source: 'default' };
  },

  async setManual(code, rate) {
    await DB.put('rates', { code, rate: Number(rate), updatedAt: new Date().toISOString(), source: 'manual' });
  },

  async fetchFromApi() {
    const res = await fetch('https://open.er-api.com/v6/latest/EUR');
    if (!res.ok) throw new Error('Netzwerkfehler (' + res.status + ')');
    const data = await res.json();
    if (data.result !== 'success' || !data.rates) throw new Error('Unerwartete Antwort der API');
    const now = new Date().toISOString();
    const codes = Object.keys(data.rates);
    for (const code of codes) {
      await DB.put('rates', { code, rate: data.rates[code], updatedAt: now, source: 'api' });
    }
    return { count: codes.length, updatedAt: now };
  },
};
