// Konto-Login über Supabase: E-Mail + Benutzername, Verifizierungscode per Mail.
// Gast-Modus bleibt der Normalfall; ein Konto ist komplett optional.
const Auth = {
  SUPABASE_URL: 'https://sqjoefegendxafurybvy.supabase.co',
  SUPABASE_KEY: 'sb_publishable_XNJGiqWdRMhjx2lxSF4-Uw_k6vTlMmP',
  client: null,
  session: null,

  init() {
    if (!window.supabase) return null; // Vendor-Datei nicht geladen (z. B. ganz erster Start offline)
    Auth.client = window.supabase.createClient(Auth.SUPABASE_URL, Auth.SUPABASE_KEY);
    return Auth.client;
  },

  async restoreSession() {
    if (!Auth.client) return null;
    try {
      const { data } = await Auth.client.auth.getSession();
      Auth.session = (data && data.session) || null;
    } catch (e) {
      Auth.session = null;
    }
    return Auth.session;
  },

  isLoggedIn() {
    return !!Auth.session;
  },

  currentUser() {
    return Auth.session ? Auth.session.user : null;
  },

  username() {
    const user = Auth.currentUser();
    if (!user) return '';
    return (user.user_metadata && user.user_metadata.username) || user.email || '';
  },

  async requestCode(email, username) {
    if (!Auth.client) throw new Error('Kein Internet – Konto-Login gerade nicht verfügbar');
    const { error } = await Auth.client.auth.signInWithOtp({
      email,
      options: { data: { username: username || '' }, shouldCreateUser: true },
    });
    if (error) throw error;
  },

  // Nach Code-Eingabe: verifiziert, entscheidet Hochladen (neues Konto/Gerät) vs.
  // Herunterladen (Konto hat bereits Cloud-Daten) und setzt die Session.
  async verifyCode(email, code) {
    if (!Auth.client) throw new Error('Kein Internet – Konto-Login gerade nicht verfügbar');
    const { data, error } = await Auth.client.auth.verifyOtp({ email, token: code, type: 'email' });
    if (error) throw error;
    Auth.session = data.session;
    const user = data.user;

    const { data: existing } = await Auth.client.from('user_data').select('updated_at').eq('id', user.id).maybeSingle();

    if (!existing) {
      await Sync.pushNow();
      Sync.registerChangeListener();
      return { status: 'uploaded' };
    }

    const confirmed = confirm('Dieses Konto hat bereits gespeicherte Daten. Deine lokalen Gast-Daten werden dadurch ersetzt. Fortfahren?');
    if (!confirmed) {
      await Auth.client.auth.signOut();
      Auth.session = null;
      return { status: 'cancelled' };
    }
    await Sync.pullNow();
    Sync.registerChangeListener();
    return { status: 'downloaded' };
  },

  async signOut() {
    if (Auth.client) await Auth.client.auth.signOut();
    Auth.session = null;
    DB.setChangeListener(null);
  },
};
